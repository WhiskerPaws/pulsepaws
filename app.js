// Initialize App State
let currentBalance = 0;
let currentCardValue = 5;

// Load initial data on startup
window.onload = function() {
    loadLocalData();
    updateDisplay();
};

function loadLocalData() {
    const savedBalance = localStorage.getItem('paw_balance');
    if (savedBalance) {
        currentBalance = parseInt(savedBalance, 10);
    }
}

function saveLocalData() {
    localStorage.setItem('paw_balance', currentBalance);
}

function updateDisplay() {
    const balanceEl = document.getElementById('balance-display');
    if (balanceEl) {
        balanceEl.innerText = currentBalance;
    }
}

// Mini Game Logic (Higher or Lower)
function playMiniGame(guess) {
    const feedbackEl = document.getElementById('game-feedback-text');
    let isWin = false;
    
    // Generate a random next card value between 1 and 10
    const nextCard = Math.floor(Math.random() * 10) + 1;

    if (guess === 'higher' && nextCard > currentCardValue) isWin = true;
    if (guess === 'lower' && nextCard < currentCardValue) isWin = true;

    if (isWin) {
        currentBalance += 8; // Controlled reward points
        if (feedbackEl) {
            feedbackEl.innerHTML = `<span style="color:#059669; font-weight:bold;">✅ Correct! Next card was ${nextCard}. Earned +8 Coins!</span>`;
        }
    } else {
        if (feedbackEl) {
            feedbackEl.innerHTML = `<span style="color:#dc2626; font-weight:bold;">❌ Wrong! Next card was ${nextCard}. Better luck next ad break!</span>`;
        }
    }

    currentCardValue = nextCard;
    const cardDisplayEl = document.getElementById('game-card-display');
    if (cardDisplayEl) {
        cardDisplayEl.innerText = currentCardValue;
    }

    saveLocalData();
    updateDisplay();
}

// Utility Tasks and Ad Triggers
function completeTask(checkbox, rewardCoins) {
    if (checkbox && checkbox.checked) {
        currentBalance += rewardCoins;
    } else {
        currentBalance += rewardCoins; 
    }
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
