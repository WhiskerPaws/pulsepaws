// Stable Independent Offline Storage System
let currentBalance = parseInt(localStorage.getItem('wp_balance')) || 120;
let dailySpinsUsed = parseInt(localStorage.getItem('wp_spins_used')) || 0;
let currentStreak = parseInt(localStorage.getItem('wp_streak')) || 0;
let lastClaimDate = localStorage.getItem('wp_last_claim') || "";
let runningExpenses = 0.00;
let currentUser = localStorage.getItem('wp_user_logged') || null;
let activeCashoutPlatform = "";

// Mini Game Active Variables
let currentCardValue = 7;

// Core Application Startup Sequence
window.addEventListener('DOMContentLoaded', () => {
    const lastSpinDate = localStorage.getItem('wp_last_spin_date');
    const todayStr = new Date().toDateString();
    
    if (lastSpinDate !== todayStr) {
        dailySpinsUsed = 0;
        localStorage.setItem('wp_spins_used', 0);
        localStorage.setItem('wp_last_spin_date', todayStr);
    }
    resetCardGame();
    updateDisplay();
});

function saveLocalData() {
    localStorage.setItem('wp_balance', currentBalance);
    localStorage.setItem('wp_streak', currentStreak);
    localStorage.setItem('wp_last_claim', lastClaimDate);
    localStorage.setItem('wp_spins_used', dailySpinsUsed);
}

function updateDisplay() {
    document.getElementById('coin-balance').innerText = currentBalance;
    document.getElementById('php-balance').innerText = (currentBalance * 0.058).toFixed(2);
    document.getElementById('spins-count').innerText = 5 - dailySpinsUsed;
    document.getElementById('streak-days-count').innerText = currentStreak;

    const spinBtn = document.getElementById('spin-btn');
    if (spinBtn) {
        if (dailySpinsUsed >= 5) {
            spinBtn.disabled = true;
            spinBtn.style.backgroundColor = '#cbd5e1';
            spinBtn.innerText = "🔒 Daily Limit Reached";
        } else {
            spinBtn.disabled = false;
            spinBtn.style.backgroundColor = '#059669';
            spinBtn.innerText = "🎰 Watch Ad & Spin Wheel";
        }
    }

    for (let i = 1; i <= 7; i++) {
        const dayEl = document.getElementById(`streak-d${i}`);
        if (dayEl) {
            if (i <= currentStreak) {
                dayEl.className = "streak-day streak-day-active";
            } else if (i === currentStreak + 1) {
                dayEl.className = "streak-day streak-day-current";
            } else {
                dayEl.className = "streak-day";
            }
        }
    }

    const authContainer = document.getElementById('auth-ui-container');
    if (currentUser && authContainer) {
        authContainer.innerHTML = `<span style="font-size:11px; font-weight:700; color:#4f46e5; background-color:#f5f3ff; border:1px solid #ddd6fe; padding:6px 10px; border-radius:8px;">✨ Active</span>`;
    }
}

// Account Modal Management
let activeAuthType = "signup";
function openAuthModal(type) {
    activeAuthType = type;
    document.getElementById('modal-header-title').innerText = type === 'signup' ? "Create Account" : "Welcome Back Login";
    document.getElementById('auth-modal').style.display = 'flex';
}
function closeAuthModal() {
    document.getElementById('auth-modal').style.display = 'none';
}
function submitAuthForm() {
    const email = document.getElementById('auth-email-input').value.trim();
    currentUser = email;
    localStorage.setItem('wp_user_logged', email);
    closeAuthModal();
    alert("✨ Profile Unlocked!");
    updateDisplay();
}

