import {
  CandidateProfile,
  JobListing,
  SavedAnswer,
  SkillGapItem,
  RoadmapMilestone,
  MarketSkillDemand,
  NotificationItem,
  ApplicationRecord
} from './types';

export const DEFAULT_CANDIDATE_PROFILE: CandidateProfile = {
  id: 'cand-alex-kumar-01',
  name: 'Alex Kumar',
  email: 'alex.kumar@example.com',
  phone: '+91 98765 43210',
  location: 'Hyderabad, Telangana, India',
  title: 'Java Backend Developer & Full Stack Enthusiast',
  summary: 'Final year Computer Science student & passionate Java Developer with strong foundations in Spring Boot, REST APIs, Microservices, and Relational Databases (MySQL/PostgreSQL). Built full-stack applications with React and Spring Boot.',
  targetRoles: ['Java Developer', 'Backend Developer', 'Software Engineer', 'Full Stack Developer'],
  preferredLocations: ['Hyderabad', 'Bengaluru', 'Pune', 'Remote'],
  preferredWorkModes: ['Remote', 'Hybrid'],
  expectedSalary: '₹8 - ₹12 LPA',
  noticePeriod: 'Immediate / 15 Days',
  relocationPreference: true,
  workAuthorization: 'Citizen of India (No sponsorship required)',
  education: [
    {
      degree: 'B.Tech in Computer Science & Engineering',
      field: 'Computer Science',
      institution: 'Jawaharlal Nehru Technological University (JNTU), Hyderabad',
      graduationYear: '2025',
      cgpa: '8.7 / 10.0'
    }
  ],
  skills: [
    { name: 'Java', category: 'Languages', proficiency: 92, confidence: 'Verified', evidence: 'Core coursework & 3 backend projects', yearsOfExp: 2 },
    { name: 'Spring Boot', category: 'Frameworks', proficiency: 86, confidence: 'Verified', evidence: 'Built Smart Attendance & E-Commerce microservices', yearsOfExp: 1.5 },
    { name: 'REST APIs', category: 'Concepts', proficiency: 90, confidence: 'Verified', evidence: 'Designed REST endpoints with OpenAPI specs', yearsOfExp: 2 },
    { name: 'MySQL', category: 'Databases', proficiency: 88, confidence: 'Verified', evidence: 'Schema design, indexing & queries in Smart Attendance', yearsOfExp: 2 },
    { name: 'Git & GitHub', category: 'Tools', proficiency: 85, confidence: 'Verified', evidence: 'Version control across all college & personal repos', yearsOfExp: 2 },
    { name: 'Hibernate / JPA', category: 'Frameworks', proficiency: 80, confidence: 'Verified', evidence: 'ORM mapping in Spring Boot projects', yearsOfExp: 1 },
    { name: 'PostgreSQL', category: 'Databases', proficiency: 75, confidence: 'Verified', evidence: 'Used in Hackathon project backend', yearsOfExp: 1 },
    { name: 'JavaScript / TypeScript', category: 'Languages', proficiency: 70, confidence: 'Inferred', evidence: 'Frontend integration with React in projects', yearsOfExp: 1 },
    { name: 'React', category: 'Frameworks', proficiency: 68, confidence: 'Inferred', evidence: 'Built dashboard UI for attendance system', yearsOfExp: 1 },
    { name: 'Docker', category: 'Tools', proficiency: 45, confidence: 'Needs Confirmation', evidence: 'Basic Dockerfiles written in lab assignments', yearsOfExp: 0.5 },
    { name: 'AWS', category: 'Cloud', proficiency: 30, confidence: 'Missing', evidence: 'Not explicitly evidenced in projects or certifications', yearsOfExp: 0 },
    { name: 'Apache Kafka', category: 'Tools', proficiency: 20, confidence: 'Missing', evidence: 'Theoretical knowledge only, no production projects', yearsOfExp: 0 }
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'Smart Attendance & Geo-Verification System',
      description: 'Engineered a scalable Java Spring Boot backend handling biometric and GPS geo-fenced check-ins with JWT token authentication, role-based access control (RBAC), and automated PDF report generation.',
      technologies: ['Java', 'Spring Boot', 'MySQL', 'JWT', 'Hibernate', 'REST APIs'],
      role: 'Backend Architect & Developer',
      link: 'https://github.com/alexkumar/smart-attendance-system',
      highlightSnippets: [
        'Designed normalized MySQL schemas with complex queries and indexing',
        'Built 24+ REST API endpoints documented via Swagger/OpenAPI',
        'Implemented Spring Security with stateless JWT authorization'
      ]
    },
    {
      id: 'proj-2',
      title: 'Campus Marketplace & Auction Microservices',
      description: 'Developed a decoupled campus marketplace with Spring Boot backend, payment mock gateway integration, and WebSocket notifications for real-time bid updates.',
      technologies: ['Java', 'Spring Boot', 'PostgreSQL', 'WebSockets', 'React', 'Git'],
      role: 'Full Stack Developer',
      link: 'https://github.com/alexkumar/campus-bidding-platform',
      highlightSnippets: [
        'Created transactional service layers guaranteeing ACID compliance for wallet transactions',
        'Integrated React front-end communicating seamlessly with Spring Boot REST services'
      ]
    }
  ],
  experience: [
    {
      id: 'exp-1',
      title: 'Software Development Intern (Java/Backend)',
      company: 'TechNovus Solutions',
      location: 'Hyderabad (Hybrid)',
      startDate: 'May 2024',
      endDate: 'August 2024',
      isCurrent: false,
      description: 'Collaborated in a team of 6 to optimize SQL queries, build Java Spring batch jobs for nightly data syncing, and resolve 30+ bug tickets.',
      technologies: ['Java', 'Spring Boot', 'MySQL', 'Git', 'Jira', 'JUnit']
    }
  ],
  certifications: [
    'Oracle Certified Associate, Java SE 8 Programmer (2024)',
    'HackerRank Java (5 Stars) & SQL (Gold Badge)'
  ],
  links: {
    github: 'https://github.com/alexkumar',
    linkedin: 'https://linkedin.com/in/alexkumar-dev',
    portfolio: 'https://alexkumar.dev'
  }
};

