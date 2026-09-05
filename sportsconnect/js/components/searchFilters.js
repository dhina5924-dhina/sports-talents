window.SportsConnect = window.SportsConnect || {};
SportsConnect.components = SportsConnect.components || {};

SportsConnect.components.searchFilters = {
    render(options = {}) {
        const sports = ['Cricket 🏏', 'Football ⚽', 'Volleyball 🏐', 'Basketball 🏀', 
            'Kabaddi 🤼', 'Athletics 🏃', 'Badminton 🏸', 'Hockey 🏑', 'Tennis 🎾', 
            'Table Tennis 🏓', 'Wrestling 💪', 'Boxing 🥊', 'Swimming 🏊', 
            'Archery 🏹', 'Weightlifting 🏋️', 'Kho-Kho 🏃‍♂️', 'Traditional 🎯'];

        const sportsHtml = sports.map(sport => {
            const name = sport.split(' ')[0];
            return `<div class="filter-chip" data-value="${name}">${sport}</div>`;
        }).join('');

        return `
            <div class="search-filters">
                <div class="search-filters__header">
                    <h3>Filters</h3>
                    <button class="btn btn--ghost btn--sm" id="clear-filters">Clear All</button>
                </div>
                
                <div class="search-filters__section">
                    <h4 class="search-filters__section-title">Sports</h4>
                    <div class="search-filters__chips" id="sport-filters">
                        ${sportsHtml}
                    </div>
                </div>
                
                <div class="search-filters__section">
                    <h4 class="search-filters__section-title">Location</h4>
                    <div class="form-group">
                        <select class="form-control" id="filter-state">
                            <option value="">All States</option>
                            <option value="Tamil Nadu">Tamil Nadu</option>
                            <option value="Kerala">Kerala</option>
                            <option value="Karnataka">Karnataka</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <select class="form-control" id="filter-district">
                            <option value="">All Districts</option>
                            <option value="Theni">Theni</option>
                            <option value="Madurai">Madurai</option>
                            <option value="Chennai">Chennai</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <input type="text" class="form-control" id="filter-village" placeholder="Village / Town">
                    </div>
                </div>
                
                <div class="search-filters__section">
                    <h4 class="search-filters__section-title">Demographics</h4>
                    <div class="form-group">
                        <label class="form-label">Gender</label>
                        <div class="radio-group">
                            <label><input type="radio" name="gender" value="all" checked> All</label>
                            <label><input type="radio" name="gender" value="male"> Male</label>
                            <label><input type="radio" name="gender" value="female"> Female</label>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Age Range: <span id="age-display">10 - 40</span></label>
                        <input type="range" class="form-control" id="filter-age" min="10" max="60" value="40">
                    </div>
                </div>
                
                <div class="search-filters__section">
                    <h4 class="search-filters__section-title">Experience & Role</h4>
                    <div class="form-group">
                        <select class="form-control" id="filter-experience">
                            <option value="">Any Experience</option>
                            <option value="beginner">Beginner (0-2 yrs)</option>
                            <option value="intermediate">Intermediate (3-5 yrs)</option>
                            <option value="advanced">Advanced (5+ yrs)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="checkbox-label">
                            <input type="checkbox" id="filter-available"> Currently looking for teams/events
                        </label>
                    </div>
                </div>
                
                <button class="btn btn--primary btn--full" id="apply-filters">Apply Filters</button>
            </div>
        `;
    },

    init(onApply) {
        // Toggle chips
        const chips = document.querySelectorAll('.filter-chip');
        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                chip.classList.toggle('active');
            });
        });

        // Age slider update
        const ageSlider = document.getElementById('filter-age');
        const ageDisplay = document.getElementById('age-display');
        if (ageSlider && ageDisplay) {
            ageSlider.addEventListener('input', (e) => {
                ageDisplay.textContent = `10 - ${e.target.value}`;
            });
        }

        // Apply filters
        const applyBtn = document.getElementById('apply-filters');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                const selectedSports = Array.from(document.querySelectorAll('.filter-chip.active'))
                    .map(chip => chip.dataset.value);
                
                const filters = {
                    sports: selectedSports,
                    state: document.getElementById('filter-state').value,
                    district: document.getElementById('filter-district').value,
                    village: document.getElementById('filter-village').value,
                    gender: document.querySelector('input[name="gender"]:checked').value,
                    maxAge: ageSlider ? ageSlider.value : 40,
                    experience: document.getElementById('filter-experience').value,
                    available: document.getElementById('filter-available').checked
                };
                
                if (typeof onApply === 'function') {
                    onApply(filters);
                }
            });
        }

        // Clear filters
        const clearBtn = document.getElementById('clear-filters');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
                document.getElementById('filter-state').value = '';
                document.getElementById('filter-district').value = '';
                document.getElementById('filter-village').value = '';
                document.querySelector('input[name="gender"][value="all"]').checked = true;
                if (ageSlider) { ageSlider.value = 40; ageDisplay.textContent = '10 - 40'; }
                document.getElementById('filter-experience').value = '';
                document.getElementById('filter-available').checked = false;
            });
        }
    }
};
