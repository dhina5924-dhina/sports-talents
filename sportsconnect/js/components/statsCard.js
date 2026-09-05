window.SportsConnect = window.SportsConnect || {};
SportsConnect.components = SportsConnect.components || {};

SportsConnect.components.statsCard = {
    render(stats, sport) {
        if (!stats) return '';

        let statsHtml = '';
        
        // Define default metrics if not provided based on sport
        let metrics = [];
        
        if (sport === 'Cricket') {
            metrics = [
                { label: 'Matches', value: stats.matches || 45 },
                { label: 'Runs', value: stats.runs || 1250 },
                { label: 'Batting Avg', value: stats.average || 34.5 },
                { label: 'High Score', value: stats.highScore || 112 },
                { label: 'Wickets', value: stats.wickets || 12 },
                { label: 'Catches', value: stats.catches || 24 }
            ];
        } else if (sport === 'Athletics') {
            metrics = [
                { label: 'Events', value: stats.events || 28 },
                { label: 'Gold Medals', value: stats.gold || 12 },
                { label: 'Personal Best', value: stats.pb || '10.8s' },
                { label: 'State Rank', value: stats.rank || '4th' }
            ];
        } else if (sport === 'Kabaddi') {
            metrics = [
                { label: 'Matches', value: stats.matches || 56 },
                { label: 'Raid Points', value: stats.raidPoints || 234 },
                { label: 'Tackle Points', value: stats.tacklePoints || 89 },
                { label: 'Super 10s', value: stats.super10s || 8 }
            ];
        } else {
            // Generic fallback
            const keys = Object.keys(stats);
            if (keys.length > 0) {
                metrics = keys.map(key => ({
                    label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
                    value: stats[key]
                }));
            } else {
                metrics = [
                    { label: 'Matches Played', value: 0 },
                    { label: 'Win Rate', value: '0%' }
                ];
            }
        }

        statsHtml = metrics.map(metric => `
            <div class="stats-card__item">
                <div class="stats-card__value">${metric.value}</div>
                <div class="stats-card__label">${metric.label}</div>
            </div>
        `).join('');

        return `
            <div class="stats-card">
                <div class="stats-card__header">
                    <h3 class="stats-card__title">${sport || 'Athletic'} Statistics</h3>
                </div>
                <div class="stats-card__grid">
                    ${statsHtml}
                </div>
            </div>
        `;
    },

    init() {
        // Display component
    }
};
