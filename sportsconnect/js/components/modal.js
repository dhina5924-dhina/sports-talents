window.SportsConnect = window.SportsConnect || {};
SportsConnect.components = SportsConnect.components || {};

SportsConnect.components.modal = {
    render(options = {}) {
        const sizeClass = options.size ? \`modal--\${options.size}\` : 'modal--md';
        const title = options.title || '';
        const content = options.content || '';
        
        let footerHtml = '';
        if (options.showFooter !== false) {
            const buttons = options.footerButtons || \`
                <button class="btn btn--ghost modal-close-btn">Cancel</button>
                <button class="btn btn--primary" id="modal-confirm-btn">Confirm</button>
            \`;
            footerHtml = \`<div class="modal__footer">\${buttons}</div>\`;
        }

        return \`
            <div class="modal-overlay" id="global-modal">
                <div class="modal \${sizeClass}">
                    <div class="modal__header">
                        <h2 class="modal__title">\${title}</h2>
                        <button class="icon-btn modal-close-btn">✕</button>
                    </div>
                    <div class="modal__body">
                        \${content}
                    </div>
                    \${footerHtml}
                </div>
            </div>
        \`;
    },

    open(options) {
        // Remove existing modal if any
        const existing = document.getElementById('global-modal');
        if (existing) existing.remove();

        // Inject new modal
        const html = this.render(options);
        document.body.insertAdjacentHTML('beforeend', html);
        
        const modalEl = document.getElementById('global-modal');
        
        // Setup close listeners
        const closeBtns = modalEl.querySelectorAll('.modal-close-btn');
        closeBtns.forEach(btn => {
            btn.addEventListener('click', () => this.close());
        });

        // Close on overlay click
        modalEl.addEventListener('click', (e) => {
            if (e.target === modalEl) this.close();
        });

        // Show with slight delay for animation
        setTimeout(() => {
            modalEl.classList.add('show');
        }, 10);
        
        document.body.style.overflow = 'hidden'; // prevent background scrolling
        
        if (options.onOpen && typeof options.onOpen === 'function') {
            options.onOpen(modalEl);
        }
    },

    close() {
        const modalEl = document.getElementById('global-modal');
        if (modalEl) {
            modalEl.classList.remove('show');
            setTimeout(() => {
                modalEl.remove();
                document.body.style.overflow = '';
            }, 300); // wait for transition
        }
    },

    init() {
        // Global escape key handler
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.close();
            }
        });
    }
};
