
class CustomNavbar extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    --accent: #b5b6ba;
                    --dark-navy: #0b132b;
                    --font-serif: "Playfair Display", serif;
                }
                
                .navbar {
                    position: fixed;
                    top: 0;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    background: var(--navbar-bg);
                    backdrop-filter: blur(14px);
                    font-family: var(--font-serif);
                    overflow: hidden;
                    height: 90px;
                    padding: 1.5rem 2rem;
                    transition: height 0.6s cubic-bezier(0.77, 0, 0.175, 1), background 0.4s ease, padding 0.25s ease;
                    z-index: 1000;
                }

                .navbar.scrolled {
                    background: var(--navbar-bg-scrolled);
                    padding: 1rem 2rem;
                }
                
                .navbar-top {
                    width: 100%;
                    max-width: 1200px;
                    margin: 0 auto;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.5rem 3rem;
                    gap: 1rem;
                }
                
                .logo {
                    display: flex;
                    align-items: center;
                    color: var(--white);
                    cursor: pointer;
                }
                
                .logo img {
                    height: 70px;
                    transition: transform 0.8s ease-in-out, filter 0.8s ease-in-out;
                }
                
                .logo:hover img {
                    transform: scale(1.3) translateY(8px);
                    filter: drop-shadow(0 4px 8px rgba(181, 182, 186, 0.4));
                }
                
                .nav-menu {
                    display: flex;
                    justify-content: center;
                    gap: 6rem;
                    flex-wrap: wrap;
                    margin-top: 1rem;
                    opacity: 0;
                    transform: translateY(-100px);
                    transition: opacity 0.6s ease, transform 0.6s ease;
                    padding: 2rem 3rem;
                    border-radius: 14px;
                    font-family: var(--font-serif);
                }
                
                .navbar:hover {
                    height: 200px;
                }
                
                .navbar:hover .nav-menu {
                    opacity: 1;
                    transform: translateY(0);
                }
                
                .nav-menu a {
                    color: var(--white);
                    text-decoration: none;
                    font-size: 1.35rem;
                    font-weight: 500;
                    position: relative;
                    opacity: 0;
                    transform: translateY(-8px);
                    transition: opacity 0.5s ease, transform 0.5s ease, color 0.3s ease;
                }
                
                .navbar:hover .nav-menu a:nth-child(1) {
                    transition-delay: 0.08s;
                    opacity: 1;
                    transform: translateY(0);
                }
                .navbar:hover .nav-menu a:nth-child(2) {
                    transition-delay: 0.16s;
                    opacity: 1;
                    transform: translateY(0);
                }
                .navbar:hover .nav-menu a:nth-child(3) {
                    transition-delay: 0.24s;
                    opacity: 1;
                    transform: translateY(0);
                }
                .navbar:hover .nav-menu a:nth-child(4) {
                    transition-delay: 0.32s;
                    opacity: 1;
                    transform: translateY(0);
                }
                .navbar:hover .nav-menu a:nth-child(5) {
                    transition-delay: 0.4s;
                    opacity: 1;
                    transform: translateY(0);
                }
                .navbar:hover .nav-menu a:nth-child(6) {
                    transition-delay: 0.48s;
                    opacity: 1;
                    transform: translateY(0);
                }
                
                .nav-menu a::after {
                    content: "";
                    display: block;
                    width: 0%;
                    height: 2px;
                    background: var(--accent);
                    position: absolute;
                    bottom: -10px;
                    left: 0;
                    transition: width 0.4s ease;
                }
                
                .nav-menu a:hover::after {
                    width: 100%;
                }
                
                .nav-menu a:hover {
                    color: var(--accent);
                }
