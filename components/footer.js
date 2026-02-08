class CustomFooter extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: 'open' });

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    background-color: var(--footer-bg);
                    color: var(--footer-text);
                    padding: 4rem 2rem; /* more breathing room */
                    font-family: inherit;
                }

                .footer-container {
                    max-width: 1200px;
                    margin: auto;
                    padding: 3rem 2rem; /* larger internal padding */
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                    gap: 2.5rem; /* increased gap for separation */
                    align-items: start;
                }

                /* LOGO */
                .footer-logo {
                    display: flex;
                    align-items: center;
                    font-size: 1.5rem;
                    font-weight: bold;
                    margin-bottom: 1rem;
                }
                .footer-logo img {
                    height: 48px;
                    margin-right: 0.75rem;
                }

                /* TITLES */
                .footer-links h3 {
                    font-size: 1.125rem;
                    margin-bottom: 1rem;
                    padding-bottom: 0.6rem;
                    position: relative;
                    letter-spacing: 0.01em;
                }
                .footer-links h3::after {
                    content: "";
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 40px;
                    height: 2px;
                    background-color: var(--secondary);
                }

                /* LINKS */
                .footer-links ul {
                    list-style: none;
                    margin: 0;
                    padding: 0;
                }
                .footer-links li {
                    margin-bottom: 0.65rem;
                }
                .footer-links a {
                    color: var(--footer-muted);
                    text-decoration: none;
                    transition: color 0.3s ease;
                    font-size: 0.98rem;
                    line-height: 1.6;
                }
                .footer-links a:hover {
                    color: var(--secondary);
                }

                /* SOCIAL */
                .social-links {
                    display: flex;
                    gap: 1rem;
                    margin-top: 1.25rem;
                }
                .social-links a {
                    width: 40px;
                    height: 40px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background: var(--social-bg);
                    border-radius: 50%;
                    color: var(--footer-text);
                    transition: 0.3s ease;
                }
                .social-links a:hover {
                    background-color: var(--secondary);
                    transform: translateY(-3px);
                }

                /* BOTTOM COPYRIGHT */
                .footer-bottom {
                    text-align: center;
                    padding-top: 2rem;
                    border-top: 1px solid var(--footer-border);
                    font-size: 0.95rem;
                    color: var(--footer-muted);
                }

                /* PARTNERS */
                .partners-strip {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.75rem;
                    margin-top: 1.5rem;
                    padding-top: 1.25rem;
                    border-top: 1px solid var(--footer-border);
                }
                .partners-title {
                    color: var(--footer-text);
                    font-weight: 600;
                    letter-spacing: 0.02em;
                }
                .partners-logos {
                    display: flex;
                    gap: 1.25rem;
                    align-items: center;
                    justify-content: center;
                    flex-wrap: wrap;
                    max-width: 920px;
                    padding: 0.5rem 0.25rem;
                }
                .partner-logo {
                    background: var(--partner-bg);
                    padding: 0.65rem 0.9rem;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 54px;
                    min-width: 120px;
                    box-shadow: var(--ui-box-shadow);
                }
                .partner-logo img { max-height: 40px; max-width: 160px; object-fit: contain; }

                /* reveal animation for progressively loaded partners */
                .partner-hidden { opacity: 0; transform: translateY(12px) scale(0.98); }
                .partner-visible { opacity: 1; transform: translateY(0) scale(1); transition: all 520ms cubic-bezier(.2,.9,.28,1); }

                @media (max-width: 768px) {
                    .footer-container {
                        grid-template-columns: 1fr;
                    }
                }
            </style>

            <div class="footer-container">

                <!-- ABOUT -->
                <div class="footer-about">
                    <div class="footer-logo">
                        <img src="logo1.png" alt="KTransport Logo">
                        <span>KTransport</span>
                    </div>

                    <p>Service de transport haut de gamme pour vos déplacements en toute élégance.</p>

<div class="social-links">

    <!-- Facebook -->
    <a href="#" aria-label="Facebook">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 2h-3a4 4 0 0 0-4 4v3H8v4h3v9h4v-9h3.5l.5-4H15V6a1 1 0 0 1 1-1h2z"/>
        </svg>
    </a>

    <!-- Instagram -->
    <a href="#" aria-label="Instagram">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
    </a>

