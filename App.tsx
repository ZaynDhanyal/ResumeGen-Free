import React, { useState, useCallback, useEffect } from 'react';
import { ResumeData, CoverLetterData, TemplateId, ThemeId } from './types';
import { EMPTY_RESUME, EMPTY_COVER_LETTER } from './constants';
import Header from './components/Header';
import ResumeEditor from './components/ResumeEditor';
import ResumePreview from './components/ResumePreview';
import CoverLetterEditor from './components/CoverLetterEditor';
import CoverLetterPreview from './components/CoverLetterPreview';
import Blog from './components/Blog';
import Footer from './components/Footer';
import html2canvas from 'html2canvas';
// @ts-ignore
import { jsPDF } from 'jspdf';

type View = 'editor' | 'cover-letter' | 'blog';

const App: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData>(EMPTY_RESUME);
  const [coverLetterData, setCoverLetterData] = useState<CoverLetterData>(EMPTY_COVER_LETTER);
  const [templateId, setTemplateId] = useState<TemplateId>('classic');
  const [themeId, setThemeId] = useState<ThemeId>('default');
  const [view, setView] = useState<View>('editor');

  // Sync senderName with resume fullName on initial load and when fullName changes
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
      scale: 4, // Higher scale for better quality
      useCORS: true,
      backgroundColor: null, // Ensure transparency is handled correctly
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const margin = 15; // 15mm margin on each side
      const contentWidth = pdfWidth - (margin * 2);

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const canvasAspectRatio = canvasWidth / canvasHeight;

      const contentHeight = contentWidth / canvasAspectRatio;
      
      // Check if content exceeds one page height with margins
      if (contentHeight > pdfHeight - (margin * 2)) {
        console.warn(`${filename} content might be too long for a single A4 page.`);
      }

      // Add image with margins
      pdf.addImage(imgData, 'PNG', margin, margin, contentWidth, contentHeight);
      pdf.save(filename);
    });
  }, []);

  const handleDownloadPdf = useCallback(() => {
    downloadPdf('resume-preview', 'Resume-ResumeGenFree.pdf');
  }, [downloadPdf]);

  const handleCoverLetterDownloadPdf = useCallback(() => {
    downloadPdf('cover-letter-preview', 'CoverLetter-ResumeGenFree.pdf');
  }, [downloadPdf]);

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
            />
            <div className="lg:sticky top-4 self-start">
              <ResumePreview resumeData={resumeData} templateId={templateId} themeId={themeId} />
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
        return <Blog />;
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header currentView={view} setView={setView} />
      <main className="flex-grow w-full">
        {renderView()}
      </main>
      <Footer />
    </div>
  );
};

export default App;