/**
 * CENTRAL CONFIGURATION FOR ZYNTRA '26
 * Flagship Inter-College Technology Festival
 * Sapthagiri NPS University, Bengaluru
 * Theme: NEURAL HORIZONS: Where Minds Meet Machines
 */

export const festConfig = {
  // BRANDING IDENTIFIER
  branding: {
    name: "ZYNTRA '26",
    shortName: "ZYNTRA",
    edition: "'26",
    suffix: "NEURAL HORIZONS",
    tagline: "Neural Horizons: Where Minds Meet Machines",
    subHeading: "Flagship Inter-College Technology Festival",
    protocolVersion: "27-28 NOVEMBER 2026",
    college: "Sapthagiri NPS University",
    university: "Sapthagiri NPS University, Bengaluru",
    location: "SAPTHAGIRI NPS UNIVERSITY // BENGALURU HUB, Karnataka - 560057",
    targetDate: "2026-11-27T09:00:00+05:30",
    datesDisplay: "27-28 NOVEMBER 2026",
    brochureUrl: "#",
    logoThumb: "https://drive.google.com/thumbnail?id=1aZzUqQDGO6C_xB0cX5tciWlYMy8MJpLU&sz=w200",
    headerBanner: "https://drive.google.com/thumbnail?id=1Mtv6ZTF5sjTeHU48Ai7CO7AKCST7l8hk&sz=w1000",
    hero: {
      status: "ZYNTRA PROTOCOL ESTABLISHED // SAPTHAGIRI NPS UNIVERSITY",
      countdownLabel: "Countdown To Ignition",
      exploreBtn: "EXPLORE EVENTS",
      timelineBtn: "DOWNLOAD BROCHURE",
      location: "SAPTHAGIRI NPS UNIVERSITY, BENGALURU",
      dates: "27-28 NOVEMBER 2026",
      protocol: "ZYNTRA V26",
    },
    about: {
      title: "THE",
      subtitle: "ZYNTRA '26",
      description:
        "ZYNTRA '26 is the premier annual inter-college technology festival organized by Sapthagiri NPS University, Bengaluru. A two-day high-octane proving ground where Minds Meet Machines, featuring intense national hackathons, robotic deathmatches, cybersecurity cyber warfare, and frontier AI symposiums.",
      tags: ["Competitions", "Hackathons", "Keynotes", "Exhibitions"],
      vitals: [
        { label: "Location", value: "Sapthagiri NPS University" },
        { label: "Timeline", value: "27-28 November" },
        { label: "Protocol", value: "Zyntra'26" },
        { label: "Price Pool", value: "₹350000+" },
      ],
    },
    contact: {
      email: "zyntrasnpsu@gmail.com",
      alternateEmail: "zyntrasnpsu@email.com",
      website: "https://www.sapthagiri.edu.in/",
      instagram: "https://www.instagram.com/zyntra.snpsu?psln=MWFuNmExYng4NmsyYQ%3D%3D",
      instagramHandle: "@zyntra.snpsu",
      location: "Sapthagiri NPS University // Bengaluru Hub\nHesaraghatta Main Road, Bengaluru, Karnataka - 560057",
      directions: "https://maps.google.com/?q=Sapthagiri+NPS+University+Bengaluru",
    },
    footerNote: "Sapthagiri NPS University // Annual Technical Festival",
    copyright: "© 2026 // ZYNTRA COMMITTEE // SAPTHAGIRI NPS UNIVERSITY",
  },

  // NAV LINKS
  navLinks: [
    { label: "Home", href: "#hero" },
    { label: "About", href: "#about" },
    { label: "Events", href: "#events" },
    { label: "Schedule", href: "#schedule" },
    { label: "Committee", href: "#committee" },
    { label: "Partners", href: "#logos" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#contact" },
  ],

  // EVENT CATEGORIES
  categories: [
    { id: "All", name: "ALL" },
    { id: "Technical", name: "TECHNICAL" },
    { id: "Hackathon", name: "HACKATHON" },
    { id: "Quiz", name: "QUIZ" },
    { id: "Fun", name: "FUN" },
    { id: "Workshop", name: "WORKSHOP" },
  ],

  // DEPARTMENTS AT SAPTHAGIRI NPS UNIVERSITY
  departments: [
    "CSE",
    "ISE",
    "ECE",
    "ME",
    "AI & DS",
    "Cyber Security",
    "Biotechnology",
  ],

  // EVENTS ARCHIVE
  events: [
    {
      id: "code-nova-36h",
      name: "CodeNova: 36H Flagship Hackathon",
      category: "Hackathon",
      department: "CSE",
      summary: "Build production-grade systems in 36 continuous hours across Agentic AI, Autonomous Mobility, and Web3.",
      description:
        "The marquee hackathon of ZYNTRA '26 at Sapthagiri NPS University. Gather your team to build real-world solutions evaluated directly by top startup CTOs, venture mentors, and cloud architects.",
      date: "27-28 Nov",
      start_time: "10:00 AM",
      venue: "Sir M.V. Computing Complex, 3rd Floor",
      prize: "₹1,00,000 Pool",
      teamSize: "2 - 4 Members",
      is_registration_open: true,
      image: "https://picsum.photos/seed/hackathon/800/600",
      rules: [
        "Teams must comprise between 2 and 4 registered college students.",
        "36 hours continuous on-campus hacking with mentor checkpoints.",
        "Judging based on technical depth, originality, UI polish, and functional demo.",
        "All code must be authored inside the hackathon window; open-source libraries allowed.",
      ],
      coordinators: {
        faculty: [{ name: "Dr. K. S. Raghuram", contact: "+91 98450 44221" }],
        student: [{ name: "Prajwal Gowda", contact: "+91 99160 55332" }],
      },
    },
    {
      id: "robowars-arena",
      name: "RoboWars: Steel Carnage Arena",
      category: "Technical",
      department: "ME",
      summary: "Metal vs. metal in a reinforced combat cage with spinning blades, flippers, and pneumatic crushers.",
      description:
        "Custom combat bots battle for mechanical dominance in a polycarbonate bulletproof arena on the Sapthagiri campus. Weight classes: 15kg & 30kg with live crowd projection.",
      date: "27-28 Nov",
      start_time: "11:30 AM",
      venue: "Open Quadrangle Arena",
      prize: "₹65,000 Pool",
      teamSize: "3 - 5 Members",
      is_registration_open: true,
      image: "https://picsum.photos/seed/robowars/800/600",
      rules: [
        "Bots must adhere strictly to weight category (15kg / 30kg) and size bounding box.",
        "Wireless fail-safe radio systems mandatory with master power kill switch.",
        "Flame weapons and liquid projectiles strictly prohibited.",
        "Round duration: 3 minutes active combat judging on aggression, damage, and control.",
      ],
      coordinators: {
        faculty: [{ name: "Dr. B. S. Prakash", contact: "+91 97420 11223" }],
        student: [{ name: "Chetan Kumar", contact: "+91 98860 88774" }],
      },
    },
    {
      id: "algo-strike",
      name: "AlgoStrike: Speed Competitive Coding",
      category: "Technical",
      department: "ISE",
      summary: "Fast-paced competitive programming showdown testing algorithmic speed, dynamic programming, and data structures.",
      description:
        "Battle against time and peers in an ICPC-style contest. Solve algorithmic puzzles under strict runtime and memory limits.",
      date: "28 Nov",
      start_time: "09:30 AM",
      venue: "Turing Lab 204",
      prize: "₹35,000 Pool",
      teamSize: "Solo / Duo",
      is_registration_open: true,
      image: "https://picsum.photos/seed/coding/800/600",
      rules: [
        "Individual or dual participant formats permitted.",
        "Supported languages: C++, Java, Python 3.",
        "Strict penalty scoring for incorrect submissions.",
        "Plagiarism detection algorithms run automatically on all submitted solutions.",
      ],
      coordinators: {
        faculty: [{ name: "Prof. Sumathi R.", contact: "+91 94480 33445" }],
        student: [{ name: "Shreya Bhat", contact: "+91 96110 99887" }],
      },
    },
    {
      id: "zero-day-ctf",
      name: "Zero-Day: National CTF Cyber Warfare",
      category: "Technical",
      department: "Cyber Security",
      summary: "High-octane Capture The Flag challenge across binary exploitation, web security, reverse engineering, and cryptography.",
      description:
        "Infiltrate sandboxed servers, crack cryptographic primitives, reverse-engineer obfuscated binaries, and capture forensic flags before competitors do.",
      date: "27 Nov",
      start_time: "02:00 PM",
      venue: "Cyber Defense Center, Lab 3",
      prize: "₹50,000 Pool",
      teamSize: "2 - 3 Members",
      is_registration_open: true,
      image: "https://picsum.photos/seed/cyber/800/600",
      rules: [
        "Attack platforms restricted to provided virtual testbed subnets.",
        "Attacking scoreboard infrastructure or fellow teams' machines leads to disqualification.",
        "Flag format: ZYN26{flag_hash_here}.",
        "Dynamic flag point degradation active during competition.",
      ],
      coordinators: {
        faculty: [{ name: "Prof. Murali Krishna", contact: "+91 93410 77889" }],
        student: [{ name: "Rishabh Shetty", contact: "+91 97310 44556" }],
      },
    },
    {
      id: "neuro-quiz",
      name: "NeuroQuiz: National Tech & AI Quiz",
      category: "Quiz",
      department: "AI & DS",
      summary: "The ultimate trivia battle spanning tech history, silicon architectures, AI frontiers, science pop culture, and patents.",
      description:
        "High-energy multi-round technical quiz conducted by prominent quizmasters. Includes written buzzer prelims followed by intense audio-visual stage finals.",
      date: "27 Nov",
      start_time: "03:30 PM",
      venue: "Aryabhata Auditorium",
      prize: "₹25,000 Pool",
      teamSize: "Teams of 2",
      is_registration_open: true,
      image: "https://picsum.photos/seed/quiz/800/600",
      rules: [
        "Teams of 2 members from recognized educational institutions.",
        "Top 6 teams from preliminary written round qualify for main stage buzzer rounds.",
        "Quizmaster's ruling is absolute and final.",
      ],
      coordinators: {
        faculty: [{ name: "Dr. Anupama H. S.", contact: "+91 98450 66778" }],
        student: [{ name: "Varun Reddy", contact: "+91 99000 33221" }],
      },
    },
    {
      id: "aero-drone-sprint",
      name: "AeroSprint: FPV Drone Obstacle Derby",
      category: "Technical",
      department: "ECE",
      summary: "Navigate illuminated multi-level obstacle courses in high-speed FPV and autonomous drone trials.",
      description:
        "Pilots navigate illuminated gates, slalom pillars, and tight air tunnels while competing against the clock in this adrenaline-fueled drone trial on campus.",
      date: "28 Nov",
      start_time: "11:00 AM",
      venue: "University Sports Arena",
      prize: "₹40,000 Pool",
      teamSize: "2 - 4 Members",
      is_registration_open: true,
      image: "https://picsum.photos/seed/drone/800/600",
      rules: [
        "Quads must pass optical and radio frequency inspection prior to gate trials.",
        "Propeller safety guards mandatory during testing sessions.",
        "Scoring based on lap completion time and gate passage accuracy penalties.",
      ],
      coordinators: {
        faculty: [{ name: "Prof. Sandeep Kumar", contact: "+91 94490 88990" }],
        student: [{ name: "Deepak S.", contact: "+91 95350 22110" }],
      },
    },
    {
      id: "esports-nexus",
      name: "LAN Nexus: Valorant & BGMI Derby",
      category: "Fun",
      department: "CSE",
      summary: "Intense 5v5 competitive gaming tournament in Valorant and BGMI with live spectator caster commentary.",
      description:
        "Premier inter-college esports tournament hosted in an ambient high-refresh esports arena with spectator projection and official caster streams.",
      date: "28 Nov",
      start_time: "01:30 PM",
      venue: "Indoor Auditorium Gaming Zone",
      prize: "₹30,000 Pool",
      teamSize: "Teams of 5",
      is_registration_open: true,
      image: "https://picsum.photos/seed/gaming/800/600",
      rules: [
        "Standard competitive 5v5 rulesets with official tournament map vetoes.",
        "Personal peripherals allowed subject to driver pre-check.",
        "Unsportsmanlike conduct results in immediate forfeit.",
      ],
      coordinators: {
        faculty: [{ name: "Prof. Kiran Kumar", contact: "+91 97410 44556" }],
        student: [{ name: "Harsha Vardhan", contact: "+91 98440 66778" }],
      },
    },
    {
      id: "gen-ai-masterclass",
      name: "Agentic AI & LLMs Hands-On Workshop",
      category: "Workshop",
      department: "AI & DS",
      summary: "Hands-on masterclass on building autonomous multi-agent systems, LangGraph, and edge inference.",
      description:
        "Led by senior AI research scientists from Bengaluru tech companies. Participants get hands-on experience deploying functional AI agent swarms.",
      date: "27 Nov",
      start_time: "05:00 PM",
      venue: "Aryabhata Seminar Hall 2",
      prize: "Certificates & Cloud Grants",
      teamSize: "Individual Registration",
      is_registration_open: true,
      image: "https://picsum.photos/seed/workshop/800/600",
      rules: [
        "Open to all participants; laptops required with Python 3 environment.",
        "Hands-on exercises with verified digital certification from organizers.",
      ],
      coordinators: {
        faculty: [{ name: "Dr. Rohini Sharma", contact: "+91 99800 22334" }],
        student: [{ name: "Ananya Dixit", contact: "+91 98800 77889" }],
      },
    },
  ],

  // COMMITTEE DATA (Sapthagiri NPS University Leadership & Student Body)
  committee: [
    {
      id: "comm-1",
      name: "Dr. H. Ramakrishna",
      role: "Chief Patron",
      team: "FEST Coordinators",
      department: "Vice Chancellor, Sapthagiri NPS University",
      phone: "+91 80 2837 2800",
      email: "vc@sapthagiri.edu.in",
    },
    {
      id: "comm-2",
      name: "Dr. B. C. Shanthappa",
      role: "Faculty Chair",
      team: "FEST Coordinators",
      department: "Registrar, Sapthagiri NPS University",
      phone: "+91 80 2837 2801",
      email: "registrar@sapthagiri.edu.in",
    },
    {
      id: "comm-3",
      name: "Dr. K. S. Raghuram",
      role: "FEST Convener",
      team: "FEST Coordinators",
      department: "Dean & HOD, Computer Science & Engineering",
      phone: "+91 98450 44221",
      email: "dean_cse@sapthagiri.edu.in",
    },
    {
      id: "comm-4",
      name: "Prajwal Gowda",
      role: "Student President",
      team: "Core team",
      department: "Dept. of Computer Science & Engineering",
      phone: "+91 99160 55332",
      email: "prajwal.zyntra@sapthagiri.edu.in",
    },
    {
      id: "comm-5",
      name: "Rohan V. Rao",
      role: "Technical Head",
      team: "Core team",
      department: "Dept. of Information Science & Engineering",
      phone: "+91 98860 11992",
      email: "rohan.zyntra@sapthagiri.edu.in",
    },
    {
      id: "comm-6",
      name: "Sneha Manjunath",
      role: "Operations Head",
      team: "Core team",
      department: "Dept. of Electronics & Communication",
      phone: "+91 97420 33445",
      email: "sneha.zyntra@sapthagiri.edu.in",
    },
    {
      id: "comm-7",
      name: "Nikhil Kulkarni",
      role: "Sponsorship & Alliances",
      team: "Core team",
      department: "Dept. of Mechanical Engineering",
      phone: "+91 96110 22334",
      email: "nikhil.zyntra@sapthagiri.edu.in",
    },
    {
      id: "comm-8",
      name: "Prof. Sumathi R.",
      role: "Department Coordinator",
      team: "Dept coordinator",
      department: "Information Science & Engineering",
      phone: "+91 94480 33445",
      email: "sumathi_ise@sapthagiri.edu.in",
    },
    {
      id: "comm-9",
      name: "Prof. Sandeep Kumar",
      role: "Department Coordinator",
      team: "Dept coordinator",
      department: "Electronics & Communication",
      phone: "+91 94490 88990",
      email: "sandeep_ece@sapthagiri.edu.in",
    },
    {
      id: "comm-10",
      name: "Dr. Anupama H. S.",
      role: "Department Coordinator",
      team: "Dept coordinator",
      department: "Artificial Intelligence & Data Science",
      phone: "+91 98450 66778",
      email: "anupama_aids@sapthagiri.edu.in",
    },
  ],

  // LOGOS / PARTNERS
  logos: [
    { name: "Sapthagiri NPS University", badge: "HOST UNIVERSITY", icon: "GraduationCap" },
    { name: "IEEE SNPSU Student Branch", badge: "TECHNICAL PARTNER", icon: "Cpu" },
    { name: "ACM Student Chapter", badge: "COMPUTING ALLIANCE", icon: "Code2" },
    { name: "Dept. of Computer Science", badge: "ORGANIZING NODE", icon: "Terminal" },
    { name: "Dept. of Information Science", badge: "ORGANIZING NODE", icon: "Database" },
    { name: "Dept. of Electronics & Comm.", badge: "HARDWARE ALLIANCE", icon: "Zap" },
    { name: "Dept. of AI & Data Science", badge: "INTELLIGENCE NODE", icon: "Bot" },
    { name: "Robotics & Automation Club", badge: "ROBOTICS LAB", icon: "Cog" },
  ],

  // FREQUENTLY ASKED QUESTIONS
  faqs: [
    {
      id: "faq-1",
      question: "Who can participate in ZYNTRA '26?",
      answer:
        "ZYNTRA '26 is open to all undergraduate and postgraduate students from engineering, MCA, BCA, and polytechnic institutes across India. Inter-college cross-specialization teams are welcome.",
      category: "General",
    },
    {
      id: "faq-2",
      question: "How do I register for the events?",
      answer:
        "You can register for specific competitions by clicking the 'Register' button on the event cards or using the quick 'FEST PASS' floating button. You will receive an instant verified digital pass with QR code.",
      category: "General",
    },
    {
      id: "faq-3",
      question: "Is there a registration fee for ZYNTRA '26?",
      answer:
        "No! Registration for ZYNTRA '26 events, hackathons, and workshops is completely free. High-speed WiFi, dedicated power workstations, and mentor checkpoints are provided on campus.",
      category: "General",
    },
    {
      id: "faq-4",
      question: "Can I participate in multiple events?",
      answer:
        "Yes, you can register for multiple events as long as their scheduled timelines do not overlap. Check the 'Schedule' section to plan your festival timeline.",
      category: "General",
    },
    {
      id: "faq-5",
      question: "Will I receive certificates and cash prizes?",
      answer:
        "Yes, all participants receive official verified digital certificates from Sapthagiri NPS University. Arena winners receive cash prizes from the ₹3,50,000+ pool along with tech gadgets and cloud credits.",
      category: "General",
    },
    {
      id: "faq-6",
      question: "What should I bring for the hackathon?",
      answer:
        "For CodeNova 36H Hackathon and technical arenas, participants should bring their own laptops, chargers, and any specialized hardware. High-speed gigabit networking, power strips, and refreshments will be provided.",
      category: "General",
    },
    {
      id: "faq-7",
      question: "Where is the venue for ZYNTRA '26?",
      answer:
        "ZYNTRA '26 is hosted at the sprawling Sapthagiri NPS University campus on Hesaraghatta Main Road, Chikkabanavara, Bengaluru, Karnataka - 560057.",
      category: "General",
    },
  ],

  // INTERMISSION MANIFESTO
  intermission: {
    subtext: "SYNAPTIC PROTOCOL // 27-28 NOVEMBER 2026",
    words: [
      "DO", "NOT", "JUST", "OBSERVE", "THE", "FUTURE.",
      "CODE", "IT.", "ENGINEER", "IT.", "BUILD", "IT."
    ],
  },

  // VALUE VECTORS / WHY ATTEND
  whyAttend: [
    {
      id: "vec-1",
      icon: "Cpu",
      title: "Frontier Silicon & AI Challenges",
      description: "Tackle high-difficulty problem statements curated by leading Bengaluru tech founders and AI research labs.",
      stats: "₹3,50,000+ CASH POOL",
    },
    {
      id: "vec-2",
      icon: "Trophy",
      title: "National Proving Ground",
      description: "Compete against 3,500+ student developers, roboticists, and researchers from across premier South Indian universities.",
      stats: "48+ COLLEGES REPRESENTED",
    },
    {
      id: "vec-3",
      icon: "Rocket",
      title: "Direct Founder & VC Access",
      description: "Showcase functional prototypes directly to venture scouts, CTOs, and startup accelerators for direct interview fast-tracks.",
      stats: "15+ RECRUITERS & MENTORS",
    },
    {
      id: "vec-4",
      icon: "Sparkles",
      title: "Verified Digital Accreditations",
      description: "Official Certificates of Excellence and Participation backed by Sapthagiri NPS University to bolster your engineering portfolio.",
      stats: "100% VERIFIED ACCREDITATION",
    },
    {
      id: "vec-5",
      icon: "Bot",
      title: "Polycarbonate Combat Arenas",
      description: "Witness custom metal combat bots clash inside armored cages with live high-refresh overhead projection and pro casters.",
      stats: "30KG & 15KG BATTLE BOTS",
    },
    {
      id: "vec-6",
      icon: "Users",
      title: "Collaborative Hacker Culture",
      description: "36 continuous hours of hacking, gigabit connectivity, night coding sprints, esports derbies, and complimentary food.",
      stats: "36 HOURS GIGABIT LABS",
    },
  ],
};
