window.SportsConnect = window.SportsConnect || {};
SportsConnect.pages = SportsConnect.pages || {};

SportsConnect.pages.events = {
    render() {
        const events = SportsConnect.store ? SportsConnect.store.getEvents() : [];
        const sports = SportsConnect.store ? SportsConnect.store.getSports() : [];
        
        let sportsFilters = sports.map(s => `<button class="filter-chip" data-sport="${s.name}" style="background:var(--surface); border:1px solid var(--border); padding:6px 12px; border-radius:var(--radius-full); cursor:pointer; font-size:13px;">${s.icon} ${s.name}</button>`).join('');

        return `
        <div class="page-container" style="padding-bottom: var(--space-4xl);">
            <!-- Events Listing -->
            <div id="events-list-view">
                <header style="margin-bottom: var(--space-2xl);">
                    <h1 style="font-family: 'Outfit', sans-serif; font-size: 32px; margin-bottom: var(--space-md); display:flex; align-items:center; gap:10px;">
                        Sports Events 📅
                        <button class="btn btn--primary" style="margin-left:auto; font-size:14px; padding:8px 16px; border-radius:var(--radius-full);">+ Create Event</button>
                    </h1>
                    
                    <div class="filters-row" style="display:flex; gap:var(--space-md); overflow-x:auto; padding-bottom:8px; margin-bottom:var(--space-lg);">
                        <button class="filter-btn active" data-filter="all" style="background:var(--primary); color:white; border:none; padding:8px 16px; border-radius:var(--radius-full); cursor:pointer;">All</button>
                        <button class="filter-btn" data-filter="upcoming" style="background:var(--surface); border:1px solid var(--border); padding:8px 16px; border-radius:var(--radius-full); cursor:pointer;">Upcoming</button>
                        <button class="filter-btn" data-filter="ongoing" style="background:var(--surface); border:1px solid var(--border); padding:8px 16px; border-radius:var(--radius-full); cursor:pointer;">Ongoing</button>
                        <button class="filter-btn" data-filter="completed" style="background:var(--surface); border:1px solid var(--border); padding:8px 16px; border-radius:var(--radius-full); cursor:pointer;">Completed</button>
                        <button class="filter-btn" data-filter="my_events" style="background:var(--surface); border:1px solid var(--border); padding:8px 16px; border-radius:var(--radius-full); cursor:pointer;">My Events</button>
                    </div>
                    
                    <div class="sports-chips" style="display:flex; gap:var(--space-sm); overflow-x:auto; padding-bottom:8px;">
                        <button class="filter-chip active" data-sport="all" style="background:var(--text); color:white; border:none; padding:6px 12px; border-radius:var(--radius-full); cursor:pointer; font-size:13px;">All Sports</button>
                        ${sportsFilters}
                    </div>
                </header>
                
                <div id="events-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: var(--space-xl);">
                    ${events.map(e => SportsConnect.components.eventCard ? SportsConnect.components.eventCard.render(e) : `<div class="event-card-placeholder" data-id="${e.id}">${e.name}</div>`).join('')}
                </div>
            </div>

            <!-- Detail View -->
            <div id="event-detail-view" style="display: none; animation: fadeIn 0.3s ease;">
                <!-- Content injected via JS -->
            </div>
        </div>
        <style>
            @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            .event-card-placeholder { background:white; padding:20px; border-radius:10px; cursor:pointer; box-shadow:var(--shadow-sm); }
        </style>
        `;
    },
    
    init() {
        const listView = document.getElementById('events-list-view');
        const detailView = document.getElementById('event-detail-view');
        
        // Handle filter clicks
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => {
                    b.style.background = 'var(--surface)'; b.style.color = 'var(--text)'; b.classList.remove('active');
                });
                e.target.style.background = 'var(--primary)'; e.target.style.color = 'white'; e.target.classList.add('active');
                // Simulate filter logic (in reality, re-render grid)
            });
        });
        
        // Handle sport chips
        document.querySelectorAll('.filter-chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-chip').forEach(c => {
                    c.style.background = 'var(--surface)'; c.style.color = 'var(--text)'; c.classList.remove('active');
                });
                e.target.style.background = 'var(--text)'; e.target.style.color = 'white'; e.target.classList.add('active');
                // Simulate filter logic
            });
        });

        // Delegate click for event cards
        document.getElementById('events-grid').addEventListener('click', (e) => {
            const card = e.target.closest('.event-card, .event-card-placeholder');
            if(card) {
                const id = parseInt(card.dataset.id || card.getAttribute('data-id'));
                if(id) this.showEventDetail(id, listView, detailView);
            }
        });

        // Check URL for direct navigation
        const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
        if(urlParams.get('id')) {
            this.showEventDetail(parseInt(urlParams.get('id')), listView, detailView);
        }
    },
    
    showEventDetail(eventId, listView, detailView) {
        const event = SportsConnect.store.getEvents().find(e => e.id === eventId);
        if (!event) return;
        
        const sportObj = SportsConnect.store.getSports().find(s => s.name === event.sport) || { color: 'var(--primary)', icon: '🏆' };
        
        detailView.innerHTML = `
            <button id="back-to-events" style="background: var(--surface); border: 1px solid var(--border); padding: 8px 16px; border-radius: var(--radius-full); cursor: pointer; display: flex; align-items: center; gap: 8px; font-weight: 500; margin-bottom: var(--space-lg); transition: all 0.2s; box-shadow: var(--shadow-sm);">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg> Back to Events
            </button>
            
            <div style="background: linear-gradient(135deg, ${sportObj.color}, ${event.bannerColor || '#1a365d'}); color: white; border-radius: var(--radius-xl); overflow: hidden; margin-bottom: var(--space-xl); position: relative; min-height: 250px; display: flex; flex-direction: column; justify-content: flex-end; padding: var(--space-2xl);">
                <div style="position: absolute; top: 20px; right: 20px; background: rgba(0,0,0,0.5); padding: 6px 12px; border-radius: 20px; font-size: 13px; font-weight: bold; backdrop-filter: blur(5px);">
                    ${event.status.toUpperCase()}
                </div>
                <div style="font-size: 8rem; position: absolute; right: 20px; bottom: -20px; opacity: 0.2; transform: rotate(-15deg);">${sportObj.icon}</div>
                <div style="position: relative; z-index: 1;">
                    <span style="background: rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 4px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; display: inline-block; backdrop-filter: blur(5px);">${event.sport}</span>
                    <h1 style="font-family: 'Outfit', sans-serif; font-size: 36px; margin-bottom: 10px; line-height: 1.2;">${event.name}</h1>
                    <p style="font-size: 16px; opacity: 0.9; max-width: 600px; display: flex; align-items: center; gap: 8px;">
                        📅 ${event.date} • 🕒 ${event.startTime} - ${event.endTime}
                    </p>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: var(--space-xl); margin-bottom: var(--space-4xl);">
                <!-- Main Content -->
                <div>
                    <div class="event-tabs" style="display: flex; gap: var(--space-md); border-bottom: 1px solid var(--border); margin-bottom: var(--space-xl); overflow-x: auto; padding-bottom: 2px;">
                        <button class="evt-tab-btn active" data-target="overview" style="padding: var(--space-sm) var(--space-md); background: none; border: none; border-bottom: 2px solid var(--primary); color: var(--primary); font-weight: 600; cursor: pointer;">Overview</button>
                        <button class="evt-tab-btn" data-target="participants" style="padding: var(--space-sm) var(--space-md); background: none; border: none; border-bottom: 2px solid transparent; color: var(--text-secondary); cursor: pointer;">Participants (${event.participantsCount})</button>
                        <button class="evt-tab-btn" data-target="results" style="padding: var(--space-sm) var(--space-md); background: none; border: none; border-bottom: 2px solid transparent; color: var(--text-secondary); cursor: pointer; display: ${event.status === 'completed' ? 'block' : 'none'};">Results</button>
                    </div>
                    
                    <div class="evt-tab-content" id="evt-tab-overview" style="display: block;">
                        <h3 style="margin-bottom: var(--space-sm); font-size: 18px;">About this Event</h3>
                        <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: var(--space-lg);">${event.description}</p>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-lg); margin-bottom: var(--space-lg);">
                            <div style="background: var(--surface); padding: var(--space-lg); border-radius: var(--radius-md); border: 1px solid var(--border);">
                                <h4 style="font-size: 14px; color: var(--text-secondary); margin-bottom: 8px;">Requirements</h4>
                                <p>${event.requirements || 'Open to all'}</p>
                            </div>
                            <div style="background: var(--surface); padding: var(--space-lg); border-radius: var(--radius-md); border: 1px solid var(--border);">
                                <h4 style="font-size: 14px; color: var(--text-secondary); margin-bottom: 8px;">Prizes</h4>
                                <p>${event.prize || 'Medals & Certificates'}</p>
                            </div>
                        </div>
                        
                        <h3 style="margin-bottom: var(--space-sm); font-size: 18px;">Rules</h3>
                        <p style="color: var(--text-secondary); line-height: 1.6;">${event.rules || 'Standard rules apply.'}</p>
                    </div>
                    
                    <div class="evt-tab-content" id="evt-tab-participants" style="display: none;">
                        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: var(--space-md);">
                            <!-- Simulated participants -->
                            <div style="background: var(--surface); padding: var(--space-md); border-radius: var(--radius-md); display: flex; align-items: center; gap: 10px; border: 1px solid var(--border);">
                                <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--primary-light); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">AK</div>
                                <div><div style="font-weight: 500;">Arun Kumar</div><div style="font-size: 12px; color: var(--text-secondary);">Athlete</div></div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="evt-tab-content" id="evt-tab-results" style="display: none;">
                        <p style="color: var(--text-secondary);">Results will be posted here.</p>
                    </div>
                </div>
                
                <!-- Sidebar -->
                <div style="display: flex; flex-direction: column; gap: var(--space-lg);">
                    <div style="background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: var(--space-xl); box-shadow: var(--shadow-sm);">
                        <h3 style="font-size: 18px; margin-bottom: var(--space-md); padding-bottom: var(--space-sm); border-bottom: 1px solid var(--border-light);">Registration</h3>
                        <div style="margin-bottom: var(--space-md);">
                            <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 4px;">Deadline</div>
                            <div style="font-weight: 500; color: ${event.status === 'completed' ? 'var(--error)' : 'var(--text)'};">${event.deadline || 'N/A'}</div>
                        </div>
                        ${event.status === 'upcoming' ? `
                            <button id="register-btn" style="width: 100%; background: var(--primary); color: white; border: none; padding: 12px; border-radius: var(--radius-md); font-weight: bold; cursor: pointer; transition: background 0.2s;">Register Now</button>
                        ` : `
                            <button disabled style="width: 100%; background: var(--bg-alt); color: var(--text-tertiary); border: none; padding: 12px; border-radius: var(--radius-md); font-weight: bold; cursor: not-allowed;">Registration Closed</button>
                        `}
                        <div style="display: flex; gap: 10px; margin-top: 10px;">
                            <button style="flex: 1; background: white; border: 1px solid var(--border); padding: 8px; border-radius: var(--radius-md); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 5px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"/></svg> Share</button>
                            <button style="flex: 1; background: white; border: 1px solid var(--border); padding: 8px; border-radius: var(--radius-md); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 5px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg> Save</button>
                        </div>
                    </div>
                    
                    <div style="background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: var(--space-xl); box-shadow: var(--shadow-sm);">
                        <h3 style="font-size: 18px; margin-bottom: var(--space-md); padding-bottom: var(--space-sm); border-bottom: 1px solid var(--border-light);">Location</h3>
                        <div style="display: flex; gap: 10px; align-items: flex-start; margin-bottom: 10px;">
                            <span style="font-size: 20px;">📍</span>
                            <div>
                                <div style="font-weight: 500;">${event.venue}</div>
                                <div style="font-size: 13px; color: var(--text-secondary);">${event.location ? `${event.location.district}, ${event.location.state}` : ''}</div>
                            </div>
                        </div>
                        <div style="width: 100%; height: 150px; background: #e2e8f0; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; color: var(--text-secondary); font-size: 12px; margin-top: 15px;">
                            [Map Placeholder]
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Registration Modal (Hidden) -->
            <div id="registration-modal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center; backdrop-filter: blur(4px);">
                <div style="background: var(--surface); width: 100%; max-width: 500px; border-radius: var(--radius-xl); padding: var(--space-2xl); position: relative; animation: slideUp 0.3s ease;">
                    <button id="close-modal" style="position: absolute; top: 20px; right: 20px; background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
                    <h2 style="font-family: 'Outfit', sans-serif; margin-bottom: var(--space-sm);">Register for Event</h2>
                    <p style="color: var(--text-secondary); margin-bottom: var(--space-xl); font-size: 14px;">Fill out this form to register for ${event.name}.</p>
                    <form id="reg-form" style="display: flex; flex-direction: column; gap: var(--space-md);">
                        <div>
                            <label style="display: block; margin-bottom: 4px; font-size: 13px; font-weight: 500;">Full Name</label>
                            <input type="text" style="width: 100%; padding: 10px; border: 1px solid var(--border); border-radius: var(--radius-md);" placeholder="Your Name" required>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 4px; font-size: 13px; font-weight: 500;">Contact Number</label>
                            <input type="tel" style="width: 100%; padding: 10px; border: 1px solid var(--border); border-radius: var(--radius-md);" placeholder="Phone Number" required>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 4px; font-size: 13px; font-weight: 500;">Category / Position</label>
                            <input type="text" style="width: 100%; padding: 10px; border: 1px solid var(--border); border-radius: var(--radius-md);" placeholder="E.g., U-18, Striker" required>
                        </div>
                        <button type="submit" class="btn btn--primary" style="margin-top: 10px; width: 100%; padding: 12px; font-size: 16px;">Submit Registration</button>
                    </form>
                </div>
            </div>
            <style>
                @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            </style>
        `;
        
        listView.style.display = 'none';
        detailView.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.history.pushState(null, '', `#events?id=${eventId}`);
        
        document.getElementById('back-to-events').addEventListener('click', () => {
            detailView.style.display = 'none';
            listView.style.display = 'block';
            window.history.pushState(null, '', `#events`);
        });
        
        // Tabs
        const tabBtns = detailView.querySelectorAll('.evt-tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => { 
                    b.classList.remove('active'); 
                    b.style.borderBottomColor = 'transparent'; 
                    b.style.color = 'var(--text-secondary)'; 
                });
                btn.classList.add('active');
                btn.style.borderBottomColor = 'var(--primary)';
                btn.style.color = 'var(--primary)';
                
                detailView.querySelectorAll('.evt-tab-content').forEach(tc => tc.style.display = 'none');
                document.getElementById('evt-tab-' + btn.getAttribute('data-target')).style.display = 'block';
            });
        });

        // Modal Logic
        const regBtn = document.getElementById('register-btn');
        const modal = document.getElementById('registration-modal');
        if(regBtn && modal) {
            regBtn.addEventListener('click', () => modal.style.display = 'flex');
            document.getElementById('close-modal').addEventListener('click', () => modal.style.display = 'none');
            document.getElementById('reg-form').addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Registration successful!');
                modal.style.display = 'none';
                regBtn.innerText = 'Registered';
                regBtn.disabled = true;
                regBtn.style.background = 'var(--success)';
            });
        }
    }
};
