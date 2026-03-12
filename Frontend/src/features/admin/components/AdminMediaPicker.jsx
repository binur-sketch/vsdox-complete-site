import React, { useEffect, useRef, useState } from 'react';
import { adminApi } from '../api';

const ACCEPT_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
const MAX_BYTES = 10 * 1024 * 1024;

const formatSize = (bytes = 0) => {
  if (!bytes) return '';
  if (bytes > 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
};

const AdminMediaPicker = ({ onSelect, onClose }) => {
  const [media, setMedia] = useState([]);
  const [usageMap, setUsageMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [stagedFile, setStagedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(true);
  const fileRef = useRef(null);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const res = await adminApi.listMedia(60);
      const items = Array.isArray(res) ? res : res?.media ?? res?.data ?? [];
      setMedia(items);

      const usage = {};
      await Promise.all(items.map(async (item) => {
        try {
          const used = await adminApi.mediaUsage(item.id);
          if (used?.in_use) usage[item.id] = used.used_in;
        } catch {
          // Ignore per-file usage failures.
        }
      }));
      setUsageMap(usage);
    } catch (error) {
      setMessage(error.message || 'Failed to load media');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const stageFile = (file) => {
    if (!file) return;
    if (!ACCEPT_TYPES.includes(file.type)) {
      setMessage('Only images are supported');
      return;
    }
    if (file.size > MAX_BYTES) {
      setMessage('Max file size is 10 MB');
      return;
    }
    setMessage('');
    setStagedFile(file);
  };

  const onDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files?.[0];
    if (file) stageFile(file);
  };

  const handleUpload = async () => {
    if (!stagedFile) {
      fileRef.current?.click();
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', stagedFile);
      const uploaded = await adminApi.uploadMedia(fd);
      setMedia((prev) => [uploaded, ...prev]);
      setStagedFile(null);
      setMessage('Image uploaded');
      if (fileRef.current) {
        fileRef.current.value = '';
      }
    } catch (error) {
      setMessage(error.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (item, event) => {
    event.stopPropagation();
    if (usageMap[item.id]?.length) {
      setMessage('This image is in use by posts and cannot be deleted');
      return;
    }

    if (!window.confirm('Delete this image permanently?')) return;

    try {
      await adminApi.deleteMedia(item.id);
      setMedia((prev) => prev.filter((x) => x.id !== item.id));
      setMessage('Image deleted');
    } catch (error) {
      setMessage(error.message || 'Delete failed');
    }
  };

  return (
    <div className="admin-media-modal-backdrop" onClick={onClose}>
      <div className="admin-media-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-media-header">
          <h3>Media Library</h3>
          <div className="admin-media-header-actions">
            <button type="button" className="admin-btn admin-btn-primary" onClick={handleUpload} disabled={uploading}>
              {uploading ? (
                <>
                  <i className="fas fa-spinner fa-spin" aria-hidden="true"></i> Uploading...
                </>
              ) : stagedFile ? (
                <>
                  <i className="fas fa-upload" aria-hidden="true"></i> Upload Image
                </>
              ) : (
                <>
                  <i className="fas fa-image" aria-hidden="true"></i> Choose Image
                </>
              )}
            </button>
            <button type="button" className="admin-btn admin-btn-ghost admin-btn-close" onClick={onClose} title="Close">
              <i className="fas fa-xmark" aria-hidden="true"></i>
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="admin-hidden-input"
              onChange={(e) => stageFile(e.target.files?.[0])}
            />
          </div>
        </div>

        {message && <p className="admin-inline-message">{message}</p>}

        <div
          className={`admin-media-dropzone ${dragOver ? 'drag' : ''}`}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
        >
          {stagedFile ? (
            <div className="admin-media-staged-preview">
              <p><strong>{stagedFile.name}</strong> ready to upload</p>
              <img
                src={URL.createObjectURL(stagedFile)}
                alt={stagedFile.name}
                style={{ maxHeight: '140px', marginTop: '8px', borderRadius: '6px' }}
              />
            </div>
          ) : (
            <p>Drag & drop an image here, or click to browse</p>
          )}
          {stagedFile && (
            <button
              type="button"
              className="admin-btn admin-btn-ghost admin-btn-danger"
              onClick={(e) => {
                e.stopPropagation();
                setStagedFile(null);
                if (fileRef.current) fileRef.current.value = '';
              }}
            >
              <i className="fas fa-xmark" aria-hidden="true"></i> Clear
            </button>
          )}
        </div>

        {loading ? (
          <div className="admin-empty-state">Loading media...</div>
        ) : media.length === 0 ? (
          <div className="admin-empty-state">No media uploaded yet</div>
        ) : (
          <div className="admin-media-grid">
            {media.map((item) => {
              const usedCount = usageMap[item.id]?.length || 0;
              return (
                <div
                  key={item.id}
                  className={`admin-media-card ${selectedMedia?.id === item.id ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedMedia(item);
                    setPreviewOpen(true);
                  }}
                  onDoubleClick={() => onSelect(item.url, item.original_name || item.filename)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setSelectedMedia(item);
                    }
                    if (e.key === 'Enter' && e.shiftKey) {
                      onSelect(item.url, item.original_name || item.filename);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <img src={item.url} alt={item.original_name || item.filename} />
                  <div className="admin-media-meta">
                    <span className="admin-media-name">{item.original_name || item.filename}</span>
                    <span className="admin-media-size">{formatSize(item.size)}</span>
                    {usedCount > 0 && <span className="admin-media-used">Used in {usedCount} post(s)</span>}
                  </div>
                  <button
                    type="button"
                    className="admin-media-delete"
                    onClick={(e) => handleDelete(item, e)}
                    title="Delete image"
                  >
                    <i className="fas fa-trash" aria-hidden="true"></i> Delete
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div
          className="admin-media-preview-panel"
          style={{
            marginTop: '16px',
            borderTop: '1px solid #e2e8f0',
            paddingTop: '16px',
          }}
        >
          {selectedMedia && previewOpen ? (
            <>
              <div
                className="admin-media-preview-header"
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}
              >
                <strong>Selected Preview</strong>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary"
                    onClick={() => setPreviewOpen(false)}
                  >
                    <i className="fas fa-eye-slash" aria-hidden="true"></i> Hide Preview
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-primary"
                    onClick={() => onSelect(selectedMedia.url, selectedMedia.original_name || selectedMedia.filename)}
                  >
                    <i className="fas fa-check" aria-hidden="true"></i> Use Image
                  </button>
                </div>
              </div>
              <div
                className="admin-media-preview-body"
                style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}
              >
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.original_name || selectedMedia.filename}
                  style={{ maxWidth: '240px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <div className="admin-media-preview-meta" style={{ minWidth: '200px' }}>
                  <p><strong>{selectedMedia.original_name || selectedMedia.filename}</strong></p>
                  <p>{formatSize(selectedMedia.size)}</p>
                  {selectedMedia.uploaded_at && (
                      <p>Uploaded: {new Date(selectedMedia.uploaded_at).toLocaleString()}</p>
                    )}
                    {usageMap[selectedMedia.id]?.length > 0 && (
                      <p className="admin-media-usage">
                        In use by {usageMap[selectedMedia.id].length} post(s)
                      </p>
                    )}
                  </div>
                </div>
              </>
            ) : (
            <div className="admin-media-preview-empty" style={{ color: '#64748b' }}>
              {selectedMedia ? 'Preview hidden. Click another image to show it again.' : 'Select an image to preview here. Double-click an image to insert it.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMediaPicker;
