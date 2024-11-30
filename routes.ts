/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = [
    "/", 
]

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /settings
 * @type {string[]}
 */
export const authRoutes = [
    "/auth/register",
    "/auth/login",
    "/auth/error"
]

/**
 * The prefix for the API routes routes
 * Routes that start with this prefix are used for API routes
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect for authenticated users
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/settings";