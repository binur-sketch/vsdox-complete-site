import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import API from '../config';

async function apiFetch(method, path, body) {
    const token = localStorage.getItem('vsdox_token');
    const isFormData = body instanceof FormData;
    const headers = {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
    };
    const res = await fetch(API + path, {
        method, headers,
        body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
}

// ── Status badge ───────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
    const cfg = {
        published: { bg: '#dcfce7', color: '#15803d', label: 'Published' },
        draft:     { bg: '#fef9c3', color: '#854d0e', label: 'Draft' },
        scheduled: { bg: '#dbeafe', color: '#1d4ed8', label: 'Scheduled' },
        archived:  { bg: '#f1f5f9', color: '#64748b', label: 'Archived' },
    }[status] || { bg: '#f1f5f9', color: '#64748b', label: status };
    return (
        <span style={{
            padding: '3px 10px', borderRadius: '20px', fontSize: '11px',
            fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px',
            background: cfg.bg, color: cfg.color,
        }}>{cfg.label}</span>
    );
};


// ── Media Picker ──────────────────────────────────────────────────────
const MediaPicker = ({ onSelect, onClose, mode = 'select' }) => {
    // mode: 'select' = pick URL,  'featured' = also sets featured image
    const [media, setMedia]         = useState([]);
    const [loading, setLoading]     = useState(true);
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver]   = useState(false);
    const [deleting, setDeleting]   = useState(null);
    const [toast, setToast]         = useState('');
    const [stagedFile, setStagedFile] = useState(null);   // file chosen but NOT yet uploaded
    const fileRef                   = React.useRef();

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

    const loadMedia = async () => {
        setLoading(true);
        try {
            const res = await apiFetch('GET', '/media?limit=60');
            const arr = Array.isArray(res) ? res : res?.media ?? res?.data ?? [];
            setMedia(arr);
        } catch (e) { showToast('❌ Failed to load media'); }
        setLoading(false);
    };

    useEffect(() => { loadMedia(); }, []);

    // Validate and stage the file — does NOT upload yet
    const stageFile = (file) => {
        if (!file) return;
        const allowed = ['image/jpeg','image/png','image/webp','image/gif','image/svg+xml'];
        if (!allowed.includes(file.type)) { showToast('❌ Only images allowed'); return; }
        if (file.size > 10 * 1024 * 1024) { showToast('❌ Max file size is 10 MB'); return; }
        setStagedFile(file);
    };

    // Upload the staged file — only called when user clicks ↑ Upload Image
    const uploadStagedFile = async () => {
        if (!stagedFile) return;
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append('image', stagedFile);
            const res = await apiFetch('POST', '/media/upload', fd);
            setMedia(prev => [res, ...prev]);
            setStagedFile(null);
            if (fileRef.current) fileRef.current.value = '';
            showToast('✅ Uploaded successfully');
        } catch (e) { showToast('❌ ' + e.message); }
        setUploading(false);
    };

    const handleDrop = (e) => {
        e.preventDefault(); setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) stageFile(file);   // stage only, no upload
    };

    const handleDelete = async (item, e) => {
        e.stopPropagation();
        if (!window.confirm('Delete this image? It may still be used in posts.')) return;
        setDeleting(item.id);
        try {
            await apiFetch('DELETE', `/media/${item.id}`);
            setMedia(prev => prev.filter(m => m.id !== item.id));
            showToast('🗑 Deleted');
        } catch (e) { showToast('❌ ' + e.message); }
        setDeleting(null);
    };

    const formatSize = (bytes) => {
        if (!bytes) return '';
        return bytes > 1024 * 1024
            ? (bytes / 1024 / 1024).toFixed(1) + ' MB'
            : Math.round(bytes / 1024) + ' KB';
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 2000,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px',
        }} onClick={onClose}>
            <div onClick={e => e.stopPropagation()} style={{
                background: 'white', borderRadius: '16px', width: '100%', maxWidth: '860px',
                maxHeight: '85vh', display: 'flex', flexDirection: 'column',
                boxShadow: '0 24px 80px rgba(0,0,0,0.3)',
            }}>
                {/* Header */}
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                    <span style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', flex: 1 }}>🖼 Media Library</span>
                    <button onClick={() => stagedFile ? uploadStagedFile() : fileRef.current?.click()}
                        disabled={uploading}
                        style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', background: stagedFile ? '#16a34a' : 'var(--primary)', color: 'white', fontWeight: '700', fontSize: '13px', cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.6 : 1, transition: 'background 0.2s' }}>
                        {uploading ? '⏳ Uploading…' : stagedFile ? '↑ Upload Image' : '↑ Choose Image'}
                    </button>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
                    <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
                        onChange={e => { stageFile(e.target.files[0]); }} />
                </div>

                {/* Toast */}
                {toast && (
                    <div style={{ margin: '12px 24px 0', padding: '10px 14px', borderRadius: '8px', background: '#0f172a', color: 'white', fontSize: '13px', fontWeight: '600' }}>
                        {toast}
                    </div>
                )}

                {/* Drop zone + grid */}
                <div style={{ flex: 1, overflow: 'auto', padding: '20px 24px' }}>

                    {/* Drag-drop upload zone */}
                    <div
                        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                        onClick={() => fileRef.current?.click()}
                        style={{
                            border: `2px dashed ${dragOver ? 'var(--primary)' : '#cbd5e1'}`,
                            borderRadius: '12px', padding: '24px', textAlign: 'center',
                            marginBottom: '20px', cursor: 'pointer', transition: 'all 0.2s',
                            background: dragOver ? '#eff6ff' : '#f8fafc',
                        }}>
                        <div style={{ fontSize: '28px', marginBottom: '6px' }}>{stagedFile ? '✅' : '📁'}</div>
                        {stagedFile ? (
                            <div>
                                <p style={{ fontSize: '13px', color: '#16a34a', fontWeight: '700', margin: 0 }}>
                                    {stagedFile.name}
                                </p>
                                <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                                    Ready to upload — click <strong>↑ Upload Image</strong> to confirm
                                </p>
                                <button
                                    onClick={e => { e.stopPropagation(); setStagedFile(null); if (fileRef.current) fileRef.current.value = ''; }}
                                    style={{ marginTop: '8px', fontSize: '11px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                                    ✕ Clear selection
                                </button>
                            </div>
                        ) : (
                            <div>
                                <p style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', margin: 0 }}>
                                    Drag & drop an image here, or <span style={{ color: 'var(--primary)' }}>click to browse</span>
                                </p>
                                <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>JPEG, PNG, WebP, GIF, SVG — max 10 MB</p>
                            </div>
                        )}
                    </div>

                    {/* Grid */}
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Loading library…</div>
                    ) : media.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                            <div style={{ fontSize: '36px', marginBottom: '8px' }}>🗃</div>
                            <p style={{ fontWeight: '600' }}>No media uploaded yet</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
                            {media.map(item => (
                                <div key={item.id}
                                    onClick={() => onSelect(item.url, item.original_name || item.filename)}
                                    style={{
                                        borderRadius: '10px', overflow: 'hidden', border: '2px solid #e2e8f0',
                                        cursor: 'pointer', position: 'relative', background: '#f8fafc',
                                        transition: 'all 0.15s',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'scale(1.02)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'scale(1)'; }}>
                                    <img src={item.url} alt={item.original_name}
                                        style={{ width: '100%', height: '110px', objectFit: 'cover', display: 'block' }} />
                                    <div style={{ padding: '8px 10px' }}>
                                        <div style={{ fontSize: '11px', fontWeight: '600', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {item.original_name || item.filename}
                                        </div>
                                        <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>{formatSize(item.size)}</div>
                                    </div>
                                    {/* Delete button */}
                                    <button
                                        onClick={e => handleDelete(item, e)}
                                        disabled={deleting === item.id}
                                        title="Delete"
                                        style={{
                                            position: 'absolute', top: '6px', right: '6px',
                                            background: 'rgba(220,38,38,0.9)', border: 'none', color: 'white',
                                            width: '24px', height: '24px', borderRadius: '6px',
                                            fontSize: '12px', cursor: 'pointer', display: 'flex',
                                            alignItems: 'center', justifyContent: 'center',
                                            opacity: deleting === item.id ? 0.5 : 0,
                                            transition: 'opacity 0.15s',
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                                        onMouseLeave={e => { if (deleting !== item.id) e.currentTarget.style.opacity = '0'; }}>
                                        🗑
                                    </button>
                                    {/* "Use" overlay on hover */}
                                    <div style={{
                                        position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.45)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        opacity: 0, transition: 'opacity 0.15s',
                                    }}
                                        onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                                        onMouseLeave={e => e.currentTarget.style.opacity = '0'}>
                                        <span style={{ color: 'white', fontWeight: '800', fontSize: '13px', background: 'var(--primary)', padding: '5px 14px', borderRadius: '20px' }}>
                                            ✓ Use
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


// ── CatTagField — inline category/tag selector with create ───────────
const CatTagField = ({ label, items, isSelected, onToggle, createEndpoint, createBody, onCreated, chipStyle }) => {
    const [newName, setNewName]   = useState('');
    const [creating, setCreating] = useState(false);
    const [showInput, setShowInput] = useState(false);
    const [error, setError]       = useState('');

    const handleCreate = async () => {
        const name = newName.trim();
        if (!name) return;
        setCreating(true); setError('');
        try {
            const res = await apiFetch('POST', createEndpoint, createBody(name));
            onCreated(res);
            setNewName('');
            setShowInput(false);
        } catch (e) {
            setError(e.message);
        }
        setCreating(false);
    };

    const isTag = chipStyle === 'tag';

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {label}
                </span>
                <button type="button" onClick={() => { setShowInput(s => !s); setError(''); }}
                    style={{ fontSize: '12px', fontWeight: '700', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px' }}>
                    {showInput ? '✕ Cancel' : `+ New ${label.slice(0,-1)}`}
                </button>
            </div>

            {/* Existing chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', minHeight: '32px' }}>
                {items.length === 0 && !showInput && (
                    <span style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic' }}>
                        No {label.toLowerCase()} yet — create one above
                    </span>
                )}
                {items.map(item => {
                    const selected = isSelected(item.id);
                    return (
                        <button key={item.id} type="button" onClick={() => onToggle(item.id)}
                            style={{
                                padding: isTag ? '5px 12px' : '6px 14px',
                                borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                                cursor: 'pointer', transition: 'all 0.15s',
                                background: selected ? (isTag ? '#0f172a' : 'var(--primary)') : '#f1f5f9',
                                color: selected ? 'white' : '#475569',
                                border: selected ? 'none' : '1px solid #e2e8f0',
                            }}>
                            {isTag ? `# ${item.name}` : item.name}
                            {selected && <span style={{ marginLeft: '5px', opacity: 0.7 }}>✓</span>}
                        </button>
                    );
                })}
            </div>

            {/* Inline create input */}
            {showInput && (
                <div style={{ marginTop: '10px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                        autoFocus
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleCreate(); } if (e.key === 'Escape') setShowInput(false); }}
                        placeholder={`${label.slice(0,-1)} name…`}
                        style={{
                            flex: 1, padding: '8px 12px', borderRadius: '8px',
                            border: '1.5px solid var(--primary)', fontSize: '13px',
                            outline: 'none', fontFamily: 'inherit',
                        }}
                    />
                    <button type="button" onClick={handleCreate} disabled={creating || !newName.trim()}
                        style={{
                            padding: '8px 16px', borderRadius: '8px', border: 'none',
                            background: 'var(--primary)', color: 'white', fontWeight: '700',
                            fontSize: '13px', cursor: 'pointer',
                            opacity: creating || !newName.trim() ? 0.5 : 1,
                        }}>
                        {creating ? '…' : 'Add'}
                    </button>
                </div>
            )}
            {error && <p style={{ fontSize: '12px', color: '#dc2626', marginTop: '6px' }}>⚠ {error}</p>}
        </div>
    );
};

// ── Post Form (create / edit) ─────────────────────────────────────────
const PostForm = ({ post, categories, tags, setCategories, setTags, onSave, onCancel }) => {
    const isEdit = !!post;
    const buildForm = (p) => ({
        title:              p?.title              || '',
        // API returns body_html (rendered) but stores raw markdown as body.
        // Use body if present (raw markdown for editing), fall back to body_html.
        body:               p?.body              || p?.body_html        || '',
        excerpt:            p?.excerpt            || '',
        status:             p?.status             || 'draft',
        // formatForCard renames featured_image → image; handle both
        featured_image:     p?.featured_image     || p?.image           || '',
        featured_image_alt: p?.featured_image_alt || '',
        meta_title:         p?.meta_title         || '',
        meta_description:   p?.meta_description   || '',
        category_ids:       p?.categories?.map(c => c.id) || [],
        tag_ids:            p?.tags?.map(t => t.id)       || [],
        scheduled_at:       p?.scheduled_at       || '',
    });

    const [form, setForm]           = useState(() => buildForm(post));
    const [saving, setSaving]         = useState(false);
    const [error, setError]           = useState('');
    const [picker, setPicker]         = useState(null); // null | 'featured' | 'body'
    const bodyRef                     = React.useRef(null);

    // Re-populate form whenever the post prop changes (async load resolves)
    useEffect(() => {
        setForm(buildForm(post));
    }, [post]);

    // Insert markdown image at cursor position in body textarea
    const insertImageAtCursor = (url, altText) => {
        const el = bodyRef.current;
        const mdImg = `![${altText || 'image'}](${url})`;
        if (!el) { set('body', (form.body || '') + '\n' + mdImg); return; }
        const start = el.selectionStart;
        const end   = el.selectionEnd;
        const before = (form.body || '').slice(0, start);
        const after  = (form.body || '').slice(end);
        const newBody = before + '\n' + mdImg + '\n' + after;
        set('body', newBody);
        // Restore cursor after the inserted text
        setTimeout(() => {
            el.focus();
            const pos = start + mdImg.length + 2;
            el.setSelectionRange(pos, pos);
        }, 0);
    };

    // Handle media picker selection
    const handlePickerSelect = (url, name) => {
        if (picker === 'featured') {
            set('featured_image', url);
        } else if (picker === 'body') {
            insertImageAtCursor(url, name);
        }
        setPicker(null);
    };

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    // Coerce ids to strings to avoid number vs string mismatch between list & detail API responses
    const toggleArr = (key, id) => {
        const sid = String(id);
        const current = form[key].map(String);
        set(key, current.includes(sid)
            ? form[key].filter(x => String(x) !== sid)
            : [...form[key], id]);
    };
    const isSelected = (key, id) => form[key].map(String).includes(String(id));

    const handleSave = async (statusOverride) => {
        setSaving(true); setError('');
        try {
            const payload = { ...form, status: statusOverride || form.status };
            if (payload.scheduled_at === '') payload.scheduled_at = null;
            if (isEdit) {
                await apiFetch('PUT', `/posts/admin/${post.id}`, payload);
            } else {
                await apiFetch('POST', '/posts/admin', payload);
            }
            onSave();
        } catch (e) { setError(e.message); }
        setSaving(false);
    };

    const inputStyle = {
        width: '100%', padding: '10px 14px', borderRadius: '8px',
        border: '1.5px solid #e2e8f0', fontSize: '14px', outline: 'none',
        fontFamily: 'inherit', boxSizing: 'border-box', background: '#fff',
        transition: 'border-color 0.2s',
    };
    const labelStyle = { fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' };

    return (
        <div>
            {/* Media Picker Modal */}
            {picker && (
                <MediaPicker
                    mode={picker}
                    onSelect={handlePickerSelect}
                    onClose={() => setPicker(null)}
                />
            )}

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                    {isEdit ? '✏️ Edit Post' : '✨ New Post'}
                </h2>
                <button onClick={onCancel} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#94a3b8', padding: '4px' }}>✕</button>
            </div>

            {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px', color: '#dc2626' }}>
                    ⚠ {error}
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {/* Title */}
                <div>
                    <label style={labelStyle}>Title *</label>
                    <input style={inputStyle} value={form.title} onChange={e => set('title', e.target.value)}
                        placeholder="Post title…"
                        onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                        onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                </div>

                {/* Excerpt */}
                <div>
                    <label style={labelStyle}>Excerpt</label>
                    <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '72px' }}
                        value={form.excerpt} onChange={e => set('excerpt', e.target.value)}
                        placeholder="Short summary shown in blog listings…"
                        onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                        onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                </div>

                {/* Body */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <label style={{ ...labelStyle, margin: 0 }}>Body (Markdown)</label>
                        <button type="button" onClick={() => setPicker('body')}
                            style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', background: 'white', color: '#475569', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                            🖼 Insert Image
                        </button>
                    </div>
                    <textarea ref={bodyRef}
                        style={{ ...inputStyle, resize: 'vertical', minHeight: '240px', fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.6' }}
                        value={form.body} onChange={e => set('body', e.target.value)}
                        placeholder={'# Heading\n\nWrite your content in **markdown**...\n\n- List item\n- List item\n\n> Blockquote\n\n![alt text](image-url)'}
                        onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                        onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                    <p style={{ margin: '5px 0 0', fontSize: '11px', color: '#94a3b8' }}>
                        Tip: Click "Insert Image" to pick from your media library — inserts <code>![alt](url)</code> at cursor.
                    </p>
                </div>

                {/* Featured Image */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <label style={{ ...labelStyle, margin: 0 }}>Featured Image</label>
                        <button type="button" onClick={() => setPicker('featured')}
                            style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', background: 'white', color: '#475569', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                            🖼 Browse Library
                        </button>
                    </div>
                    {form.featured_image ? (
                        <div style={{ position: 'relative' }}>
                            <img src={form.featured_image} alt="preview"
                                style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '10px', border: '2px solid #e2e8f0', display: 'block' }}
                                onError={e => e.target.style.display = 'none'} />
                            <button type="button" onClick={() => set('featured_image', '')}
                                style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(220,38,38,0.9)', border: 'none', color: 'white', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                                ✕ Remove
                            </button>
                        </div>
                    ) : (
                        <div onClick={() => setPicker('featured')}
                            style={{ border: '2px dashed #cbd5e1', borderRadius: '10px', padding: '32px', textAlign: 'center', cursor: 'pointer', background: '#f8fafc', transition: 'all 0.2s' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = '#eff6ff'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = '#f8fafc'; }}>
                            <div style={{ fontSize: '28px', marginBottom: '6px' }}>🖼</div>
                            <p style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', margin: 0 }}>
                                Click to pick from library or upload a new image
                            </p>
                        </div>
                    )}
                    <input style={{ ...inputStyle, marginTop: '8px', fontSize: '12px' }}
                        value={form.featured_image} onChange={e => set('featured_image', e.target.value)}
                        placeholder="Or paste an image URL directly…"
                        onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                        onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                </div>

                {/* Categories — always visible, inline create */}
                <div style={{ border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px' }}>
                    <CatTagField
                        label="Categories"
                        items={categories}
                        selectedIds={form.category_ids}
                        onToggle={id => toggleArr('category_ids', id)}
                        isSelected={id => isSelected('category_ids', id)}
                        createEndpoint="/categories"
                        createBody={name => ({ name })}
                        onCreated={newItem => {
                            setCategories(prev => [...prev, newItem]);
                            toggleArr('category_ids', newItem.id);
                        }}
                        chipStyle="category"
                    />
                </div>

                {/* Tags — always visible, inline create */}
                <div style={{ border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px' }}>
                    <CatTagField
                        label="Tags"
                        items={tags}
                        selectedIds={form.tag_ids}
                        onToggle={id => toggleArr('tag_ids', id)}
                        isSelected={id => isSelected('tag_ids', id)}
                        createEndpoint="/tags"
                        createBody={name => ({ name })}
                        onCreated={newItem => {
                            setTags(prev => [...prev, newItem]);
                            toggleArr('tag_ids', newItem.id);
                        }}
                        chipStyle="tag"
                    />
                </div>

                {/* SEO */}
                {/* <details style={{ borderRadius: '8px', border: '1px solid #e2e8f0', padding: '12px 16px' }}>
                    <summary style={{ fontSize: '13px', fontWeight: '700', color: '#475569', cursor: 'pointer', userSelect: 'none' }}>
                        🔍 SEO Settings
                    </summary>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '14px' }}>
                        <div>
                            <label style={labelStyle}>Meta Title</label>
                            <input style={inputStyle} value={form.meta_title} onChange={e => set('meta_title', e.target.value)}
                                placeholder="SEO title (leave blank to use post title)"
                                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                                onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                        </div>
                        <div>
                            <label style={labelStyle}>Meta Description</label>
                            <textarea style={{ ...inputStyle, minHeight: '64px', resize: 'vertical' }}
                                value={form.meta_description} onChange={e => set('meta_description', e.target.value)}
                                placeholder="Under 160 characters…"
                                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                                onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                        </div>
                        <div>
                            <label style={labelStyle}>Featured Image Alt Text</label>
                            <input style={inputStyle} value={form.featured_image_alt} onChange={e => set('featured_image_alt', e.target.value)}
                                placeholder="Describe the image for accessibility"
                                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                                onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                        </div>
                    </div>
                </details> */}

                {/* Schedule (only for scheduled status) */}
                <div>
                    <label style={labelStyle}>Status</label>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {['draft', 'published', 'scheduled'].map(s => (
                            <button key={s} onClick={() => set('status', s)}
                                style={{
                                    padding: '7px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.15s',
                                    background: form.status === s ? 'var(--primary)' : '#f1f5f9',
                                    color: form.status === s ? 'white' : '#475569',
                                    border: form.status === s ? 'none' : '1px solid #e2e8f0',
                                }}>
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                            </button>
                        ))}
                    </div>
                    {form.status === 'scheduled' && (
                        <input type="datetime-local" style={{ ...inputStyle, marginTop: '10px' }}
                            value={form.scheduled_at} onChange={e => set('scheduled_at', e.target.value)}
                            onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                            onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                    )}
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: '10px', paddingTop: '8px', borderTop: '1px solid #f1f5f9', flexWrap: 'wrap' }}>
                    <button onClick={() => handleSave('draft')} disabled={saving || !form.title}
                        style={{ flex: 1, padding: '11px 16px', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: 'white', color: '#475569', fontWeight: '700', fontSize: '14px', cursor: 'pointer', opacity: saving || !form.title ? 0.5 : 1 }}>
                        {saving ? 'Saving…' : '💾 Save Draft'}
                    </button>
                    <button onClick={() => handleSave('published')} disabled={saving || !form.title}
                        style={{ flex: 1, padding: '11px 16px', borderRadius: '8px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: '700', fontSize: '14px', cursor: 'pointer', opacity: saving || !form.title ? 0.5 : 1 }}>
                        {saving ? 'Saving…' : '🚀 Publish Now'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ── Main AdminDashboard Component ─────────────────────────────────────
const AdminDashboard = ({ onClose }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [posts, setPosts]           = useState([]);
    const [categories, setCategories] = useState([]);
    const [tags, setTags]             = useState([]);
    const [loading, setLoading]       = useState(true);
    const [view, setView]             = useState('list'); // 'list' | 'form'
    const [editPost, setEditPost]     = useState(null);
    const [actionLoading, setActionLoading] = useState(null);
    const [statusFilter, setStatusFilter]   = useState('all');
    const [toast, setToast]           = useState('');
    const [search, setSearch]         = useState('');

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

    const loadAll = useCallback(async () => {
        setLoading(true);
        try {
            const [postsRes, catsRes, tagsRes] = await Promise.all([
                apiFetch('GET', '/posts/admin/all?limit=100'),
                apiFetch('GET', '/categories'),
                apiFetch('GET', '/tags'),
            ]);
            setPosts(postsRes.posts || []);
            // Normalize: API may return array directly OR wrapped object
            const catsArr = Array.isArray(catsRes) ? catsRes : (catsRes?.categories ?? catsRes?.data ?? []);
            const tagsArr = Array.isArray(tagsRes) ? tagsRes : (tagsRes?.tags ?? tagsRes?.data ?? []);
            setCategories(catsArr);
            setTags(tagsArr);
        } catch (e) { console.error(e); }
        setLoading(false);
    }, []);

    useEffect(() => { if (user) loadAll(); }, [user]);

    const handlePublish = async (post) => {
        setActionLoading(post.id + '_publish');
        try {
            await apiFetch('PATCH', `/posts/admin/${post.id}/publish`);
            setPosts(prev => prev.map(p => p.id === post.id ? { ...p, status: 'published' } : p));
            showToast('✅ Post published');
        } catch (e) { showToast('❌ ' + e.message); }
        setActionLoading(null);
    };

    const handleWithdraw = async (post) => {
        setActionLoading(post.id + '_withdraw');
        try {
            await apiFetch('PATCH', `/posts/admin/${post.id}/withdraw`);
            setPosts(prev => prev.map(p => p.id === post.id ? { ...p, status: 'draft' } : p));
            showToast('⏸ Post withdrawn to draft');
        } catch (e) { showToast('❌ ' + e.message); }
        setActionLoading(null);
    };

    const handleDelete = async (post) => {
        if (!window.confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
        setActionLoading(post.id + '_delete');
        try {
            await apiFetch('DELETE', `/posts/admin/${post.id}`);
            setPosts(prev => prev.filter(p => p.id !== post.id));
            showToast('🗑 Post deleted');
        } catch (e) { showToast('❌ ' + e.message); }
        setActionLoading(null);
    };

    const handleFormSave = () => {
        showToast(editPost ? '✅ Post updated' : '✅ Post created');
        setView('list');
        setEditPost(null);
        loadAll();
    };

    // All needed fields are already in the list payload via formatForCard
    const [formLoading] = useState(false);
    const openEditForm = (post) => {
        setEditPost(post);
        setView('form');
    };

    const handleLogout = async () => {
        await logout();
        if (onClose) onClose();
        navigate('/blog');
    };

    const filteredPosts = posts.filter(p => {
        const matchStatus = statusFilter === 'all' || p.status === statusFilter;
        const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase());
        return matchStatus && matchSearch;
    });

    const counts = {
        all:       posts.length,
        published: posts.filter(p => p.status === 'published').length,
        draft:     posts.filter(p => p.status === 'draft').length,
        scheduled: posts.filter(p => p.status === 'scheduled').length,
    };

    // ── Not logged in ──────────────────────────────────────────────────
    if (!user) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: '16px' }}>
                <div style={{ fontSize: '48px' }}>🔒</div>
                <p style={{ fontWeight: '700', fontSize: '18px' }}>Please log in to access the dashboard</p>
                <button onClick={() => navigate('/admin/login')} className="btn-primary" style={{ padding: '12px 28px' }}>
                    Go to Login
                </button>
            </div>
        );
    }

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>

            {/* ── Toast ─────────────────────────────────────────────── */}
            {toast && (
                <div style={{
                    position: 'fixed', top: '20px', right: '24px', zIndex: 9999,
                    background: '#0f172a', color: 'white', padding: '12px 20px',
                    borderRadius: '10px', fontSize: '14px', fontWeight: '600',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)', animation: 'slideIn 0.2s ease',
                }}>
                    {toast}
                </div>
            )}

            {/* ── Top bar ───────────────────────────────────────────── */}
            <div style={{ background: '#0f172a', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: 'white', fontSize: '16px' }}>V</div>
                <span style={{ color: 'white', fontWeight: '800', fontSize: '16px', flex: 1 }}>Blog Admin</span>
                <span style={{ color: '#94a3b8', fontSize: '13px' }}>👤 {user.name}</span>
                {onClose && (
                    <button onClick={onClose}
                        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '6px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                        ✕ Close
                    </button>
                )}
            </div>

            <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
                {view === 'form' ? (
                    // ── Post Form view ─────────────────────────────────
                    <div style={{ maxWidth: '760px', margin: '0 auto', background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
                        {formLoading ? (
                            <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
                                <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
                                <p style={{ fontWeight: '600' }}>Loading post data…</p>
                            </div>
                        ) : (
                            <PostForm
                                post={editPost}
                                categories={categories}
                                tags={tags}
                                setCategories={setCategories}
                                setTags={setTags}
                                onSave={handleFormSave}
                                onCancel={() => { setView('list'); setEditPost(null); }}
                            />
                        )}
                    </div>
                ) : (
                    // ── List view ──────────────────────────────────────
                    <>
                        {/* Stats row */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px', marginBottom: '24px' }}>
                            {[
                                { label: 'Total Posts', val: counts.all,       color: '#6366f1' },
                                { label: 'Published',   val: counts.published,  color: '#22c55e' },
                                { label: 'Drafts',      val: counts.draft,      color: '#f59e0b' },
                                { label: 'Scheduled',   val: counts.scheduled,  color: '#3b82f6' },
                            ].map(s => (
                                <div key={s.label} style={{ background: 'white', borderRadius: '12px', padding: '16px 20px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', borderLeft: `4px solid ${s.color}` }}>
                                    <div style={{ fontSize: '26px', fontWeight: '900', color: s.color }}>{s.val}</div>
                                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', marginTop: '2px' }}>{s.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Toolbar */}
                        <div style={{ background: 'white', borderRadius: '12px', padding: '16px 20px', marginBottom: '16px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                            {/* Search */}
                            <input
                                value={search} onChange={e => setSearch(e.target.value)}
                                placeholder="🔍  Search posts…"
                                style={{ flex: 1, minWidth: '180px', padding: '9px 14px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }}
                                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                            />

                            {/* Status filter */}
                            <div style={{ display: 'flex', gap: '6px' }}>
                                {['all', 'published', 'draft', 'scheduled'].map(s => (
                                    <button key={s} onClick={() => setStatusFilter(s)}
                                        style={{
                                            padding: '7px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.15s', textTransform: 'capitalize',
                                            background: statusFilter === s ? '#0f172a' : '#f1f5f9',
                                            color: statusFilter === s ? 'white' : '#64748b',
                                            border: 'none',
                                        }}>
                                        {s} {s !== 'all' && `(${counts[s] ?? 0})`}
                                    </button>
                                ))}
                            </div>

                            {/* New Post button */}
                            <button onClick={() => { setEditPost(null); setView('form'); }}
                                style={{ padding: '9px 20px', borderRadius: '8px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: '700', fontSize: '14px', cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                ✚ New Post
                            </button>
                        </div>

                        {/* Posts table */}
                        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                            {loading ? (
                                <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>Loading posts…</div>
                            ) : filteredPosts.length === 0 ? (
                                <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
                                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>📝</div>
                                    <p style={{ fontWeight: '600' }}>No posts found</p>
                                    <button onClick={() => setView('form')}
                                        style={{ marginTop: '12px', padding: '9px 20px', borderRadius: '8px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>
                                        Create your first post →
                                    </button>
                                </div>
                            ) : (
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                                    <thead>
                                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                            {['Post', 'Category', 'Status', 'Date', 'Actions'].map(h => (
                                                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredPosts.map((post, i) => {
                                            const cat = post.categories?.[0]?.name || 'GENERAL';
                                            const date = post.date
                                                ? new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                                : post.created_at
                                                    ? new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                                    : '—';
                                            const busy = (k) => actionLoading === post.id + '_' + k;
                                            return (
                                                <tr key={post.id} style={{ borderBottom: i < filteredPosts.length - 1 ? '1px solid #f1f5f9' : 'none', transition: 'background 0.15s' }}
                                                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                                    onMouseLeave={e => e.currentTarget.style.background = 'white'}>

                                                    {/* Title */}
                                                    <td style={{ padding: '14px 16px', maxWidth: '280px' }}>
                                                        <div style={{ fontWeight: '700', color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</div>
                                                        {post.excerpt && <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.excerpt}</div>}
                                                    </td>

                                                    {/* Category */}
                                                    <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                                                        <span style={{ fontSize: '12px', background: '#f1f5f9', padding: '3px 10px', borderRadius: '20px', color: '#475569', fontWeight: '600' }}>{cat}</span>
                                                    </td>

                                                    {/* Status */}
                                                    <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                                                        <StatusBadge status={post.status} />
                                                    </td>

                                                    {/* Date */}
                                                    <td style={{ padding: '14px 16px', fontSize: '12px', color: '#64748b', whiteSpace: 'nowrap' }}>{date}</td>

                                                    {/* Actions */}
                                                    <td style={{ padding: '14px 16px' }}>
                                                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                                            {/* Edit */}
                                                            <button onClick={() => openEditForm(post)}
                                                                title="Edit" style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid #e2e8f0', background: 'white', color: '#475569', fontSize: '13px', cursor: 'pointer' }}>
                                                                ✏️
                                                            </button>

                                                            {/* Publish */}
                                                            {post.status !== 'published' && (
                                                                <button onClick={() => handlePublish(post)} disabled={!!actionLoading} title="Publish"
                                                                    style={{ padding: '5px 10px', borderRadius: '6px', border: 'none', background: '#dcfce7', color: '#15803d', fontSize: '13px', fontWeight: '700', cursor: 'pointer', opacity: busy('publish') ? 0.5 : 1 }}>
                                                                    {busy('publish') ? '…' : '↑'}
                                                                </button>
                                                            )}

                                                            {/* Withdraw */}
                                                            {post.status === 'published' && (
                                                                <button onClick={() => handleWithdraw(post)} disabled={!!actionLoading} title="Withdraw to Draft"
                                                                    style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid #fde68a', background: '#fef9c3', color: '#854d0e', fontSize: '13px', fontWeight: '700', cursor: 'pointer', opacity: busy('withdraw') ? 0.5 : 1 }}>
                                                                    {busy('withdraw') ? '…' : '⏸'}
                                                                </button>
                                                            )}

                                                            {/* Delete */}
                                                            <button onClick={() => handleDelete(post)} disabled={!!actionLoading} title="Delete"
                                                                style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid #fecaca', background: '#fef2f2', color: '#dc2626', fontSize: '13px', cursor: 'pointer', opacity: busy('delete') ? 0.5 : 1 }}>
                                                                {busy('delete') ? '…' : '🗑'}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </>
                )}
            </div>

            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(20px); opacity: 0; }
                    to   { transform: translateX(0);    opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default AdminDashboard;