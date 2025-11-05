'use client';
import React from 'react';
import AdminPanel from '@/components/AdminPanel';
import { useApp } from '@/components/AppProvider';

export default function AdminPage() {
    const { blogPosts, setBlogPosts, affiliateBanners, setAffiliateBanners } = useApp();

    return (
        <AdminPanel
            blogPosts={blogPosts}
            setBlogPosts={setBlogPosts}
            affiliateBanners={affiliateBanners}
            setAffiliateBanners={setAffiliateBanners}
        />
    );
}
