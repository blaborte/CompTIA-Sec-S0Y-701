// Cybersecurity Interactive Simulations
(function() {
  'use strict';

  // Simulation scenarios database
  const scenarios = {
    phishing: {
      title: 'Phishing Email Detection',
      context: 'You are a Security Analyst at TechCorp. An employee has forwarded a suspicious email to the security team for analysis.',
      steps: [
        {
          type: 'email',
          data: {
            from: 'security@paypa1-verify.com',
            to: 'john.doe@techcorp.com',
            subject: 'URGENT: Verify Your Account',
            date: 'Today 09:47 AM',
            body: `Dear Valued Customer,\n\nWe have detected unusual activity on your PayPal account. To prevent suspension, please verify your account immediately by clicking the link below:\n\nhttps://paypa1-verify.com/secure/login?ref=7x9k2m\n\nFailure to verify within 24 hours will result in permanent account closure.\n\nThank you,\nPayPal Security Team\n\nThis is an automated message, please do not reply.`
          },
          question: 'What are the PRIMARY red flags in this email that indicate it\'s a phishing attempt?',
          choices: [
            {
              text: 'The sender domain uses "1" instead of "l" in PayPal, urgent language, and suspicious URL',
              correct: true,
              feedback: 'Excellent! You identified multiple critical indicators: domain spoofing (paypa1 vs paypal), urgency tactics, and a suspicious link. These are classic phishing techniques.',
              explanation: 'Phishing emails often use:\n• Domain spoofing (similar-looking characters)\n• Urgency/fear tactics\n• Suspicious links that don\'t match the legitimate domain\n• Generic greetings\n• Threats of account closure'
            },
            {
              text: 'The email is automated and asks not to reply',
              correct: false,
              feedback: 'While automated emails can be legitimate, this alone isn\'t a primary indicator of phishing. Look at the domain and URL more closely.',
              explanation: 'Many legitimate companies send automated emails. The key red flags here are the spoofed domain and suspicious URL.'
            },
            {
              text: 'It mentions unusual account activity',
              correct: false,
              feedback: 'Legitimate security alerts do mention unusual activity. The real issue is HOW they\'re asking you to respond and WHERE they\'re directing you.',
              explanation: 'Legitimate companies do send fraud alerts, but they won\'t ask you to click suspicious links or threaten immediate account closure.'
            },
            {
              text: 'The email was received in the morning',
              correct: false,
              feedback: 'The time an email is received is not a security indicator. Focus on the sender, content, and links.',
              explanation: 'Phishing emails can arrive at any time. Focus on technical indicators like domain authenticity, URL structure, and social engineering tactics.'
            }
          ]
        },
        {
          type: 'terminal',
          command: 'whois paypa1-verify.com',
          output: `Domain Name: PAYPA1-VERIFY.COM\nRegistry Domain ID: 2847392847_DOMAIN_COM-VRSN\nRegistrar: NameCheap Inc.\nCreation Date: 2024-02-09T14:23:11Z\nRegistry Expiry Date: 2025-02-09T14:23:11Z\nRegistrant Country: RU\nName Server: ns1.suspicioushost.net\nDNSSEC: unsigned`,
          question: 'Based on the WHOIS information, what action should you take?',
          choices: [
            {
              text: 'Block the domain at the email gateway, report to the employee, and create a security awareness alert',
              correct: true,
              feedback: 'Perfect response! The domain was created recently, registered in Russia, and uses suspicious nameservers. This is clearly malicious.',
              explanation: 'Proper incident response includes:\n• Immediate technical controls (blocking)\n• User notification\n• Organization-wide awareness\n• Documentation for future reference'
            },
            {
              text: 'Just delete the email and move on',
              correct: false,
              feedback: 'This is too passive. Other employees may have received the same email. You need to take broader protective measures.',
              explanation: 'A single phishing email likely indicates a broader campaign. Always implement defensive measures and educate users.'
            },
            {
              text: 'Only warn the employee who reported it',
              correct: false,
              feedback: 'Good start, but incomplete. This phishing attempt likely targeted multiple employees. Organization-wide protection is needed.',
              explanation: 'Phishing campaigns typically target many users simultaneously. Implement technical controls and broad awareness measures.'
            },
            {
              text: 'Forward it to PayPal\'s security team',
              correct: false,
              feedback: 'While reporting to PayPal is helpful, your primary responsibility is protecting YOUR organization first.',
              explanation: 'Your first priority is protecting your own organization through blocking, alerting, and education. Reporting to PayPal is secondary.'
            }
          ]
        }
      ]
    },

    incident: {
      title: 'Ransomware Incident Response',
      context: 'It\'s 3:00 AM. Your phone rings - multiple servers are displaying ransomware encryption warnings. You are the on-call Security Incident Response Manager.',
      steps: [
        {
          type: 'terminal',
          lines: [
            { text: '[ALERT] server-db-01: CRITICAL - Unauthorized encryption detected', class: 'terminal-error' },
            { text: '[ALERT] server-file-01: CRITICAL - Ransomware signature match', class: 'terminal-error' },
            { text: '[ALERT] server-web-02: WARNING - Unusual network activity', class: 'terminal-warning' },
            { text: '[INFO] 47 workstations reporting file access errors', class: 'terminal-output' },
            { text: '[INFO] Network traffic spike detected: 15GB outbound in 10 minutes', class: 'terminal-output' }
          ],
          question: 'What is your FIRST priority in this incident response?',
          choices: [
            {
              text: 'Isolate affected systems from the network to prevent further spread',
              correct: true,
              feedback: 'Correct! Containment is the immediate priority. You must stop the ransomware from spreading to additional systems before it encrypts more data.',
              explanation: 'Incident Response Priority Order:\n1. Containment (stop the spread)\n2. Eradication (remove the threat)\n3. Recovery (restore systems)\n4. Lessons learned\n\nRansomware can spread rapidly across networks, so isolation is critical.'
            },
            {
              text: 'Contact the CEO and legal team immediately',
              correct: false,
              feedback: 'While important, this should come AFTER containment. Every minute you delay, more systems could be encrypted.',
              explanation: 'Notifications are important but secondary to containment. You can notify leadership after preventing further spread.'
            },
            {
              text: 'Start restoring from backups immediately',
              correct: false,
              feedback: 'Dangerous! If the ransomware is still active, it will encrypt your restored files too. Contain first, then recover.',
              explanation: 'Recovery comes AFTER containment and eradication. Restoring while the threat is active will just result in re-encryption.'
            },
            {
              text: 'Investigate how the ransomware entered the network',
              correct: false,
              feedback: 'Investigation is important but not urgent. First stop the damage, THEN investigate the root cause.',
              explanation: 'Forensic investigation happens after containment. Your first priority is preventing additional damage.'
            }
          ]
        },
        {
          type: 'terminal',
          command: 'tail -f /var/log/firewall.log',
          output: `Feb 11 03:15:42 fw01: ALLOW TCP 192.168.1.105:52341 -> 45.142.212.61:443\nFeb 11 03:15:43 fw01: ALLOW TCP 192.168.1.105:52342 -> 45.142.212.61:443\nFeb 11 03:15:44 fw01: ALLOW TCP 192.168.1.127:51920 -> 45.142.212.61:443\nFeb 11 03:15:45 fw01: ALLOW TCP 192.168.1.134:49871 -> 45.142.212.61:443\nFeb 11 03:15:46 fw01: DENY TCP 192.168.1.105:52343 -> 45.142.212.61:443 [BLOCKED BY ADMIN]`,
          question: 'After containment, what should be your NEXT step based on these firewall logs?',
          choices: [
            {
              text: 'Block the malicious IP (45.142.212.61) at the firewall and identify all compromised hosts communicating with it',
              correct: true,
              feedback: 'Excellent! This is proper eradication. Block the C&C server and identify all infected systems for cleanup.',
              explanation: 'The IP 45.142.212.61 is clearly the ransomware\'s command & control server. Multiple internal IPs are communicating with it, indicating lateral spread. Blocking it prevents further instructions to the ransomware.'
            },
            {
              text: 'Pay the ransom to get the decryption key quickly',
              correct: false,
              feedback: 'Never recommended! Payment doesn\'t guarantee decryption, funds criminals, and makes you a target for future attacks.',
              explanation: 'Paying ransoms:\n• Doesn\'t guarantee file recovery\n• Funds criminal operations\n• Marks you as a willing payer\n• May violate sanctions laws\n\nAlways restore from backups instead.'
            },
            {
              text: 'Immediately wipe and reimage all servers',
              correct: false,
              feedback: 'Too hasty! You need forensic data first, and some systems may be unaffected. Also check if backups exist.',
              explanation: 'Preserve evidence before wiping systems. Some may be unaffected, and you need forensic data to understand the attack and prevent recurrence.'
            },
            {
              text: 'Turn off all firewall rules to stop the attack',
              correct: false,
              feedback: 'This would actually make things worse by removing all network protection and potentially exposing more systems.',
              explanation: 'Firewalls should be configured to BLOCK malicious traffic, not disabled entirely. Strategic blocking is the correct approach.'
            }
          ]
        }
      ]
    },

    malware: {
      title: 'Malware Investigation',
      context: 'A user reports their computer is "acting strange" - slow performance, random pop-ups, and unknown programs appearing. You need to investigate.',
      steps: [
        {
          type: 'terminal',
          command: 'netstat -ano | findstr ESTABLISHED',
          output: `TCP    192.168.1.55:49821    93.184.221.240:443    ESTABLISHED    4892\nTCP    192.168.1.55:49822    172.217.14.206:443    ESTABLISHED    2156\nTCP    192.168.1.55:49823    185.220.101.19:9050   ESTABLISHED    7364\nTCP    192.168.1.55:49824    104.26.2.33:443       ESTABLISHED    1024`,
          question: 'Which connection is MOST suspicious and warrants immediate investigation?',
          choices: [
            {
              text: 'The connection to 185.220.101.19 on port 9050 (Tor network)',
              correct: true,
              feedback: 'Correct! Port 9050 is the default Tor port. Corporate machines shouldn\'t be using Tor, which is often used by malware to hide C&C communications.',
              explanation: 'Port 9050 is used by the Tor network for anonymous communication. While Tor itself isn\'t malicious, it\'s commonly used by malware to:\n• Hide command & control traffic\n• Evade detection\n• Exfiltrate data anonymously\n\nThis connection should be investigated immediately.'
            },
            {
              text: 'The connection to 172.217.14.206:443 (Google)',
              correct: false,
              feedback: 'This is a Google IP address on HTTPS port. This is normal browser traffic and not suspicious.',
              explanation: 'Google IPs on port 443 (HTTPS) are normal for web browsing, Gmail, Drive, etc. Not inherently suspicious.'
            },
            {
              text: 'All HTTPS (443) connections should be blocked',
              correct: false,
              feedback: 'HTTPS is standard for secure web traffic. Blocking it would break nearly all web browsing and cloud services.',
              explanation: 'HTTPS (port 443) is the standard for secure web communications. The suspicious element is the destination and port combination, not HTTPS itself.'
            },
            {
              text: 'The connection to 93.184.221.240:443',
              correct: false,
              feedback: 'This is actually a legitimate CDN (Content Delivery Network). While worth noting, it\'s less suspicious than the Tor connection.',
              explanation: 'While you should verify all connections, CDN IPs are commonly accessed for legitimate content delivery. The Tor connection is far more suspicious.'
            }
          ]
        },
        {
          type: 'terminal',
          command: 'tasklist | findstr 7364',
          output: `cryptominer.exe          7364 Console                1     89,432 K`,
          question: 'Now that you\'ve identified the malicious process, what is the PROPER remediation sequence?',
          choices: [
            {
              text: 'Kill the process, isolate the machine, run full antivirus scan, check persistence mechanisms, reimage if needed',
              correct: true,
              feedback: 'Perfect incident response! You\'ve covered immediate containment, thorough investigation, and proper cleanup.',
              explanation: 'Proper malware remediation:\n1. Kill the active process\n2. Isolate from network (prevent spread/C&C)\n3. Full system scan\n4. Check registry, startup folders, scheduled tasks\n5. If deeply rooted, reimage the system\n6. Monitor for reinfection'
            },
            {
              text: 'Just kill the process and tell the user to continue working',
              correct: false,
              feedback: 'Inadequate! The malware likely installed persistence mechanisms. It will restart at next boot.',
              explanation: 'Malware installs multiple persistence methods (registry keys, scheduled tasks, services). Just killing the process provides temporary relief only.'
            },
            {
              text: 'Immediately shut down the computer without investigation',
              correct: false,
              feedback: 'This destroys volatile memory evidence and doesn\'t prevent the malware from reactivating at next boot.',
              explanation: 'Immediate shutdown loses valuable forensic data in RAM. Proper procedure is to document, isolate, then remediate.'
            },
            {
              text: 'Run a registry cleaner to fix the system',
              correct: false,
              feedback: 'Registry cleaners are not security tools and won\'t remove malware. You need proper antivirus/EDR solutions.',
              explanation: 'Registry cleaners are not designed for malware removal. Use proper security tools (AV, EDR) or reimage the system.'
            }
          ]
        }
      ]
    },

    network: {
      title: 'Network Intrusion Detection',
      context: 'Your IDS has triggered multiple alerts. You need to analyze the traffic and determine if it\'s a real attack or false positive.',
      steps: [
        {
          type: 'terminal',
          command: 'tcpdump -r capture.pcap | grep SYN',
          output: `12:34:01.823421 IP 203.0.113.47.52341 > 192.168.1.10.80: Flags [S], seq 1234567\n12:34:01.823455 IP 203.0.113.47.52342 > 192.168.1.10.81: Flags [S], seq 1234568\n12:34:01.823489 IP 203.0.113.47.52343 > 192.168.1.10.82: Flags [S], seq 1234569\n12:34:01.823512 IP 203.0.113.47.52344 > 192.168.1.10.83: Flags [S], seq 1234570\n12:34:01.823534 IP 203.0.113.47.52345 > 192.168.1.10.84: Flags [S], seq 1234571\n[... 500 more similar entries in 2 seconds ...]`,
          question: 'What type of attack is this, and what should you do?',
          choices: [
            {
              text: 'SYN flood / Port scan - Block source IP, enable SYN cookies, alert security team',
              correct: true,
              feedback: 'Excellent analysis! This is a classic SYN flood or port scan. Multiple SYN packets from one source to sequential ports indicates reconnaissance or DoS.',
              explanation: 'Attack Indicators:\n• Single source IP\n• Sequential destination ports\n• Only SYN flags (no ACK responses)\n• High volume in short time\n\nDefenses:\n• Block attacking IP\n• Enable SYN cookies (prevents SYN flood)\n• Rate limiting\n• IPS/IDS rules'
            },
            {
              text: 'Normal traffic - Ignore the alerts',
              correct: false,
              feedback: 'Definitely not normal! 500+ SYN packets in 2 seconds from one source to sequential ports is clearly malicious.',
              explanation: 'This traffic pattern is a textbook attack signature. Never ignore high-volume sequential connection attempts.'
            },
            {
              text: 'Disable the firewall to allow the connection',
              correct: false,
              feedback: 'This would be catastrophic! You\'d be removing protection during an active attack.',
              explanation: 'Never disable security controls during an attack. The correct response is to strengthen defenses, not weaken them.'
            },
            {
              text: 'Restart all servers to clear the connections',
              correct: false,
              feedback: 'Restarting won\'t help - the attack will immediately resume. You need to block the source and implement proper defenses.',
              explanation: 'Rebooting doesn\'t address the root cause. The attacker will simply continue when systems come back online.'
            }
          ]
        }
      ]
    },

    social: {
      title: 'Social Engineering Attack',
      context: 'You receive a call from someone claiming to be from your company\'s IT department asking for your password to "fix a critical security issue."',
      steps: [
        {
          type: 'scenario',
          description: 'CALLER: "Hi, this is Mike from IT Support. We\'ve detected a critical security vulnerability affecting your account. I need your password to apply an emergency patch before your system is compromised. This is urgent!"',
          question: 'What is the BEST response to this request?',
          choices: [
            {
              text: 'Refuse to provide the password, hang up, and report the call to your actual IT security team',
              correct: true,
              feedback: 'Perfect! You recognized multiple social engineering red flags: urgency, password request, and fear tactics. IT never asks for passwords.',
              explanation: 'Social Engineering Red Flags:\n• Urgency/pressure tactics\n• Requesting credentials\n• Fear-based motivation\n• Unsolicited contact\n\nProper Response:\n• Never share passwords (IT doesn\'t need them)\n• Verify identity through official channels\n• Report the incident\n• Document the attempt'
            },
            {
              text: 'Provide the password since it\'s IT and seems urgent',
              correct: false,
              feedback: 'Never share your password with anyone, even if they claim to be IT! Legitimate IT departments never ask for passwords.',
              explanation: 'This is a classic social engineering attack. Real IT support:\n• Never asks for passwords\n• Uses proper ticketing systems\n• Can reset passwords without knowing the old one'
            },
            {
              text: 'Ask them to email you instead and reply with your password',
              correct: false,
              feedback: 'Still wrong! Changing the medium doesn\'t make it safe. Never share passwords via any communication method.',
              explanation: 'Passwords should never be shared through any channel - phone, email, chat, or in person. IT has proper tools for account management.'
            },
            {
              text: 'Give them a fake password to test if they\'re legitimate',
              correct: false,
              feedback: 'While creative, this wastes time and could escalate the situation. The correct response is to refuse, hang up, and report.',
              explanation: 'Don\'t engage with social engineering attempts. Report immediately to your security team for proper investigation.'
            }
          ]
        }
      ]
    },

    compliance: {
      title: 'Security Compliance Audit',
      context: 'Your company handles credit card data and must comply with PCI DSS. During an audit, you discover several issues.',
      steps: [
        {
          type: 'scenario',
          description: 'AUDIT FINDINGS:\n• Credit card numbers stored in plaintext database\n• Default passwords on network devices\n• No access logs for cardholder data\n• Antivirus updates disabled on payment terminals\n• WiFi network has WEP encryption',
          question: 'Which finding represents the HIGHEST priority security risk that must be addressed immediately?',
          choices: [
            {
              text: 'Credit card numbers stored in plaintext - this violates PCI DSS and exposes sensitive data',
              correct: true,
              feedback: 'Absolutely correct! Unencrypted cardholder data is a critical violation that could result in massive data breach, fines, and loss of ability to process cards.',
              explanation: 'PCI DSS Requirements:\n• Encrypt cardholder data at rest and in transit\n• Strong access controls\n• Regular security testing\n• Maintain secure systems\n\nPlaintext card data is the highest risk as it provides immediate access to attackers. Other issues are serious but secondary.'
            },
            {
              text: 'WiFi using WEP encryption',
              correct: false,
              feedback: 'While WEP is insecure and should be upgraded to WPA3, the plaintext credit card storage is a more immediate critical risk.',
              explanation: 'WEP is indeed broken and should be replaced with WPA3, but exposed cardholder data represents greater immediate risk of data breach.'
            },
            {
              text: 'Default passwords on network devices',
              correct: false,
              feedback: 'Default passwords are a serious issue, but they require an attacker to access your network first. Plaintext card data is immediately exploitable.',
              explanation: 'Default passwords should absolutely be changed, but they\'re a pathway to a breach. Plaintext data IS the breach waiting to happen.'
            },
            {
              text: 'All findings are equally important and should be fixed simultaneously',
              correct: false,
              feedback: 'While all need fixing, risk prioritization is crucial. The plaintext card data represents immediate, critical exposure that must be addressed first.',
              explanation: 'Security teams must prioritize based on risk. Plaintext cardholder data is the highest risk and must be encrypted immediately before addressing other issues.'
            }
          ]
        }
      ]
    }
  };

  let currentScenario = null;
  let currentStep = 0;
  let scenarioScore = 0;

  // Initialize
  document.querySelectorAll('.scenario-card').forEach(card => {
    card.addEventListener('click', () => {
      const scenarioId = card.dataset.scenario;
      loadScenario(scenarioId);
    });
  });

  function loadScenario(scenarioId) {
    currentScenario = scenarios[scenarioId];
    currentStep = 0;
    scenarioScore = 0;

    document.getElementById('introSection').style.display = 'none';
    const container = document.getElementById('simulationContainer');
    container.classList.add('active');

    showStep();
  }

  function showStep() {
    const step = currentScenario.steps[currentStep];
    const container = document.getElementById('simulationContainer');

    let html = `
      <div class="simulation-header">
        <h2 class="sim-title">${currentScenario.title}</h2>
        <p class="sim-context">${currentScenario.context}</p>
      </div>

      <div class="progress-indicator">
        ${currentScenario.steps.map((_, i) => 
          `<div class="progress-dot ${i < currentStep ? 'completed' : i === currentStep ? 'active' : ''}"></div>`
        ).join('')}
      </div>
    `;

    // Render step type
    if (step.type === 'email') {
      html += renderEmail(step);
    } else if (step.type === 'terminal') {
      html += renderTerminal(step);
    } else if (step.type === 'scenario') {
      html += renderScenario(step);
    }

    html += renderQuestion(step);

    container.innerHTML = html;

    // Add event listeners to choices
    document.querySelectorAll('.choice-btn').forEach((btn, index) => {
      btn.addEventListener('click', () => handleAnswer(index, step));
    });
  }

  function renderEmail(step) {
    return `
      <div class="email-window">
        <div class="email-header">
          <div class="email-field">
            <span class="email-label">From:</span>
            <span class="email-value ${step.data.from.includes('1') ? 'email-suspicious' : ''}">${step.data.from}</span>
          </div>
          <div class="email-field">
            <span class="email-label">To:</span>
            <span class="email-value">${step.data.to}</span>
          </div>
          <div class="email-field">
            <span class="email-label">Subject:</span>
            <span class="email-value">${step.data.subject}</span>
          </div>
          <div class="email-field">
            <span class="email-label">Date:</span>
            <span class="email-value">${step.data.date}</span>
          </div>
        </div>
        <div class="email-body">${step.data.body.replace(/\n/g, '<br>')}</div>
      </div>
    `;
  }

  function renderTerminal(step) {
    let html = '<div class="terminal-window"><div class="terminal-header">';
    html += '<div class="terminal-dot dot-red"></div>';
    html += '<div class="terminal-dot dot-yellow"></div>';
    html += '<div class="terminal-dot dot-green"></div>';
    html += '<div class="terminal-title">Terminal - root@security-analyst</div>';
    html += '</div><div class="terminal-content">';

    if (step.lines) {
      step.lines.forEach((line, i) => {
        html += `<div class="terminal-line ${line.class}" style="animation-delay: ${i * 0.1}s">${line.text}</div>`;
      });
    } else if (step.command) {
      html += `<div class="terminal-line"><span class="terminal-prompt">root@analyst:~#</span> <span class="terminal-command">${step.command}</span></div>`;
      html += `<div class="terminal-line terminal-output" style="animation-delay: 0.2s">${step.output.replace(/\n/g, '<br>')}</div>`;
    }

    html += '</div></div>';
    return html;
  }

  function renderScenario(step) {
    return `
      <div class="terminal-window">
        <div class="terminal-header">
          <div class="terminal-dot dot-red"></div>
          <div class="terminal-dot dot-yellow"></div>
          <div class="terminal-dot dot-green"></div>
          <div class="terminal-title">Scenario</div>
        </div>
        <div class="terminal-content">
          <div class="terminal-line terminal-output">${step.description.replace(/\n/g, '<br>')}</div>
        </div>
      </div>
    `;
  }

  function renderQuestion(step) {
    let html = '<div class="question-section">';
    html += `<div class="question-text">${step.question}</div>`;
    html += '<div class="choices-container">';

    step.choices.forEach((choice, index) => {
      const letter = String.fromCharCode(65 + index);
      html += `
        <div class="choice-btn" data-index="${index}">
          <span class="choice-letter">${letter}</span>
          <span class="choice-text">${choice.text}</span>
        </div>
      `;
    });

    html += '</div>';
    html += '<div class="feedback-section" id="feedback"></div>';
    html += '</div>';

    return html;
  }

  function handleAnswer(choiceIndex, step) {
    const choice = step.choices[choiceIndex];
    const choiceBtns = document.querySelectorAll('.choice-btn');
    const feedback = document.getElementById('feedback');

    // Disable all choices
    choiceBtns.forEach(btn => {
      btn.style.pointerEvents = 'none';
      const btnIndex = parseInt(btn.dataset.index);
      if (step.choices[btnIndex].correct) {
        btn.classList.add('correct');
      } else if (btnIndex === choiceIndex && !choice.correct) {
        btn.classList.add('incorrect');
      }
    });

    // Show feedback
    const isCorrect = choice.correct;
    if (isCorrect) scenarioScore++;

    feedback.innerHTML = `
      <div class="feedback-title ${isCorrect ? 'correct' : 'incorrect'}">
        ${isCorrect ? '✓ Correct!' : '✗ Incorrect'}
      </div>
      <div class="feedback-text">${choice.feedback}</div>
      <div class="feedback-explanation">
        <div class="explanation-title">Explanation</div>
        <div class="explanation-text">${choice.explanation.replace(/\n/g, '<br>')}</div>
      </div>
      <div class="action-buttons">
        ${currentStep < currentScenario.steps.length - 1 ? 
          '<button class="btn btn-primary" onclick="nextStep()">Next Step →</button>' :
          '<button class="btn btn-primary" onclick="finishScenario()">Complete Simulation</button>'
        }
        <button class="btn btn-secondary" onclick="returnToMenu()">Exit Simulation</button>
      </div>
    `;
    feedback.classList.add('show');

    // Award XP for correct answers
    if (isCorrect && window.securityPlusGamification) {
      window.securityPlusGamification.addXP(10);
    }
  }

  window.nextStep = function() {
    currentStep++;
    showStep();
  };

  window.finishScenario = function() {
    const totalSteps = currentScenario.steps.length;
    const percentage = Math.round((scenarioScore / totalSteps) * 100);

    const container = document.getElementById('simulationContainer');
    container.innerHTML = `
      <div class="simulation-header">
        <h2 class="sim-title">Simulation Complete!</h2>
        <p class="sim-context">You scored ${scenarioScore} out of ${totalSteps} (${percentage}%)</p>
      </div>
      <div class="question-section" style="text-align: center;">
        <div class="feedback-section show">
          <div class="feedback-title ${percentage >= 70 ? 'correct' : 'incorrect'}">
            ${percentage >= 70 ? '✓ Well Done!' : '⚠ Keep Practicing'}
          </div>
          <div class="feedback-text">
            ${percentage >= 90 ? 'Excellent work! You demonstrated strong cybersecurity knowledge.' :
              percentage >= 70 ? 'Good job! You\'re on the right track. Review the explanations to improve further.' :
              'Keep studying! Review the explanations and try again to improve your understanding.'}
          </div>
          <div class="action-buttons">
            <button class="btn btn-primary" onclick="returnToMenu()">Try Another Scenario</button>
            <button class="btn btn-secondary" onclick="location.reload()">Restart This Scenario</button>
          </div>
        </div>
      </div>
    `;

    // Award completion XP
    if (window.securityPlusGamification) {
      window.securityPlusGamification.addXP(50);
    }
  };

  window.returnToMenu = function() {
    document.getElementById('introSection').style.display = 'block';
    document.getElementById('simulationContainer').classList.remove('active');
    currentScenario = null;
    currentStep = 0;
    scenarioScore = 0;
  };

})();
