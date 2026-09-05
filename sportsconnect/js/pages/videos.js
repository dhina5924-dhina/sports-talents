window.SportsConnect = window.SportsConnect || {};
SportsConnect.pages = SportsConnect.pages || {};

SportsConnect.pages.videos = {
    render() {
        const posts = SportsConnect.store ? SportsConnect.store.getPosts() : [];
        // Simulate videos by taking posts and pretending they are videos (if data lacks strict video separation)
        const videos = posts.map(p => ({
            ...p,
            thumbnailColor: p.sport === 'Athletics' ? '#ef4444' : (p.sport === 'Cricket' ? '#3b82f6' : '#10b981'),
            duration: '03:45',
            title: p.text.substring(0, 40) + '...',
            viewsCount: p.viewsCount || Math.floor(Math.random() * 1000)
        }));

        let gridHtml = videos.map(video => `
            <div class="video-card" data-id="${video.id}" style="background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; cursor: pointer; transition: all 0.3s ease; box-shadow: var(--shadow-sm);">
                <div class="video-thumb" style="background: linear-gradient(135deg, ${video.thumbnailColor}cc, ${video.thumbnailColor}aa); height: 160px; position: relative; display: flex; align-items: center; justify-content: center;">
                    <div style="width: 48px; height: 48px; background: rgba(0,0,0,0.5); border-radius: 50%; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px);">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                    <div style="position: absolute; bottom: 8px; right: 8px; background: rgba(0,0,0,0.7); color: white; font-size: 11px; padding: 2px 6px; border-radius: 4px; font-weight: 500;">${video.duration}</div>
                </div>
                <div style="padding: var(--space-md);">
                    <div style="display: flex; gap: 10px; align-items: flex-start;">
                        <div style="width: 36px; height: 36px; border-radius: 50%; background: var(--bg-alt); display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0;">👤</div>
                        <div>
                            <h4 style="font-size: 14px; margin-bottom: 4px; line-height: 1.3; color: var(--text);">${video.title}</h4>
                            <p style="font-size: 12px; color: var(--text-secondary); margin-bottom: 2px;">User ${video.userId}</p>
                            <p style="font-size: 12px; color: var(--text-secondary);">${video.viewsCount} views • ${video.sport}</p>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        return `
        <div class="page-container" style="padding-bottom: var(--space-4xl);">
            <div id="videos-list-view">
                <header style="margin-bottom: var(--space-2xl);">
                    <h1 style="font-family: 'Outfit', sans-serif; font-size: 32px; margin-bottom: var(--space-md);">Sports Videos 🎬</h1>
                    
                    <div class="category-filters" style="display: flex; gap: var(--space-sm); overflow-x: auto; padding-bottom: 8px;">
                        <button class="vid-cat-btn active" style="background: var(--text); color: white; border: none; padding: 6px 16px; border-radius: var(--radius-full); cursor: pointer; white-space: nowrap;">All</button>
                        <button class="vid-cat-btn" style="background: var(--surface); border: 1px solid var(--border); padding: 6px 16px; border-radius: var(--radius-full); cursor: pointer; white-space: nowrap;">Match Highlights</button>
                        <button class="vid-cat-btn" style="background: var(--surface); border: 1px solid var(--border); padding: 6px 16px; border-radius: var(--radius-full); cursor: pointer; white-space: nowrap;">Training</button>
                        <button class="vid-cat-btn" style="background: var(--surface); border: 1px solid var(--border); padding: 6px 16px; border-radius: var(--radius-full); cursor: pointer; white-space: nowrap;">Skills</button>
                        <button class="vid-cat-btn" style="background: var(--surface); border: 1px solid var(--border); padding: 6px 16px; border-radius: var(--radius-full); cursor: pointer; white-space: nowrap;">Tournaments</button>
                    </div>
                </header>
                
                <div id="videos-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: var(--space-lg);">
                    ${gridHtml}
                </div>
            </div>
            
            <div id="video-detail-view" style="display: none; animation: fadeIn 0.3s ease;">
                <!-- Content injected via JS -->
            </div>
        </div>
        <style>
            .video-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        </style>
        `;
    },
    
    init() {
        const listView = document.getElementById('videos-list-view');
        const detailView = document.getElementById('video-detail-view');
        
        document.querySelectorAll('.vid-cat-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.vid-cat-btn').forEach(b => {
                    b.style.background = 'var(--surface)'; b.style.color = 'var(--text)'; b.classList.remove('active');
                });
                e.target.style.background = 'var(--text)'; e.target.style.color = 'white'; e.target.classList.add('active');
            });
        });

        document.getElementById('videos-grid').addEventListener('click', (e) => {
            const card = e.target.closest('.video-card');
            if(card) {
                const id = parseInt(card.getAttribute('data-id'));
                this.showVideoDetail(id, listView, detailView);
            }
        });
    },
    
    showVideoDetail(videoId, listView, detailView) {
        const posts = SportsConnect.store.getPosts();
        const video = posts.find(p => p.id === videoId) || posts[0];
        
        detailView.innerHTML = `
            <button id="back-to-videos" style="background: transparent; border: none; padding: 8px 0; cursor: pointer; display: flex; align-items: center; gap: 8px; font-weight: 500; margin-bottom: var(--space-md); color: var(--text-secondary); transition: color 0.2s;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg> Back to Videos
            </button>
            
            <div style="display: grid; grid-template-columns: 1fr; lg:grid-template-columns: 3fr 1fr; gap: var(--space-xl);">
                <!-- Main Video Area -->
                <div>
                    <div style="background: #0f172a; border-radius: var(--radius-lg); overflow: hidden; margin-bottom: var(--space-lg); aspect-ratio: 16/9; display: flex; align-items: center; justify-content: center; position: relative;">
                        <div style="color: white; font-size: 4rem; opacity: 0.8; display: flex; flex-direction: column; align-items: center; gap: 10px;">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                            <span style="font-size: 14px; font-family: sans-serif;">Video Player Placeholder</span>
                        </div>
                        <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 40px; background: linear-gradient(transparent, rgba(0,0,0,0.7)); display: flex; align-items: center; padding: 0 16px; gap: 16px; color: white;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                            <div style="height: 4px; background: rgba(255,255,255,0.3); flex: 1; border-radius: 2px; position: relative;"><div style="width: 30%; height: 100%; background: var(--primary-lighter); border-radius: 2px;"></div></div>
                            <span style="font-size: 12px;">01:12 / 03:45</span>
                        </div>
                    </div>
                    
                    <h1 style="font-size: 20px; font-family: 'Outfit', sans-serif; margin-bottom: 8px;">${video.text.substring(0, 80) || 'Amazing Sports Highlight Video'}</h1>
                    
                    <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 16px; padding-bottom: 16px; border-bottom: 1px solid var(--border); margin-bottom: 16px;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="width: 48px; height: 48px; border-radius: 50%; background: var(--primary-light); color: white; display: flex; align-items: center; justify-content: center; font-weight: bold;">U</div>
                            <div>
                                <div style="font-weight: bold;">User ${video.userId}</div>
                                <div style="font-size: 13px; color: var(--text-secondary);">1.2K Followers</div>
                            </div>
                            <button style="background: var(--text); color: white; border: none; padding: 6px 16px; border-radius: var(--radius-full); font-size: 14px; font-weight: 500; margin-left: 8px; cursor: pointer;">Follow</button>
                        </div>
                        
                        <div style="display: flex; gap: 8px; background: var(--surface); padding: 4px; border-radius: var(--radius-full); border: 1px solid var(--border);">
                            <button style="display: flex; align-items: center; gap: 6px; padding: 8px 16px; background: none; border: none; border-right: 1px solid var(--border); cursor: pointer; font-weight: 500;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg> ${video.likesCount}</button>
                            <button style="display: flex; align-items: center; gap: 6px; padding: 8px 16px; background: none; border: none; cursor: pointer; font-weight: 500;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg> Share</button>
                        </div>
                    </div>
                    
                    <div style="background: var(--surface-hover); padding: 16px; border-radius: var(--radius-md); font-size: 14px; line-height: 1.5; margin-bottom: 24px;">
                        <div style="font-weight: 500; margin-bottom: 8px;">15,420 views • ${video.timestamp || '2 days ago'}</div>
                        <p>${video.text}</p>
                        <p style="color: var(--primary); margin-top: 8px;">#${video.sport.toLowerCase()} #sportsconnect #highlight</p>
                    </div>
                    
                    <div>
                        <h3 style="margin-bottom: 16px;">${video.commentsCount || 0} Comments</h3>
                        <div style="display: flex; gap: 12px; margin-bottom: 24px;">
                            <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--bg-alt); flex-shrink: 0;"></div>
                            <input type="text" placeholder="Add a comment..." style="flex: 1; border: none; border-bottom: 1px solid var(--border); background: transparent; padding: 8px 0; outline: none;">
                        </div>
                        <p style="color: var(--text-tertiary); text-align: center;">Comments are simulated for this prototype.</p>
                    </div>
                </div>
                
                <!-- Sidebar / Related Videos -->
                <div>
                    <h3 style="font-size: 16px; margin-bottom: 16px;">Related Videos</h3>
                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        ${[1,2,3,4].map(i => `
                            <div style="display: flex; gap: 10px; cursor: pointer;" class="related-vid" data-id="${posts[i]?.id || 1}">
                                <div style="width: 120px; height: 68px; background: var(--primary-light); border-radius: var(--radius-sm); flex-shrink: 0;"></div>
                                <div>
                                    <div style="font-size: 13px; font-weight: 500; line-height: 1.2; margin-bottom: 4px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">Amazing play from local tournament match</div>
                                    <div style="font-size: 11px; color: var(--text-secondary);">User ${i}</div>
                                    <div style="font-size: 11px; color: var(--text-secondary);">1.2K views</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        listView.style.display = 'none';
        detailView.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        document.getElementById('back-to-videos').addEventListener('click', () => {
            detailView.style.display = 'none';
            listView.style.display = 'block';
        });
        
        detailView.querySelectorAll('.related-vid').forEach(vid => {
            vid.addEventListener('click', () => {
                const id = parseInt(vid.getAttribute('data-id'));
                if(id) this.showVideoDetail(id, listView, detailView);
            });
        });
    }
};
