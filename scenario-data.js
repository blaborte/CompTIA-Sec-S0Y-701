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

// Scoring bands
const SCORE_BANDS = {
  optimal: { min: 85, label: "Elite Analyst", color: "#00f5a0", desc: "Outstanding. You followed best practices at every critical decision point." },
  good:    { min: 65, label: "Competent Analyst", color: "#00d4ff", desc: "Solid performance. A few suboptimal choices but you contained the incident." },
  partial: { min: 40, label: "Junior Analyst", color: "#ffd32a", desc: "You got there eventually, but costly mistakes along the way." },
  poor:    { min: 0,  label: "Needs Training", color: "#ff4757", desc: "Critical failures allowed the incident to spiral. Review IR fundamentals." }
};
