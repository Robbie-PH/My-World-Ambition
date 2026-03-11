let nationsData = [];

async function init() {
    try {
        const response = await fetch('nations_full.json');
        nationsData = await response.json();
        
        // Setup Scroll Listener for Header
        window.addEventListener('scroll', () => {
            const header = document.querySelector('header');
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });

        handleRoute();
    } catch (err) {
        console.error("Failed to load nations data:", err);
    }
}

function handleRoute() {
    const hash = window.location.hash || '#home';
    const mainContainer = document.querySelector('.container');
    const modal = document.getElementById('nation-modal');
    
    // Reset views
    modal.style.display = 'none';
    document.body.className = ''; // Clear regional themes

    if (hash.startsWith('#nation/')) {
        const nationId = hash.split('/')[1];
        const nation = nationsData.find(n => n.id === nationId);
        if (nation) showNation(nation);
    } else if (hash.startsWith('#region/')) {
        const region = hash.split('/')[1];
        filterByRegion(region);
        document.getElementById('explorer').scrollIntoView({ behavior: 'smooth' });
    } else if (hash === '#home' || hash === '') {
        renderHomePage();
    }
}

function filterByRegion(region) {
    const filtered = nationsData.filter(n => n.region === region);
    renderNations(filtered, `Exploring ${region}`);
    
    // Set search input to region
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.value = '';
        searchInput.placeholder = `Find a nation in ${region}...`;
    }
}

function renderHomePage() {
    const container = document.querySelector('.container');
    // Keep existing layout but ensure it's visible
    const intro = document.getElementById('world-intro');
    if (intro) intro.style.display = 'grid';
    
    const hub = document.querySelector('.search-hub');
    if (hub) hub.style.display = 'block';
    
    renderNations(nationsData);
}

function renderNations(data, title = "The Global Directory") {
    const nationsGrid = document.getElementById('nations-grid');
    const explorerHeader = document.querySelector('#explorer h2');
    if (explorerHeader) explorerHeader.innerText = title;

    nationsGrid.innerHTML = data.map((nation, index) => `
        <div class="card nation-card" 
             onclick="window.location.hash='#nation/${nation.id}'" 
             style="animation-delay: ${index * 0.01}s; cursor: pointer;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem;">
                <img src="${nation.flag}" alt="${nation.name} flag" style="width: 50px; border-radius: 6px; box-shadow: 0 5px 15px rgba(0,0,0,0.3);">
                <span style="font-size: 0.7rem; color: var(--accent); font-weight: 800; border: 1px solid var(--accent); padding: 2px 8px; border-radius: 10px; text-transform: uppercase;">${nation.region}</span>
            </div>
            <div>
                <h4 style="font-family: 'Outfit'; font-size: 1.4rem; font-weight: 700; margin-bottom: 0.5rem; letter-spacing: -0.5px;">${nation.name}</h4>
                <p style="font-size: 0.85rem; color: #888; line-height: 1.3;">${nation.spirit.substring(0, 70)}...</p>
            </div>
            <div style="margin-top: 1.5rem; display: flex; align-items: center; gap: 0.5rem; color: var(--accent); font-weight: 600; font-size: 0.9rem;">
                Explore Details &rarr;
            </div>
        </div>
    `).join('');
}

