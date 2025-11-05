'use client';

import React from 'react';
import CoverLetterPreview from '@/components/CoverLetterPreview';
import { useApp } from '@/components/AppProvider';

export default function CoverLetterPreviewPage() {
    const app = useApp();
    return (
        <div className="flex-grow container mx-auto p-4">
            <div className={'block lg:sticky top-20 self-start'}>
                <CoverLetterPreview
                    coverLetterData={app.coverLetterData}
                    themeId={app.themeId}
                    themeMode={app.theme}
                />
            </div>
        </div>
    );
}
