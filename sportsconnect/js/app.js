window.SportsConnect = window.SportsConnect || {};

(function() {
    function initApp() {
        console.log('🏅 SportsConnect Application Initializing...');

        // 1. Initialize Theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);

        // 2. Global Navigation Delegation (data-navigate attributes)
        document.addEventListener('click', (e) => {
            const navLink = e.target.closest('[data-navigate]');
            if (navLink) {
                e.preventDefault();
                const route = navLink.getAttribute('data-navigate');
                if (route) {
                    SportsConnect.router.navigate(route);
                }
            }
        });

        // 3. Global Modal listeners
        if (SportsConnect.components && SportsConnect.components.modal && SportsConnect.components.modal.init) {
            SportsConnect.components.modal.init();
        }

        // 4. Initialize Router
        if (SportsConnect.router && SportsConnect.router.init) {
            SportsConnect.router.init();
        }

        console.log('✅ SportsConnect Application Ready!');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        initApp();
    }
})();
