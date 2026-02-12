// Branching Scenario Engine - Data File
// Security+ SY0-701 Leading Question Simulations

const SCENARIOS = {
  midnight_breach: {
    id: "midnight_breach",
    title: "The Midnight Breach",
    subtitle: "Ransomware Incident Response",
    difficulty: "Hard",
    domain: "Operations & Incident Response",
    estimatedTime: "10-15 min",
    intro: `It's 2:47 AM on a Tuesday. You're the on-call SOC Analyst at MedCorp, a regional hospital network serving 400,000 patients. Your phone erupts with alerts. Three servers are showing anomalous behavior simultaneously — file encryption signatures, unusual outbound traffic, and a domain controller login from an IP in Eastern Europe.\n\nYour manager, Director Kim, is calling your phone. Your incident response playbook is open on your second monitor. You have 60 seconds before the situation escalates further.`,
    roles: "SOC Analyst — MedCorp Regional Hospital",
    stakes: "Patient data, hospital operations, regulatory compliance",

    // Each node: id, situation update, question, choices
    // Each choice: text, next (node id), outcome, points, isOptimal
    nodes: {

      start: {
        id: "start",
        timeStamp: "02:47:13",
        threatLevel: 1,
        situation: null,
        question: "Three simultaneous alerts. Director Kim is calling. What do you do FIRST?",
        choices: [
          {
            text: "Answer Director Kim's call to get guidance",
            next: "answered_phone",
            outcome: "You answer. Kim panics: 'Just restart everything!' You hesitate — restarting could destroy forensic evidence and spread the infection.",
            points: 10,
            isOptimal: false,
            tag: "⚠️ Risky"
          },
          {
            text: "Acknowledge alerts, start triage — identify affected systems",
            next: "started_triage",
            outcome: "Smart move. You silence the phone and begin triage. Identifying scope before acting is textbook incident response.",
            points: 30,
            isOptimal: true,
            tag: "✓ Optimal"
          },
          {
            text: "Immediately isolate all three servers from the network",
            next: "isolated_too_fast",
            outcome: "You isolate the servers — but you haven't identified all affected hosts yet. Two more infected workstations remain on the network and continue spreading.",
            points: 15,
            isOptimal: false,
            tag: "⚠️ Premature"
          },
          {
            text: "Send a company-wide email warning all staff",
            next: "sent_email",
            outcome: "You broadcast the breach to 3,000 employees at 2AM. Chaos ensues. Staff unplug their own machines, destroying evidence. The CISO calls you immediately.",
            points: 0,
            isOptimal: false,
            tag: "❌ Critical Error"
          }
        ]
      },

      // PATH A — Answered the phone
      answered_phone: {
        id: "answered_phone",
        timeStamp: "02:49:02",
        threatLevel: 2,
        situation: "Director Kim is insisting you restart the servers. Meanwhile your monitoring dashboard shows the encryption is spreading — 2 more hosts just went red.",
        question: "Kim says 'That's an order — restart them NOW.' How do you respond?",
        choices: [
          {
            text: "Follow the order and restart all affected servers",
            next: "restarted_servers",
            outcome: "Restarting wipes volatile memory evidence. The ransomware's dropper reinstalls itself from a persistence mechanism you haven't found yet. Situation critical.",
            points: 0,
            isOptimal: false,
            tag: "❌ Critical Error"
          },
          {
            text: "Calmly explain restarting destroys evidence and escalate to CISO",
            next: "escalated_to_ciso",
            outcome: "You push back professionally. Kim pauses. You escalate to CISO — correct chain of command. You've recovered from the early mistake.",
            points: 25,
            isOptimal: true,
            tag: "✓ Recovered"
          },
          {
            text: "Restart only one server as a compromise",
            next: "partial_restart",
            outcome: "The restarted server re-encrypts itself within 8 minutes. Partial measures with active malware are rarely effective.",
            points: 5,
            isOptimal: false,
            tag: "❌ Ineffective"
          }
        ]
      },

      restarted_servers: {
        id: "restarted_servers",
        timeStamp: "02:54:18",
        threatLevel: 4,
        situation: "The servers are back online — and immediately start re-encrypting. The ransomware had a scheduled task persistence mechanism. It's now spreading faster. 12 hosts are now red. The ER's patient management system just went offline.",
        question: "The ER system is down. Lives may be at risk. What's your immediate priority?",
        choices: [
          {
            text: "Shut down the entire hospital network immediately",
            next: "network_shutdown_bad",
            outcome: "You kill network access across the hospital — including medical devices and monitoring systems in the ICU. This is dangerous. The decision to shut down critical healthcare infrastructure requires executive authorization.",
            points: 5,
            isOptimal: false,
            tag: "❌ Dangerous"
          },
          {
            text: "Isolate the ER segment, activate paper-based backup procedures, call the IR team",
            next: "activated_ir_team",
            outcome: "Textbook. You segment the ER, trigger manual backup procedures (hospitals have these for exactly this), and activate your IR team. You're back on track.",
            points: 30,
            isOptimal: true,
            tag: "✓ Optimal"
          },
          {
            text: "Focus on restoring the ER system first before containing the spread",
            next: "restoration_first",
            outcome: "You spend 20 minutes trying to restore the ER system while ransomware spreads to 30 more hosts. You can't restore what's still being actively encrypted.",
            points: 5,
            isOptimal: false,
            tag: "❌ Wrong Priority"
          }
        ]
      },

      // PATH B — Started triage (optimal start)
      started_triage: {
        id: "started_triage",
        timeStamp: "02:48:45",
        threatLevel: 1,
        situation: "Triage complete. You've identified 3 confirmed infected servers: DB-01, FILE-01, and WEB-02. Firewall logs show all three are beaconing to 185.220.101.47:9050 every 30 seconds. Director Kim has now left 2 voicemails.",
        question: "The external IP 185.220.101.47 on port 9050 — what does this tell you?",
        choices: [
          {
            text: "It's a web server — the malware is downloading updates",
            next: "wrong_port_id",
            outcome: "Port 9050 is actually the default Tor proxy port, not a web server (that's 80/443). The malware is using Tor to hide its C&C communications. Misidentifying this costs response time.",
            points: 5,
            isOptimal: false,
            tag: "❌ Incorrect"
          },
          {
            text: "Port 9050 is Tor — this is C&C traffic routed through the Tor network",
            next: "identified_tor",
            outcome: "Correct. Ransomware commonly uses Tor for encrypted C&C communications to evade detection. This tells you the attacker is sophisticated and privacy-conscious.",
            points: 30,
            isOptimal: true,
            tag: "✓ Correct"
          },
          {
            text: "It's an FTP server exfiltrating data",
            next: "wrong_port_id",
            outcome: "FTP uses ports 20/21. Port 9050 is the Tor SOCKS proxy port. Misidentifying protocols is a common exam trap — and a costly real-world mistake.",
            points: 5,
            isOptimal: false,
            tag: "❌ Incorrect"
          },
          {
            text: "Unknown — block it at the firewall and investigate later",
            next: "blocked_without_id",
            outcome: "Blocking is the right instinct, but acting without understanding limits your response. You've blocked the C&C channel but don't know what the malware was receiving.",
            points: 15,
            isOptimal: false,
            tag: "⚠️ Partial"
          }
        ]
      },

      identified_tor: {
        id: "identified_tor",
        timeStamp: "02:51:20",
        threatLevel: 2,
        situation: "You've confirmed Tor-based C&C traffic. You block the IP at the perimeter firewall. Now you need to contain the infection. Your monitoring shows the ransomware is attempting lateral movement via SMB on port 445 — it's trying to spread to other hosts on the same subnet.",
        question: "What's your BEST containment strategy right now?",
        choices: [
          {
            text: "Shut down the entire network to stop all lateral movement",
            next: "full_shutdown",
            outcome: "Complete network shutdown stops spread but also kills hospital operations including patient monitoring systems. This requires CISO and executive sign-off — not a solo decision.",
            points: 10,
            isOptimal: false,
            tag: "⚠️ Too Broad"
          },
          {
            text: "Isolate the infected subnet using firewall ACLs, preserve other network segments",
            next: "subnet_isolated",
            outcome: "Perfect. Surgical segmentation contains the threat to the affected subnet while keeping critical hospital systems operational. This is textbook network segmentation in action.",
            points: 30,
            isOptimal: true,
            tag: "✓ Optimal"
          },
          {
            text: "Disable SMB across the entire network via Group Policy",
            next: "smb_disabled",
            outcome: "Disabling SMB network-wide stops lateral movement but breaks file sharing across the hospital, including critical clinical systems. Too broad — affects too much.",
            points: 15,
            isOptimal: false,
            tag: "⚠️ Too Broad"
          },
          {
            text: "Deploy AV signatures to all hosts to detect and quarantine",
            next: "av_deployed",
            outcome: "AV deployment takes time, and ransomware often evades signature-based detection. The infection will spread further while you wait for deployment.",
            points: 10,
            isOptimal: false,
            tag: "⚠️ Too Slow"
          }
        ]
      },

      subnet_isolated: {
        id: "subnet_isolated",
        timeStamp: "02:56:40",
        threatLevel: 2,
        situation: "Infected subnet is isolated. Spread is contained to 3 servers. You now need to notify stakeholders. You know: the breach involves potential patient data (PHI), making this a HIPAA incident. Your IR team is assembling. The attacker has left a ransom note demanding $2M in Bitcoin within 48 hours.",
        question: "The ransom note demands $2M. Your CEO asks if you should pay. What do you advise?",
        choices: [
          {
            text: "Pay the ransom — it's the fastest way to restore operations",
            next: "paid_ransom",
            outcome: "Paying funds criminal organizations, doesn't guarantee decryption, may violate OFAC sanctions if the group is sanctioned, and marks you as a willing payer for future attacks.",
            points: 0,
            isOptimal: false,
            tag: "❌ Never Recommended"
          },
          {
            text: "Do not pay — restore from clean backups, engage FBI and legal counsel",
            next: "refused_ransom",
            outcome: "Correct. FBI involvement is recommended for ransomware attacks. Clean backups are the proper recovery path. Legal counsel handles regulatory notifications.",
            points: 30,
            isOptimal: true,
            tag: "✓ Optimal"
          },
          {
            text: "Negotiate the ransom down while working on backups as a fallback",
            next: "negotiated_ransom",
            outcome: "Negotiating gives the appearance of willingness to pay and wastes time. Focus resources on backup restoration instead.",
            points: 10,
            isOptimal: false,
            tag: "⚠️ Not Recommended"
          },
          {
            text: "Pay only if backups are confirmed unavailable",
            next: "conditional_pay",
            outcome: "Conditional payment is still problematic — same legal, ethical, and security concerns apply regardless of backup status. Explore all alternatives first.",
            points: 10,
            isOptimal: false,
            tag: "⚠️ Last Resort Only"
          }
        ]
      },

      refused_ransom: {
        id: "refused_ransom",
        timeStamp: "03:14:55",
        threatLevel: 2,
        situation: "FBI notified. Legal counsel engaged. Backup team confirms clean backups from 11PM last night — 4 hours ago — are available and unaffected. HIPAA breach notification team is assessing PHI exposure. Recovery is underway. Final question before the debrief...",
        question: "Under HIPAA, when must affected patients be notified of this breach?",
        choices: [
          {
            text: "Within 24 hours",
            next: "final_wrong",
            outcome: "24 hours is the standard for some breach notifications, but HIPAA has a specific and different timeline for patient notification.",
            points: 10,
            isOptimal: false,
            tag: "❌ Incorrect"
          },
          {
            text: "Within 60 days of discovering the breach",
            next: "final_correct",
            outcome: "Correct. HIPAA requires covered entities to notify affected individuals within 60 days of discovering a breach. For breaches affecting 500+ individuals, HHS and media must also be notified.",
            points: 30,
            isOptimal: true,
            tag: "✓ Correct"
          },
          {
            text: "Within 72 hours",
            next: "final_wrong",
            outcome: "72 hours is the GDPR notification timeline to supervisory authorities, not HIPAA's patient notification requirement.",
            points: 10,
            isOptimal: false,
            tag: "❌ Incorrect (That's GDPR)"
          },
          {
            text: "Immediately — real-time notification required",
            next: "final_wrong",
            outcome: "Immediate notification isn't required and may not be possible during active incident response. HIPAA allows 60 days for individual notifications.",
            points: 5,
            isOptimal: false,
            tag: "❌ Incorrect"
          }
        ]
      },

      // TERMINAL NODES
      escalated_to_ciso: {
        id: "escalated_to_ciso",
        timeStamp: "02:52:30",
        threatLevel: 2,
        situation: "CISO is now on the call. You've recovered from the phone call mistake. CISO takes command and orders proper triage. You identify the same 3 infected servers. The Tor C&C traffic is spotted and blocked.",
        question: "Now that scope is defined — what's the containment priority?",
        choices: [
          {
            text: "Isolate infected subnet using ACLs, preserve other segments",
            next: "subnet_isolated",
            outcome: "Correct. You've recovered well from the early mistake. Proper segmentation contains the threat.",
            points: 25,
            isOptimal: true,
            tag: "✓ Recovered"
          },
          {
            text: "Shut down all servers and restore from backup immediately",
            next: "restoration_first",
            outcome: "Restoring while the infection vector is still active risks re-infection. Contain first, then restore.",
            points: 5,
            isOptimal: false,
            tag: "❌ Wrong Order"
          }
        ]
      },

      activated_ir_team: {
        id: "activated_ir_team",
        timeStamp: "03:05:00",
        threatLevel: 3,
        situation: "IR team is assembled. ER is running on paper backup. The ransom note has been found demanding $2M. You've contained the spread to 15 hosts. Backups are being verified.",
        question: "The CEO asks if you should pay the ransom to restore operations faster. What do you recommend?",
        choices: [
          {
            text: "Do not pay — restore from clean backups, engage FBI and legal counsel",
            next: "refused_ransom",
            outcome: "Correct despite the difficult path to get here. No ransom payment, restore from backups.",
            points: 25,
            isOptimal: true,
            tag: "✓ Correct"
          },
          {
            text: "Pay the ransom — the ER needs to be back online immediately",
            next: "paid_ransom",
            outcome: "Urgency doesn't justify payment. This funds criminals and doesn't guarantee restoration.",
            points: 0,
            isOptimal: false,
            tag: "❌ Incorrect"
          }
        ]
      },

      paid_ransom: {
        id: "paid_ransom",
        isTerminal: true,
        terminalType: "bad",
        timeStamp: "04:30:00",
        situation: "You paid the $2M ransom. The attackers sent a partial decryption key — only 60% of files were restored. Two weeks later, you're attacked again by the same group. Forensic analysis reveals the initial access vector (a phishing email) was never identified or patched. The FBI is investigating. HHS has launched a HIPAA compliance audit.",
        outcome: "bad",
        message: "Breach uncontained. Ransomware actors struck again. $4M total paid with no guarantee of full recovery."
      },

      final_correct: {
        id: "final_correct",
        isTerminal: true,
        terminalType: "good",
        timeStamp: "08:15:00",
        situation: "Systems restored from clean backup. Patient data exposure being assessed. FBI case number assigned. HIPAA breach notification process initiated with 60-day timeline. Forensic team identified the initial access vector — a spearphishing email to an admin account. MFA is being enforced organization-wide.",
        outcome: "good",
        message: "Breach contained. Systems restored in 5 hours. Proper IR procedures followed. Zero ransom paid."
      },

      final_wrong: {
        id: "final_wrong",
        isTerminal: true,
        terminalType: "partial",
        timeStamp: "08:15:00",
        situation: "The response was largely successful — spread contained, ransom refused, backups restored. However, the HIPAA notification was filed incorrectly, resulting in a compliance finding during the HHS review. A $50,000 penalty is assessed for the notification timing error.",
        outcome: "partial",
        message: "Breach contained but compliance error on HIPAA notification timeline. Good IR, costly regulatory mistake."
      },

      wrong_port_id: {
        id: "wrong_port_id",
        timeStamp: "02:53:10",
        threatLevel: 2,
        situation: "The misidentification cost 4 minutes. Meanwhile, the malware has spread to 2 more hosts. A colleague correctly identifies the Tor traffic and blocks the C&C IP. You refocus.",
        question: "Spread is continuing via SMB port 445. What's your containment move?",
        choices: [
          {
            text: "Isolate the infected subnet using firewall ACLs",
            next: "subnet_isolated",
            outcome: "You recover with the right containment decision. The 4-minute delay added 2 more infected hosts but spread is now contained.",
            points: 20,
            isOptimal: true,
            tag: "✓ Recovered"
          },
          {
            text: "Shut down the entire network",
            next: "full_shutdown",
            outcome: "Too broad. Critical hospital systems go offline.",
            points: 5,
            isOptimal: false,
            tag: "⚠️ Too Broad"
          }
        ]
      },

      blocked_without_id: {
        id: "blocked_without_id",
        timeStamp: "02:52:00",
        threatLevel: 2,
        situation: "C&C traffic is blocked. Spread continues via SMB. You later learn the traffic was Tor-based C&C. Blocking was right but not understanding why limits your threat intelligence report.",
        question: "Lateral movement via SMB is continuing. How do you contain it?",
        choices: [
          {
            text: "Isolate the infected subnet using firewall ACLs",
            next: "subnet_isolated",
            outcome: "Good containment. You're back on the right path.",
            points: 25,
            isOptimal: true,
            tag: "✓ Good"
          },
          {
            text: "Disable SMB across the entire network",
            next: "smb_disabled",
            outcome: "Too broad. Breaks critical clinical systems.",
            points: 10,
            isOptimal: false,
            tag: "⚠️ Too Broad"
          }
        ]
      },

      isolated_too_fast: {
        id: "isolated_too_fast",
        timeStamp: "02:50:30",
        threatLevel: 2,
        situation: "You isolated the 3 servers but 2 infected workstations remained on the network. They've now spread to 5 more hosts. Your monitoring finally catches them.",
        question: "Now you have 7 infected hosts total across 2 subnets. Best approach?",
        choices: [
          {
            text: "Isolate both subnets using firewall ACLs",
            next: "subnet_isolated",
            outcome: "Better late than never. You contain both subnets. The early isolation mistake cost you 5 hosts but you've recovered.",
            points: 20,
            isOptimal: true,
            tag: "✓ Recovered"
          },
          {
            text: "Shut down the entire network now",
            next: "full_shutdown",
            outcome: "Too extreme at this point. Surgical segmentation is better.",
            points: 5,
            isOptimal: false,
            tag: "❌ Disproportionate"
          }
        ]
      },

      sent_email: {
        id: "sent_email",
        timeStamp: "02:50:00",
        threatLevel: 3,
        situation: "Chaos. 200 employees replied-all. 15 people unplugged their workstations, some mid-write destroying data. The CISO is furious. You're pulled off the incident. Senior IR team takes over. This is now being handled above your level.",
        question: "The CISO puts you back on the incident to support. What's the most critical lesson here?",
        choices: [
          {
            text: "Breach communication follows a defined escalation chain — not all-staff broadcast",
            next: "subnet_isolated",
            outcome: "Correct lesson learned. Incident communication must be controlled, targeted, and follow your IRP. You're back on the team in a support role.",
            points: 15,
            isOptimal: true,
            tag: "✓ Lesson Learned"
          },
          {
            text: "Emails should only be sent during business hours",
            next: "final_wrong",
            outcome: "Timing wasn't the issue — unauthorized broadcast communication was. The lesson is about communication channels, not timing.",
            points: 5,
            isOptimal: false,
            tag: "❌ Wrong Lesson"
          }
        ]
      },

      // Stub terminals for paths that lead to end
      partial_restart: {
        id: "partial_restart",
        isTerminal: true,
        terminalType: "bad",
        timeStamp: "03:45:00",
        situation: "The restarted server re-encrypted itself from a persistence mechanism. Ransomware spread to 20 hosts while attention was on the single restarted server. The incident spiraled out of control.",
        outcome: "bad",
        message: "Partial measures during active infection allowed the ransomware to spread further."
      },

      network_shutdown_bad: {
        id: "network_shutdown_bad",
        isTerminal: true,
        terminalType: "bad",
        timeStamp: "03:10:00",
        situation: "Shutting down network access to the entire hospital without executive authorization and without considering medical device impacts was a critical error. Two ICU patients experienced monitoring outages. Regulatory and legal consequences are severe.",
        outcome: "bad",
        message: "Unauthorized shutdown of critical healthcare infrastructure. Patient safety compromised."
      },

      restoration_first: {
        id: "restoration_first",
        isTerminal: true,
        terminalType: "bad",
        timeStamp: "04:00:00",
        situation: "While you focused on restoring rather than containing, ransomware spread to 45 hosts including the pharmacy and lab systems. Restoration failed because active encryption overwrote backup data being restored.",
        outcome: "bad",
        message: "You cannot restore systems that are actively being encrypted. Contain first, restore second."
      },

      full_shutdown: {
        id: "full_shutdown",
        isTerminal: true,
        terminalType: "partial",
        timeStamp: "03:30:00",
        situation: "Full network shutdown stopped the spread but also killed patient monitoring, pharmacy dispensing, and lab systems. Executive team was furious — this decision required sign-off. The breach was technically contained but operational damage was severe.",
        outcome: "partial",
        message: "Spread contained but significant operational damage. Network shutdown decisions require executive authorization."
      },

      smb_disabled: {
        id: "smb_disabled",
        isTerminal: true,
        terminalType: "partial",
        timeStamp: "03:20:00",
        situation: "Disabling SMB stopped lateral movement but broke file sharing across 40 clinical systems. Nurses couldn't access patient records. The fix took 3 hours. Targeted subnet isolation would have been more surgical.",
        outcome: "partial",
        message: "Lateral movement stopped but collateral damage to clinical operations was significant."
      },

      av_deployed: {
        id: "av_deployed",
        isTerminal: true,
        terminalType: "bad",
        timeStamp: "03:50:00",
        situation: "AV deployment took 25 minutes. During that time, ransomware spread to 22 more hosts. Modern ransomware regularly evades signature-based detection. Network segmentation should have been the priority.",
        outcome: "bad",
        message: "AV alone is insufficient for active ransomware. Network segmentation should have been the immediate response."
      },

      negotiated_ransom: {
        id: "negotiated_ransom",
        isTerminal: true,
        terminalType: "partial",
        timeStamp: "05:00:00",
        situation: "You negotiated the ransom to $800K. Payment was made. Partial decryption was provided. Two weeks later, the same group attacked again — you're now known as a paying target. FBI investigation reveals the group is a sanctioned entity, meaning the ransom payment may violate OFAC regulations.",
        outcome: "bad",
        message: "Ransom paid. Re-attack occurred. Potential OFAC sanctions violation for payment to sanctioned entity."
      },

      conditional_pay: {
        id: "conditional_pay",
        isTerminal: true,
        terminalType: "partial",
        timeStamp: "04:30:00",
        situation: "Backups were checked and found intact — ransom was not paid. However, the time spent evaluating the payment option delayed the backup restoration process by 2 hours. Systems were down longer than necessary.",
        outcome: "partial",
        message: "Correct final decision but time wasted evaluating ransom payment. Backup verification should have been immediate."
      }
    }
  }
};

  ,

  phishing_campaign: {
    id: "phishing_campaign",
    title: "The Phishing Campaign",
    subtitle: "Social Engineering Response",
    difficulty: "Medium",
    domain: "Threats, Attacks & Mitigations",
    estimatedTime: "8-12 min",
    intro: `It's Monday morning at FinVault, a financial services company. Your email security gateway just flagged a surge of inbound messages — 47 emails in 20 minutes, all targeting senior executives. The subject lines are convincing: "Q4 Board Report — Action Required" and "Wire Transfer Confirmation Needed." Your CEO's assistant just called asking if she should open an attachment that "looks totally legit."`,
    roles: "Security Analyst — FinVault Financial Services",
    stakes: "Executive credentials, wire transfer fraud, regulatory fines",

    nodes: {
      start: {
        id: "start",
        timeStamp: "08:14:32",
        threatLevel: 1,
        situation: "47 suspicious emails hit executive inboxes in 20 minutes. Your CEO's assistant is on the phone asking about an attachment. Your email gateway dashboard shows the emails originated from 'board-reports-finvault.com' — a domain registered yesterday.",
        question: "The CEO's assistant is waiting on the phone. What do you tell her?",
        choices: [
          { text: "Tell her to open it — it looks legitimate enough", next: "opened_attachment", outcome: "The attachment contained a macro-enabled document that installed a keylogger. The CEO's credentials are now compromised.", points: 0, isOptimal: false, tag: "❌ Critical Error" },
          { text: "Tell her to NOT open it and quarantine the email immediately", next: "quarantined_email", outcome: "Correct. You've protected the CEO's machine. Now you need to handle the broader campaign targeting all executives.", points: 30, isOptimal: true, tag: "✓ Optimal" },
          { text: "Tell her to forward it to IT for review first", next: "forwarded_it", outcome: "Better than opening it, but forwarding a potentially malicious attachment spreads the risk to IT's inbox.", points: 10, isOptimal: false, tag: "⚠️ Risky" },
          { text: "Ignore the call — focus on analyzing the gateway logs first", next: "ignored_call", outcome: "While you analyzed logs, the assistant opened the attachment herself. Credential compromise confirmed.", points: 5, isOptimal: false, tag: "❌ Too Slow" }
        ]
      },

      opened_attachment: {
        id: "opened_attachment",
        timeStamp: "08:18:00",
        threatLevel: 3,
        situation: "Keylogger installed on CEO's machine. Credentials captured and sent to attacker C&C. You need to act fast before the attacker uses the stolen credentials.",
        question: "CEO credentials are compromised. What is your IMMEDIATE action?",
        choices: [
          { text: "Disable the CEO's account and force password reset across all exec accounts", next: "accounts_disabled", outcome: "Fast and correct. Disabling the account before the attacker uses it may have limited damage.", points: 25, isOptimal: true, tag: "✓ Correct" },
          { text: "Wait and monitor to see if the attacker tries to log in", next: "waited_to_monitor", outcome: "While you watched, the attacker logged into the CEO's email and sent a fraudulent $250,000 wire transfer request to Finance.", points: 0, isOptimal: false, tag: "❌ Too Late" },
          { text: "Notify the CEO and let them change their own password", next: "ceo_self_reset", outcome: "The CEO is in a meeting. 20 minutes pass. The attacker used the credentials to access the VPN before the reset completed.", points: 10, isOptimal: false, tag: "⚠️ Too Slow" }
        ]
      },

      accounts_disabled: {
        id: "accounts_disabled",
        timeStamp: "08:22:00",
        threatLevel: 2,
        situation: "CEO account disabled. Now you need to handle the broader campaign. 47 executives received the email. Your gateway shows the domain 'board-reports-finvault.com' is still sending. You need to stop further emails from reaching inboxes.",
        question: "How do you stop the ongoing phishing campaign from reaching more users?",
        choices: [
          { text: "Block the sending domain at the email gateway and add it to the blocklist", next: "domain_blocked", outcome: "Correct. Blocking the domain stops new emails. But you should also check if any executives already clicked links.", points: 30, isOptimal: true, tag: "✓ Optimal" },
          { text: "Send a company-wide email warning everyone about the phishing attack", next: "broadcast_warning", outcome: "Good intent, but a broadcast email about a phishing attack can itself be mistaken for phishing. Use official communication channels instead.", points: 15, isOptimal: false, tag: "⚠️ Risky Method" },
          { text: "Delete all 47 emails from executive inboxes manually", next: "manual_delete", outcome: "Manual deletion takes too long and doesn't stop new emails from arriving. Use gateway-level blocking.", points: 10, isOptimal: false, tag: "⚠️ Inefficient" }
        ]
      },

      quarantined_email: {
        id: "quarantined_email",
        timeStamp: "08:16:45",
        threatLevel: 1,
        situation: "CEO's machine is safe. Now you analyze the phishing email headers. You find: the sending domain 'board-reports-finvault.com' was registered yesterday, the email fails DMARC validation, and the 'Reply-To' address is 'cfo@finvault-secure.net' — another fake domain.",
        question: "Which email authentication failure is MOST significant here?",
        choices: [
          { text: "DMARC failure — the domain is not authorized to send on behalf of finvault.com", next: "identified_dmarc", outcome: "Correct. DMARC (Domain-based Message Authentication) failure means the sending domain isn't authorized. This should have been caught and rejected automatically — time to review your DMARC policy.", points: 30, isOptimal: true, tag: "✓ Correct" },
          { text: "The reply-to address is suspicious", next: "reply_to_focus", outcome: "The reply-to is suspicious, but DMARC failure is the technical authentication indicator. The reply-to is a social engineering tactic.", points: 15, isOptimal: false, tag: "⚠️ Partial" },
          { text: "The domain was registered yesterday", next: "domain_age_focus", outcome: "New domains are suspicious but not an email authentication failure. DMARC is the definitive technical indicator here.", points: 15, isOptimal: false, tag: "⚠️ Partial" },
          { text: "All of the above equally", next: "identified_dmarc", outcome: "While all are red flags, DMARC failure is the primary authentication indicator. The others are supporting evidence.", points: 20, isOptimal: false, tag: "⚠️ Partially Correct" }
        ]
      },

      identified_dmarc: {
        id: "identified_dmarc",
        timeStamp: "08:20:10",
        threatLevel: 1,
        situation: "DMARC failure confirmed. You block the sending domain at the gateway. Finance just called — they received a follow-up email from 'ceo@finvault.com' (the real domain this time) asking for an urgent $180,000 wire transfer. The CFO is wondering if they should process it.",
        question: "An urgent wire transfer request came from what looks like the real CEO email. What is this?",
        choices: [
          { text: "Process it — it came from the legitimate CEO domain", next: "wire_processed", outcome: "The attacker compromised the CEO's actual email account through a previously successful phishing attempt. This is Business Email Compromise (BEC). $180,000 is gone.", points: 0, isOptimal: false, tag: "❌ BEC Successful" },
          { text: "This is Business Email Compromise (BEC) — verify via phone call to CEO directly", next: "bec_caught", outcome: "Excellent. BEC attacks use legitimate or compromised email accounts. Always verify large financial requests via a separate communication channel (phone call, in person).", points: 30, isOptimal: true, tag: "✓ Optimal" },
          { text: "Delay the transfer and escalate to your manager", next: "escalated_transfer", outcome: "Escalating is good, but calling the CEO directly to verify is faster and more definitive.", points: 15, isOptimal: false, tag: "⚠️ Slow but Safe" }
        ]
      },

      bec_caught: {
        id: "bec_caught",
        timeStamp: "08:28:00",
        threatLevel: 1,
        situation: "Wire transfer stopped. CEO confirms they never sent that request. The phishing campaign has been fully contained. Now you need to determine what your DMARC policy should have been set to in order to automatically reject these emails.",
        question: "What DMARC policy would have automatically REJECTED emails failing authentication?",
        choices: [
          { text: "p=none — monitor only", next: "dmarc_wrong", outcome: "p=none only monitors and reports — it doesn't reject or quarantine. This is what you had, which is why the emails got through.", points: 5, isOptimal: false, tag: "❌ Monitoring Only" },
          { text: "p=quarantine — send to spam folder", next: "dmarc_wrong", outcome: "p=quarantine sends failing emails to spam — better, but still delivered. p=reject is the strongest protection.", points: 15, isOptimal: false, tag: "⚠️ Better but Not Best" },
          { text: "p=reject — block failing emails entirely", next: "dmarc_final", outcome: "Correct. DMARC p=reject instructs receiving mail servers to reject emails that fail authentication. This would have stopped the phishing campaign entirely.", points: 30, isOptimal: true, tag: "✓ Correct" },
          { text: "DMARC cannot block emails, only SPF can", next: "dmarc_wrong", outcome: "Incorrect. DMARC works alongside SPF and DKIM and can enforce rejection of failing emails with p=reject policy.", points: 0, isOptimal: false, tag: "❌ Incorrect" }
        ]
      },

      dmarc_final: { id: "dmarc_final", isTerminal: true, terminalType: "good", timeStamp: "09:00:00", situation: "Campaign stopped. Wire transfer blocked. DMARC policy updated to p=reject. Security awareness training scheduled for all executives. Incident report filed.", outcome: "good", message: "Phishing campaign neutralized. BEC attempt blocked. DMARC hardened to p=reject." },
      dmarc_wrong: { id: "dmarc_wrong", isTerminal: true, terminalType: "partial", timeStamp: "09:00:00", situation: "Campaign contained but DMARC knowledge gap identified. Policy review scheduled.", outcome: "partial", message: "Campaign contained but email authentication concepts need review." },
      wire_processed: { id: "wire_processed", isTerminal: true, terminalType: "bad", timeStamp: "08:35:00", situation: "$180,000 wired to attacker account. Wire transfers are nearly impossible to reverse. FBI financial crimes unit notified. Regulatory disclosure required.", outcome: "bad", message: "BEC successful. $180,000 lost. Always verify wire transfers via phone." },
      domain_blocked: { id: "domain_blocked", isTerminal: true, terminalType: "good", timeStamp: "08:45:00", situation: "Domain blocked. No further phishing emails delivered. All exec accounts audited. Security awareness training scheduled.", outcome: "good", message: "Campaign blocked. Domain quarantined. No credential compromise." },
      forwarded_it: { id: "forwarded_it", isTerminal: true, terminalType: "partial", timeStamp: "08:30:00", situation: "IT opened the forwarded attachment and got infected. Two machines now compromised instead of zero.", outcome: "partial", message: "Never forward suspicious attachments. Quarantine them instead." },
      ignored_call: { id: "ignored_call", isTerminal: true, terminalType: "bad", timeStamp: "08:25:00", situation: "Assistant opened the attachment. CEO credentials compromised while you were analyzing logs.", outcome: "bad", message: "Active human risk always takes priority over passive log analysis." },
      waited_to_monitor: { id: "waited_to_monitor", isTerminal: true, terminalType: "bad", timeStamp: "08:40:00", situation: "$250,000 wire transfer fraudulently initiated from CEO's compromised email before you acted.", outcome: "bad", message: "Monitoring confirmed credentials were stolen. Disable compromised accounts immediately." },
      ceo_self_reset: { id: "ceo_self_reset", isTerminal: true, terminalType: "partial", timeStamp: "08:38:00", situation: "CEO was in a meeting. VPN accessed by attacker before reset completed. Limited damage but avoidable.", outcome: "partial", message: "IT should disable accounts directly — don't rely on users to self-remediate." },
      broadcast_warning: { id: "broadcast_warning", isTerminal: true, terminalType: "partial", timeStamp: "08:30:00", situation: "Warning sent. Three employees thought the warning itself was phishing and reported it, causing confusion. Gateway blocking would have been cleaner.", outcome: "partial", message: "Use official IT communication channels for security alerts, not ad-hoc broadcasts." },
      manual_delete: { id: "manual_delete", isTerminal: true, terminalType: "partial", timeStamp: "08:35:00", situation: "Manual deletion took 18 minutes. 6 more phishing emails arrived during that time. Gateway-level blocking is always faster.", outcome: "partial", message: "Always use automated gateway controls. Manual remediation doesn't scale." },
      reply_to_focus: { id: "reply_to_focus", isTerminal: true, terminalType: "partial", timeStamp: "08:30:00", situation: "Reply-to flagged and blocked. DMARC gap remains unaddressed for future attacks.", outcome: "partial", message: "DMARC failure is the key technical indicator — it's the authentication system designed for this." },
      domain_age_focus: { id: "domain_age_focus", isTerminal: true, terminalType: "partial", timeStamp: "08:30:00", situation: "New domain flagged. Useful signal but not a definitive authentication control like DMARC.", outcome: "partial", message: "Domain age is a heuristic. DMARC is the authoritative email authentication control." },
      escalated_transfer: { id: "escalated_transfer", isTerminal: true, terminalType: "good", timeStamp: "08:35:00", situation: "Transfer delayed, escalated, CEO called. Wire transfer blocked. Slower path but correct outcome.", outcome: "good", message: "Transfer blocked. Next time call CEO directly — faster and more definitive." }
    }
  },

  insider_threat: {
    id: "insider_threat",
    title: "The Insider Threat",
    subtitle: "Access Controls & Monitoring",
    difficulty: "Medium",
    domain: "Identity, Access & Architecture",
    estimatedTime: "8-12 min",
    intro: `You're the Security Engineer at DataVault Corp, a cloud storage company. Your SIEM flagged unusual behavior from Marcus Chen, a Senior Database Administrator who gave notice 3 weeks ago and leaves in 4 days. Over the past week, SIEM shows he's accessed 3x his normal data volume, run unusual bulk export queries, and connected to the VPN at 2AM twice. HR has flagged him as "hostile to management" after a compensation dispute.`,
    roles: "Security Engineer — DataVault Corp",
    stakes: "Intellectual property, customer data, trade secrets",

    nodes: {
      start: {
        id: "start",
        timeStamp: "14:05:17",
        threatLevel: 2,
        situation: "SIEM alert: Marcus Chen, DBA with 4 days remaining, has accessed 3x normal data volume this week, run bulk export queries on the customer database, and connected to VPN at 2AM on two occasions. He still has full DBA privileges.",
        question: "What is your FIRST step when investigating a potential insider threat?",
        choices: [
          { text: "Immediately revoke all of Marcus's access rights", next: "revoked_immediately", outcome: "Revoking access tipped Marcus off. He noticed within minutes and called HR claiming discrimination. Without documented evidence, your company is now exposed to a wrongful termination lawsuit.", points: 5, isOptimal: false, tag: "⚠️ Premature" },
          { text: "Confront Marcus directly and ask what he's been doing", next: "confronted_marcus", outcome: "Confronting Marcus without evidence or HR present was a mistake. He denied everything, deleted several files before IT could stop him, and lawyered up.", points: 0, isOptimal: false, tag: "❌ Critical Error" },
          { text: "Escalate to HR and Legal, collect evidence quietly before acting", next: "escalated_hr_legal", outcome: "Correct. Insider threat investigations require HR and Legal involvement before any action. Collecting evidence first prevents tipping off the subject and protects the company legally.", points: 30, isOptimal: true, tag: "✓ Optimal" },
          { text: "Ignore it — he's leaving in 4 days anyway", next: "ignored_threat", outcome: "Marcus exfiltrated the entire customer database and source code repository in his final 4 days. The data appeared on a competitor's systems 2 weeks later.", points: 0, isOptimal: false, tag: "❌ Critical Error" }
        ]
      },

      escalated_hr_legal: {
        id: "escalated_hr_legal",
        timeStamp: "14:22:00",
        threatLevel: 2,
        situation: "HR and Legal are now involved. Legal counsel advises covert monitoring is permitted. You review Marcus's activity logs for the past 30 days. You find he's exported 47GB of data — 40x his historical baseline. The exports went to an external USB device connected to his workstation.",
        question: "You've confirmed 47GB was copied to a USB drive. What monitoring should you have had in place to PREVENT this?",
        choices: [
          { text: "DLP (Data Loss Prevention) with USB write blocking for sensitive data", next: "dlp_identified", outcome: "Correct. DLP policies can block or alert on unauthorized USB transfers of sensitive data. This is a key preventive control that should have flagged or blocked this exfiltration.", points: 30, isOptimal: true, tag: "✓ Correct" },
          { text: "Antivirus software on all workstations", next: "av_wrong", outcome: "AV detects malware, not authorized users copying files. DLP is the right control for data exfiltration prevention.", points: 5, isOptimal: false, tag: "❌ Wrong Control" },
          { text: "Firewalls blocking outbound traffic", next: "firewall_wrong", outcome: "Firewalls wouldn't stop a USB transfer — the data never went over the network. DLP with endpoint controls is the right answer.", points: 5, isOptimal: false, tag: "❌ Wrong Control" },
          { text: "Background checks during hiring", next: "bg_check_wrong", outcome: "Background checks are a hiring control, not a preventive control for exfiltration. DLP addresses the technical gap.", points: 0, isOptimal: false, tag: "❌ Wrong Phase" }
        ]
      },

      dlp_identified: {
        id: "dlp_identified",
        timeStamp: "14:45:00",
        threatLevel: 2,
        situation: "DLP gap documented. Legal has enough evidence to act. Now HR wants to know how to handle Marcus's remaining access for his last 4 days. You need to balance operational needs (he's transitioning projects) with security risk.",
        question: "How should Marcus's access be managed for his final 4 days?",
        choices: [
          { text: "Keep full access — he needs it to complete handover documentation", next: "kept_full_access", outcome: "Marcus copied three more project repositories on day 3. Full access during notice period for a hostile employee with confirmed exfiltration history was a serious mistake.", points: 0, isOptimal: false, tag: "❌ Critical Error" },
          { text: "Apply least privilege — limit to only what's needed for handover, remove DBA rights", next: "least_privilege", outcome: "Correct. Least privilege applied during the offboarding period. Marcus can complete handover documentation without DBA-level database access.", points: 30, isOptimal: true, tag: "✓ Optimal" },
          { text: "Terminate immediately with security escort", next: "immediate_termination", outcome: "Legal advises this is possible given the evidence, but immediate termination without completing handover may disrupt critical systems Marcus maintains.", points: 15, isOptimal: false, tag: "⚠️ Legally Risky" },
          { text: "Revoke VPN access only — keep local access", next: "vpn_only", outcome: "VPN access revoked but Marcus still had full local DBA rights. He ran another bulk export from his desk.", points: 5, isOptimal: false, tag: "❌ Insufficient" }
        ]
      },

      least_privilege: {
        id: "least_privilege",
        timeStamp: "15:10:00",
        threatLevel: 1,
        situation: "Access reduced to least privilege. Handover proceeding under monitoring. On Marcus's last day, the access revocation checklist is being completed. What is the MOST critical account to disable FIRST on his last day?",
        question: "Marcus's last day. Which account type is most critical to revoke FIRST?",
        choices: [
          { text: "His email account", next: "wrong_first_revoke", outcome: "Email is important but not the most dangerous. His privileged DBA/admin accounts have direct access to sensitive data and systems.", points: 10, isOptimal: false, tag: "⚠️ Not First Priority" },
          { text: "His privileged admin/DBA accounts", next: "correct_first_revoke", outcome: "Correct. Privileged accounts have the highest blast radius. Always revoke elevated privileges before standard accounts during offboarding.", points: 30, isOptimal: true, tag: "✓ Correct" },
          { text: "His VPN access", next: "wrong_first_revoke", outcome: "VPN is external access but his internal privileged accounts pose greater immediate risk. Revoke highest privilege first.", points: 10, isOptimal: false, tag: "⚠️ Not First Priority" },
          { text: "All simultaneously using an automated offboarding script", next: "automated_offboard", outcome: "Automated simultaneous revocation is actually best practice for offboarding. Minimizes the window between last day and full deprovisioning.", points: 25, isOptimal: false, tag: "✓ Also Good" }
        ]
      },

      correct_first_revoke: { id: "correct_first_revoke", isTerminal: true, terminalType: "good", timeStamp: "17:00:00", situation: "Privileged accounts revoked first. Full offboarding completed. Forensic evidence preserved. Legal case documented. DLP controls implemented to prevent recurrence.", outcome: "good", message: "Insider threat contained. Evidence collected. DLP gap closed. Offboarding process hardened." },
      automated_offboard: { id: "automated_offboard", isTerminal: true, terminalType: "good", timeStamp: "17:00:00", situation: "Automated offboarding executed simultaneously. All accounts revoked in seconds. Best practice implemented.", outcome: "good", message: "Automated offboarding is best practice. Zero window for last-minute exfiltration." },
      wrong_first_revoke: { id: "wrong_first_revoke", isTerminal: true, terminalType: "partial", timeStamp: "17:00:00", situation: "Offboarding completed but order of revocation left a brief window. No additional exfiltration occurred this time, but privileged accounts should always be first.", outcome: "partial", message: "Correct outcome but wrong priority order. Privileged accounts always first in offboarding." },
      revoked_immediately: { id: "revoked_immediately", isTerminal: true, terminalType: "partial", timeStamp: "14:30:00", situation: "Access revoked but without evidence documentation first. HR lawsuit risk is significant. Always collect evidence and involve Legal before acting on insider threat suspicions.", outcome: "partial", message: "Right instinct, wrong order. Collect evidence with Legal first, then act." },
      confronted_marcus: { id: "confronted_marcus", isTerminal: true, terminalType: "bad", timeStamp: "14:20:00", situation: "Marcus deleted evidence and lawyered up. The case is now legally complicated and much of the exfiltrated data is unrecoverable.", outcome: "bad", message: "Never confront an insider threat suspect directly. Evidence collection and HR/Legal must come first." },
      ignored_threat: { id: "ignored_threat", isTerminal: true, terminalType: "bad", timeStamp: "18:00:00", situation: "Full database and source code exfiltrated. Appeared on competitor systems 2 weeks later. Estimated $2M in damages.", outcome: "bad", message: "Departing employees with privileged access and behavioral red flags must be investigated immediately." },
      kept_full_access: { id: "kept_full_access", isTerminal: true, terminalType: "bad", timeStamp: "16:00:00", situation: "Three more repositories exfiltrated in final days. Full access to a confirmed hostile exfiltrator is never justified.", outcome: "bad", message: "Never retain full access for a hostile employee with confirmed exfiltration history." },
      immediate_termination: { id: "immediate_termination", isTerminal: true, terminalType: "partial", timeStamp: "15:00:00", situation: "Terminated immediately. Handover incomplete. Two critical database systems experienced issues because transition documentation was never completed.", outcome: "partial", message: "Immediate termination is sometimes right but must be balanced against operational continuity risk." },
      vpn_only: { id: "vpn_only", isTerminal: true, terminalType: "bad", timeStamp: "15:30:00", situation: "VPN revoked but local DBA rights remained. Another bulk export occurred from inside the office.", outcome: "bad", message: "Partial access revocation is dangerous. Remove all privileged access, not just remote access." },
      av_wrong: { id: "av_wrong", isTerminal: true, terminalType: "partial", timeStamp: "15:00:00", situation: "AV won't stop authorized users copying data. DLP is the correct preventive control.", outcome: "partial", message: "AV detects malware. DLP prevents data exfiltration by authorized users." },
      firewall_wrong: { id: "firewall_wrong", isTerminal: true, terminalType: "partial", timeStamp: "15:00:00", situation: "Firewalls don't stop USB transfers. Endpoint DLP is needed.", outcome: "partial", message: "Firewalls protect network boundaries. DLP protects against endpoint data exfiltration." },
      bg_check_wrong: { id: "bg_check_wrong", isTerminal: true, terminalType: "partial", timeStamp: "15:00:00", situation: "Background checks are pre-employment. DLP is the technical preventive control for exfiltration.", outcome: "partial", message: "Match controls to the phase: DLP for technical exfiltration prevention, background checks for hiring." }
    }
  },

  cloud_misconfiguration: {
    id: "cloud_misconfiguration",
    title: "Cloud Misconfiguration",
    subtitle: "Cloud Security & Data Exposure",
    difficulty: "Medium",
    domain: "Architecture & Implementation",
    estimatedTime: "8-12 min",
    intro: `It's Thursday afternoon at RetailNow, an e-commerce company. A security researcher just emailed your team — they've discovered a publicly accessible AWS S3 bucket named 'retailnow-customer-backup-2024' containing what appears to be customer order data including names, addresses, and partial payment info. They've given you 48 hours before they publish their findings. Your social media team just spotted the bucket URL appearing in a Reddit thread titled "Found something interesting..."`,
    roles: "Cloud Security Engineer — RetailNow E-Commerce",
    stakes: "Customer PII, payment data, regulatory fines, brand reputation",

    nodes: {
      start: {
        id: "start",
        timeStamp: "15:44:09",
        threatLevel: 2,
        situation: "A public S3 bucket with customer data has been discovered by a security researcher AND is spreading on Reddit. You have 48 hours before the researcher publishes. The Reddit thread has 47 upvotes and growing.",
        question: "What is your FIRST action?",
        choices: [
          { text: "Make the S3 bucket private immediately", next: "bucket_private", outcome: "Correct first move. Closing the exposure stops new access. Now you need to assess what was already accessed.", points: 30, isOptimal: true, tag: "✓ Optimal" },
          { text: "Post on Reddit asking people not to share the link", next: "posted_reddit", outcome: "Engaging on Reddit drew more attention. The thread now has 300 upvotes. The Streisand Effect made it worse.", points: 0, isOptimal: false, tag: "❌ Streisand Effect" },
          { text: "Contact the security researcher to understand the full scope first", next: "contacted_researcher", outcome: "Reasonable but the bucket is still public while you wait for a response. Close the exposure first, then scope.", points: 15, isOptimal: false, tag: "⚠️ Bucket Still Open" },
          { text: "Notify customers immediately before doing anything else", next: "notified_customers_first", outcome: "Customer notification before you understand the scope means you may send incorrect information. Remediate first, then notify accurately.", points: 10, isOptimal: false, tag: "⚠️ Wrong Order" }
        ]
      },

      bucket_private: {
        id: "bucket_private",
        timeStamp: "15:47:00",
        threatLevel: 2,
        situation: "Bucket is now private. You check S3 access logs. The bucket was publicly accessible for 23 days. During that time: 14,847 unique IPs accessed it, 2.3GB of data was downloaded, and the data includes names, addresses, emails, and last-4 of payment cards for 52,000 customers.",
        question: "52,000 customers' data was exposed for 23 days. Under most US state breach notification laws, when must customers be notified?",
        choices: [
          { text: "Within 30-90 days depending on state law", next: "notification_correct", outcome: "Correct. Most US state breach notification laws require notification within 30-90 days of discovering a breach. Some states like California (30 days) are stricter than others.", points: 30, isOptimal: true, tag: "✓ Correct" },
          { text: "Within 24 hours", next: "notification_wrong", outcome: "24 hours is not a standard US state requirement (that's closer to GDPR's 72-hour supervisory authority notification). US state laws typically allow 30-90 days.", points: 5, isOptimal: false, tag: "❌ Incorrect" },
          { text: "Notification is optional if data wasn't encrypted", next: "notification_wrong2", outcome: "Lack of encryption doesn't make notification optional — it often makes it mandatory. Many state laws require notification specifically when unencrypted data is exposed.", points: 0, isOptimal: false, tag: "❌ Incorrect" },
          { text: "Only if customers ask about it", next: "notification_wrong", outcome: "Breach notification is a legal requirement, not optional customer service. Proactive notification is required by law.", points: 0, isOptimal: false, tag: "❌ Incorrect" }
        ]
      },

      notification_correct: {
        id: "notification_correct",
        timeStamp: "16:10:00",
        threatLevel: 2,
        situation: "Legal team engaged. Now you need to investigate the ROOT CAUSE. How did this bucket become public? You check AWS CloudTrail logs and find: 23 days ago, a junior developer ran 'aws s3api put-bucket-acl --bucket retailnow-customer-backup-2024 --acl public-read' while setting up a demo environment. They copied the command from a StackOverflow post without understanding it.",
        question: "What technical control would have PREVENTED this misconfiguration?",
        choices: [
          { text: "AWS S3 Block Public Access setting at the account level", next: "correct_control", outcome: "Correct. AWS S3 Block Public Access is an account-level setting that prevents any bucket from being made public, overriding individual bucket ACLs. This is a critical preventive control.", points: 30, isOptimal: true, tag: "✓ Optimal" },
          { text: "Better developer training", next: "training_only", outcome: "Training is important but not a technical control. Human error is inevitable — you need technical guardrails that make misconfigurations impossible or trigger alerts.", points: 10, isOptimal: false, tag: "⚠️ Not Technical" },
          { text: "Antivirus on the developer's workstation", next: "av_irrelevant", outcome: "AV detects malware — it has no relevance to S3 bucket ACL misconfigurations.", points: 0, isOptimal: false, tag: "❌ Irrelevant" },
          { text: "A stronger password policy for AWS accounts", next: "password_irrelevant", outcome: "Password strength doesn't prevent authorized users from making configuration mistakes.", points: 0, isOptimal: false, tag: "❌ Irrelevant" }
        ]
      },

      correct_control: {
        id: "correct_control",
        timeStamp: "16:30:00",
        threatLevel: 1,
        situation: "Root cause identified. S3 Block Public Access now enabled at account level. Security researcher replied positively and agreed not to publish given your fast response. Now your CISO asks: going forward, what process should catch misconfigurations BEFORE they reach production?",
        question: "What ongoing process best catches cloud misconfigurations before they cause incidents?",
        choices: [
          { text: "CSPM — Cloud Security Posture Management tools that continuously scan for misconfigurations", next: "cspm_final", outcome: "Correct. CSPM tools continuously monitor cloud environments for misconfigurations, policy violations, and compliance gaps — catching issues before they become incidents.", points: 30, isOptimal: true, tag: "✓ Optimal" },
          { text: "Manual monthly security audits", next: "manual_audit", outcome: "Monthly audits catch issues too slowly. Cloud environments change constantly — automated continuous monitoring is essential.", points: 10, isOptimal: false, tag: "⚠️ Too Slow" },
          { text: "Penetration testing quarterly", next: "pentest_slow", outcome: "Pentests are valuable but quarterly cadence is too slow for cloud misconfiguration detection. CSPM provides continuous coverage.", points: 15, isOptimal: false, tag: "⚠️ Too Infrequent" },
          { text: "Restrict all developers from cloud console access", next: "too_restrictive", outcome: "Overly restrictive — developers need console access. Preventive controls (Block Public Access) and detective controls (CSPM) are the right balance.", points: 5, isOptimal: false, tag: "⚠️ Too Restrictive" }
        ]
      },

      cspm_final: { id: "cspm_final", isTerminal: true, terminalType: "good", timeStamp: "17:30:00", situation: "CSPM deployed. S3 Block Public Access enabled. Customers notified within legal timelines. Security researcher credited. Incident turned into a security improvement opportunity.", outcome: "good", message: "Excellent response. Exposure closed fast, root cause fixed, CSPM implemented for ongoing protection." },
      manual_audit: { id: "manual_audit", isTerminal: true, terminalType: "partial", timeStamp: "17:30:00", situation: "Monthly audits scheduled but CSPM would catch misconfigurations in real time. Next misconfiguration may not be caught for 30 days.", outcome: "partial", message: "Manual audits are better than nothing but CSPM provides continuous automated protection." },
      pentest_slow: { id: "pentest_slow", isTerminal: true, terminalType: "partial", timeStamp: "17:30:00", situation: "Quarterly pentests valuable but insufficient for cloud monitoring frequency.", outcome: "partial", message: "Pentests and CSPM serve different purposes. CSPM for continuous misconfiguration detection." },
      too_restrictive: { id: "too_restrictive", isTerminal: true, terminalType: "partial", timeStamp: "17:30:00", situation: "Restricting console access slowed development velocity significantly with minimal security gain.", outcome: "partial", message: "Balance security with usability. Preventive and detective controls beat blanket restrictions." },
      posted_reddit: { id: "posted_reddit", isTerminal: true, terminalType: "bad", timeStamp: "16:00:00", situation: "Streisand Effect. Thread went viral. 15,000 views. National tech press picked it up. Bucket still public for another 2 hours during the chaos.", outcome: "bad", message: "Never engage with public exposure threads — it amplifies attention. Close the bucket first, always." },
      contacted_researcher: { id: "contacted_researcher", isTerminal: true, terminalType: "partial", timeStamp: "16:00:00", situation: "Bucket remained public for 45 more minutes while awaiting researcher response. Additional 800 IPs accessed the data.", outcome: "partial", message: "Close the exposure FIRST. Scoping and investigation come after the immediate risk is mitigated." },
      notified_customers_first: { id: "notified_customers_first", isTerminal: true, terminalType: "partial", timeStamp: "16:00:00", situation: "Notifications sent with incomplete information. Had to send a correction email, causing confusion and additional reputational damage.", outcome: "partial", message: "Remediate and scope first, then notify accurately. Inaccurate notifications can be worse than delayed ones." },
      notification_wrong: { id: "notification_wrong", isTerminal: true, terminalType: "partial", timeStamp: "16:30:00", situation: "Notification timeline misunderstood. Legal team corrected the plan. 30-90 days is the US standard — not 24 hours (that's GDPR).", outcome: "partial", message: "Know your jurisdiction. GDPR = 72hrs to authorities. US state laws = 30-90 days to individuals." },
      notification_wrong2: { id: "notification_wrong2", isTerminal: true, terminalType: "bad", timeStamp: "16:30:00", situation: "Failure to notify resulted in regulatory action. Most US state laws mandate notification for unencrypted PII breaches regardless of other factors.", outcome: "bad", message: "Breach notification is a legal requirement. Unencrypted data exposure typically triggers mandatory notification." },
      training_only: { id: "training_only", isTerminal: true, terminalType: "partial", timeStamp: "16:45:00", situation: "Training improved but another misconfiguration occurred 3 months later. Technical controls prevent what training cannot.", outcome: "partial", message: "Training + technical controls. S3 Block Public Access makes public buckets impossible — training alone doesn't." },
      av_irrelevant: { id: "av_irrelevant", isTerminal: true, terminalType: "bad", timeStamp: "16:45:00", situation: "AV has no relevance to cloud configuration management.", outcome: "bad", message: "Match controls to threats. AV ≠ cloud misconfiguration prevention." },
      password_irrelevant: { id: "password_irrelevant", isTerminal: true, terminalType: "bad", timeStamp: "16:45:00", situation: "Password policy doesn't prevent authorized users from misconfiguring resources.", outcome: "bad", message: "Password policies prevent unauthorized access. CSPM and Block Public Access prevent misconfigurations." }
    }
  }
};

// Scoring bands
const SCORE_BANDS = {
  optimal: { min: 85, label: "Elite Analyst", color: "#00f5a0", desc: "Outstanding. You followed best practices at every critical decision point." },
  good:    { min: 65, label: "Competent Analyst", color: "#00d4ff", desc: "Solid performance. A few suboptimal choices but you contained the incident." },
  partial: { min: 40, label: "Junior Analyst", color: "#ffd32a", desc: "You got there eventually, but costly mistakes along the way." },
  poor:    { min: 0,  label: "Needs Training", color: "#ff4757", desc: "Critical failures allowed the incident to spiral. Review IR fundamentals." }
};
