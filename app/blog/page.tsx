'use client';

import React from 'react';
import Blog from '@/components/Blog';
import { useApp } from '@/components/AppProvider';

export default function BlogPage() {
    const { blogPosts, affiliateBanners } = useApp();
    return <Blog blogPosts={blogPosts} affiliateBanners={affiliateBanners} />;
}
