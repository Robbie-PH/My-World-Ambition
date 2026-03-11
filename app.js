let nationsData = [];

async function init() {
    try {
        const response = await fetch('nations_full.json');
        nationsData = await response.json();
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
    renderNations(filtered);
    
    // Set search input to region
    const searchInput = document.querySelector('.search-input');
    searchInput.value = `Region: ${region}`;
}

function renderHomePage() {
    const container = document.querySelector('.container');
    // Keep existing layout but ensure it's visible
    document.getElementById('world-intro').style.display = 'grid';
    document.querySelector('.search-hub').style.display = 'block';
    renderNations(nationsData);
}

function renderNations(data) {
    const nationsGrid = document.getElementById('nations-grid');
    nationsGrid.innerHTML = data.map(nation => `
        <div class="card nation-card" onclick="window.location.hash='#nation/${nation.id}'" style="padding: 1.5rem; text-align: left; cursor: pointer;">
            <img src="${nation.flag}" alt="${nation.name} flag" style="width: 40px; border-radius: 4px; margin-bottom: 1rem;">
            <h4 style="font-family: 'Outfit'; font-size: 1.25rem;">${nation.name}</h4>
            <p style="font-size: 0.9rem; color: #a0a0a0; margin-top: 0.5rem;">Explore Profile &rarr;</p>
        </div>
    `).join('');
}

function showNation(n) {
    const modal = document.getElementById('nation-modal');
    const modalBody = document.getElementById('modal-body');
    
    // Apply regional theme to body
    document.body.classList.add(`region-${n.region.toLowerCase().replace(' ', '-')}`);

    modalBody.innerHTML = `
        <div class="nation-header" style="display: flex; align-items: center; gap: 2rem; margin-bottom: 2rem;">
            <img src="${n.flag}" style="width: 120px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            <div>
                <h2 style="font-size: clamp(2rem, 5vw, 4rem); font-family: 'Outfit'; margin-bottom: 0.5rem;">${n.name}</h2>
                <p style="font-style: italic; color: #4a90e2; font-size: 1.2rem; max-width: 600px;">"${n.spirit}"</p>
            </div>
        </div>
        
        <div class="highlights-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
            <div class="card" style="background: rgba(74, 144, 226, 0.1);">
                <h3 style="color: #4a90e2; margin-bottom: 1.5rem;">✨ Global Highlights</h3>
                <ul>${n.highlights.map(h => `<li style="margin-bottom: 0.8rem;">${h}</li>`).join('')}</ul>
            </div>
            <div class="card" style="background: rgba(226, 74, 74, 0.05);">
                <h3 style="color: #e24a4a; margin-bottom: 1.5rem;">⚖️ The Challenges</h3>
                <ul style="display: grid; grid-template-columns: 1fr; gap: 0.5rem;">
                    ${n.lows.map(l => `<li style="font-size: 0.9rem; color: #ddd;">${l}</li>`).join('')}
                </ul>
            </div>
            <div class="card" style="background: rgba(74, 226, 144, 0.05);">
                <h3 style="color: #4ae290; margin-bottom: 1.5rem;">🏔️ The Successes</h3>
                <ul style="display: grid; grid-template-columns: 1fr; gap: 0.5rem;">
                    ${n.highs.map(h => `<li style="font-size: 0.9rem; color: #ddd;">${h}</li>`).join('')}
                </ul>
            </div>
        </div>

        <div style="margin-top: 3rem; padding: 2rem; background: var(--glass); border-radius: 20px; border: 1px solid var(--glass-border);">
            <h4 style="margin-bottom: 1rem; font-family: 'Outfit';">Diplomatic & Helpful Info</h4>
            <p><strong>Embassy/Contact:</strong> ${n.embassy}</p>
            <p style="margin-top: 1rem; color: var(--text-dim); font-size: 0.85rem;">Region: ${n.region} | Data curated for My World Ambition</p>
        </div>
        
        <div style="margin-top: 2rem; text-align: center;">
            <button onclick="window.location.hash='#home'" class="search-input" style="width: auto; padding: 1rem 3rem; cursor: pointer; background: var(--accent);">Back to World Explorer</button>
        </div>
    `;
    modal.style.display = 'block';
}

// Initial Load
document.addEventListener('DOMContentLoaded', init);
window.addEventListener('hashchange', handleRoute);

// Search Logic
document.querySelector('.search-input').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = nationsData.filter(n => n.name.toLowerCase().includes(term) || n.region.toLowerCase().includes(term));
    renderNations(filtered);
});
