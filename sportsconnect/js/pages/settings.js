window.SportsConnect = window.SportsConnect || {};
SportsConnect.pages = SportsConnect.pages || {};

SportsConnect.pages.settings = {
    render(params) {
        const store = SportsConnect.store;
        const u = store ? store.getCurrentUser() : {};
        const activeTab = (params && params.tab) || 'profile';

        return `
            <div class="settings-page card" style="max-width: 900px; margin: 0 auto; overflow: hidden;">
                <div style="padding: 24px; border-bottom: 1px solid var(--border); background: var(--surface);">
                    <h2 style="margin: 0; font-size: 24px; font-family: 'Outfit', sans-serif;">Account Settings ⚙️</h2>
                    <p style="margin: 4px 0 0 0; color: var(--text-muted); font-size: 14px;">Manage your SportsConnect profile, privacy, notifications, and preferences</p>
                </div>

                <div style="display: flex; min-height: 500px;">
                    <!-- Settings Sidebar Nav -->
                    <div style="width: 220px; border-right: 1px solid var(--border); background: var(--bg); padding: 16px;">
                        <ul style="list-style: none; padding: 0; margin: 0;">
                            <li style="margin-bottom: 4px;">
                                <a href="#settings?tab=profile" class="btn ${activeTab === 'profile' ? 'btn--primary' : 'btn--ghost'}" style="width: 100%; justify-content: flex-start; text-align: left; padding: 10px 14px;">
                                    👤 Profile Info
                                </a>
                            </li>
                            <li style="margin-bottom: 4px;">
                                <a href="#settings?tab=athletic" class="btn ${activeTab === 'athletic' ? 'btn--primary' : 'btn--ghost'}" style="width: 100%; justify-content: flex-start; text-align: left; padding: 10px 14px;">
                                    🏅 Athletic Details
                                </a>
                            </li>
                            <li style="margin-bottom: 4px;">
                                <a href="#settings?tab=privacy" class="btn ${activeTab === 'privacy' ? 'btn--primary' : 'btn--ghost'}" style="width: 100%; justify-content: flex-start; text-align: left; padding: 10px 14px;">
                                    🔒 Privacy & Safety
                                </a>
                            </li>
                            <li style="margin-bottom: 4px;">
                                <a href="#settings?tab=notifications" class="btn ${activeTab === 'notifications' ? 'btn--primary' : 'btn--ghost'}" style="width: 100%; justify-content: flex-start; text-align: left; padding: 10px 14px;">
                                    🔔 Notifications
                                </a>
                            </li>
                            <li style="margin-bottom: 4px;">
                                <a href="#settings?tab=appearance" class="btn ${activeTab === 'appearance' ? 'btn--primary' : 'btn--ghost'}" style="width: 100%; justify-content: flex-start; text-align: left; padding: 10px 14px;">
                                    🎨 Appearance
                                </a>
                            </li>
                        </ul>
                    </div>

                    <!-- Settings Main Content -->
                    <div style="flex: 1; padding: 24px; background: var(--surface);">
                        ${this.renderTabContent(activeTab, u)}
                    </div>
                </div>
            </div>
        `;
    },

    renderTabContent(tab, u) {
        if (tab === 'profile') {
            return `
                <form id="settings-profile-form">
                    <h3 style="margin-top: 0; margin-bottom: 20px; font-size: 18px;">Profile Information</h3>
                    <div style="display: flex; gap: 20px; align-items: center; margin-bottom: 24px;">
                        <div style="width: 72px; height: 72px; border-radius: 50%; background: ${u.avatarBg || 'var(--primary-light)'}; display: flex; align-items: center; justify-content: center; font-size: 36px; border: 3px solid var(--border);">
                            ${u.avatar || '🏃‍♂️'}
                        </div>
                        <div>
                            <button type="button" class="btn btn--outline btn--sm">Change Avatar</button>
                            <span style="display: block; font-size: 12px; color: var(--text-muted); margin-top: 4px;">Supports emoji avatars or photo uploads</span>
                        </div>
                    </div>

                    <div class="form-group" style="margin-bottom: 16px;">
                        <label class="form-label">Full Name</label>
                        <input type="text" id="set-fullname" class="form-input" value="${u.name || ''}" required>
                    </div>

                    <div class="form-group" style="margin-bottom: 16px;">
                        <label class="form-label">Username</label>
                        <input type="text" id="set-username" class="form-input" value="${u.username || ''}" required>
                    </div>

                    <div class="form-group" style="margin-bottom: 16px;">
                        <label class="form-label">Bio / Tagline</label>
                        <textarea id="set-bio" class="form-textarea" rows="3">${u.bio || ''}</textarea>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                        <div class="form-group">
                            <label class="form-label">Village / Town</label>
                            <input type="text" id="set-village" class="form-input" value="${u.location ? u.location.village : ''}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">District</label>
                            <input type="text" id="set-district" class="form-input" value="${u.location ? u.location.district : ''}">
                        </div>
                    </div>

                    <button type="submit" class="btn btn--primary" style="margin-top: 10px;">Save Profile Changes 💾</button>
                </form>
            `;
        } else if (tab === 'athletic') {
            return `
                <form id="settings-athletic-form">
                    <h3 style="margin-top: 0; margin-bottom: 20px; font-size: 18px;">Athletic & Talent Profile</h3>
                    
                    <div class="form-group" style="margin-bottom: 16px;">
                        <label class="form-label">Primary Sport</label>
                        <input type="text" id="set-sport" class="form-input" value="${u.sport || ''}" required>
                    </div>

                    <div class="form-group" style="margin-bottom: 16px;">
                        <label class="form-label">Specialization / Position</label>
                        <input type="text" id="set-subsport" class="form-input" value="${u.subSport || ''}" placeholder="e.g. 100m Sprint, Fast Bowler, Raider">
                    </div>

                    <div class="form-group" style="margin-bottom: 16px;">
                        <label class="form-label">Role Category</label>
                        <select id="set-role" class="form-select">
                            <option value="athlete" ${u.role === 'athlete' ? 'selected' : ''}>Athlete / Sports Person</option>
                            <option value="coach" ${u.role === 'coach' ? 'selected' : ''}>Coach / Instructor</option>
                            <option value="scout" ${u.role === 'scout' ? 'selected' : ''}>Talent Scout / Agent</option>
                            <option value="organizer" ${u.role === 'organizer' ? 'selected' : ''}>Tournament Organizer</option>
                            <option value="team" ${u.role === 'team' ? 'selected' : ''}>Club / Team</option>
                        </select>
                    </div>

                    <button type="submit" class="btn btn--primary" style="margin-top: 10px;">Save Athletic Details 🏆</button>
                </form>
            `;
        } else if (tab === 'privacy') {
            return `
                <div>
                    <h3 style="margin-top: 0; margin-bottom: 20px; font-size: 18px;">Privacy & Safety</h3>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border: 1px solid var(--border); border-radius: var(--radius-md);">
                            <div>
                                <strong style="display: block; font-size: 14px;">Public Profile Visibility</strong>
                                <span style="font-size: 12px; color: var(--text-muted);">Allow coaches and scouts to discover your talent profile</span>
                            </div>
                            <input type="checkbox" checked style="width: 20px; height: 20px;">
                        </label>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <label style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border: 1px solid var(--border); border-radius: var(--radius-md);">
                            <div>
                                <strong style="display: block; font-size: 14px;">Show Village & District Location</strong>
                                <span style="font-size: 12px; color: var(--text-muted);">Enable village sports mapping for local competitions</span>
                            </div>
                            <input type="checkbox" checked style="width: 20px; height: 20px;">
                        </label>
                    </div>

                    <button class="btn btn--primary" onclick="alert('Privacy settings saved!')">Save Privacy Settings 🔒</button>
                </div>
            `;
        } else if (tab === 'notifications') {
            return `
                <div>
                    <h3 style="margin-top: 0; margin-bottom: 20px; font-size: 18px;">Notification Preferences</h3>
                    <p style="color: var(--text-muted); font-size: 14px; margin-bottom: 16px;">Choose when and how you want to be notified:</p>
                    
                    <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;">
                        <label style="display: flex; align-items: center; gap: 12px;">
                            <input type="checkbox" checked style="width: 18px; height: 18px;"> Likes and comments on your sports posts
                        </label>
                        <label style="display: flex; align-items: center; gap: 12px;">
                            <input type="checkbox" checked style="width: 18px; height: 18px;"> Scout messages and trial invitations
                        </label>
                        <label style="display: flex; align-items: center; gap: 12px;">
                            <input type="checkbox" checked style="width: 18px; height: 18px;"> Local village sports tournament announcements
                        </label>
                    </div>

                    <button class="btn btn--primary" onclick="alert('Notification preferences updated!')">Save Preferences 🔔</button>
                </div>
            `;
        } else if (tab === 'appearance') {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            return `
                <div>
                    <h3 style="margin-top: 0; margin-bottom: 20px; font-size: 18px;">Theme & Appearance</h3>
                    <div style="display: flex; gap: 16px; margin-bottom: 24px;">
                        <div id="theme-light-card" class="card" style="flex: 1; padding: 20px; cursor: pointer; text-align: center; border: 2px solid ${currentTheme === 'light' ? 'var(--primary)' : 'var(--border)'};">
                            <span style="font-size: 32px; display: block; margin-bottom: 8px;">☀️</span>
                            <strong>Light Theme</strong>
                            <p style="font-size: 12px; color: var(--text-muted); margin: 4px 0 0 0;">Clean, high-contrast day interface</p>
                        </div>
                        <div id="theme-dark-card" class="card" style="flex: 1; padding: 20px; cursor: pointer; text-align: center; border: 2px solid ${currentTheme === 'dark' ? 'var(--primary)' : 'var(--border)'};">
                            <span style="font-size: 32px; display: block; margin-bottom: 8px;">🌙</span>
                            <strong>Dark Theme</strong>
                            <p style="font-size: 12px; color: var(--text-muted); margin: 4px 0 0 0;">Sleek night theme for low light</p>
                        </div>
                    </div>
                </div>
            `;
        }
        return '';
    },

    init() {
        const pForm = document.getElementById('settings-profile-form');
        if (pForm) {
            pForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('set-fullname').value;
                const username = document.getElementById('set-username').value;
                const bio = document.getElementById('set-bio').value;
                const village = document.getElementById('set-village').value;
                const district = document.getElementById('set-district').value;

                SportsConnect.store.updateUserProfile({
                    name, username, bio,
                    location: { village, district, state: 'Tamil Nadu' }
                });
                alert('Profile details updated successfully! ✨');
            });
        }

        const aForm = document.getElementById('settings-athletic-form');
        if (aForm) {
            aForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const sport = document.getElementById('set-sport').value;
                const subSport = document.getElementById('set-subsport').value;
                const role = document.getElementById('set-role').value;

                SportsConnect.store.updateUserProfile({ sport, subSport, role });
                alert('Athletic profile updated! 🏅');
            });
        }

        const lightCard = document.getElementById('theme-light-card');
        const darkCard = document.getElementById('theme-dark-card');
        if (lightCard && darkCard) {
            lightCard.addEventListener('click', () => {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                SportsConnect.router.handleRoute();
            });
            darkCard.addEventListener('click', () => {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                SportsConnect.router.handleRoute();
            });
        }
    }
};
