window.SportsConnect = window.SportsConnect || {};
SportsConnect.components = SportsConnect.components || {};

SportsConnect.components.postCard = {
    render(post) {
        if (!post) return '';

        const isAchievement = post.type === 'achievement';
        const achievementBadge = isAchievement ? `
            <div class="post-card__achievement-badge">
                🏆 Achievement Unlocked
            </div>
        ` : '';

        // Handle Media Grid
        let mediaHtml = '';
        if (post.images && post.images.length > 0) {
            const countClass = post.images.length > 4 ? 'grid-4' : \`grid-\${post.images.length}\`;
            mediaHtml = \`<div class="post-card__media \${countClass}">\`;
            post.images.slice(0, 4).forEach((img, index) => {
                const overlay = (index === 3 && post.images.length > 4) ? \`<div class="media-overlay">+\${post.images.length - 4}</div>\` : '';
                mediaHtml += \`
                    <div class="media-item" style="background: linear-gradient(45deg, var(--primary), var(--secondary));">
                        <span>\${img}</span>
                        \${overlay}
                    </div>
                \`;
            });
            mediaHtml += \`</div>\`;
        } else if (post.video) {
            mediaHtml = \`
                <div class="post-card__media video-container" style="background: linear-gradient(135deg, #1e293b, #0f172a);">
                    <div class="play-btn">▶</div>
                    <span class="video-title">\${post.video}</span>
                </div>
            \`;
        }

        const likedClass = post.liked ? 'liked' : '';
        const savedClass = post.saved ? 'saved' : '';

        return `
            <div class="post-card" id="post-${post.id}">
                ${achievementBadge}
                <div class="post-card__header">
                    <div class="avatar" style="background: ${post.userAvatarColor || 'var(--primary)'}">${post.userAvatar || '👤'}</div>
                    <div class="post-card__meta">
                        <a href="#profile?id=${post.userId}" class="post-card__name">${post.userName || 'User'}</a>
                        <div class="post-card__time">
                            ${post.timestamp} • <span class="tag-sm">${post.sport || 'Sports'}</span>
                        </div>
                    </div>
                    <button class="icon-btn post-card__options">⋮</button>
                </div>
                
                <div class="post-card__body">
                    <p class="post-card__text">${post.text}</p>
                    ${mediaHtml}
                </div>
                
                <div class="post-card__stats">
                    <span><span class="like-count">${post.likesCount}</span> Likes</span>
                    <span>${post.commentsCount} Comments • ${post.sharesCount} Shares</span>
                </div>
                
                <div class="post-card__actions">
                    <button class="action-btn like-btn ${likedClass}" data-id="${post.id}">
                        <span class="icon">❤️</span> Like
                    </button>
                    <button class="action-btn comment-btn" data-id="${post.id}">
                        <span class="icon">💬</span> Comment
                    </button>
                    <button class="action-btn share-btn" data-id="${post.id}">
                        <span class="icon">🔄</span> Share
                    </button>
                    <button class="action-btn save-btn ${savedClass}" data-id="${post.id}">
                        <span class="icon">🔖</span> Save
                    </button>
                </div>
                <div class="post-card__comments-container" id="comments-${post.id}"></div>
            </div>
        `;
    },

    init() {
        document.querySelectorAll('.like-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                this.classList.toggle('liked');
                const countSpan = this.closest('.post-card').querySelector('.like-count');
                let count = parseInt(countSpan.textContent);
                if (this.classList.contains('liked')) {
                    count++;
                } else {
                    count--;
                }
                countSpan.textContent = count;
            });
        });

        document.querySelectorAll('.save-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                this.classList.toggle('saved');
            });
        });
    }
};
