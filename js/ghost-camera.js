// Ghost Camera & Alignment Assistant for Legit Check
window.GhostCamera = (function() {
    let currentTemplate = 'sneaker-side';
    let currentOpacity = 0.6;
    let isGridActive = false;
    let isTorchOn = false;
    let currentFacingMode = 'environment';
    let activeStream = null;

    // SVG Outlines for various item types and details
    const templates = {
        'sneaker-side': {
            name: '👟 But (Profil)',
            svg: `
            <svg viewBox="0 0 400 250" class="w-full h-full stroke-indigo-400 fill-none" stroke-width="2.5" stroke-dasharray="6 4">
                <!-- Shoe silhouette -->
                <path d="M 40 190 Q 70 190 120 185 Q 220 185 340 195 Q 365 195 365 175 Q 365 130 320 80 Q 285 75 260 95 L 210 110 L 150 145 Q 80 150 45 170 Z" />
                <!-- Sole line -->
                <path d="M 35 195 L 365 195 L 360 215 Q 250 215 150 210 Q 70 210 35 200 Z" stroke-dasharray="none" stroke-width="2" />
                <!-- Ankle collar & tongue -->
                <path d="M 285 75 Q 310 50 330 75 Q 330 110 325 140" />
                <!-- Detail highlight target -->
                <circle cx="200" cy="150" r="18" stroke="#34d399" stroke-width="2" stroke-dasharray="none" />
                <text x="200" y="240" text-anchor="middle" fill="#818cf8" font-size="12" font-family="sans-serif">Dopasuj profil buta do obrysu</text>
            </svg>`
        },
        'sneaker-sole': {
            name: '👣 Podeszwa',
            svg: `
            <svg viewBox="0 0 250 400" class="w-full h-full stroke-indigo-400 fill-none" stroke-width="2.5" stroke-dasharray="6 4">
                <!-- Outsole silhouette -->
                <path d="M 70 30 Q 125 15 180 30 Q 210 70 210 150 Q 200 220 170 260 Q 185 320 185 360 Q 125 385 65 360 Q 65 320 80 260 Q 50 220 40 150 Q 40 70 70 30 Z" />
                <!-- Pivot point circle -->
                <circle cx="100" cy="110" r="24" stroke="#34d399" stroke-width="2" />
                <circle cx="100" cy="110" r="12" stroke="#34d399" stroke-width="1.5" />
                <text x="125" y="390" text-anchor="middle" fill="#818cf8" font-size="12" font-family="sans-serif">Wycentruj bieżnik podeszwy</text>
            </svg>`
        },
        'wash-tag': {
            name: '🏷️ Metka / Wash Tag',
            svg: `
            <svg viewBox="0 0 300 360" class="w-full h-full stroke-indigo-400 fill-none" stroke-width="2.5" stroke-dasharray="6 4">
                <!-- Rectangular Tag Outline -->
                <rect x="50" y="30" width="200" height="290" rx="16" />
                <!-- Simulated text rows for alignment -->
                <line x1="75" y1="65" x2="225" y2="65" stroke-width="3" stroke="#818cf8" stroke-dasharray="none" />
                <line x1="75" y1="95" x2="180" y2="95" stroke-width="2" />
                <line x1="75" y1="125" x2="225" y2="125" stroke-width="2" />
                <line x1="75" y1="150" x2="200" y2="150" stroke-width="1.5" />
                <!-- QR / Certilogo target box -->
                <rect x="105" y="185" width="90" height="90" rx="8" stroke="#34d399" stroke-width="2" stroke-dasharray="none" />
                <text x="150" y="235" text-anchor="middle" fill="#34d399" font-size="11" font-family="sans-serif">QR / KOD</text>
                <text x="150" y="340" text-anchor="middle" fill="#818cf8" font-size="12" font-family="sans-serif">Wypełnij kadr metką pionowo</text>
            </svg>`
        },
        'strobel': {
            name: '🧵 Szew Strobel (Makro)',
            svg: `
            <svg viewBox="0 0 300 300" class="w-full h-full stroke-indigo-400 fill-none" stroke-width="2.5">
                <!-- Macro Magnifying circle -->
                <circle cx="150" cy="150" r="110" stroke="#818cf8" stroke-dasharray="8 6" />
                <circle cx="150" cy="150" r="60" stroke="#34d399" stroke-width="2" />
                <!-- Crosshairs -->
                <line x1="150" y1="20" x2="150" y2="280" stroke="rgba(255,255,255,0.2)" stroke-dasharray="4 4" />
                <line x1="20" y1="150" x2="280" y2="150" stroke="rgba(255,255,255,0.2)" stroke-dasharray="4 4" />
                <!-- Simulated stitch pattern guide -->
                <path d="M 60 170 Q 150 130 240 170" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4 4" />
                <text x="150" y="275" text-anchor="middle" fill="#38bdf8" font-size="12" font-family="sans-serif">Zbliżenie makro na gęstość szwów</text>
            </svg>`
        },
        'hoodie-chest': {
            name: '👕 Odzież / Box Logo',
            svg: `
            <svg viewBox="0 0 360 300" class="w-full h-full stroke-indigo-400 fill-none" stroke-width="2.5" stroke-dasharray="6 4">
                <!-- Torso neckline & shoulders -->
                <path d="M 40 280 L 70 120 L 130 70 Q 180 110 230 70 L 290 120 L 320 280" />
                <!-- Collar -->
                <path d="M 130 70 Q 180 115 230 70" stroke-width="2" />
                <!-- Box Logo / Chest print target -->
                <rect x="110" y="140" width="140" height="55" rx="6" stroke="#f43f5e" stroke-width="2" stroke-dasharray="none" />
                <text x="180" y="172" text-anchor="middle" fill="#f43f5e" font-size="11" font-family="sans-serif">LOGO / GRAFIKA</text>
                <text x="180" y="260" text-anchor="middle" fill="#818cf8" font-size="12" font-family="sans-serif">Wycentruj klatkę piersiową i logo</text>
            </svg>`
        },
        'cap-front': {
            name: '🧢 Czapka (Przód)',
            svg: `
            <svg viewBox="0 0 320 280" class="w-full h-full stroke-indigo-400 fill-none" stroke-width="2.5" stroke-dasharray="6 4">
                <!-- Cap Crown -->
                <path d="M 60 190 Q 60 70 160 55 Q 260 70 260 190 Z" />
                <!-- Visor curve -->
                <path d="M 40 195 Q 160 245 280 195 Q 240 180 160 185 Q 80 180 40 195 Z" stroke-width="2" stroke-dasharray="none" />
                <!-- Front logo zone -->
                <circle cx="160" cy="130" r="35" stroke="#34d399" stroke-width="2" />
                <text x="160" y="270" text-anchor="middle" fill="#818cf8" font-size="12" font-family="sans-serif">Wycentruj koronę i haft czapki</text>
            </svg>`
        },
        'barcode': {
            name: '🔳 Kod Kreskowy / Pudełko',
            svg: `
            <svg viewBox="0 0 320 240" class="w-full h-full stroke-indigo-400 fill-none" stroke-width="2.5">
                <!-- Barcode frame box -->
                <rect x="40" y="40" width="240" height="150" rx="12" stroke="#38bdf8" stroke-dasharray="8 6" />
                <!-- Laser line -->
                <line x1="50" y1="115" x2="270" y2="115" stroke="#f43f5e" stroke-width="2.5" />
                <!-- Corner markers -->
                <path d="M 40 65 L 40 40 L 65 40" stroke="#34d399" stroke-width="3" stroke-dasharray="none" />
                <path d="M 280 65 L 280 40 L 255 40" stroke="#34d399" stroke-width="3" stroke-dasharray="none" />
                <path d="M 40 165 L 40 190 L 65 190" stroke="#34d399" stroke-width="3" stroke-dasharray="none" />
                <path d="M 280 165 L 280 190 L 255 190" stroke="#34d399" stroke-width="3" stroke-dasharray="none" />
                <text x="160" y="220" text-anchor="middle" fill="#38bdf8" font-size="12" font-family="sans-serif">Nakieruj czerwoną linię na kod kreskowy</text>
            </svg>`
        }
    };

    function renderTemplate(name) {
        if (!templates[name]) name = 'sneaker-side';
        currentTemplate = name;
        const container = document.getElementById('ghostOverlayContainer');
        if (!container) return;

        if (currentOpacity === 0) {
            container.innerHTML = '';
            container.style.opacity = '0';
            return;
        }

        container.style.opacity = currentOpacity.toString();
        container.innerHTML = templates[name].svg;

        // Update active template button style
        document.querySelectorAll('.ghost-tpl-btn').forEach(btn => {
            const tpl = btn.getAttribute('data-tpl');
            if (tpl === name) {
                btn.className = 'ghost-tpl-btn px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-indigo-600 text-white transition flex-shrink-0';
            } else {
                btn.className = 'ghost-tpl-btn px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 transition flex-shrink-0';
            }
        });
    }

    function setOpacity(val) {
        currentOpacity = val;
        const container = document.getElementById('ghostOverlayContainer');
        if (container) {
            container.style.opacity = val.toString();
            if (val === 0) {
                container.innerHTML = '';
            } else if (templates[currentTemplate]) {
                container.innerHTML = templates[currentTemplate].svg;
            }
        }
        // Update opacity buttons
        document.querySelectorAll('.ghost-opacity-btn').forEach(btn => {
            const op = parseFloat(btn.getAttribute('data-opacity'));
            if (op === val) {
                btn.className = 'ghost-opacity-btn px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-600 text-white';
            } else {
                btn.className = 'ghost-opacity-btn px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400 hover:text-white';
            }
        });
    }

    function toggleGrid() {
        isGridActive = !isGridActive;
        const gridEl = document.getElementById('cameraGrid');
        const gridBtn = document.getElementById('gridToggleBtn');
        if (gridEl) {
            gridEl.classList.toggle('hidden', !isGridActive);
        }
        if (gridBtn) {
            if (isGridActive) {
                gridBtn.classList.add('bg-indigo-600', 'text-white');
                gridBtn.classList.remove('bg-slate-800', 'text-slate-400');
            } else {
                gridBtn.classList.remove('bg-indigo-600', 'text-white');
                gridBtn.classList.add('bg-slate-800', 'text-slate-400');
            }
        }
    }

    async function toggleTorch() {
        if (!activeStream) return;
        const track = activeStream.getVideoTracks()[0];
        if (!track) return;

        try {
            const capabilities = track.getCapabilities ? track.getCapabilities() : {};
            if (!capabilities.torch) {
                if (window.showNotification) window.showNotification("Lampa błyskowa niedostępna w tej przeglądarce", true);
                return;
            }

            isTorchOn = !isTorchOn;
            await track.applyConstraints({
                advanced: [{ torch: isTorchOn }]
            });

            const torchBtn = document.getElementById('torchToggleBtn');
            if (torchBtn) {
                if (isTorchOn) {
                    torchBtn.classList.add('bg-amber-500', 'text-slate-950');
                    torchBtn.classList.remove('bg-slate-800', 'text-slate-400');
                } else {
                    torchBtn.classList.remove('bg-amber-500', 'text-slate-950');
                    torchBtn.classList.add('bg-slate-800', 'text-slate-400');
                }
            }
        } catch (e) {
            console.warn("Błąd sterowania lampą:", e);
        }
    }

    function stopStream() {
        if (activeStream) {
            try {
                activeStream.getTracks().forEach(track => {
                    try { track.stop(); } catch (e) {}
                });
            } catch (err) {
                console.warn("Błąd zatrzymywania strumienia kamery:", err);
            }
            activeStream = null;
        }
        isTorchOn = false;
        const torchBtn = document.getElementById('torchToggleBtn');
        if (torchBtn) {
            torchBtn.classList.remove('bg-amber-500', 'text-slate-950');
            torchBtn.classList.add('bg-slate-800', 'text-slate-400');
        }
    }

    function toggleFacing() {
        currentFacingMode = currentFacingMode === 'environment' ? 'user' : 'environment';
        if (window.openCameraModal) {
            window.openCameraModal(currentFacingMode);
        }
    }

    function autoSelectForStep(stepId, category) {
        const id = (stepId || '').toLowerCase();
        if (id.includes('box') || id.includes('sku') || id.includes('barcode')) {
            renderTemplate('barcode');
        } else if (id.includes('tag') || id.includes('washtag') || id.includes('shoetag') || id.includes('interiortag') || id.includes('innerband')) {
            renderTemplate('wash-tag');
        } else if (id.includes('stitching') || id.includes('strobel') || id.includes('hardware')) {
            renderTemplate('strobel');
        } else if (id.includes('outsole') || id.includes('sole')) {
            renderTemplate('sneaker-sole');
        } else if (category === 'shoes') {
            renderTemplate('sneaker-side');
        } else if (category === 'hats') {
            renderTemplate('cap-front');
        } else {
            renderTemplate('hoodie-chest');
        }
    }

    return {
        templates,
        renderTemplate,
        setOpacity,
        toggleGrid,
        toggleTorch,
        toggleFacing,
        autoSelectForStep,
        setActiveStream: (stream) => { activeStream = stream; },
        stopStream,
        getCurrentFacing: () => currentFacingMode
    };
})();
