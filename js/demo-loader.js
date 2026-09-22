// Demo Report Loader Module
window.DemoLoader = (function() {
    async function loadDemo(demoId = 'jordan4') {
        const loadingState = document.getElementById('loadingState');
        const emptyState = document.getElementById('emptyState');
        const resultsDashboard = document.getElementById('resultsDashboard');

        if (emptyState) emptyState.classList.add('hidden');
        if (resultsDashboard) resultsDashboard.classList.add('hidden');
        if (loadingState) {
            loadingState.classList.remove('hidden');
            const stepText = document.getElementById('loadingStepText');
            if (stepText) stepText.innerText = "Pobieranie wzorcowego raportu referencyjnego (Demo)...";
        }

        try {
            const resp = await fetch(`/api/demo-report/${demoId}`);
            if (!resp.ok) throw new Error("Błąd pobierania raportu demo");
            const data = await resp.json();

            // Set category and inputs appropriately
            if (demoId === 'stone-island') {
                if (window.setCategory) window.setCategory('apparel');
                const brandInput = document.getElementById('inputBrand');
                const modelInput = document.getElementById('inputModel');
                const skuInput = document.getElementById('inputSKU');
                if (brandInput) brandInput.value = data.brand;
                if (modelInput) modelInput.value = data.model;
                if (skuInput) skuInput.value = data.sku;
            } else {
                if (window.setCategory) window.setCategory('shoes');
                const brandInput = document.getElementById('inputBrand');
                const modelInput = document.getElementById('inputModel');
                const skuInput = document.getElementById('inputSKU');
                if (brandInput) brandInput.value = data.brand;
                if (modelInput) modelInput.value = data.model;
                if (skuInput) skuInput.value = data.sku;
            }

            if (loadingState) loadingState.classList.add('hidden');

            const certId = window.CertificateEngine ? window.CertificateEngine.generateCertId() : 'LC-DEMO-001';
            if (window.renderFullDashboard) {
                window.renderFullDashboard(data, [], certId);
            }

            if (window.showNotification) {
                window.showNotification(`Załadowano przykładowy raport: ${data.brand} ${data.model}`);
            }
        } catch (e) {
            console.error("Błąd ładowania demo:", e);
            if (loadingState) loadingState.classList.add('hidden');
            if (emptyState) emptyState.classList.remove('hidden');
            if (window.showNotification) {
                window.showNotification("Nie udało się załadować raportu demo.", true);
            }
        }
    }

    return {
        loadDemo
    };
})();