export const INITIAL_SAVED_ANSWERS: SavedAnswer[] = [
  {
    id: 'ans-1',
    questionPattern: 'notice period',
    category: 'General',
    answer: 'Immediate / 15 Days notice. Available to join right away.',
    lastUsed: '2026-09-18',
    useCount: 14
  },
  {
    id: 'ans-2',
    questionPattern: 'willing to relocate',
    category: 'Preferences',
    answer: 'Yes, I am fully open to relocating to Hyderabad, Bengaluru, Pune, or other major tech hubs.',
    lastUsed: '2026-09-19',
    useCount: 22
  },
  {
    id: 'ans-3',
    questionPattern: 'expected salary / CTC',
    category: 'Preferences',
    answer: 'Expecting ₹8 - ₹12 LPA based on role requirements and company standards, open to discussion.',
    lastUsed: '2026-09-19',
    useCount: 18
  },
  {
    id: 'ans-4',
    questionPattern: 'work authorization / sponsorship',
    category: 'WorkAuth',
    answer: 'Indian Citizen. Authorized to work full-time in India without requiring any visa sponsorship.',
    lastUsed: '2026-09-15',
    useCount: 20
  },
  {
    id: 'ans-5',
    questionPattern: 'years of Java experience',
    category: 'Technical',
    answer: '2 years of practical experience building Java & Spring Boot backends through internships, university projects, and certified coursework.',
    lastUsed: '2026-09-20',
    useCount: 15
  }
];

