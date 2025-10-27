import { ResumeData, CoverLetterData, TemplateId, Theme, FontFamily, LineHeight, FormattingOptions, BlogPost, AffiliateBanner } from './types';

export const EMPTY_EXPERIENCE = {
  id: '',
  jobTitle: '',
  company: '',
  location: '',
  startDate: '',
  endDate: '',
  description: '',
};

export const EMPTY_EDUCATION = {
  id: '',
  degree: '',
  institution: '',
  location: '',
  startDate: '',
  endDate: '',
  description: '',
};

export const EMPTY_SKILL = {
  id: '',
  name: '',
  level: 'Expert' as const,
};

export const EMPTY_RESUME: ResumeData = {
  personalInfo: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    address: '',
    linkedin: '',
    website: '',
    profilePicture: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
};

export const EMPTY_COVER_LETTER: CoverLetterData = {
  recipientName: '',
  recipientCompany: '',
  date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  body: '',
  senderName: '',
};


export const SAMPLE_RESUME: ResumeData = {
  personalInfo: {
    fullName: 'Alexandra Miller',
    jobTitle: 'Senior Product Manager',
    email: 'alex.miller@example.com',
    phone: '(555) 123-4567',
    address: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexandramiller',
    website: 'alexmiller.dev',
    profilePicture: '',
  },
  summary: 'Seasoned Senior Product Manager with over 8 years of experience leading cross-functional teams to deliver innovative software solutions. Proven ability to drive product strategy from conception to launch, resulting in significant user growth and revenue increase. Passionate about creating user-centric products that solve real-world problems.',
  experience: [
    {
      id: 'exp1',
      jobTitle: 'Senior Product Manager',
      company: 'Innovatech Solutions',
      location: 'San Francisco, CA',
      startDate: 'Jan 2020',
      endDate: 'Present',
      description: '• Lead the product roadmap and strategy for a suite of B2B SaaS products, resulting in a 40% increase in annual recurring revenue.\n• Conducted comprehensive user research and market analysis to identify new feature opportunities, leading to a 25% uplift in user engagement.\n• Championed agile methodologies, improving team velocity by 30% and fostering a culture of continuous improvement.',
    },
    {
      id: 'exp2',
      jobTitle: 'Product Manager',
      company: 'Digital Ventures',
      location: 'Palo Alto, CA',
      startDate: 'Jun 2016',
      endDate: 'Dec 2019',
      description: '• Managed the entire lifecycle of a consumer-facing mobile application, growing the user base from 100k to over 1.5 million.\n• Developed and prioritized product backlogs, working closely with engineering and design teams to ensure timely delivery of high-quality features.\n• Utilized A/B testing and data analysis to inform product decisions, which increased user retention by 15%.',
    },
  ],
  education: [
    {
      id: 'edu1',
      degree: 'Master of Business Administration (MBA)',
      institution: 'Stanford University',
      location: 'Stanford, CA',
      startDate: 'Aug 2014',
      endDate: 'May 2016',
      description: '',
    },
     {
      id: 'edu2',
      degree: 'B.S. in Computer Science',
      institution: 'University of California, Berkeley',
      location: 'Berkeley, CA',
      startDate: 'Aug 2010',
      endDate: 'May 2014',
      description: '',
    },
  ],
  skills: [
    { id: 'skill1', name: 'Product Roadmapping', level: 'Expert' },
    { id: 'skill2', name: 'Agile Methodologies', level: 'Expert' },
    { id: 'skill3', name: 'JIRA & Confluence', level: 'Advanced' },
    { id: 'skill4', name: 'User Research', level: 'Expert' },
    { id: 'skill5', name: 'Market Analysis', level: 'Advanced' },
    { id: 'skill6', name: 'A/B Testing', level: 'Advanced' },
    { id: 'skill7', name: 'SQL', level: 'Intermediate' },
  ],
};

export const SAMPLE_COVER_LETTER: CoverLetterData = {
  recipientName: 'Hiring Manager',
  recipientCompany: 'NextGen Corp',
  date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  body: `Dear Hiring Manager,

I am writing to express my enthusiastic interest in the Senior Product Manager position at NextGen Corp, which I discovered through LinkedIn. With my extensive experience in driving product strategy and leading high-performing teams in the tech industry, I am confident that I possess the skills and vision to contribute significantly to your company's success.

Throughout my career, I have demonstrated a consistent ability to translate complex user needs into successful, market-leading products. At Innovatech Solutions, I led the development of a B2B SaaS suite that resulted in a 40% increase in ARR. My approach is always data-driven and user-centric, a philosophy I believe aligns perfectly with NextGen Corp's reputation for innovation.

I am particularly impressed by NextGen Corp's work in [Mention a specific project or value of the company] and am eager to bring my expertise in agile development and market analysis to your team. I look forward to the possibility of discussing how my background can help drive your product roadmap forward.`,
  senderName: 'Alexandra Miller',
};

