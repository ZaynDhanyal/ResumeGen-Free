

import React, { useState, useCallback, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ResumeData, CoverLetterData, TemplateId, ThemeId, FormattingOptions, BlogPost, AffiliateBanner, ThemeMode, FontFamily } from './types';
import { EMPTY_RESUME, EMPTY_COVER_LETTER, DEFAULT_FORMATTING, DEFAULT_BLOG_POSTS, DEFAULT_AFFILIATE_BANNERS, THEMES, FONT_OPTIONS } from './constants';
import Header from './components/Header';
import ResumeEditor from './components/ResumeEditor';
import ResumePreview from './components/ResumePreview';
import CoverLetterEditor from './components/CoverLetterEditor';
import CoverLetterPreview from './components/CoverLetterPreview';
import Blog from './components/Blog';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ResumeViewWrapperProps {
  resumeData: ResumeData;
  onDataChange: <T>(section: keyof ResumeData, data: T, index?: number) => void;
  onAddItem: (section: keyof ResumeData, item: any) => void;
  onRemoveItem: (section: keyof ResumeData, index: number) => void;
  templateId: TemplateId;
  setTemplateId: (id: TemplateId) => void;
  themeId: ThemeId;
  setThemeId: (id: ThemeId) => void;
  onDownloadPdf: () => void;
  formattingOptions: FormattingOptions;
  setFormattingOptions: (options: FormattingOptions) => void;
  onClearAll: () => void;
  onClearSection: (section: keyof ResumeData) => void;
  theme: ThemeMode;
  affiliateBanners: AffiliateBanner[];
}

const ResumeViewWrapper: React.FC<ResumeViewWrapperProps> = (props) => {
  const location = useLocation();
  const isPreview = location.pathname.endsWith('/preview');
  return (
    <div className="flex-grow container mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className={!isPreview ? 'block' : 'hidden lg:block'}>
        <ResumeEditor {...props} />
      </div>
      <div className={`lg:sticky top-20 self-start ${isPreview ? 'block' : 'hidden lg:block'}`}>
        <ResumePreview 
          resumeData={props.resumeData} 
          templateId={props.templateId} 
          themeId={props.themeId} 
          formattingOptions={props.formattingOptions} 
          themeMode={props.theme}
        />
      </div>
    </div>
  );
};

interface CoverLetterViewWrapperProps {
  coverLetterData: CoverLetterData;
  resumeData: ResumeData;
  onDataChange: (field: keyof CoverLetterData, value: string) => void;
  onDownloadPdf: () => void;
  themeId: ThemeId;
  setThemeId: (id: ThemeId) => void;
  onClearSection: (section: 'recipient' | 'body') => void;
  theme: ThemeMode;
  affiliateBanners: AffiliateBanner[];
}

const CoverLetterViewWrapper: React.FC<CoverLetterViewWrapperProps> = (props) => {
    const location = useLocation();
    const isPreview = location.pathname.endsWith('/preview');
    return (
      <div className="flex-grow container mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className={!isPreview ? 'block' : 'hidden lg:block'}>
          <CoverLetterEditor {...props} />
        </div>
        <div className={`lg:sticky top-20 self-start ${isPreview ? 'block' : 'hidden lg:block'}`}>
          <CoverLetterPreview 
            coverLetterData={props.coverLetterData} 
            themeId={props.themeId}
            themeMode={props.theme}
          />
        </div>
      </div>
    );
}