export const MOCK_JOBS: JobListing[] = [
  {
    id: 'job-01',
    title: 'Junior Java Developer (Backend)',
    company: 'Optum Global Solutions',
    companyLogo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&h=100&fit=crop&crop=faces',
    platform: 'LinkedIn',
    location: 'Hyderabad, India',
    workMode: 'Hybrid',
    salary: '₹8,50,000 - ₹12,00,000 / year',
    salaryMin: 850000,
    salaryMax: 1200000,
    currency: 'INR',
    experienceLevel: 'Fresher',
    jobType: 'Full-time',
    postedTime: '4 hours ago',
    postedTimestamp: Date.now() - 4 * 3600000,
    description: 'We are seeking a talented Junior Java Developer to join our Healthcare Technology Engineering group. You will design, develop, and maintain high-performance Spring Boot microservices, write clean REST APIs, optimize relational database queries, and collaborate in Agile sprints.',
    requiredSkills: ['Java', 'Spring Boot', 'REST APIs', 'MySQL', 'Git'],
    preferredSkills: ['AWS', 'Docker', 'JUnit', 'Kafka'],
    jobUrl: 'https://linkedin.com/jobs/view/optum-jr-java-dev-01',
    applicationUrl: 'https://optum.wd5.myworkdayjobs.com/careers/jr-java-dev',
    applicationMethod: 'Assisted',
    duplicateCount: 3,
    duplicateSources: ['LinkedIn', 'Naukri', 'Company Careers'],
    duplicateGroupId: 'grp-optum-01',
    department: 'Engineering Services',
    applicantCount: 42,
    qualityScore: 96,
    riskScore: 'Low',
    riskSignals: ['Verified enterprise company domain', 'Clear compensation range', 'Standard corporate recruitment workflow'],
    qualityMetrics: {
      descriptionCompleteness: 98,
      skillsClarity: 95,
      salaryTransparency: 100,
      companyVerified: true,
      duplicateLikelihood: 85
    }
  },
  {
    id: 'job-02',
    title: 'Associate Software Engineer - Java / Spring Boot',
    company: 'Capgemini Technology Services',
    companyLogo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&h=100&fit=crop&crop=faces',
    platform: 'Naukri',
    location: 'Bengaluru, India',
    workMode: 'Hybrid',
    salary: '₹7,00,000 - ₹9,50,000 / year',
    salaryMin: 700000,
    salaryMax: 950000,
    currency: 'INR',
    experienceLevel: 'Fresher',
    jobType: 'Full-time',
    postedTime: '12 hours ago',
    postedTimestamp: Date.now() - 12 * 3600000,
    description: 'Looking for 2024/2025 graduates with strong foundation in Core Java, OOP principles, Spring Boot, Hibernate, and SQL. You will build enterprise web services, write unit tests, and integrate with relational databases.',
    requiredSkills: ['Java', 'Spring Boot', 'Hibernate / JPA', 'MySQL', 'REST APIs'],
    preferredSkills: ['Microservices', 'Git', 'Maven'],
    jobUrl: 'https://naukri.com/job-listings-associate-software-engineer-capgemini',
    applicationUrl: 'https://capgemini.com/careers/job-02',
    applicationMethod: 'Direct',
    duplicateCount: 2,
    duplicateSources: ['Naukri', 'LinkedIn'],
    duplicateGroupId: 'grp-capgemini-02',
    department: 'Financial Services Tech',
    applicantCount: 78,
    qualityScore: 92,
    riskScore: 'Low',
    riskSignals: ['Established multinational IT consultancy', 'Standard salary band'],
    qualityMetrics: {
      descriptionCompleteness: 90,
      skillsClarity: 92,
      salaryTransparency: 85,
      companyVerified: true,
      duplicateLikelihood: 70
    }
  },
  {
    id: 'job-03',
    title: 'Software Developer (Backend Java & Cloud)',
    company: 'PhonePe',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop&crop=faces',
    platform: 'Company Careers',
    location: 'Bengaluru / Remote',
    workMode: 'Remote',
    salary: '₹14,00,000 - ₹18,00,000 / year',
    salaryMin: 1400000,
    salaryMax: 1800000,
    currency: 'INR',
    experienceLevel: '0-1 years',
    jobType: 'Full-time',
    postedTime: '1 day ago',
    postedTimestamp: Date.now() - 24 * 3600000,
    description: 'PhonePe is looking for backend engineers who love low latency systems. You will build highly scalable distributed microservices handling millions of financial transactions per second, leverage Java 21, Spring Boot, PostgreSQL, Kafka, and AWS cloud.',
    requiredSkills: ['Java', 'Spring Boot', 'PostgreSQL', 'REST APIs', 'AWS', 'Apache Kafka'],
    preferredSkills: ['Redis', 'Docker', 'Kubernetes', 'Distributed Systems'],
    jobUrl: 'https://phonepe.com/careers/backend-eng-01',
    applicationUrl: 'https://phonepe.com/careers/apply/backend-eng-01',
    applicationMethod: 'Assisted',
    duplicateCount: 1,
    duplicateSources: ['Company Careers'],
    department: 'Payments Platform',
    applicantCount: 112,
    qualityScore: 98,
    riskScore: 'Low',
    riskSignals: ['Direct company career portal', 'Transparent salary and high engineering bar'],
    qualityMetrics: {
      descriptionCompleteness: 100,
      skillsClarity: 98,
      salaryTransparency: 95,
      companyVerified: true,
      duplicateLikelihood: 10
    }
  },
  {
    id: 'job-04',
    title: 'Java Full Stack Developer Trainee / Fresher',
    company: 'Unstop Campus Connect - Infosys',
    companyLogo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop&crop=faces',
    platform: 'Unstop',
    location: 'Hyderabad / Mysuru',
    workMode: 'On-site',
    salary: '₹6,50,000 - ₹8,00,000 / year',
    salaryMin: 650000,
    salaryMax: 800000,
    currency: 'INR',
    experienceLevel: 'Fresher',
    jobType: 'Full-time',
    postedTime: '2 days ago',
    postedTimestamp: Date.now() - 48 * 3600000,
    description: 'National recruitment drive on Unstop for 2025/2026 graduates. Roles in Java backend engineering, Spring Boot services, React frontend development, and Database engineering.',
    requiredSkills: ['Java', 'SQL', 'REST APIs', 'Git', 'JavaScript / TypeScript'],
    preferredSkills: ['Spring Boot', 'React', 'Problem Solving'],
    jobUrl: 'https://unstop.com/jobs/infosys-java-trainee-2025',
    applicationUrl: 'https://unstop.com/jobs/infosys-java-trainee-2025/apply',
    applicationMethod: 'EasyApply',
    duplicateCount: 1,
    duplicateSources: ['Unstop'],
    department: 'Campus Hiring',
    applicantCount: 340,
    qualityScore: 89,
    riskScore: 'Low',
    riskSignals: ['Verified hackathon/campus platform hosting'],
    qualityMetrics: {
      descriptionCompleteness: 85,
      skillsClarity: 88,
      salaryTransparency: 80,
      companyVerified: true,
      duplicateLikelihood: 20
    }
  },
  {
    id: 'job-05',
    title: 'Backend Engineer - Java & Microservices',
    company: 'Razorpay',
    companyLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop&crop=faces',
    platform: 'LinkedIn',
    location: 'Bengaluru / Remote',
    workMode: 'Remote',
    salary: '₹12,00,000 - ₹16,00,000 / year',
    salaryMin: 1200000,
    salaryMax: 1600000,
    currency: 'INR',
    experienceLevel: '0-1 years',
    jobType: 'Full-time',
    postedTime: '18 hours ago',
    postedTimestamp: Date.now() - 18 * 3600000,
    description: 'Work on payment checkout engines, idempotency, webhook dispatchers, and resilient database queries using Java, Spring Boot, MySQL, Redis, and message queues.',
    requiredSkills: ['Java', 'Spring Boot', 'MySQL', 'REST APIs', 'Git'],
    preferredSkills: ['AWS', 'Apache Kafka', 'Docker', 'Redis'],
    jobUrl: 'https://linkedin.com/jobs/view/razorpay-backend-eng',
    applicationUrl: 'https://razorpay.com/jobs/backend-01',
    applicationMethod: 'Assisted',
    duplicateCount: 2,
    duplicateSources: ['LinkedIn', 'Company Careers'],
    duplicateGroupId: 'grp-razorpay-05',
    department: 'Merchant Platform',
    applicantCount: 65,
    qualityScore: 95,
    riskScore: 'Low',
    riskSignals: ['Tier-1 Fintech brand', 'Detailed engineering challenges described'],
    qualityMetrics: {
      descriptionCompleteness: 96,
      skillsClarity: 94,
      salaryTransparency: 90,
      companyVerified: true,
      duplicateLikelihood: 65
    }
  },
  {
    id: 'job-06',
    title: 'Entry Level Java Backend Developer',
    company: 'RapidTech Solutions (Staffing)',
    platform: 'Naukri',
    location: 'Remote',
    workMode: 'Remote',
    salary: '₹18,00,000 - ₹24,00,000 / year (Suspiciously High)',
    salaryMin: 1800000,
    salaryMax: 2400000,
    currency: 'INR',
    experienceLevel: 'Fresher',
    jobType: 'Full-time',
    postedTime: '3 hours ago',
    postedTimestamp: Date.now() - 3 * 3600000,
    description: 'Urgent hiring! Guaranteed job placement for freshers. Must deposit ₹5,000 security for background verification laptop kit. Contact via personal Telegram handle @rapid_tech_hr.',
    requiredSkills: ['Java', 'Spring Boot'],
    preferredSkills: ['None'],
    jobUrl: 'https://naukri.com/job-listings-urgent-java-rapidtech',
    applicationUrl: 'https://telegram.me/rapid_tech_hr',
    applicationMethod: 'External',
    duplicateCount: 1,
    duplicateSources: ['Naukri'],
    applicantCount: 19,
    qualityScore: 32,
    riskScore: 'High',
    riskSignals: [
      '🔴 Upfront security deposit / fee requested (₹5,000)',
      '🔴 Telegram / WhatsApp off-platform contact requested',
      '🔴 Unusually inflated salary for 0 experience',
      '🔴 Guaranteed-job placement phrasing used'
    ],
    qualityMetrics: {
      descriptionCompleteness: 40,
      skillsClarity: 30,
      salaryTransparency: 20,
      companyVerified: false,
      duplicateLikelihood: 5
    }
  },
  {
    id: 'job-07',
    title: 'Junior Java / Cloud Software Engineer',
    company: 'Cognizant Technology Solutions',
    companyLogo: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=100&h=100&fit=crop&crop=faces',
    platform: 'LinkedIn',
    location: 'Hyderabad, India',
    workMode: 'Hybrid',
    salary: '₹7,50,000 - ₹10,00,000 / year',
    salaryMin: 750000,
    salaryMax: 1000000,
    currency: 'INR',
    experienceLevel: 'Fresher',
    jobType: 'Full-time',
    postedTime: '1 day ago',
    postedTimestamp: Date.now() - 26 * 3600000,
    description: 'Join Cognizant Digital Engineering practice. Developing microservices in Spring Boot, collaborating with cloud DevOps teams, and writing automated unit/integration test suites.',
    requiredSkills: ['Java', 'Spring Boot', 'REST APIs', 'MySQL', 'Git'],
    preferredSkills: ['AWS', 'Docker', 'PostgreSQL'],
    jobUrl: 'https://linkedin.com/jobs/view/cognizant-jr-cloud-eng',
    applicationUrl: 'https://cognizant.com/careers/job-07',
    applicationMethod: 'Assisted',
    duplicateCount: 3,
    duplicateSources: ['LinkedIn', 'Naukri', 'Company Careers'],
    duplicateGroupId: 'grp-cognizant-07',
    department: 'Cloud Services',
    applicantCount: 95,
    qualityScore: 93,
    riskScore: 'Low',
    riskSignals: ['Enterprise verified ATS portal'],
    qualityMetrics: {
      descriptionCompleteness: 92,
      skillsClarity: 90,
      salaryTransparency: 88,
      companyVerified: true,
      duplicateLikelihood: 80
    }
  },
  {
    id: 'job-08',
    title: 'Full Stack Java & React Intern',
    company: 'Accenture India',
    companyLogo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&h=100&fit=crop&crop=faces',
    platform: 'Unstop',
    location: 'Hyderabad, India',
    workMode: 'Hybrid',
    salary: '₹35,000 - ₹45,000 / month Stipend (PPO Available: ₹8 LPA)',
    salaryMin: 420000,
    salaryMax: 800000,
    currency: 'INR',
    experienceLevel: 'Fresher',
    jobType: 'Internship',
    postedTime: '1 day ago',
    postedTimestamp: Date.now() - 30 * 3600000,
    description: '6-month full-time internship for final year students. Build full stack web applications with Java, Spring Boot, React, and MySQL database layers with possibility of conversion to full-time Associate Software Engineer.',
    requiredSkills: ['Java', 'Spring Boot', 'React', 'MySQL', 'REST APIs'],
    preferredSkills: ['Git', 'HTML/CSS', 'JavaScript / TypeScript'],
    jobUrl: 'https://unstop.com/internships/accenture-java-react-intern',
    applicationUrl: 'https://accenture.com/careers/intern-08',
    applicationMethod: 'EasyApply',
    duplicateCount: 2,
    duplicateSources: ['Unstop', 'LinkedIn'],
    duplicateGroupId: 'grp-accenture-08',
    department: 'Advanced Technology Centers',
    applicantCount: 210,
    qualityScore: 94,
    riskScore: 'Low',
    riskSignals: ['Verified corporate internship program'],
    qualityMetrics: {
      descriptionCompleteness: 94,
      skillsClarity: 95,
      salaryTransparency: 92,
      companyVerified: true,
      duplicateLikelihood: 60
    }
  }
];