/* Language selector styles */
.lang-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.theme-toggle {
    width: 40px;
    height: 36px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background: var(--lang-bg);
    border: 1px solid var(--lang-border);
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
}
.theme-toggle:hover { 
    transform: translateY(-2px) scale(1.05); 
    background: var(--lang-bg-hover);
    border-color: var(--accent);
    box-shadow: 0 4px 12px rgba(181, 182, 186, 0.15);
}
.theme-toggle:active {
    transform: translateY(0) scale(0.98);
}
.theme-toggle svg { 
    width: 20px; 
    height: 20px; 
    display: block; 
    color: var(--white); 
    transition: all 0.3s ease;
}
.theme-toggle:hover svg {
    color: var(--accent);
    transform: rotate(15deg);
}

    .lang-select {
    /* Visuals */
    background-color: var(--lang-bg);
    color: var(--white);
    border: 1px solid var(--lang-border);
    border-radius: 10px;
    padding: 0.4rem 2.2rem 0.4rem 0.9rem; /* space for caret */
    min-width: 72px;
    height: 36px;
    line-height: 1;
    font-size: 0.95rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    cursor: pointer;

    /* Appearance & transitions */
    -webkit-appearance: none;
    appearance: none;
    transition: 
        background 0.14s ease, 
        border-color 0.14s ease, 
        transform 0.12s ease, 
        box-shadow 0.12s ease;

    /* Caret icon */
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='14' height='14'%3E%3Cpolyline points='6 9 12 15 18 9' fill='none' stroke='%23b5b6ba' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: calc(100% - 12px) center;
    background-size: 14px 14px;
    box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.12);
}

/* Hover state */
.lang-select:hover {
    background-color: var(--lang-bg-hover);
    border-color: var(--accent);
    transform: translateY(-1px);
}

/* Focus state */
.lang-select:focus {
    outline: none;
    box-shadow: 0 0 0 4px rgba(181, 182, 186, 0.06);
    border-color: var(--accent);
    transform: translateY(-1px);
}


                @media (max-width: 768px) {
                    .navbar {
                        height: 70px;
                    }
                    .nav-menu {
                        flex-direction: column;
                        gap: 2rem;
                        padding: 1.5rem 2rem;
                    }
                    .navbar:hover {
                        height: auto;
                    }
                    .navbar-top {
                        justify-content: center;
                        padding: 0.5rem 1rem;
                    }
                    .lang-container {
                        order: 2;
                    }
                    .logo {
                        order: 1;
                    }
                }
            </style>
            
            <nav class="navbar">
                <div class="navbar-top">
                    <div class="logo">
                    <a href="index.html">
                        <img src="logo1.png" alt="KTransport Logo">
                    </a>
                    </div>
                        <div class="lang-container">
                            <label for="lang-select" style="display:none">Langue</label>
                            <select id="lang-select" class="lang-select" aria-label="Language selector">
                                <option value="en">EN</option>
                                <option value="fr">FR</option>
                            </select>
                            <button id="theme-toggle" class="theme-toggle" title="Toggle theme" aria-pressed="false" aria-label="Toggle theme">
                                <!-- moon / sun icon (will remain same, we toggle class on document) -->
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path>
                                </svg>
                            </button>
                        </div>
                </div>
                <div class="nav-menu">
                    <a href="index.html">Accueil</a>
                    <a href="index.html#services">Services</a>
                    <a href="about.html">À propos</a>
                    <a href="flotte.html">Notre flotte</a>
                    <a href="contact.html">Contact</a>
                    <a href="partenariats.html">Partenariats</a>
                </div>
