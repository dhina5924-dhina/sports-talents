window.SportsConnect = window.SportsConnect || {};
SportsConnect.pages = SportsConnect.pages || {};

SportsConnect.pages.landing = {
    render() {
        const athletes = SportsConnect.data ? SportsConnect.data.users.filter(u => u.role === 'athlete').slice(0, 6) : [];
        const sports = SportsConnect.data ? SportsConnect.data.sports : [];
        const events = SportsConnect.data ? SportsConnect.data.events.slice(0, 3) : [];

        let athletesHtml = athletes.map(a => SportsConnect.components && SportsConnect.components.athleteCard ? SportsConnect.components.athleteCard.render(a) : `<div class="athlete-card">${a.fullName}</div>`).join('');
        let eventsHtml = events.map(e => SportsConnect.components && SportsConnect.components.eventCard ? SportsConnect.components.eventCard.render(e) : `<div class="event-card">${e.name}</div>`).join('');
        
        let sportsHtml = sports.map(s => `
            <div class="sport-card" style="--sport-color: ${s.color}">
                <div class="sport-card__icon">${s.icon}</div>
                <h3 class="sport-card__name">${s.name}</h3>
                <p class="sport-card__count">${s.athleteCount} Athletes</p>
            </div>
        `).join('');

        return `
            <div class="page-landing">
                <!-- Hero Section -->
                <section class="landing-hero">
                    <div class="landing-hero__bg">
                        <div class="floating-icon icon-1">⚽</div>
                        <div class="floating-icon icon-2">🏏</div>
                        <div class="floating-icon icon-3">🏃</div>
                        <div class="floating-icon icon-4">🏐</div>
                        <div class="floating-icon icon-5">🏸</div>
                    </div>
                    <div class="landing-hero__content">
                        <h1 class="landing-hero__title">Discover Talent. Share Your Game. Shape Your Future.</h1>
                        <p class="landing-hero__subtitle">A sports community where every athlete gets a chance to be seen — from every village, town, and city across India.</p>
                        <div class="landing-hero__actions">
                            <a href="#register" class="btn btn--primary btn--large">Join SportsConnect</a>
                            <a href="#discovery" class="btn btn--outline btn--large">Discover Athletes</a>
                        </div>
                        <div class="landing-hero__stats">
                            <span>10,000+ Athletes</span> | 
                            <span>500+ Coaches</span> | 
                            <span>200+ Teams</span> | 
                            <span>50+ Sports Events</span>
                        </div>
                    </div>
                    <div class="landing-hero__scroll-indicator">
                        <i class="fas fa-chevron-down"></i>
                    </div>
                </section>

                <!-- How It Works Section -->
                <section class="landing-section">
                    <div class="container">
                        <h2 class="section-title">How It Works</h2>
                        <div class="how-it-works-grid">
                            <div class="step-card animate-on-scroll">
                                <div class="step-card__number">1</div>
                                <div class="step-card__icon">🏅</div>
                                <h3>Create Your Profile</h3>
                                <p>Build your sports resume with achievements, stats, and videos</p>
                            </div>
                            <div class="step-card animate-on-scroll" style="transition-delay: 100ms">
                                <div class="step-card__number">2</div>
                                <div class="step-card__icon">📸</div>
                                <h3>Showcase Your Talent</h3>
                                <p>Upload photos, videos, and share your sports journey</p>
                            </div>
                            <div class="step-card animate-on-scroll" style="transition-delay: 200ms">
                                <div class="step-card__number">3</div>
                                <div class="step-card__icon">🔍</div>
                                <h3>Get Discovered</h3>
                                <p>Coaches, scouts, and teams search and find talented athletes</p>
                            </div>
                            <div class="step-card animate-on-scroll" style="transition-delay: 300ms">
                                <div class="step-card__number">4</div>
                                <div class="step-card__icon">🤝</div>
                                <h3>Connect & Grow</h3>
                                <p>Receive opportunities, join teams, and advance your career</p>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Featured Athletes Section -->
                <section class="landing-section bg-alt">
                    <div class="container">
                        <div class="section-header">
                            <h2 class="section-title">Rising Stars</h2>
                            <a href="#discovery" class="view-all">View All</a>
                        </div>
                        <div class="horizontal-scroll-container">
                            <div class="horizontal-scroll-content">
                                ${athletesHtml}
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Discover Talent Section -->
                <section class="landing-section">
                    <div class="container">
                        <div class="split-layout">
                            <div class="split-layout__content">
                                <h2 class="section-title">Every Village Has a Champion</h2>
                                <p class="section-desc">We believe talent is everywhere, but opportunity is not. SportsConnect bridges the gap by connecting rural athletes with professional coaches, scouts, and teams. From local grounds to national stadiums, your journey starts here.</p>
                                <a href="#discovery" class="btn btn--primary">Search for Talent</a>
                            </div>
                            <div class="split-layout__grid">
                                ${athletes.slice(0, 4).map(a => `
                                    <div class="mini-athlete-card">
                                        <div class="avatar" style="background: ${a.avatarColor}">${a.avatar}</div>
                                        <div class="info">
                                            <h4>${a.fullName}</h4>
                                            <span>${a.location?.village || a.location?.district}</span>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Popular Sports Section -->
                <section class="landing-section bg-alt">
                    <div class="container">
                        <h2 class="section-title text-center">Popular Sports</h2>
                        <div class="sports-grid">
                            ${sportsHtml}
                        </div>
                    </div>
                </section>

                <!-- Village Sports Section -->
                <section class="landing-section">
                    <div class="container">
                        <div class="text-center mb-4">
                            <h2 class="section-title">From Villages to Victory</h2>
                            <p class="section-desc">Connecting rural talent with professional opportunities</p>
                        </div>
                        <div class="feature-cards-grid">
                            <div class="feature-card">
                                <div class="feature-card__img" style="background: linear-gradient(45deg, var(--primary), var(--secondary))">🏆</div>
                                <h3>Local Tournaments</h3>
                                <p>Discover and participate in tournaments happening in your district.</p>
                            </div>
                            <div class="feature-card">
                                <div class="feature-card__img" style="background: linear-gradient(45deg, var(--accent), var(--warning))">⭐</div>
                                <h3>Village Champions</h3>
                                <p>Highlighting exceptional talent from rural areas across the country.</p>
                            </div>
                            <div class="feature-card">
                                <div class="feature-card__img" style="background: linear-gradient(45deg, var(--info), var(--primary-light))">🤝</div>
                                <h3>Community Support</h3>
                                <p>Get backed by local communities and sponsors for your journey.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Upcoming Events Section -->
                <section class="landing-section bg-alt">
                    <div class="container">
                        <div class="section-header">
                            <h2 class="section-title">Upcoming Events</h2>
                            <a href="#events" class="view-all">View All Events</a>
                        </div>
                        <div class="events-grid">
                            ${eventsHtml}
                        </div>
                    </div>
                </section>

                <!-- Testimonials Section -->
                <section class="landing-section">
                    <div class="container">
                        <h2 class="section-title text-center">What Athletes Say</h2>
                        <div class="testimonials-grid">
                            <div class="testimonial-card">
                                <p class="quote">"Thanks to SportsConnect, a district coach saw my sprinting video. Now I'm training at the state academy!"</p>
                                <div class="author">
                                    <div class="avatar" style="background: #f59e0b">🏃</div>
                                    <div class="info">
                                        <h4>Kannan R.</h4>
                                        <span>Athletics, Theni</span>
                                    </div>
                                </div>
                            </div>
                            <div class="testimonial-card">
                                <p class="quote">"Finding local tournaments used to be hard. Now our village kabaddi team plays every weekend."</p>
                                <div class="author">
                                    <div class="avatar" style="background: #10b981">🤼</div>
                                    <div class="info">
                                        <h4>Velu Team</h4>
                                        <span>Kabaddi, Madurai</span>
                                    </div>
                                </div>
                            </div>
                            <div class="testimonial-card">
                                <p class="quote">"As a scout, this platform is a goldmine. I've found incredible talent in places I couldn't visit."</p>
                                <div class="author">
                                    <div class="avatar" style="background: #3b82f6">👨‍💼</div>
                                    <div class="info">
                                        <h4>Sanjay K.</h4>
                                        <span>Cricket Scout</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- CTA Section -->
                <section class="cta-section">
                    <div class="container text-center">
                        <h2>Ready to Showcase Your Talent?</h2>
                        <p>Join thousands of athletes from across India</p>
                        <a href="#register" class="btn btn--primary btn--large btn--white">Get Started</a>
                    </div>
                </section>

                <!-- Footer -->
                <footer class="site-footer">
                    <div class="container">
                        <div class="footer-grid">
                            <div class="footer-col brand-col">
                                <h3 class="footer-logo">SportsConnect</h3>
                                <p>Empowering grassroots sports in India. Connecting talent with opportunity.</p>
                                <div class="social-links">
                                    <a href="#"><i class="fab fa-facebook"></i></a>
                                    <a href="#"><i class="fab fa-twitter"></i></a>
                                    <a href="#"><i class="fab fa-instagram"></i></a>
                                </div>
                            </div>
                            <div class="footer-col">
                                <h4>Quick Links</h4>
                                <ul>
                                    <li><a href="#">About Us</a></li>
                                    <li><a href="#">Contact</a></li>
                                    <li><a href="#">Careers</a></li>
                                    <li><a href="#">Blog</a></li>
                                </ul>
                            </div>
                            <div class="footer-col">
                                <h4>Sports</h4>
                                <ul>
                                    <li><a href="#">Cricket</a></li>
                                    <li><a href="#">Football</a></li>
                                    <li><a href="#">Athletics</a></li>
                                    <li><a href="#">Kabaddi</a></li>
                                    <li><a href="#">More...</a></li>
                                </ul>
                            </div>
                            <div class="footer-col">
                                <h4>Legal</h4>
                                <ul>
                                    <li><a href="#">Terms of Service</a></li>
                                    <li><a href="#">Privacy Policy</a></li>
                                    <li><a href="#">Cookie Policy</a></li>
                                </ul>
                            </div>
                        </div>
                        <div class="footer-bottom">
                            <p>&copy; 2026 SportsConnect. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>
        `;
    },
    
    init() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // Run once
                }
            });
        }, observerOptions);

        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
        
        // Initialize horizontal scrolling if needed
        const scrollContainers = document.querySelectorAll('.horizontal-scroll-container');
        scrollContainers.forEach(container => {
            let isDown = false;
            let startX;
            let scrollLeft;

            container.addEventListener('mousedown', (e) => {
                isDown = true;
                container.classList.add('active');
                startX = e.pageX - container.offsetLeft;
                scrollLeft = container.scrollLeft;
            });
            container.addEventListener('mouseleave', () => {
                isDown = false;
                container.classList.remove('active');
            });
            container.addEventListener('mouseup', () => {
                isDown = false;
                container.classList.remove('active');
            });
            container.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.pageX - container.offsetLeft;
                const walk = (x - startX) * 2; // scroll-fast
                container.scrollLeft = scrollLeft - walk;
            });
        });
    }
};
