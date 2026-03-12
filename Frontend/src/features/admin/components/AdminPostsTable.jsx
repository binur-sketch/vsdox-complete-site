import React from 'react';
import StatusBadge from './StatusBadge';

const STAT_CARDS = [
  { key: 'all', label: 'Total Posts', className: 'all' },
  { key: 'published', label: 'Published', className: 'published' },
  { key: 'draft', label: 'Drafts', className: 'draft' },
  { key: 'scheduled', label: 'Scheduled', className: 'scheduled' },
];

const AdminPostsTable = ({
  counts,
  posts,
  loading,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  actionLoading,
  onNew,
  onEdit,
  onPublish,
  onWithdraw,
  onDelete,
}) => {
  const busy = (postId, action) => actionLoading === `${postId}_${action}`;

  const formatDateValue = (post) => {
    if (post.status === 'scheduled' && post.scheduled_at_local) {
      return post.scheduled_at_local.replace('T', ' ');
    }
    const baseDate = post.published_at || post.date || post.created_at;
    if (!baseDate) return '-';
    const parsed = new Date(baseDate);
    if (Number.isNaN(parsed.getTime())) return baseDate;
    return parsed.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <>
      <div className="admin-stats-grid">
        {STAT_CARDS.map((card) => (
          <div className={`admin-stat-card ${card.className}`} key={card.key}>
            <div className="admin-stat-value">{counts[card.key] || 0}</div>
            <div className="admin-stat-label">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="admin-toolbar">
        <div className="admin-search-wrap">
          <i className="fas fa-search" aria-hidden="true"></i>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-search-input"
            placeholder="Search posts..."
          />
        </div>

        <div className="admin-status-filter-group">
          {['all', 'published', 'draft', 'scheduled'].map((item) => (
            <button
              key={item}
              type="button"
              className={`admin-filter-btn ${statusFilter === item ? 'active' : ''}`}
              onClick={() => setStatusFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <button type="button" className="admin-btn admin-btn-primary" onClick={onNew}>
          <i className="fas fa-plus" aria-hidden="true"></i> New Post
        </button>
      </div>

      <div className="admin-table-card">
        {loading ? (
          <div className="admin-empty-state">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="admin-empty-state">
            <p>No posts found</p>
            <button type="button" className="admin-btn admin-btn-primary" onClick={onNew}>Create your first post</button>
          </div>
        ) : (
          <table className="admin-posts-table">
            <thead>
              <tr>
                <th>Post</th>
                <th>Category</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>
                    <div className="admin-post-title-wrap" title={post.title}>
                      <div className="admin-post-title">{post.title}</div>
                      {post.excerpt && (
                        <div className="admin-post-excerpt" title={post.excerpt}>
                          {post.excerpt}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    {post.categories && post.categories.length > 0 ? (
                      <div className="admin-post-category-list">
                        {post.categories.map((c) => (
                          <span key={c.id || c.name} className="admin-post-category-pill">
                            {c.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="admin-post-category">GENERAL</span>
                    )}
                  </td>
                  <td><StatusBadge status={post.status} /></td>
                  <td className="admin-post-date">{formatDateValue(post)}</td>
                  <td>
                    <div className="admin-row-actions">
                      <button
                        type="button"
                        className="admin-icon-btn"
                        onClick={() => onEdit(post)}
                        title="Edit"
                        aria-label="Edit post"
                      >
                        <i className="fas fa-pen" aria-hidden="true"></i>
                      </button>

                      {post.status !== 'published' && (
                        <button
                          type="button"
                          className="admin-icon-btn success"
                          disabled={Boolean(actionLoading)}
                          onClick={() => onPublish(post)}
                          title="Publish"
                          aria-label="Publish post"
                        >
                          {busy(post.id, 'publish') ? '...' : <i className="fas fa-arrow-up" aria-hidden="true"></i>}
                        </button>
                      )}

                      {post.status === 'published' && (
                        <button
                          type="button"
                          className="admin-icon-btn warn"
                          disabled={Boolean(actionLoading)}
                          onClick={() => onWithdraw(post)}
                          title="Withdraw"
                          aria-label="Withdraw post"
                        >
                          {busy(post.id, 'withdraw') ? '...' : <i className="fas fa-pause" aria-hidden="true"></i>}
                        </button>
                      )}

                      <button
                        type="button"
                        className="admin-icon-btn danger"
                        disabled={Boolean(actionLoading)}
                        onClick={() => onDelete(post)}
                        title="Delete"
                        aria-label="Delete post"
                      >
                        {busy(post.id, 'delete') ? '...' : <i className="fas fa-trash" aria-hidden="true"></i>}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default AdminPostsTable;
