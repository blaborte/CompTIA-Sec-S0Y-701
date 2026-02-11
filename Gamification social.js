// Security+ Gamification System with Social Features
// Enhanced version with leaderboard, challenges, and social sharing

(function() {
  'use strict';

  // Average user stats for comparison
  const AVERAGE_STATS = {
    xpPerTest: 150,
    testsCompleted: 1.5,
    questionsAnswered: 135,
    accuracyRate: 72
  };

  // Gamification System Class
  class GamificationSystem {
    constructor() {
      this.achievements = [
        { id: 'first_visit', name: 'First Steps', desc: 'Visit the study portal', icon: '🎯', xp: 10, unlocked: false },
        { id: 'first_test', name: 'Test Taker', desc: 'Complete your first practice test', icon: '📝', xp: 50, unlocked: false },
        { id: 'all_tests', name: 'Dedicated Student', desc: 'Complete all 3 practice tests', icon: '🎓', xp: 200, unlocked: false },
        { id: 'perfect_score', name: 'Perfect Score', desc: 'Score 100% on any test', icon: '💯', xp: 100, unlocked: false },
        { id: 'streak_3', name: 'Consistent', desc: 'Study 3 days in a row', icon: '🔥', xp: 30, unlocked: false },
        { id: 'streak_7', name: 'Dedicated', desc: 'Study 7 days in a row', icon: '⚡', xp: 70, unlocked: false },
        { id: 'level_5', name: 'Rising Star', desc: 'Reach level 5', icon: '⭐', xp: 50, unlocked: false },
        { id: 'level_10', name: 'Expert', desc: 'Reach level 10', icon: '🌟', xp: 100, unlocked: false },
        { id: 'flashcard_master', name: 'Flashcard Master', desc: 'Master 50 flashcards', icon: '🎴', xp: 75, unlocked: false },
        { id: 'speed_demon', name: 'Speed Demon', desc: 'Complete a test in under 60 minutes', icon: '⚡', xp: 80, unlocked: false },
        { id: 'comeback', name: 'Comeback', desc: 'Improve your score by 20% or more', icon: '📈', xp: 60, unlocked: false },
        { id: 'knowledge_seeker', name: 'Knowledge Seeker', desc: 'View the acronyms reference', icon: '📚', xp: 20, unlocked: false }
      ];

      this.challenges = [
        { id: 'weekly_warrior', name: 'Weekly Warrior', desc: 'Complete 2 tests this week', icon: '⚔️', reward: 100, progress: 0, target: 2 },
        { id: 'perfect_week', name: 'Perfect Week', desc: 'Study 7 days in a row', icon: '💎', reward: 150, progress: 0, target: 7 },
        { id: 'accuracy_ace', name: 'Accuracy Ace', desc: 'Score above 90% on 3 tests', icon: '🎯', reward: 200, progress: 0, target: 3 },
        { id: 'speed_runner', name: 'Speed Runner', desc: 'Complete 3 tests under 70 minutes', icon: '⏱️', reward: 150, progress: 0, target: 3 }
      ];

      this.loadData();
      this.checkDailyStreak();
      this.initTabs();
      this.setupEventListeners();
      this.updateUI();
      this.renderAchievements();
      this.renderLeaderboard();
      this.renderChallenges();
      this.updateSharePreview();
      this.checkUsername();
      
      // Unlock first visit achievement
      this.unlockAchievement('first_visit');
    }

    loadData() {
      const saved = localStorage.getItem('securityPlusGameData');
      if (saved) {
        const data = JSON.parse(saved);
        this.username = data.username || '';
        this.xp = data.xp || 0;
        this.level = data.level || 1;
        this.testsCompleted = data.testsCompleted || 0;
        this.questionsAnswered = data.questionsAnswered || 0;
        this.correctAnswers = data.correctAnswers || 0;
        this.lastVisit = data.lastVisit || null;
        this.streak = data.streak || 0;
        this.achievements = data.achievements || this.achievements;
        this.challenges = data.challenges || this.challenges;
        this.testScores = data.testScores || [];
      } else {
        this.username = '';
        this.xp = 0;
        this.level = 1;
        this.testsCompleted = 0;
        this.questionsAnswered = 0;
        this.correctAnswers = 0;
        this.lastVisit = null;
        this.streak = 0;
        this.testScores = [];
      }
    }

    saveData() {
      const data = {
        username: this.username,
        xp: this.xp,
        level: this.level,
        testsCompleted: this.testsCompleted,
        questionsAnswered: this.questionsAnswered,
        correctAnswers: this.correctAnswers,
        lastVisit: this.lastVisit,
        streak: this.streak,
        achievements: this.achievements,
        challenges: this.challenges,
        testScores: this.testScores
      };
      localStorage.setItem('securityPlusGameData', JSON.stringify(data));
      
      // Update leaderboard
      this.updateLeaderboard();
    }

    checkUsername() {
      if (!this.username) {
        document.getElementById('usernameModal').classList.add('show');
      }
    }

    setUsername(username) {
      this.username = username;
      this.saveData();
      this.renderLeaderboard();
    }

    checkDailyStreak() {
      const today = new Date().toDateString();
      if (this.lastVisit) {
        const lastVisitDate = new Date(this.lastVisit).toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        
        if (lastVisitDate === today) {
          return;
        } else if (lastVisitDate === yesterday) {
          this.streak++;
          this.addXP(10);
        } else {
          this.streak = 1;
        }
      } else {
        this.streak = 1;
      }
      
      this.lastVisit = new Date().toISOString();
      
      // Update challenge progress
      const perfectWeekChallenge = this.challenges.find(c => c.id === 'perfect_week');
      if (perfectWeekChallenge) {
        perfectWeekChallenge.progress = this.streak;
        if (perfectWeekChallenge.progress >= perfectWeekChallenge.target) {
          this.completeChallenge('perfect_week');
        }
      }
      
      this.saveData();
      
      // Check streak achievements
      if (this.streak >= 3) this.unlockAchievement('streak_3');
      if (this.streak >= 7) this.unlockAchievement('streak_7');
    }

    addXP(amount) {
      this.xp += amount;
      this.checkLevelUp();
      this.saveData();
      this.updateUI();
    }

    checkLevelUp() {
      const xpNeeded = this.getXPNeeded();
      if (this.xp >= xpNeeded) {
        this.level++;
        this.xp -= xpNeeded;
        this.showNotification('🎉', 'Level Up!', `You've reached level ${this.level}!`);
        
        if (this.level >= 5) this.unlockAchievement('level_5');
        if (this.level >= 10) this.unlockAchievement('level_10');
      }
    }

    getXPNeeded() {
      return 100 + (this.level - 1) * 50;
    }

    unlockAchievement(achievementId) {
      const achievement = this.achievements.find(a => a.id === achievementId);
      if (achievement && !achievement.unlocked) {
        achievement.unlocked = true;
        this.addXP(achievement.xp);
        this.showNotification(achievement.icon, achievement.name, achievement.desc);
        this.renderAchievements();
        this.saveData();
      }
    }

    completeChallenge(challengeId) {
      const challenge = this.challenges.find(c => c.id === challengeId);
      if (challenge && challenge.progress >= challenge.target) {
        this.addXP(challenge.reward);
        this.showNotification(challenge.icon, `Challenge Complete: ${challenge.name}`, `You earned ${challenge.reward} XP!`);
        // Reset challenge
        challenge.progress = 0;
        this.saveData();
      }
    }

    showNotification(icon, name, desc) {
      const notif = document.getElementById('achievementNotification');
      document.getElementById('notifIcon').textContent = icon;
      document.getElementById('notifName').textContent = name;
      document.getElementById('notifDesc').textContent = desc;
      
      notif.classList.add('show');
      setTimeout(() => {
        notif.classList.remove('show');
      }, 4000);
    }

    updateUI() {
      // Level and XP
      document.getElementById('levelText').textContent = `Level ${this.level}`;
      document.getElementById('xpCurrent').textContent = this.xp;
      const xpNeeded = this.getXPNeeded();
      document.getElementById('xpNeeded').textContent = xpNeeded;
      const xpPercent = (this.xp / xpNeeded) * 100;
      document.getElementById('xpFill').style.width = `${xpPercent}%`;

      // Streak
      document.getElementById('streakCount').textContent = this.streak;

      // Dashboard stats
      const totalXP = this.xp + (this.level - 1) * 100;
      document.getElementById('totalXP').textContent = totalXP;
      document.getElementById('testsCompleted').textContent = this.testsCompleted;
      document.getElementById('questionsAnswered').textContent = this.questionsAnswered;
      
      const accuracy = this.questionsAnswered > 0 
        ? Math.round((this.correctAnswers / this.questionsAnswered) * 100) 
        : 0;
      document.getElementById('accuracyRate').textContent = `${accuracy}%`;

      // Progress indicators
      document.getElementById('practiceProgress').textContent = `${this.testsCompleted}/3 completed`;

      // Comparison to average
      this.updateComparison(totalXP, this.testsCompleted, this.questionsAnswered, accuracy);
    }

    updateComparison(totalXP, testsCompleted, questionsAnswered, accuracy) {
      // XP comparison
      const avgXP = AVERAGE_STATS.xpPerTest * AVERAGE_STATS.testsCompleted;
      const xpCompare = document.getElementById('xpCompare');
      if (totalXP > avgXP) {
        xpCompare.className = 'vs-average better';
        xpCompare.textContent = `+${Math.round(((totalXP - avgXP) / avgXP) * 100)}%`;
      } else if (totalXP < avgXP) {
        xpCompare.className = 'vs-average worse';
        xpCompare.textContent = `${Math.round(((totalXP - avgXP) / avgXP) * 100)}%`;
      } else {
        xpCompare.textContent = '';
      }

      // Tests comparison
      const testsCompare = document.getElementById('testsCompare');
      if (testsCompleted > AVERAGE_STATS.testsCompleted) {
        testsCompare.className = 'vs-average better';
        testsCompare.textContent = 'Above avg';
      } else if (testsCompleted < AVERAGE_STATS.testsCompleted) {
        testsCompare.className = 'vs-average worse';
        testsCompare.textContent = 'Below avg';
      } else {
        testsCompare.textContent = '';
      }

      // Questions comparison
      const questionsCompare = document.getElementById('questionsCompare');
      if (questionsAnswered > AVERAGE_STATS.questionsAnswered) {
        questionsCompare.className = 'vs-average better';
        questionsCompare.textContent = 'Above avg';
      } else if (questionsAnswered < AVERAGE_STATS.questionsAnswered) {
        questionsCompare.className = 'vs-average worse';
        questionsCompare.textContent = 'Below avg';
      } else {
        questionsCompare.textContent = '';
      }

      // Accuracy comparison
      const accuracyCompare = document.getElementById('accuracyCompare');
      if (accuracy > AVERAGE_STATS.accuracyRate) {
        accuracyCompare.className = 'vs-average better';
        accuracyCompare.textContent = `+${accuracy - AVERAGE_STATS.accuracyRate}%`;
      } else if (accuracy < AVERAGE_STATS.accuracyRate) {
        accuracyCompare.className = 'vs-average worse';
        accuracyCompare.textContent = `${accuracy - AVERAGE_STATS.accuracyRate}%`;
      } else {
        accuracyCompare.textContent = '';
      }
    }

    renderAchievements() {
      const grid = document.getElementById('achievementsGrid');
      grid.innerHTML = '';
      
      const unlockedCount = this.achievements.filter(a => a.unlocked).length;
      document.getElementById('unlockedCount').textContent = unlockedCount;
      document.getElementById('totalCount').textContent = this.achievements.length;

      this.achievements.forEach(achievement => {
        const div = document.createElement('div');
        div.className = `achievement-badge ${achievement.unlocked ? 'unlocked' : 'locked'}`;
        div.innerHTML = `
          <div class="achievement-icon">${achievement.icon}</div>
          <div class="achievement-name">${achievement.name}</div>
          <div class="achievement-desc">${achievement.desc}</div>
        `;
        grid.appendChild(div);
      });
    }

    renderChallenges() {
      const grid = document.getElementById('challengesGrid');
      grid.innerHTML = '';

      this.challenges.forEach(challenge => {
        const progressPercent = (challenge.progress / challenge.target) * 100;
        const isComplete = challenge.progress >= challenge.target;
        
        const div = document.createElement('div');
        div.className = `challenge-card ${isComplete ? 'active' : ''}`;
        div.innerHTML = `
          <div class="challenge-icon">${challenge.icon}</div>
          <div class="challenge-name">${challenge.name}</div>
          <div class="challenge-detail">${challenge.desc}</div>
          <div class="challenge-progress">
            <div style="font-size: 0.75rem; color: var(--muted); font-family: var(--mono);">
              ${challenge.progress} / ${challenge.target}
            </div>
            <div class="challenge-progress-bar">
              <div class="challenge-progress-fill" style="width: ${progressPercent}%"></div>
            </div>
          </div>
          <div class="challenge-reward">🎁 ${challenge.reward} XP</div>
        `;
        grid.appendChild(div);
      });
    }

    updateLeaderboard() {
      // Get or initialize global leaderboard
      let leaderboard = JSON.parse(localStorage.getItem('securityPlusLeaderboard') || '[]');
      
      // Remove old entry for this user if exists
      leaderboard = leaderboard.filter(entry => entry.username !== this.username);
      
      // Add current user
      if (this.username) {
        const totalXP = this.xp + (this.level - 1) * 100;
        const accuracy = this.questionsAnswered > 0 
          ? Math.round((this.correctAnswers / this.questionsAnswered) * 100) 
          : 0;

        leaderboard.push({
          username: this.username,
          level: this.level,
          totalXP: totalXP,
          accuracy: accuracy,
          streak: this.streak,
          testsCompleted: this.testsCompleted,
          timestamp: Date.now()
        });

        // Keep only last 100 entries
        if (leaderboard.length > 100) {
          leaderboard.sort((a, b) => b.totalXP - a.totalXP);
          leaderboard = leaderboard.slice(0, 100);
        }

        localStorage.setItem('securityPlusLeaderboard', JSON.stringify(leaderboard));
      }
    }

    renderLeaderboard(sortBy = 'xp') {
      let leaderboard = JSON.parse(localStorage.getItem('securityPlusLeaderboard') || '[]');
      
      // Add some sample data if leaderboard is empty or has few entries
      if (leaderboard.length < 10) {
        const sampleUsers = [
          { username: 'CyberNinja', level: 12, totalXP: 850, accuracy: 88, streak: 15, testsCompleted: 3 },
          { username: 'SecPro2024', level: 10, totalXP: 720, accuracy: 92, streak: 10, testsCompleted: 3 },
          { username: 'InfoSecAce', level: 9, totalXP: 650, accuracy: 85, streak: 8, testsCompleted: 3 },
          { username: 'NetDefender', level: 8, totalXP: 580, accuracy: 90, streak: 12, testsCompleted: 2 },
          { username: 'ThreatHunter', level: 7, totalXP: 490, accuracy: 86, streak: 6, testsCompleted: 2 },
          { username: 'PenTester99', level: 6, totalXP: 420, accuracy: 89, streak: 9, testsCompleted: 2 },
          { username: 'CompTIAPro', level: 6, totalXP: 380, accuracy: 83, streak: 5, testsCompleted: 2 },
          { username: 'SecurityBuff', level: 5, totalXP: 310, accuracy: 91, streak: 14, testsCompleted: 1 },
          { username: 'CertHunter', level: 4, totalXP: 250, accuracy: 79, streak: 4, testsCompleted: 1 },
          { username: 'StudyMode', level: 3, totalXP: 180, accuracy: 87, streak: 3, testsCompleted: 1 }
        ];
        
        // Merge with existing leaderboard
        sampleUsers.forEach(sample => {
          if (!leaderboard.find(e => e.username === sample.username)) {
            leaderboard.push(sample);
          }
        });
      }

      // Sort based on filter
      switch(sortBy) {
        case 'accuracy':
          leaderboard.sort((a, b) => b.accuracy - a.accuracy);
          break;
        case 'streak':
          leaderboard.sort((a, b) => b.streak - a.streak);
          break;
        default:
          leaderboard.sort((a, b) => b.totalXP - a.totalXP);
      }

      const list = document.getElementById('leaderboardList');
      list.innerHTML = '';

      leaderboard.slice(0, 20).forEach((entry, index) => {
        const isCurrentUser = entry.username === this.username;
        const rank = index + 1;
        let rankClass = '';
        if (rank === 1) rankClass = 'top-1';
        else if (rank === 2) rankClass = 'top-2';
        else if (rank === 3) rankClass = 'top-3';

        const avatars = ['👤', '🦸', '🥷', '🧙', '👨‍💻', '👩‍💻', '🎓', '💼', '🎯', '🏆'];
        const avatar = avatars[entry.username.length % avatars.length];

        const div = document.createElement('div');
        div.className = `leaderboard-entry ${isCurrentUser ? 'you' : ''}`;
        div.innerHTML = `
          <div class="leaderboard-rank ${rankClass}">#${rank}</div>
          <div class="leaderboard-avatar">${avatar}</div>
          <div class="leaderboard-info">
            <div class="leaderboard-name">${entry.username} ${isCurrentUser ? '(You)' : ''}</div>
            <div class="leaderboard-stats">
              Level ${entry.level} • ${entry.accuracy}% accuracy • ${entry.streak}🔥
            </div>
          </div>
          <div class="leaderboard-score">${entry.totalXP}</div>
        `;
        list.appendChild(div);
      });
    }

    updateSharePreview() {
      const totalXP = this.xp + (this.level - 1) * 100;
      const accuracy = this.questionsAnswered > 0 
        ? Math.round((this.correctAnswers / this.questionsAnswered) * 100) 
        : 0;

      document.getElementById('shareLevel').textContent = this.level;
      document.getElementById('shareXP').textContent = totalXP;
      document.getElementById('shareTests').textContent = `${this.testsCompleted}/3`;
      document.getElementById('shareAccuracy').textContent = `${accuracy}%`;
    }

    generateShareText() {
      const totalXP = this.xp + (this.level - 1) * 100;
      const accuracy = this.questionsAnswered > 0 
        ? Math.round((this.correctAnswers / this.questionsAnswered) * 100) 
        : 0;

      return `🎓 My Security+ SY0-701 Progress\n\n` +
             `⭐ Level ${this.level}\n` +
             `📊 ${totalXP} Total XP\n` +
             `✅ ${this.testsCompleted}/3 Tests Completed\n` +
             `🎯 ${accuracy}% Accuracy\n` +
             `🔥 ${this.streak} Day Streak\n\n` +
             `Preparing for CompTIA Security+ certification!`;
    }

    initTabs() {
      const tabs = document.querySelectorAll('.nav-tab');
      const contents = document.querySelectorAll('.tab-content');

      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const targetTab = tab.dataset.tab;
          
          // Update active tab
          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          
          // Update active content
          contents.forEach(c => c.classList.remove('active'));
          document.getElementById(`${targetTab}-tab`).classList.add('active');
        });
      });
    }

    setupEventListeners() {
      // Username modal
      document.getElementById('saveUsername').addEventListener('click', () => {
        const username = document.getElementById('usernameInput').value.trim();
        if (username) {
          this.setUsername(username);
          document.getElementById('usernameModal').classList.remove('show');
        }
      });

      document.getElementById('skipUsername').addEventListener('click', () => {
        this.setUsername(`Guest${Math.floor(Math.random() * 9999)}`);
        document.getElementById('usernameModal').classList.remove('show');
      });

      // Leaderboard filters
      const filterBtns = document.querySelectorAll('.filter-btn');
      filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          filterBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.renderLeaderboard(btn.dataset.filter);
        });
      });

      // Share buttons
      document.getElementById('shareTwitter').addEventListener('click', () => {
        const text = this.generateShareText();
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
      });

      document.getElementById('shareLinkedIn').addEventListener('click', () => {
        const text = this.generateShareText();
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
      });

      document.getElementById('shareCopy').addEventListener('click', () => {
        const text = this.generateShareText();
        navigator.clipboard.writeText(text).then(() => {
          this.showNotification('📋', 'Copied!', 'Stats copied to clipboard');
        });
      });

      document.getElementById('shareImage').addEventListener('click', () => {
        // Generate image (simplified version - shows alert)
        this.showNotification('📸', 'Feature Coming Soon', 'Image download will be available soon!');
      });
    }
  }

  // Initialize gamification system
  const gamification = new GamificationSystem();

  // Expose functions for other pages to use
  window.securityPlusGamification = {
    addXP: (amount) => gamification.addXP(amount),
    unlockAchievement: (id) => gamification.unlockAchievement(id),
    completeTest: (score, totalQuestions, timeInMinutes) => {
      gamification.testsCompleted++;
      gamification.testScores.push(score);
      gamification.addXP(50);
      gamification.unlockAchievement('first_test');
      
      // Check for perfect score
      if (score === totalQuestions) {
        gamification.unlockAchievement('perfect_score');
      }
      
      // Check speed demon
      if (timeInMinutes < 60) {
        gamification.unlockAchievement('speed_demon');
      }
      
      // Update challenges
      const weeklyWarrior = gamification.challenges.find(c => c.id === 'weekly_warrior');
      if (weeklyWarrior) {
        weeklyWarrior.progress++;
        if (weeklyWarrior.progress >= weeklyWarrior.target) {
          gamification.completeChallenge('weekly_warrior');
        }
      }
      
      const accuracy = (score / totalQuestions) * 100;
      if (accuracy >= 90) {
        const accuracyAce = gamification.challenges.find(c => c.id === 'accuracy_ace');
        if (accuracyAce) {
          accuracyAce.progress++;
          if (accuracyAce.progress >= accuracyAce.target) {
            gamification.completeChallenge('accuracy_ace');
          }
        }
      }
      
      if (timeInMinutes < 70) {
        const speedRunner = gamification.challenges.find(c => c.id === 'speed_runner');
        if (speedRunner) {
          speedRunner.progress++;
          if (speedRunner.progress >= speedRunner.target) {
            gamification.completeChallenge('speed_runner');
          }
        }
      }
      
      if (gamification.testsCompleted >= 3) {
        gamification.unlockAchievement('all_tests');
      }
      
      gamification.saveData();
      gamification.updateUI();
      gamification.renderChallenges();
    },
    answerQuestion: (correct) => {
      gamification.questionsAnswered++;
      if (correct) {
        gamification.correctAnswers++;
        gamification.addXP(5);
      }
      gamification.saveData();
      gamification.updateUI();
    }
  };
})();