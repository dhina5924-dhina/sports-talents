window.SportsConnect = window.SportsConnect || {};
SportsConnect.pages = SportsConnect.pages || {};

SportsConnect.pages.profile = {
    render() {
        const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
        const userId = parseInt(urlParams.get('id')) || 1; // default to 1
        
        const user = SportsConnect.data.users.find(u => u.id === userId) || SportsConnect.data.users[0];
        const isCurrentUser = SportsConnect.store && SportsConnect.store.currentUser && SportsConnect.store.currentUser.id === user.id;

        const posts = SportsConnect.data.posts.filter(p => p.userId === user.id);
        const achievements = SportsConnect.data.achievements ? SportsConnect.data.achievements.filter(a => a.userId === user.id) : [];

        let postsHtml = posts.map(p => SportsConnect.components.postCard ? SportsConnect.components.postCard.render(p) : `<div class="post-card">Post</div>`).join('');
        if (!postsHtml) postsHtml = `<div class="empty-state">No posts yet.</div>`;

        let achievementsHtml = achievements.map(a => `
            <div class="achievement-card">
                <div class="achievement-icon">🏆</div>
                <div class="achievement-info">
                    <h4>${a.title}</h4>
                    <span>${a.competition} • ${a.date}</span>
                    <p>${a.description || ''}</p>
                </div>
            </div>
        `).join('');
        if (!achievementsHtml) achievementsHtml = `<div class="empty-state">No achievements yet.</div>`;

        return `
            <div class="page-profile">
                <div class="profile-header">
                    <div class="profile-cover" style="background: ${user.coverColor || 'var(--primary)'}"></div>
                    <div class="profile-main-info container">
                        <div class="profile-avatar-wrapper">
                            <div class="profile-avatar" style="background: ${user.avatarColor}">
                                ${user.avatar}
                            </div>
                            ${user.online ? '<div class="online-badge"></div>' : ''}
                        </div>
                        
                        <div class="profile-details-top">
                            <div class="profile-name-row">
                                <h1 class="profile-name">${user.fullName} ${user.verified ? '<i class="fas fa-check-circle verified-icon"></i>' : ''}</h1>
                                <span class="profile-username">@${user.username}</span>
                            </div>
                            <div class="profile-tags">
                                <span class="badge badge--role">${user.role.toUpperCase()}</span>
                                <span class="badge badge--sport">${user.sport} ${user.position ? '• ' + user.position : ''}</span>
                            </div>
                            <div class="profile-location">
                                <i class="fas fa-map-marker-alt"></i> ${user.location.village ? user.location.village + ', ' : ''}${user.location.district}, ${user.location.state}
                            </div>
                            <p class="profile-bio">${user.bio || 'No bio provided.'}</p>
                            
                            <div class="profile-stats-row">
                                <div class="stat-item"><strong>${posts.length}</strong> Posts</div>
                                <div class="stat-item"><strong>${user.followersCount}</strong> Followers</div>
                                <div class="stat-item"><strong>${user.followingCount}</strong> Following</div>
                            </div>
                        </div>

                        <div class="profile-actions">
                            ${isCurrentUser ? `
                                <button class="btn btn--outline btn--edit-profile"><i class="fas fa-edit"></i> Edit Profile</button>
                            ` : `
                                <button class="btn btn--primary btn--follow" id="follow-btn">Follow</button>
                                <button class="btn btn--outline btn--message" id="message-btn"><i class="fas fa-envelope"></i> Message</button>
                                <div class="dropdown-wrapper">
                                    <button class="btn btn--icon btn--more"><i class="fas fa-ellipsis-h"></i></button>
                                </div>
                            `}
                            <button class="btn btn--icon btn--share" id="share-btn" title="Share Profile"><i class="fas fa-share-alt"></i></button>
                        </div>
                    </div>
                </div>

                ${user.role === 'athlete' ? `
                <div class="container mt-4">
                    <div class="talent-card">
                        <div class="talent-card__header">
                            <h3>Sports Resume</h3>
                            <button class="btn btn--small btn--outline"><i class="fas fa-download"></i> Download</button>
                        </div>
                        <div class="talent-card__body">
                            <div class="talent-info-grid">
                                <div class="info-group">
                                    <label>Experience</label>
                                    <p>${user.experience || 'N/A'}</p>
                                </div>
                                <div class="info-group">
                                    <label>Current Team/Club</label>
                                    <p>${user.team || 'Free Agent'}</p>
                                </div>
                                <div class="info-group">
                                    <label>Age/Gender</label>
                                    <p>${user.age || 'N/A'} • ${user.gender || 'N/A'}</p>
                                </div>
                                <div class="info-group full-width">
                                    <label>Top Skills</label>
                                    <div class="skills-tags">
                                        ${(user.skills || []).map(s => `<span class="skill-tag">${s}</span>`).join('')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                ` : ''}

                <div class="profile-tabs-container container">
                    <div class="profile-tabs">
                        <button class="tab-btn active" data-tab="posts">Posts</button>
                        <button class="tab-btn" data-tab="photos">Photos</button>
                        <button class="tab-btn" data-tab="videos">Videos</button>
                        <button class="tab-btn" data-tab="achievements">Achievements</button>
                        <button class="tab-btn" data-tab="about">About</button>
                    </div>

                    <div class="tab-content active" id="tab-posts">
                        <div class="profile-posts-grid">
                            ${postsHtml}
                        </div>
                    </div>

                    <div class="tab-content" id="tab-photos">
                        <div class="gallery-grid">
                            <div class="gallery-item" style="background: linear-gradient(45deg, #1a365d, #3b82f6)"></div>
                            <div class="gallery-item" style="background: linear-gradient(45deg, #10b981, #059669)"></div>
                            <div class="gallery-item" style="background: linear-gradient(45deg, #f97316, #f59e0b)"></div>
                            <div class="gallery-item" style="background: linear-gradient(45deg, #8b5cf6, #6d28d9)"></div>
                        </div>
                    </div>

                    <div class="tab-content" id="tab-videos">
                        <div class="gallery-grid videos">
                            <div class="gallery-item video-item" style="background: #1e293b">
                                <i class="fas fa-play-circle play-icon"></i>
                            </div>
                        </div>
                    </div>

                    <div class="tab-content" id="tab-achievements">
                        <div class="achievements-list">
                            ${achievementsHtml}
                        </div>
                    </div>

                    <div class="tab-content" id="tab-about">
                        <div class="about-card">
                            <h3>About ${user.fullName}</h3>
                            <p>${user.bio || 'No detailed bio available.'}</p>
                            
                            <h4 class="mt-4">Basic Information</h4>
                            <ul class="info-list">
                                <li><strong>Joined:</strong> ${user.joinDate || 'Recently'}</li>
                                <li><strong>Sport:</strong> ${user.sport}</li>
                                <li><strong>Role:</strong> ${user.role}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    init() {
        // Tab switching
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                btn.classList.add('active');
                document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
            });
        });

        // Action Buttons
        const followBtn = document.getElementById('follow-btn');
        if (followBtn) {
            followBtn.addEventListener('click', function() {
                if(this.classList.contains('btn--outline')) {
                    this.classList.remove('btn--outline');
                    this.classList.add('btn--primary');
                    this.textContent = 'Follow';
                } else {
                    this.classList.remove('btn--primary');
                    this.classList.add('btn--outline');
                    this.textContent = 'Following';
                }
            });
        }

        const shareBtn = document.getElementById('share-btn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                alert('Profile link copied to clipboard!'); // Simulated toast
            });
        }
    }
};
