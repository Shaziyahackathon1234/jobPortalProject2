const isDevelopment = import.meta.env.MODE === 'development';

// Using relative paths in production allows Render to handle the domain routing
// VITE_API_URL (set at build time, e.g. by Docker) wins; otherwise keep the old behaviour
const BASE_URL = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL
    : isDevelopment
        ? "http://localhost:8000/api/v1"
        : "https://jobportalproject2.onrender.com/api/v1";

export const USER_API_END_POINT = `${BASE_URL}/user`;
export const JOB_API_END_POINT = `${BASE_URL}/job`;
export const APPLICATION_API_END_POINT = `${BASE_URL}/application`;
export const COMPANY_API_END_POINT = `${BASE_URL}/company`;
export const AI_API_END_POINT = `${BASE_URL}/ai`; // Added this