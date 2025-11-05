'use client';

import React, { useState, useCallback, useEffect, createContext, useContext, ReactNode, Suspense } from 'react';
import { ResumeData, CoverLetterData, TemplateId, ThemeId, FormattingOptions, BlogPost, AffiliateBanner, ThemeMode } from '@/types';
import { EMPTY_RESUME, EMPTY_COVER_LETTER, DEFAULT_FORMATTING, DEFAULT_BLOG_POSTS, DEFAULT_AFFILIATE_BANNERS, THEMES } from '@/constants';
import Header from './Header';
import Footer from './Footer';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { usePathname } from 'next/navigation';

interface AppContextType {
  resumeData: ResumeData;
  handleDataChange: <T>(section: keyof ResumeData, data: T, index?: number) => void;
  handleAddItem: (section: keyof ResumeData, item: any) => void;
  handleRemoveItem: (section: keyof ResumeData, index: number) => void;
  handleClearAllResume: () => void;
  handleClearResumeSection: (section: keyof ResumeData) => void;
  coverLetterData: CoverLetterData;
  handleCoverLetterDataChange: (field: keyof CoverLetterData, value: string) => void;
  handleClearCoverLetterSection: (section: 'recipient' | 'body') => void;
  templateId: TemplateId;
  setTemplateId: (id: TemplateId) => void;
  themeId: ThemeId;
  setThemeId: (id: ThemeId) => void;
  formattingOptions: FormattingOptions;
  setFormattingOptions: (options: FormattingOptions) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  blogPosts: BlogPost[];
  setBlogPosts: React.Dispatch<React.SetStateAction<BlogPost[]>>;
  affiliateBanners: AffiliateBanner[];
  setAffiliateBanners: React.Dispatch<React.SetStateAction<AffiliateBanner[]>>;
  handleDownloadPdf: () => void;
  handleCoverLetterDownloadPdf: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};