export const MOCK_APPLICATIONS: ApplicationRecord[] = [
  {
    id: 'app-01',
    jobId: 'job-01',
    job: MOCK_JOBS[0],
    status: 'Ready',
    matchScore: 92,
    dateCreated: '2026-09-19',
    lastUpdated: '2026-09-20',
    notes: 'Cover letter prepared with focus on Smart Attendance system & REST APIs. Saved answers matched 100%.',
    answersUsed: [
      { question: 'Notice Period', answer: 'Immediate / 15 Days', source: 'AnswerMemory' },
      { question: 'Expected CTC', answer: '₹8.5 - ₹12 LPA', source: 'AnswerMemory' },
      { question: 'Years of Java experience', answer: '2 years evidenced across academic & internship projects', source: 'TruthGuardedAI' }
    ],
    auditTrail: [
      { timestamp: '2026-09-19 14:20', action: 'Discovered', details: 'Aggregated via LinkedIn Adapter and deduplicated from Naukri', userConfirmed: false },
      { timestamp: '2026-09-19 14:22', action: 'AI Match Calculated', details: '92% overall match with verified skills in Java, Spring Boot, MySQL', userConfirmed: false },
      { timestamp: '2026-09-20 10:15', action: 'Application Prepared', details: 'Tailored resume & copilot generated answers', userConfirmed: true }
    ]
  },
  {
    id: 'app-02',
    jobId: 'job-02',
    job: MOCK_JOBS[1],
    status: 'Applied',
    matchScore: 89,
    dateCreated: '2026-09-18',
    dateApplied: '2026-09-18',
    lastUpdated: '2026-09-19',
    notes: 'Direct application submitted on Capgemini portal after reviewing Truth Guard compliance.',
    answersUsed: [
      { question: 'Willing to relocate to Bengaluru', answer: 'Yes', source: 'AnswerMemory' }
    ],
    auditTrail: [
      { timestamp: '2026-09-18 11:00', action: 'Discovered', details: 'Aggregated via Naukri Adapter', userConfirmed: false },
      { timestamp: '2026-09-18 11:30', action: 'Submitted', details: 'User confirmed application submission', userConfirmed: true }
    ]
  },
  {
    id: 'app-03',
    jobId: 'job-07',
    job: MOCK_JOBS[6],
    status: 'Assessment',
    matchScore: 91,
    dateCreated: '2026-09-15',
    dateApplied: '2026-09-16',
    lastUpdated: '2026-09-20',
    notes: 'Online Coding Assessment link received for Core Java & Data Structures.',
    answersUsed: [],
    auditTrail: [
      { timestamp: '2026-09-15 09:00', action: 'Discovered', details: 'LinkedIn Adapter', userConfirmed: false },
      { timestamp: '2026-09-16 16:00', action: 'Submitted', details: 'Submitted with customized summary', userConfirmed: true },
      { timestamp: '2026-09-19 18:00', action: 'Status Changed to Assessment', details: 'Received HackerRank test link via email', userConfirmed: true }
    ]
  },
  {
    id: 'app-04',
    jobId: 'job-08',
    job: MOCK_JOBS[7],
    status: 'Interview',
    matchScore: 94,
    dateCreated: '2026-09-12',
    dateApplied: '2026-09-13',
    lastUpdated: '2026-09-20',
    notes: 'Technical Round 1 scheduled for tomorrow at 3:00 PM IST (Spring Boot & MySQL Architecture).',
    answersUsed: [],
    auditTrail: [
      { timestamp: '2026-09-12 10:00', action: 'Discovered', details: 'Unstop Adapter', userConfirmed: false },
      { timestamp: '2026-09-13 14:00', action: 'Applied', details: 'One-click EasyApply via verified portal', userConfirmed: true },
      { timestamp: '2026-09-18 11:00', action: 'Interview Scheduled', details: 'Technical interview calendar invite confirmed', userConfirmed: true }
    ]
  }
];

