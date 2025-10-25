import { ResumeData, CoverLetterData, TemplateId, Theme, FontFamily, LineHeight, FormattingOptions } from './types';

export const EMPTY_PERSONAL_INFO = {
  fullName: '',
  jobTitle: '',
  email: '',
  phone: '',
  address: '',
  linkedin: '',
  website: '',
};

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
  personalInfo: EMPTY_PERSONAL_INFO,
  summary: '',
  experience: [
    { ...EMPTY_EXPERIENCE, id: 'exp1' },
  ],
  education: [
    { ...EMPTY_EDUCATION, id: 'edu1' },
  ],
  skills: [
    { ...EMPTY_SKILL, id: 'skill1' },
    { ...EMPTY_SKILL, id: 'skill2' },
    { ...EMPTY_SKILL, id: 'skill3' },
  ],
};

export const EMPTY_COVER_LETTER: CoverLetterData = {
  recipientName: '',
  recipientCompany: '',
  date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  body: '',
  senderName: '',
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

export const BLOG_POSTS = [
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

export const AFFILIATE_BANNERS = [
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