import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import API from '../config';

const BlogPost = () => {
    const { slug } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchPost();
    }, [slug]);

    const fetchPost = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API}/posts/${slug}`);

            if (res.status === 404) {
                // Post may be a draft — try admin preview if logged in
                const adminToken = localStorage.getItem('vsdox_token');
                if (adminToken) {
                    // We only have slug here; search all posts to find the id
                    const allRes = await fetch(`${API}/posts/admin/all?limit=200`, {
                        headers: { Authorization: `Bearer ${adminToken}` }
                    });
                    if (allRes.ok) {
                        const allData = await allRes.json();
                        const match = (allData.posts || []).find(p => p.slug === slug);
                        if (match) {
                            const previewRes = await fetch(`${API}/posts/admin/${match.id}/preview`, {
                                headers: { Authorization: `Bearer ${adminToken}` }
                            });
                            if (previewRes.ok) {
                                const previewData = await previewRes.json();
                                setPost(previewData);
                                setLoading(false);
                                return;
                            }
                        }
                    }
                }
                setNotFound(true);
                return;
            }

            const data = await res.json();
            setPost(data);
        } catch {
            setNotFound(true);
        }
        setLoading(false);
    };

    const token = () => localStorage.getItem('vsdox_token');

    const handleWithdraw = async () => {
        if (!window.confirm('Withdraw this post back to draft?')) return;
        setActionLoading(true);
        try {
            await fetch(`${API}/posts/admin/${post.id}/withdraw`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token()}` }
            });
            navigate('/blog');
        } catch (e) { alert(e.message); }
        setActionLoading(false);
    };

    const handleDelete = async () => {
        if (!window.confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
        setActionLoading(true);
        try {
            await fetch(`${API}/posts/admin/${post.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token()}` }
            });
            navigate('/blog');
        } catch (e) { alert(e.message); }
        setActionLoading(false);
    };

    // ── Loading ──────────────────────────────────────────────────────
    if (loading) return (
        <main>
            <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: '40px', marginBottom: '16px' }}>⏳</div>
                    <p>Loading article…</p>
                </div>
            </div>
        </main>
    );

    // ── Not found ────────────────────────────────────────────────────
    if (notFound) return (
        <main>
            <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '64px', marginBottom: '16px' }}>📄</div>
                    <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '12px' }}>Article Not Found</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '28px' }}>This post may have been removed or the URL is incorrect.</p>
                    <Link to="/blog" className="btn-primary" style={{ textDecoration: 'none', padding: '12px 28px' }}>← Back to Blog</Link>
                </div>
            </div>
        </main>
    );

    return (
        <main>
            {/* Hero */}
            <section className="page-hero-container">
                <div
                    className="page-hero-bg"
                    style={{
                        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.85)),
                        url('${post.image}')`
                    }}
                />
                <div className="max-container">
                    <div className="page-hero-content reveal">
                        {/* Category badge */}
                        <div style={{ marginBottom: '16px' }}>
                            <span style={{
                                background: 'var(--primary)', color: 'white',
                                padding: '5px 16px', borderRadius: '50px',
                                fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px'
                            }}>
                                {post.category}
                            </span>
                        </div>

                        <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', lineHeight: '1.25', maxWidth: '800px' }}>
                            {post.title}
                        </h1>

                        {/* Meta row */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '24px', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <img
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(post.author)}&background=random`}
                                    alt={post.author}
                                    style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)' }}
                                />
                                <div>
                                    <div style={{ fontWeight: '700', fontSize: '14px' }}>{post.author}</div>
                                    <div style={{ fontSize: '12px', opacity: 0.7 }}>{post.authorRole}</div>
                                </div>
                            </div>
                            <span style={{ opacity: 0.5 }}>·</span>
                            <span style={{ fontSize: '14px', opacity: 0.8 }}>{post.date}</span>
                            {post.reading_time > 0 && (
                                <>
                                    <span style={{ opacity: 0.5 }}>·</span>
                                    <span style={{ fontSize: '14px', opacity: 0.8 }}>{post.reading_time} min read</span>
                                </>
                            )}
                            {post.views > 0 && (
                                <>
                                    <span style={{ opacity: 0.5 }}>·</span>
                                    <span style={{ fontSize: '14px', opacity: 0.8 }}>👁 {post.views} views</span>
                                </>
                            )}
                        </div>

                        <div className="breadcrumb" style={{ marginTop: '20px' }}>
                            <Link to="/">Home</Link> <span>/</span>
                            <Link to="/blog">Blog</Link> <span>/</span>
                            <span>{post.title}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Draft preview banner — shown to admin only for non-published posts */}
            {user && post.status !== 'published' && (
                <div style={{ background: '#dbeafe', borderBottom: '1px solid #93c5fd', padding: '10px 0' }}>
                    <div className="max-container" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: '#1d4ed8' }}>👁 Draft Preview</span>
                        <span style={{ fontSize: '13px', color: '#3b82f6' }}>This post is not yet published. Only admins can see this.</span>
                    </div>
                </div>
            )}

            {/* Admin action bar */}
            {user && (
                <div style={{
                    background: '#fef3c7', borderBottom: '1px solid #fcd34d',
                    padding: '12px 0'
                }}>
                    <div className="max-container" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#92400e' }}>
                            ⚠ Admin View
                        </span>
                        <span style={{
                            padding: '3px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700',
                            background: post.status === 'published' ? '#dcfce7' : '#fef9c3',
                            color: post.status === 'published' ? '#15803d' : '#854d0e',
                            border: `1px solid ${post.status === 'published' ? '#86efac' : '#fde047'}`
                        }}>
                            {post.status?.toUpperCase()}
                        </span>
                        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                            {post.status === 'published' && (
                                <button onClick={handleWithdraw} disabled={actionLoading}
                                    style={{ padding: '7px 16px', borderRadius: '7px', border: '1px solid #f59e0b', background: 'transparent', color: '#d97706', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>
                                    {actionLoading ? '…' : '⏸ Withdraw'}
                                </button>
                            )}
                            <button onClick={handleDelete} disabled={actionLoading}
                                style={{ padding: '7px 16px', borderRadius: '7px', border: '1px solid #f43f5e', background: 'transparent', color: '#f43f5e', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>
                                {actionLoading ? '…' : '🗑 Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Article body */}
            <section style={{ padding: '72px 0 80px', background: '#fff' }}>
                <div className="max-container">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr min(680px, 100%) 1fr', gap: '0' }}>
                        <div /> {/* left gutter */}
                        <article>
                            {/* Excerpt / lead */}
                            {post.excerpt && (
                                <p style={{
                                    fontSize: '20px', lineHeight: '1.7', color: 'var(--text-muted)',
                                    fontStyle: 'italic', borderLeft: '4px solid var(--primary)',
                                    paddingLeft: '20px', marginBottom: '40px'
                                }}>
                                    {post.excerpt}
                                </p>
                            )}

                            {/* Rendered HTML from markdown */}
                            <div
                                className="blog-body"
                                dangerouslySetInnerHTML={{ __html: post.body_html }}
                                style={{
                                    fontSize: '17px', lineHeight: '1.85',
                                    color: 'var(--text-main)',
                                }}
                            />

                            {/* Tags */}
                            {post.tags?.length > 0 && (
                                <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                                    <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>Tags:</span>
                                    {post.tags.map(t => (
                                        <span key={t.id} style={{
                                            padding: '4px 14px', borderRadius: '20px',
                                            background: '#f1f5f9', color: 'var(--text-muted)',
                                            fontSize: '13px', fontWeight: '500'
                                        }}>
                                            {t.name}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Author card */}
                            <div style={{
                                marginTop: '48px', padding: '28px', borderRadius: '16px',
                                background: '#f8fafc', border: '1px solid var(--border)',
                                display: 'flex', gap: '20px', alignItems: 'flex-start'
                            }}>
                                <img
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(post.author)}&background=random&size=80`}
                                    alt={post.author}
                                    style={{ width: '64px', height: '64px', borderRadius: '50%', flexShrink: 0 }}
                                />
                                <div>
                                    <div style={{ fontWeight: '800', fontSize: '16px', marginBottom: '4px' }}>{post.author}</div>
                                    <div style={{ color: 'var(--primary)', fontSize: '13px', fontWeight: '600', marginBottom: '10px' }}>{post.authorRole}</div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                                        Expert at VSDox in enterprise document management and digital transformation.
                                    </p>
                                </div>
                            </div>

                            {/* Back link */}
                            <div style={{ marginTop: '48px', textAlign: 'center' }}>
                                <Link to="/blog" className="btn-outline" style={{ textDecoration: 'none', padding: '12px 32px' }}>
                                    ← Back to Blog
                                </Link>
                            </div>
                        </article>
                        <div /> {/* right gutter */}
                    </div>
                </div>
            </section>

            {/* Blog body styles */}
            <style>{`
                .blog-body h1, .blog-body h2, .blog-body h3, .blog-body h4 {
                    font-weight: 800; line-height: 1.3; margin: 36px 0 16px; color: var(--text-main);
                }
                .blog-body h1 { font-size: 32px; }
                .blog-body h2 { font-size: 26px; }
                .blog-body h3 { font-size: 21px; }
                .blog-body p  { margin-bottom: 24px; }
                .blog-body ul, .blog-body ol { padding-left: 24px; margin-bottom: 24px; }
                .blog-body li { margin-bottom: 8px; line-height: 1.7; }
                .blog-body blockquote {
                    border-left: 4px solid var(--primary); padding: 4px 0 4px 20px;
                    margin: 32px 0; color: var(--text-muted); font-style: italic; font-size: 18px;
                }
                .blog-body code {
                    background: #f1f5f9; padding: 2px 8px; border-radius: 4px;
                    font-family: monospace; font-size: 14px; color: var(--primary);
                }
                .blog-body pre {
                    background: #1e293b; color: #e2e8f0; padding: 20px 24px;
                    border-radius: 10px; overflow-x: auto; margin: 28px 0;
                    font-size: 14px; line-height: 1.7;
                }
                .blog-body pre code { background: none; color: inherit; padding: 0; }
                .blog-body img { max-width: 100%; height: auto; border-radius: 10px; margin: 24px 0; display: block; }
                .blog-body img[src^="/uploads/"], .blog-body img[src*="localhost"] { border: 1px solid #e2e8f0; box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
                .blog-body a { color: var(--primary); font-weight: 600; }
                .blog-body hr { border: none; border-top: 1px solid var(--border); margin: 40px 0; }
                .blog-body strong { font-weight: 800; }
            `}</style>
        </main>
    );
};

export default BlogPost;