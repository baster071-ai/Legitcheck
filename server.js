import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.static(__dirname));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Candidate models in priority order:
// gemini-3.1-flash-lite has high quota availability and fast response
const MODELS_TO_TRY = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];

app.post('/api/analyze', async (req, res) => {
  try {
    const { categoryName, brand, model, sku, size, condition, images } = req.body;

    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ error: 'Brak zdjęć do analizy. Wgraj przynajmniej jedno zdjęcie przedmiotu.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Brak skonfigurowanego klucza API Gemini (GEMINI_API_KEY).' });
    }

    const promptText = `Jesteś elitarnym rzeczoznawcą i weryfikatorem autentyczności (Legit Check) oraz ekspertem wyceny rynkowej dla kategorii: ${categoryName || 'Ogólna'}.
Twoim zadaniem jest bezwzględnie rzetelna ocena autentyczności przedmiotu na podstawie dostarczonych zdjęć i szczegółów.

Kontekst podany przez użytkownika:
- Kategoria: ${categoryName || 'Nie podano'}
- Podana marka: ${brand || 'Nie podano'}
- Podany model: ${model || 'Nie podano'}
- Podany SKU / Kod artykułu: ${sku || 'Nie podano'}
- Podany rozmiar: ${size || 'Nie podano'}
- Deklarowany stan: ${condition ? condition + '/10' : 'Nie podano'}

Dokonaj szczegółowej analizy mikroskopowej i makroskopowej:
1. Przeanalizuj czcionki (font weight, kerning, wyrównanie na metkach karkowych, rozmiarowych i wash tagach).
2. Jakość szwów: gęstość ściegu, podwójne szwy, ewentualne luźne nitki typowe dla podróbek.
3. Kody kreskowe, numery seryjne, zgodność formatu SKU danej marki (np. 6 cyfr + 3 cyfry dla Nike).
4. Fakturę, strukturę materiału, barwienie, jakość wykończeń (zamki YKK/Riri, klamry, grawery).
5. Oszacuj realną wartość rynkową w polskich złotych (PLN) na podstawie aktualnych cen na rynku wtórnym (Vinted, Grailed, StockX, OLX) uwzględniając stan ${condition || 8}/10.

Zwróć ocenę w skali 0-100 (legitScore), werdykt (LEGIT dla 80-100, UNCERTAIN dla 50-79, FAKE dla 0-49), wyczerpujące uzasadnienie oraz tablice zielonych i czerwonych flag. Wszystkie opisy muszą być w języku polskim.`;

    const parts = [{ text: promptText }];

    for (const img of images) {
      if (!img.base64) continue;
      const match = img.base64.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        parts.push({
          inlineData: {
            mimeType: match[1],
            data: match[2],
          },
        });
      }
    }

    if (parts.length === 1) {
      return res.status(400).json({ error: 'Brak poprawnych danych graficznych w żądaniu.' });
    }

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        brand: { type: Type.STRING, description: 'Rozpoznana marka (np. Nike, Stone Island)' },
        model: { type: Type.STRING, description: 'Rozpoznany model lub nazwa przedmiotu' },
        sku: { type: Type.STRING, description: 'Rozpoznany kod SKU lub brak' },
        fabric: { type: Type.STRING, description: 'Rozpoznany materiał / jakość wykonania' },
        legitScore: { type: Type.INTEGER, description: 'Wynik autentyczności 0-100' },
        verdict: { type: Type.STRING, description: 'EXACTLY one of: LEGIT, FAKE, or UNCERTAIN' },
        confidence: { type: Type.STRING, description: 'Poziom pewności oceny (np. Wysoka 95%, Bardzo wysoka 98%)' },
        summary: { type: Type.STRING, description: 'Zwięzłe i merytoryczne podsumowanie werdyktu po polsku' },
        greenFlags: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Pozytywne cechy potwierdzające autentyczność' },
        redFlags: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Podejrzane elementy lub wady wskazujące na podróbkę' },
        inspectedAreas: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: 'Nazwa badanego elementu (np. Szwy, Metka, Logo)' },
              status: { type: Type.STRING, description: 'pass, fail, lub warning' },
              notes: { type: Type.STRING, description: 'Szczegółowa uwaga po polsku' }
            },
            required: ['name', 'status', 'notes']
          }
        },
        estimatedPricePLN: { type: Type.INTEGER, description: 'Szacowana średnia cena rynkowa w PLN' },
        minPricePLN: { type: Type.INTEGER, description: 'Minimalna cena w PLN' },
        maxPricePLN: { type: Type.INTEGER, description: 'Maksymalna cena w PLN' },
        buyerAdvice: { type: Type.STRING, description: 'Praktyczna porada dla kupującego lub sprzedającego po polsku' }
      },
      required: [
        'brand',
        'model',
        'sku',
        'fabric',
        'legitScore',
        'verdict',
        'confidence',
        'summary',
        'greenFlags',
        'redFlags',
        'inspectedAreas',
        'estimatedPricePLN',
        'minPricePLN',
        'maxPricePLN',
        'buyerAdvice',
      ],
    };

    let lastError = null;
    let responseText = null;

    for (const modelName of MODELS_TO_TRY) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: { parts },
          config: {
            responseMimeType: 'application/json',
            responseSchema,
            temperature: 0.2,
          },
        });

        if (response && response.text) {
          responseText = response.text;
          break;
        }
      } catch (err) {
        console.warn(`Model ${modelName} zgłosił błąd:`, err.message || err);
        lastError = err;
        // Continue to try fallback model
      }
    }

    if (!responseText) {
      throw lastError || new Error('Brak odpowiedzi z modeli Gemini AI.');
    }

    const result = JSON.parse(responseText);
    res.json(result);
  } catch (error) {
    console.error('Błąd podczas analizy LegitCheck:', error);
    const msg = error.message || 'Wystąpił błąd podczas analizy AI';
    if (msg.includes('quota') || msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) {
      return res.status(429).json({
        error: 'Przekroczono limit zapytań do API Gemini. Odczekaj chwilę i spróbuj ponownie.'
      });
    }
    res.status(500).json({ error: msg });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'LegitCheck & Wycena AI' });
});

