import { ResumeData, CoverLetterData, TemplateId, Theme } from './types';

export const EMPTY_PERSONAL_INFO = {
  fullName: 'John Doe',
  jobTitle: 'Senior React Developer',
  email: 'john.doe@email.com',
  phone: '123-456-7890',
  address: 'New York, USA',
  linkedin: 'linkedin.com/in/johndoe',
  website: 'johndoe.dev',
};

export const EMPTY_EXPERIENCE = {
  id: '',
  jobTitle: '',
  company: '',
  location: '',
  startDate: '',
  endDate: '',
  description: '• Developed and maintained web applications using React and TypeScript.\n• Collaborated with cross-functional teams to deliver high-quality software.\n• Implemented responsive UI components with Tailwind CSS.',
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
  summary: 'A highly motivated Senior React Developer with over 5 years of experience in building scalable and performant web applications. Proficient in modern frontend technologies including React, TypeScript, and Tailwind CSS. Passionate about creating exceptional user experiences and writing clean, maintainable code.',
  experience: [
    {
      id: 'exp1',
      jobTitle: 'Senior Frontend Developer',
      company: 'Tech Solutions Inc.',
      location: 'San Francisco, CA',
      startDate: 'Jan 2020',
      endDate: 'Present',
      description: '• Led the development of a new client-facing dashboard, improving user engagement by 25%.\n• Mentored junior developers and conducted code reviews to ensure code quality and consistency.\n• Optimized application performance, reducing load times by 40%.',
    },
    {
      id: 'exp2',
      jobTitle: 'Frontend Developer',
      company: 'Web Innovators',
      location: 'Boston, MA',
      startDate: 'Jun 2017',
      endDate: 'Dec 2019',
      description: '• Built reusable components and frontend libraries for future use.\n• Translated designs and wireframes into high-quality code.\n• Worked with product managers to define feature requirements.',
    }
  ],
  education: [
    {
      id: 'edu1',
      degree: 'B.S. in Computer Science',
      institution: 'State University',
      location: 'New York, NY',
      startDate: 'Sep 2013',
      endDate: 'May 2017',
      description: 'Graduated with honors.',
    },
  ],
  skills: [
    { id: 'skill1', name: 'React', level: 'Expert' },
    { id: 'skill2', name: 'TypeScript', level: 'Expert' },
    { id: 'skill3', name: 'JavaScript', level: 'Expert' },
    { id: 'skill4', name: 'Tailwind CSS', level: 'Advanced' },
    { id: 'skill5', name: 'Node.js', level: 'Intermediate' },
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