</nav>
`;
        
        this.shadowRoot.querySelectorAll('[data-feather]').forEach(icon => {
            feather.replace(icon);
        });


        const langSelect = this.shadowRoot.querySelector('.lang-select');
        const themeToggle = this.shadowRoot.querySelector('#theme-toggle');
        this._translations = null;

        // Theme icon SVGs - show sun in dark mode (switch to light), moon in light mode (switch to dark)
        const sunSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>`;
        const moonSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>`;

        const setThemeIcon = (isDark) => {
            try {
                if (!themeToggle) return;
                // Show sun icon when dark (to switch to light), moon icon when light (to switch to dark)
                themeToggle.innerHTML = isDark ? sunSvg : moonSvg;
            } catch (e) { }
        };

        // Theme handling
        const applyTheme = (theme) => {
            try {
                if (theme === 'dark') {
                    document.documentElement.classList.add('theme-dark');
                } else {
                    document.documentElement.classList.remove('theme-dark');
                }
                localStorage.setItem('theme', theme);
                if (themeToggle) themeToggle.setAttribute('aria-pressed', theme === 'dark');
                // Update icon after theme is applied
                setThemeIcon(theme === 'dark');
            } catch (e) { }
        };
        
        // Initialize theme from saved preference or OS preference
        try {
            const savedTheme = localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
            applyTheme(savedTheme);
        } catch (e) {
            // Fallback to light theme
            applyTheme('light');
        }

        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const isDark = document.documentElement.classList.contains('theme-dark');
                const newTheme = isDark ? 'light' : 'dark';
                applyTheme(newTheme);
            });
        }

        const applyTranslations = (lang) => {
            if (!this._translations || !this._translations[lang]) return;
            // Update nav menu inside shadow DOM
            try {
                const nav = this.shadowRoot.querySelector('.nav-menu');
                if (nav) {
                    const navMap = this._translations[lang].nav || {};
                    const anchors = Array.from(nav.querySelectorAll('a'));
                    if (anchors[0]) anchors[0].textContent = navMap.home || anchors[0].textContent;
                    if (anchors[1]) anchors[1].textContent = navMap.services || anchors[1].textContent;
                    if (anchors[2]) anchors[2].textContent = navMap.about || anchors[2].textContent;
                    if (anchors[3]) anchors[3].textContent = navMap.fleet || anchors[3].textContent;
                    if (anchors[4]) anchors[4].textContent = navMap.contact || anchors[4].textContent;
                    if (anchors[5]) anchors[5].textContent = navMap.partnerships || anchors[5].textContent;
                }
            } catch (err) { }

            // Update page elements with data-i18n attributes
            try {
                document.querySelectorAll('[data-i18n]').forEach(el => {
                    const key = el.getAttribute('data-i18n');
                    if (!key) return;
                    const parts = key.split('.');
                    let val = this._translations[lang];
                    for (const p of parts) {
                        if (!val) break;
                        val = val[p];
                    }
                    if (val) el.textContent = val;
                });
            } catch (err) { }
        };

        // Fetch translations.json (static file)
        fetch('translations.json').then(r => r.ok ? r.json() : null).then(data => {
            if (!data) return;
            this._translations = data;
            if (langSelect) {
                const defaultLang = (navigator.language && navigator.language.startsWith('fr')) ? 'fr' : 'en';
                const saved = localStorage.getItem('lang') || defaultLang;
                langSelect.value = saved;
                try { document.documentElement.lang = saved; } catch (e) { }
                applyTranslations(saved);

                langSelect.addEventListener('change', (e) => {
                    const v = e.target.value;
                    localStorage.setItem('lang', v);
                    try { document.documentElement.lang = v; } catch (err) { }
                    applyTranslations(v);
                });
            }
        }).catch(() => {
            // If fetch fails (file:// preview or CORS), try to read embedded <script id="translations-json"> in page
            try {
                const script = document.getElementById('translations-json');
                if (script && script.textContent) {
                    const data = JSON.parse(script.textContent);
                    this._translations = data;
                    if (langSelect) {
                        const defaultLang = (navigator.language && navigator.language.startsWith('fr')) ? 'fr' : 'en';
                        const saved = localStorage.getItem('lang') || defaultLang;
                        langSelect.value = saved;
                        try { document.documentElement.lang = saved; } catch (e) { }
                        applyTranslations(saved);

                        langSelect.addEventListener('change', (e) => {
                            const v = e.target.value;
                            localStorage.setItem('lang', v);
                            try { document.documentElement.lang = v; } catch (err) { }
                            applyTranslations(v);
                        });
                    }
                }
            } catch (err) {
                if (langSelect) {
                    const defaultLang = (navigator.language && navigator.language.startsWith('fr')) ? 'fr' : 'en';
                    const saved = localStorage.getItem('lang') || defaultLang;
                    langSelect.value = saved;
                    try { document.documentElement.lang = saved; } catch (e) { }
                }
            }
        });

        // Mobile menu toggle (guarded)
        const mobileBtn = this.shadowRoot.querySelector('.mobile-menu-btn');
        const navLinks = this.shadowRoot.querySelector('.nav-links');

        if (mobileBtn && navLinks) {
            mobileBtn.addEventListener('click', () => {
                navLinks.classList.toggle('open');
                const icon = mobileBtn.querySelector('i');
                if (icon) {
                    icon.setAttribute('data-feather', navLinks.classList.contains('open') ? 'x' : 'menu');
                    feather.replace(icon);
                }
            });
        }
        
        // Scroll behavior for navbar — toggle a class instead of writing inline colors
        const navEl = this.shadowRoot.querySelector('.navbar');
        if (navEl) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) navEl.classList.add('scrolled');
                else navEl.classList.remove('scrolled');
            }, { passive: true });
        }
    }
}

customElements.define('custom-navbar', CustomNavbar);
