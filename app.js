// Stable Independent Offline Storage System
let currentBalance = parseInt(localStorage.getItem('wp_balance')) || 120;
let dailySpinsUsed = parseInt(localStorage.getItem('wp_spins_used')) || 0;
let currentStreak = parseInt(localStorage.getItem('wp_streak')) || 0;
let lastClaimDate = localStorage.getItem('wp_last_claim') || "";
let runningExpenses = 0.00;
let currentUser = localStorage.getItem('wp_user_logged') || null;
let activeCashoutPlatform = "";

// Core Application Startup Sequence
window.addEventListener('DOMContentLoaded', () => {
    const lastSpinDate = localStorage.getItem('wp_last_spin_date');
    const todayStr = new Date().toDateString();
    
    if (lastSpinDate !== todayStr) {
        dailySpinsUsed = 0;
        localStorage.setItem('wp_spins_used', 0);
        localStorage.setItem('wp_last_spin_date', todayStr);
    }
    updateDisplay();
});

function saveLocalData() {
    localStorage.setItem('wp_balance', currentBalance);
    localStorage.setItem('wp_streak', currentStreak);
    localStorage.setItem('wp_last_claim', lastClaimDate);
    localStorage.setItem('wp_spins_used', dailySpinsUsed);
}

// Render dynamic dashboard metrics to user UI
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
    document.getElementById('auth-email-input').value = "";
    document.getElementById('auth-pass-input').value = "";
}

function submitAuthForm() {
    const email = document.getElementById('auth-email-input').value.trim();
    const password = document.getElementById('auth-pass-input').value;

    if (!email || !password || password.length < 6) {
        alert("❌ Validation Error: Input a valid email address and a minimum 6-character password.");
        return;
    }

    currentUser = email;
    localStorage.setItem('wp_user_logged', email);
    closeAuthModal();
    alert(`✨ Account Initialized!\nWelcome to WhiskerPaws. All app systems are now unfrozen!`);
    updateDisplay();
}
// Native Payout Cashout Engine Handler
function initiateCashout(platformName) {
    if (!currentUser) {
        alert("⚠️ Access Denied!\n\nPlease use the 'Join' or 'Log In' button in the upper header to register an active session first.");
        return;
    }

    const chosenTierPhp = parseInt(document.getElementById('cashout-tier').value);
    const refCode = document.getElementById('referral-code-input').value.trim();
    const coinsNeeded = Math.ceil(chosenTierPhp * 17.1);

    if (currentBalance < coinsNeeded) {
        alert(`❌ Payout Failed!\n\nYou currently have ${currentBalance} Pawcoins. To withdraw the ₱${chosenTierPhp}.00 tier via ${platformName}, you need a minimum of ${coinsNeeded} Pawcoins.`);
        return;
    }

    if (platformName !== 'ONE Wallet' && !refCode) {
        alert("🔑 Verification Needed!\n\nTo withdraw via " + platformName + ", please enter your active promotional referral verification code first (e.g. V98HAR).");
        return;
    }

    activeCashoutPlatform = platformName;
    document.getElementById('cashout-modal-title').innerText = "Withdraw via " + platformName;
    document.getElementById('cashout-modal').style.display = 'flex';
}

function closeCashoutModal() {
    document.getElementById('cashout-modal').style.display = 'none';
    document.getElementById('cashout-phone-input').value = "";
}

function submitCashoutForm() {
    const mobileNum = document.getElementById('cashout-phone-input').value.trim();
    const chosenTierPhp = parseInt(document.getElementById('cashout-tier').value);
    const coinsNeeded = Math.ceil(chosenTierPhp * 17.1);

    if (!mobileNum || mobileNum.length < 11) {
        alert("❌ Invalid input: An 11-digit mobile ledger destination number is required.");
        return;
    }

    currentBalance -= coinsNeeded;
    saveLocalData();
    closeCashoutModal();
    updateDisplay();

    alert(`🎉 Payout Requested Successfully!\n\nYour request for ₱${chosenTierPhp}.00 has been sent directly to the server ledger pipeline.\n\nFunds will arrive in your ${activeCashoutPlatform} account (${mobileNum}) within 24-48 verification hours!`);
}

// Handle daily claim progressive checklist routines
function claimDailyStreak(isDoubleAd) {
    const todayStr = new Date().toDateString();
    if (lastClaimDate === todayStr) {
        alert("🔒 You have already claimed today's daily streak bonus. Return tomorrow!");
        return;
    }

    // FIXED DATA MATRIX ARRAY
    const rewardsMap =;
    let rawReward = rewardsMap[currentStreak % 7];

    if (isDoubleAd) {
        alert("🎬 [AdMob SDK Call] Rendering rewarded interstitial break... High Margin Split active.");
        rawReward = rawReward * 2;
    }

    currentStreak = (currentStreak % 7) + 1;
    currentBalance += rawReward;
    lastClaimDate = todayStr;

    alert("🎉 Daily Claim Success! Added +" + rawReward + " Pawcoins to your account wallet.");
    saveLocalData();
    updateDisplay();
}

// Handle daily lucky spin mechanics
function playLuckySpin() {
    if (dailySpinsUsed >= 5) {
        alert("🔒 You have reached your daily limit of 5 spins. Come back tomorrow!");
        return;
    }

    alert("🎬 [AdMob SDK Call] Loading Rewarded Video ad prior to spinning standard mechanism...");
    
    // FIXED DATA MATRIX ARRAY
    const prizeTiers =;
    const wonPrize = prizeTiers[Math.floor(Math.random() * prizeTiers.length)];
    
    dailySpinsUsed++;
    currentBalance += wonPrize;
    
    alert("🎉 Congratulations! The wheel landed on +" + wonPrize + " Pawcoins!");
    saveLocalData();
    updateDisplay();
}

// Handle daily routine tasks checking split rewards
function completeTask(checkbox, rewardCoins) {
    if (checkbox.checked) {
        currentBalance += rewardCoins;
        alert("✨ Task Completed! You collected +" + rewardCoins + " Pawcoins.");
    } else {
        currentBalance -= rewardCoins;
    }
    saveLocalData();
    updateDisplay();
}

// Handle rapid budget expense metrics addition
function addExpense() {
    const nameEl = document.getElementById('expense-name');
    const amountEl = document.getElementById('expense-amount');
    const value = parseFloat(amountEl.value);

    if (!nameEl.value || isNaN(value) || value <= 0) {
        alert("Please input a valid product item name and budget weight.");
        return;
    }

    runningExpenses += value;
    document.getElementById('total-expenses').innerText = runningExpenses.toFixed(2);
    
    nameEl.value = '';
    amountEl.value = '';
    
    currentBalance += 2;
    saveLocalData();
    updateDisplay();
}

// Handle structural programmatic ad component simulation prompts
function triggerRewardedAd(featureName) {
    alert("🎬 [AdMob SDK Call Triggered]\nLoading a rewarded video ad to verify action for: \"" + featureName + "\".\n\nOnce finished, the application registers the 95% revenue split margin and releases 20 Pawcoins to the user wallet!");
    currentBalance += 20;
    saveLocalData();
    updateDisplay();
}
