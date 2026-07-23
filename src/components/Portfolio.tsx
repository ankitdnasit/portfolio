import { useState, useEffect, useRef } from 'react';
import { 
  Code2, 
  Layers, 
  Cpu, 
  Briefcase, 
  GraduationCap, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink, 
  Menu, 
  X, 
  Sparkles, 
  CheckCircle2, 
  Smartphone,
  Send,
  Compass,
  Wifi,
  Battery,
  Activity,
  CreditCard,
  TrendingUp,
  ArrowRight,
  Lock,
  Check,
  Coffee
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Project Interfaces
interface Project {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  category: 'React Native' | 'AI / ML' | 'Fintech' | 'Utility' | 'Web & Next.js';
  technologies: string[];
  responsibilities: string[];
  links: {
    playStore?: string;
    appStore?: string;
    web?: string;
  };
}

interface SecondaryProject {
  title: string;
  description: string;
  url: string;
  platform: 'Play Store' | 'App Store' | 'Web';
}

function App() {
  // Navigation & UI States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  
  // Filter States
  const [projectFilter, setProjectFilter] = useState<string>('All');
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  
  // Modal State
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formErrors, setFormErrors] = useState<{name?: string; email?: string; message?: string}>({});
  const [formSuccess, setFormSuccess] = useState(false);
  
  // Clipboard states
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  // Active App State in the Phone Mockup
  const [activeDeviceApp, setActiveDeviceApp] = useState<'jbiq' | 'workforce' | 'alrajhi' | 'noq' | 'inkwiry'>('jbiq');
  
  // Scroll progress for top indicator
  const [scrollProgress, setScrollProgress] = useState(0);

  // Typing Animation Hook parameters
  const roles = [
    "Senior React Native & React Engineer",
    "Mobile & Web Solutions Architect",
    "AI Analytics & Fintech Developer",
    "7.5+ Years Experience"
  ];
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const typingSpeed = 100;
  const deletingSpeed = 50;
  const pauseTime = 1500;

  // Ref list for sections scroll detection
  const sectionRefs = {
    about: useRef<HTMLDivElement>(null),
    experience: useRef<HTMLDivElement>(null),
    projects: useRef<HTMLDivElement>(null),
    skills: useRef<HTMLDivElement>(null),
    education: useRef<HTMLDivElement>(null),
    contact: useRef<HTMLDivElement>(null),
  };

  // Typing Effect Loop
  useEffect(() => {
    let timer: number;
    const fullText = roles[currentRoleIndex];

    const handleTyping = () => {
      if (!isDeleting) {
        // Typing text
        setCurrentText(fullText.substring(0, currentText.length + 1));
        if (currentText === fullText) {
          // Finished typing, wait then delete
          timer = setTimeout(() => setIsDeleting(true), pauseTime);
          return;
        }
      } else {
        // Deleting text
        setCurrentText(fullText.substring(0, currentText.length - 1));
        if (currentText === '') {
          setIsDeleting(false);
          setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
          return;
        }
      }

      timer = setTimeout(handleTyping, isDeleting ? deletingSpeed : typingSpeed);
    };

    timer = setTimeout(handleTyping, 100);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentRoleIndex]);

  // Scroll listener for Sticky Header, Section Activation, & Progress
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Scroll progress
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }

      // Detect active section
      const scrollPos = window.scrollY + 200;
      for (const [section, ref] of Object.entries(sectionRefs)) {
        if (ref.current) {
          const elementTop = ref.current.offsetTop;
          const elementHeight = ref.current.offsetHeight;
          if (scrollPos >= elementTop && scrollPos < elementTop + elementHeight) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mouse movement listener for custom glow coordinates
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Auto-cycle app simulator screens
  useEffect(() => {
    const apps: Array<'jbiq' | 'workforce' | 'alrajhi' | 'noq' | 'inkwiry'> = ['jbiq', 'workforce', 'alrajhi', 'noq', 'inkwiry'];
    const timer = setInterval(() => {
      setActiveDeviceApp(prev => {
        const currentIndex = apps.indexOf(prev);
        return apps[(currentIndex + 1) % apps.length];
      });
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Handlers for Clipboard Copy
  const copyToClipboard = (text: string, type: 'email' | 'phone') => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === 'email') {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
      } else {
        setCopiedPhone(true);
        setTimeout(() => setCopiedPhone(false), 2000);
      }
      
      // Fire confetti from that area
      confetti({
        particleCount: 30,
        spread: 40,
        origin: { y: 0.8 }
      });
    });
  };

  // Form Validation and Submit
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: {name?: string; email?: string; message?: string} = {};
    
    if (!formName.trim()) errors.name = "Name is required";
    if (!formEmail.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formEmail)) {
      errors.email = "Please enter a valid email address";
    }
    if (!formMessage.trim()) errors.message = "Message is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setFormSuccess(true);
    
    // Confetti burst on success!
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });

    // Reset Form
    setFormName('');
    setFormEmail('');
    setFormMessage('');

    setTimeout(() => {
      setFormSuccess(false);
    }, 5000);
  };

  // Highlight action when downloading resume
  const handleDownloadResume = () => {
    confetti({
      particleCount: 100,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  // Navigation click helper
  const scrollToSection = (sectionId: keyof typeof sectionRefs) => {
    setMobileMenuOpen(false);
    sectionRefs[sectionId].current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Experience Data
  const experiences = [
    {
      company: "The Product Guys, Bangalore",
      role: "Sr Engineer (Contract)",
      date: "Mar 2026 – May 2026",
      desc: "Architected AI-powered consumer intelligence platform (JBIQ) for Reliance with ML analytics APIs, biometric auth, FlashList & MMKV optimizations, and React Native New Architecture (JSI, Fabric, TurboModules)."
    },
    {
      company: "Maplebell Private Limited, Bangalore",
      role: "Sr Engineer",
      date: "Nov 2025 – Mar 2026",
      desc: "Directed engineering cycles and CI/CD pipelines for Velrics workforce management app with offline sync, biometric security, TanStack Query, and Detox/Maestro E2E testing."
    },
    {
      company: "NotionMindz Technology LLP, Bangalore",
      role: "Sr Engineer",
      date: "Jan 2023 – Nov 2025",
      desc: "Led React Native development for Alrajhi Capital stock trading app (Al Rajhi Bank) & built Inkwiry personal finance planner from scratch with custom Swift/Kotlin native modules."
    },
    {
      company: "Opash Software, Surat",
      role: "Sr. Software Engineer",
      date: "Dec 2021 – Dec 2022",
      desc: "Engineered NOQ queueless food/drink collection app (Stripe & Vision Camera), CashRemit money transfer, and Dealertouch web portal using Next.js App Router & Tailwind CSS."
    },
    {
      company: "EbizzInfotech, Surat",
      role: "Software Engineer",
      date: "Apr 2020 – Nov 2021",
      desc: "Built Black Books Air Android app and Gym Timer iOS app, integrated payment gateway SDKs, push notifications, and pixel-perfect UI layouts."
    },
    {
      company: "Meritorious Infotech, Surat",
      role: "Software Engineer",
      date: "Jul 2019 – Mar 2020",
      desc: "Developed Werzu interactive iOS application, maintaining cross-platform codebases and handling push notification configuration."
    },
    {
      company: "Rain Infotech, Surat",
      role: "Software Engineer",
      date: "Jan 2019 – Jun 2019",
      desc: "Began professional React Native development on Iron Box vendor utility app for Android."
    }
  ];

  // Core Projects Data
  const projects: Project[] = [
    {
      id: "jbiq",
      title: "JBIQ – Reliance Consumer Intelligence Platform",
      description: "AI-powered consumer intelligence and analytics platform developed for Reliance to surface real-time customer behavior insights.",
      fullDescription: "JBIQ is an enterprise AI consumer intelligence application built for Reliance. It surfaces predictive customer behavior insights, real-time analytics dashboards, biometric authentication, encrypted local storage, FlashList list rendering, MMKV caching, and React Native New Architecture (JSI, Fabric, TurboModules) performance enhancements with Reanimated 3.",
      category: "AI / ML",
      technologies: ["React Native (0.76+)", "React 18", "TypeScript", "JSI / Fabric", "TurboModules", "AI / ML APIs", "Redux Toolkit", "MMKV", "FlashList", "Reanimated 3", "Biometric Auth", "Sentry", "EAS Update / CodePush", "WebSockets"],
      responsibilities: [
        "Brought on as contract Senior Engineer to drive architectural enhancements and performance optimization for Reliance.",
        "Integrated AI/ML-based analytics APIs to surface real-time customer behavior insights and predictive recommendations on smart dashboards.",
        "Implemented biometric authentication and secure session handling; hardened local storage encryption for sensitive analytics data.",
        "Optimized API handling, WebSocket usage, and memory footprint to improve responsiveness across Android and iOS.",
        "Contributed to New Architecture (JSI, Fabric, TurboModules) migration and Reanimated 3-based UI transitions.",
        "Replaced legacy list rendering with FlashList and moved local caching to MMKV to cut list-scroll jank and cold-start read latency.",
        "Managed application monitoring with Sentry/Crashlytics and deployed OTA hotfixes using EAS Update/CodePush."
      ],
      links: {
        web: "https://play.google.com/store/apps/details?id=com.alrajhicapital"
      }
    },
    {
      id: "workforce",
      title: "Velrics Workforce Management",
      description: "Field workforce management platform with real-time employee attendance tracking, task assignment, and offline data sync.",
      fullDescription: "Velrics is a field workforce management application featuring real-time attendance tracking, geolocation field monitoring, offline data capture with automatic background sync, biometric login, TanStack Query server caching, and automated CI/CD pipelines via App Store Connect and Google Play Console.",
      category: "Utility",
      technologies: ["React Native", "TypeScript", "Redux", "TanStack Query", "Geolocation API", "Offline Data Sync", "Biometric Auth", "React Native Testing Library", "Detox / Maestro E2E", "Fastlane", "App Store Connect", "Google Play Console"],
      responsibilities: [
        "Directed engineering cycles, performance audits, and CI/CD pipeline updates for field workforce management.",
        "Built real-time employee attendance tracking, task assignment, and geolocation-based field monitoring features.",
        "Implemented offline data capture with automatic sync on reconnect, ensuring reliable operation for field staff with intermittent connectivity.",
        "Added biometric login and secure session handling; managed application state at scale with Redux.",
        "Introduced React Native Testing Library and Detox/Maestro E2E test coverage for critical attendance and task flows, adopting TanStack Query for server-state caching.",
        "Owned release management end-to-end through App Store Connect and Google Play Console, including build versioning, staged rollouts, and release notes."
      ],
      links: {}
    },
    {
      id: "alrajhi",
      title: "Alrajhi Capital Trading App",
      description: "Investment & stock trading platform for Al Rajhi Bank supporting real-time portfolio tracking and live market updates.",
      fullDescription: "A high-frequency investment and stock trading mobile app for Al Rajhi Bank. Features real-time portfolio tracking, live market pricing, instant buy/sell order execution, multilingual Arabic & English support, Branch.io deep linking, and custom Swift/Kotlin native modules.",
      category: "Fintech",
      technologies: ["React Native", "TypeScript", "Redux Toolkit", "Swift & Kotlin Native Modules", "Branch.io", "Multilingual (Arabic/English)", "Expo / EAS Build", "REST APIs", "Biometric Auth", "Asana / Swagger"],
      responsibilities: [
        "Led core React Native development on Alrajhi Capital, an investment/trading app for Al Rajhi Bank supporting real-time portfolio tracking, live pricing, and buy/sell order execution.",
        "Built a multilingual (Arabic/English) interface and integrated Branch.io deep linking for seamless cross-platform navigation.",
        "Wrote custom native modules in Swift and Kotlin where third-party packages lacked New Architecture support.",
        "Managed application state with Redux Toolkit, drove sprint planning and code reviews, and mentored team workflow using Asana and Swagger.",
        "Built and maintained Expo/EAS Build pipelines for reliable distribution."
      ],
      links: {
        playStore: "https://play.google.com/store/apps/details?id=com.alrajhicapital"
      }
    },
    {
      id: "dealertouch",
      title: "Dealertouch Dealer Management Web Portal",
      description: "Modern dealer management web portal built with Next.js App Router, Server Components, React 18, and Tailwind CSS.",
      fullDescription: "Dealertouch is a web-based dealer management portal engineered using Next.js (App Router, Server Components, Server Actions), React 18 concurrent features, and Tailwind CSS. Built with accessibility (a11y), Core Web Vitals optimization, and end-to-end automated testing.",
      category: "Web & Next.js",
      technologies: ["Next.js (App Router)", "React 18", "Server Components", "Server Actions", "TypeScript", "Tailwind CSS", "React Testing Library", "Playwright", "Core Web Vitals", "a11y"],
      responsibilities: [
        "Contributed to Dealertouch, a web-based dealer management portal, using Next.js (App Router, Server Components/Actions), React 18 concurrent features, and Tailwind CSS.",
        "Implemented robust testing coverage with React Testing Library and Playwright.",
        "Optimized web performance, page load times, accessibility (WCAG/a11y), and Core Web Vitals.",
        "Integrated real-time socket updates and automated CI/CD build deployment pipelines."
      ],
      links: {
        web: "https://app.dealertouch.ca/login"
      }
    },
    {
      id: "noq",
      title: "NOQ – Queueless Food & Drink Collection",
      description: "Queueless pre-order and venue collection app for live events featuring Stripe payments and Vision Camera.",
      fullDescription: "NOQ is a live event food collection app that handles payment logic, camera barcode/QR scanning via Vision Camera, and instant socket notifications integrated with Stripe payment API.",
      category: "Utility",
      technologies: ["React Native", "TypeScript", "Vision Camera", "Stripe SDK", "WebSockets", "Jenkins CI", "Firebase", "Jest"],
      responsibilities: [
        "Built NOQ, a queueless food/drink pre-order and collection app, including pixel-perfect UI, Stripe payment integration, and Vision Camera-based features.",
        "Designed and maintained clean React Native application structures with responsive layouts and modern animations.",
        "Managed WebSockets for instant order updates and automated Jenkins release builds."
      ],
      links: {
        appStore: "https://apps.apple.com/gb/app/noq/id1515913853"
      }
    },
    {
      id: "inkwiry",
      title: "Inkwiry Personal Finance Planner",
      description: "Fintech life-planning application for 5-15 year wealth projections and asset planning with dynamic configurator UI.",
      fullDescription: "Inkwiry facilitates future wealth projection and asset planning. Users input income, expense, and investment profiles into a custom financial configurator UI that updates dynamic visual projections.",
      category: "Fintech",
      technologies: ["React Native", "TypeScript", "Redux Toolkit", "Native Modules (Swift/Kotlin)", "Financial Configurator UI", "Jenkins CI", "Agile / Asana"],
      responsibilities: [
        "Designed and built Inkwiry, a financial life-planning app, from scratch, including native module integration and a custom financial configurator UI.",
        "Interfaced with native bridges (Native Modules) when required for high-performance financial calculations.",
        "Assisted in sprint planning, managed team tasks, and conducted R&D on complex forecasting engines."
      ],
      links: {
        web: "https://inkwiry.com/"
      }
    }
  ];

  // Secondary store/web projects
  const secondaryProjects: SecondaryProject[] = [
    {
      title: "CashRemit",
      description: "Remittance and money-transfer utility with secure payment flows.",
      url: "https://play.google.com/store/apps/datasafety?id=com.cashremit.cashremitapp&pli=1",
      platform: "Play Store"
    },
    {
      title: "Black Books Air",
      description: "Specialized mobile utility app released on Google Play.",
      url: "https://play.google.com/store/apps/details?id=com.blackbookair.android",
      platform: "Play Store"
    },
    {
      title: "Werzu",
      description: "Interactive iOS application with animation-rich UI.",
      url: "https://apps.apple.com/us/app/werzu/id1554399804",
      platform: "App Store"
    },
    {
      title: "Iron Box",
      description: "Vendor utility management tool for Android field staff.",
      url: "https://play.google.com/store/apps/details?id=com.micandmac_vendornew.ironman",
      platform: "Play Store"
    },
    {
      title: "Gym Timer",
      description: "iOS rest-timer counter with customizable workout routines.",
      url: "https://apps.apple.com/us/app/gym-timer-timer-for-rest-time/id1146409173",
      platform: "App Store"
    },
    {
      title: "Dealertouch",
      description: "Web portal interface for dealer management built in Next.js.",
      url: "https://app.dealertouch.ca/login",
      platform: "Web"
    }
  ];

  // Skills Categories
  const skillsData = [
    {
      category: "Languages & Frameworks",
      skills: ["React Native (0.74–0.76+)", "React 18+", "Next.js", "TypeScript (strict)", "JavaScript", "Swift", "Kotlin", "Android SDK", "iOS SDK"]
    },
    {
      category: "RN New Architecture & Web",
      skills: ["JSI", "Fabric", "TurboModules", "Hermes", "Codegen", "Next.js App Router", "Server Components", "Server Actions", "Tailwind CSS"]
    },
    {
      category: "State, Storage & UI",
      skills: ["Redux Toolkit", "Redux", "TanStack Query", "Zustand", "MMKV", "FlashList", "Reanimated 3", "Gesture Handler"]
    },
    {
      category: "Expo & Release Tooling",
      skills: ["Expo", "Expo Router", "EAS Build", "EAS Update / CodePush", "App Store Connect", "Google Play Console", "Fastlane"]
    },
    {
      category: "Testing & Quality",
      skills: ["React Testing Library", "Playwright", "Cypress", "Detox", "Maestro (E2E)", "Jest", "a11y (WCAG)", "Core Web Vitals"]
    },
    {
      category: "APIs & Security",
      skills: ["REST", "GraphQL", "WebSockets", "Socket.IO", "SSL Pinning", "Payload Encryption", "Biometric Auth", "Stripe", "Hyperpay", "RazorPay"]
    },
    {
      category: "AI / Firebase & DevOps",
      skills: ["LLM & AI/ML APIs", "FCM", "Firebase Auth", "Firestore", "Sentry", "Crashlytics", "Git", "GitHub", "Jira", "Asana", "Postman", "Swagger"]
    }
  ];

  // Filtered Core Projects list
  const filteredProjects = projects.filter(project => {
    // 1. Filter by category tab
    if (projectFilter !== 'All' && project.category !== projectFilter) {
      return false;
    }
    // 2. Filter by clicked skill highlight (if active)
    if (selectedSkill && !project.technologies.includes(selectedSkill)) {
      return false;
    }
    return true;
  });

  return (
    <div className="portfolio-app">
      {/* Viewport Scroll Progress Bar */}
      <div className="scroll-progress-container">
        <div className="scroll-progress-bar" style={{ width: `${scrollProgress}%` }}></div>
      </div>

      {/* Cursor Mouse Tracker Light Overlay */}
      <div className="cursor-glow"></div>

      {/* Tech Grid Background Overlay */}
      <div className="tech-grid-overlay"></div>
      {/* Sticky Navigation Header */}
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-container">
          <a href="#" className="logo-text">
            <Smartphone className="highlight" size={24} />
            <span>ankit.nasit</span>
          </a>

          {/* Navigation Links */}
          <ul className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <li>
              <a 
                href="#about" 
                className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}
              >
                About
              </a>
            </li>
            <li>
              <a 
                href="#experience" 
                className={`nav-link ${activeSection === 'experience' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); scrollToSection('experience'); }}
              >
                Experience
              </a>
            </li>
            <li>
              <a 
                href="#projects" 
                className={`nav-link ${activeSection === 'projects' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); scrollToSection('projects'); }}
              >
                Projects
              </a>
            </li>
            <li>
              <a 
                href="#skills" 
                className={`nav-link ${activeSection === 'skills' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); scrollToSection('skills'); }}
              >
                Skills
              </a>
            </li>
            <li>
              <a 
                href="#education" 
                className={`nav-link ${activeSection === 'education' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); scrollToSection('education'); }}
              >
                Education
              </a>
            </li>
            <li>
              <a 
                href="#contact" 
                className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}
              >
                Contact
              </a>
            </li>
          </ul>

          {/* Mobile Menu button */}
          <button 
            className="mobile-menu-btn" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section id="about" ref={sectionRefs.about} className="hero-section">
        <div className="container hero-grid">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={16} />
              <span>Available for Senior Contracts & Full-time Roles</span>
            </div>
            
            <h1 className="hero-title">
              Hi, I'm Ankit Nasit
            </h1>
            
            <div className="hero-subtitle">
              <span>I build</span>
              <span className="text-gradient-primary">{currentText}</span>
              <span className="cursor-blink">|</span>
            </div>
            
            <p className="hero-desc">
              Senior Software Engineer with <strong>7.5+ years of experience</strong> building cross-platform mobile applications in React Native, with growing depth in React for web. Shipped 15+ production apps across fintech, workforce management, AI analytics, and consumer utilities for clients including <strong>Reliance</strong> and <strong>Al Rajhi Bank</strong>.
            </p>
            
            <div className="hero-actions">
              <a 
                href="#projects" 
                className="btn btn-primary"
                onClick={(e) => { e.preventDefault(); scrollToSection('projects'); }}
              >
                Explore Projects
              </a>
              <a 
                href={`${import.meta.env.BASE_URL}Ankit_Nasit_CV.pdf`}
                download="Ankit_Nasit_CV.pdf"
                onClick={handleDownloadResume} 
                className="btn btn-secondary"
              >
                Download CV
              </a>
            </div>

            {/* Stats Bar */}
            <div className="hero-stats-bar">
              <div className="hero-stat">
                <span className="hero-stat-num">7.5+</span>
                <span className="hero-stat-label">Years Exp.</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-num">15+</span>
                <span className="hero-stat-label">Apps Shipped</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-num">7</span>
                <span className="hero-stat-label">Companies</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-num">2</span>
                <span className="hero-stat-label">Platforms</span>
              </div>
            </div>
          </div>

          {/* Premium CSS Interactive Mockup */}
          <div className="hero-graphic">
            <div className="graphic-bg-circle"></div>

            {/* Floating Badges */}
            <div className="phone-float-badge phone-float-badge-left">
              <div className="badge-icon" style={{background:'rgba(16,185,129,0.15)',color:'var(--accent)'}}>⚡</div>
              <div>
                <div style={{fontSize:'0.7rem',color:'var(--text-muted)'}}>Arch Pattern</div>
                <div>Redux Toolkit</div>
              </div>
            </div>
            <div className="phone-float-badge phone-float-badge-left2">
              <div className="badge-icon" style={{background:'rgba(139,92,246,0.15)',color:'var(--primary)'}}>🔒</div>
              <div>
                <div style={{fontSize:'0.7rem',color:'var(--text-muted)'}}>Security</div>
                <div>SSL Pinning</div>
              </div>
            </div>
            <div className="phone-float-badge phone-float-badge-right">
              <div className="badge-icon" style={{background:'rgba(6,182,212,0.15)',color:'var(--secondary)'}}>📱</div>
              <div>
                <div style={{fontSize:'0.7rem',color:'var(--text-muted)'}}>Platforms</div>
                <div>iOS &amp; Android</div>
              </div>
            </div>
            <div className="phone-float-badge phone-float-badge-right2">
              <div className="badge-icon" style={{background:'rgba(245,158,11,0.15)',color:'#f59e0b'}}>🚀</div>
              <div>
                <div style={{fontSize:'0.7rem',color:'var(--text-muted)'}}>CI/CD</div>
                <div>Fastlane</div>
              </div>
            </div>

            <div className="phone-mockup animate-float">
              <div className="phone-notch"></div>
              <div className="phone-screen">
                {/* Simulated StatusBar */}
                <div className="phone-statusbar">
                  <span className="phone-time">09:41</span>
                  <div className="phone-status-icons">
                    <Wifi size={12} />
                    <Activity size={12} className="live-pulse" />
                    <Battery size={12} />
                  </div>
                </div>

                {activeDeviceApp === 'jbiq' && (
                  <div className="phone-app-content jbiq-app">
                    <div className="app-nav">
                      <span className="app-title">JBIQ Reliance</span>
                      <span className="badge badge-success animate-pulse">LIVE</span>
                    </div>
                    <div className="app-body">
                      <div className="metrics-circle">
                        <div className="metrics-val">415<span className="unit">V</span></div>
                        <div className="metrics-label">Grid Load Stable</div>
                      </div>
                      <div className="app-card">
                        <div className="card-label">Active Harmonics</div>
                        <div className="chart-bar-container">
                          <div className="chart-bar" style={{ width: '85%' }}></div>
                        </div>
                      </div>
                      <div className="app-grid">
                        <div className="grid-item">
                          <span className="grid-lbl">Current</span>
                          <span className="grid-val">84 A</span>
                        </div>
                        <div className="grid-item">
                          <span className="grid-lbl">Freq</span>
                          <span className="grid-val">50.02 Hz</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeDeviceApp === 'workforce' && (
                  <div className="phone-app-content workforce-app">
                    <div className="app-nav">
                      <span className="app-title">WorkForce ERP</span>
                      <span className="badge badge-primary">4 Tasks</span>
                    </div>
                    <div className="app-body">
                      <div className="task-progress-card">
                        <span className="card-lbl">Today's Progress</span>
                        <div className="progress-row">
                          <div className="progress-bg">
                            <div className="progress-fill" style={{ width: '60%' }}></div>
                          </div>
                          <span className="progress-txt">60%</span>
                        </div>
                      </div>
                      
                      <div className="task-list">
                        <div className="task-item completed">
                          <Check size={12} className="icon-check" />
                          <span className="task-name">Substation Safety Check</span>
                        </div>
                        <div className="task-item active">
                          <div className="pulse-dot"></div>
                          <span className="task-name">Equipment Health Audit</span>
                        </div>
                        <div className="task-item">
                          <div className="empty-dot"></div>
                          <span className="task-name">Verify Switchgear Status</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeDeviceApp === 'alrajhi' && (
                  <div className="phone-app-content alrajhi-app">
                    <div className="app-nav">
                      <span className="app-title">urpay Wallet</span>
                      <Lock size={12} className="lock-icon" />
                    </div>
                    <div className="app-body">
                      <div className="wallet-card">
                        <span className="wallet-label">Available Balance</span>
                        <h4 className="wallet-balance">$14,250.80</h4>
                        <span className="wallet-user">Ankit Nasit</span>
                      </div>
                      
                      <div className="quick-actions">
                        <div className="action-btn">
                          <CreditCard size={14} />
                          <span>Transfer</span>
                        </div>
                        <div className="action-btn">
                          <TrendingUp size={14} />
                          <span>Invest</span>
                        </div>
                        <div className="action-btn">
                          <Coffee size={14} />
                          <span>Pay Bills</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeDeviceApp === 'noq' && (
                  <div className="phone-app-content noq-app">
                    <div className="app-nav">
                      <span className="app-title">NOQ Express</span>
                      <span className="badge badge-accent">Scan & Go</span>
                    </div>
                    <div className="app-body">
                      <div className="cart-card">
                        <div className="cart-header">Current Order</div>
                        <div className="cart-item">
                          <span>Pizza (Cheese)</span>
                          <span className="price">$14.50</span>
                        </div>
                        <div className="cart-item">
                          <span>Iced Mocha</span>
                          <span className="price">$4.00</span>
                        </div>
                        <div className="cart-total">
                          <span>Total</span>
                          <span>$18.50</span>
                        </div>
                      </div>
                      <button className="btn-pay">
                        <span>Slide to Pay</span>
                        <ArrowRight size={14} className="arrow-anim" />
                      </button>
                    </div>
                  </div>
                )}

                {activeDeviceApp === 'inkwiry' && (
                  <div className="phone-app-content inkwiry-app">
                    <div className="app-nav">
                      <span className="app-title">Inkwiry Finance</span>
                      <TrendingUp size={14} className="highlight" />
                    </div>
                    <div className="app-body">
                      <div className="projection-card">
                        <span className="card-lbl">Scenario Analysis</span>
                        <div className="networth-val">$240,000</div>
                        <span className="networth-lbl">Est. Future Net Worth</span>
                      </div>
                      
                      <div className="graph-container">
                        <div className="graph-bar" style={{ height: '30%' }}></div>
                        <div className="graph-bar" style={{ height: '50%' }}></div>
                        <div className="graph-bar active" style={{ height: '80%' }}></div>
                        <div className="graph-bar" style={{ height: '65%' }}></div>
                        <div className="graph-bar" style={{ height: '90%' }}></div>
                      </div>
                      <div className="toggle-container">
                        <span className="toggle-btn active">Conservative</span>
                        <span className="toggle-btn">Aggressive</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Emulator Controls */}
            <div className="phone-controls">
              <button 
                className={`control-tab ${activeDeviceApp === 'jbiq' ? 'active' : ''}`}
                onClick={() => setActiveDeviceApp('jbiq')}
              >
                JBIQ
              </button>
              <button 
                className={`control-tab ${activeDeviceApp === 'workforce' ? 'active' : ''}`}
                onClick={() => setActiveDeviceApp('workforce')}
              >
                Velrics
              </button>
              <button 
                className={`control-tab ${activeDeviceApp === 'alrajhi' ? 'active' : ''}`}
                onClick={() => setActiveDeviceApp('alrajhi')}
              >
                urpay
              </button>
              <button 
                className={`control-tab ${activeDeviceApp === 'noq' ? 'active' : ''}`}
                onClick={() => setActiveDeviceApp('noq')}
              >
                NOQ
              </button>
              <button 
                className={`control-tab ${activeDeviceApp === 'inkwiry' ? 'active' : ''}`}
                onClick={() => setActiveDeviceApp('inkwiry')}
              >
                Inkwiry
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Timeline Section */}
      <section id="experience" ref={sectionRefs.experience} className="experience-section">
        <div className="container">
          <div className="section-header">
            <h2>Work Experience</h2>
            <p>7.5 Years of proven track record leading mobile application deliverables in high-tempo tech companies.</p>
          </div>

          <div className="timeline">
            {experiences.map((exp, idx) => (
              <div 
                key={idx} 
                className={`timeline-item ${idx % 2 === 0 ? 'left' : 'right'}`}
              >
                <div className="timeline-dot"></div>
                <div className="timeline-content glass-card">
                  <span className="timeline-date">{exp.date}</span>
                  <h3 className="timeline-role">{exp.role}</h3>
                  <div className="timeline-company">
                    <Briefcase size={16} className="highlight" />
                    <span>{exp.company}</span>
                  </div>
                  <p className="timeline-desc">{exp.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Showcase Section */}
      <section id="projects" ref={sectionRefs.projects} className="projects-section">
        <div className="container">
          <div className="section-header">
            <h2>Flagship Projects</h2>
            <p>A selection of production-grade commercial products I have engineered from concept to store release.</p>
          </div>

          {/* Project Filtering Toolbar */}
          <div className="project-filters">
            {['All', 'React Native', 'AI / ML', 'Fintech', 'Utility', 'Web & Next.js'].map((category) => (
              <button
                key={category}
                className={`filter-btn ${projectFilter === category ? 'active' : ''}`}
                onClick={() => {
                  setProjectFilter(category);
                  setSelectedSkill(null); // Reset skill filter on tab shift
                }}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Skills filtering indicator */}
          {selectedSkill && (
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <span className="tech-tag highlighted">
                Filtering by: {selectedSkill} 
                <button 
                  onClick={() => setSelectedSkill(null)} 
                  style={{ background: 'none', border: 'none', marginLeft: '8px', cursor: 'pointer', color: 'inherit', fontWeight: 'bold' }}
                >
                  ×
                </button>
              </span>
            </div>
          )}

          {/* Projects Grid */}
          <div className="projects-grid">
            {filteredProjects.map((project) => (
              <div 
                key={project.id} 
                className="glass-card project-card"
                onClick={() => setSelectedProject(project)}
                style={{ cursor: 'pointer' }}
              >
                <div className="project-card-header">
                  <div className="project-card-icon">
                    {project.category === 'AI / ML' && <Cpu size={24} />}
                    {project.category === 'Fintech' && <Layers size={24} />}
                    {project.category === 'Utility' && <Compass size={24} />}
                    {project.category === 'React Native' && <Smartphone size={24} />}
                    {project.category === 'Web & Next.js' && <Code2 size={24} />}
                  </div>
                  <div className="project-card-links" onClick={(e) => e.stopPropagation()}>
                    {project.links.playStore && (
                      <a href={project.links.playStore} target="_blank" rel="noopener noreferrer" title="Play Store">
                        <ExternalLink size={20} />
                      </a>
                    )}
                    {project.links.appStore && (
                      <a href={project.links.appStore} target="_blank" rel="noopener noreferrer" title="App Store">
                        <ExternalLink size={20} />
                      </a>
                    )}
                    {project.links.web && (
                      <a href={project.links.web} target="_blank" rel="noopener noreferrer" title="Website">
                        <ExternalLink size={20} />
                      </a>
                    )}
                  </div>
                </div>

                <h3>{project.title}</h3>
                <p>{project.description}</p>

                <div className="project-tech-tags">
                  {project.technologies.slice(0, 5).map((tech) => (
                    <span key={tech} className="tech-tag">
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 5 && (
                    <span className="tech-tag" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
                      +{project.technologies.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Secondary Store Projects */}
          <div className="secondary-projects">
            <h3 className="secondary-title">Additional App Store Releases</h3>
            <div className="secondary-grid">
              {secondaryProjects.map((subProject, index) => (
                <div key={index} className="secondary-card">
                  <h4>{subProject.title}</h4>
                  <p>{subProject.description}</p>
                  <div className="store-links">
                    <a 
                      href={subProject.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="store-link"
                    >
                      <span>View on {subProject.platform}</span>
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Skills Matrix Section */}
      <section id="skills" ref={sectionRefs.skills} className="skills-section">
        <div className="container">
          <div className="section-header">
            <h2>Skills & Technologies</h2>
            <p>Click any skill badge to filter and highlight matching project credentials above.</p>
          </div>

          <div className="skills-layout glass-card">
            <div className="skills-info-card">
              <h3 className="logo-text">
                <Code2 className="highlight" size={24} />
                <span>Modern Mobile Architecture</span>
              </h3>
              <p style={{ marginTop: '1rem' }}>
                Leveraging structured state models, secure local device storage, API gateways, and native hardware bridges to deliver outstanding, buttery-smooth mobile applications.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} className="highlight" />
                  <span>State Management: Redux Toolkit, Redux</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} className="highlight" />
                  <span>Security Frameworks: SSL Pinning, Payload Encryption</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} className="highlight" />
                  <span>Build Automations: Fastlane, Jenkins pipelines</span>
                </li>
              </ul>
            </div>

            <div className="skills-grid-container">
              {skillsData.map((categoryGroup, index) => (
                <div key={index} className="skills-category">
                  <h4>{categoryGroup.category}</h4>
                  <div className="skills-list">
                    {categoryGroup.skills.map((skill) => (
                      <button
                        key={skill}
                        className={`skill-badge ${selectedSkill === skill ? 'active' : ''}`}
                        onClick={() => {
                          if (selectedSkill === skill) {
                            setSelectedSkill(null);
                          } else {
                            setSelectedSkill(skill);
                            // Scroll to projects section smoothly
                            sectionRefs.projects.current?.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" ref={sectionRefs.education} className="education-section">
        <div className="container">
          <div className="section-header">
            <h2>Education</h2>
            <p>Academic foundations in Computer Science & Mobile Computing.</p>
          </div>

          <div className="education-grid">
            <div className="glass-card education-card">
              <div className="education-icon">
                <GraduationCap size={24} />
              </div>
              <div className="education-details">
                <h3>Master's Degree: IT & Mobile Computing</h3>
                <p className="school">GLS University, Ahmedabad</p>
                <span className="date">Jun 2017 – May 2019</span>
              </div>
            </div>

            <div className="glass-card education-card">
              <div className="education-icon">
                <GraduationCap size={24} />
              </div>
              <div className="education-details">
                <h3>Bachelor of Engineering: CSE</h3>
                <p className="school">Sri Vivekananda College, Surat</p>
                <span className="date">Jan 2014 – Dec 2017</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" ref={sectionRefs.contact} className="contact-section">
        <div className="container">
          <div className="section-header">
            <h2>Get In Touch</h2>
            <p>Have an interesting project or a senior role? Let's discuss details.</p>
          </div>

          <div className="contact-layout">
            <div className="contact-info">
              <div>
                <h3 className="contact-info-title">Contact Information</h3>
                <p className="contact-info-desc">Click to copy details. Fired triggers a celebratory notification.</p>
              </div>

              <div className="contact-methods">
                <div 
                  className={`contact-method-card ${copiedEmail ? 'copied' : ''}`}
                  onClick={() => copyToClipboard('ankitnasit66@gmail.com', 'email')}
                >
                  <div className="contact-method-icon">
                    <Mail size={20} />
                  </div>
                  <div className="contact-method-details">
                    <p>Email</p>
                    <p>ankitnasit66@gmail.com</p>
                  </div>
                  <span className="copy-indicator">{copiedEmail ? 'Copied!' : 'Copy'}</span>
                </div>

                <div 
                  className={`contact-method-card ${copiedPhone ? 'copied' : ''}`}
                  onClick={() => copyToClipboard('+918980605594', 'phone')}
                >
                  <div className="contact-method-icon">
                    <Phone size={20} />
                  </div>
                  <div className="contact-method-details">
                    <p>Phone</p>
                    <p>+91 8980605594</p>
                  </div>
                  <span className="copy-indicator">{copiedPhone ? 'Copied!' : 'Copy'}</span>
                </div>

                <div className="contact-method-card" style={{ cursor: 'default' }}>
                  <div className="contact-method-icon">
                    <MapPin size={20} />
                  </div>
                  <div className="contact-method-details">
                    <p>Location</p>
                    <p>Bangalore, Karnataka, India</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="social-links-row">
                <a href="https://github.com/ankitdnasit" target="_blank" rel="noopener noreferrer" className="social-link-btn" title="GitHub">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
                </a>
                <a href="https://www.linkedin.com/in/ankit-nasit-b45ba5102/" target="_blank" rel="noopener noreferrer" className="social-link-btn" title="LinkedIn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
              </div>
            </div>

            {/* Interactive Contact Form */}
            <div className="glass-card">
              <form onSubmit={handleContactSubmit} className="contact-form">
                <div className="form-group">
                  <label className="form-label" htmlFor="name">Name</label>
                  <input
                    id="name"
                    type="text"
                    className="form-input"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="John Doe"
                  />
                  {formErrors.name && <span className="form-error">{formErrors.name}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    className="form-input"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="john@example.com"
                  />
                  {formErrors.email && <span className="form-error">{formErrors.email}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    rows={4}
                    className="form-input"
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    placeholder="Let's build something great..."
                    style={{ resize: 'vertical' }}
                  />
                  {formErrors.message && <span className="form-error">{formErrors.message}</span>}
                </div>

                {formSuccess && (
                  <div className="form-success-msg">
                    <CheckCircle2 size={20} />
                    <span>Message sent successfully! Confetti celebration triggered.</span>
                  </div>
                )}

                <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center' }}>
                  <Send size={18} />
                  <span>Send Message</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-content">
          <div className="footer-logo">
            <p>© 2026 Ankit Nasit. All rights reserved.</p>
          </div>
          <div className="footer-credits">
            <p>Engineered with <span>React</span> & <span>Vite</span></p>
          </div>
        </div>
      </footer>

      {/* Project Detail Modal Overlay */}
      {selectedProject && (
        <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedProject(null)} aria-label="Close Modal">
              <X size={20} />
            </button>
            
            <div className="modal-header">
              <h3>{selectedProject.title}</h3>
              <p style={{ color: 'var(--secondary)', fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                Category: {selectedProject.category}
              </p>
              <div className="modal-tech-list">
                {selectedProject.technologies.map((tech) => (
                  <span key={tech} className="tech-tag highlighted">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="modal-section">
              <h4>Description</h4>
              <p>{selectedProject.fullDescription}</p>
            </div>

            <div className="modal-section">
              <h4>Roles & Responsibilities</h4>
              <ul className="modal-responsibilities">
                {selectedProject.responsibilities.map((resp, idx) => (
                  <li key={idx} className="modal-responsibility-item">
                    {resp}
                  </li>
                ))}
              </ul>
            </div>

            <div className="modal-footer">
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Commercial Project (Enterprise Distribution)
              </span>
              <div className="project-card-links" style={{ fontSize: '1rem', display: 'flex', gap: '1rem' }}>
                {selectedProject.links.playStore && (
                  <a href={selectedProject.links.playStore} target="_blank" rel="noopener noreferrer" className="store-link">
                    <span>Play Store</span>
                    <ExternalLink size={14} />
                  </a>
                )}
                {selectedProject.links.appStore && (
                  <a href={selectedProject.links.appStore} target="_blank" rel="noopener noreferrer" className="store-link">
                    <span>App Store</span>
                    <ExternalLink size={14} />
                  </a>
                )}
                {selectedProject.links.web && (
                  <a href={selectedProject.links.web} target="_blank" rel="noopener noreferrer" className="store-link">
                    <span>View Link</span>
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
