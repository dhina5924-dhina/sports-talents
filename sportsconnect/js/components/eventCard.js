window.SportsConnect = window.SportsConnect || {};
SportsConnect.components = SportsConnect.components || {};

SportsConnect.components.eventCard = {
    render(event) {
        if (!event) return '';

        const dateObj = new Date(event.date);
        const day = dateObj.getDate() || event.date.split('-')[2] || '15';
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const month = monthNames[dateObj.getMonth()] || 'Oct';

        let statusClass = 'event-card__status--upcoming';
        if (event.status === 'ongoing') statusClass = 'event-card__status--ongoing';
        else if (event.status === 'completed') statusClass = 'event-card__status--completed';

        const actionButton = event.status === 'completed' 
            ? `<button class="btn btn--outline btn--full" onclick="window.location.hash='#events?id=${event.id}'">View Results</button>`
            : `<button class="btn btn--primary btn--full" onclick="window.location.hash='#events?id=${event.id}'">Register Now</button>`;

        return `
            <div class="event-card">
                <div class="event-card__banner" style="background: ${event.bannerColor || 'linear-gradient(135deg, var(--primary), var(--secondary))'};">
                    <div class="event-card__date-badge">
                        <span class="day">${day}</span>
                        <span class="month">${month}</span>
                    </div>
                    <div class="event-card__sport-icon">
                        ${this.getSportIcon(event.sport)}
                    </div>
                </div>
                
                <div class="event-card__content">
                    <div class="event-card__status ${statusClass}">${event.status.charAt(0).toUpperCase() + event.status.slice(1)}</div>
                    
                    <h3 class="event-card__title">${event.name}</h3>
                    <div class="event-card__tag"><span class="tag-sm">${event.sport}</span></div>
                    
                    <div class="event-card__meta">
                        <div class="meta-item">
                            <span class="icon">📍</span> 
                            <span>${event.venue}, ${event.location?.district || ''}</span>
                        </div>
                        <div class="meta-item">
                            <span class="icon">👥</span> 
                            <span>${event.participantsCount || 0} Participants</span>
                        </div>
                        <div class="meta-item">
                            <span class="icon">⏰</span> 
                            <span>${event.startTime || '09:00 AM'} - ${event.endTime || '05:00 PM'}</span>
                        </div>
                    </div>
                    
                    <div class="event-card__actions">
                        ${actionButton}
                    </div>
                </div>
            </div>
        `;
    },

    getSportIcon(sport) {
        const icons = {
            'Cricket': '🏏', 'Football': '⚽', 'Volleyball': '🏐', 'Basketball': '🏀',
            'Kabaddi': '🤼', 'Athletics': '🏃', 'Badminton': '🏸', 'Hockey': '🏑',
            'Tennis': '🎾', 'Table Tennis': '🏓', 'Wrestling': '💪', 'Boxing': '🥊',
            'Swimming': '🏊', 'Archery': '🏹', 'Weightlifting': '🏋️', 'Kho-Kho': '🏃‍♂️'
        };
        return icons[sport] || '🏆';
    },

    init() {
        // Event listeners are inline (onclick) for simpler routing, but could be added here
    }
};