const App: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    try {
      const saved = localStorage.getItem('autosavedResumeData');
      return saved ? JSON.parse(saved) : EMPTY_RESUME;
    } catch {
      return EMPTY_RESUME;
    }
  });
  const [coverLetterData, setCoverLetterData] = useState<CoverLetterData>(() => {
    try {
      const saved = localStorage.getItem('autosavedCoverLetterData');
      return saved ? JSON.parse(saved) : EMPTY_COVER_LETTER;
    } catch {
      return EMPTY_COVER_LETTER;
    }
  });
  const [templateId, setTemplateId] = useState<TemplateId>('classic');
  const [themeId, setThemeId] = useState<ThemeId>('default');
  const [formattingOptions, setFormattingOptions] = useState<FormattingOptions>(DEFAULT_FORMATTING);

  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = window.localStorage.getItem('theme') as ThemeMode;
      if (storedTheme) return storedTheme;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Autosave resume and cover letter data
  useEffect(() => {
    const handler = setTimeout(() => {
      try {
        localStorage.setItem('autosavedResumeData', JSON.stringify(resumeData));
      } catch (error) {
        console.error("Could not save resume data to localStorage", error);
      }
    }, 1000); // Autosave 1 second after last change

    return () => clearTimeout(handler);
  }, [resumeData]);

  useEffect(() => {
    const handler = setTimeout(() => {
      try {
        localStorage.setItem('autosavedCoverLetterData', JSON.stringify(coverLetterData));
      } catch (error) {
        console.error("Could not save cover letter data to localStorage", error);
      }
    }, 1000); // Autosave 1 second after last change

    return () => clearTimeout(handler);
  }, [coverLetterData]);


  // Dynamic content state
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => {
    try {
      const saved = localStorage.getItem('blogPosts');
      return saved ? JSON.parse(saved) : DEFAULT_BLOG_POSTS;
    } catch {
      return DEFAULT_BLOG_POSTS;
    }
  });

  const [affiliateBanners, setAffiliateBanners] = useState<AffiliateBanner[]>(() => {
    try {
      const saved = localStorage.getItem('affiliateBanners');
      return saved ? JSON.parse(saved) : DEFAULT_AFFILIATE_BANNERS;
    } catch {
      return DEFAULT_AFFILIATE_BANNERS;
    }
  });

  // Persist dynamic content to localStorage
  useEffect(() => {
    localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
  }, [blogPosts]);

  useEffect(() => {
    localStorage.setItem('affiliateBanners', JSON.stringify(affiliateBanners));
  }, [affiliateBanners]);
  
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
            // Use router-friendly way to clear hash, or let it be if it doesn't interfere
            window.history.replaceState(null, document.title, window.location.pathname + window.location.search);
        }
    }
  }, []);

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

    const isDarkMode = document.documentElement.classList.contains('dark');
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
    }

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
    });

    const a4WidthPt = pdf.internal.pageSize.getWidth();
    const margins = { top: 40, right: 40, bottom: 40, left: 40 };
    
    // The cloning approach is safer to avoid side-effects on the live view.
    const elementToPrint = sourceElement.cloneNode(true) as HTMLElement;
    const container = document.createElement('div');
    // Position off-screen
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0px';
    // Set width to match A4 paper for accurate layout rendering.
    container.style.width = `${a4WidthPt}pt`;
    container.appendChild(elementToPrint);
    document.body.appendChild(container);

    pdf.html(elementToPrint, {
      callback: (doc) => {
        doc.save(filename);
        // Cleanup
        document.body.removeChild(container);
        if (isDarkMode) {
          document.documentElement.classList.add('dark');
        }
      },
      autoPaging: 'text',
      margin: [margins.top, margins.right, margins.bottom, margins.left],
      // The content width in the PDF will be the page width minus horizontal margins.
      width: a4WidthPt - margins.left - margins.right,
      // The width of the browser window to simulate for rendering.
      windowWidth: a4WidthPt,
      html2canvas: {
        scale: 2, // Higher scale for better image quality.
        useCORS: true,
        letterRendering: true,
        // Capture full height of the element.
        height: elementToPrint.scrollHeight,
        windowHeight: elementToPrint.scrollHeight
      },
    }).catch((error) => {
      console.error("PDF generation failed:", error);
      // Cleanup on error
      document.body.removeChild(container);
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      }
    });
  }, []);

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
  
  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 dark:text-gray-200">
      <Header theme={theme} setTheme={setTheme} />
      <main className="flex-grow w-full">
        <Routes>
          <Route path="/" element={<Navigate to="/resume" replace />} />
          <Route path="/resume/*" element={
            <ResumeViewWrapper 
                resumeData={resumeData} 
                onDataChange={handleDataChange}
                onAddItem={handleAddItem}
                onRemoveItem={handleRemoveItem}
                templateId={templateId}
                setTemplateId={setTemplateId}
                themeId={themeId}
                setThemeId={setThemeId}
                onDownloadPdf={handleDownloadPdf}
                formattingOptions={formattingOptions}
                setFormattingOptions={setFormattingOptions}
                onClearAll={handleClearAllResume}
                onClearSection={handleClearResumeSection}
                theme={theme}
                affiliateBanners={affiliateBanners}
            />
          } />
          <Route path="/cover-letter/*" element={
            <CoverLetterViewWrapper
                coverLetterData={coverLetterData} 
                resumeData={resumeData}
                onDataChange={handleCoverLetterDataChange}
                onDownloadPdf={handleCoverLetterDownloadPdf}
                themeId={themeId}
                setThemeId={setThemeId}
                onClearSection={handleClearCoverLetterSection}
                theme={theme}
                affiliateBanners={affiliateBanners}
            />
          } />
          <Route path="/blog" element={<Blog blogPosts={blogPosts} affiliateBanners={affiliateBanners} />} />
          <Route path="/admin" element={<AdminPanel
              blogPosts={blogPosts}
              setBlogPosts={setBlogPosts}
              affiliateBanners={affiliateBanners}
              setAffiliateBanners={setAffiliateBanners}
            />} />
        </Routes>
      </main>
      <Footer affiliateBanners={affiliateBanners} />
    </div>
  );
};

export default App;