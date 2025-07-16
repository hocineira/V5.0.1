import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api/portfolio`;

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Response Error:', error);
    if (error.response?.status === 404) {
      console.warn('Resource not found');
    } else if (error.response?.status >= 500) {
      console.error('Server error');
    }
    return Promise.reject(error);
  }
);

// API service functions
export const portfolioApi = {
  // Personal Info
  getPersonalInfo: () => api.get('/personal-info'),
  updatePersonalInfo: (data) => api.put('/personal-info', data),

  // Education
  getEducation: () => api.get('/education'),
  createEducation: (data) => api.post('/education', data),
  updateEducation: (id, data) => api.put(`/education/${id}`, data),
  deleteEducation: (id) => api.delete(`/education/${id}`),

  // Skills
  getSkills: () => api.get('/skills'),
  createSkillCategory: (data) => api.post('/skills', data),
  updateSkillCategory: (id, data) => api.put(`/skills/${id}`, data),
  deleteSkillCategory: (id) => api.delete(`/skills/${id}`),

  // Projects
  getProjects: () => api.get('/projects'),
  getProject: (id) => api.get(`/projects/${id}`),
  createProject: (data) => api.post('/projects', data),
  updateProject: (id, data) => api.put(`/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/projects/${id}`),

  // Experience
  getExperience: () => api.get('/experience'),
  createExperience: (data) => api.post('/experience', data),
  updateExperience: (id, data) => api.put(`/experience/${id}`, data),
  deleteExperience: (id) => api.delete(`/experience/${id}`),

  // Certifications
  getCertifications: () => api.get('/certifications'),
  createCertification: (data) => api.post('/certifications', data),
  updateCertification: (id, data) => api.put(`/certifications/${id}`, data),
  deleteCertification: (id) => api.delete(`/certifications/${id}`),

  // Testimonials
  getTestimonials: () => api.get('/testimonials'),
  createTestimonial: (data) => api.post('/testimonials', data),
  updateTestimonial: (id, data) => api.put(`/testimonials/${id}`, data),
  deleteTestimonial: (id) => api.delete(`/testimonials/${id}`),

  // Contact Messages
  getContactMessages: () => api.get('/contact-messages'),
  createContactMessage: (data) => api.post('/contact-messages', data),
  markMessageAsRead: (id) => api.put(`/contact-messages/${id}/read`),
  deleteContactMessage: (id) => api.delete(`/contact-messages/${id}`),
};

export default portfolioApi;