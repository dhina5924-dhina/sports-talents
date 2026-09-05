window.SportsConnect = window.SportsConnect || {};
SportsConnect.components = SportsConnect.components || {};

SportsConnect.components.videoCard = {
    render(video) {
        if (!video) return '';

        return `
            <div class="video-card" onclick="window.location.hash='#videos?id=${video.id}'">
                <div class="video-card__thumbnail" style="background: linear-gradient(135deg, #1e293b, #0f172a);">
                    <div class="video-card__play-btn">▶</div>
                    <div class="video-card__duration">${video.duration || '3:45'}</div>
                </div>
                
                <div class="video-card__info">
                    <div class="avatar video-card__avatar" style="background: ${video.userAvatarColor || 'var(--primary)'}">${video.userAvatar || '👤'}</div>
                    <div class="video-card__details">
                        <h4 class="video-card__title">${video.title || video.text || 'Sports Video'}</h4>
                        <div class="video-card__meta">
                            <span class="video-card__author">${video.userName || 'Athlete'}</span>
                            <span class="video-card__dot">•</span>
                            <span class="video-card__views">${video.viewsCount || 0} views</span>
                            <span class="video-card__dot">•</span>
                            <span class="video-card__time">${video.timestamp || '2 days ago'}</span>
                        </div>
                        <div class="video-card__tag">
                            <span class="tag-sm">${video.sport || 'Sports'}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    init() {
        // Handled via onclick in HTML
    }
};
