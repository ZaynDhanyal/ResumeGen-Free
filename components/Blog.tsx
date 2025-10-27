import React from 'react';
import { BlogPost, AffiliateBanner as AffiliateBannerType } from '../types';
import AdsenseBlock from './AdsenseBlock';
import AffiliateBanner from './AffiliateBanner';

interface BlogProps {
    blogPosts: BlogPost[];
    affiliateBanners: AffiliateBannerType[];
}

const Blog: React.FC<BlogProps> = ({ blogPosts, affiliateBanners }) => {
  return (
    <div className="container mx-auto p-4 lg:p-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-800">Resume & Career Advice Blog</h1>
        <p className="mt-4 text-lg text-gray-600">Tips and tricks to land your dream job.</p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <main className="lg:col-span-2">
          <div className="space-y-12">
            {blogPosts.map((post, index) => (
              <React.Fragment key={post.id}>
                <article className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                  {post.imageUrl && (
                    <img src={post.imageUrl} alt={post.title} className="w-full h-56 object-cover" />
                  )}
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h2>
                    <div className="text-sm text-gray-500 mb-4">
                      <span>By {post.author}</span> | <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <p className="text-gray-700 mb-4">{post.excerpt}</p>
                    <a href="#" className="font-semibold text-blue-600 hover:text-blue-800 transition-colors">Read More &rarr;</a>
                  </div>
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
             {blogPosts.length === 0 && (
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No Posts Yet</h2>
                    <p className="text-gray-600">Check back later for more content!</p>
                </div>
            )}
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
              {affiliateBanners.slice(0, 2).map(banner => (
                <AffiliateBanner key={banner.id} {...banner} />
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