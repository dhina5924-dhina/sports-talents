window.SportsConnect = window.SportsConnect || {};
SportsConnect.components = SportsConnect.components || {};

SportsConnect.components.sidebar = {
    renderLeft(currentUser, currentHash) {
        const navItems = [
            { icon: '🏠', label: 'Home', hash: '#feed' },
            { icon: '🔍', label: 'Explore', hash: '#discovery' },
            { icon: '🌟', label: 'Talent Discovery', hash: '#discovery' },
            { icon: '⚽', label: 'Sports', hash: '#sports' },
            { icon: '📅', label: 'Events', hash: '#events' },
            { icon: '👥', label: 'Teams', hash: '#sports?tab=teams' },
            { icon: '🎬', label: 'Videos', hash: '#videos' },
            { icon: '🏘️', label: 'Village Sports', hash: '#village' },
            { icon: '💬', label: 'Messages', hash: '#messages' },
            { icon: '🔔', label: 'Notifications', hash: '#notifications' },
            { icon: '📌', label: 'Saved Posts', hash: '#feed?filter=saved' },
            { icon: '👤', label: 'My Profile', hash: currentUser ? `#profile?id=${currentUser.id}` : '#profile' },
            { icon: '⚙️', label: 'Settings', hash: '#settings' }
        ];

        let profileHtml = '';
        if (currentUser) {
            profileHtml = `
                <div class="sidebar__profile-card">
                    <div class="avatar sidebar__profile-avatar" style="background: ${currentUser.avatarColor || 'var(--primary)'}">${currentUser.avatar || '👤'}</div>
                    <div class="sidebar__profile-info">
                        <div class="sidebar__profile-name">${currentUser.fullName}</div>
                        <div class="sidebar__profile-sport">${currentUser.sport}</div>
                    </div>
                    <a href="#profile?id=${currentUser.id}" class="sidebar__profile-link">View Profile</a>
                </div>
            `;
        }

        const navHtml = navItems.map(item => {
            const isActive = currentHash === item.hash || (currentHash === '' && item.hash === '#feed') ? 'active' : '';
            return `
                <a href="${item.hash}" class="sidebar__nav-item ${isActive}" data-navigate="${item.hash}">
                    <span class="sidebar__nav-icon">${item.icon}</span>
                    <span class="sidebar__nav-label">${item.label}</span>
                </a>
            `;
        }).join('');

        return `
            <div class="sidebar sidebar--left">
                ${profileHtml}
                <div class="sidebar__nav">
                    ${navHtml}
                </div>
            </div>
        `;
    },
    
    renderRight(data) {
        // Dummy data for widgets if not provided
        const trending = data?.trending || [
            { id: 2, name: 'Kavya S.', sport: 'Athletics', avatar: '🏃‍♀️', color: '#f59e0b' },
            { id: 3, name: 'Rahul R.', sport: 'Cricket', avatar: '🏏', color: '#10b981' },
            { id: 4, name: 'Priya M.', sport: 'Badminton', avatar: '🏸', color: '#3b82f6' }
        ];

        const events = data?.events || [
            { id: 1, name: 'State Meet', date: 'Oct 15', sport: 'Athletics' },
            { id: 2, name: 'T20 Final', date: 'Oct 20', sport: 'Cricket' }
        ];

        const trendingHtml = trending.map(athlete => `
            <div class="widget__item">
                <div class="avatar widget__avatar" style="background: ${athlete.color}">${athlete.avatar}</div>
                <div class="widget__info">
                    <div class="widget__name">${athlete.name}</div>
                    <div class="widget__sub">${athlete.sport}</div>
                </div>
                <button class="btn btn--secondary btn--sm widget__follow-btn" data-id="${athlete.id}">Follow</button>
            </div>
        `).join('');

        const eventsHtml = events.map(event => `
            <div class="widget__item">
                <div class="widget__date-badge">
                    <span>${event.date.split(' ')[0]}</span>
                    <strong>${event.date.split(' ')[1]}</strong>
                </div>
                <div class="widget__info">
                    <div class="widget__name">${event.name}</div>
                    <div class="widget__sub">${event.sport}</div>
                </div>
            </div>
        `).join('');

        return `
            <div class="sidebar sidebar--right">
                <div class="widget">
                    <h3 class="widget__title">Trending Athletes</h3>
                    <div class="widget__content">
                        ${trendingHtml}
                    </div>
                </div>
                <div class="widget">
                    <h3 class="widget__title">Upcoming Events</h3>
                    <div class="widget__content">
                        ${eventsHtml}
                    </div>
                </div>
                <div class="widget">
                    <div class="widget__footer">
                        <a href="#about">About</a> • <a href="#privacy">Privacy</a> • <a href="#terms">Terms</a>
                        <p>© 2026 SportsConnect</p>
                    </div>
                </div>
            </div>
        `;
    },

    init() {
        document.querySelectorAll('.widget__follow-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const button = e.target;
                if (button.classList.contains('btn--secondary')) {
                    button.classList.remove('btn--secondary');
                    button.classList.add('btn--outline');
                    button.textContent = 'Following';
                } else {
                    button.classList.add('btn--secondary');
                    button.classList.remove('btn--outline');
                    button.textContent = 'Follow';
                }
            });
        });
    }
};
