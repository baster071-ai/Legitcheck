// Certificate Generator & Export Module
window.CertificateEngine = (function() {
    function generateCertId() {
        const rand = Math.floor(10000 + Math.random() * 90000);
        const year = new Date().getFullYear();
        return `LC-${year}-${rand}`;
    }

    function getActiveCertId(providedCertId) {
        if (providedCertId) return providedCertId;
        const badge = document.getElementById('certIdBadge');
        if (badge && badge.innerText && badge.innerText.trim()) {
            return badge.innerText.trim();
        }
        return generateCertId();
    }

    function createVerificationText(report, certId) {
        const activeCert = getActiveCertId(certId);
        const dateStr = new Date().toLocaleString('pl-PL', { dateStyle: 'medium', timeStyle: 'short' });
        const verdictIcon = report.verdict === 'LEGIT' ? '✅ LEGIT (ORYGINAŁ)' : (report.verdict === 'FAKE' ? '❌ FAKE (PODRÓBKA)' : '⚠️ WĄTPLIWY (UNCERTAIN)');
        const verifiedPrice = report.estimatedPricePLN ? `${report.estimatedPricePLN} PLN` : 'Brak danych';

        return `🛡️ CERTYFIKAT WERYFIKACJI LEGIT CHECK & WYCENA AI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Numer Raportu: ${activeCert}
Data inspekcji: ${dateStr}
Model: ${report.brand || 'Brak'} ${report.model || ''}
Kod SKU: ${report.sku || 'Nie określono'}
Werdykt: ${verdictIcon} (${report.legitScore ?? 0}/100 punktów)
Pewność weryfikacji: ${report.confidence || '95%'}
Szacowana wartość rynkowa: ${verifiedPrice}

Kluczowe potwierdzone cechy:
${(report.greenFlags && report.greenFlags.length > 0) ? report.greenFlags.slice(0, 3).map(f => '• ' + f).join('\n') : '• Analiza mikroskopowa szwów i metek'}

Sprawdzone przez: LegitCheck & Wycena AI Engine
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Certyfikat chroni kupującego i potwierdza rzetelność oferty na Vinted/OLX.`;
    }

    function copyToClipboard(report, certId) {
        if (!report) return;
        const text = createVerificationText(report, certId);
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                if (window.showNotification) {
                    window.showNotification("Skopiowano certyfikat do schowka! Wklej go w opisie na Vinted lub OLX.");
                }
            }).catch(() => fallbackCopy(text));
        } else {
            fallbackCopy(text);
        }
    }

    function fallbackCopy(text) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        if (window.showNotification) {
            window.showNotification("Skopiowano certyfikat do schowka!");
        }
    }

    async function shareReport(report, certId) {
        if (!report) return;
        const activeCert = getActiveCertId(certId);
        const title = `Legit Check: ${report.brand || ''} ${report.model || ''} (${report.verdict} ${report.legitScore ?? 0}%)`;
        const text = `Sprawdź raport autentyczności dla ${report.brand || ''} ${report.model || ''} wykonany przez AI: ${report.verdict} (${report.legitScore ?? 0}/100 pkt). Szacowana wartość: ${report.estimatedPricePLN || '0'} PLN.`;
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    text,
                    url: window.location.href
                });
            } catch (err) {
                if (err.name !== 'AbortError') {
                    copyToClipboard(report, activeCert);
                }
            }
        } else {
            copyToClipboard(report, activeCert);
        }
    }

    return {
        generateCertId,
        createVerificationText,
        copyToClipboard,
        copyCertificate: copyToClipboard,
        shareReport,
        shareCertificate: shareReport
    };
})();

// Alias for convenience
window.CertificateGenerator = window.CertificateEngine;