export const TEMPLATES: { id: TemplateId; name: string; imageUrl: string }[] = [
  { id: 'classic', name: 'Classic', imageUrl: 'https://picsum.photos/seed/classic-template/200/280' },
  { id: 'modern', name: 'Modern', imageUrl: 'https://picsum.photos/seed/modern-template/200/280' },
  { id: 'creative', name: 'Creative', imageUrl: 'https://picsum.photos/seed/creative-template/200/280' },
];

export const THEMES: Theme[] = [
    {
        id: 'default',
        name: 'Default',
        colors: { primary: '#2563EB', secondary: '#DBEAFE', background: '#FFFFFF', text: '#1F2937' }
    },
    {
        id: 'forest',
        name: 'Forest',
        colors: { primary: '#166534', secondary: '#D1FAE5', background: '#FFFFFF', text: '#1F2937' }
    },
    {
        id: 'ruby',
        name: 'Ruby',
        colors: { primary: '#BE123C', secondary: '#FEE2E2', background: '#FFFFFF', text: '#1F2937' }
    },
    {
        id: 'slate',
        name: 'Slate',
        colors: { primary: '#475569', secondary: '#E2E8F0', background: '#FFFFFF', text: '#1F2937' }
    },
    {
        id: 'plum',
        name: 'Plum',
        colors: { primary: '#7E22CE', secondary: '#F3E8FF', background: '#FFFFFF', text: '#1F2937' }
    }
];

export const DEFAULT_BLOG_POSTS: BlogPost[] = [
    {
      id: 1,
      title: 'How to Write a Resume That Gets Noticed in 2024',
      excerpt: 'Learn the top strategies to make your resume stand out from the crowd and land your dream job.',
      author: 'Jane Smith',
      date: 'July 15, 2024',
    },
    {
      id: 2,
      title: 'The Power of Keywords: Optimizing Your Resume for ATS',
      excerpt: 'Applicant Tracking Systems (ATS) are the first gatekeeper. Here\'s how to beat them.',
      author: 'John Doe',
      date: 'July 10, 2024',
    },
    {
      id: 3,
      title: '5 Common Resume Mistakes and How to Avoid Them',
      excerpt: 'Don\'t let simple errors cost you an interview. We break down the most common pitfalls.',
      author: 'Emily White',
      date: 'July 5, 2024',
    },
];

export const DEFAULT_AFFILIATE_BANNERS: AffiliateBanner[] = [
    {
        name: 'Grammarly',
        url: 'https://www.grammarly.com/',
        imageUrl: 'https://picsum.photos/seed/grammarly/300/100',
        description: 'Perfect your writing with Grammarly. Ensure your resume is error-free.'
    },
    {
        name: 'LinkedIn Learning',
        url: 'https://www.linkedin.com/learning/',
        imageUrl: 'https://picsum.photos/seed/linkedin/300/100',
        description: 'Upskill with thousands of courses on LinkedIn Learning.'
    },
    {
        name: 'Coursera',
        url: 'https://www.coursera.org/',
        imageUrl: 'https://picsum.photos/seed/coursera/300/100',
        description: 'Learn from top universities and companies with Coursera.'
    }
];

export const FONT_OPTIONS: { id: FontFamily; name: string; css: string }[] = [
    { id: 'serif', name: 'Serif', css: 'font-serif' },
    { id: 'sans', name: 'Sans-serif', css: 'font-sans' },
    { id: 'mono', name: 'Monospace', css: 'font-mono' },
];

export const LINE_HEIGHT_OPTIONS: { id: LineHeight; name: string; css: string }[] = [
    { id: 'sm', name: 'Compact', css: 'leading-snug' },
    { id: 'md', name: 'Normal', css: 'leading-relaxed' },
    { id: 'lg', name: 'Spacious', css: 'leading-loose' },
];

export const DEFAULT_FORMATTING: FormattingOptions = {
    fontFamily: 'sans',
    lineHeight: 'md'
};

// For this client-side app, this simulates a pre-configured admin email address
export const PRE_CONFIGURED_ADMIN_EMAIL = 'admin@resumegen.com';
// This is the fallback password if one is not set in localStorage by the reset mechanism
export const DEFAULT_ADMIN_PASSWORD = 'admin123';