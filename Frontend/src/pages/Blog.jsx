import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { handleFormSubmission } from '../utils/formHandler';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import { CompanyPageHero } from './CompanyPages';
import { apiFetch } from '../services/apiClient';
import { API_ENDPOINTS } from '../config/apiEndpoints';
import { AUTH_STORAGE_KEYS, DEFAULTS } from '../config/appConstants';

const getAuthToken = () => localStorage.getItem(AUTH_STORAGE_KEYS.token);
const withAuth = () => ({ token: getAuthToken() });

const normalizePosts = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.posts)) return res.posts;
  if (Array.isArray(res?.data?.posts)) return res.data.posts;
  if (Array.isArray(res?.data)) return res.data;
  return [];
};

const BlogCard = ({
  id,
  date,
  title,
  excerpt,
  image,
  author,
  authorRole,
  status,
  slug,
  views,
  isAdmin,
  categories = [],
  activeFilter = 'All',
  onStatusChange,
  onDelete,
}) => {
  const [loading, setLoading] = useState(false);
  const [showExtras, setShowExtras] = useState(false);

  const handlePublish = async () => {
    setLoading(true);
    try {
      await apiFetch('PATCH', API_ENDPOINTS.posts.publish(id), null, withAuth());
      onStatusChange(id, 'published');
    } catch (e) {
      alert(e.message);
    }
    setLoading(false);
  };

  const handleWithdraw = async () => {
    setLoading(true);
    try {
      await apiFetch('PATCH', API_ENDPOINTS.posts.withdraw(id), null, withAuth());
      onStatusChange(id, 'draft');
    } catch (e) {
      alert(e.message);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) {
      return;
    }

    setLoading(true);
    try {
      await apiFetch('DELETE', API_ENDPOINTS.posts.adminById(id), null, withAuth());
      onDelete(id);
    } catch (e) {
      alert(e.message);
    }
    setLoading(false);
  };

  const normalizedCategories = Array.isArray(categories)
    ? [...new Set(categories.map((item) => (typeof item === 'string' ? item : item?.name || '')).filter(Boolean))]
    : [];
  const filteredCategory = activeFilter && activeFilter !== 'All'
    && normalizedCategories.includes(activeFilter)
    ? activeFilter
    : null;
  const visibleCategory = filteredCategory || normalizedCategories[0] || 'General';
  const extraCategories = filteredCategory
    ? []
    : normalizedCategories.filter((name) => name !== visibleCategory);
  const additionalCount = extraCategories.length;

  useEffect(() => {
    setShowExtras(false);
  }, [activeFilter, slug]);

  return (
    <div className="glass-card blog-card-v2 reveal">
      {isAdmin && (
        <div className={`blog-status-badge blog-status-${status || 'draft'}`}>
          {status}
        </div>
      )}

      <div className="blog-card-media">
        <img src={image || DEFAULTS.blogCoverImage} alt={title} className="blog-card-image" />
        <div className="blog-card-category-stack">
          <span className="blog-card-category">{visibleCategory}</span>
          {additionalCount > 0 && (
            <div className="blog-card-category-more-wrapper">
              <button
                type="button"
                className="blog-card-category-more-pill"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowExtras((prev) => !prev);
                }}
              >
                +{additionalCount}
              </button>
              {showExtras && (
                <div className="blog-card-category-extra-panel">
                  {extraCategories.map((name) => (
                    <span key={name}>{name}</span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="blog-card-content">
        <div className="blog-card-meta-row">
          <span className="blog-card-meta-item">
            <i className="fas fa-calendar" aria-hidden="true"></i> {date}
          </span>
          <span className="blog-card-meta-item">
            <i className="fas fa-eye" aria-hidden="true"></i> {views > 0 ? views : 0}
          </span>
        </div>
        <h3 className="blog-card-title">{title}</h3>
        <p className="blog-card-excerpt">{excerpt}</p>

        <div className="blog-card-footer">
          <div className="blog-card-author-avatar">
            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(author || 'Author')}&background=random`} alt={author} />
          </div>
          <div>
            <div className="blog-card-author-name">{author || 'VSDox Team'}</div>
            <div className="blog-card-author-role">{authorRole || ''}</div>
          </div>
          <Link to={`/blog/${slug}`} className="blog-card-read-link">Read Article</Link>
        </div>

        {isAdmin && (
          <div className="blog-card-admin-actions">
            {status !== 'published' && (
              <button onClick={handlePublish} disabled={loading} className="blog-admin-btn blog-admin-btn-publish">
                {loading ? '...' : <><i className="fas fa-upload" aria-hidden="true"></i> Publish</>}
              </button>
            )}
            {status === 'published' && (
              <button onClick={handleWithdraw} disabled={loading} className="blog-admin-btn blog-admin-btn-withdraw">
                {loading ? '...' : <><i className="fas fa-pause" aria-hidden="true"></i> Withdraw</>}
              </button>
            )}
            <button onClick={handleDelete} disabled={loading} className="blog-admin-btn blog-admin-btn-delete">
              {loading ? '...' : <><i className="fas fa-trash" aria-hidden="true"></i> Delete</>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Blog = () => {
  const { user, canManageContent } = useAuth();

  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [categories, setCategories] = useState(['All']);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('fade-in'));
    loadPosts();
  }, []);

  useEffect(() => {
    if (!canManageContent) {
      setAdminMode(false);
      setAllPosts([]);
    }
  }, [canManageContent]);

  useEffect(() => {
    if (!showDashboard) {
      loadPosts();
    }
  }, [showDashboard]);

  const loadPosts = async (pageNum = 1, append = false) => {
    setLoading(true);

    try {
      const pub = await apiFetch('GET', API_ENDPOINTS.posts.list(pageNum, 6));
      const fetched = pub.posts || [];
      setPosts((prev) => (append ? [...prev, ...fetched] : fetched));
      setHasMore(fetched.length === 6);

      const cats = ['All', ...new Set(fetched.flatMap((p) => (p.categories || []).map((c) => c?.name).filter(Boolean)))];
      setCategories((prev) => [...new Set([...prev, ...cats])]);
    } catch (e) {
      console.error('Failed to load posts:', e);
    }

    setLoading(false);
  };

  const loadAllPostsForAdmin = async () => {
    try {
      const res = await apiFetch('GET', API_ENDPOINTS.posts.adminAll(100), null, withAuth());
      setAllPosts(normalizePosts(res));
    } catch (e) {
      console.error('Failed to load admin posts:', e);
    }
  };

  const toggleAdminMode = async () => {
    if (!canManageContent) {
      return;
    }
    if (!adminMode) {
      await loadAllPostsForAdmin();
      setAdminMode(true);
      return;
    }
    setAdminMode(false);
  };

  const handleStatusChange = (id, newStatus) => {
    setAllPosts((prev) => prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p)));
    setPosts((prev) => (newStatus === 'published' ? prev : prev.filter((p) => p.id !== id)));
  };

  const handleDelete = (id) => {
    setAllPosts((prev) => prev.filter((p) => p.id !== id));
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const displayPosts = adminMode ? allPosts : posts;
  const filteredPosts = activeFilter === 'All'
    ? displayPosts
    : displayPosts.filter((p) => (p.categories || []).some((c) => c?.name === activeFilter));

  const formatPost = (p) => ({
    id: p.id,
    slug: p.slug,
    category: p.categories?.[0]?.name || 'General',
    date: p.date
      ? new Date(p.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      : 'Draft',
    title: p.title,
    excerpt: p.excerpt || '',
    image: p.image || DEFAULTS.blogCoverImage,
    author: p.author || 'VSDox Team',
    authorRole: '',
    status: p.status,
    views: Number(p.views || 0),
    scheduled_at_local: p.scheduled_at_local || '',
    published_at: p.published_at || null,
    created_at: p.created_at || null,
  });

  return (
    <main>
      {showDashboard && canManageContent && (
        <>
          <div onClick={() => setShowDashboard(false)} className="blog-dashboard-backdrop" />
          <div className="blog-dashboard-panel">
            <AdminDashboard onClose={() => setShowDashboard(false)} />
          </div>
        </>
      )}

      <CompanyPageHero
        tag="INSIGHTS & TRENDS"
        title="Insights & Blog"
        subtitle="Thought leadership, technology trends, and industry updates from the experts in document intelligence."
        bgImage={DEFAULTS.blogHeroImage}
      />

      <section className="blog-section">
        <div className="max-container">
          {canManageContent && (
            <div className="blog-admin-top-row">
              <div className="blog-admin-controls">
                <span className="blog-admin-user"><i className="fas fa-user" aria-hidden="true"></i> {user.name}</span>
                <button onClick={toggleAdminMode} className={`blog-control-btn ${adminMode ? 'active' : ''}`}>
                  {adminMode && adminMode ? <i className="fas fa-toggle-on" aria-hidden="true"></i> : <i className="fas fa-toggle-off" aria-hidden="true"></i>}
                  {adminMode ? 'Admin Mode ON' : 'Admin Mode'}
                </button>
                <button onClick={() => setShowDashboard(true)} className="blog-control-btn"><i className="fas fa-tasks" aria-hidden="true"></i> Manage Post</button>
              </div>
            </div>
          )}

          <div className="blog-filter-row">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`blog-filter-btn ${activeFilter === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {adminMode && canManageContent && (
            <div className="blog-admin-banner">
              <strong>Admin Mode:</strong> Showing all posts including drafts.
            </div>
          )}

          {loading ? (
            <div className="blog-empty-state">Loading posts...</div>
          ) : filteredPosts.length === 0 ? (
            <div className="blog-empty-state">
              <p>No posts found</p>
              {canManageContent && (
                <button onClick={() => setShowDashboard(true)} className="blog-empty-action">Create your first post</button>
              )}
            </div>
          ) : (
            <div className="industry-grid-detailed blog-grid">
              {filteredPosts.map((post) => (
              <BlogCard
                key={post.id}
                {...formatPost(post)}
                categories={post.categories || []}
                activeFilter={activeFilter}
                isAdmin={canManageContent}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
              ))}
            </div>
          )}

          {hasMore && (!adminMode || !canManageContent) && (
            <div className="blog-load-more-wrap">
              <button
                className="btn-outline blog-load-more-btn"
                onClick={() => {
                  const next = page + 1;
                  setPage(next);
                  loadPosts(next, true);
                }}
              >
                Load More Articles
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export const NewsletterForm = () => {
  const [email, setEmail] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);
  const [sending, setSending] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    const success = await handleFormSubmission({ email, subject: 'Newsletter Subscription' }, DEFAULTS.recipientEmail);
    if (success) {
      setSubmitted(true);
    }
    setSending(false);
  };

  if (submitted) {
    return (
      <div className="newsletter-success-box">
        <h4>Thank you for subscribing!</h4>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="newsletter-form">
      <input
        type="email"
        placeholder="Your work email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit" className="btn-primary newsletter-submit" disabled={sending}>
        {sending ? 'Subscribing...' : 'Subscribe'}
      </button>
    </form>
  );
};

export default Blog;