export const MOCK_SKILL_GAPS: SkillGapItem[] = [
  {
    skill: 'AWS (Amazon Web Services)',
    category: 'Cloud',
    frequencyInTargetJobs: 64,
    importance: 'Critical',
    difficulty: 'Medium',
    userStatus: 'Not in Resume',
    learningHours: 20,
    topJobRolesRequiring: ['Java Backend Developer', 'Cloud Software Engineer', 'Microservices Developer']
  },
  {
    skill: 'Apache Kafka',
    category: 'Tools',
    frequencyInTargetJobs: 48,
    importance: 'Critical',
    difficulty: 'Advanced',
    userStatus: 'Not in Resume',
    learningHours: 25,
    topJobRolesRequiring: ['Distributed Backend Engineer', 'High-throughput Java Developer']
  },
  {
    skill: 'Docker & Containers',
    category: 'Tools',
    frequencyInTargetJobs: 52,
    importance: 'Recommended',
    difficulty: 'Easy',
    userStatus: 'Found in Projects',
    learningHours: 12,
    topJobRolesRequiring: ['Full Stack Developer', 'Cloud Backend Engineer']
  },
  {
    skill: 'Redis Caching',
    category: 'Databases',
    frequencyInTargetJobs: 38,
    importance: 'Recommended',
    difficulty: 'Easy',
    userStatus: 'Not in Resume',
    learningHours: 10,
    topJobRolesRequiring: ['Fintech Backend Developer', 'High Scale Microservices']
  },
  {
    skill: 'JUnit 5 & Mockito (Testing)',
    category: 'Frameworks',
    frequencyInTargetJobs: 42,
    importance: 'Bonus',
    difficulty: 'Easy',
    userStatus: 'Basic Mention',
    learningHours: 8,
    topJobRolesRequiring: ['Enterprise Java Engineer']
  }
];

