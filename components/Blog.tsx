import React from 'react';
import { BlogPost } from '../types';

interface BlogProps {
    blogPosts: BlogPost[];
}

const Blog: React.FC<BlogProps> = ({ blogPosts }) => {
  return (
    <div className="container mx-auto p-4 lg:p-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-800 dark:text-gray-200">Resume & Career Advice Blog</h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Tips and tricks to land your dream job.</p>
      </header>
      
      <div className="max-w-4xl mx-auto">
        <main>
          <div className="space-y-12">
            {blogPosts.map((post) => (
              <React.Fragment key={post.id}>
                <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                  {post.imageUrl && (
                    <img src={post.imageUrl} alt={post.title} className="w-full h-64 object-cover" />
                  )}
                  <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{post.title}</h2>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <span>By {post.author}</span> | <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">{post.excerpt}</p>
                    <a href="#" className="font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">Read More &rarr;</a>
                  </div>
                </article>
              </React.Fragment>
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