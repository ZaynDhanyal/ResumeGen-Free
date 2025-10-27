import React, { useState, useEffect } from 'react';
import { BlogPost, AffiliateBanner } from '../types';
import { PRE_CONFIGURED_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD } from '../constants';
import { LockClosedIcon, PencilIcon, TrashIcon, AddIcon, ExternalLinkIcon, LogoutIcon, MailIcon } from './icons';

interface AdminPanelProps {
    blogPosts: BlogPost[];
    setBlogPosts: React.Dispatch<React.SetStateAction<BlogPost[]>>;
    affiliateBanners: AffiliateBanner[];
    setAffiliateBanners: React.Dispatch<React.SetStateAction<AffiliateBanner[]>>;
}

type AdminTab = 'blog' | 'affiliates' | 'adsense';
type AdminAuthView = 'login' | 'forgot' | 'reset';

const getAdminPassword = (): string => {
    try {
        return localStorage.getItem('adminPassword') || DEFAULT_ADMIN_PASSWORD;
    } catch {
        return DEFAULT_ADMIN_PASSWORD;
    }
};

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input {...props} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
    </div>
);

const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <textarea {...props} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition" rows={4} />
    </div>
);

const AdminPanel: React.FC<AdminPanelProps> = ({ blogPosts, setBlogPosts, affiliateBanners, setAffiliateBanners }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [activeTab, setActiveTab] = useState<AdminTab>('blog');

    // --- Auth State ---
    const [authView, setAuthView] = useState<AdminAuthView>('login');
    const [passwordInput, setPasswordInput] = useState('');
    const [emailInput, setEmailInput] = useState('');
    const [tokenInput, setTokenInput] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // --- Blog State ---
    const [newPost, setNewPost] = useState<Omit<BlogPost, 'id'>>({ title: '', excerpt: '', author: '', date: '' });
    
    // --- Affiliate State ---
    const [newBanner, setNewBanner] = useState<AffiliateBanner>({ name: '', url: '', imageUrl: '', description: '' });

    useEffect(() => {
        if (sessionStorage.getItem('isAdminAuthenticated') === 'true') {
            setIsAuthenticated(true);
        }
    }, []);
    
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordInput === getAdminPassword()) {
            setIsAuthenticated(true);
            sessionStorage.setItem('isAdminAuthenticated', 'true');
            setError('');
        } else {
            setError('Invalid password. Please try again.');
        }
    };
    
    const handleForgotPasswordRequest = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        if (emailInput.toLowerCase() === PRE_CONFIGURED_ADMIN_EMAIL.toLowerCase()) {
            const token = Math.random().toString(36).substring(2, 10);
            sessionStorage.setItem('resetToken', token);
            setMessage(`A reset token has been generated: ${token}\nPlease use it on the next screen.`);
            // In a real app, you'd email the token and direct to a URL. Here we simulate.
            setTimeout(() => {
                setAuthView('reset');
                setMessage('');
            }, 5000); // Give user time to see the token
        } else {
            setError('The provided email does not match the configured admin email.');
        }
    };

    const handlePasswordReset = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        const storedToken = sessionStorage.getItem('resetToken');

        if (!tokenInput || tokenInput !== storedToken) {
            setError('Invalid or expired token.');
            return;
        }
        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        localStorage.setItem('adminPassword', newPassword);
        sessionStorage.removeItem('resetToken');
        setMessage('Password reset successfully! Please log in with your new password.');
        setAuthView('login');
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem('isAdminAuthenticated');
        setPasswordInput('');
    };

    const handleAddPost = (e: React.FormEvent) => {
        e.preventDefault();
        setBlogPosts(prev => [...prev, { ...newPost, id: Date.now() }]);
        setNewPost({ title: '', excerpt: '', author: '', date: '' });
    };

    const handleDeletePost = (id: number) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            setBlogPosts(prev => prev.filter(post => post.id !== id));
        }
    };
    
    const handleAddBanner = (e: React.FormEvent) => {
        e.preventDefault();
        setAffiliateBanners(prev => [...prev, newBanner]);
        setNewBanner({ name: '', url: '', imageUrl: '', description: '' });
    }

    const handleDeleteBanner = (name: string) => {
        if (window.confirm('Are you sure you want to delete this banner?')) {
            setAffiliateBanners(prev => prev.filter(banner => banner.name !== name));
        }
    }

    const renderAuthForms = () => {
        switch (authView) {
            case 'forgot':
                return (
                    <div className="container mx-auto max-w-sm p-8 bg-white rounded-lg shadow-xl m-4">
                        <div className="text-center mb-6">
                            <MailIcon className="h-10 w-10 mx-auto text-blue-600" />
                            <h1 className="text-2xl font-bold mt-4 text-gray-800">Forgot Password</h1>
                            <p className="text-gray-500 text-sm mt-1">Enter your admin email to receive a reset token.</p>
                        </div>
                        <form onSubmit={handleForgotPasswordRequest}>
                            <Input label="Admin Email" type="email" value={emailInput} onChange={e => setEmailInput(e.target.value)} required />
                            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                            {message && <p className="text-green-600 bg-green-50 p-3 rounded-md text-sm mt-2">{message}</p>}
                            <button type="submit" className="mt-6 w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition-colors">
                                Send Reset Token
                            </button>
                            <button onClick={() => { setAuthView('login'); setError('') }} type="button" className="mt-2 w-full text-center text-sm text-blue-600 hover:underline">
                                Back to Login
                            </button>
                        </form>
                    </div>
                );
            case 'reset':
                 return (
                    <div className="container mx-auto max-w-sm p-8 bg-white rounded-lg shadow-xl m-4">
                        <div className="text-center mb-6">
                            <LockClosedIcon className="h-10 w-10 mx-auto text-blue-600" />
                            <h1 className="text-2xl font-bold mt-4 text-gray-800">Reset Password</h1>
                            <p className="text-gray-500 text-sm mt-1">Enter the token and your new password.</p>
                        </div>
                        <form onSubmit={handlePasswordReset} className="space-y-4">
                            <Input label="Reset Token" type="text" value={tokenInput} onChange={e => setTokenInput(e.target.value)} required />
                            <Input label="New Password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                            <Input label="Confirm New Password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            <button type="submit" className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition-colors">
                                Set New Password
                            </button>
                             <button onClick={() => { setAuthView('login'); setError('') }} type="button" className="mt-2 w-full text-center text-sm text-blue-600 hover:underline">
                                Back to Login
                            </button>
                        </form>
                    </div>
                );
            case 'login':
            default:
                return (
                    <div className="container mx-auto max-w-sm p-8 bg-white rounded-lg shadow-xl m-4">
                        <div className="text-center mb-6">
                            <LockClosedIcon className="h-10 w-10 mx-auto text-blue-600" />
                            <h1 className="text-2xl font-bold mt-4 text-gray-800">Admin Panel Access</h1>
                        </div>
                        <form onSubmit={handleLogin}>
                            <Input label="Password" type="password" value={passwordInput} onChange={e => setPasswordInput(e.target.value)} required />
                            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                            {message && <p className="text-green-600 text-sm mt-2">{message}</p>}
                            <button type="submit" className="mt-6 w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition-colors">
                                Login
                            </button>
                            <div className="text-center mt-4">
                                <button onClick={() => { setAuthView('forgot'); setError('') }} type="button" className="text-sm text-blue-600 hover:underline">
                                    Forgot Password?
                                </button>
                            </div>
                        </form>
                    </div>
                );
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="flex-grow flex items-center justify-center bg-gray-100">
                {renderAuthForms()}
            </div>
        );
    }

    const tabButtonClasses = (tab: AdminTab) => `px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
        activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    }`;

    return (
        <div className="container mx-auto p-4 lg:p-8">
            <div className="flex justify-between items-center border-b pb-4 mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
                <button 
                    onClick={handleLogout} 
                    className="flex items-center px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                    <LogoutIcon className="h-5 w-5 mr-2" />
                    Logout
                </button>
            </div>
            <div className="flex space-x-2 mb-6">
                <button onClick={() => setActiveTab('blog')} className={tabButtonClasses('blog')}>Blog Posts</button>
                <button onClick={() => setActiveTab('affiliates')} className={tabButtonClasses('affiliates')}>Affiliate Banners</button>
                <button onClick={() => setActiveTab('adsense')} className={tabButtonClasses('adsense')}>AdSense</button>
            </div>

            {activeTab === 'blog' && (
                <div>
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <h2 className="text-xl font-bold mb-4">Add New Blog Post</h2>
                        <form onSubmit={handleAddPost} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Title" value={newPost.title} onChange={e => setNewPost({...newPost, title: e.target.value})} required />
                            <Input label="Author" value={newPost.author} onChange={e => setNewPost({...newPost, author: e.target.value})} required />
                            <Input label="Date" type="date" value={newPost.date} onChange={e => setNewPost({...newPost, date: e.target.value})} required />
                            <Textarea label="Excerpt" value={newPost.excerpt} onChange={e => setNewPost({...newPost, excerpt: e.target.value})} required className="md:col-span-2" />
                            <button type="submit" className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700">
                                <AddIcon className="h-5 w-5 mr-2" /> Add Post
                            </button>
                        </form>
                    </div>
                    <div className="space-y-4">
                        {blogPosts.map(post => (
                            <div key={post.id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-gray-800">{post.title}</h3>
                                    <p className="text-sm text-gray-600">by {post.author} on {post.date}</p>
                                </div>
                                <div className="flex space-x-2">
                                    <button onClick={() => alert("Edit functionality is a great next step!")} className="p-2 text-gray-500 hover:text-blue-600"><PencilIcon className="h-5 w-5" /></button>
                                    <button onClick={() => handleDeletePost(post.id)} className="p-2 text-gray-500 hover:text-red-600"><TrashIcon className="h-5 w-5" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {activeTab === 'affiliates' && (
                 <div>
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <h2 className="text-xl font-bold mb-4">Add New Affiliate Banner</h2>
                        <form onSubmit={handleAddBanner} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Name" value={newBanner.name} onChange={e => setNewBanner({...newBanner, name: e.target.value})} required />
                            <Input label="Target URL" type="url" value={newBanner.url} onChange={e => setNewBanner({...newBanner, url: e.target.value})} required />
                            <Input label="Image URL" type="url" value={newBanner.imageUrl} onChange={e => setNewBanner({...newBanner, imageUrl: e.target.value})} required className="md:col-span-2" />
                            <Textarea label="Description" value={newBanner.description} onChange={e => setNewBanner({...newBanner, description: e.target.value})} required className="md:col-span-2" />
                            <button type="submit" className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700">
                                <AddIcon className="h-5 w-5 mr-2" /> Add Banner
                            </button>
                        </form>
                    </div>
                    <div className="space-y-4">
                        {affiliateBanners.map(banner => (
                            <div key={banner.name} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                                <div className="flex items-center space-x-4">
                                    <img src={banner.imageUrl} alt={banner.name} className="h-10 w-20 object-cover rounded" />
                                    <div>
                                        <h3 className="font-bold text-gray-800">{banner.name}</h3>
                                        <a href={banner.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline break-all">{banner.url}</a>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button onClick={() => alert("Edit functionality is a great next step!")} className="p-2 text-gray-500 hover:text-blue-600"><PencilIcon className="h-5 w-5" /></button>
                                    <button onClick={() => handleDeleteBanner(banner.name)} className="p-2 text-gray-500 hover:text-red-600"><TrashIcon className="h-5 w-5" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                 </div>
            )}

            {activeTab === 'adsense' && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">Managing AdSense</h2>
                    <p className="text-gray-700 mb-4">
                        AdSense is managed directly through your Google AdSense account. This application uses placeholder blocks to show where ads would appear. To manage your ads, including ad units, performance, and payments, you must log in to the official AdSense dashboard.
                    </p>
                    <a href="https://www.google.com/adsense/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition-colors">
                        <ExternalLinkIcon className="h-5 w-5 mr-2" />
                        Go to AdSense Dashboard
                    </a>
                    <div className="mt-6 border-t pt-6">
                        <h3 className="text-lg font-semibold">Ad Placement in This App</h3>
                        <p className="text-sm text-gray-600 mt-2">Ad slots are currently placed in the following locations:</p>
                        <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
                            <li>Right sidebar on the Blog page.</li>
                            <li>In-line between blog posts.</li>
                            <li>Footer of all pages.</li>
                            <li>Bottom of the Resume Editor sidebar.</li>
                        </ul>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AdminPanel;