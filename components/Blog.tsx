import React from 'react';
import { BLOG_POSTS } from '../constants';
import AdsenseBlock from './AdsenseBlock';
import AffiliateBanner from './AffiliateBanner';
import { AFFILIATE_BANNERS } from '../constants';

const Blog: React.FC = () => {
  return (
    <div className="container mx-auto p-4 lg:p-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-800">Resume & Career Advice Blog</h1>
        <p className="mt-4 text-lg text-gray-600">Tips and tricks to land your dream job.</p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <main className="lg:col-span-2">
          <div className="space-y-12">
            {BLOG_POSTS.map((post, index) => (
              <React.Fragment key={post.id}>
                <article className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h2>
                  <div className="text-sm text-gray-500 mb-4">
                    <span>By {post.author}</span> | <span>{post.date}</span>
                  </div>
                  <p className="text-gray-700 mb-4">{post.excerpt}</p>
                  <a href="#" className="font-semibold text-blue-600 hover:text-blue-800 transition-colors">Read More &rarr;</a>
                </article>
                
                {/* Insert ad after the first post */}
                {index === 0 && (
                  <div className="bg-white p-6 rounded-lg shadow-md">
                     <h3 className="text-xl font-bold text-gray-800 mb-4">Advertisement</h3>
                     <AdsenseBlock width="w-full" height="h-24" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </main>
        
        <aside className="space-y-8 sticky top-20 self-start">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Advertisement</h3>
            <AdsenseBlock width="w-full" height="h-60" />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Our Partners</h3>
            <div className="space-y-4">
              {AFFILIATE_BANNERS.slice(0, 2).map(banner => (
                <AffiliateBanner key={banner.name} {...banner} />
              ))}
            </div>
          </div>
           <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Advertisement</h3>
            <AdsenseBlock width="w-full" height="h-60" />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Blog;