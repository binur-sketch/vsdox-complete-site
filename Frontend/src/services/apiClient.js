import { API_BASE_URL } from '../config/appConstants';

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function parseJson(response) {
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return null;
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function apiRequest(method, path, body, options = {}) {
  const {
    token,
    isFormData = body instanceof FormData,
    headers = {},
    throwOnError = true,
  } = options;

  const requestHeaders = {
    ...headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: requestHeaders,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

  const data = await parseJson(response);

  if (!response.ok && throwOnError) {
    throw new ApiError(data?.error || 'Request failed', response.status, data);
  }

  return { response, data };
}

export async function apiFetch(method, path, body, options = {}) {
  const { data } = await apiRequest(method, path, body, options);
  return data;
}
