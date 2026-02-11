// Security+ Gamification Integration Script
// Include this script in your Practice Tests, Flashcards, and Acronyms pages

(function() {
  'use strict';

  // Initialize gamification data if not exists
  function initGamificationData() {
    if (!localStorage.getItem('securityPlusGameData')) {
      const initialData = {
        xp: 0,
        level: 1,
        testsCompleted: 0,
        questionsAnswered: 0,
        correctAnswers: 0,
        lastVisit: new Date().toISOString(),
        streak: 1,
        achievements: []
      };
      localStorage.setItem('securityPlusGameData', JSON.stringify(initialData));
    }
  }

  // Load current gamification data
  function loadData() {
    const data = localStorage.getItem('securityPlusGameData');
    return data ? JSON.parse(data) : null;
  }

  // Save gamification data
  function saveData(data) {
    localStorage.setItem('securityPlusGameData', JSON.stringify(data));
  }

  // Add XP
  function addXP(amount) {
    const data = loadData();
    if (!data) return;
    
    data.xp += amount;
    
    // Check for level up
    const xpNeeded = 100 + (data.level - 1) * 50;
    if (data.xp >= xpNeeded) {
      data.level++;
      data.xp -= xpNeeded;
      console.log(`Level up! Now level ${data.level}`);
    }
    
    saveData(data);
  }

  // Record question answered
  function answerQuestion(isCorrect) {
    const data = loadData();
    if (!data) return;
    
    data.questionsAnswered++;
    if (isCorrect) {
      data.correctAnswers++;
      addXP(5); // 5 XP per correct answer
    }
    
    saveData(data);
  }

  // Record test completion
  function completeTest(score, totalQuestions, timeInMinutes) {
    const data = loadData();
    if (!data) return;
    
    data.testsCompleted++;
    
    // Base XP for completing test
    addXP(50);
    
    // Bonus XP for high scores
    const percentage = (score / totalQuestions) * 100;
    if (percentage === 100) {
      addXP(100); // Perfect score bonus
      unlockAchievement('perfect_score');
    } else if (percentage >= 90) {
      addXP(50);
    } else if (percentage >= 80) {
      addXP(25);
    }
    
    // Speed bonus
    if (timeInMinutes < 60) {
      addXP(30);
      unlockAchievement('speed_demon');
    }
    
    // Achievement checks
    if (data.testsCompleted === 1) {
      unlockAchievement('first_test');
    }
    if (data.testsCompleted >= 3) {
      unlockAchievement('all_tests');
    }
    
    saveData(data);
  }

  // Unlock achievement
  function unlockAchievement(achievementId) {
    const data = loadData();
    if (!data) return;
    
    const achievements = {
      'first_visit': { name: 'First Steps', xp: 10 },
      'first_test': { name: 'Test Taker', xp: 50 },
      'all_tests': { name: 'Dedicated Student', xp: 200 },
      'perfect_score': { name: 'Perfect Score', xp: 100 },
      'streak_3': { name: 'Consistent', xp: 30 },
      'streak_7': { name: 'Dedicated', xp: 70 },
      'level_5': { name: 'Rising Star', xp: 50 },
      'level_10': { name: 'Expert', xp: 100 },
      'flashcard_master': { name: 'Flashcard Master', xp: 75 },
      'speed_demon': { name: 'Speed Demon', xp: 80 },
      'comeback': { name: 'Comeback', xp: 60 },
      'knowledge_seeker': { name: 'Knowledge Seeker', xp: 20 }
    };
    
    if (!data.achievements) {
      data.achievements = [];
    }
    
    const achievement = achievements[achievementId];
    if (achievement && !data.achievements.includes(achievementId)) {
      data.achievements.push(achievementId);
      addXP(achievement.xp);
      console.log(`Achievement unlocked: ${achievement.name} (+${achievement.xp} XP)`);
    }
    
    saveData(data);
  }

  // Record flashcard mastery
  function masterFlashcard() {
    const data = loadData();
    if (!data) return;
    
    if (!data.flashcardsMastered) {
      data.flashcardsMastered = 0;
    }
    
    data.flashcardsMastered++;
    addXP(3); // 3 XP per flashcard mastered
    
    if (data.flashcardsMastered >= 50) {
      unlockAchievement('flashcard_master');
    }
    
    saveData(data);
  }

  // View acronyms (for achievement)
  function viewAcronyms() {
    unlockAchievement('knowledge_seeker');
  }

  // Initialize on load
  initGamificationData();

  // Export global functions
  window.SecurityPlusGamification = {
    addXP: addXP,
    answerQuestion: answerQuestion,
    completeTest: completeTest,
    unlockAchievement: unlockAchievement,
    masterFlashcard: masterFlashcard,
    viewAcronyms: viewAcronyms,
    getData: loadData
  };

  console.log('Security+ Gamification System Loaded');
})();

/* 
 * INTEGRATION EXAMPLES:
 * 
 * In your Practice Test page, after each question:
 *   SecurityPlusGamification.answerQuestion(true);  // if correct
 *   SecurityPlusGamification.answerQuestion(false); // if incorrect
 * 
 * When a test is completed:
 *   SecurityPlusGamification.completeTest(score, 90, timeInMinutes);
 * 
 * In your Flashcards page, when a card is mastered:
 *   SecurityPlusGamification.masterFlashcard();
 * 
 * In your Acronyms page, on page load:
 *   SecurityPlusGamification.viewAcronyms();
 * 
 * To manually add XP (for any special actions):
 *   SecurityPlusGamification.addXP(10);
 * 
 * To manually unlock an achievement:
 *   SecurityPlusGamification.unlockAchievement('achievement_id');
 */