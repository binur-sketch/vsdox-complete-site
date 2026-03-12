export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    me: '/auth/me',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },
  posts: {
    list: (page = 1, limit = 6) => `/posts?page=${page}&limit=${limit}`,
    bySlug: (slug) => `/posts/${slug}`,
    adminAll: (limit = 50) => `/posts/admin/all?limit=${limit}`,
    adminCreate: '/posts/admin',
    adminById: (id) => `/posts/admin/${id}`,
    adminPreview: (id) => `/posts/admin/${id}/preview`,
    publish: (id) => `/posts/admin/${id}/publish`,
    withdraw: (id) => `/posts/admin/${id}/withdraw`,
  },
  media: {
    list: (limit = 60) => `/media?limit=${limit}`,
    upload: '/media/upload',
    usage: (id) => `/media/${id}/usage`,
    byId: (id) => `/media/${id}`,
  },
  categories: '/categories',
  tags: '/tags',
};
