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
  category: 'React Native' | 'AI / ML' | 'Fintech' | 'Utility';
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
    "Senior React Native Engineer",
    "Mobile Solutions Architect",
    "Cross-Platform App Specialist",
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
      role: "Sr Engineer",
      date: "Mar 2026 – May 2026",
      desc: "Specialized in architectural enhancements and optimization of cross-platform apps."
    },
    {
      company: "Maplebell Private Limited, Bangalore",
      role: "Sr Engineer",
      date: "Nov 2025 – Mar 2026",
      desc: "Directed engineering cycles, performance audit updates, and CI/CD pipelines."
    },
    {
      company: "NotionMindz Technology LLP, Bangalore",
      role: "Sr Engineer",
      date: "Jan 2023 – Nov 2025",
      desc: "Led core React Native applications and high-fidelity integrations for flagship projects."
    },
    {
      company: "Opash Software, Surat",
      role: "Sr. Software Engineer",
      date: "Dec 2021 - Dec 2022",
      desc: "Built finance-tech interfaces and optimized secure local storage utilities."
    },
    {
      company: "EbizzInfotech, Surat",
      role: "Software Engineer",
      date: "Apr 2020 - Nov 2021",
      desc: "Developed pixel-perfect layouts and payment gateway SDK integrations."
    },
    {
      company: "Meritorious Infotech, Surat",
      role: "Software Engineer",
      date: "Jul 2019 – Mar 2020",
      desc: "Maintained iOS/Android codebases and handled push notification configurations."
    },
    {
      company: "Rain Infotech, Surat",
      role: "Software Engineer",
      date: "Jan 2019 – Jun 2019",
      desc: "Began development in mobile computing and modular integrations."
    }
  ];

  // Core Projects Data
  const projects: Project[] = [
    {
      id: "jbiq",
      title: "JBIQ - Reliance Consumer Intelligence",
      description: "AI-powered consumer intelligence and analytics platform developed for Reliance to enhance customer engagement.",
      fullDescription: "JBIQ is an enterprise-scale consumer intelligence application leveraging AI/ML APIs to parse consumer purchasing behaviors, trends, and dashboard insights. Built for high scaling, it maintains strict security schemas and real-time alerts.",
      category: "AI / ML",
      technologies: ["JavaScript", "TypeScript", "React Native", "Redux Toolkit", "Firebase", "REST APIs", "AI/ML APIs", "Node.js", "Axios", "Secure Storage", "Push Notifications", "React Navigation", "WebSockets", "Biometric Authentication"],
      responsibilities: [
        "Developed and maintained cross-platform mobile applications using React Native for Android and iOS platforms.",
        "Integrated AI-based services and analytics APIs to provide intelligent consumer insights and recommendation features.",
        "Implemented secure authentication and authorization mechanisms including biometric login and session handling.",
        "Consumed and managed REST APIs for real-time customer data, analytics dashboards, and reporting modules.",
        "Managed complex application state using Redux Toolkit for scalable and maintainable architecture.",
        "Optimized application performance, API handling, and memory usage to ensure smooth user experience across devices."
      ],
      links: {
        web: "https://play.google.com/store/apps/details?id=com.alrajhicapital" // placeholder indicator
      }
    },
    {
      id: "workforce",
      title: "Velrics Workforce Management",
      description: "Advanced workforce mobile application designed to streamline employee attendance, tracking, and offline data sync.",
      fullDescription: "Velrics focuses on operational tracking of remote and field workforce. Key mechanisms include secure session management, biometric authentication, offline operation sync, real-time push tracking, and live geolocation updates.",
      category: "Utility",
      technologies: ["JavaScript", "TypeScript", "React Native", "Redux", "REST APIs", "Axios", "Firebase", "Push Notifications", "React Navigation", "Secure Storage", "Geolocation", "Offline Data Sync", "Fastlane", "Biometric Authentication", "Jest"],
      responsibilities: [
        "Developed and maintained the mobile application using React Native for both Android and iOS platforms.",
        "Integrated geolocation and workforce tracking features to monitor field operations effectively.",
        "Added secure local storage for handling sensitive user and session data securely.",
        "Supported offline functionality and synchronized data when internet connectivity was restored.",
        "Performed unit testing, bug fixing, and QA support using Jest to ensure application stability."
      ],
      links: {}
    },
    {
      id: "alrajhi",
      title: "Alrajhi Capital Trading App",
      description: "Cutting-edge stock trading and investment platform tailored for Al Rajhi Bank, featuring live market updates.",
      fullDescription: "A high-security, high-performance financial mobile application. It features real-time charts, investment portfolio tracking, multilingual (Arabic/English) layout support, secure session tokens, and instant order transactions.",
      category: "Fintech",
      technologies: ["JavaScript", "TypeScript", "React Native", "REST APIs", "Redux", "Secure Storage", "Branch.io", "Push Notifications", "React Navigation", "Biometric Authentication", "Jest", "Fastlane"],
      responsibilities: [
        "Built and maintained the mobile application using React Native targeting both Android and iOS platforms.",
        "Developed secure authentication flows including biometric login and session management.",
        "Integrated REST APIs to fetch and post market data, portfolio updates, and trade execution.",
        "Contributed to the creation of a multilingual interface supporting Arabic and English."
      ],
      links: {
        playStore: "https://play.google.com/store/apps/details?id=com.alrajhicapital"
      }
    },
    {
      id: "noq",
      title: "NOQ - Food Ordering & Collection",
      description: "Queueless ordering system allowing users to prepay and collect food/drinks at participating events.",
      fullDescription: "NOQ is a live event food collection app that handles payment logic, camera barcode/QR scanning, and instant socket notifications. It is integrated with Stripe payment API.",
      category: "Utility",
      technologies: ["JavaScript", "TypeScript", "React Native", "Socket", "Stripe", "Vision Camera", "Jenkins", "Firebase", "Jest"],
      responsibilities: [
        "Designed and maintained excellent React Native application structures with clean code.",
        "Implemented pixel-perfect layouts, modern transitions, and animations.",
        "Integrated Stripe payment gateway and custom camera scanning libraries.",
        "Managed socket integrations for live order collection status updates."
      ],
      links: {
        appStore: "https://apps.apple.com/gb/app/noq/id1515913853"
      }
    },
    {
      id: "inkwiry",
      title: "Inkwiry Personal Finance Planner",
      description: "Fintech application designed for personal financial life planning 5-15 years into the future.",
      fullDescription: "Inkwiry facilitates future wealth projection and asset planning. Users input income, expense, and investment profiles, and the financial configurator updates dynamic visual projections.",
      category: "Fintech",
      technologies: ["JavaScript", "TypeScript", "React Native", "Redux Toolkit", "Jenkins", "Jest", "Native Modules"],
      responsibilities: [
        "Designed and built the mobile app from scratch, maintaining clean code architecture.",
        "Interfaced with native bridges (Native Modules) when required for custom calculations.",
        "Assisted in sprint planning, managed the development team, and followed Agile methodologies.",
        "Conducted R&D on complex rendering engines for forecasting."
      ],
      links: {
        web: "https://inkwiry.com/"
      }
    }
  ];

  // Secondary store/web projects
  const secondaryProjects: SecondaryProject[] = [
    {
      title: "Black Books Air",
      description: "A specialized app utility on Android.",
      url: "https://play.google.com/store/apps/details?id=com.blackbookair.android",
      platform: "Play Store"
    },
    {
      title: "Werzu",
      description: "Interactive application for iOS users.",
      url: "https://apps.apple.com/us/app/werzu/id1554399804",
      platform: "App Store"
    },
    {
      title: "Iron Box",
      description: "Vendor utility management tool on Android.",
      url: "https://play.google.com/store/apps/details?id=com.micandmac_vendornew.ironman",
      platform: "Play Store"
    },
    {
      title: "Gym Timer",
      description: "Custom fitness rest duration counter.",
      url: "https://apps.apple.com/us/app/gym-timer-timer-for-rest-time/id1146409173",
      platform: "App Store"
    },
    {
      title: "Dealertouch",
      description: "Web portal interface for dealer management.",
      url: "https://app.dealertouch.ca/login",
      platform: "Web"
    },
    {
      title: "CashRemit",
      description: "Remittance and money transfer service utility.",
      url: "https://play.google.com/store/apps/datasafety?id=com.cashremit.cashremitapp&pli=1",
      platform: "Play Store"
    }
  ];

  // Skills Categories
  const skillsData = [
    {
      category: "Languages & Frameworks",
      skills: ["React Native", "React", "JavaScript", "TypeScript", "Next.js", "OOPs", "Android SDK", "iOS SDK"]
    },
    {
      category: "APIs & Web Services",
      skills: ["REST", "GraphQL", "JSON", "XML", "WebSockets", "Socket.IO", "HTTP Client"]
    },
    {
      category: "Firebase Suite",
      skills: ["FCM", "Firebase Auth", "Firestore", "Admob", "Firebase ML"]
    },
    {
      category: "Security & Payments",
      skills: ["SSL Pinning", "Encryption", "Hyperpay", "RazorPay"]
    },
    {
      category: "Databases & Repos",
      skills: ["Firebase", "Realm", "Git", "GitHub", "GitLab", "BitBucket"]
    },
    {
      category: "DevOps & Tools",
      skills: ["Fastlane", "Jenkins", "Xcode", "Android Studio", "Postman", "Swagger", "Jira", "Asana"]
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
              With <strong>7.5+ years of experience</strong> in React Native application development, 
              I specialize in conceptualizing and building high-fidelity Android and iOS applications using the latest mobile technology architectures, smooth design structures, and security patterns.
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
          </div>

          {/* Premium CSS Interactive Mockup */}
          <div className="hero-graphic">
            <div className="graphic-bg-circle"></div>
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
                WorkForce
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
            {['All', 'React Native', 'AI / ML', 'Fintech', 'Utility'].map((category) => (
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