// Native Payout Cashout Engine Handler
function initiateCashout(platformName) {
    if (!currentUser) {
        alert("⚠️ Log In first!"); return;
    }
    const chosenTierPhp = parseInt(document.getElementById('cashout-tier').value);
    const refCode = document.getElementById('referral-code-input').value.trim();
    const coinsNeeded = Math.ceil(chosenTierPhp * 17.1);

    if (currentBalance < coinsNeeded) {
        alert(`❌ Need ${coinsNeeded} Pawcoins.`); return;
    }
    if (platformName !== 'ONE Wallet' && !refCode) {
        alert("🔑 Enter promotional referral verification code first."); return;
    }
    activeCashoutPlatform = platformName;
    document.getElementById('cashout-modal-title').innerText = "Withdraw via " + platformName;
    document.getElementById('cashout-modal').style.display = 'flex';
}
function closeCashoutModal() { document.getElementById('cashout-modal').style.display = 'none'; }
function submitCashoutForm() {
    const mobileNum = document.getElementById('cashout-phone-input').value.trim();
    const chosenTierPhp = parseInt(document.getElementById('cashout-tier').value);
    currentBalance -= Math.ceil(chosenTierPhp * 17.1);
    saveLocalData();
    closeCashoutModal();
    updateDisplay();
    alert(`🎉 Payout requested to ${mobileNum}!`);
}

// ECONOMICALLY BALANCED VIRTUAL ROULETTE ENGINE
function playLuckySpin() {
    if (dailySpinsUsed >= 5) { alert("🔒 Daily limit reached!"); return; }

    const vBox = document.getElementById('wheel-visual-box');
    const sText = document.getElementById('wheel-status-text');
    const iText = document.getElementById('wheel-display-icon');
    
    sText.innerText = "Spinning roulette...";
    vBox.style.background = "radial-gradient(circle, #dc2626 0%, #7f1d1d 100%)";
    
    // Simulate programmatic rotation frame delay
    setTimeout(() => {
        // Balanced odds math engine: 70% chance (+5), 20% chance (+10), 9% chance (+25), 1% chance (+100)
        let roll = Math.floor(Math.random() * 100);
        let wonPrize = 5;
        
        if (roll >= 70 && roll < 90) wonPrize = 10;
        else if (roll >= 90 && roll < 99) wonPrize = 25;
        else if (roll === 99) wonPrize = 100;
        
        dailySpinsUsed++;
        currentBalance += wonPrize;
        
        // Render results back to the canvas box
        vBox.style.background = "radial-gradient(circle, #059669 0%, #064e3b 100%)";
        iText.innerText = "🎉";
        sText.innerText = `Landed on +${wonPrize} Coins!`;
        
        saveLocalData();
        updateDisplay();
    }, 1200);
}

// ENGAGING MINI GAME ENGINE: HIGHER OR LOWER
function resetCardGame() {
    currentCardValue = Math.floor(Math.random() * 10) + 2; // Card from 2 to 11
    const displayEl = document.getElementById('game-card-display');
    if (displayEl) displayEl.innerText = currentCardValue;
}

function playMiniGame(guess) {
    if (!currentUser) { alert("⚠️ Log In first!"); return; }
    
    alert("🎬 [AdMob Interstitial SDK Call] Opening full-screen video ad break to verify game interaction slot...");
    
    let nextCard = Math.floor(Math.random() * 10) + 2;
    while(nextCard === currentCardValue) {
        nextCard = Math.floor(Math.random() * 10) + 2;
    }
    
    const feedbackEl = document.getElementById('game-feedback-text');
    let isWin = false;
    
    if (guess === 'higher' && nextCard > currentCardValue) isWin = true;
    if (guess === 'lower' && nextCard < currentCardValue) isWin = true;
    
    if (isWin) {
        currentBalance += 8; // Controlled reward points
        feedbackEl.innerHTML = `<span style="color:#059669; font-weight:bold;">✅ Correct! Next card was ${nextCard}. Earned +8 Coins!</span>`;
    } else {
        feedbackEl.innerHTML = `<span style="color:#dc2626; font-weight:bold;">❌ Wrong! Next card was ${nextCard}. Better luck next ad break!</span>`;
    }
    
    currentCardValue = nextCard;
    document.getElementById('game-card-display').innerText = currentCardValue;
    
    saveLocalData();
    updateDisplay();
}

function completeTask(checkbox, rewardCoins) {
    if (checkbox.checked) currentBalance += rewardCoins;
    else currentBalance -= rewardCoins;
    saveLocalData(); updateDisplay();
}
function addExpense() { currentBalance += 2; saveLocalData(); updateDisplay(); }
function triggerRewardedAd(fName) { currentBalance += 20; saveLocalData(); updateDisplay(); }
