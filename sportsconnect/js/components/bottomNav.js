window.SportsConnect = window.SportsConnect || {};
SportsConnect.components = SportsConnect.components || {};

SportsConnect.components.bottomNav = {
    render(currentHash = '') {
        const baseHash = currentHash.split('?')[0];
        
        const navItems = [
            { id: 'home', icon: '🏠', label: 'Home', hash: '#feed' },
            { id: 'discover', icon: '🔍', label: 'Discover', hash: '#discovery' },
            { id: 'create', icon: '+', label: 'Create', isCreate: true },
            { id: 'events', icon: '📅', label: 'Events', hash: '#events' },
            { id: 'profile', icon: '👤', label: 'Profile', hash: '#profile' }
        ];

        const itemsHtml = navItems.map(item => {
            if (item.isCreate) {
                return `
                    <button class="bottom-nav__item bottom-nav__item--create" id="mobile-create-btn">
                        <div class="bottom-nav__create-icon">${item.icon}</div>
                    </button>
                `;
            }

            const isActive = (baseHash === item.hash) || (baseHash === '' && item.hash === '#feed') ? 'active' : '';
            return `
                <a href="${item.hash}" class="bottom-nav__item ${isActive}">
                    <span class="bottom-nav__icon">${item.icon}</span>
                    <span class="bottom-nav__label">${item.label}</span>
                </a>
            `;
        }).join('');

        return `
            <nav class="bottom-nav mobile-only">
                <div class="bottom-nav__container">
                    ${itemsHtml}
                </div>
            </nav>
        `;
    },

    init() {
        const createBtn = document.getElementById('mobile-create-btn');
        if (createBtn) {
            createBtn.addEventListener('click', () => {
                // Check if modal component exists, if so open composer modal
                if (SportsConnect.components.modal && SportsConnect.components.postComposer) {
                    const currentUser = SportsConnect.store ? SportsConnect.store.getCurrentUser() : null;
                    SportsConnect.components.modal.open({
                        title: 'Create Post',
                        content: SportsConnect.components.postComposer.render(currentUser),
                        size: 'md',
                        showFooter: false,
                        onOpen: () => {
                            SportsConnect.components.postComposer.init();
                        }
                    });
                } else {
                    // Fallback
                    alert('Create functionality not available');
                }
            });
        }
    }
};
