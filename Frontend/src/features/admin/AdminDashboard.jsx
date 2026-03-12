import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminApi } from './api';
import AdminPostForm from './components/AdminPostForm';
import AdminPostsTable from './components/AdminPostsTable';
import logo from '../../logo.png';

const normalize = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.posts)) return response.posts;
  if (Array.isArray(response?.categories)) return response.categories;
  if (Array.isArray(response?.tags)) return response.tags;
  if (Array.isArray(response?.media)) return response.media;
  if (Array.isArray(response?.items)) return response.items;

  const nested = response?.data;
  if (nested && typeof nested === 'object') {
    if (Array.isArray(nested.data)) return nested.data;
    if (Array.isArray(nested.posts)) return nested.posts;
    if (Array.isArray(nested.categories)) return nested.categories;
    if (Array.isArray(nested.tags)) return nested.tags;
    if (Array.isArray(nested.media)) return nested.media;
    if (Array.isArray(nested.items)) return nested.items;

    if (nested.data && typeof nested.data === 'object') {
      if (Array.isArray(nested.data.posts)) return nested.data.posts;
      if (Array.isArray(nested.data.categories)) return nested.data.categories;
      if (Array.isArray(nested.data.tags)) return nested.data.tags;
      if (Array.isArray(nested.data.media)) return nested.data.media;
      if (Array.isArray(nested.data.items)) return nested.data.items;
    }
  }

  return [];
};

const formatPost = (p) => ({
  ...p,
  scheduled_at: p.scheduled_at || null,
  scheduled_at_local: p.scheduled_at_local || '',
  published_at: p.published_at || null,
  created_at: p.created_at || null,
  categories: (p.categories || []).map((c) => ({ ...c, id: String(c.id) })),
  tags: (p.tags || []).map((t) => ({ ...t, id: String(t.id) })),
});

const AdminDashboard = ({ onClose }) => {
  const { user, canManageContent } = useAuth();
  const navigate = useNavigate();

  const [view, setView] = useState('list');
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editPost, setEditPost] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2200);
  };

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [postsRes, catRes] = await Promise.all([
        adminApi.listPosts(100),
        adminApi.listCategories(),
      ]);

      setPosts(normalize(postsRes).map(formatPost));
      setCategories(normalize(catRes).map((x) => ({ ...x, id: String(x.id) })));
    } catch (error) {
      showToast(error.message || 'Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user && canManageContent) {
      loadAll();
    }
  }, [user, canManageContent, loadAll]);

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchStatus = statusFilter === 'all' || p.status === statusFilter;
      const matchSearch = !search || p.title?.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [posts, search, statusFilter]);

  const counts = useMemo(() => ({
    all: posts.length,
    published: posts.filter((p) => p.status === 'published').length,
    draft: posts.filter((p) => p.status === 'draft').length,
    scheduled: posts.filter((p) => p.status === 'scheduled').length,
  }), [posts]);

  const setBusy = (postId, action) => setActionLoading(`${postId}_${action}`);
  const clearBusy = () => setActionLoading(null);

  const handlePublish = async (post) => {
    setBusy(post.id, 'publish');
    try {
      await adminApi.publishPost(post.id);
      setPosts((prev) => prev.map((x) => (x.id === post.id ? { ...x, status: 'published' } : x)));
      showToast('Post published successfully', 'success');
    } catch (error) {
      showToast(error.message || 'Publish failed', 'error');
    } finally {
      clearBusy();
    }
  };

  const handleWithdraw = async (post) => {
    setBusy(post.id, 'withdraw');
    try {
      await adminApi.withdrawPost(post.id);
      setPosts((prev) => prev.map((x) => (x.id === post.id ? { ...x, status: 'draft' } : x)));
      showToast('Post moved back to draft', 'info');
    } catch (error) {
      showToast(error.message || 'Withdraw failed', 'error');
    } finally {
      clearBusy();
    }
  };

  const handleDelete = async (post) => {
    if (!window.confirm(`Delete "${post.title}"? This cannot be undone.`)) return;

    setBusy(post.id, 'delete');
    try {
      await adminApi.deletePost(post.id);
      setPosts((prev) => prev.filter((x) => x.id !== post.id));
      showToast('Post deleted', 'warning');
    } catch (error) {
      showToast(error.message || 'Delete failed', 'error');
    } finally {
      clearBusy();
    }
  };

  const handleFormSaved = async () => {
    setView('list');
    setEditPost(null);
    await loadAll();
    showToast('Post saved successfully', 'success');
  };

  if (!user || !canManageContent) {
    return (
      <div className="admin-dashboard-auth-empty">
        <p>{user ? 'You do not have permission to access the dashboard.' : 'Please log in to access the dashboard'}</p>
        {!user && (
          <button type="button" className="btn-primary" onClick={() => navigate('/admin/login')}>Go to Login</button>
        )}
      </div>
    );
  }

  return (
    <div className="admin-dashboard-shell">
      {toast && (
        <div className={`admin-toast admin-toast-${toast.type}`}>
          <span className="admin-toast-icon" aria-hidden="true">
            {toast.type === 'success' && <i className="fas fa-circle-check"></i>}
            {toast.type === 'error' && <i className="fas fa-circle-xmark"></i>}
            {toast.type === 'warning' && <i className="fas fa-triangle-exclamation"></i>}
            {toast.type === 'info' && <i className="fas fa-circle-info"></i>}
          </span>
          <span>{toast.message}</span>
        </div>
      )}

      <header className="admin-dashboard-header">
        <img src={logo} alt="VSDox" className="admin-dashboard-logo" />
        <strong>Blog Admin</strong>
        <span className="admin-dashboard-user"><i className="fas fa-user" aria-hidden="true"></i> {user.name}</span>
        {onClose && (
          <button type="button" className="admin-btn admin-btn-ghost admin-btn-close" onClick={onClose} title="Close">
            <i className="fas fa-xmark" aria-hidden="true"></i>
          </button>
        )}
      </header>

      <main className="admin-dashboard-content">
        {view === 'form' ? (
          <AdminPostForm
            post={editPost}
            categories={categories}
            setCategories={setCategories}
            onSave={handleFormSaved}
            onCancel={() => { setView('list'); setEditPost(null); }}
          />
        ) : (
          <AdminPostsTable
            counts={counts}
            posts={filteredPosts}
            loading={loading}
            search={search}
            setSearch={setSearch}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            actionLoading={actionLoading}
            onNew={() => { setEditPost(null); setView('form'); }}
            onEdit={(post) => { setEditPost(post); setView('form'); }}
            onPublish={handlePublish}
            onWithdraw={handleWithdraw}
            onDelete={handleDelete}
          />
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
