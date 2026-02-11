# 🔐 Security+ SY0-701 Study Portal

A comprehensive, interactive web-based study platform for the **CompTIA Security+ SY0-701** certification exam. Built with vanilla HTML, CSS, and JavaScript — no frameworks, no installation required.

---

## 📁 File Structure

```
├── index.html                  # Main homepage & navigation hub
├── Practice-tests.html         # Practice test selection menu
│
├── PracticeTestA.html          # Professor Messer Practice Test A
├── PracticeTestB.html          # Professor Messer Practice Test B
├── PracticeTestC.html          # Professor Messer Practice Test C
│
├── ExamCompass-Test1.html      # ExamCompass Quiz 1 – Security Controls & AAA
├── ExamCompass-Test2.html      # ExamCompass Quiz 2 – Zero Trust, PKI & Encryption
│
├── Flashcards.html             # Interactive flashcard study tool
├── Acronyms.html               # Security+ acronyms & terms reference
│
├── cyber-simulations.html      # Interactive cybersecurity scenario simulations
├── cyber-simulations.js        # Simulation scenario logic & question data
│
├── enhanced-practice-test.html # Enhanced test interface (bookmarks, notes, modes)
├── enhanced-practice-test.js   # Enhanced test logic & filtering engine
│
├── gamification-social.js      # Full gamification system (XP, levels, achievements)
├── Gamification.js             # Backup/alternate gamification file
│
└── disclaimer.html             # Legal disclaimer & content attribution
```

---

## 🚀 Getting Started

No installation or build process needed. Simply open `index.html` in any modern browser, or host all files on any static web host (GitHub Pages, Netlify, etc.).

**All files must be in the same directory** for internal links and scripts to work correctly.

---

## 📚 Features Overview

### 🏠 Homepage (`index.html`)
The central hub for the entire portal. Features:
- **Gamification Dashboard** — displays XP, level, rank, streak, and accuracy stats
- **5-tab navigation** — Overview, Leaderboard, Challenges, Share, Achievements
- **Quick access cards** — links to all study tools
- **Username setup** — personalizes the leaderboard experience
- Requires `gamification-social.js` to be in the same folder

---

### 📝 Practice Tests

#### Professor Messer Tests (`PracticeTestA/B/C.html`)
Full-length practice exams modeled after the real Security+ SY0-701 exam format.
- 90 questions per test
- 90-minute countdown timer with pause/resume
- Multiple choice and multi-select question types
- Question navigation sidebar with color-coded status dots
- Detailed explanations for every question
- Results screen with correct/incorrect breakdown
- Integrated with gamification (awards XP on completion)

#### ExamCompass Tests (`ExamCompass-Test1/2.html`)
Focused 25-question quizzes sourced from ExamCompass.com.

| File | Topics Covered |
|------|---------------|
| `ExamCompass-Test1.html` | Security control types, CIA Triad, AAA framework, TACACS+, RADIUS |
| `ExamCompass-Test2.html` | Zero Trust, PKI, encryption, honeypots, BIA, secure protocols |

Both tests share the same interface as the Professor Messer tests (timer, sidebar, explanations, gamification).

#### Practice Test Selection Page (`Practice-tests.html`)
Landing page listing all 5 available tests with descriptions. Links to all test files.

---

### 🃏 Flashcards (`Flashcards.html`)
Interactive flip-card study tool covering all Security+ domains.
- Click to flip between term and definition
- Navigate forward and backward through the deck
- Progress tracking (cards mastered)
- Integrated with gamification

---

### 📖 Acronyms & Terms (`Acronyms.html`)
A searchable reference guide of Security+ acronyms and key terminology.
- Alphabetically organized
- Fast search/filter
- Covers all domains of SY0-701

---

### 🎮 Cyber Simulations (`cyber-simulations.html` + `cyber-simulations.js`)
Six realistic, scenario-based cybersecurity simulations with multi-step decision trees.

| Scenario | Difficulty | Topics |
|----------|------------|--------|
| Phishing Email Detection | Easy | Email analysis, WHOIS, domain spoofing |
| Ransomware Incident Response | Medium | IR lifecycle, containment, C&C blocking |
| Malware Investigation | Medium | netstat, process analysis, remediation |
| Network Intrusion Detection | Hard | SYN floods, tcpdump, port scanning |
| Social Engineering Attack | Medium | Pretexting, credential requests |
| Security Compliance Audit | Hard | PCI DSS, risk prioritization |

Each simulation features:
- Realistic terminal windows, email clients, and log outputs
- Multi-step scenarios that build on each other
- 4 answer choices per question with detailed explanations
- Color-coded feedback (green = correct, red = incorrect)
- 10 XP per correct answer, 50 XP for completing a simulation

---

### ⚡ Enhanced Practice Test (`enhanced-practice-test.html` + `enhanced-practice-test.js`)
An advanced test interface with additional study features on top of the standard tests.

