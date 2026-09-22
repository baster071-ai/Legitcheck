// History Manager Module (Storage, Search, Export/Import)
window.HistoryManager = (function() {
    const STORAGE_KEY = 'lc_verification_history';

    function getHistory() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error("Błąd odczytu historii:", e);
            return [];
        }
    }

    function saveHistory(list) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
            updateBadge();
        } catch (e) {
            console.error("Błąd zapisu historii:", e);
        }
    }

    function addRecord(record) {
        const list = getHistory();
        list.unshift(record);
        // keep max 50 records
        if (list.length > 50) list.pop();
        saveHistory(list);
        updateBadge();
    }

    function saveToHistory(result, extra = {}) {
        if (!result) return;
        const currentCert = document.getElementById('certIdBadge')?.innerText || 
            (window.CertificateEngine ? window.CertificateEngine.generateCertId() : 'LC-' + Date.now());
        
        let categoryName = 'Sneakersy / Streetwear';
        if (typeof currentCategory !== 'undefined' && typeof categoryConfig !== 'undefined' && categoryConfig[currentCategory]) {
            categoryName = categoryConfig[currentCategory].name;
        }

        let images = [];
        if (typeof uploadedImages !== 'undefined' && Array.isArray(uploadedImages) && uploadedImages.length > 0) {
            images = [{ base64: uploadedImages[0].base64 }];
        } else if (extra.images) {
            images = extra.images;
        }

        const record = {
            id: Date.now(),
            date: new Date().toLocaleString('pl-PL', { dateStyle: 'short', timeStyle: 'short' }),
            categoryName: extra.categoryName || categoryName,
            brand: result.brand || extra.brand || '',
            model: result.model || extra.model || '',
            sku: result.sku || extra.sku || '',
            certId: currentCert,
            images: images,
            result: result
        };

        addRecord(record);
        renderHistory();
    }

    function deleteItem(idOrIndex) {
        const list = getHistory();
        let updated;
        if (typeof idOrIndex === 'number' && idOrIndex > 1000000) {
            updated = list.filter(item => item.id !== idOrIndex);
        } else {
            const idx = typeof idOrIndex === 'number' ? idOrIndex : list.findIndex(i => String(i.id) === String(idOrIndex));
            if (idx >= 0) {
                list.splice(idx, 1);
                updated = list;
            } else {
                updated = list.filter(item => String(item.id) !== String(idOrIndex));
            }
        }
        saveHistory(updated);
        renderHistory();
        if (window.showNotification) window.showNotification("Usunięto raport z historii.");
    }

    function clearHistory() {
        if (!confirm("Czy na pewno chcesz wyczyścić całą historię weryfikacji?")) return;
        localStorage.removeItem(STORAGE_KEY);
        updateBadge();
        renderHistory();
        if (window.showNotification) window.showNotification("Wyczyszczono historię.");
    }

    function loadItem(idOrIndex) {
        const list = getHistory();
        let record = null;
        if (typeof idOrIndex === 'number' && idOrIndex > 1000000) {
            record = list.find(item => item.id === idOrIndex);
        } else {
            record = list.find(item => String(item.id) === String(idOrIndex)) || list[idOrIndex];
        }
        if (!record || !record.result) return;

        if (window.renderFullDashboard) {
            window.renderFullDashboard(record.result, record.images || [], record.certId);
        } else if (typeof displayResults === 'function') {
            window.lastAnalysisResult = record.result;
            const certBadge = document.getElementById('certIdBadge');
            if (certBadge && record.certId) certBadge.innerText = record.certId;
            displayResults(record.result);
            const emptyState = document.getElementById('emptyState');
            if (emptyState) emptyState.classList.add('hidden');
        }
        if (typeof switchTab === 'function') switchTab('check');
        if (window.showNotification) {
            window.showNotification(`Załadowano raport: ${record.result.brand || ''} ${record.result.model || ''}`);
        }
    }

    function exportToJson() {
        const list = getHistory();
        if (list.length === 0) {
            if (window.showNotification) window.showNotification("Brak wpisów w historii do wyeksportowania.", true);
            return;
        }

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(list, null, 2));
        const dlAnchorElem = document.createElement('a');
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download", `legitcheck-historia-${new Date().toISOString().slice(0, 10)}.json`);
        dlAnchorElem.click();
        if (window.showNotification) window.showNotification("Pobrano plik kopii zapasowej JSON.");
    }

    function importFromJson(file) {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const imported = JSON.parse(e.target.result);
                if (Array.isArray(imported)) {
                    saveHistory(imported);
                    renderHistory();
                    if (window.showNotification) window.showNotification(`Pomyślnie zaimportowano ${imported.length} raportów!`);
                } else {
                    throw new Error("Niepoprawny format pliku");
                }
            } catch (err) {
                if (window.showNotification) window.showNotification("Błąd parsowania pliku JSON.", true);
            }
        };
        reader.readAsText(file);
    }

    let activeFilter = 'all';

    function renderHistory(filter = activeFilter, query = '') {
        activeFilter = filter;
        const container = document.getElementById('historyListContainer');
        if (!container) return;

        const list = getHistory();
        const statTotal = document.getElementById('statTotal');
        const statLegit = document.getElementById('statLegit');
        const statFake = document.getElementById('statFake');

        if (statTotal) statTotal.innerText = list.length;
        if (statLegit) statLegit.innerText = list.filter(i => i.result && i.result.verdict === 'LEGIT').length;
        if (statFake) statFake.innerText = list.filter(i => i.result && i.result.verdict === 'FAKE').length;

        const q = query.toLowerCase().trim();
        const filtered = list.filter(item => {
            const verdict = item.result ? item.result.verdict : 'UNKNOWN';
            const matchesFilter = filter === 'all' || (filter === 'legit' && verdict === 'LEGIT') || (filter === 'fake' && verdict === 'FAKE') || (filter === 'uncertain' && verdict === 'UNCERTAIN');
            const searchTarget = `${item.categoryName || ''} ${item.brand || ''} ${item.model || ''} ${item.sku || ''} ${item.result?.brand || ''} ${item.result?.model || ''} ${item.result?.sku || ''}`.toLowerCase();
            const matchesSearch = !q || searchTarget.includes(q);
            return matchesFilter && matchesSearch;
        });

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="glass rounded-2xl p-8 border border-slate-800 text-center flex flex-col items-center justify-center">
                    <div class="w-12 h-12 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center text-xl mb-2">
                        <i class="fa-solid fa-folder-open"></i>
                    </div>
                    <p class="text-xs text-slate-400">Brak raportów spełniających kryteria.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filtered.map(item => {
            const res = item.result || {};
            const isLegit = res.verdict === 'LEGIT';
            const isFake = res.verdict === 'FAKE';
            const badgeClass = isLegit 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                : (isFake ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30');

            const thumb = item.images && item.images[0] ? item.images[0].base64 : '';

            return `
                <div class="glass rounded-2xl p-3.5 sm:p-4 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between gap-3 shadow-lg">
                    <div class="flex items-center space-x-3 overflow-hidden cursor-pointer flex-1" onclick="window.HistoryManager.loadItem(${item.id})">
                        <div class="w-14 h-14 rounded-xl bg-slate-900 border border-slate-700 flex-shrink-0 overflow-hidden flex items-center justify-center">
                            ${thumb ? `<img src="${thumb}" class="w-full h-full object-cover">` : `<i class="fa-solid fa-image text-slate-600"></i>`}
                        </div>
                        <div class="overflow-hidden">
                            <div class="flex items-center gap-1.5 mb-1">
                                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeClass}">
                                    ${res.verdict || 'WYNIK'} (${res.legitScore ?? 0}%)
                                </span>
                                <span class="text-[10px] text-slate-500">${item.date || ''}</span>
                            </div>
                            <h4 class="font-bold text-xs text-slate-200 truncate">${res.brand || item.brand || 'Brak marki'} - ${res.model || item.model || 'Model'}</h4>
                            <p class="text-[10px] text-slate-400">Wycena: <span class="text-emerald-400 font-semibold">${res.estimatedPricePLN ? res.estimatedPricePLN + ' PLN' : 'Brak'}</span></p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-1.5 flex-shrink-0">
                        <button onclick="window.HistoryManager.loadItem(${item.id})" title="Otwórz raport" class="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white transition text-xs">
                            <i class="fa-solid fa-arrow-up-right-from-square"></i>
                        </button>
                        <button onclick="window.HistoryManager.deleteItem(${item.id})" title="Usuń" class="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition text-xs">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    function updateBadge() {
        const list = getHistory();
        const badge = document.getElementById('historyCountBadge');
        if (badge) {
            badge.innerText = list.length;
            badge.classList.toggle('hidden', list.length === 0);
        }
    }

    return {
        getHistory,
        saveToHistory,
        addRecord,
        deleteItem,
        deleteRecord: deleteItem,
        clearHistory,
        clearAll: clearHistory,
        loadItem,
        loadIntoDashboard: loadItem,
        exportToJson,
        importFromJson,
        renderHistory,
        updateBadge,
        activeFilter
    };
})();
