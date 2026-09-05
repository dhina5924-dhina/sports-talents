window.SportsConnect = window.SportsConnect || {};

(function() {
    class Router {
        constructor() {
            this.routes = {
                '': 'landing',
                'landing': 'landing',
                'auth': 'auth',
                'feed': 'feed',
                'profile': 'profile',
                'discovery': 'discovery',
                'sports': 'sports',
                'events': 'events',
                'videos': 'videos',
                'village': 'village',
                'messages': 'messagesPage',
                'notifications': 'notificationsPage',
                'search': 'search',
                'settings': 'settings',
                'admin': 'admin'
            };

            window.addEventListener('hashchange', () => this.handleRoute());
        }

        parseHash() {
            const raw = window.location.hash.replace(/^#/, '');
            const [pathWithParams, queryString] = raw.split('?');
            const path = pathWithParams || 'landing';

            const params = {};
            if (queryString) {
                const searchParams = new URLSearchParams(queryString);
                for (const [key, value] of searchParams.entries()) {
                    params[key] = value;
                }
            }

            return { path, params };
        }

        navigate(hash) {
            window.location.hash = hash.startsWith('#') ? hash : '#' + hash;
        }

        handleRoute() {
            const { path, params } = this.parseHash();
            const pageKey = this.routes[path] || 'landing';
            const pageObj = SportsConnect.pages && SportsConnect.pages[pageKey];

            const appElem = document.getElementById('app');
            if (!appElem) return;

            if (!pageObj) {
                console.warn(`Page '${pageKey}' not found. Redirecting to landing.`);
                this.navigate('landing');
                return;
            }

            // Determine if full-screen page (landing, auth) or main layout page
            const isFullScreen = (pageKey === 'landing' || pageKey === 'auth');

            if (isFullScreen) {
                appElem.className = 'app-fullscreen';
                appElem.innerHTML = pageObj.render(params);
            } else {
                appElem.className = 'app-container';
                
                const navbarHtml = SportsConnect.components.navbar ? SportsConnect.components.navbar.render() : '';
                const leftSidebarHtml = SportsConnect.components.sidebar ? SportsConnect.components.sidebar.renderLeft(path) : '';
                const rightSidebarHtml = SportsConnect.components.sidebar ? SportsConnect.components.sidebar.renderRight() : '';
                const bottomNavHtml = SportsConnect.components.bottomNav ? SportsConnect.components.bottomNav.render(path) : '';
                
                const hideRightSidebar = ['profile', 'messagesPage', 'settings', 'admin', 'events', 'videos'].includes(pageKey);

                appElem.innerHTML = `
                    ${navbarHtml}
                    <div class="app-layout">
                        <aside class="app-layout__sidebar-left">
                            ${leftSidebarHtml}
                        </aside>
                        <main class="app-layout__main ${hideRightSidebar ? 'app-layout__main--full' : ''}">
                            ${pageObj.render(params)}
                        </main>
                        ${!hideRightSidebar ? `
                            <aside class="app-layout__sidebar-right">
                                ${rightSidebarHtml}
                            </aside>
                        ` : ''}
                    </div>
                    ${bottomNavHtml}
                `;
            }

            // Scroll to top
            window.scrollTo(0, 0);

            // Initialize components and page event listeners
            setTimeout(() => {
                if (!isFullScreen) {
                    if (SportsConnect.components.navbar && SportsConnect.components.navbar.init) {
                        SportsConnect.components.navbar.init();
                    }
                    if (SportsConnect.components.sidebar && SportsConnect.components.sidebar.init) {
                        SportsConnect.components.sidebar.init();
                    }
                    if (SportsConnect.components.bottomNav && SportsConnect.components.bottomNav.init) {
                        SportsConnect.components.bottomNav.init();
                    }
                }
                if (pageObj.init) {
                    pageObj.init(params);
                }
            }, 0);
        }

        init() {
            this.handleRoute();
        }
    }

    SportsConnect.router = new Router();
})();
