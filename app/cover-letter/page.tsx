'use client';

import React from 'react';
import CoverLetterEditor from '@/components/CoverLetterEditor';
import CoverLetterPreview from '@/components/CoverLetterPreview';
import { useApp } from '@/components/AppProvider';

export default function CoverLetterPage() {
    const app = useApp();
    return (
        <div className="flex-grow container mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="block">
                <CoverLetterEditor
                    coverLetterData={app.coverLetterData}
                    resumeData={app.resumeData}
                    onDataChange={app.handleCoverLetterDataChange}
                    onDownloadPdf={app.handleCoverLetterDownloadPdf}
                    themeId={app.themeId}
                    setThemeId={app.setThemeId}
                    onClearSection={app.handleClearCoverLetterSection}
                    affiliateBanners={app.affiliateBanners}
                />
            </div>
            <div className={'hidden lg:block lg:sticky top-20 self-start'}>
                <CoverLetterPreview
                    coverLetterData={app.coverLetterData}
                    themeId={app.themeId}
                    themeMode={app.theme}
                />
            </div>
        </div>
    );
}
