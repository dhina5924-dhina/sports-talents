window.SportsConnect = window.SportsConnect || {};
SportsConnect.pages = SportsConnect.pages || {};

SportsConnect.pages.search = {
    render() {
        const query = (new URLSearchParams(window.location.hash.split('?')[1])).get('q') || '';
        
        return `
        <div class="page-container" style="padding-bottom: var(--space-4xl);">
            <div style="background: linear-gradient(135deg, var(--primary-dark), var(--primary)); border-radius: var(--radius-xl); padding: var(--space-3xl) var(--space-xl); margin-bottom: var(--space-2xl); text-align: center; color: white;">
                <h1 style="font-family: 'Outfit', sans-serif; font-size: 32px; margin-bottom: var(--space-md);">Search SportsConnect</h1>
                
                <form id="search-form" style="max-width: 600px; margin: 0 auto; position: relative;">
                    <svg style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--text-secondary);" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <input type="text" id="search-input" value="${query}" placeholder="Search for athletes, teams, events, or posts..." style="width: 100%; padding: 16px 20px 16px 50px; border-radius: 30px; border: none; font-size: 16px; outline: none; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                    <button type="submit" style="position: absolute; right: 8px; top: 8px; bottom: 8px; background: var(--accent); color: white; border: none; border-radius: 24px; padding: 0 20px; font-weight: bold; cursor: pointer;">Search</button>
                </form>
            </div>
            
            <div id="search-results-container">
                <!-- Injected by init -->
            </div>
        </div>
        `;
    },
    
    init() {
        const form = document.getElementById('search-form');
        const input = document.getElementById('search-input');
        
        const renderResults = (q) => {
            const container = document.getElementById('search-results-container');
            if(!q.trim()) {
                container.innerHTML = `
                    <div style="margin-bottom: var(--space-2xl);">
                        <h3 style="font-size: 16px; color: var(--text-secondary); margin-bottom: var(--space-md);">Trending Searches</h3>
                        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                            <span class="trend-chip" style="background: var(--surface); border: 1px solid var(--border); padding: 8px 16px; border-radius: 20px; cursor: pointer; transition: all 0.2s;">District Athletics 2026</span>
                            <span class="trend-chip" style="background: var(--surface); border: 1px solid var(--border); padding: 8px 16px; border-radius: 20px; cursor: pointer; transition: all 0.2s;">Kabaddi Techniques</span>
                            <span class="trend-chip" style="background: var(--surface); border: 1px solid var(--border); padding: 8px 16px; border-radius: 20px; cursor: pointer; transition: all 0.2s;">Theni Cricket Club</span>
                        </div>
                    </div>
                `;
                
                document.querySelectorAll('.trend-chip').forEach(chip => {
                    chip.addEventListener('click', () => {
                        input.value = chip.innerText;
                        renderResults(chip.innerText);
                    });
                });
                return;
            }
            
            // Simulation of search logic
            const qLower = q.toLowerCase();
            const athletes = SportsConnect.store.getUsers().filter(u => u.fullName.toLowerCase().includes(qLower) || u.sport.toLowerCase().includes(qLower));
            const events = SportsConnect.store.getEvents().filter(e => e.name.toLowerCase().includes(qLower));
            
            let html = `<p style="margin-bottom: 24px; color: var(--text-secondary);">Showing results for "<strong>${q}</strong>"</p>`;
            
            if(athletes.length === 0 && events.length === 0) {
                html += `
                    <div style="text-align: center; padding: 60px 20px; background: var(--surface); border-radius: var(--radius-xl);">
                        <div style="font-size: 48px; margin-bottom: 16px;">🔍</div>
                        <h3 style="font-family: 'Outfit'; margin-bottom: 8px;">No results found</h3>
                        <p style="color: var(--text-secondary);">Try adjusting your search or use different keywords.</p>
                    </div>
                `;
            } else {
                if(athletes.length > 0) {
                    html += `
                        <div style="margin-bottom: var(--space-2xl);">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                                <h2 style="font-family: 'Outfit'; font-size: 20px;">Athletes (${athletes.length})</h2>
                            </div>
                            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 16px;">
                                ${athletes.map(a => SportsConnect.components.athleteCard ? SportsConnect.components.athleteCard.render(a) : `<div style="padding:10px; background:white;">${a.fullName}</div>`).join('')}
                            </div>
                        </div>
                    `;
                }
                
                if(events.length > 0) {
                    html += `
                        <div style="margin-bottom: var(--space-2xl);">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                                <h2 style="font-family: 'Outfit'; font-size: 20px;">Events (${events.length})</h2>
                            </div>
                            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px;">
                                ${events.map(e => SportsConnect.components.eventCard ? SportsConnect.components.eventCard.render(e) : `<div style="padding:10px; background:white;">${e.name}</div>`).join('')}
                            </div>
                        </div>
                    `;
                }
            }
            
            container.innerHTML = html;
        };
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const q = input.value;
            window.history.pushState(null, '', `#search?q=${encodeURIComponent(q)}`);
            renderResults(q);
        });
        
        renderResults(input.value);
    }
};