function showNation(n) {
    const modal = document.getElementById('nation-modal');
    const modalBody = document.getElementById('modal-body');
    
    // Apply regional theme to body
    document.body.classList.add(`region-${n.region.toLowerCase().replace(' ', '-')}`);

    modalBody.innerHTML = `
        <div class="nation-header" style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 3.5rem; text-align: center;">
            <img src="${n.flag}" style="width: 140px; margin: 0 auto; border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
            <div>
                <h2 style="font-size: clamp(2.5rem, 8vw, 5rem); font-family: 'Outfit'; font-weight: 900; letter-spacing: -3px; line-height: 1; margin: 1.5rem 0;">${n.name}</h2>
                <div style="height: 4px; width: 60px; background: var(--accent); margin: 1.5rem auto; border-radius: 2px;"></div>
                <p style="font-family: 'Outfit'; font-size: clamp(1.2rem, 3vw, 1.8rem); color: #fff; max-width: 850px; margin: 0 auto; line-height: 1.4; opacity: 0.95; font-style: italic;">"${n.spirit}"</p>
            </div>
        </div>
        
        <div class="highlights-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 3rem;">
            <div class="card" style="background: rgba(255,255,255,0.02); border-top: 4px solid var(--accent);">
                <h3 style="color: var(--accent); font-size: 1.6rem; margin-bottom: 2rem; display: flex; align-items: center; gap: 1rem;">
                    <span style="font-size: 1.5rem;">✨</span> Cultural Pillars
                </h3>
                <ul style="list-style: none;">
                    ${n.highlights.map(h => `<li style="margin-bottom: 1.5rem; color: #eee; font-size: 1.1rem; padding-left: 1.5rem; position: relative;">
                        <span style="position: absolute; left: 0; color: var(--accent);">&bull;</span> ${h}
                    </li>`).join('')}
                </ul>
            </div>
            
            <div class="card" style="background: rgba(0,0,0,0.3); border-top: 4px solid #ff4d4d;">
                <h3 style="color: #ff4d4d; font-size: 1.6rem; margin-bottom: 2rem; display: flex; align-items: center; gap: 1rem;">
                    <span style="font-size: 1.5rem;">⚖️</span> The Challenges
                </h3>
                <div style="display: grid; grid-template-columns: 1fr; gap: 1.2rem;">
                    ${n.lows.map(l => `
                        <div style="padding: 1.2rem; background: rgba(255,77,77,0.03); border-radius: 12px; border-left: 3px solid #ff4d4d; font-size: 0.95rem; color: #ccc; line-height: 1.4;">
                            ${l}
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="card" style="background: rgba(0,0,0,0.3); border-top: 4px solid #00ff88;">
                <h3 style="color: #00ff88; font-size: 1.6rem; margin-bottom: 2rem; display: flex; align-items: center; gap: 1rem;">
                    <span style="font-size: 1.5rem;">🏔️</span> The Successes
                </h3>
                <div style="display: grid; grid-template-columns: 1fr; gap: 1.2rem;">
                    ${n.highs.map(h => `
                        <div style="padding: 1.2rem; background: rgba(0,255,136,0.03); border-radius: 12px; border-left: 3px solid #00ff88; font-size: 0.95rem; color: #ccc; line-height: 1.4;">
                            ${h}
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>

        <div style="margin-top: 5rem; padding: 4rem; background: var(--glass); border-radius: 40px; border: 1px solid var(--glass-border); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 3rem;">
            <div style="flex: 1; min-width: 300px;">
                <h4 style="margin-bottom: 0.75rem; font-family: 'Outfit'; font-weight: 800; color: var(--accent); letter-spacing: 2px;">DIPLOMATIC CONTACT</h4>
                <p style="font-size: 1.3rem; font-weight: 500;">${n.embassy}</p>
            </div>
            <div style="text-align: right; flex: 1; min-width: 300px;">
                <p style="color: var(--text-dim); font-size: 1rem; text-transform: uppercase; letter-spacing: 4px; margin-bottom: 0.5rem;">${n.region} Archive</p>
                <p style="font-weight: 900; font-size: 2rem; color: rgba(255,255,255,0.05); font-family: 'Outfit';">${n.id.toUpperCase()}</p>
            </div>
        </div>
        
        <div style="margin-top: 5rem; text-align: center;">
            <button onclick="window.location.hash='#home'" style="background: var(--accent); color: white; border: none; padding: 1.5rem 5rem; border-radius: 100px; font-family: 'Outfit'; font-weight: 800; font-size: 1.3rem; cursor: pointer; transition: var(--transition); box-shadow: 0 20px 40px var(--accent-glow);">
                Return to World Explorer
            </button>
        </div>
    `;
    modal.style.display = 'block';
}

// Close Modal logic
const closeBtn = document.querySelector('.close-modal');
if (closeBtn) {
    closeBtn.onclick = () => {
        window.location.hash = '#home';
    };
}

// Initial Load
document.addEventListener('DOMContentLoaded', init);
window.addEventListener('hashchange', handleRoute);

// Search Logic
const searchInputElement = document.querySelector('.search-input');
if (searchInputElement) {
    searchInputElement.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = nationsData.filter(n => 
            n.name.toLowerCase().includes(term) || 
            n.region.toLowerCase().includes(term) ||
            n.id.toLowerCase().includes(term)
        );
        renderNations(filtered, term ? `Search Results for "${term}"` : "The Global Directory");
    });
}
