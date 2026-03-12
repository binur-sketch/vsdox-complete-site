import React from 'react';

const STATUS_CONFIG = {
  published: { className: 'admin-status-published', label: 'Published' },
  draft: { className: 'admin-status-draft', label: 'Draft' },
  scheduled: { className: 'admin-status-scheduled', label: 'Scheduled' },
  archived: { className: 'admin-status-archived', label: 'Archived' },
};

const StatusBadge = ({ status }) => {
  const normalized = (status || 'draft').toLowerCase();
  const cfg = STATUS_CONFIG[normalized] || { className: 'admin-status-archived', label: normalized };

  return <span className={`admin-status-badge ${cfg.className}`}>{cfg.label}</span>;
};

export default StatusBadge;