export const MOCK_CAREER_ROADMAP: RoadmapMilestone[] = [
  {
    id: 'road-1',
    week: 1,
    title: 'Cloud Fundamentals: AWS for Java Developers',
    skillFocus: 'AWS (EC2, S3, RDS, IAM)',
    description: 'Understand how Spring Boot applications connect with managed cloud infrastructure, configure AWS RDS for MySQL, and deploy a containerized service.',
    difficulty: 'Beginner',
    estimatedHours: 8,
    prerequisites: ['Spring Boot', 'MySQL Basics'],
    whyLearn: 'Appears in 64% of high-paying Java Developer postings analyzed in your search.',
    suggestedProject: {
      title: 'Deploy Smart Attendance to AWS ECS & RDS',
      description: 'Host your existing Spring Boot REST API on AWS Elastic Container Service with managed PostgreSQL/MySQL database.',
      deliverable: 'Live API URL + Architecture diagram in GitHub README'
    },
    topics: [
      { name: 'AWS IAM Roles & Security Best Practices', completed: true },
      { name: 'RDS MySQL Database provisioning & connection strings', completed: true },
      { name: 'S3 Buckets for user document/image storage', completed: false },
      { name: 'Deploying Spring Boot JAR via Elastic Beanstalk / ECS', completed: false }
    ],
    completed: false
  },
  {
    id: 'road-2',
    week: 2,
    title: 'Containerization with Docker & Docker Compose',
    skillFocus: 'Docker, Multi-stage builds, Container Networking',
    description: 'Learn how to package Spring Boot and database services into reproducible containers with environment variables and multi-container composition.',
    difficulty: 'Beginner',
    estimatedHours: 10,
    prerequisites: ['Git', 'Linux Basics'],
    whyLearn: 'Essential industry standard for microservices deployment and CI/CD pipelines.',
    suggestedProject: {
      title: 'Multi-container Full Stack Composition',
      description: 'Create a single docker-compose.yml running Spring Boot API, React frontend, and MySQL with volume persistence.',
      deliverable: 'One-command `docker compose up` runnable repository'
    },
    topics: [
      { name: 'Writing optimized multi-stage Dockerfiles for Java 21', completed: false },
      { name: 'Docker Compose networking & persistent volumes', completed: false },
      { name: 'Environment variables & secrets management', completed: false }
    ],
    completed: false
  },
  {
    id: 'road-3',
    week: 3,
    title: 'Event-Driven Architecture with Apache Kafka',
    skillFocus: 'Kafka Producer/Consumer, Topics, Partitions, Consumer Groups',
    description: 'Build asynchronous event streams to decouple high-volume backend workflows like email notifications and audit logs.',
    difficulty: 'Advanced',
    estimatedHours: 14,
    prerequisites: ['Java Concurrency', 'Spring Boot REST'],
    whyLearn: 'Required in top Fintech and high-scale product companies (PhonePe, Razorpay, Amazon).',
    suggestedProject: {
      title: 'Async Notification & Audit Dispatcher Microservice',
      description: 'Publish payment/attendance events to Kafka topics and consume them asynchronously to generate analytics and email alerts.',
      deliverable: 'Spring Cloud Stream Kafka integration demo'
    },
    topics: [
      { name: 'Kafka Architecture: Brokers, Topics, Offsets', completed: false },
      { name: 'Spring for Apache Kafka (Producer & @KafkaListener)', completed: false },
      { name: 'Handling poison pills, deserialization errors & retries', completed: false }
    ],
    completed: false
  },
  {
    id: 'road-4',
    week: 4,
    title: 'Portfolio Showcase: Production-Grade Cloud Microservice',
    skillFocus: 'Spring Boot + AWS + Kafka + Docker + Swagger',
    description: 'Synthesize everything learned into a verified portfolio project with live links, automated tests, and GitHub Actions CI/CD.',
    difficulty: 'Intermediate',
    estimatedHours: 16,
    prerequisites: ['Weeks 1, 2, and 3 topics'],
    whyLearn: 'Provides undeniable proof of work that moves your resume to the top 5% of candidate shortlists.',
    suggestedProject: {
      title: 'Scalable Fintech Ledger Microservice with Kafka & AWS',
      description: 'End-to-end resilient microservice with idempotency keys, distributed caching, and cloud monitoring.',
      deliverable: 'Public GitHub Repo + Live Swagger UI Docs + Video Walkthrough'
    },
    topics: [
      { name: 'Spring Boot 3.3 with Java 21 Virtual Threads', completed: false },
      { name: 'Automated GitHub Actions CI test & Docker build workflow', completed: false },
      { name: 'Prometheus & Grafana metrics instrumentation', completed: false }
    ],
    completed: false
  }
];

