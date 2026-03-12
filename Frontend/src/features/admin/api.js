import { API_ENDPOINTS } from '../../config/apiEndpoints';
import { AUTH_STORAGE_KEYS } from '../../config/appConstants';
import { apiFetch } from '../../services/apiClient';

const getToken = () => localStorage.getItem(AUTH_STORAGE_KEYS.token);

const request = (method, path, body) => apiFetch(method, path, body, {
  token: getToken(),
  isFormData: body instanceof FormData,
});

export const adminApi = {
  listPosts: (limit = 100) => request('GET', API_ENDPOINTS.posts.adminAll(limit)),
  listCategories: () => request('GET', API_ENDPOINTS.categories),
  listTags: () => request('GET', API_ENDPOINTS.tags),
  createCategory: (name) => request('POST', API_ENDPOINTS.categories, { name }),
  createTag: (name) => request('POST', API_ENDPOINTS.tags, { name }),
  createPost: (payload) => request('POST', API_ENDPOINTS.posts.adminCreate, payload),
  updatePost: (id, payload) => request('PUT', API_ENDPOINTS.posts.adminById(id), payload),
  publishPost: (id) => request('PATCH', API_ENDPOINTS.posts.publish(id)),
  withdrawPost: (id) => request('PATCH', API_ENDPOINTS.posts.withdraw(id)),
  deletePost: (id) => request('DELETE', API_ENDPOINTS.posts.adminById(id)),
  listMedia: (limit = 60) => request('GET', API_ENDPOINTS.media.list(limit)),
  mediaUsage: (id) => request('GET', API_ENDPOINTS.media.usage(id)),
  uploadMedia: (formData) => request('POST', API_ENDPOINTS.media.upload, formData),
  deleteMedia: (id) => request('DELETE', API_ENDPOINTS.media.byId(id)),
};
