'use client';

import React from 'react';
import ResumeEditor from '@/components/ResumeEditor';
import ResumePreview from '@/components/ResumePreview';
import { useApp } from '@/components/AppProvider';

export default function ResumePage() {
    const app = useApp();

    return (
        <div className="flex-grow container mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="block">
                <ResumeEditor
                    resumeData={app.resumeData}
                    onDataChange={app.handleDataChange}
                    onAddItem={app.handleAddItem}
                    onRemoveItem={app.handleRemoveItem}
                    templateId={app.templateId}
                    setTemplateId={app.setTemplateId}
                    themeId={app.themeId}
                    setThemeId={app.setThemeId}
                    onDownloadPdf={app.handleDownloadPdf}
                    formattingOptions={app.formattingOptions}
                    setFormattingOptions={app.setFormattingOptions}
                    onClearAll={app.handleClearAllResume}
                    onClearSection={app.handleClearResumeSection}
                    affiliateBanners={app.affiliateBanners}
                />
            </div>
            <div className={'hidden lg:block lg:sticky top-20 self-start'}>
                <ResumePreview
                    resumeData={app.resumeData}
                    templateId={app.templateId}
                    themeId={app.themeId}
                    formattingOptions={app.formattingOptions}
                    themeMode={app.theme}
                />
            </div>
        </div>
    );
}
