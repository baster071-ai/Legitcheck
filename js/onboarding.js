// Onboarding Tour & Tutorial Module
window.OnboardingTour = (function() {
    let currentStep = 0;
    const slides = [
        {
            icon: 'fa-solid fa-camera-viewfinder',
            iconColor: 'text-indigo-400',
            iconBg: 'bg-indigo-500/10',
            title: '1. Skaner z Asystentem Ghost Camera',
            subtitle: 'Precyzyjne kadrowanie kluczowych detali',
            desc: 'Dzięki półprzezroczystym nakładkom konturowym (Ghost Outline) dla butów, metek, szwów i kodów, Twoje zdjęcia będą idealnie wykadrowane i ostre pod kątem analizy rzeczoznawczej AI.',
            badge: 'Inteligentny wizjer'
        },
        {
            icon: 'fa-solid fa-microscope',
            iconColor: 'text-emerald-400',
            iconBg: 'bg-emerald-500/10',
            title: '2. Multimodalna Analiza AI',
            subtitle: 'Weryfikacja mikro-szwów, czcionek i kodów SKU',
            desc: 'System bada gęstość ściegu Strobel, kerning i grubość liter na metkach, poprawność kodów UPC, jakość zamków błyskawicznych oraz strukturę materiału według wyśrubowanych reguł rzeczoznawców.',
            badge: 'Gemini Multimodal'
        },
        {
            icon: 'fa-solid fa-certificate',
            iconColor: 'text-amber-400',
            iconBg: 'bg-amber-500/10',
            title: '3. Certyfikat & Wycena Rynkowa',
            subtitle: 'Wiarygodny dowód autentyczności do ogłoszeń',
            desc: 'Otrzymasz oficjalny raport z wynikiem Legit Score (0-100%), realną wyceną w PLN z giełd (Vinted, Grailed, StockX) oraz gotowy do skopiowania certyfikat zabezpieczający Twoją sprzedaż.',
            badge: 'Anty-Scam & Gwarancja'
        }
    ];

    function renderSlide(index) {
        currentStep = index;
        const slide = slides[index];
        const container = document.getElementById('onboardingSlideContent');
        if (!container) return;

        container.innerHTML = `
            <div class="flex flex-col items-center text-center space-y-4 animate-fadeIn">
                <div class="w-16 h-16 rounded-3xl ${slide.iconBg} ${slide.iconColor} border border-white/10 flex items-center justify-center text-3xl shadow-xl shadow-indigo-500/10">
                    <i class="${slide.icon}"></i>
                </div>
                <div>
                    <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-indigo-300 border border-slate-700 mb-2">
                        ${slide.badge}
                    </span>
                    <h3 class="text-base sm:text-lg font-black text-slate-100">${slide.title}</h3>
                    <h4 class="text-xs font-semibold text-indigo-400 mt-0.5">${slide.subtitle}</h4>
                    <p class="text-xs text-slate-300 mt-2.5 leading-relaxed max-w-sm">${slide.desc}</p>
                </div>
            </div>
        `;

        // Update Dots
        const dotsContainer = document.getElementById('onboardingDots');
        if (dotsContainer) {
            dotsContainer.innerHTML = slides.map((_, i) => `
                <button onclick="window.OnboardingTour.goTo(${i})" class="w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === index ? 'bg-indigo-500 w-7' : 'bg-slate-700 hover:bg-slate-600'}"></button>
            `).join('');
        }

        // Update Buttons
        const nextBtn = document.getElementById('onboardingNextBtn');
        const prevBtn = document.getElementById('onboardingPrevBtn');
        if (nextBtn) {
            if (index === slides.length - 1) {
                nextBtn.innerHTML = `<span>Rozpocznij</span> <i class="fa-solid fa-arrow-right text-xs"></i>`;
                nextBtn.className = "flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2";
            } else {
                nextBtn.innerHTML = `<span>Dalej</span> <i class="fa-solid fa-chevron-right text-xs"></i>`;
                nextBtn.className = "flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2";
            }
        }
        if (prevBtn) {
            prevBtn.style.visibility = index === 0 ? 'hidden' : 'visible';
        }
    }

    function openModal() {
        const modal = document.getElementById('onboardingModal');
        if (modal) {
            modal.classList.remove('hidden');
            renderSlide(0);
        }
    }

    function closeModal() {
        const modal = document.getElementById('onboardingModal');
        if (modal) {
            modal.classList.add('hidden');
        }
        localStorage.setItem('lc_onboarding_seen', 'true');
    }

    function next() {
        if (currentStep < slides.length - 1) {
            renderSlide(currentStep + 1);
        } else {
            closeModal();
        }
    }

    function prev() {
        if (currentStep > 0) {
            renderSlide(currentStep - 1);
        }
    }

    function goTo(index) {
        renderSlide(index);
    }

    function checkFirstVisit() {
        if (!localStorage.getItem('lc_onboarding_seen')) {
            openModal();
        }
    }

    return {
        openModal,
        closeModal,
        next,
        prev,
        goTo,
        checkFirstVisit
    };
})();
