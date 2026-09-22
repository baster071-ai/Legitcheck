// Brand Guides & Legit Check Knowledge Base
window.GuideData = (function() {
    const brands = [
        {
            id: 'nike-jordan',
            category: 'sneakers',
            name: 'Nike & Air Jordan',
            subtitle: 'Air Jordan 1/4, Dunk Low, Air Max, Tech Fleece',
            icon: 'fa-solid fa-bolt',
            iconColor: 'text-orange-400',
            iconBg: 'bg-orange-500/10',
            rules: [
                {
                    title: 'Kod SKU (Style-Color Code)',
                    desc: 'Sprawdź format: 6 cyfr stylu i 3 cyfry koloru (np. CU1110-010 dla AJ4 Black Cat). Kod na metce języka musi być identyczny z kodem na naklejce pudełka.'
                },
                {
                    title: 'Szew Strobel pod wkładką',
                    desc: 'Wyjmij wkładkę – fabryczny szew łączący cholewkę z podeszwą jest wykonany grubą nicią w równych, regularnych odstępach. W podróbkach szwy są krzywe, rzadkie lub zamaskowane grubą tekturą.'
                },
                {
                    title: 'Geometria bocznej siatki TPU (AJ4)',
                    desc: 'W oryginalnych Air Jordan 4 siatka boczna biegnie pod kątem równoległym do skosu skrzydełek, a nie prostopadle.'
                },
                {
                    title: 'Klej pod wkładką',
                    desc: 'Oryginalne wydania posiadają charakterystyczne, regularne pasy kleju poliuretanowego w kolorze białym lub przezroczystym o lekko chropowatej fakturze.'
                }
            ]
        },
        {
            id: 'stone-island',
            category: 'streetwear',
            name: 'Stone Island & C.P. Company',
            subtitle: 'Badge (naszywka), Certilogo QR, guziki, Art Number',
            icon: 'fa-solid fa-compass',
            iconColor: 'text-emerald-400',
            iconBg: 'bg-emerald-500/10',
            rules: [
                {
                    title: 'Kod Certilogo (od kolekcji SS14)',
                    desc: 'Każdy oryginalny produkt posiada 12-cyfrowy kod Certilogo z kodem QR. Zeskanuj aparatem lub wpisz na certilogo.com – system musi zwrócić jednoznaczny wynik "Authentic".'
                },
                {
                    title: 'Tył naszywki kompasu (Badge drop-stitch)',
                    desc: 'Rewers oryginalnego badge wykonany jest z czarnego, jedwabistego podkładu z precyzyjnym splotem. Otwory na guziki są wykończone wzmocnionym haftem krawędziowym.'
                },
                {
                    title: 'Guziki z 4 symetrycznymi otworami',
                    desc: 'Guziki są matowe z głębokim grawerem "STONE ISLAND" oraz małym krzyżykiem pośrodku. W podróbkach guziki są błyszczące z płytkimi, krzywymi literami.'
                },
                {
                    title: 'Kod ART (Art Number)',
                    desc: 'Pierwsze dwie cyfry oznaczają rok i sezon (np. 77 = AW22, 76 = SS22), kolejne typ odzieży i model. Wszystkie metki wewnętrzne są miękkie i nie drapią skóry.'
                }
            ]
        },
        {
            id: 'supreme',
            category: 'streetwear',
            name: 'Supreme',
            subtitle: 'Box Logo (BOGO), metki karkowe, znak wodny na wash tagu',
            icon: 'fa-solid fa-box',
            iconColor: 'text-rose-400',
            iconBg: 'bg-rose-500/10',
            rules: [
                {
                    title: 'Haft Box Logo (Cross-stitch)',
                    desc: 'Podłoże haftu tworzy unikalny wzór diamentowy/krzyżowy. Litery "Supreme" są matowe i NIE MOGĄ być połączone pojedynczą nitką (brak connecting threads).'
                },
                {
                    title: 'Znak wodny na metce T-shirtu',
                    desc: 'Na odwrocie metki rozmiarowej pod ostrym kątem światła musi być widoczny bardzo subtelny, półprzezroczysty napis "SUPREME". W podróbkach jest on albo zbyt ciemny, albo nie ma go wcale.'
                },
                {
                    title: 'Rozstaw metek karkowych (Hoodie)',
                    desc: 'W bluzach z kapturem czerwona metka główna i mała metka "Made in Canada" są od siebie oddalone o dokładnie 1.5–2 mm i leżą idealnie równolegle.'
                }
            ]
        },
        {
            id: 'trapstar',
            category: 'streetwear',
            name: 'Trapstar London',
            subtitle: 'Decoded Chenille Tracksuit, suwaki z literą T, hafty',
            icon: 'fa-solid fa-skull',
            iconColor: 'text-purple-400',
            iconBg: 'bg-purple-500/10',
            rules: [
                {
                    title: 'Haft Chenille (Bouclé / Pętelkowy)',
                    desc: 'Litery "Trapstar" z frotte muszą być gęste, miękkie i jednolicie przycięte. Podróbki mają twardy, rzadki ścieg przez który widać materiał bluzy.'
                },
                {
                    title: 'Metalowy odlew zamka "T"',
                    desc: 'Suwak posiada ciężki, odlewany uchwyt w kształcie litery T z wyżłobieniem Trapstar. Krawędzie są gładkie, a nie ostre.'
                },
                {
                    title: 'Metka karkowa "It\'s a secret"',
                    desc: 'Wyszywana metka z charakterystycznym sloganem i logo Trapstar. W oryginałach litery są ostre i nie nakładają się na siebie.'
                }
            ]
        },
        {
            id: 'bape',
            category: 'streetwear',
            name: 'A Bathing Ape (BAPE)',
            subtitle: 'Shark Full-Zip Hoodie, Ape Head, Gold Foil Tag',
            icon: 'fa-solid fa-crown',
            iconColor: 'text-amber-400',
            iconBg: 'bg-amber-500/10',
            rules: [
                {
                    title: 'Złota metka (Gold Foil Ape Head)',
                    desc: 'Wewnątrz na metkach ze składem znajduje się mała złota głowa małpy. Ma ona metaliczny, lśniący odcień ze specyficznym mikro-grawerem i drobnymi ząbkami u dołu.'
                },
                {
                    title: 'Metka na mankiecie rękawa',
                    desc: 'Haftowana głowa małpy na lewym rękawie ma idealne proporcje. W podróbkach małpa ma zbyt okrągłą twarz lub krzywy pysk.'
                },
                {
                    title: 'Haft WGM i zęby rekina',
                    desc: 'Litery WGM (World Gone Mad) na kapturze mają filcowe podkłady o grubości ok. 2 mm z precyzyjnym owerlokiem.'
                }
            ]
        },
        {
            id: 'sp5der',
            category: 'streetwear',
            name: 'Sp5der Worldwide (Young Thug)',
            subtitle: '555555 Angel Hoodie, Puff Print, Pajęczyna',
            icon: 'fa-solid fa-spider',
            iconColor: 'text-pink-400',
            iconBg: 'bg-pink-500/10',
            rules: [
                {
                    title: 'Struktura nadruku 3D Puff Print',
                    desc: 'Wypukły nadruk jest matowy, gąbczasty i bardzo sprężysty. Tanie podróbki używają twardego plastizolu z połyskiem, który pęka przy rozciąganiu.'
                },
                {
                    title: 'Dżety i cyrkonie (Rhinestones)',
                    desc: 'Wersje z kryształkami mają dżety mocowane klejem termicznym o wysokiej czystości bez wycieków kleju wokół kryształków.'
                }
            ]
        },
        {
            id: 'yeezy',
            category: 'sneakers',
            name: 'Yeezy (Adidas)',
            subtitle: 'Boost 350 V2, 700 Wave Runner, Slide, Foam Runner',
            icon: 'fa-solid fa-cubes',
            iconColor: 'text-yellow-400',
            iconBg: 'bg-yellow-500/10',
            rules: [
                {
                    title: 'Pianka Boost (Tekstura i kropki)',
                    desc: 'Oryginalna pianka Boost jest miękka, porowata, a pod spodem posiada charakterystyczne wytłoczone trójkąty z 3 lub 4 wypukłymi kropkami.'
                },
                {
                    title: 'Szew centralny (Center Stitch)',
                    desc: 'Szew łączący Primeknit biegnący przez środek buta ma naprzemienny wzór: kwadrat - krzyżyk - kwadrat (tzw. X and Square stitch).'
                },
                {
                    title: 'Metka rozmiarowa (Czcionka "MADE IN VIETNAM/CHINA")',
                    desc: 'Układ cyfr kodu kreskowego i data produkcji są zawsze idealnie wycentrowane. Kod na lewym bucie różni się ostatnimi cyframi od prawego buta.'
                }
            ]
        },
        {
            id: 'luxury',
            category: 'luxury',
            name: 'High-End Luxury (Gucci, LV, Balenciaga)',
            subtitle: 'Skórzane akcesoria, torebki, sneakersy Track/Triple S',
            icon: 'fa-solid fa-gem',
            iconColor: 'text-cyan-400',
            iconBg: 'bg-cyan-500/10',
            rules: [
                {
                    title: 'Wytłaczany numer seryjny (Serial Code)',
                    desc: 'Gucci i Louis Vuitton posiadają grawerowane kody fabryki i tygodnia produkcji (np. 6 cyfr u góry, 6 cyfr u dołu). Czcionka "O" w Gucci jest idealnym okręgiem.'
                },
                {
                    title: 'Waga i grawer okuć (Hardware)',
                    desc: 'Zamki, klamry i łańcuszki są wykonane z pełnego mosiądzu lub stali szlachetnej, a nie lekkiego znalu lub plastiku pokrytego chromem.'
                },
                {
                    title: 'Szwy kaletnicze (Saddle Stitch)',
                    desc: 'Ścieg jest lekko skośny, równoległy i wykonany woskowaną nicią o stałym naprężeniu bez podwójnych przeszyć w losowych miejscach.'
                }
            ]
        },
        {
            id: 'arcteryx',
            category: 'streetwear',
            name: 'Arc\'teryx',
            subtitle: 'Kurtki Beta/Alpha LT, Gore-Tex, haft Archaeopteryx',
            icon: 'fa-solid fa-mountain',
            iconColor: 'text-teal-400',
            iconBg: 'bg-teal-500/10',
            rules: [
                {
                    title: 'Haft ptaka Archaeopteryx',
                    desc: 'Szkielet kopalnego ptaka posiada precyzyjne, cienkie żebra i kości. W podróbkach żebra zlewają się w jedną plamę lub brakuje drobnych palców u skrzydeł.'
                },
                {
                    title: 'Laminowane taśmy szwów Gore-Tex (Seam Tape)',
                    desc: 'Wewnątrz kurtki taśmy uszczelniające mają szerokość zaledwie 8-13 mm i są wgrzane z chirurgiczną precyzją bez bąbli powietrza i nadmiaru kleju.'
                },
                {
                    title: 'Suwaki WaterTight™ z poliuretanem',
                    desc: 'Zamki laminowane wodoszczelnym poliuretanem chodzą z charakterystycznym lekkim oporem i idealnie przylegają do siebie.'
                }
            ]
        }
    ];

    let currentFilter = 'all';

    function renderGuides(filter = 'all', searchQuery = '') {
        currentFilter = filter;
        const container = document.getElementById('guidesListContainer');
        if (!container) return;

        const q = searchQuery.toLowerCase().trim();
        const filtered = brands.filter(b => {
            const matchesFilter = filter === 'all' || b.category === filter;
            const matchesSearch = !q || b.name.toLowerCase().includes(q) || b.subtitle.toLowerCase().includes(q) || b.rules.some(r => r.title.toLowerCase().includes(q) || r.desc.toLowerCase().includes(q));
            return matchesFilter && matchesSearch;
        });

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="glass rounded-xl p-8 text-center text-xs text-slate-400">
                    <i class="fa-solid fa-magnifying-glass text-2xl text-slate-600 mb-2 block"></i>
                    Nie znaleziono poradnika dla frazy "${searchQuery}".
                </div>
            `;
            return;
        }

        container.innerHTML = filtered.map(b => `
            <div class="glass rounded-2xl p-4 border border-slate-800 space-y-2.5 transition-all">
                <div class="flex items-center justify-between cursor-pointer" onclick="window.GuideData.toggleAccordion('${b.id}')">
                    <div class="flex items-center gap-3">
                        <span class="w-9 h-9 rounded-xl ${b.iconBg} ${b.iconColor} flex items-center justify-center font-bold text-sm">
                            <i class="${b.icon}"></i>
                        </span>
                        <div>
                            <h3 class="font-bold text-sm text-slate-100">${b.name}</h3>
                            <p class="text-[11px] text-slate-400">${b.subtitle}</p>
                        </div>
                    </div>
                    <i id="icon-guide-${b.id}" class="fa-solid fa-chevron-down text-xs text-slate-400 transition-transform duration-200"></i>
                </div>
                <div id="guide-${b.id}" class="hidden pt-3 border-t border-slate-800 text-xs text-slate-300 space-y-3 leading-relaxed">
                    ${b.rules.map((r, i) => `
                        <div class="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                            <span class="text-indigo-400 font-bold block mb-0.5">${i + 1}. ${r.title}</span>
                            <span class="text-slate-300 text-[11px]">${r.desc}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    function toggleAccordion(id) {
        const content = document.getElementById(`guide-${id}`);
        const icon = document.getElementById(`icon-guide-${id}`);
        if (!content) return;

        if (content.classList.contains('hidden')) {
            content.classList.remove('hidden');
            if (icon) icon.classList.add('rotate-180');
        } else {
            content.classList.add('hidden');
            if (icon) icon.classList.remove('rotate-180');
        }
    }

    function filterCategory(cat) {
        document.querySelectorAll('.guide-filter-btn').forEach(btn => {
            if (btn.getAttribute('data-cat') === cat) {
                btn.className = "guide-filter-btn px-3 py-1 rounded-xl text-xs font-semibold bg-indigo-600 text-white transition";
            } else {
                btn.className = "guide-filter-btn px-3 py-1 rounded-xl text-xs font-semibold bg-slate-800 text-slate-400 hover:text-slate-200 transition";
            }
        });
        const searchInput = document.getElementById('guideSearchInput');
        renderGuides(cat, searchInput ? searchInput.value : '');
    }

    function handleSearch(val) {
        renderGuides(currentFilter, val);
    }

    return {
        brands,
        renderGuides,
        toggleAccordion,
        filterCategory,
        handleSearch
    };
})();
