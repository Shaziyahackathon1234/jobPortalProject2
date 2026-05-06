const isDevelopment = import.meta.env.MODE === 'development';

// Using relative paths in production allows Render to handle the domain routing
const BASE_URL = isDevelopment 
    ? "http://localhost:8000/api/v1" 
    : "/api/v1"; 

export const USER_API_END_POINT = `${BASE_URL}/user`;
export const JOB_API_END_POINT = `${BASE_URL}/job`;
export const APPLICATION_API_END_POINT = `${BASE_URL}/application`;
export const COMPANY_API_END_POINT = `${BASE_URL}/company`;
export const AI_API_END_POINT = `${BASE_URL}/ai`; // Added this