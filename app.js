// Initialize App State
let currentBalance = 0;
let currentCardValue = 5;
let dailySpinsUsed = 0;
let totalSteps = 0;

// Load initial data on startup
window.onload = function() {
    loadLocalData();
    updateDisplay();
};

function loadLocalData() {
    const savedBalance = localStorage.getItem('paw_balance');
    if (savedBalance) currentBalance = parseInt(savedBalance, 10);
    
    const savedSpins = localStorage.getItem('paw_spins_today');
    if (savedSpins) dailySpinsUsed = parseInt(savedSpins, 10);

    const savedSteps = localStorage.getItem('paw_steps');
    if (savedSteps) totalSteps = parseInt(savedSteps, 10);
}

function saveLocalData() {
    localStorage.setItem('paw_balance', currentBalance);
    localStorage.setItem('paw_spins_today', dailySpinsUsed);
    localStorage.setItem('paw_steps', totalSteps);
}

function updateDisplay() {
    const balanceEl = document.getElementById('balance-display');
    if (balanceEl) balanceEl.innerText = currentBalance;

    const spinLimitEl = document.getElementById('spin-limit-display');
    if (spinLimitEl) spinLimitEl.innerText = `${5 - dailySpinsUsed}/5`;

    const stepEl = document.getElementById('step-display');
    if (stepEl) stepEl.innerText = totalSteps;
}

// 🕹️ FEATURE: Spin the Wheel (Max 5 Daily Tries)
function spinWheel() {
    const feedbackEl = document.getElementById('spin-feedback');
    
    if (dailySpinsUsed >= 5) {
        if (feedbackEl) feedbackEl.innerHTML = `<span class="text-red-400 font-bold">❌ Limit reached! Come back tomorrow.</span>`;
        return;
    }

    dailySpinsUsed++;
    
    // Profit-aligned reward tiers: 10, 20, 50, 100, 550, 1000
    const prizes =; 
    const wonPrize = prizes[Math.floor(Math.random() * prizes.length)];
    
    currentBalance += wonPrize;
    
    if (feedbackEl) {
        feedbackEl.innerHTML = `<span class="text-emerald-400 font-bold">🎉 Landed on +${wonPrize} Pawcoins!</span>`;
    }

    saveLocalData();
    updateDisplay();
}

// 🃏 Mini Game Logic (Higher or Lower)
function playMiniGame(guess) {
    const feedbackEl = document.getElementById('game-feedback-text');
    let isWin = false;
    const nextCard = Math.floor(Math.random() * 10) + 1;

    if (guess === 'higher' && nextCard > currentCardValue) isWin = true;
    if (guess === 'lower' && nextCard < currentCardValue) isWin = true;

    if (isWin) {
        currentBalance += 8;
        if (feedbackEl) feedbackEl.innerHTML = `<span style="color:#059669; font-weight:bold;">✅ Correct! Earned +8 Coins!</span>`;
    } else {
        if (feedbackEl) feedbackEl.innerHTML = `<span style="color:#dc2626; font-weight:bold;">❌ Wrong! Next card was ${nextCard}.</span>`;
    }

    currentCardValue = nextCard;
    const cardDisplayEl = document.getElementById('game-card-display');
    if (cardDisplayEl) cardDisplayEl.innerText = currentCardValue;

    saveLocalData();
    updateDisplay();
}

// 🚶 FEATURE: Walking Tracker Pedometer Sim
function simulateWalk() {
    // Adds a batch of random steps to simulate hardware movement
    const generatedSteps = Math.floor(Math.random() * 120) + 40;
    totalSteps += generatedSteps;

    // Grants 1 coin per 100 steps milestone reached
    if (totalSteps >= 100) {
        const reward = Math.floor(totalSteps / 100);
        currentBalance += reward;
        totalSteps %= 100; 
    }

    saveLocalData();
    updateDisplay();
}

// 🎬 FEATURE: Automated Video Reward Cooldown Check
function checkVideoAdCooldown() {
    const feedbackEl = document.getElementById('video-feedback');
    const lastAdTime = localStorage.getItem('last_video_time');
    const now = Date.now();
    const threeHours = 3 * 60 * 60 * 1000;

    if (!lastAdTime || (now - lastAdTime) >= threeHours) {
        triggerRewardedAd('3hr_chest');
        localStorage.setItem('last_video_time', now);
        if (feedbackEl) feedbackEl.innerHTML = `<span class="text-emerald-400">🎁 Premium Chest Claimed! +20 Coins.</span>`;
    } else {
        const remainingMs = threeHours - (now - lastAdTime);
        const minutesLeft = Math.ceil(remainingMs / (60 * 1000));
        if (feedbackEl) feedbackEl.innerHTML = `<span class="text-zinc-500">⏳ Chest locked. Try again in ${minutesLeft} mins.</span>`;
    }
}

// Utility Tasks and Ad Triggers
function completeTask(checkbox, rewardCoins) {
    currentBalance += rewardCoins;
    saveLocalData(); 
    updateDisplay();
}

function addExpense() { 
    currentBalance += 2; 
    saveLocalData(); 
    updateDisplay(); 
}

function triggerRewardedAd(fName) { 
    currentBalance += 20; 
    saveLocalData(); 
    updateDisplay(); 
}
