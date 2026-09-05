window.SportsConnect = window.SportsConnect || {};
SportsConnect.pages = SportsConnect.pages || {};

SportsConnect.pages.sports = {
    render() {
        const sports = SportsConnect.store ? SportsConnect.store.getSports() : [];
        let gridHtml = sports.map(sport => `
            <div class="sport-card" data-id="${sport.id}" style="background: linear-gradient(135deg, ${sport.color}15, ${sport.color}05); border: 1px solid ${sport.color}33; border-radius: var(--radius-lg); padding: var(--space-2xl) var(--space-lg); text-align: center; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: var(--shadow-sm);">
                <div class="sport-icon" style="font-size: 4rem; margin-bottom: var(--space-md); filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1)); transition: transform 0.3s ease;">${sport.icon}</div>
                <h3 style="font-family: 'Outfit', sans-serif; font-size: 20px; margin-bottom: var(--space-xs); color: var(--text);">${sport.name}</h3>
                <div style="display: flex; justify-content: center; gap: var(--space-sm); font-size: 13px; color: var(--text-secondary);">
                    <span><strong style="color: ${sport.color};">${sport.athleteCount}</strong> Athletes</span> &bull; 
                    <span><strong style="color: ${sport.color};">${sport.teamCount}</strong> Teams</span>
                </div>
            </div>
        `).join('');

        return `
        <div class="page-container" style="padding-bottom: var(--space-4xl);">
            <!-- Grid View -->
            <div id="sports-grid-view">
                <header style="background: linear-gradient(135deg, var(--primary), var(--primary-light)); padding: var(--space-3xl) var(--space-xl); border-radius: var(--radius-xl); color: white; margin-bottom: var(--space-2xl); box-shadow: var(--shadow-md);">
                    <h1 style="font-family: 'Outfit', sans-serif; font-size: 32px; margin-bottom: var(--space-sm);">Explore Sports ⚽</h1>
                    <p style="font-size: 16px; opacity: 0.9; max-width: 600px;">Discover talented athletes, local teams, and upcoming events across 17+ sports disciplines in your region.</p>
                </header>
                <div class="sports-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: var(--space-xl);">
                    ${gridHtml}
                </div>
            </div>

            <!-- Detail View -->
            <div id="sport-detail-view" style="display: none; animation: fadeIn 0.3s ease;">
                <!-- Content injected via JS -->
            </div>
        </div>
        <style>
            .sport-card:hover { transform: translateY(-5px); box-shadow: var(--shadow-lg); border-color: transparent; }
            .sport-card:hover .sport-icon { transform: scale(1.1); }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        </style>
        `;
    },
    
    init() {
        const gridView = document.getElementById('sports-grid-view');
        const detailView = document.getElementById('sport-detail-view');
        const cards = document.querySelectorAll('.sport-card');
        
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const sportId = parseInt(card.getAttribute('data-id'));
                this.showSportDetail(sportId, gridView, detailView);
            });
        });
    },
    
    showSportDetail(sportId, gridView, detailView) {
        const sport = SportsConnect.store.getSports().find(s => s.id === sportId);
        if (!sport) return;
        
        const athletes = SportsConnect.store.getUsers().filter(u => u.sport === sport.name);
        const teams = SportsConnect.store.getTeams ? SportsConnect.store.getTeams().filter(t => t.sport === sport.name) : [];
        const events = SportsConnect.store.getEvents().filter(e => e.sport === sport.name);
        
        const renderAthletes = () => athletes.map(a => SportsConnect.components.athleteCard ? SportsConnect.components.athleteCard.render(a) : `<div style="background:var(--surface); padding:var(--space-md); border-radius:var(--radius-md); box-shadow:var(--shadow-sm);">${a.fullName}</div>`).join('');
        const renderTeams = () => teams.length ? teams.map(t => `<div style="background:var(--surface); padding:var(--space-md); border-radius:var(--radius-md); box-shadow:var(--shadow-sm); display:flex; gap:10px; align-items:center;"><div style="font-size:2rem; width:50px; height:50px; background:${t.logoColor}22; border-radius:50%; display:flex; align-items:center; justify-content:center;">${t.logo}</div><div><h4>${t.name}</h4><p style="font-size:12px;color:var(--text-secondary);">${t.membersCount} Members</p></div></div>`).join('') : '<p style="color:var(--text-secondary); padding:var(--space-xl); text-align:center; background:var(--surface); border-radius:var(--radius-md);">No teams found for this sport.</p>';
        const renderEvents = () => events.length ? events.map(e => SportsConnect.components.eventCard ? SportsConnect.components.eventCard.render(e) : `<div style="background:white;padding:10px;">${e.name}</div>`).join('') : '<p style="color:var(--text-secondary); padding:var(--space-xl); text-align:center; background:var(--surface); border-radius:var(--radius-md);">No upcoming events.</p>';

        detailView.innerHTML = `
            <button id="back-to-sports" style="background: var(--surface); border: 1px solid var(--border); padding: 8px 16px; border-radius: var(--radius-full); cursor: pointer; display: flex; align-items: center; gap: 8px; font-weight: 500; margin-bottom: var(--space-lg); transition: all 0.2s; box-shadow: var(--shadow-sm);">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg> Back to All Sports
            </button>
            
            <div style="background: linear-gradient(135deg, ${sport.color}, ${sport.color}dd); color: white; padding: var(--space-3xl) var(--space-xl); border-radius: var(--radius-xl); margin-bottom: var(--space-xl); display: flex; flex-direction: column; md:flex-row; align-items: center; md:align-items: flex-start; gap: var(--space-2xl); box-shadow: 0 10px 25px ${sport.color}44;">
                <div style="font-size: 6rem; background: rgba(255,255,255,0.2); width: 140px; height: 140px; border-radius: 50%; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px); box-shadow: inset 0 0 20px rgba(255,255,255,0.5);">${sport.icon}</div>
                <div style="text-align: center; md:text-align: left; flex: 1;">
                    <h1 style="font-family: 'Outfit', sans-serif; font-size: 40px; margin-bottom: var(--space-sm);">${sport.name}</h1>
                    <p style="font-size: 16px; opacity: 0.9; margin-bottom: var(--space-lg); max-width: 600px;">Join the growing community of ${sport.name} enthusiasts. Discover local talent, join teams, and participate in tournaments.</p>
                    <div style="display: flex; gap: var(--space-lg); justify-content: center; md:justify-content: flex-start;">
                        <div style="background: rgba(255,255,255,0.15); padding: var(--space-sm) var(--space-lg); border-radius: var(--radius-md); backdrop-filter: blur(5px);">
                            <div style="font-size: 20px; font-weight: bold;">${sport.athleteCount}</div>
                            <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.8;">Athletes</div>
                        </div>
                        <div style="background: rgba(255,255,255,0.15); padding: var(--space-sm) var(--space-lg); border-radius: var(--radius-md); backdrop-filter: blur(5px);">
                            <div style="font-size: 20px; font-weight: bold;">${sport.teamCount}</div>
                            <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.8;">Teams</div>
                        </div>
                        <div style="background: rgba(255,255,255,0.15); padding: var(--space-sm) var(--space-lg); border-radius: var(--radius-md); backdrop-filter: blur(5px);">
                            <div style="font-size: 20px; font-weight: bold;">${events.length}</div>
                            <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.8;">Events</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div style="display: flex; gap: var(--space-md); border-bottom: 1px solid var(--border); margin-bottom: var(--space-xl); overflow-x: auto; padding-bottom: 2px;">
                <button class="sport-tab-btn active" data-target="athletes" style="padding: var(--space-sm) var(--space-md); background: none; border: none; border-bottom: 2px solid ${sport.color}; color: ${sport.color}; font-weight: 600; cursor: pointer; white-space: nowrap; font-size: 15px;">Athletes (${athletes.length})</button>
                <button class="sport-tab-btn" data-target="teams" style="padding: var(--space-sm) var(--space-md); background: none; border: none; border-bottom: 2px solid transparent; color: var(--text-secondary); cursor: pointer; white-space: nowrap; font-size: 15px;">Teams (${teams.length})</button>
                <button class="sport-tab-btn" data-target="events" style="padding: var(--space-sm) var(--space-md); background: none; border: none; border-bottom: 2px solid transparent; color: var(--text-secondary); cursor: pointer; white-space: nowrap; font-size: 15px;">Events (${events.length})</button>
            </div>
            
            <div class="sport-tab-content" id="sport-tab-athletes" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: var(--space-lg);">
                ${renderAthletes() || '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: var(--space-2xl); background: var(--surface); border-radius: var(--radius-lg);">No athletes found.</p>'}
            </div>
            <div class="sport-tab-content" id="sport-tab-teams" style="display: none; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: var(--space-lg);">
                ${renderTeams()}
            </div>
            <div class="sport-tab-content" id="sport-tab-events" style="display: none; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: var(--space-lg);">
                ${renderEvents()}
            </div>
        `;
        
        gridView.style.display = 'none';
        detailView.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        document.getElementById('back-to-sports').addEventListener('click', () => {
            detailView.style.display = 'none';
            gridView.style.display = 'block';
        });
        
        const tabBtns = detailView.querySelectorAll('.sport-tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => { 
                    b.classList.remove('active'); 
                    b.style.borderBottomColor = 'transparent'; 
                    b.style.color = 'var(--text-secondary)'; 
                    b.style.fontWeight = 'normal'; 
                });
                btn.classList.add('active');
                btn.style.borderBottomColor = sport.color;
                btn.style.color = sport.color;
                btn.style.fontWeight = '600';
                
                detailView.querySelectorAll('.sport-tab-content').forEach(tc => tc.style.display = 'none');
                document.getElementById('sport-tab-' + btn.getAttribute('data-target')).style.display = 'grid';
            });
        });
    }
};
