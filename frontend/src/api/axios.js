import axios from 'axios';
import keycloak from '../keycloak';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use(async (config) => {
  if (!config.headers) config.headers = {};
  if (!config.headers['X-User-Timezone']) {
    config.headers['X-User-Timezone'] =
      Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  }

  if (keycloak.authenticated) {
    try {
      await keycloak.updateToken(30);
      config.headers.Authorization = `Bearer ${keycloak.token}`;
    } catch {
      keycloak.logout();
    }
  }
  return config;
});

export default api;