<!-- WhatsApp -->
<a href="#" aria-label="WhatsApp">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12.04 2C6.58 2 2.21 6.37 2.21 11.83c0 2.08.61 4.05 1.76 5.76L2 22l4.55-1.92c1.63.9 3.47 1.38 5.49 1.38h.01c5.46 0 9.83-4.37 9.83-9.83C21.88 6.37 17.5 2 12.04 2zm5.68 14.27c-.24.67-1.39 1.3-1.96 1.38-.5.08-1.12.11-1.81-.11-.42-.14-.96-.31-1.65-.61-2.92-1.27-4.82-4.23-4.97-4.43-.14-.19-1.18-1.57-1.18-3.01 0-1.44.75-2.15 1.02-2.44.24-.26.64-.38 1.02-.38.12 0 .23.01.33.01.29.01.43.03.62.48.24.58.83 2.01.9 2.15.07.14.12.31.03.5-.08.19-.12.31-.24.48-.12.17-.26.38-.37.51-.12.14-.24.29-.1.54.14.24.62 1.02 1.34 1.65.92.82 1.69 1.08 1.94 1.2.24.12.38.1.52-.06.14-.17.6-.7.76-.94.17-.24.31-.2.52-.12.21.07 1.33.63 1.56.75.24.12.4.17.46.27.07.1.07.69-.17 1.36z"/>
    </svg>
</a>

    <!-- LinkedIn -->
    <a href="#" aria-label="LinkedIn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/>
            <rect x="2" y="9" width="4" height="12"></rect>
            <circle cx="4" cy="4" r="2"></circle>
        </svg>
    </a>

