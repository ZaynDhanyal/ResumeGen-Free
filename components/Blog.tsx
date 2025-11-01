import React from 'react';
import { BlogPost, AffiliateBanner as AffiliateBannerType } from '../types';

interface BlogProps {
    blogPosts: BlogPost[];
    affiliateBanners: AffiliateBannerType[];
}

const Blog: React.FC<BlogProps> = ({ blogPosts, affiliateBanners }) => {
  return (
    <div className="container mx-auto p-4 lg:p-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-800 dark:text-white">Resume & Career Advice Blog</h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Tips and tricks to land your dream job.</p>
      </header>
      
      <div className="grid grid-cols-1">
        <main>
          <div className="space-y-12 max-w-4xl mx-auto">
            {blogPosts.map((post) => (
              <article key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                {post.imageUrl && (
                  <img src={post.imageUrl} alt={post.title} className="w-full h-56 object-cover" />
                )}
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{post.title}</h2>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span>By {post.author}</span> | <span>{new Date(post.date + 'T00:00:00Z').toLocaleDateString('en-US', { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">{post.excerpt}</p>
                  <a href="#" className="font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">Read More &rarr;</a>
                </div>
              </article>
            ))}
             {blogPosts.length === 0 && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">No Posts Yet</h2>
                    <p className="text-gray-600 dark:text-gray-400">Check back later for more content!</p>
                </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Blog;