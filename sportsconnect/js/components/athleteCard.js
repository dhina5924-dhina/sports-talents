window.SportsConnect = window.SportsConnect || {};
SportsConnect.components = SportsConnect.components || {};

SportsConnect.components.athleteCard = {
    render(user) {
        if (!user) return '';

        const verifiedBadge = user.verified ? '<span class="verified-badge" title="Verified Athlete">✓</span>' : '';
        const topAchievement = user.achievements && user.achievements.length > 0 
            ? user.achievements[0].title 
            : 'Rising Star';

        return `
            <div class="athlete-card">
                <div class="athlete-card__cover" style="background: ${user.coverColor || 'linear-gradient(90deg, var(--primary), var(--secondary))'};"></div>
                <div class="athlete-card__body">
                    <div class="avatar athlete-card__avatar" style="background: ${user.avatarColor || 'var(--primary)'}">${user.avatar}</div>
                    
                    <div class="athlete-card__info">
                        <h3 class="athlete-card__name">
                            <a href="#profile?id=${user.id}">${user.fullName}</a>
                            ${verifiedBadge}
                        </h3>
                        <div class="athlete-card__username">@${user.username}</div>
                        
                        <div class="athlete-card__tags">
                            <span class="tag">${user.sport}</span>
                            <span class="tag tag--outline">${user.position || user.role}</span>
                        </div>
                        
                        <div class="athlete-card__location">
                            📍 ${user.location?.village || ''}, ${user.location?.district || ''}
                        </div>
                        
                        <div class="athlete-card__achievement">
                            🏆 ${topAchievement}
                        </div>
                    </div>
                    
                    <div class="athlete-card__stats">
                        <div class="stat">
                            <strong>${user.followersCount || 0}</strong>
                            <span>Followers</span>
                        </div>
                        <div class="stat">
                            <strong>${user.experience || '1 yr'}</strong>
                            <span>Experience</span>
                        </div>
                    </div>
                    
                    <div class="athlete-card__actions">
                        <button class="btn btn--primary follow-btn" data-id="${user.id}">Follow</button>
                        <a href="#messages?to=${user.id}" class="btn btn--outline">Message</a>
                    </div>
                </div>
            </div>
        `;
    },

    init() {
        document.querySelectorAll('.athlete-card .follow-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                if (this.classList.contains('btn--primary')) {
                    this.classList.remove('btn--primary');
                    this.classList.add('btn--secondary');
                    this.textContent = 'Following';
                } else {
                    this.classList.add('btn--primary');
                    this.classList.remove('btn--secondary');
                    this.textContent = 'Follow';
                }
            });
        });
    }
};
