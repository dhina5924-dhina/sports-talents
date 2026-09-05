window.SportsConnect = window.SportsConnect || {};
SportsConnect.pages = SportsConnect.pages || {};

SportsConnect.pages.village = {
    render() {
        const athletes = SportsConnect.store ? SportsConnect.store.getUsers().filter(u => u.role === 'athlete') : [];
        const topAthletes = athletes.slice(0, 4);
        
        let athleteCards = topAthletes.map(a => SportsConnect.components.athleteCard ? SportsConnect.components.athleteCard.render(a) : `<div style="padding:20px; background:white;">${a.fullName}</div>`).join('');

        return `
        <div class="page-container" style="padding-bottom: var(--space-4xl);">
            <!-- Hero Section -->
            <div style="background: linear-gradient(135deg, #b45309, #d97706); border-radius: var(--radius-xl); padding: var(--space-4xl) var(--space-2xl); color: white; text-align: center; margin-bottom: var(--space-2xl); position: relative; overflow: hidden; box-shadow: var(--shadow-lg);">
                <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml;utf8,<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"2\" cy=\"2\" r=\"2\" fill=\"white\" opacity=\"0.1\"/></svg>') repeat; opacity: 0.5;"></div>
                <div style="position: relative; z-index: 1;">
                    <h1 style="font-family: 'Outfit', sans-serif; font-size: clamp(32px, 5vw, 48px); margin-bottom: var(--space-md);">Local & Village Sports 🏘️</h1>
                    <p style="font-size: 18px; opacity: 0.9; max-width: 700px; margin: 0 auto var(--space-xl); line-height: 1.5;">Discover raw, hidden sports talent from villages, rural communities, and local clubs across India. Support the grassroots heroes.</p>
                    
                    <div style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); border-radius: var(--radius-lg); padding: var(--space-md); max-width: 800px; margin: 0 auto; display: flex; flex-wrap: wrap; gap: 10px; align-items: center; justify-content: center;">
                        <select style="flex: 1; min-width: 150px; padding: 12px; border-radius: var(--radius-md); border: none; outline: none; font-size: 14px;">
                            <option value="">Select State</option>
                            <option value="TN">Tamil Nadu</option>
                            <option value="KL">Kerala</option>
                            <option value="HR">Haryana</option>
                            <option value="MH">Maharashtra</option>
                        </select>
                        <select style="flex: 1; min-width: 150px; padding: 12px; border-radius: var(--radius-md); border: none; outline: none; font-size: 14px;">
                            <option value="">Select District</option>
                            <option value="Theni">Theni</option>
                            <option value="Madurai">Madurai</option>
                        </select>
                        <select style="flex: 1; min-width: 150px; padding: 12px; border-radius: var(--radius-md); border: none; outline: none; font-size: 14px;">
                            <option value="">Select Village/Town</option>
                            <option value="Bodinayakanur">Bodinayakanur</option>
                            <option value="Cumbum">Cumbum</option>
                        </select>
                        <button class="btn btn--primary" style="background: var(--text); color: white; padding: 12px 24px;">Explore</button>
                    </div>
                </div>
            </div>

            <!-- Quick Stats -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-lg); margin-bottom: var(--space-4xl);">
                <div style="background: var(--surface); padding: var(--space-lg); border-radius: var(--radius-lg); text-align: center; border: 1px solid var(--border); box-shadow: var(--shadow-sm);">
                    <div style="font-size: 32px; font-weight: bold; color: var(--accent); font-family: 'Outfit', sans-serif;">4,500+</div>
                    <div style="font-size: 14px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 1px;">Village Athletes</div>
                </div>
                <div style="background: var(--surface); padding: var(--space-lg); border-radius: var(--radius-lg); text-align: center; border: 1px solid var(--border); box-shadow: var(--shadow-sm);">
                    <div style="font-size: 32px; font-weight: bold; color: var(--success); font-family: 'Outfit', sans-serif;">320+</div>
                    <div style="font-size: 14px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 1px;">Local Tournaments</div>
                </div>
                <div style="background: var(--surface); padding: var(--space-lg); border-radius: var(--radius-lg); text-align: center; border: 1px solid var(--border); box-shadow: var(--shadow-sm);">
                    <div style="font-size: 32px; font-weight: bold; color: var(--primary); font-family: 'Outfit', sans-serif;">150+</div>
                    <div style="font-size: 14px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 1px;">District Champions</div>
                </div>
                <div style="background: var(--surface); padding: var(--space-lg); border-radius: var(--radius-lg); text-align: center; border: 1px solid var(--border); box-shadow: var(--shadow-sm);">
                    <div style="font-size: 32px; font-weight: bold; color: var(--info); font-family: 'Outfit', sans-serif;">850+</div>
                    <div style="font-size: 14px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 1px;">Community Teams</div>
                </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: var(--space-4xl);">
                <!-- Rising Stars Section -->
                <section>
                    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: var(--space-lg);">
                        <div>
                            <h2 style="font-family: 'Outfit', sans-serif; font-size: 24px; margin-bottom: 4px;">Rising Local Stars 🌟</h2>
                            <p style="color: var(--text-secondary); font-size: 14px;">Promising athletes from rural backgrounds</p>
                        </div>
                        <button class="btn btn--secondary" style="font-size: 13px; padding: 6px 12px;">View All</button>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: var(--space-lg);">
                        ${athleteCards}
                    </div>
                </section>

                <!-- Success Stories Section -->
                <section style="background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-xl); padding: var(--space-2xl); box-shadow: var(--shadow-sm);">
                    <h2 style="font-family: 'Outfit', sans-serif; font-size: 24px; margin-bottom: var(--space-xl); text-align: center;">From Village to National Level 🏆</h2>
                    
                    <div style="display: grid; grid-template-columns: 1fr; md:grid-template-columns: 1fr 1fr; gap: var(--space-2xl);">
                        <div style="display: flex; gap: var(--space-md); flex-direction: column; sm:flex-row; background: var(--bg); padding: var(--space-lg); border-radius: var(--radius-lg);">
                            <div style="width: 100px; height: 100px; border-radius: 10px; background: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 3rem; flex-shrink: 0;">🏃‍♂️</div>
                            <div>
                                <h3 style="font-size: 18px; margin-bottom: 4px;">M. Ramesh</h3>
                                <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 8px;">Athletics • Madurai, TN</div>
                                <p style="font-size: 14px; line-height: 1.5; color: var(--text);">Started running on dirt tracks in his village. Discovered on SportsConnect by a state coach, he recently won Gold at the State Juniors.</p>
                            </div>
                        </div>
                        
                        <div style="display: flex; gap: var(--space-md); flex-direction: column; sm:flex-row; background: var(--bg); padding: var(--space-lg); border-radius: var(--radius-lg);">
                            <div style="width: 100px; height: 100px; border-radius: 10px; background: var(--secondary); display: flex; align-items: center; justify-content: center; font-size: 3rem; flex-shrink: 0;">🤼</div>
                            <div>
                                <h3 style="font-size: 18px; margin-bottom: 4px;">Sunil Kumar</h3>
                                <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 8px;">Kabaddi • Rohtak, HR</div>
                                <p style="font-size: 14px; line-height: 1.5; color: var(--text);">His local club videos went viral on this platform. He was scouted by a Pro team and is now in their training camp.</p>
                            </div>
                        </div>
                    </div>
                </section>
                
                <!-- Village Spotlight -->
                <section style="display: grid; grid-template-columns: 1fr; lg:grid-template-columns: 1fr 1fr; gap: var(--space-2xl); align-items: center;">
                    <div>
                        <span style="background: rgba(249, 115, 22, 0.1); color: var(--accent); padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Village Spotlight</span>
                        <h2 style="font-family: 'Outfit', sans-serif; font-size: 32px; margin: 12px 0;">Bodinayakanur, Theni</h2>
                        <p style="font-size: 16px; color: var(--text-secondary); line-height: 1.6; margin-bottom: var(--space-lg);">This town has become a powerhouse for Volleyball and Athletics. With 3 active community clubs and over 120 registered athletes on SportsConnect, Bodinayakanur consistently produces district-level champions.</p>
                        
                        <div style="display: flex; gap: 16px;">
                            <div>
                                <div style="font-size: 24px; font-weight: bold; color: var(--primary);">124</div>
                                <div style="font-size: 12px; color: var(--text-secondary);">Athletes</div>
                            </div>
                            <div style="width: 1px; background: var(--border);"></div>
                            <div>
                                <div style="font-size: 24px; font-weight: bold; color: var(--primary);">3</div>
                                <div style="font-size: 12px; color: var(--text-secondary);">Active Clubs</div>
                            </div>
                            <div style="width: 1px; background: var(--border);"></div>
                            <div>
                                <div style="font-size: 24px; font-weight: bold; color: var(--primary);">15</div>
                                <div style="font-size: 12px; color: var(--text-secondary);">Medals This Year</div>
                            </div>
                        </div>
                    </div>
                    
                    <div style="background: linear-gradient(45deg, #1e293b, #0f172a); border-radius: var(--radius-xl); padding: var(--space-2xl); color: white; position: relative; overflow: hidden; box-shadow: var(--shadow-xl);">
                        <div style="position: absolute; right: -20px; bottom: -20px; font-size: 150px; opacity: 0.1; transform: rotate(-15deg);">🏐</div>
                        <h3 style="font-size: 20px; margin-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 12px;">Top Prospects</h3>
                        
                        <div style="display: flex; flex-direction: column; gap: 16px; position: relative; z-index: 1;">
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <div style="width: 40px; height: 40px; border-radius: 50%; background: #3b82f6; display: flex; align-items: center; justify-content: center; font-weight: bold;">AK</div>
                                <div style="flex: 1;">
                                    <div style="font-weight: 500;">Arun Kumar</div>
                                    <div style="font-size: 12px; opacity: 0.7;">Athletics • 100m Sprint</div>
                                </div>
                                <button style="background: rgba(255,255,255,0.2); color: white; border: none; padding: 4px 12px; border-radius: 12px; font-size: 12px; cursor: pointer;">View</button>
                            </div>
                            
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <div style="width: 40px; height: 40px; border-radius: 50%; background: #10b981; display: flex; align-items: center; justify-content: center; font-weight: bold;">KM</div>
                                <div style="flex: 1;">
                                    <div style="font-weight: 500;">Karthik M.</div>
                                    <div style="font-size: 12px; opacity: 0.7;">Volleyball • Spiker</div>
                                </div>
                                <button style="background: rgba(255,255,255,0.2); color: white; border: none; padding: 4px 12px; border-radius: 12px; font-size: 12px; cursor: pointer;">View</button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
        `;
    },
    
    init() {
        // Dropdown interactions and simulated filtering could be added here
        // For the static template, this just provides the UI shell
        const selects = document.querySelectorAll('select');
        selects.forEach(s => {
            s.addEventListener('change', (e) => {
                console.log('Filter changed:', e.target.value);
            });
        });
    }
};