</div>

                </div>

                <!-- SERVICES -->
                <div class="footer-links">
                    <h3>Services</h3>
                    <ul>
                        <li><a href="transfert-aeroport.html">Transfert aéroport</a></li>
                        <li><a href="evenements.html">Déplacements business</a></li>
                        <li><a href="mariages.html">Evenements et MICE</a></li>
                        <li><a href="chauffeur.html">VIP et Protocolaires</a></li>
                        <li><a href="tourisme.html">Mise a disposition</a></li>
                        <li><a href="#partenariats">Partenariats</a></li>
                        <li><a href="contact.html">Contact</a></li>
                    </ul>
                </div>

                <!-- ENTREPRISE -->
                <div class="footer-links">
                    <h3>Entreprise</h3>
                    <ul>
                        <li><a href="about.html">À propos</a></li>
                        <li><a href="flotte.html">Notre flotte</a></li>
                        <li><a href="chauffeurs.html">Chauffeurs</a></li>
                        <li><a href="actualites.html">Actualités</a></li>
                    </ul>
                </div>

                <!-- CONTACT -->
                <div class="footer-links">
                    <h3>Contact</h3>
                    <ul>
                        <li><i data-feather="phone"></i> +33 1 23 45 67 89</li>
                        <li><i data-feather="mail"></i> contact@KTransport.com</li>
                        <li><i data-feather="map-pin"></i> 123 Avenue des Champs, Paris</li>
                    </ul>
                </div>

            </div>

            <div class="partners-strip" role="region" aria-label="Trusted partners">
                <div class="partners-title" id="partners-title">Trusted by</div>
                <div class="partners-logos" id="partners-logos">
                    <div class="partner-logo"><img src="https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg" alt="NVIDIA"></div>
                    <div class="partner-logo"><img src="LOGO_SAGEMCOM.png" alt="Sagemcom"></div>
                    <div class="partner-logo"><img src="Intel_logo_2023.svg" alt="Intel"></div>
                    <div class="partner-logo"><img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg" alt="Amazon"></div>
                </div>
            </div>

            <div class="footer-bottom">
                <p>&copy; ${new Date().getFullYear()} KTransport. Tous droits réservés.</p>
            </div>
        `;

        // Initialize feather icons
        feather.replace();

        // localize partners title with translations.json (fallback to embedded script)
        (function localizePartners() {
            const setTitle = (text) => {
                try {
                    const el = this.shadowRoot.getElementById('partners-title');
                    if (el) el.textContent = text;
                } catch (e) { }
            };

            fetch('translations.json').then(r => r.ok ? r.json() : null).then(data => {
                if (!data) return;
                const lang = (localStorage.getItem('lang')) || ((navigator.language && navigator.language.startsWith('fr')) ? 'fr' : 'en');
                const title = (data[lang] && data[lang].partnerships && data[lang].partnerships.logos && data[lang].partnerships.logos.title) || 'Trusted by';
                setTitle(title);
            }).catch(() => {
                try {
                    const script = document.getElementById('translations-json');
                    if (script && script.textContent) {
                        const data = JSON.parse(script.textContent);
                        const lang = (localStorage.getItem('lang')) || ((navigator.language && navigator.language.startsWith('fr')) ? 'fr' : 'en');
                        const title = (data[lang] && data[lang].partnerships && data[lang].partnerships.logos && data[lang].partnerships.logos.title) || 'Trusted by';
                        setTitle(title);
                    }
                } catch (e) { }
            });
        }).call(this);

        // Progressive reveal of additional partners when footer enters viewport
        (function progressivePartners() {
            try {
                const container = this.shadowRoot.getElementById('partners-logos');
                if (!container) return;

                // Define a larger list of partners (mix of local assets and placeholders)

                // Duplicate the existing base partners several times to create a richer reveal effect
                const basePartners = [
                    { src: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg', alt: 'NVIDIA' },
                    { src: 'LOGO_SAGEMCOM.png', alt: 'Sagemcom' },
                    { src: 'Intel_logo_2023.svg', alt: 'Intel' },
                    { src: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg', alt: 'Amazon' },                    { src: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg', alt: 'NVIDIA' },
                    { src: 'LOGO_SAGEMCOM.png', alt: 'Sagemcom' },
                    { src: 'Intel_logo_2023.svg', alt: 'Intel' },
                    { src: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg', alt: 'Amazon' },                    { src: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg', alt: 'NVIDIA' },
                    { src: 'LOGO_SAGEMCOM.png', alt: 'Sagemcom' },
                    { src: 'Intel_logo_2023.svg', alt: 'Intel' },
                    { src: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg', alt: 'Amazon' }
                ];

                const repeat = 1;
                const allPartners = [];
                for (let r = 0; r < repeat; r++) {
                    basePartners.forEach(p => allPartners.push(Object.assign({}, p)));
                }

                // Clear existing static HTML and render controlled initial slice
                container.innerHTML = '';

                const batchSize = 3;
                let index = 0;

                const makeLogoNode = (p) => {
                    const wrap = document.createElement('div');
                    wrap.className = 'partner-logo partner-hidden';
                    const img = document.createElement('img');
                    img.src = p.src;
                    img.alt = p.alt || '';
                    wrap.appendChild(img);
                    return wrap;
                };

                const loadNextBatch = () => {
                    if (index >= allPartners.length) return false;
                    const frag = document.createDocumentFragment();
                    const limit = Math.min(index + batchSize, allPartners.length);
                    for (; index < limit; index++) {
                        frag.appendChild(makeLogoNode(allPartners[index]));
                    }
                    container.appendChild(frag);

                    // staggered reveal
                    const nodes = Array.from(container.querySelectorAll('.partner-hidden'));
                    nodes.forEach((n, i) => {
                        setTimeout(() => n.classList.remove('partner-hidden') || n.classList.add('partner-visible'), i * 140);
                    });

                    return index < allPartners.length;
                };

                // render initial batch
                loadNextBatch();

                // Observe when partners strip becomes visible, then load more batches on each intersection
                const partnersStripEl = this.shadowRoot.querySelector('.partners-strip');
                const io = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            // load one more batch when strip is in view
                            const hasMore = loadNextBatch();
                            if (!hasMore) {
                                io.disconnect();
                                window.removeEventListener('scroll', onScroll);
                            }
                        }
                    });
                }, { root: null, rootMargin: '0px', threshold: 0.15 });

                if (partnersStripEl) io.observe(partnersStripEl);

                // Also load more while user is actively scrolling down — trigger when the strip is near viewport
                let lastScrollY = window.scrollY || 0;
                let scrollCooldown = null;
                const onScroll = () => {
                    const y = window.scrollY || 0;
                    const scrollingDown = y > lastScrollY;
                    lastScrollY = y;
                    if (!scrollingDown) return;
                    if (!partnersStripEl) return;
                    const rect = partnersStripEl.getBoundingClientRect();
                    // if the strip top is within 90% of viewport height, load next batch
                    if (rect.top < window.innerHeight * 0.9) {
                        if (scrollCooldown) return;
                        const hasMore = loadNextBatch();
                        if (!hasMore) {
                            window.removeEventListener('scroll', onScroll);
                            if (io) io.disconnect();
                        }
                        // short cooldown to avoid rapid repeated loads while scrolling
                        scrollCooldown = setTimeout(() => { scrollCooldown = null; }, 280);
                    }
                };

                window.addEventListener('scroll', onScroll, { passive: true });

                // Safety: also allow clicking the partners title to reveal remaining partners
                const title = this.shadowRoot.getElementById('partners-title');
                if (title) {
                    title.style.cursor = 'pointer';
                    title.addEventListener('click', () => {
                        while (index < allPartners.length) loadNextBatch();
                        if (io) io.disconnect();
                        window.removeEventListener('scroll', onScroll);
                    });
                }
            } catch (e) { /* fail silently */ }
        }).call(this);
    }
}

customElements.define('custom-footer', CustomFooter);
