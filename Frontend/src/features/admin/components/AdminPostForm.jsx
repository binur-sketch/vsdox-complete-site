import React, { useEffect, useMemo, useRef, useState } from 'react';
import { adminApi } from '../api';
import AdminMediaPicker from './AdminMediaPicker';
import { marked } from 'marked';
import sanitizeHtml from '../../../utils/sanitizeHtml';

const normalizeIds = (arr = []) => arr.map((x) => String(x));
const pad = (n) => String(n).padStart(2, '0');
const toDateTimeLocalValue = (value) => {
  if (!value) return '';
  const raw = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(raw)) return raw;

  const normalized = raw.includes('T') ? raw : raw.replace(' ', 'T');
  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) return '';

  return `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}T${pad(parsed.getHours())}:${pad(parsed.getMinutes())}`;
};

const MultiSelectChips = ({ label, items, selectedIds, onToggle }) => {
  return (
    <div className="admin-form-block">
      <label>{label}</label>
      <div className="admin-chip-list">
        {items.map((item) => {
          const id = String(item.id);
          const selected = selectedIds.includes(id);
          return (
            <button
              key={id}
              type="button"
              className={`admin-chip ${selected ? 'selected' : ''}`}
              onClick={() => onToggle(id)}
            >
              {selected && <i className="fas fa-check" aria-hidden="true"></i>}
              {item.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const CreateChipField = ({ type, onCreated }) => {
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setBusy(true);
    setError('');
    try {
      const created = type === 'category'
        ? await adminApi.createCategory(trimmed)
        : await adminApi.createTag(trimmed);
      onCreated(created);
      setName('');
    } catch (err) {
      setError(err.message || `Failed to create ${type}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-create-chip">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={`New ${type}`}
      />
      <button type="button" className="admin-btn admin-btn-secondary" onClick={submit} disabled={busy}>
        {busy ? 'Adding...' : <><i className="fas fa-plus" aria-hidden="true"></i> Add</>}
      </button>
      {error && <p className="admin-error-text">{error}</p>}
    </div>
  );
};

const AdminPostForm = ({
  post,
  categories,
  setCategories,
  onSave,
  onCancel,
}) => {
  const [title, setTitle] = useState(post?.title || '');
  const [slug] = useState(post?.slug || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [body, setBody] = useState(post?.body || '');
  const [status, setStatus] = useState(post?.status || 'draft');
  const initialScheduled = post?.status === 'scheduled'
    ? (
      post?.scheduled_at_local
      || post?.scheduled_at
      || post?.scheduledAt
      || post?.date
      || post?.created_at
    )
    : '';
  const [scheduledAt, setScheduledAt] = useState(toDateTimeLocalValue(initialScheduled));
  const [image, setImage] = useState(post?.image || '');
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [mediaTarget, setMediaTarget] = useState('featured');
  const [selectedCategories, setSelectedCategories] = useState(normalizeIds(post?.categories?.map((c) => c.id) || []));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [editorLayout, setEditorLayout] = useState('split'); // markdown | preview | split
  const textareaRef = useRef(null);
  const undoStackRef = useRef([post?.body || '']);
  const redoStackRef = useRef([]);

  const derivedSlug = useMemo(() => {
    if (slug.trim()) return slug;
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .slice(0, 120);
  }, [slug, title]);

  const previewHtml = useMemo(() => {
    try {
      return sanitizeHtml(marked.parse(body || ''));
    } catch {
      return sanitizeHtml(body || '');
    }
  }, [body]);

  const pushHistory = (value, resetRedo = true) => {
    const stack = undoStackRef.current;
    if (stack[stack.length - 1] !== value) {
      stack.push(value);
      if (stack.length > 50) {
        stack.shift();
      }
    }
    if (resetRedo) {
      redoStackRef.current = [];
    }
  };

  const applyFormat = (before, after, placeholder = 'text', toggle = false) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const { selectionStart, selectionEnd, value } = textarea;
    const selected = value.slice(selectionStart, selectionEnd) || placeholder;

    let nextValue;
    if (
      toggle
      && selectionStart >= before.length
      && selectionEnd + after.length <= value.length
      && value.slice(selectionStart - before.length, selectionStart) === before
      && value.slice(selectionEnd, selectionEnd + after.length) === after
    ) {
      nextValue = `${value.slice(0, selectionStart - before.length)}${selected}${value.slice(selectionEnd + after.length)}`;
      setBody(nextValue);
      requestAnimationFrame(() => {
        textarea.focus();
        textarea.setSelectionRange(selectionStart - before.length, selectionEnd - before.length);
      });
      pushHistory(nextValue);
      return;
    }

    nextValue = `${value.slice(0, selectionStart)}${before}${selected}${after}${value.slice(selectionEnd)}`;
    setBody(nextValue);
    pushHistory(nextValue);
    requestAnimationFrame(() => {
      const cursorStart = selectionStart + before.length;
      const cursorEnd = cursorStart + selected.length;
      textarea.focus();
      textarea.setSelectionRange(cursorStart, cursorEnd);
    });
  };

  const insertAtCursor = (text) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setBody((prev) => `${prev}${text}`);
      pushHistory(`${body}${text}`);
      return;
    }
    const { selectionStart, selectionEnd, value } = textarea;
    const nextValue = `${value.slice(0, selectionStart)}${text}${value.slice(selectionEnd)}`;
    setBody(nextValue);
    pushHistory(nextValue);
    requestAnimationFrame(() => {
      const cursor = selectionStart + text.length;
      textarea.focus();
      textarea.setSelectionRange(cursor, cursor);
    });
  };

  const handleUndo = () => {
    const stack = undoStackRef.current;
    if (stack.length > 1) {
      const popped = stack.pop();
      redoStackRef.current.push(popped);
      const next = stack[stack.length - 1] ?? '';
      setBody(next);
      requestAnimationFrame(() => textareaRef.current?.focus());
    }
  };

  const handleRedo = () => {
    const redo = redoStackRef.current;
    if (redo.length > 0) {
      const next = redo.pop();
      undoStackRef.current.push(next);
      setBody(next);
      requestAnimationFrame(() => textareaRef.current?.focus());
    }
  };

  const handleLinkToggle = () => {
    const textarea = textareaRef.current;
    if (!textarea) {
      applyFormat('[', '](https://)', 'link text');
      return;
    }
    const { selectionStart, selectionEnd, value } = textarea;
    const selected = value.slice(selectionStart, selectionEnd);
    const linkMatch = selected.match(/^\[(.*)\]\((.*)\)$/);
    if (linkMatch) {
      const nextValue = `${value.slice(0, selectionStart)}${linkMatch[1]}${value.slice(selectionEnd)}`;
      setBody(nextValue);
      pushHistory(nextValue);
      requestAnimationFrame(() => {
        textarea.focus();
        textarea.setSelectionRange(selectionStart, selectionStart + linkMatch[1].length);
      });
      return;
    }
    applyFormat('[', '](https://)', 'link text');
  };

  const toolbarActions = [
    { label: 'Undo', title: 'Undo', onClick: handleUndo, icon: <i className="fas fa-rotate-left" aria-hidden="true" /> },
    { label: 'Redo', title: 'Redo', onClick: handleRedo, icon: <i className="fas fa-rotate-right" aria-hidden="true" /> },
    { label: 'B', title: 'Bold', onClick: () => applyFormat('**', '**', 'bold text', true) },
    { label: 'I', title: 'Italic', onClick: () => applyFormat('_', '_', 'italic text', true) },
    { label: 'H1', title: 'Heading', onClick: () => insertAtCursor('\n# Heading 1\n') },
    { label: 'Link', title: 'Link', onClick: handleLinkToggle },
    { label: 'List', title: 'Bulleted list', onClick: () => insertAtCursor('\n- Item 1\n- Item 2\n') },
    { label: 'Quote', title: 'Quote', onClick: () => insertAtCursor('\n> Quote text\n') },
    { label: 'Code', title: 'Code', onClick: () => applyFormat('`', '`', 'code', true) },
  ];

  const toggleSelected = (value, setter) => {
    setter((prev) => (prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]));
  };

  const persistPost = async (overrideStatus) => {
    const finalStatus = overrideStatus || status;
    const isScheduled = finalStatus === 'scheduled';

    if (isScheduled && !scheduledAt) {
      setError('Please choose a schedule date and time.');
      return;
    }

    let normalizedScheduledAt = null;
    if (isScheduled) {
      if (!scheduledAt) {
        setError('Please choose a schedule date and time.');
        return;
      }
      normalizedScheduledAt = scheduledAt.length === 16 ? `${scheduledAt}:00` : scheduledAt;
    }

    setSaving(true);
    setError('');

    const payload = {
      title,
      slug: derivedSlug,
      excerpt,
      body,
      author: post?.author || 'VSDox Team',
      authorRole: post?.authorRole || '',
      status: finalStatus,
      scheduled_at: normalizedScheduledAt,
      featured_image: image,
      category_ids: selectedCategories,
    };

    try {
      if (post?.id) {
        await adminApi.updatePost(post.id, payload);
      } else {
        await adminApi.createPost(payload);
      }
      onSave();
    } catch (err) {
      setError(err.message || 'Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    undoStackRef.current = [post?.body || ''];
    redoStackRef.current = [];
  }, [post?.id]);

  useEffect(() => {
    if (status !== 'scheduled') return;
    if (post?.status === 'scheduled' && (post?.scheduled_at_local || post?.scheduled_at)) {
      setScheduledAt((prev) => prev || toDateTimeLocalValue(post?.scheduled_at_local || post?.scheduled_at));
      return;
    }
    if (!scheduledAt) {
      const now = new Date();
      setScheduledAt(toDateTimeLocalValue(now.toISOString()));
    }
  }, [status, scheduledAt, post?.status, post?.scheduled_at, post?.scheduled_at_local]);

  const submit = async (event) => {
    event.preventDefault();
    await persistPost(status);
  };

  const handleInsertBodyImage = (url) => {
    const markdown = `\n![image](${url})\n`;
    insertAtCursor(markdown);
  };

  return (
    <div className="admin-form-shell">
      <div className="admin-form-header">
        <h2>{post?.id ? 'Edit Post' : 'Create Post'}</h2>
        <button type="button" className="admin-btn admin-btn-ghost admin-btn-close" onClick={onCancel} title="Close">
          <i className="fas fa-xmark" aria-hidden="true"></i>
        </button>
      </div>

      {error && <div className="admin-error-banner">{error}</div>}

      <form onSubmit={submit} className="admin-post-form">
        <div className="admin-form-block">
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter blog post title"
            required
          />
        </div>

        <div className="admin-form-block">
          <label>Excerpt</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            placeholder="Write a short excerpt for listing and preview"
          />
        </div>

        <div className="admin-form-block">
          <div className="admin-body-label-row">
            <label>Body (Markdown)</label>
            <div className="admin-editor-actions">
              <button
                type="button"
                className="admin-btn admin-btn-secondary admin-inline-btn"
                onClick={() => {
                  setMediaTarget('body');
                  setShowMediaPicker(true);
                }}
              >
                <i className="fas fa-image" aria-hidden="true"></i> Insert Image
              </button>
            </div>
          </div>

          <div
            className="admin-editor-toolbar"
            style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'space-between', marginBottom: '8px' }}
          >
            <div className="admin-editor-buttons" style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {toolbarActions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  className="admin-editor-btn"
                  style={{ border: '1px solid #cbd5f5', borderRadius: '4px', padding: '4px 8px', background: '#f8fafc', fontSize: '0.85rem' }}
                  onClick={action.onClick}
                  title={action.title}
                >
                  {action.icon || action.label}
                </button>
              ))}
            </div>
            <div className="admin-editor-layout" style={{ display: 'flex', gap: '4px' }}>
              {['markdown', 'split', 'preview'].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className={`admin-editor-layout-btn ${editorLayout === mode ? 'active' : ''}`}
                  style={{
                    border: editorLayout === mode ? '1px solid #2563eb' : '1px solid #cbd5f5',
                    borderRadius: '4px',
                    padding: '4px 10px',
                    background: editorLayout === mode ? '#dbeafe' : '#f8fafc',
                    fontWeight: editorLayout === mode ? 600 : 400,
                    textTransform: 'capitalize',
                  }}
                  onClick={() => setEditorLayout(mode)}
                >
                  {mode === 'split' ? 'Split' : mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div
            className="admin-editor-shell"
            style={{
              display: 'grid',
              gap: '16px',
              gridTemplateColumns: editorLayout === 'split' ? '1fr 1fr' : '1fr',
            }}
          >
            {editorLayout !== 'preview' && (
              <textarea
                ref={textareaRef}
                value={body}
                onChange={(e) => {
                  const nextValue = e.target.value;
                  setBody(nextValue);
                  pushHistory(nextValue);
                }}
                rows={14}
                className="admin-mono admin-editor-textarea"
                placeholder="Write markdown content here. Use toolbar buttons for quick formatting."
                required
                style={{ width: '100%', minHeight: '320px', borderRadius: '8px', border: '1px solid #cbd5f5', padding: '12px' }}
              />
            )}
            {(editorLayout === 'split' || editorLayout === 'preview') && (
              <div
                className="admin-editor-preview"
                style={{
                  border: '1px solid var(--border-color, #e2e8f0)',
                  borderRadius: '8px',
                  padding: '12px',
                  background: '#0f172a0a',
                  minHeight: '320px',
                  overflowY: 'auto',
                }}
              >
                <div
                  className="admin-editor-preview-label"
                  style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', color: '#475569' }}
                >
                  Live Preview
                </div>
                <div
                  className="admin-editor-preview-content"
                  style={{ lineHeight: 1.6 }}
                  dangerouslySetInnerHTML={{ __html: previewHtml }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="admin-form-grid-2">
          <div className="admin-form-block">
            <label>Status</label>
            <div className="admin-status-pill-group">
              {(post?.id ? ['draft', 'published', 'scheduled'] : ['draft', 'scheduled']).map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`admin-status-pill ${status === s ? 'active' : ''}`}
                  onClick={() => setStatus(s)}
                >
                  {s === 'draft' && <i className="fas fa-save" aria-hidden="true"></i>}
                  {s === 'published' && <i className="fas fa-upload" aria-hidden="true"></i>}
                  {s === 'scheduled' && <i className="fas fa-calendar" aria-hidden="true"></i>}
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="admin-form-block">
            {status === 'scheduled' && (
              <>
                <label>Schedule Date & Time</label>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  required={status === 'scheduled'}
                />
              </>
            )}
          </div>
        </div>

        <div className="admin-form-block admin-featured-image-block">
          <label>Featured Image URL</label>
          <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." />
          <button
            type="button"
            className="admin-btn admin-btn-secondary admin-inline-btn"
            onClick={() => {
              setMediaTarget('featured');
              setShowMediaPicker(true);
            }}
          >
            <i className="fas fa-image" aria-hidden="true"></i> Choose from Media Library
          </button>
          {image && (
            <div className="admin-selected-image">
              <img src={image} alt="Selected featured" />
              <button type="button" className="admin-btn admin-btn-ghost admin-btn-danger" onClick={() => setImage('')}>
                <i className="fas fa-xmark" aria-hidden="true"></i> Remove
              </button>
            </div>
          )}
        </div>

        <MultiSelectChips
          label="Categories"
          items={categories}
          selectedIds={selectedCategories}
          onToggle={(id) => toggleSelected(id, setSelectedCategories)}
        />
        <CreateChipField
          type="category"
          onCreated={(item) => setCategories((prev) => [...prev, item])}
        />

        <div className="admin-form-actions">
          <button type="button" className="admin-btn admin-btn-ghost" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
              className="admin-btn admin-btn-secondary"
              disabled={saving || status === 'scheduled'}
              onClick={() => persistPost('draft')}
            >
            <i className="fas fa-save" aria-hidden="true"></i>
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            disabled={saving || status === 'scheduled'}
            onClick={() => persistPost('published')}
          >
            <i className="fas fa-upload" aria-hidden="true"></i>
            {saving ? 'Publishing...' : 'Publish'}
          </button>
          {status === 'scheduled' && (
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              disabled={saving || !scheduledAt}
              onClick={() => persistPost('scheduled')}
            >
              <i className="fas fa-calendar" aria-hidden="true"></i>
              {saving ? 'Scheduling...' : 'Schedule'}
            </button>
          )}
        </div>
      </form>

      {showMediaPicker && (
        <AdminMediaPicker
          onSelect={(url) => {
            if (mediaTarget === 'body') {
              handleInsertBodyImage(url);
            } else {
              setImage(url);
            }
            setShowMediaPicker(false);
          }}
          onClose={() => setShowMediaPicker(false)}
        />
      )}
    </div>
  );
};

export default AdminPostForm;
