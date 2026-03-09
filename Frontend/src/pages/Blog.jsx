import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { handleFormSubmission } from '../utils/formHandler';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import { CompanyPageHero } from './CompanyPages';
import API from '../config';


async function apiFetch(method, path, body) {
    const token = localStorage.getItem('vsdox_token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
    const res = await fetch(API + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
}

// ── Blog Card — identical to public view ──────────────────────────────
const BlogCard = ({ id, category, date, title, excerpt, image, author, authorRole, status, slug, isAdmin, onStatusChange, onDelete }) => {
    const [loading, setLoading] = useState(false);

    const handlePublish = async () => {
        setLoading(true);
        try { await apiFetch('PATCH', `/posts/admin/${id}/publish`); onStatusChange(id, 'published'); }
        catch (e) { alert(e.message); }
        setLoading(false);
    };
    const handleWithdraw = async () => {
        setLoading(true);
        try { await apiFetch('PATCH', `/posts/admin/${id}/withdraw`); onStatusChange(id, 'draft'); }
        catch (e) { alert(e.message); }
        setLoading(false);
    };
    const handleDelete = async () => {
        if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
        setLoading(true);
        try { await apiFetch('DELETE', `/posts/admin/${id}`); onDelete(id); }
        catch (e) { alert(e.message); }
        setLoading(false);
    };

    return (
        <div className="glass-card blog-card reveal" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            {isAdmin && (
                <div style={{
                    position: 'absolute', top: '10px', right: '10px', zIndex: 10,
                    background: status === 'published' ? '#22c55e' : status === 'draft' ? '#f59e0b' : '#94a3b8',
                    color: 'white', padding: '3px 10px', borderRadius: '50px',
                    fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px'
                }}>{status}</div>
            )}
            <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                <img src={image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1000&auto=format&fit=crop'} alt={title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: '15px', left: '15px', background: 'var(--primary)', color: 'white', padding: '4px 12px', borderRadius: '50px', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {category || 'General'}
                </div>
            </div>
            <div style={{ padding: '24px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>{date}</div>
                <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '12px', lineHeight: '1.4' }}>{title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.6', marginBottom: '20px', flexGrow: 1 }}>{excerpt}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e2e8f0', overflow: 'hidden' }}>
                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(author || 'Author')}&background=random`} alt={author} />
                    </div>
                    <div>
                        <div style={{ fontSize: '14px', fontWeight: '700' }}>{author || 'VSDox Team'}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{authorRole || ''}</div>
                    </div>
                    <Link to={`/blog/${slug}`} style={{ marginLeft: 'auto', color: 'var(--primary)', fontWeight: '700', fontSize: '14px' }}>Read Article</Link>
                </div>
                {isAdmin && (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
                        {status !== 'published' && (
                            <button onClick={handlePublish} disabled={loading}
                                style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: 'none', background: '#22c55e', color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
                                {loading ? '...' : '↑ Publish'}
                            </button>
                        )}
                        {status === 'published' && (
                            <button onClick={handleWithdraw} disabled={loading}
                                style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #f59e0b', background: 'transparent', color: '#f59e0b', fontWeight: '700', fontSize: '13px', cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
                                {loading ? '...' : '⏸ Withdraw'}
                            </button>
                        )}
                        <button onClick={handleDelete} disabled={loading}
                            style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #f43f5e', background: 'transparent', color: '#f43f5e', fontWeight: '700', fontSize: '13px', cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
                            {loading ? '...' : '🗑'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// ── Main Blog Component ───────────────────────────────────────────────
const Blog = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [posts, setPosts]           = useState([]);
    const [allPosts, setAllPosts]     = useState([]);
    const [loading, setLoading]       = useState(true);
    const [activeFilter, setActiveFilter] = useState('All');
    const [categories, setCategories] = useState(['All']);
    const [page, setPage]             = useState(1);
    const [hasMore, setHasMore]       = useState(false);
    const [adminMode, setAdminMode]   = useState(false);
    const [showDashboard, setShowDashboard] = useState(false); // ← slide-over

    useEffect(() => {
        window.scrollTo(0, 0);
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('fade-in'));
        loadPosts();
    }, []);

    useEffect(() => {
        if (!user) { setAdminMode(false); setAllPosts([]); }
    }, [user]);

    // Reload public posts when dashboard closes (new post may have been published)
    useEffect(() => {
        if (!showDashboard) loadPosts();
    }, [showDashboard]);

    const loadPosts = async (pageNum = 1, append = false) => {
        setLoading(true);
        try {
            const pub = await apiFetch('GET', `/posts?page=${pageNum}&limit=6`);
            const fetched = pub.posts || [];
            setPosts(prev => append ? [...prev, ...fetched] : fetched);
            setHasMore(fetched.length === 6);
            const cats = ['All', ...new Set(fetched.flatMap(p =>
                (p.categories || []).map(c => c?.name).filter(Boolean)
            ))];
            setCategories(prev => [...new Set([...prev, ...cats])]);
        } catch (e) { console.error('Failed to load posts:', e); }
        setLoading(false);
    };

    const loadAllPostsForAdmin = async () => {
        try {
            const res = await apiFetch('GET', '/posts/admin/all?limit=50');
            setAllPosts(res.posts || []);
        } catch (e) { console.error('Failed to load admin posts:', e); }
    };

    const handleLogout = async () => {
        await logout();
        setAdminMode(false);
        setAllPosts([]);
        navigate('/blog');
    };

    const toggleAdminMode = () => {
        if (!adminMode) loadAllPostsForAdmin();
        setAdminMode(prev => !prev);
    };

    const handleStatusChange = (id, newStatus) => {
        setAllPosts(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
        setPosts(prev => newStatus === 'published' ? prev : prev.filter(p => p.id !== id));
    };

    const handleDelete = (id) => {
        setAllPosts(prev => prev.filter(p => p.id !== id));
        setPosts(prev => prev.filter(p => p.id !== id));
    };

    const displayPosts = adminMode ? allPosts : posts;
    const filteredPosts = activeFilter === 'All'
        ? displayPosts
        : displayPosts.filter(p => (p.categories || []).some(c => c?.name === activeFilter));

    const formatPost = (p) => ({
        id: p.id, slug: p.slug,
        category: p.categories?.[0]?.name || 'General',
        date: p.date
            ? new Date(p.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
            : 'Draft',
        title: p.title,
        excerpt: p.excerpt || '',
        image: p.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1000&auto=format&fit=crop',
        author: p.author || 'VSDox Team',
        authorRole: '',
        status: p.status,
    });

    return (
        <main>
            {/* ── Admin Dashboard slide-over panel ─────────────────── */}
            {showDashboard && (
                <>
                    {/* Backdrop */}
                    <div onClick={() => setShowDashboard(false)}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, backdropFilter: 'blur(2px)' }} />
                    {/* Panel */}
                    <div style={{
                        position: 'fixed', top: 0, right: 0, width: 'min(900px, 100vw)', height: '100vh',
                        zIndex: 1001, boxShadow: '-8px 0 40px rgba(0,0,0,0.2)',
                        animation: 'slideInPanel 0.25s ease',
                        overflow: 'hidden',
                    }}>
                        <AdminDashboard onClose={() => setShowDashboard(false)} />
                    </div>
                </>
            )}

            {/* ── Hero — uses shared CompanyPageHero ───────────────── */}
            <CompanyPageHero
                tag="INSIGHTS & TRENDS"
                title="Insights & Blog"
                subtitle="Thought leadership, technology trends, and industry updates from the experts in document intelligence."
                bgImage="https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2400&auto=format&fit=crop"
            />

            <section style={{ padding: '80px 0', background: '#f8fafc' }}>
                <div className="max-container">

                    {/* Header row */}
                    {user ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '60px', flexWrap: 'wrap', gap: '20px' }}>

                        {/* Admin controls */}
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            
                                <>
                                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>👤 {user.name}</span>
                                    <button onClick={toggleAdminMode}
                                        style={{ padding: '9px 18px', borderRadius: '8px', border: `1px solid ${adminMode ? 'var(--primary)' : '#e2e8f0'}`, background: adminMode ? 'var(--primary)' : 'white', color: adminMode ? 'white' : 'var(--text-main)', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>
                                        {adminMode ? '✓ Admin Mode ON' : 'Admin Mode'}
                                    </button>
                                    {/* + New Post opens slide-over */}
                                    <button onClick={() => setShowDashboard(true)}
                                        style={{ padding: '9px 18px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: 'var(--text-main)', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>
                                        + New Post
                                    </button>
                                </>
                        </div>
                    </div>) : (<></>)}

                    {/* Category filters */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '40px', flexWrap: 'wrap' }}>
                        {categories.map((cat, i) => (
                            <button key={i} onClick={() => setActiveFilter(cat)}
                                style={{ padding: '10px 24px', borderRadius: '50px', border: activeFilter === cat ? 'none' : '1px solid var(--border)', background: activeFilter === cat ? 'var(--primary)' : 'white', color: activeFilter === cat ? 'white' : 'var(--text-main)', fontWeight: '600', cursor: 'pointer', fontSize: '14px', transition: 'all 0.2s' }}>
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Admin mode banner */}
                    {adminMode && (
                        <div style={{ background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: '10px', padding: '12px 20px', marginBottom: '24px', fontSize: '14px', color: '#92400e', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            ⚠️ <strong>Admin Mode:</strong> Showing all posts including drafts. Use Publish / Withdraw / Delete buttons on each card.
                        </div>
                    )}

                    {/* Posts grid */}
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-muted)', fontSize: '16px' }}>Loading posts…</div>
                    ) : filteredPosts.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-muted)' }}>
                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
                            <p style={{ fontSize: '18px', fontWeight: '600' }}>No posts found</p>
                            {user && (
                                <button onClick={() => setShowDashboard(true)}
                                    style={{ marginTop: '12px', background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>
                                    Create your first post →
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="industry-grid-detailed" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px' }}>
                            {filteredPosts.map((post) => (
                                <BlogCard key={post.id} {...formatPost(post)} isAdmin={!!user}
                                    onStatusChange={handleStatusChange} onDelete={handleDelete} />
                            ))}
                        </div>
                    )}

                    {/* Load more */}
                    {hasMore && !adminMode && (
                        <div style={{ textAlign: 'center', marginTop: '60px' }}>
                            <button className="btn-outline" style={{ padding: '14px 40px' }}
                                onClick={() => { const next = page + 1; setPage(next); loadPosts(next, true); }}>
                                Load More Articles
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Newsletter CTA */}
            <section style={{ padding: '80px 0', background: 'var(--primary)', color: 'white', textAlign: 'center' }}>
                <div className="max-container">
                    <h2 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '16px' }}>Stay Ahead of the Curve</h2>
                    <p style={{ fontSize: '18px', opacity: 0.9, marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
                        Get the latest insights on AI-powered document management and digital transformation directly in your inbox.
                    </p>
                    <NewsletterForm />
                </div>
            </section>

            <style>{`
                @keyframes slideInPanel {
                    from { transform: translateX(100%); }
                    to   { transform: translateX(0); }
                }
            `}</style>
        </main>
    );
};

// ── Newsletter Form ────────────────────────────────────────────────────
const NewsletterForm = () => {
    const [email, setEmail]       = React.useState('');
    const [submitted, setSubmitted] = React.useState(false);
    const [sending, setSending]   = React.useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        const success = await handleFormSubmission({ email, subject: 'Newsletter Subscription' }, 'corp@virsoftech.com');
        if (success) setSubmitted(true);
        setSending(false);
    };

    if (submitted) return (
        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '12px', display: 'inline-block' }}>
            <h4 style={{ margin: 0 }}>🎉 Thank you for subscribing!</h4>
        </div>
    );

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', maxWidth: '500px', margin: '0 auto', gap: '10px', flexWrap: 'wrap' }}>
            <input type="email" placeholder="Your work email" value={email} onChange={e => setEmail(e.target.value)} required
                style={{ flexGrow: 1, padding: '16px 24px', borderRadius: '12px', border: 'none', fontSize: '16px', color: '#0f172a' }} />
            <button type="submit" className="btn-primary" disabled={sending}
                style={{ background: 'white', color: 'var(--primary)', fontWeight: '800', opacity: sending ? 0.7 : 1 }}>
                {sending ? 'Subscribing...' : 'Subscribe'}
            </button>
        </form>
    );
};

export default Blog;