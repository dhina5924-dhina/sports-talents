window.SportsConnect = window.SportsConnect || {};
SportsConnect.components = SportsConnect.components || {};

SportsConnect.components.notifications = {
    renderDropdown(notifications = []) {
        let contentHtml = '';

        if (notifications.length === 0) {
            contentHtml = `
                <div class="notifications__empty">
                    <div class="icon">🔔</div>
                    <p>No new notifications</p>
                </div>
            `;
        } else {
            contentHtml = `
                <div class="notifications__list">
                    ${notifications.slice(0, 5).map(n => this.renderItem(n)).join('')}
                </div>
                <div class="notifications__footer">
                    <a href="#notifications">See all notifications</a>
                </div>
            `;
        }

        return `
            <div class="notifications-panel">
                <div class="notifications__header">
                    <h3>Notifications</h3>
                    <button class="btn btn--ghost btn--sm" id="mark-all-read">Mark all read</button>
                </div>
                ${contentHtml}
            </div>
        `;
    },

    renderItem(notification) {
        const typeIcons = {
            like: { icon: '❤️', color: 'var(--error)' },
            comment: { icon: '💬', color: 'var(--primary)' },
            follow: { icon: '👤', color: 'var(--info)' },
            message: { icon: '✉️', color: 'var(--secondary)' },
            event: { icon: '📅', color: 'var(--warning)' },
            achievement: { icon: '🏆', color: 'var(--accent)' },
            verification: { icon: '✅', color: 'var(--verified)' }
        };

        const typeInfo = typeIcons[notification.type] || { icon: '🔔', color: 'var(--text)' };
        const unreadClass = notification.read ? '' : 'notification-item--unread';

        return `
            <div class="notification-item ${unreadClass}" data-id="${notification.id}" data-link="${notification.link || '#'}">
                <div class="notification-item__icon" style="background: ${typeInfo.color}20; color: ${typeInfo.color};">
                    ${typeInfo.icon}
                </div>
                <div class="notification-item__content">
                    <div class="notification-item__text">${notification.text}</div>
                    <div class="notification-item__time">${notification.timestamp}</div>
                </div>
                ${!notification.read ? '<div class="notification-item__dot"></div>' : ''}
            </div>
        `;
    },

    init() {
        document.addEventListener('click', (e) => {
            const item = e.target.closest('.notification-item');
            if (item) {
                // Mark as read visually
                item.classList.remove('notification-item--unread');
                const dot = item.querySelector('.notification-item__dot');
                if (dot) dot.remove();
                
                // Navigate
                const link = item.dataset.link;
                if (link && link !== '#') {
                    window.location.hash = link;
                }
            }

            if (e.target.id === 'mark-all-read') {
                document.querySelectorAll('.notification-item--unread').forEach(item => {
                    item.classList.remove('notification-item--unread');
                    const dot = item.querySelector('.notification-item__dot');
                    if (dot) dot.remove();
                });
                
                // Update navbar badge if exists
                const badge = document.querySelector('#notifications-toggle .navbar__badge');
                if (badge) badge.style.display = 'none';
            }
        });
    }
};
