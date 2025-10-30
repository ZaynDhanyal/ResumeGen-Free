import React, { useState, useEffect } from 'react';
import { BlogPost, AffiliateBanner } from '../types';
import { PRE_CONFIGURED_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD } from '../constants';
import { LockClosedIcon, PencilIcon, TrashIcon, AddIcon, ExternalLinkIcon, LogoutIcon, MailIcon, CloseIcon } from './icons';

interface AdminPanelProps {
    blogPosts: BlogPost[];
    setBlogPosts: React.Dispatch<React.SetStateAction<BlogPost[]>>;
    affiliateBanners: AffiliateBanner[];
    setAffiliateBanners: React.Dispatch<React.SetStateAction<AffiliateBanner[]>>;
}

type AdminTab = 'blog' | 'affiliates' | 'adsense';
type AdminAuthView = 'login' | 'forgot' | 'reset';
type ValidationErrors = { [key: string]: string };

const getAdminPassword = (): string => {
    // SECURITY NOTE: This is for a client-side only application. In a real-world scenario,
    // authentication should be handled by a secure backend service, not by storing
    // a password in localStorage.
    try {
        return localStorage.getItem('adminPassword') || DEFAULT_ADMIN_PASSWORD;
    } catch {
        return DEFAULT_ADMIN_PASSWORD;
    }
};

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }> = ({ label, id, error, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        <input id={id} {...props} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition ${error ? 'border-red-500 ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white`} />
        {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
);

const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string }> = ({ label, id, error, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        <textarea id={id} {...props} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition ${error ? 'border-red-500 ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white`} rows={4} />
        {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
);


const AdminPanel: React.FC<AdminPanelProps> = ({ blogPosts, setBlogPosts, affiliateBanners, setAffiliateBanners }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [activeTab, setActiveTab] = useState<AdminTab>('blog');
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

    // --- Auth State ---
    const [authView, setAuthView] = useState<AdminAuthView>('login');
    const [passwordInput, setPasswordInput] = useState('');
    const [emailInput, setEmailInput] = useState('');
    const [tokenInput, setTokenInput] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [authError, setAuthError] = useState('');
    const [authMessage, setAuthMessage] = useState('');

    // --- Modals and Editing State ---
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

    const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState<AffiliateBanner | null>(null);

    useEffect(() => {
        if (sessionStorage.getItem('isAdminAuthenticated') === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    const validateUrl = (url: string) => {
        try {
            new URL(url);
            return true;
        } catch (_) {
            return false;
        }
    }
    
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordInput === getAdminPassword()) {
            setIsAuthenticated(true);
            sessionStorage.setItem('isAdminAuthenticated', 'true');
            setAuthError('');
        } else {
            setAuthError('Invalid password. Please try again.');
        }
    };
    
    const handleForgotPasswordRequest = (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError('');
        setAuthMessage('');
        if (emailInput.toLowerCase() === PRE_CONFIGURED_ADMIN_EMAIL.toLowerCase()) {
            const token = Math.random().toString(36).substring(2, 10);
            sessionStorage.setItem('resetToken', token);
            setAuthMessage(`A reset token has been generated: ${token}\nPlease use it on the next screen.`);
            setTimeout(() => {
                setAuthView('reset');
                setAuthMessage('');
            }, 5000);
        } else {
            setAuthError('The provided email does not match the configured admin email.');
        }
    };

    const handlePasswordReset = (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError('');
        setAuthMessage('');
        const storedToken = sessionStorage.getItem('resetToken');

        if (!tokenInput || tokenInput !== storedToken) {
            setAuthError('Invalid or expired token.');
            return;
        }
        if (newPassword.length < 6) {
            setAuthError('Password must be at least 6 characters long.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setAuthError('Passwords do not match.');
            return;
        }

        localStorage.setItem('adminPassword', newPassword);
        sessionStorage.removeItem('resetToken');
        setAuthMessage('Password reset successfully! Please log in with your new password.');
        setAuthView('login');
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem('isAdminAuthenticated');
        setPasswordInput('');
    };

    const openPostModal = (post: BlogPost | null) => {
        setEditingPost(post ? { ...post } : { id: 0, title: '', excerpt: '', author: '', date: '', imageUrl: '' });
        setIsPostModalOpen(true);
        setValidationErrors({});
    };

    const handlePostSave = () => {
        const errors: ValidationErrors = {};
        if (!editingPost?.title) errors.title = "Title is required.";
        if (!editingPost?.author) errors.author = "Author is required.";
        if (!editingPost?.date) errors.date = "Date is required.";
        if (!editingPost?.excerpt) errors.excerpt = "Excerpt is required.";

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        if (editingPost!.id === 0) { // Adding new
            setBlogPosts(prev => [...prev, { ...editingPost!, id: Date.now() }]);
        } else { // Updating existing
            setBlogPosts(prev => prev.map(p => p.id === editingPost!.id ? editingPost! : p));
        }
        setIsPostModalOpen(false);
        setEditingPost(null);
    };

    const handleDeletePost = (id: number) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            setBlogPosts(prev => prev.filter(post => post.id !== id));
        }
    };
    
    const openBannerModal = (banner: AffiliateBanner | null) => {
        setEditingBanner(banner ? { ...banner } : { id: '', name: '', url: '', imageUrl: '', description: '' });
        setIsBannerModalOpen(true);
        setValidationErrors({});
    };

    const handleBannerSave = () => {
        const errors: ValidationErrors = {};
        if (!editingBanner?.name) errors.name = "Name is required.";
        if (editingBanner?.id === '' && affiliateBanners.some(b => b.name === editingBanner.name)) {
            errors.name = "A banner with this name already exists.";
        }
        if (!editingBanner?.url || !validateUrl(editingBanner.url)) errors.url = "A valid URL is required.";
        if (!editingBanner?.imageUrl) errors.imageUrl = "Image is required.";
        if (!editingBanner?.description) errors.description = "Description is required.";

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        if (editingBanner!.id === '') { // Adding new
            setAffiliateBanners(prev => [...prev, { ...editingBanner!, id: crypto.randomUUID() }]);
        } else { // Updating existing
            setAffiliateBanners(prev => prev.map(b => b.id === editingBanner!.id ? editingBanner! : b));
        }
        setIsBannerModalOpen(false);
        setEditingBanner(null);
    };

    const handleDeleteBanner = (id: string) => {
        if (window.confirm('Are you sure you want to delete this banner?')) {
            setAffiliateBanners(prev => prev.filter(banner => banner.id !== id));
        }
    }
    
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (field: string, value: any) => void) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setter('imageUrl', reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const renderAuthForms = () => {
        switch (authView) {
            case 'forgot':
                return (
                    <div className="container mx-auto max-w-sm p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl m-4">
                        <div className="text-center mb-6">
                            <MailIcon className="h-10 w-10 mx-auto text-blue-600" />
                            <h1 className="text-2xl font-bold mt-4 text-gray-800 dark:text-gray-100">Forgot Password</h1>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Enter your admin email to receive a reset token.</p>
                        </div>
                        <form onSubmit={handleForgotPasswordRequest}>
                            <Input label="Admin Email" id="email" type="email" value={emailInput} onChange={e => setEmailInput(e.target.value)} required />
                            {authError && <p className="text-red-500 text-sm mt-2">{authError}</p>}
                            {authMessage && <p className="text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/50 p-3 rounded-md text-sm mt-2">{authMessage}</p>}
                            <button type="submit" className="mt-6 w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition-colors">
                                Send Reset Token
                            </button>
                            <button onClick={() => { setAuthView('login'); setAuthError('') }} type="button" className="mt-2 w-full text-center text-sm text-blue-600 hover:underline">
                                Back to Login
                            </button>
                        </form>
                    </div>
                );
            case 'reset':
                 return (
                    <div className="container mx-auto max-w-sm p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl m-4">
                        <div className="text-center mb-6">
                            <LockClosedIcon className="h-10 w-10 mx-auto text-blue-600" />
                            <h1 className="text-2xl font-bold mt-4 text-gray-800 dark:text-gray-100">Reset Password</h1>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Enter the token and your new password.</p>
                        </div>
                        <form onSubmit={handlePasswordReset} className="space-y-4">
                            <Input label="Reset Token" id="token" type="text" value={tokenInput} onChange={e => setTokenInput(e.target.value)} required />
                            <Input label="New Password" id="new-password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                            <Input label="Confirm New Password" id="confirm-password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                            {authError && <p className="text-red-500 text-sm">{authError}</p>}
                            <button type="submit" className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition-colors">
                                Set New Password
                            </button>
                             <button onClick={() => { setAuthView('login'); setAuthError('') }} type="button" className="mt-2 w-full text-center text-sm text-blue-600 hover:underline">
                                Back to Login
                            </button>
                        </form>
                    </div>
                );
            case 'login':
            default:
                return (
                    <div className="container mx-auto max-w-sm p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl m-4">
                        <div className="text-center mb-6">
                            <LockClosedIcon className="h-10 w-10 mx-auto text-blue-600" />
                            <h1 className="text-2xl font-bold mt-4 text-gray-800 dark:text-gray-100">Admin Panel Access</h1>
                        </div>
                        <form onSubmit={handleLogin}>
                            <Input label="Password" id="password" type="password" value={passwordInput} onChange={e => setPasswordInput(e.target.value)} required />
                            {authError && <p className="text-red-500 text-sm mt-2">{authError}</p>}
                            {authMessage && <p className="text-green-600 dark:text-green-400 text-sm mt-2">{authMessage}</p>}
                            <button type="submit" className="mt-6 w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition-colors">
                                Login
                            </button>
                            <div className="text-center mt-4">
                                <button onClick={() => { setAuthView('forgot'); setAuthError('') }} type="button" className="text-sm text-blue-600 hover:underline">
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
            <div className="flex-grow flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                {renderAuthForms()}
            </div>
        );
    }

    const tabButtonClasses = (tab: AdminTab) => `px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
        activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
    }`;

    return (
        <div className="container mx-auto p-4 lg:p-8">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b dark:border-gray-700 pb-4 mb-6 gap-4">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Admin Panel</h1>
                <button 
                    onClick={handleLogout} 
                    className="flex items-center justify-center sm:w-auto w-full px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                    <LogoutIcon className="h-5 w-5 mr-2" />
                    Logout
                </button>
            </div>
            <div className="flex space-x-2 mb-6 border-b dark:border-gray-700 overflow-x-auto pb-2">
                <button onClick={() => setActiveTab('blog')} className={tabButtonClasses('blog')}>Blog Posts</button>
                <button onClick={() => setActiveTab('affiliates')} className={tabButtonClasses('affiliates')}>Affiliate Banners</button>
                <button onClick={() => setActiveTab('adsense')} className={tabButtonClasses('adsense')}>AdSense</button>
            </div>

            {/* BLOG POSTS TAB */}
            {activeTab === 'blog' && (
                <div>
                    <div className="flex justify-end mb-4">
                        <button onClick={() => openPostModal(null)} className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700">
                            <AddIcon className="h-5 w-5 mr-2" /> Add New Post
                        </button>
                    </div>
                    <div className="space-y-4">
                        {blogPosts.length > 0 ? blogPosts.map(post => (
                            <div key={post.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                                <div className="flex items-center gap-4 w-full">
                                    {post.imageUrl && <img src={post.imageUrl} alt={post.title} className="h-12 w-20 object-cover rounded hidden sm:block"/>}
                                    <div>
                                        <h3 className="font-bold text-gray-800 dark:text-gray-100">{post.title}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">by {post.author} on {new Date(post.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex space-x-2 self-end sm:self-center">
                                    <button onClick={() => openPostModal(post)} className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"><PencilIcon className="h-5 w-5" /></button>
                                    <button onClick={() => handleDeletePost(post.id)} className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400"><TrashIcon className="h-5 w-5" /></button>
                                </div>
                            </div>
                        )) : (
                            <p className="text-center text-gray-500 dark:text-gray-400 py-8">No blog posts found. Add one to get started!</p>
                        )}
                    </div>
                </div>
            )}
            
            {/* AFFILIATE BANNERS TAB */}
            {activeTab === 'affiliates' && (
                 <div>
                    <div className="flex justify-end mb-4">
                        <button onClick={() => openBannerModal(null)} className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700">
                            <AddIcon className="h-5 w-5 mr-2" /> Add New Banner
                        </button>
                    </div>
                    <div className="space-y-4">
                         {affiliateBanners.length > 0 ? affiliateBanners.map(banner => (
                            <div key={banner.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                                <div className="flex items-center space-x-4 w-full">
                                    <img src={banner.imageUrl} alt={banner.name} className="h-10 w-20 object-cover rounded hidden sm:block" />
                                    <div>
                                        <h3 className="font-bold text-gray-800 dark:text-gray-100">{banner.name}</h3>
                                        <a href={banner.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline break-all">{banner.url}</a>
                                    </div>
                                </div>
                                <div className="flex space-x-2 self-end sm:self-center">
                                    <button onClick={() => openBannerModal(banner)} className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"><PencilIcon className="h-5 w-5" /></button>
                                    <button onClick={() => handleDeleteBanner(banner.id)} className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400"><TrashIcon className="h-5 w-5" /></button>
                                </div>
                            </div>
                        )) : (
                            <p className="text-center text-gray-500 dark:text-gray-400 py-8">No affiliate banners found. Add one to get started!</p>
                        )}
                    </div>
                 </div>
            )}

            {activeTab === 'adsense' && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Managing AdSense</h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                        AdSense is managed directly through your Google AdSense account. This application uses placeholder blocks to show where ads would appear. To manage your ads, including ad units, performance, and payments, you must log in to the official AdSense dashboard.
                    </p>
                    <a href="https://www.google.com/adsense/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition-colors">
                        <ExternalLinkIcon className="h-5 w-5 mr-2" />
                        Go to AdSense Dashboard
                    </a>
                </div>
            )}
            
            {/* Blog Post Modal */}
            {isPostModalOpen && editingPost && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl">
                        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{editingPost.id === 0 ? 'Add New Post' : 'Edit Post'}</h3>
                            <button onClick={() => setIsPostModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200"><CloseIcon className="h-6 w-6" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                             <Input id="post-title" label="Title" value={editingPost.title} onChange={e => setEditingPost({...editingPost, title: e.target.value})} error={validationErrors.title} />
                             <Input id="post-author" label="Author" value={editingPost.author} onChange={e => setEditingPost({...editingPost, author: e.target.value})} error={validationErrors.author}/>
                             <Input id="post-date" label="Date" type="date" value={editingPost.date} onChange={e => setEditingPost({...editingPost, date: e.target.value})} error={validationErrors.date}/>
                             <Textarea id="post-excerpt" label="Excerpt" value={editingPost.excerpt} onChange={e => setEditingPost({...editingPost, excerpt: e.target.value})} error={validationErrors.excerpt}/>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Featured Image</label>
                                {editingPost.imageUrl && <img src={editingPost.imageUrl} alt="preview" className="h-20 rounded mb-2"/>}
                                <input type="file" accept="image/*" onChange={e => handleImageUpload(e, (field, value) => setEditingPost({...editingPost, [field]: value}))} className="text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900/50 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-900"/>
                             </div>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t dark:border-gray-700 flex justify-end">
                            <button onClick={handlePostSave} className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">Save Post</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Affiliate Banner Modal */}
            {isBannerModalOpen && editingBanner && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl">
                        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{editingBanner.id === '' ? 'Add New Banner' : 'Edit Banner'}</h3>
                            <button onClick={() => setIsBannerModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200"><CloseIcon className="h-6 w-6" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                           <Input id="banner-name" label="Name" value={editingBanner.name} onChange={e => setEditingBanner({...editingBanner, name: e.target.value})} error={validationErrors.name}/>
                           <Input id="banner-url" label="Target URL" type="url" value={editingBanner.url} onChange={e => setEditingBanner({...editingBanner, url: e.target.value})} error={validationErrors.url}/>
                           <Textarea id="banner-desc" label="Description" value={editingBanner.description} onChange={e => setEditingBanner({...editingBanner, description: e.target.value})} error={validationErrors.description}/>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Banner Image</label>
                                {editingBanner.imageUrl && <img src={editingBanner.imageUrl} alt="preview" className="h-20 rounded mb-2"/>}
                                <input id="banner-image" type="file" accept="image/*" onChange={e => handleImageUpload(e, (field, value) => setEditingBanner({...editingBanner, [field]: value}))} className="text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900/50 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-900"/>
                                {validationErrors.imageUrl && <p className="text-red-600 text-xs mt-1">{validationErrors.imageUrl}</p>}
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t dark:border-gray-700 flex justify-end">
                            <button onClick={handleBannerSave} className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">Save Banner</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AdminPanel;