export const MOCK_MARKET_SKILLS: MarketSkillDemand[] = [
  { skill: 'Java / Core Java', percentage: 88, jobCount: 218, averageSalary: '₹9.2 LPA', growthTrend: '+12%' },
  { skill: 'Spring Boot', percentage: 76, jobCount: 188, averageSalary: '₹10.5 LPA', growthTrend: '+18%' },
  { skill: 'REST APIs & Microservices', percentage: 74, jobCount: 182, averageSalary: '₹10.8 LPA', growthTrend: '+15%' },
  { skill: 'AWS Cloud Services', percentage: 64, jobCount: 158, averageSalary: '₹12.4 LPA', growthTrend: '+24%' },
  { skill: 'MySQL / PostgreSQL (RDBMS)', percentage: 68, jobCount: 168, averageSalary: '₹9.0 LPA', growthTrend: '+8%' },
  { skill: 'Docker / Containers', percentage: 52, jobCount: 128, averageSalary: '₹11.2 LPA', growthTrend: '+20%' },
  { skill: 'Apache Kafka', percentage: 46, jobCount: 114, averageSalary: '₹13.6 LPA', growthTrend: '+24%' },
  { skill: 'Redis In-Memory Store', percentage: 38, jobCount: 94, averageSalary: '₹12.8 LPA', growthTrend: '+14%' },
  { skill: 'React / Frontend Basics', percentage: 40, jobCount: 98, averageSalary: '₹9.5 LPA', growthTrend: '+5%' },
  { skill: 'Git & GitHub Workflows', percentage: 92, jobCount: 227, averageSalary: '₹8.8 LPA', growthTrend: '+8%' }
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: '12 New High-Match Jobs Discovered',
    message: 'Jobs from Optum, Razorpay, and Cognizant match your Java & Spring Boot profile above 90%.',
    type: 'job_alert',
    timestamp: '15 mins ago',
    read: false,
    actionUrl: '/jobs'
  },
  {
    id: 'notif-2',
    title: 'Interview Scheduled Tomorrow at 3:00 PM',
    message: 'Accenture India - Technical Interview Round 1 (Spring Boot & Microservices).',
    type: 'interview_reminder',
    timestamp: '2 hours ago',
    read: false,
    actionUrl: '/applications'
  },
  {
    id: 'notif-3',
    title: 'Market Demand Alert: AWS + Kafka Surge',
    message: '64% of newly analyzed Java roles in Hyderabad/Remote now request AWS experience.',
    type: 'skill_trend',
    timestamp: '1 day ago',
    read: true,
    actionUrl: '/insights'
  },
  {
    id: 'notif-4',
    title: 'Application Ready for Review',
    message: 'Optum Global Solutions application prepared with verified project evidence.',
    type: 'application_update',
    timestamp: '2 days ago',
    read: true,
    actionUrl: '/copilot'
  }
];