**6 Study Modes:**
| Mode | Description |
|------|-------------|
| Exam Mode | 90-min timer, no hints, realistic simulation |
| Study Mode | Untimed with immediate feedback and explanations |
| Review Mode | All answers visible for reading/review |
| Weak Areas | Only shows previously missed questions |
| Bookmarked | Shows questions you've saved with the 📌 button |
| Custom Filter | Filter by domain and difficulty, with randomize option |

**Additional Features:**
- Bookmark individual questions (persists across sessions)
- Personal notes per question (auto-saves)
- Visual question grid (color-coded by status)
- Real-time stats sidebar

---

### 🏆 Gamification System (`gamification-social.js`)
A full XP and progression system that runs across all pages.

**XP & Levels:**
| Level | Title | XP Required |
|-------|-------|-------------|
| 1 | Security Novice | 0 |
| 2 | Cyber Cadet | 100 |
| 3 | Network Defender | 300 |
| 4 | Threat Analyst | 600 |
| 5 | Security+ Certified | 1000 |
| 6+ | Elite Defender + | 1500+ |

**How XP is Earned:**
- Completing a practice test → XP based on score
- Correct answer in simulation → 10 XP
- Completing a simulation → 50 XP
- Daily login streak → bonus XP
- Completing challenges → bonus XP

**Features:**
- 12 unlockable achievements (First Login, Perfect Score, 7-Day Streak, etc.)
- 4 rotating weekly challenges
- Leaderboard with top XP, accuracy, and streak filters
- All data stored in `localStorage` — no backend required

**Data Storage Key:** `securityPlusGameData`

**Test gamification in browser console:**
```javascript
window.securityPlusGamification.addXP(50)
```

---

### ⚖️ Disclaimer (`disclaimer.html`)
Legal notice page covering:
- Content ownership and attribution
- Fair use and educational purpose statement
- CompTIA trademark notice
- No warranties or guarantees
- DMCA / content removal process
- Links to official study resources (CompTIA, Professor Messer, ExamCompass)

Linked from the footer of `index.html`.

---

## 🎨 Design System

All pages share a consistent dark theme:

| Variable | Value | Usage |
|----------|-------|-------|
| `--bg` | `#0b0e17` | Page background |
| `--bg2` | `#111520` | Card backgrounds |
| `--bg3` | `#181d2e` | Input / sidebar backgrounds |
| `--accent` | `#00d4ff` | Primary cyan — buttons, links, highlights |
| `--green` | `#00f5a0` | Success states, correct answers |
| `--red` | `#ff4757` | Error states, incorrect answers |
| `--yellow` | `#ffd32a` | Warnings, multi-select indicators |
| `--purple` | `#b47aff` | 4th card accent, simulation elements |
| `--text` | `#d0d8f0` | Primary text |
| `--muted` | `#5a6a8a` | Secondary / placeholder text |

**Fonts:** IBM Plex Sans (body) + IBM Plex Mono (code, labels, UI elements)

---

## 🔗 Page Link Map

```
index.html
├── Practice-tests.html
│   ├── PracticeTestA.html
│   ├── PracticeTestB.html
│   ├── PracticeTestC.html
│   ├── ExamCompass-Test1.html
│   └── ExamCompass-Test2.html
├── Flashcards.html
├── Acronyms.html
├── cyber-simulations.html
└── disclaimer.html
```

---

## 📜 Content Attribution

| Content | Source | Ownership |
|---------|--------|-----------|
| Practice Tests A, B, C | Professor Messer | © Professor Messer |
| ExamCompass Test 1 & 2 | ExamCompass.com | © ExamCompass |
| Cyber Simulations | Original | Site Owner |
| Gamification System | Original | Site Owner |
| UI / Design | Original | Site Owner |

> This site is a non-commercial educational resource. See `disclaimer.html` for full legal notice.

---

## 🛠️ Technical Notes

- **No frameworks or dependencies** — pure HTML, CSS, JavaScript
- **No backend required** — all data stored in browser `localStorage`
- **No build process** — open files directly in browser or deploy as static site
- **Responsive** — works on desktop, tablet, and mobile
- **Browser support** — all modern browsers (Chrome, Firefox, Edge, Safari)

### Deploying to GitHub Pages
1. Push all files to a GitHub repository
2. Go to **Settings → Pages**
3. Set source to `main` branch, root folder
4. Site will be live at `https://yourusername.github.io/repo-name`

### Troubleshooting Gamification
If the gamification dashboard isn't loading:
- Check that `gamification-social.js` is in the **same folder** as `index.html`
- Filename is **case-sensitive** — must be exactly `gamification-social.js`
- Open browser console (F12) and look for `"Security+ Gamification System Loaded"`
- Test with: `window.securityPlusGamification.addXP(50)`
- Clear corrupted data: `localStorage.removeItem('securityPlusGameData')`

---

## 📊 Project Stats

| Metric | Count |
|--------|-------|
| Total HTML files | 13 |
| Total JS files | 4 |
| Total lines of code | ~13,800 |
| Practice questions | 270+ |
| Simulation scenarios | 6 |
| Gamification achievements | 12 |
| Security+ domains covered | All 5 |

---

*CompTIA Security+ and SY0-701 are trademarks of CompTIA, Inc. This project is not affiliated with or endorsed by CompTIA.*
