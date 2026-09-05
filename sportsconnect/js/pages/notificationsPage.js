window.SportsConnect = window.SportsConnect || {};
SportsConnect.pages = SportsConnect.pages || {};

SportsConnect.pages.notificationsPage = {
    render() {
        const store = SportsConnect.store;
        const notifs = store ? store.getNotifications() : [];

        let notifHtml = notifs.map(n => `
            <div class="notif-item ${!n.read ? 'unread' : ''}" data-id="${n.id}" style="display: flex; gap: 16px; padding: 16px 20px; background: ${n.read ? 'var(--surface)' : 'var(--surface-hover)'}; border-left: 4px solid ${n.read ? 'transparent' : 'var(--primary)'}; border-bottom: 1px solid var(--border); cursor: pointer; transition: background 0.2s;">
                <div style="width: 44px; height: 44px; border-radius: 50%; background: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0;">
                    ${n.type === 'like' ? '❤️' : n.type === 'comment' ? '💬' : n.type === 'follow' ? '👤' : '🔔'}
                </div>
                <div style="flex: 1;">
                    <p style="margin: 0 0 4px 0; font-size: 14px; color: var(--text); line-height: 1.4;">${n.text}</p>
                    <span style="font-size: 12px; color: var(--text-muted);">${n.time}</span>
                </div>
            </div>
        `).join('');

        if (!notifs.length) {
            notifHtml = `
                <div style="padding: 40px; text-align: center; color: var(--text-muted);">
                    <span style="font-size: 48px; display: block; margin-bottom: 12px;">🔔</span>
                    <h3>No Notifications Yet</h3>
                    <p>When athletes, coaches, or events interact with you, updates will appear here.</p>
                </div>
            `;
        }

        return `
            <div class="notifications-page card">
                <div style="padding: 20px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
                    <h2 style="margin: 0; font-size: 20px;">Notifications 🔔</h2>
                    <button id="mark-read-btn" class="btn btn--outline btn--sm">Mark All Read</button>
                </div>
                <div class="notifications-list">
                    ${notifHtml}
                </div>
            </div>
        `;
    },

    init() {
        const btn = document.getElementById('mark-read-btn');
        if (btn) {
            btn.addEventListener('click', () => {
                SportsConnect.store.markAllNotificationsRead();
                SportsConnect.router.handleRoute();
            });
        }
    }
};