export default function AppProvider({ children }: { children: ReactNode }) {
  const [resumeData, setResumeData] = useState<ResumeData>(EMPTY_RESUME);
  const [coverLetterData, setCoverLetterData] = useState<CoverLetterData>(EMPTY_COVER_LETTER);
  const [templateId, setTemplateId] = useState<TemplateId>('classic');
  const [themeId, setThemeId] = useState<ThemeId>('default');
  const [formattingOptions, setFormattingOptions] = useState<FormattingOptions>(DEFAULT_FORMATTING);

  const [theme, setTheme] = useState<ThemeMode>('light');

  useEffect(() => {
    // Set initial theme based on localStorage/system preference
    const storedTheme = window.localStorage.getItem('theme') as ThemeMode;
    if (storedTheme) {
        setTheme(storedTheme);
    } else {
        setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);


  // Dynamic content state
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [affiliateBanners, setAffiliateBanners] = useState<AffiliateBanner[]>([]);
  
  useEffect(() => {
    try {
      const savedPosts = localStorage.getItem('blogPosts');
      setBlogPosts(savedPosts ? JSON.parse(savedPosts) : DEFAULT_BLOG_POSTS);

      const savedBanners = localStorage.getItem('affiliateBanners');
      setAffiliateBanners(savedBanners ? JSON.parse(savedBanners) : DEFAULT_AFFILIATE_BANNERS);
      
      const savedResume = localStorage.getItem('autosavedResumeData');
      if (savedResume) {
        setResumeData(JSON.parse(savedResume));
      }

      const savedCoverLetter = localStorage.getItem('autosavedCoverLetterData');
      if (savedCoverLetter) {
        setCoverLetterData(JSON.parse(savedCoverLetter));
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      setBlogPosts(DEFAULT_BLOG_POSTS);
      setAffiliateBanners(DEFAULT_AFFILIATE_BANNERS);
    }
  }, []);

  // Persist resume and cover letter with autosave
  useEffect(() => {
    const handler = setTimeout(() => {
      try {
        localStorage.setItem('autosavedResumeData', JSON.stringify(resumeData));
      } catch (error) {
        console.error("Could not save resume data to localStorage", error);
      }
    }, 1000);
    return () => clearTimeout(handler);
  }, [resumeData]);

  useEffect(() => {
    const handler = setTimeout(() => {
      try {
        localStorage.setItem('autosavedCoverLetterData', JSON.stringify(coverLetterData));
      } catch (error) {
        console.error("Could not save cover letter data to localStorage", error);
      }
    }, 1000);
    return () => clearTimeout(handler);
  }, [coverLetterData]);

  // Persist dynamic content to localStorage
  useEffect(() => {
    localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
  }, [blogPosts]);

  useEffect(() => {
    localStorage.setItem('affiliateBanners', JSON.stringify(affiliateBanners));
  }, [affiliateBanners]);
  
  const pathname = usePathname();
  // Load shared resume from URL hash
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#share=')) {
        try {
            const base64String = hash.substring('#share='.length);
            const jsonString = decodeURIComponent(window.atob(base64String));
            const sharedResumeData: ResumeData = JSON.parse(jsonString);

            if (sharedResumeData && sharedResumeData.personalInfo) {
                setResumeData(sharedResumeData);
            }
        } catch (error) {
            console.error("Failed to load shared resume from URL:", error);
        } finally {
            window.history.replaceState(null, document.title, pathname);
        }
    }
  }, [pathname]);

  // Sync senderName with resume fullName
  useEffect(() => {
    setCoverLetterData(prev => ({
      ...prev,
      senderName: resumeData.personalInfo.fullName,
    }));
  }, [resumeData.personalInfo.fullName]);

  const handleDataChange = useCallback(<T,>(
    section: keyof ResumeData,
    data: T,
    index?: number
  ) => {
    setResumeData(prev => {
      const newResumeData = { ...prev };
      if (index !== undefined && Array.isArray(newResumeData[section])) {
        const sectionArray = [...(newResumeData[section] as any[])];
        sectionArray[index] = data;
        return { ...newResumeData, [section]: sectionArray };
      }
      return { ...newResumeData, [section]: data };
    });
  }, []);

  const handleCoverLetterDataChange = useCallback((field: keyof CoverLetterData, value: string) => {
    setCoverLetterData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleAddItem = useCallback((section: keyof ResumeData, item: any) => {
    setResumeData(prev => {
      const sectionArray = [...(prev[section] as any[]), item];
      return { ...prev, [section]: sectionArray };
    });
  }, []);

  const handleRemoveItem = useCallback((section: keyof ResumeData, index: number) => {
    setResumeData(prev => {
      const sectionArray = (prev[section] as any[]).filter((_, i) => i !== index);
      return { ...prev, [section]: sectionArray };
    });
  }, []);

  const handleClearAllResume = useCallback(() => {
    if (window.confirm('Are you sure you want to clear the entire resume? This action cannot be undone.')) {
      setResumeData(EMPTY_RESUME);
      try {
        localStorage.removeItem('autosavedResumeData');
      } catch (error) {
        console.error("Could not remove autosaved resume data from localStorage", error);
      }
    }
  }, []);

  const handleClearResumeSection = useCallback((section: keyof ResumeData) => {
    const sectionName = section.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
    if (window.confirm(`Are you sure you want to clear the "${sectionName}" section? This cannot be undone.`)) {
        setResumeData(prev => ({
            ...prev,
            [section]: EMPTY_RESUME[section]
        }));
    }
  }, []);

  const handleClearCoverLetterSection = useCallback((section: 'recipient' | 'body') => {
      const sectionName = section === 'recipient' ? 'Recipient Information' : 'Letter Body';
      if (window.confirm(`Are you sure you want to clear the ${sectionName} section? This cannot be undone.`)) {
          if (section === 'recipient') {
              setCoverLetterData(prev => ({
                  ...prev,
                  recipientName: EMPTY_COVER_LETTER.recipientName,
                  recipientCompany: EMPTY_COVER_LETTER.recipientCompany,
              }));
          } else if (section === 'body') {
              setCoverLetterData(prev => ({
                  ...prev,
                  body: EMPTY_COVER_LETTER.body,
              }));
          }
      }
  }, []);

  const downloadPdf = useCallback((elementId: string, filename: string) => {
    const sourceElement = document.getElementById(elementId);
    if (!sourceElement) {
        console.error(`Element with id ${elementId} not found.`);
        return;
    }

    const printWidth = 794;

    const isDarkMode = document.documentElement.classList.contains('dark');
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
    }

    const elementToPrint = sourceElement.cloneNode(true) as HTMLElement;
    elementToPrint.style.position = 'absolute';
    elementToPrint.style.top = '-9999px';
    elementToPrint.style.left = '0px';
    elementToPrint.style.width = `${printWidth}px`;
    elementToPrint.style.height = 'auto';

    document.body.appendChild(elementToPrint);

    setTimeout(() => {
      html2canvas(elementToPrint, {
        scale: 3,
        letterRendering: true,
        useCORS: true,
        width: printWidth,
        height: elementToPrint.scrollHeight,
        windowWidth: printWidth,
        windowHeight: elementToPrint.scrollHeight,
        backgroundColor: null,
      }).then(canvas => {
        document.body.removeChild(elementToPrint);
        if (isDarkMode) {
          document.documentElement.classList.add('dark');
        }

        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });

        const selectedTheme = THEMES.find(t => t.id === themeId) || THEMES[0];
        const pageFillColor = selectedTheme.colors.secondary;
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        
        const pageCanvasHeight = (canvasWidth * pdfHeight) / pdfWidth;
        
        let canvasPosition = 0;
        let pageCount = 0;
        
        while (canvasPosition < canvasHeight) {
            pageCount++;
            if (pageCount > 1) {
                pdf.addPage();
            }

            const pageCanvas = document.createElement('canvas');
            pageCanvas.width = canvasWidth;
            pageCanvas.height = pageCanvasHeight;
            const pageCtx = pageCanvas.getContext('2d');
            
            if (pageCtx) {
                pageCtx.fillStyle = pageFillColor;
                pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
                
                const sliceHeight = Math.min(pageCanvasHeight, canvasHeight - canvasPosition);
                pageCtx.drawImage(canvas, 0, canvasPosition, canvasWidth, sliceHeight, 0, 0, canvasWidth, sliceHeight);
                
                const pageImgData = pageCanvas.toDataURL('image/png');
                pdf.addImage(pageImgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            }
            
            canvasPosition += pageCanvasHeight;
        }
        
        pdf.save(filename);
      }).catch(err => {
        console.error("html2canvas failed:", err);
        document.body.removeChild(elementToPrint);
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        }
      });
    }, 200);
  }, [themeId]);

  const sanitizeFilename = (name: string) => {
    return name.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'document';
  }

  const handleDownloadPdf = useCallback(() => {
    const name = resumeData.personalInfo.fullName;
    const filename = `Resume-${sanitizeFilename(name)}.pdf`;
    downloadPdf('resume-preview', filename);
  }, [resumeData.personalInfo.fullName, downloadPdf]);

  const handleCoverLetterDownloadPdf = useCallback(() => {
    const name = coverLetterData.senderName;
    const filename = `CoverLetter-${sanitizeFilename(name)}.pdf`;
    downloadPdf('cover-letter-preview', filename);
  }, [coverLetterData.senderName, downloadPdf]);
  
  const contextValue: AppContextType = {
    resumeData,
    handleDataChange,
    handleAddItem,
    handleRemoveItem,
    handleClearAllResume,
    handleClearResumeSection,
    coverLetterData,
    handleCoverLetterDataChange,
    handleClearCoverLetterSection,
    templateId,
    setTemplateId,
    themeId,
    setThemeId,
    formattingOptions,
    setFormattingOptions,
    theme,
    setTheme,
    blogPosts,
    setBlogPosts,
    affiliateBanners,
    setAffiliateBanners,
    handleDownloadPdf,
    handleCoverLetterDownloadPdf,
  };

  return (
    <AppContext.Provider value={contextValue}>
        <div className="min-h-screen flex flex-col font-sans text-gray-800 dark:text-gray-200">
            <Suspense fallback={<div className="h-16"></div>}>
              <Header theme={theme} setTheme={setTheme} />
            </Suspense>
            <main className="flex-grow w-full">{children}</main>
            <Footer affiliateBanners={affiliateBanners} />
        </div>
    </AppContext.Provider>
  );
}