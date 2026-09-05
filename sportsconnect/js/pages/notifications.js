window.SportsConnect = window.SportsConnect || {};
SportsConnect.pages = SportsConnect.pages || {};

SportsConnect.pages.notificationsPage = {
    render() {
        const notifs = [
            { id: 1, type: 'like', text: '<strong>Coach Ravi</strong> liked your post.', time: '10 mins ago', icon: '❤️', iconBg: 'var(--error)', read: false },
            { id: 2, type: 'comment', text: '<strong>Siva Kumar</strong> commented on your video.', time: '2 hours ago', icon: '💬', iconBg: 'var(--info)', read: false },
            { id: 3, type: 'follow', text: '<strong>Theni Athletics Club</strong> started following you.', time: 'Yesterday', icon: '👤', iconBg: 'var(--primary)', read: true },
            { id: 4, type: 'event', text: 'Upcoming event: <strong>District Meet</strong> starts tomorrow.', time: 'Yesterday', icon: '📅', iconBg: 'var(--warning)', read: true },
            { id: 5, type: 'achievement', text: 'Congratulations! You earned the <strong>Top Sprinter</strong> badge.', time: '2 days ago', icon: '🏆', iconBg: 'var(--success)', read: true }
        ];

        let notifHtml = notifs.map(n => `
            <div class="notif-item" data-id="${n.id}" data-type="${n.type}" style="display: flex; gap: 16px; padding: 16px 20px; background: ${n.read ? 'var(--surface)' : 'var(--primary-light)11'}; border-left: 4px solid ${n.read ? 'transparent' : 'var(--primary)'}; border-bottom: 1px solid var(--border); cursor: pointer; transition: background 0.2s;">
                <div style="width: 44px; height: 44px; border-radius: 50%; background: ${n.iconBg}22; color: ${n.iconBg}; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0;">
                    ${n.icon}
                </div>
                <div style="flex: 1;">
                    <p style="margin: 0 0 4px 0; font-size: 14px; color: var(--text); line-height: 1.4;">${n.text}</p>
                    <p style="margin: 0; font-size: 12px; color: var(--text-secondary);">${n.time}</p>
                </div>
                ${!n.read ? `<div style="width: 10px; height: 10px; border-radius: 50%; background: var(--primary); align-self: center;"></div>` : ''}
            </div>
        `).join('');

        return `
        <div class="page-container" style="padding-bottom: var(--space-4xl); max-width: 800px; margin: 0 auto;">
            <div style="background: var(--surface); border-radius: var(--radius-xl); border: 1px solid var(--border); box-shadow: var(--shadow-sm); overflow: hidden;">
                <header style="padding: 20px 24px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; background: var(--surface);">
                    <h1 style="font-family: 'Outfit', sans-serif; font-size: 24px; margin: 0;">Notifications 🔔</h1>
                    <button id="mark-all-read" style="background: none; border: none; color: var(--primary); font-size: 14px; font-weight: 500; cursor: pointer; hover: underline;">Mark all as read</button>
                </header>
                
                <div class="notif-filters" style="display: flex; overflow-x: auto; border-bottom: 1px solid var(--border); background: var(--surface);">
                    <button class="notif-filter active" data-filter="all" style="padding: 16px 24px; background: none; border: none; border-bottom: 2px solid var(--primary); color: var(--primary); font-weight: 600; cursor: pointer; white-space: nowrap;">All</button>
                    <button class="notif-filter" data-filter="like" style="padding: 16px 24px; background: none; border: none; border-bottom: 2px solid transparent; color: var(--text-secondary); cursor: pointer; white-space: nowrap;">Likes</button>
                    <button class="notif-filter" data-filter="comment" style="padding: 16px 24px; background: none; border: none; border-bottom: 2px solid transparent; color: var(--text-secondary); cursor: pointer; white-space: nowrap;">Comments</button>
                    <button class="notif-filter" data-filter="follow" style="padding: 16px 24px; background: none; border: none; border-bottom: 2px solid transparent; color: var(--text-secondary); cursor: pointer; white-space: nowrap;">Follows</button>
                    <button class="notif-filter" data-filter="event" style="padding: 16px 24px; background: none; border: none; border-bottom: 2px solid transparent; color: var(--text-secondary); cursor: pointer; white-space: nowrap;">Events</button>
                </div>
                
                <div id="notif-list" style="display: flex; flex-direction: column;">
                    ${notifHtml}
                </div>
                
                <!-- Empty State -->
                <div id="notif-empty" style="display: none; padding: 60px 20px; text-align: center;">
                    <div style="font-size: 48px; margin-bottom: 16px; opacity: 0.5;">📭</div>
                    <h3 style="font-family: 'Outfit', sans-serif; color: var(--text); margin-bottom: 8px;">No notifications yet</h3>
                    <p style="color: var(--text-secondary); font-size: 14px;">Start engaging with the community to see updates here! 🏅</p>
                </div>
            </div>
        </div>
        <style>
            .notif-item:hover { background: var(--surface-hover) !important; }
        </style>
        `;
    },
    
    init() {
        const filters = document.querySelectorAll('.notif-filter');
        const items = document.querySelectorAll('.notif-item');
        const emptyState = document.getElementById('notif-empty');
        
        // Mark all as read
        document.getElementById('mark-all-read').addEventListener('click', () => {
            items.forEach(item => {
                item.style.background = 'var(--surface)';
                item.style.borderLeftColor = 'transparent';
                const dot = item.querySelector('div[style*="width: 10px"]');
                if (dot) dot.remove();
            });
        });
        
        // Item click to mark as read
        items.forEach(item => {
            item.addEventListener('click', () => {
                item.style.background = 'var(--surface)';
                item.style.borderLeftColor = 'transparent';
                const dot = item.querySelector('div[style*="width: 10px"]');
                if (dot) dot.remove();
            });
        });
        
        // Filtering
        filters.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state
                filters.forEach(b => {
                    b.classList.remove('active');
                    b.style.borderBottomColor = 'transparent';
                    b.style.color = 'var(--text-secondary)';
                    b.style.fontWeight = 'normal';
                });
                btn.classList.add('active');
                btn.style.borderBottomColor = 'var(--primary)';
                btn.style.color = 'var(--primary)';
                btn.style.fontWeight = '600';
                
                const filter = btn.getAttribute('data-filter');
                let visibleCount = 0;
                
                items.forEach(item => {
                    if (filter === 'all' || item.getAttribute('data-type') === filter) {
                        item.style.display = 'flex';
                        visibleCount++;
                    } else {
                        item.style.display = 'none';
                    }
                });
                
                emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
            });
        });
    }
};
