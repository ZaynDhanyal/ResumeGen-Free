import React, { useState, useCallback, useEffect, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ResumeData, CoverLetterData, TemplateId, ThemeId, FormattingOptions, BlogPost } from './types';
import { EMPTY_RESUME, EMPTY_COVER_LETTER, DEFAULT_FORMATTING, DEFAULT_BLOG_POSTS } from './constants';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load components to reduce initial bundle size
const ResumeEditor = React.lazy(() => import('./components/ResumeEditor'));
const ResumePreview = React.lazy(() => import('./components/ResumePreview'));
const CoverLetterEditor = React.lazy(() => import('./components/CoverLetterEditor'));
const CoverLetterPreview = React.lazy(() => import('./components/CoverLetterPreview'));
const Blog = React.lazy(() => import('./components/Blog'));
const AdminPanel = React.lazy(() => import('./components/AdminPanel'));

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
          />
        </div>
      </div>
    );
}

const App: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData>(EMPTY_RESUME);
  const [coverLetterData, setCoverLetterData] = useState<CoverLetterData>(EMPTY_COVER_LETTER);
  const [templateId, setTemplateId] = useState<TemplateId>('classic');
  const [themeId, setThemeId] = useState<ThemeId>('default');
  const [formattingOptions, setFormattingOptions] = useState<FormattingOptions>(DEFAULT_FORMATTING);
  
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = window.localStorage.getItem('theme');
      if (storedTheme === 'dark' || storedTheme === 'light') {
        return storedTheme;
      }
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  });

  // Dynamic content state
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => {
    try {
      const saved = localStorage.getItem('blogPosts');
      return saved ? JSON.parse(saved) : DEFAULT_BLOG_POSTS;
    } catch {
      return DEFAULT_BLOG_POSTS;
    }
  });

  // Theme effect
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Persist dynamic content to localStorage
  useEffect(() => {
    localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
  }, [blogPosts]);
  
  // Load shared resume from URL hash
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#share=')) {
        try {
            const base64String = hash.substring('#share='.length);
            const jsonString = decodeURIComponent(escape(window.atob(base64String)));
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

  const downloadPdf = useCallback(async (elementId: string, filename: string) => {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`Element with id ${elementId} not found.`);
        return;
    }

    try {
      // Dynamic imports to optimize initial load
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      // Optimization for Crisp PDF Output:
      // 1. windowWidth: 820px
      //    - Slightly larger than MD (768px) to ensure desktop grid layouts are captured.
      //    - Not too large (like 1200px) so text doesn't become tiny when scaled down to A4.
      // 2. Scale: 4
      //    - Ensures high DPI (approx 384 DPI) for sharp text rendering.
      // 3. PNG Format
      //    - Lossless compression prevents jpeg artifacts on text.
      
      const canvas = await html2canvas(element, {
        scale: 4, 
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 820,
        height: element.scrollHeight + 50, // Add buffer to prevent bottom cutoff
        windowHeight: element.scrollHeight + 50,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById(elementId);
          if (clonedElement) {
              // Reset any scroll or height constraints to ensure full capture
              clonedElement.style.height = 'auto';
              clonedElement.style.width = '100%';
              clonedElement.style.overflow = 'visible';
              clonedElement.style.maxHeight = 'none';
          }
        }
      });

      const imgData = canvas.toDataURL('image/png');
      
      // Initialize jsPDF for A4 paper
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfPageWidth = pdf.internal.pageSize.getWidth();
      const pdfPageHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate image height based on A4 width to maintain aspect ratio
      const imgProps = pdf.getImageProperties(imgData);
      const pdfImgHeight = (imgProps.height * pdfPageWidth) / imgProps.width;

      let heightLeft = pdfImgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, pdfPageWidth, pdfImgHeight);
      heightLeft -= pdfPageHeight;

      // Add subsequent pages if content exceeds one A4 page
      while (heightLeft > 0) {
        position -= pdfPageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfPageWidth, pdfImgHeight);
        heightLeft -= pdfPageHeight;
      }
      
      pdf.save(filename);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
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
    <div className="min-h-screen flex flex-col font-sans">
      <Header theme={theme} setTheme={setTheme} />
      <main className="flex-grow w-full">
        <Suspense fallback={<LoadingSpinner />}>
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
              />
            } />
            <Route path="/blog" element={<Blog blogPosts={blogPosts} />} />
            <Route path="/admin" element={<AdminPanel
                blogPosts={blogPosts}
                setBlogPosts={setBlogPosts}
              />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default App;