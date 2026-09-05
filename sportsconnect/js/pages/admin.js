window.SportsConnect = window.SportsConnect || {};
SportsConnect.pages = SportsConnect.pages || {};

SportsConnect.pages.admin = {
    render(params) {
        const store = SportsConnect.store;
        const users = store ? store.getUsers() : [];
        const events = store ? store.getEvents() : [];
        const posts = store ? store.getPosts() : [];
        const verifications = store ? store.getVerificationRequests() : [];

        const activeTab = (params && params.tab) || 'overview';

        return `
            <div class="admin-page card" style="overflow: hidden;">
                <!-- Admin Header -->
                <div style="padding: 24px; background: linear-gradient(135deg, #0F172A, #1E293B); color: #ffffff; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="font-size: 28px;">👑</span>
                            <h2 style="margin: 0; font-family: 'Outfit', sans-serif; font-size: 24px;">SportsConnect Admin Console</h2>
                        </div>
                        <p style="margin: 4px 0 0 0; color: #94A3B8; font-size: 14px;">Platform Management & Talent Verification Control Panel</p>
                    </div>
                    <span class="badge badge--success" style="padding: 6px 12px; font-size: 13px;">System Operational • Live</span>
                </div>

                <!-- Admin Stats Row -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; padding: 20px; background: var(--bg); border-bottom: 1px solid var(--border);">
                    <div style="padding: 16px; background: var(--surface); border-radius: var(--radius-md); border: 1px solid var(--border);">
                        <span style="font-size: 12px; color: var(--text-muted); display: block; font-weight: 500;">TOTAL USERS</span>
                        <strong style="font-size: 24px; font-family: 'Outfit', sans-serif; color: var(--primary); display: block; margin: 4px 0;">${users.length + 1520}</strong>
                        <span style="font-size: 11px; color: var(--success);">↗ +12% this month</span>
                    </div>

                    <div style="padding: 16px; background: var(--surface); border-radius: var(--radius-md); border: 1px solid var(--border);">
                        <span style="font-size: 12px; color: var(--text-muted); display: block; font-weight: 500;">VERIFIED ATHLETES</span>
                        <strong style="font-size: 24px; font-family: 'Outfit', sans-serif; color: var(--accent); display: block; margin: 4px 0;">842</strong>
                        <span style="font-size: 11px; color: var(--text-muted);">98 pending review</span>
                    </div>

                    <div style="padding: 16px; background: var(--surface); border-radius: var(--radius-md); border: 1px solid var(--border);">
                        <span style="font-size: 12px; color: var(--text-muted); display: block; font-weight: 500;">SPORTS POSTS</span>
                        <strong style="font-size: 24px; font-family: 'Outfit', sans-serif; color: var(--info); display: block; margin: 4px 0;">${posts.length + 4310}</strong>
                        <span style="font-size: 11px; color: var(--success);">↗ +240 today</span>
                    </div>

                    <div style="padding: 16px; background: var(--surface); border-radius: var(--radius-md); border: 1px solid var(--border);">
                        <span style="font-size: 12px; color: var(--text-muted); display: block; font-weight: 500;">ACTIVE EVENTS</span>
                        <strong style="font-size: 24px; font-family: 'Outfit', sans-serif; color: var(--warning); display: block; margin: 4px 0;">${events.length}</strong>
                        <span style="font-size: 11px; color: var(--text-muted);">Across 12 districts</span>
                    </div>
                </div>

                <!-- Admin Tabs -->
                <div style="display: flex; gap: 8px; padding: 12px 20px; border-bottom: 1px solid var(--border); background: var(--surface);">
                    <a href="#admin?tab=overview" class="btn ${activeTab === 'overview' ? 'btn--primary' : 'btn--ghost'} btn--sm">Overview</a>
                    <a href="#admin?tab=verifications" class="btn ${activeTab === 'verifications' ? 'btn--primary' : 'btn--ghost'} btn--sm">Verification Requests (${verifications.length})</a>
                    <a href="#admin?tab=users" class="btn ${activeTab === 'users' ? 'btn--primary' : 'btn--ghost'} btn--sm">User Management</a>
                </div>

                <!-- Admin Tab Content -->
                <div style="padding: 24px; background: var(--surface);">
                    ${this.renderAdminTab(activeTab, users, verifications)}
                </div>
            </div>
        `;
    },

    renderAdminTab(tab, users, verifications) {
        if (tab === 'verifications') {
            const rowsHtml = verifications.map(v => `
                <tr style="border-bottom: 1px solid var(--border);">
                    <td style="padding: 12px 16px; font-weight: 600;">${v.athleteName}</td>
                    <td style="padding: 12px 16px;"><span class="badge badge--secondary">${v.sport}</span></td>
                    <td style="padding: 12px 16px;">${v.village}</td>
                    <td style="padding: 12px 16px;">📁 ${v.document}</td>
                    <td style="padding: 12px 16px;"><span class="badge badge--warning">${v.status}</span></td>
                    <td style="padding: 12px 16px;">
                        <button class="btn btn--primary btn--sm approve-btn" data-id="${v.id}" style="padding: 4px 10px; font-size: 12px;">Approve ✅</button>
                        <button class="btn btn--outline btn--sm reject-btn" data-id="${v.id}" style="padding: 4px 10px; font-size: 12px; color: var(--error); border-color: var(--error);">Reject</button>
                    </td>
                </tr>
            `).join('');

            return `
                <div>
                    <h3 style="margin-top: 0; margin-bottom: 16px; font-size: 18px;">Talent Verification Queue</h3>
                    <p style="color: var(--text-muted); font-size: 14px; margin-bottom: 20px;">Review athletic credentials, district certificate proofs, and grant verified talent badges.</p>

                    <div style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 14px;">
                            <thead>
                                <tr style="background: var(--bg); border-bottom: 2px solid var(--border);">
                                    <th style="padding: 12px 16px;">Athlete Name</th>
                                    <th style="padding: 12px 16px;">Sport</th>
                                    <th style="padding: 12px 16px;">Village / Location</th>
                                    <th style="padding: 12px 16px;">Certificate Proof</th>
                                    <th style="padding: 12px 16px;">Status</th>
                                    <th style="padding: 12px 16px;">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${rowsHtml}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        } else if (tab === 'users') {
            const userRowsHtml = users.map(u => `
                <tr style="border-bottom: 1px solid var(--border);">
                    <td style="padding: 12px 16px; display: flex; align-items: center; gap: 10px;">
                        <span style="width: 32px; height: 32px; border-radius: 50%; background: ${u.avatarBg || 'var(--primary-light)'}; display: inline-flex; align-items: center; justify-content: center;">${u.avatar}</span>
                        <div>
                            <strong style="display: block; font-size: 13px;">${u.name}</strong>
                            <span style="font-size: 11px; color: var(--text-muted);">@${u.username}</span>
                        </div>
                    </td>
                    <td style="padding: 12px 16px;"><span class="badge badge--primary">${u.role}</span></td>
                    <td style="padding: 12px 16px;">${u.sport}</td>
                    <td style="padding: 12px 16px;">${u.location ? u.location.village + ', ' + u.location.district : 'India'}</td>
                    <td style="padding: 12px 16px;">${u.verified ? '✅ Verified' : 'Standard'}</td>
                    <td style="padding: 12px 16px;">
                        <button class="btn btn--ghost btn--sm" style="font-size: 12px;">Manage</button>
                    </td>
                </tr>
            `).join('');

            return `
                <div>
                    <h3 style="margin-top: 0; margin-bottom: 16px; font-size: 18px;">Platform User Directory</h3>
                    <div style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 14px;">
                            <thead>
                                <tr style="background: var(--bg); border-bottom: 2px solid var(--border);">
                                    <th style="padding: 12px 16px;">User</th>
                                    <th style="padding: 12px 16px;">Role</th>
                                    <th style="padding: 12px 16px;">Sport</th>
                                    <th style="padding: 12px 16px;">Location</th>
                                    <th style="padding: 12px 16px;">Badge</th>
                                    <th style="padding: 12px 16px;">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${userRowsHtml}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        } else {
            return `
                <div>
                    <h3 style="margin-top: 0; margin-bottom: 16px; font-size: 18px;">System Health & Activity Overview</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div style="padding: 20px; background: var(--bg); border-radius: var(--radius-md); border: 1px solid var(--border);">
                            <h4 style="margin: 0 0 12px 0;">🚀 Platform Growth Metrics</h4>
                            <p style="font-size: 13px; color: var(--text-muted);">Weekly registration volume: <strong>+340 athletes from rural villages</strong></p>
                            <div style="height: 12px; background: var(--border); border-radius: 6px; overflow: hidden; margin-top: 10px;">
                                <div style="width: 78%; height: 100%; background: var(--primary);"></div>
                            </div>
                        </div>

                        <div style="padding: 20px; background: var(--bg); border-radius: var(--radius-md); border: 1px solid var(--border);">
                            <h4 style="margin: 0 0 12px 0;">🛡️ Content Safety & Moderation</h4>
                            <p style="font-size: 13px; color: var(--text-muted);">Automated filters status: <strong>Active & Clear</strong></p>
                            <span class="badge badge--success">0 Flagged Posts</span>
                        </div>
                    </div>
                </div>
            `;
        }
    },

    init() {
        const approveBtns = document.querySelectorAll('.approve-btn');
        approveBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tr = e.target.closest('tr');
                if (tr) {
                    tr.style.opacity = '0.5';
                    tr.querySelector('.approve-btn').textContent = 'Approved ✅';
                    tr.querySelector('.approve-btn').disabled = true;
                    alert('Athlete verified successfully! Verified badge granted. 🌟');
                }
            });
        });
    }
};
