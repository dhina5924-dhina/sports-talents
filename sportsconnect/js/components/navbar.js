window.SportsConnect = window.SportsConnect || {};
SportsConnect.components = SportsConnect.components || {};

SportsConnect.components.navbar = {
    render() {
        const unreadCount = (window.SportsConnect.store && window.SportsConnect.store.getUnreadCount) 
            ? window.SportsConnect.store.getUnreadCount() 
            : 3;
            
        return `
            <nav class="navbar">
                <div class="navbar__container">
                    <div class="navbar__left">
                        <div class="navbar__mobile-toggle" id="mobile-menu-toggle">
                            <span>☰</span>
                        </div>
                        <a href="#feed" class="navbar__logo">
                            🏅 SportsConnect
                        </a>
                    </div>
                    
                    <div class="navbar__center">
                        <form class="navbar__search" id="navbar-search">
                            <span class="navbar__search-icon">🔍</span>
                            <input type="text" placeholder="Search athletes, sports, events..." class="navbar__search-input" id="navbar-search-input">
                        </form>
                        <div class="navbar__links desktop-only">
                            <a href="#feed" class="navbar__link active">Home</a>
                            <a href="#discovery" class="navbar__link">Discover</a>
                            <a href="#sports" class="navbar__link">Sports</a>
                            <a href="#events" class="navbar__link">Events</a>
                        </div>
                    </div>
                    
                    <div class="navbar__right">
                        <button class="navbar__icon-btn" id="theme-toggle" title="Toggle Theme">
                            🌙
                        </button>
                        <a href="#messages" class="navbar__icon-btn" title="Messages">
                            💬
                            <span class="navbar__badge">2</span>
                        </a>
                        <div class="navbar__dropdown-wrapper">
                            <button class="navbar__icon-btn" id="notifications-toggle" title="Notifications">
                                🔔
                                ${unreadCount > 0 ? `<span class="navbar__badge">${unreadCount}</span>` : ''}
                            </button>
                            <div class="navbar__dropdown" id="notifications-dropdown">
                                <!-- Notifications content -->
                            </div>
                        </div>
                        <div class="navbar__dropdown-wrapper">
                            <div class="avatar navbar__avatar" id="user-menu-toggle" style="background: var(--primary);">👤</div>
                            <div class="navbar__dropdown" id="user-dropdown">
                                <a href="#profile" class="navbar__dropdown-item">My Profile</a>
                                <a href="#settings" class="navbar__dropdown-item">Settings</a>
                                <div class="navbar__dropdown-divider"></div>
                                <a href="#" class="navbar__dropdown-item text-error" id="logout-btn">Logout</a>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        `;
    },
    
    init() {
        const searchForm = document.getElementById('navbar-search');
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const query = document.getElementById('navbar-search-input').value;
                if (query) window.location.hash = `#search?q=${encodeURIComponent(query)}`;
            });
        }

        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                document.body.classList.toggle('dark-theme');
                themeToggle.innerHTML = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
            });
        }

        const userToggle = document.getElementById('user-menu-toggle');
        const userDropdown = document.getElementById('user-dropdown');
        if (userToggle && userDropdown) {
            userToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                userDropdown.classList.toggle('show');
            });
        }

        const mobileToggle = document.getElementById('mobile-menu-toggle');
        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => {
                document.body.classList.toggle('sidebar-mobile-open');
            });
        }

        document.addEventListener('click', () => {
            if (userDropdown) userDropdown.classList.remove('show');
        });
    }
};
