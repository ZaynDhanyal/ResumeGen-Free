



export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  website: string;
  profilePicture: string;
  nationality: string;
}

export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface CustomDetail {
  id: string;
  label: string;
  value: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  customDetails: CustomDetail[];
}

export interface CoverLetterData {
  recipientName: string;
  recipientCompany: string;
  date: string;
  body: string;
  senderName: string;
}

export type TemplateId = 'classic' | 'modern' | 'creative' | 'tech' | 'minimalist' | 'elegant' | 'infographic';

export interface KeywordAnalysis {
  missingKeywords: string[];
  presentKeywords: string[];
}

export type ThemeId = 'default' | 'forest' | 'ruby' | 'slate' | 'plum' | 'sunset' | 'ocean' | 'mint' | 'mustard' | 'charcoal';

export interface Theme {
    id: ThemeId;
    name: string;
    colors: {
        primary: string;
        secondary: string;
        background: string;
        text: string;
    };
}

export type FontFamily = 'serif' | 'sans' | 'mono' | 'lato' | 'merriweather' | 'roboto-slab' | 'open-sans' | 'montserrat';
export type LineHeight = 'sm' | 'md' | 'lg';

export interface FormattingOptions {
  fontFamily: FontFamily;
  lineHeight: LineHeight;
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  imageUrl?: string;
}
