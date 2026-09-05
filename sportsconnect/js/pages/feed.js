window.SportsConnect = window.SportsConnect || {};
SportsConnect.pages = SportsConnect.pages || {};

SportsConnect.pages.feed = {
    render() {
        const posts = SportsConnect.data ? SportsConnect.data.posts : [];
        const users = SportsConnect.data ? SportsConnect.data.users : [];
        const events = SportsConnect.data ? SportsConnect.data.events : [];
        
        // Stories mock
        const storiesHtml = users.slice(0, 8).map((u, i) => `
            <div class="story-item ${i===0 ? 'story-item--add' : ''}">
                <div class="story-avatar" style="${i===0 ? '' : 'border: 2px solid var(--primary-light); padding: 2px; border-radius: 50%;'}">
                    <div class="avatar" style="background: ${u.avatarColor}; width: 56px; height: 56px; font-size: 24px;">${i===0 ? '+' : u.avatar}</div>
                </div>
                <span class="story-name">${i===0 ? 'Add Story' : u.username.substring(0,8)}</span>
            </div>
        `).join('');

        let feedHtml = '';
        
        posts.forEach((post, index) => {
            if (SportsConnect.components && SportsConnect.components.postCard) {
                feedHtml += SportsConnect.components.postCard.render(post);
            } else {
                feedHtml += `<div class="post-card">Post ${post.id}</div>`;
            }

            // Inject suggestions every 3 posts
            if ((index + 1) % 3 === 0 && index < posts.length - 1) {
                const randomAthletes = users.filter(u=>u.role==='athlete').sort(()=>0.5-Math.random()).slice(0,3);
                let athletesHtml = randomAthletes.map(a => `
                    <div class="suggested-athlete">
                        <div class="avatar" style="background: ${a.avatarColor}; width: 48px; height: 48px;">${a.avatar}</div>
                        <div class="info">
                            <h5>${a.fullName}</h5>
                            <span>${a.sport}</span>
                        </div>
                        <button class="btn btn--outline btn--small">Follow</button>
                    </div>
                `).join('');
                
                feedHtml += `
                    <div class="feed-suggestion-box">
                        <h4>Suggested Athletes</h4>
                        <div class="suggestion-list">
                            ${athletesHtml}
                        </div>
                    </div>
                `;
            }
            
            // Inject event every 5 posts
            if ((index + 1) % 5 === 0 && events.length > 0) {
                const event = events[0];
                feedHtml += `
                    <div class="feed-suggestion-box">
                        <h4>Upcoming Event</h4>
                        ${SportsConnect.components && SportsConnect.components.eventCard ? SportsConnect.components.eventCard.render(event) : '<div>Event</div>'}
                    </div>
                `;
            }
        });

        const composerHtml = SportsConnect.components && SportsConnect.components.postComposer ? SportsConnect.components.postComposer.render() : '<div class="composer-placeholder">Composer</div>';

        return `
            <div class="page-feed">
                <div class="feed-container">
                    
                    <!-- Stories -->
                    <div class="stories-row horizontal-scroll-container">
                        ${storiesHtml}
                    </div>

                    <!-- Composer -->
                    <div class="feed-composer">
                        ${composerHtml}
                    </div>

                    <!-- Filters -->
                    <div class="feed-filters">
                        <button class="filter-chip active" data-filter="all">All</button>
                        <button class="filter-chip" data-filter="photos">📸 Photos</button>
                        <button class="filter-chip" data-filter="videos">🎥 Videos</button>
                        <button class="filter-chip" data-filter="achievements">🏆 Achievements</button>
                        <button class="filter-chip" data-filter="events">📅 Events</button>
                        <button class="filter-chip" data-filter="nearby">📍 Nearby</button>
                    </div>

                    <!-- Posts Stream -->
                    <div class="posts-stream" id="posts-stream">
                        <div class="feed-skeleton">
                            <div class="skeleton-post"></div>
                            <div class="skeleton-post"></div>
                            <div class="skeleton-post"></div>
                        </div>
                        <div class="posts-content hidden">
                            ${feedHtml}
                            <div class="feed-end-message">
                                <h3>You're all caught up! ✅</h3>
                                <p>You've seen all new posts from your network.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    init() {
        // Simulate loading
        setTimeout(() => {
            const skeleton = document.querySelector('.feed-skeleton');
            const content = document.querySelector('.posts-content');
            if (skeleton && content) {
                skeleton.classList.add('hidden');
                content.classList.remove('hidden');
            }
        }, 500);

        // Filter chips
        const chips = document.querySelectorAll('.filter-chip');
        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                chips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                
                // Simulate filtering (just show loading then content again)
                const content = document.querySelector('.posts-content');
                const skeleton = document.querySelector('.feed-skeleton');
                if (content && skeleton) {
                    content.classList.add('hidden');
                    skeleton.classList.remove('hidden');
                    setTimeout(() => {
                        skeleton.classList.add('hidden');
                        content.classList.remove('hidden');
                    }, 300);
                }
            });
        });

        // Initialize components
        if (SportsConnect.components && SportsConnect.components.postComposer) {
            SportsConnect.components.postComposer.init();
        }
        
        // Stories horizontal scroll
        const container = document.querySelector('.stories-row');
        if (container) {
            let isDown = false;
            let startX;
            let scrollLeft;

            container.addEventListener('mousedown', (e) => {
                isDown = true;
                container.classList.add('active');
                startX = e.pageX - container.offsetLeft;
                scrollLeft = container.scrollLeft;
            });
            container.addEventListener('mouseleave', () => {
                isDown = false;
                container.classList.remove('active');
            });
            container.addEventListener('mouseup', () => {
                isDown = false;
                container.classList.remove('active');
            });
            container.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.pageX - container.offsetLeft;
                const walk = (x - startX) * 2;
                container.scrollLeft = scrollLeft - walk;
            });
        }
    }
};
