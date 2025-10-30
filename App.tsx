
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
import AdModal from './components/AdModal';
import html2canvas from 'html2canvas';
// @ts-ignore
import { jsPDF } from 'jspdf';

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
  const [resumeData, setResumeData] = useState<ResumeData>(EMPTY_RESUME);
  const [coverLetterData, setCoverLetterData] = useState<CoverLetterData>(EMPTY_COVER_LETTER);
  const [templateId, setTemplateId] = useState<TemplateId>('classic');
  const [themeId, setThemeId] = useState<ThemeId>('default');
  const [formattingOptions, setFormattingOptions] = useState<FormattingOptions>(DEFAULT_FORMATTING);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [downloadType, setDownloadType] = useState<'resume' | 'cover-letter' | null>(null);

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
        scale: 6,
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
    setDownloadType('resume');
    setIsAdModalOpen(true);
  }, []);

  const handleCoverLetterDownloadPdf = useCallback(() => {
    setDownloadType('cover-letter');
    setIsAdModalOpen(true);
  }, []);

  const handleConfirmDownload = () => {
    if (downloadType === 'resume') {
        const name = resumeData.personalInfo.fullName;
        const filename = `Resume-${sanitizeFilename(name)}.pdf`;
        downloadPdf('resume-preview', filename);
    } else if (downloadType === 'cover-letter') {
        const name = coverLetterData.senderName;
        const filename = `CoverLetter-${sanitizeFilename(name)}.pdf`;
        downloadPdf('cover-letter-preview', filename);
    }
    setIsAdModalOpen(false);
    setDownloadType(null);
  };
  
  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 dark:text-gray-200">
      <AdModal 
        isOpen={isAdModalOpen}
        onClose={() => {
            setIsAdModalOpen(false);
            setDownloadType(null);
        }}
        onConfirm={handleConfirmDownload}
      />
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