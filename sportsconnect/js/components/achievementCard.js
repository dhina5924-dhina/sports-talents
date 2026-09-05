window.SportsConnect = window.SportsConnect || {};
SportsConnect.components = SportsConnect.components || {};

SportsConnect.components.achievementCard = {
    render(achievement) {
        if (!achievement) return '';

        let icon = '🏆';
        let accentColor = 'var(--accent)'; // default orange/gold

        if (achievement.type === 'medal') {
            if (achievement.rank === '1st') { icon = '🥇'; accentColor = '#fbbf24'; }
            else if (achievement.rank === '2nd') { icon = '🥈'; accentColor = '#94a3b8'; }
            else if (achievement.rank === '3rd') { icon = '🥉'; accentColor = '#b45309'; }
            else icon = '🏅';
        } else if (achievement.type === 'certificate') {
            icon = '📜';
            accentColor = 'var(--info)';
        } else if (achievement.type === 'championship') {
            icon = '👑';
            accentColor = 'var(--primary)';
        } else if (achievement.type === 'record') {
            icon = '⚡';
            accentColor = 'var(--secondary)';
        }

        return `
            <div class="achievement-card">
                <div class="achievement-card__indicator" style="background: ${accentColor};"></div>
                <div class="achievement-card__icon" style="color: ${accentColor}; background: ${accentColor}20;">
                    ${icon}
                </div>
                <div class="achievement-card__content">
                    <h4 class="achievement-card__title">${achievement.title}</h4>
                    <div class="achievement-card__meta">
                        <span>${achievement.competition}</span> • 
                        <span>${achievement.date}</span>
                    </div>
                    <div class="achievement-card__details">
                        <span class="tag-sm">${achievement.sport}</span>
                        ${achievement.rank ? `<span class="tag-sm tag--outline">Rank: ${achievement.rank}</span>` : ''}
                        ${achievement.location ? `<span class="tag-sm tag--outline">📍 ${achievement.location}</span>` : ''}
                    </div>
                    ${achievement.description ? `<p class="achievement-card__desc">${achievement.description}</p>` : ''}
                </div>
            </div>
        `;
    },

    init() {
        // Static component, no complex JS needed
    }
};
