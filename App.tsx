import React, { useState, useCallback, useEffect } from 'react';
import { ResumeData, CoverLetterData, TemplateId, ThemeId, FormattingOptions, BlogPost, AffiliateBanner } from './types';
import { EMPTY_RESUME, EMPTY_COVER_LETTER, DEFAULT_FORMATTING, DEFAULT_BLOG_POSTS, DEFAULT_AFFILIATE_BANNERS } from './constants';
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

type View = 'editor' | 'cover-letter' | 'blog' | 'admin';

const App: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData>(EMPTY_RESUME);
  const [coverLetterData, setCoverLetterData] = useState<CoverLetterData>(EMPTY_COVER_LETTER);
  const [templateId, setTemplateId] = useState<TemplateId>('classic');
  const [themeId, setThemeId] = useState<ThemeId>('default');
  const [view, setView] = useState<View>('editor');
  const [formattingOptions, setFormattingOptions] = useState<FormattingOptions>(DEFAULT_FORMATTING);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [downloadType, setDownloadType] = useState<'resume' | 'cover-letter' | null>(null);


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
  
  // URL-based routing for Admin Panel
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#admin') {
        setView('admin');
      }
    };

    checkHash(); // Check on initial load
    window.addEventListener('hashchange', checkHash, false);

    return () => {
      window.removeEventListener('hashchange', checkHash, false);
    };
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

  const downloadPdf = useCallback((elementId: string, filename: string) => {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`Element with id ${elementId} not found.`);
        return;
    }

    html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      
      const ratio = canvasWidth / pdfWidth;
      const totalImageHeight = canvasHeight / ratio;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, Math.min(totalImageHeight, pdfHeight));
      let heightLeft = totalImageHeight - pdfHeight;

      while (heightLeft > 0) {
        position -= pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, totalImageHeight);
        heightLeft -= pdfHeight;
      }
      
      pdf.save(filename);
    });
  }, []);

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

  const renderView = () => {
    switch(view) {
      case 'editor':
        return (
          <div className="flex-grow container mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ResumeEditor 
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
            />
            <div className="lg:sticky top-4 self-start">
              <ResumePreview 
                resumeData={resumeData} 
                templateId={templateId} 
                themeId={themeId} 
                formattingOptions={formattingOptions} 
              />
            </div>
          </div>
        );
      case 'cover-letter':
        return (
            <div className="flex-grow container mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <CoverLetterEditor 
                    coverLetterData={coverLetterData} 
                    resumeData={resumeData}
                    onDataChange={handleCoverLetterDataChange}
                    onDownloadPdf={handleCoverLetterDownloadPdf}
                    themeId={themeId}
                    setThemeId={setThemeId}
                />
                <div className="lg:sticky top-4 self-start">
                    <CoverLetterPreview coverLetterData={coverLetterData} themeId={themeId} />
                </div>
            </div>
        );
      case 'blog':
        return <Blog blogPosts={blogPosts} affiliateBanners={affiliateBanners} />;
      case 'admin':
        return <AdminPanel
                  blogPosts={blogPosts}
                  setBlogPosts={setBlogPosts}
                  affiliateBanners={affiliateBanners}
                  setAffiliateBanners={setAffiliateBanners}
                />;
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <AdModal 
        isOpen={isAdModalOpen}
        onClose={() => {
            setIsAdModalOpen(false);
            setDownloadType(null);
        }}
        onConfirm={handleConfirmDownload}
      />
      <Header currentView={view} setView={setView} />
      <main className="flex-grow w-full">
        {renderView()}
      </main>
      <Footer affiliateBanners={affiliateBanners} />
    </div>
  );
};

export default App;