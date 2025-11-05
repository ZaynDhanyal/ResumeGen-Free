'use client';

import React from 'react';
import ResumePreview from '@/components/ResumePreview';
import { useApp } from '@/components/AppProvider';

export default function ResumePreviewPage() {
    const app = useApp();

    return (
        <div className="flex-grow container mx-auto p-4">
            <div className={'block lg:sticky top-20 self-start'}>
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
