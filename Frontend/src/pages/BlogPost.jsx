import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/apiEndpoints';
import { AUTH_STORAGE_KEYS } from '../config/appConstants';
import { apiFetch, apiRequest } from '../services/apiClient';
import sanitizeHtml from '../utils/sanitizeHtml';

const BlogPost = () => {
  const { slug } = useParams();
  const { canManageContent } = useAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const lastLoadedKeyRef = useRef('');

  useEffect(() => {
    const key = `${slug}|${canManageContent}`;
    if (lastLoadedKeyRef.current === key) return;
    lastLoadedKeyRef.current = key;
    window.scrollTo(0, 0);

    const loadPost = async () => {
      setLoading(true);
      setNotFound(false);

      try {
        const { response, data } = await apiRequest(
          'GET',
          API_ENDPOINTS.posts.bySlug(slug),
          null,
          { throwOnError: false },
        );

        if (response.status === 404) {
          const adminToken = localStorage.getItem(AUTH_STORAGE_KEYS.token);
          if (adminToken && canManageContent) {
            const allPosts = await apiFetch('GET', API_ENDPOINTS.posts.adminAll(200), null, { token: adminToken });
            const match = (allPosts.posts || []).find((p) => p.slug === slug);

            if (match) {
              const preview = await apiFetch(
                'GET',
                API_ENDPOINTS.posts.adminPreview(match.id),
                null,
                { token: adminToken },
              );
              setPost(preview);
              setLoading(false);
              return;
            }
          }

          setNotFound(true);
          setLoading(false);
          return;
        }

        setPost(data);
      } catch {
        setNotFound(true);
      }

      setLoading(false);
    };

    loadPost();
  }, [slug, canManageContent]);

  const token = () => localStorage.getItem(AUTH_STORAGE_KEYS.token);

  const handleWithdraw = async () => {
    if (!canManageContent) {
      return;
    }
    if (!window.confirm('Withdraw this post back to draft?')) {
      return;
    }

    setActionLoading(true);
    try {
      await apiFetch('PATCH', API_ENDPOINTS.posts.withdraw(post.id), null, { token: token() });
      navigate('/blog');
    } catch (e) {
      alert(e.message);
    }
    setActionLoading(false);
  };

  const handleDelete = async () => {
    if (!canManageContent) {
      return;
    }
    if (!window.confirm(`Delete "${post.title}"? This cannot be undone.`)) {
      return;
    }

    setActionLoading(true);
    try {
      await apiFetch('DELETE', API_ENDPOINTS.posts.adminById(post.id), null, { token: token() });
      navigate('/blog');
    } catch (e) {
      alert(e.message);
    }
    setActionLoading(false);
  };

  if (loading) {
    return (
      <main>
        <div className="blog-post-state-wrap">
          <div className="blog-post-state-box">
            <div className="blog-post-state-icon">...</div>
            <p>Loading article...</p>
          </div>
        </div>
      </main>
    );
  }

  if (notFound) {
    return (
      <main>
        <div className="blog-post-state-wrap">
          <div className="blog-post-not-found">
            <div className="blog-post-state-icon">File</div>
            <h2>Article Not Found</h2>
            <p>This post may have been removed or the URL is incorrect.</p>
            <Link to="/blog" className="btn-primary blog-post-back-btn">
              <i className="fas fa-arrow-left" aria-hidden="true"></i> Back to Blog
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <section className="page-hero-container">
        <div
          className="page-hero-bg"
          style={{
            backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.85)), url('${post.image}')`,
          }}
        />

        <div className="max-container">
          <div className="page-hero-content reveal">
            <div className="blog-post-hero-category-wrap">
              <span className="blog-post-hero-category">{post.category}</span>
            </div>

            <h1 className="blog-post-hero-title">{post.title}</h1>

            <div className="blog-post-meta-row">
              <div className="blog-post-author-wrap">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(post.author)}&background=random`}
                  alt={post.author}
                  className="blog-post-author-avatar"
                />
                <div>
                  <div className="blog-post-author-name">{post.author}</div>
                  <div className="blog-post-author-role">{post.authorRole}</div>
                </div>
              </div>

              <span className="blog-post-meta-item">
                <i className="fas fa-calendar" aria-hidden="true"></i> {post.date}
              </span>
              <span className="blog-post-meta-item">
                <i className="fas fa-stopwatch" aria-hidden="true"></i> {post.reading_time > 0 ? `${post.reading_time} min read` : 'Quick read'}
              </span>
              <span className="blog-post-meta-item">
                <i className="fas fa-eye" aria-hidden="true"></i> {post.views > 0 ? post.views : 0}
              </span>
            </div>

            <div className="breadcrumb blog-post-breadcrumb">
              <Link to="/">Home</Link>
              <span>/</span>
              <Link to="/blog">Blog</Link>
              <span>/</span>
              <span>{post.title}</span>
            </div>
          </div>
        </div>
      </section>

      {canManageContent && post.status !== 'published' && (
        <div className="blog-post-draft-banner">
          <div className="max-container blog-post-draft-inner">
            <span className="blog-post-draft-title">Draft Preview</span>
            <span className="blog-post-draft-text">This post is not yet published. Only admins can see this.</span>
          </div>
        </div>
      )}

      {canManageContent && (
        <div className="blog-post-admin-bar">
          <div className="max-container blog-post-admin-inner">
            <span className="blog-post-admin-label">Admin View</span>
            <span className={`blog-post-admin-status ${post.status === 'published' ? 'published' : 'draft'}`}>
              {post.status?.toUpperCase()}
            </span>
            <div className="blog-post-admin-actions">
              {post.status === 'published' && (
                <button onClick={handleWithdraw} disabled={actionLoading} className="blog-post-action-btn blog-post-action-withdraw">
                  {actionLoading ? '...' : <><i className="fas fa-pause" aria-hidden="true"></i> Withdraw</>}
                </button>
              )}
              <button onClick={handleDelete} disabled={actionLoading} className="blog-post-action-btn blog-post-action-delete">
                {actionLoading ? '...' : <><i className="fas fa-trash" aria-hidden="true"></i> Delete</>}
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="blog-post-body-section">
        <div className="max-container">
          <div className="blog-post-grid-shell">
            <div />
            <article>
              {post.excerpt && <p className="blog-post-excerpt">{post.excerpt}</p>}

              <div className="blog-body" dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.body_html) }} />

              {post.tags?.length > 0 && (
                <div className="blog-post-tags-wrap">
                  <span className="blog-post-tags-label">Tags:</span>
                  {post.tags.map((t) => (
                    <span key={t.id} className="blog-post-tag">{t.name}</span>
                  ))}
                </div>
              )}

              <div className="blog-post-author-card">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(post.author)}&background=random&size=80`}
                  alt={post.author}
                  className="blog-post-author-card-avatar"
                />
                <div>
                  <div className="blog-post-author-card-name">{post.author}</div>
                  <div className="blog-post-author-card-role">{post.authorRole}</div>
                  <p className="blog-post-author-card-text">
                    Expert at VSDox in enterprise document management and digital transformation.
                  </p>
                </div>
              </div>

              <div className="blog-post-back-wrap">
                <Link to="/blog" className="btn-outline blog-post-back-btn">
                  <i className="fas fa-arrow-left" aria-hidden="true"></i> Back to Blog
                </Link>
              </div>
            </article>
            <div />
          </div>
        </div>
      </section>
    </main>
  );
};

export default BlogPost;
