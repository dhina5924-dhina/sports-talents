window.SportsConnect = window.SportsConnect || {};
SportsConnect.pages = SportsConnect.pages || {};

SportsConnect.pages.discovery = {
    render() {
        const athletes = SportsConnect.data ? SportsConnect.data.users.filter(u => u.role === 'athlete') : [];
        const sports = SportsConnect.data ? SportsConnect.data.sports : [];

        let gridHtml = athletes.map(a => SportsConnect.components && SportsConnect.components.athleteCard ? SportsConnect.components.athleteCard.render(a) : `<div class="athlete-card">${a.fullName}</div>`).join('');
        
        let recommendedHtml = athletes.slice(0, 3).map(a => SportsConnect.components && SportsConnect.components.athleteCard ? SportsConnect.components.athleteCard.render(a) : `<div>${a.fullName}</div>`).join('');
        
        let sportsChips = sports.map(s => `
            <label class="chip-checkbox">
                <input type="checkbox" value="${s.name}">
                <span class="chip-label">${s.icon} ${s.name}</span>
            </label>
        `).join('');

        return `
            <div class="page-discovery">
                <!-- Hero Header -->
                <div class="discovery-hero">
                    <div class="container text-center">
                        <h1 class="discovery-hero__title">Discover the Next Sports Star ⭐</h1>
                        <p class="discovery-hero__subtitle">Find talented athletes from every corner of India</p>
                        <div class="discovery-search-bar">
                            <i class="fas fa-search search-icon"></i>
                            <input type="text" id="discovery-search" placeholder="Search athletes by name, sport, or location...">
                            <button class="btn btn--primary">Search</button>
                        </div>
                    </div>
                </div>

                <div class="discovery-layout container">
                    <!-- Mobile Filter Toggle -->
                    <button class="btn btn--outline mobile-filter-toggle" id="mobile-filter-toggle">
                        <i class="fas fa-filter"></i> Filters
                    </button>

                    <!-- Filters Sidebar -->
                    <aside class="discovery-sidebar" id="discovery-sidebar">
                        <div class="sidebar-header">
                            <h3>Filters</h3>
                            <button class="btn-clear" id="clear-filters">Clear All</button>
                            <button class="close-sidebar-mobile" id="close-sidebar"><i class="fas fa-times"></i></button>
                        </div>
                        
                        <div class="filter-group">
                            <h4>Sport</h4>
                            <div class="sports-chips-container">
                                ${sportsChips}
                            </div>
                        </div>

                        <div class="filter-group">
                            <h4>Location</h4>
                            <select class="form-control mb-2" id="filter-state">
                                <option value="">All States</option>
                                <option value="Tamil Nadu">Tamil Nadu</option>
                                <option value="Kerala">Kerala</option>
                                <option value="Karnataka">Karnataka</option>
                                <option value="Maharashtra">Maharashtra</option>
                            </select>
                            <input type="text" class="form-control mb-2" placeholder="District" id="filter-district">
                            <input type="text" class="form-control" placeholder="Village/Town" id="filter-village">
                        </div>

                        <div class="filter-group">
                            <h4>Age Range</h4>
                            <div class="age-ranges">
                                <label><input type="radio" name="age" value="all" checked> All Ages</label>
                                <label><input type="radio" name="age" value="u16"> Under 16</label>
                                <label><input type="radio" name="age" value="16-18"> 16 - 18</label>
                                <label><input type="radio" name="age" value="18-22"> 18 - 22</label>
                                <label><input type="radio" name="age" value="22+"> 22+</label>
                            </div>
                        </div>

                        <div class="filter-group">
                            <h4>Gender</h4>
                            <div class="gender-radios">
                                <label><input type="radio" name="gender" value="all" checked> All</label>
                                <label><input type="radio" name="gender" value="Male"> Male</label>
                                <label><input type="radio" name="gender" value="Female"> Female</label>
                            </div>
                        </div>

                        <div class="filter-group">
                            <h4>Experience</h4>
                            <select class="form-control">
                                <option value="all">All Levels</option>
                                <option value="beginner">Beginner</option>
                                <option value="1-3">1-3 years</option>
                                <option value="3-5">3-5 years</option>
                                <option value="5+">5+ years</option>
                            </select>
                        </div>

                        <div class="filter-group">
                            <label class="toggle-switch">
                                <input type="checkbox" id="filter-verified">
                                <span class="slider"></span>
                                <span class="toggle-label">Verified Athletes Only</span>
                            </label>
                        </div>

                        <button class="btn btn--primary btn--full mt-4" id="apply-filters">Apply Filters</button>
                    </aside>

                    <!-- Results Area -->
                    <main class="discovery-results">
                        <div class="results-header">
                            <span class="results-count">Showing ${athletes.length} athletes</span>
                            <div class="results-sort">
                                <label>Sort by:</label>
                                <select class="form-control-inline">
                                    <option>Most Relevant</option>
                                    <option>New Talent</option>
                                    <option>Top Performing</option>
                                    <option>Most Followed</option>
                                    <option>Nearby</option>
                                </select>
                            </div>
                        </div>

                        <div class="athletes-grid" id="athletes-results">
                            ${gridHtml}
                        </div>
                    </main>
                </div>

                <!-- Featured Section -->
                <section class="discovery-featured bg-alt mt-5 py-5">
                    <div class="container">
                        <h2 class="section-title">Recommended for You</h2>
                        <div class="athletes-grid">
                            ${recommendedHtml}
                        </div>
                    </div>
                </section>
            </div>
        `;
    },
    
    init() {
        // Mobile Sidebar Toggle
        const toggleBtn = document.getElementById('mobile-filter-toggle');
        const sidebar = document.getElementById('discovery-sidebar');
        const closeBtn = document.getElementById('close-sidebar');

        if (toggleBtn && sidebar) {
            toggleBtn.addEventListener('click', () => {
                sidebar.classList.add('active');
            });
        }
        if (closeBtn && sidebar) {
            closeBtn.addEventListener('click', () => {
                sidebar.classList.remove('active');
            });
        }

        // Search debounce simulation
        const searchInput = document.getElementById('discovery-search');
        if (searchInput) {
            let timeout = null;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    // Simulate search filtering
                    console.log('Searching for:', e.target.value);
                    // In a real app, would call render() again with filtered data or update DOM
                }, 500);
            });
        }

        // Apply/Clear filters simulation
        const applyBtn = document.getElementById('apply-filters');
        const clearBtn = document.getElementById('clear-filters');

        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                // Simulate loading state
                const grid = document.getElementById('athletes-results');
                if (grid) {
                    grid.style.opacity = '0.5';
                    setTimeout(() => {
                        grid.style.opacity = '1';
                        // Close sidebar on mobile after apply
                        if (window.innerWidth < 1024 && sidebar) {
                            sidebar.classList.remove('active');
                        }
                    }, 400);
                }
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                // Uncheck all inputs
                const inputs = sidebar.querySelectorAll('input');
                inputs.forEach(i => {
                    if (i.type === 'checkbox' || i.type === 'radio') i.checked = false;
                    if (i.type === 'text') i.value = '';
                });
                const selects = sidebar.querySelectorAll('select');
                selects.forEach(s => s.selectedIndex = 0);
                
                // Reset radios to 'all'
                const allRadios = sidebar.querySelectorAll('input[value="all"]');
                allRadios.forEach(r => r.checked = true);
            });
        }
    }
};