// Demo reports for quick testing and demonstration
app.get('/api/demo-report/:id?', (req, res) => {
  const id = req.params.id || 'jordan4';
  if (id === 'stone-island') {
    return res.json({
      brand: 'Stone Island',
      model: 'Garment Dyed Crinkle Reps NY Down / Badge Hoodie',
      sku: '771564120',
      fabric: 'Bawełna szczotkowana 100% z apreturą Garment Dyed',
      legitScore: 94,
      verdict: 'LEGIT',
      confidence: 'Bardzo wysoka (97%)',
      summary: 'Przedmiot wykazuje wszystkie cechy oryginalnego produktu Stone Island. Kod Certilogo pomyślnie zwalidowany w bazie producenta. Naszywka (Badge) posiada prawidłowy splot krzyżowy drop-stitch na rewersie oraz matowe, grawerowane guziki z symetrycznymi otworami.',
      greenFlags: [
        'Aktywny i zweryfikowany kod Certilogo QR (komunikat Authentic)',
        'Perfekcyjny splot drop-stitch na czarnym podkładzie naszywki kompasu',
        'Guziki matowe z głębokim grawerem Stone Island i 4 symetrycznymi dziurkami',
        'Zamek główny marki YKK z dedykowanym odlewem i logo wiaty',
        'Metka wewnętrzna (wash tag) z mikrodrukiem i prawidłowym kodem ART'
      ],
      redFlags: [],
      inspectedAreas: [
        { name: 'Naszywka kompas (Badge)', status: 'pass', notes: 'Prawidłowa grubość nici, precyzyjne litery, tył na czarnym jedwabistym splocie bez plątania nici.' },
        { name: 'Kod Certilogo & Metki', status: 'pass', notes: 'Kod QR czysty, numer zgodny z rokiem kolekcji AW22/23.' },
        { name: 'Guziki i mocowania', status: 'pass', notes: 'Guziki matowe, prawidłowo przyszyte nicią krzyżową, brak połysku taniego plastiku.' },
        { name: 'Szwy i ściągacze', status: 'pass', notes: 'Elastyczne ściągacze o właściwej gramaturze, podwójne szwy overlock na ramionach.' }
      ],
      estimatedPricePLN: 1350,
      minPricePLN: 1100,
      maxPricePLN: 1600,
      buyerAdvice: 'Cena rynkowa jest stabilna. Przy zakupie na Vinted lub Grailed zawsze poproś o zdjęcie kodu Certilogo pod kątem prostym, aby upewnić się, że nie jest to nadruk ze skradzionego zdjęcia.'
    });
  }

  // Default: Air Jordan 4 Black Cat
  return res.json({
    brand: 'Jordan / Nike',
    model: 'Air Jordan 4 Retro "Black Cat" (2020)',
    sku: 'CU1110-010',
    fabric: 'Wysokogatunkowy czarny nubuk, siatka TPU, podeszwa poliuretanowa z poduszką Air',
    legitScore: 96,
    verdict: 'LEGIT',
    confidence: 'Bardzo wysoka (98%)',
    summary: 'Para wykazuje wszystkie cechy fabrycznego wydania Nike/Jordan z 2020 roku. Wytłoczenie nubuku, kształt skrzydełek (wings), kąt siatki na języku i boku oraz charakterystyczny ścieg Strobel pod wkładką są w 100% zgodne ze standardami autentyczności.',
    greenFlags: [
      'Prawidłowy kąt ułożenia bocznej siatki TPU (równoległy do linii szwów)',
      'Wzorcowy szew Strobel pod wkładką: gęsty ścieg nylonowy bez luźnych pętli',
      'Matowy, wysokiej próby nubuk o krótkim włosiu ze zjawiskiem delikatnego cieniowania',
      'Metka na języku z poprawną czcionką Flight i dokładnym haftem Jumpman',
      'Kod UPC i daty produkcji na metce wewnętrznej w 100% zgodne z bazą SKU CU1110-010'
    ],
    redFlags: [],
    inspectedAreas: [
      { name: 'Szew Strobel & Podstawa wkładki', status: 'pass', notes: 'Ścieg maszynowy równomierny, regularne pasy kleju poliuretanowego pod wyjętą wkładką.' },
      { name: 'Metka rozmiarowa (Size Tag)', status: 'pass', notes: 'Grubość cyfr daty produkcji, idealne odstępy kodu kreskowego, brak rozlanego tuszu.' },
      { name: 'Kształt klatki TPU i skrzydełek', status: 'pass', notes: 'Otwory na sznurowadła czyste, skrzydełka o odpowiedniej elastyczności, matowe wykończenie.' },
      { name: 'Zapiętek i logo Jumpman na pięcie', status: 'pass', notes: 'Wypukłe czarne logo Jumpman o ostrych krawędziach, 9 kropek na pasku zapiętka.' }
    ],
    estimatedPricePLN: 2200,
    minPricePLN: 1850,
    maxPricePLN: 2600,
    buyerAdvice: 'Air Jordan 4 Black Cat to jeden z najczęściej podrabianych modeli na rynku (zwłaszcza partie GX/LJR z Chin). Ta para posiada oryginalną fakturę nubuku i prawidłową geometrię toe-boxa. Warto zachować certyfikat autentyczności przy ewentualnej odsprzedaży.'
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serwer LegitCheck działa na http://0.0.0.0:${PORT}`);
});
