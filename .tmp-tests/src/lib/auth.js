"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = createToken;
exports.verifyToken = verifyToken;
exports.getSession = getSession;
exports.sessionCookieOptions = sessionCookieOptions;
exports.clearCookieOptions = clearCookieOptions;
const jose_1 = require("jose");
const headers_1 = require("next/headers");
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET ?? "dev-secret-change-in-production");
const COOKIE_NAME = "session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days in seconds
async function createToken(userId, username) {
    return new jose_1.SignJWT({ userId, username })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("30d")
        .sign(SECRET);
}
async function verifyToken(token) {
    try {
        const { payload } = await (0, jose_1.jwtVerify)(token, SECRET);
        return {
            userId: payload.userId,
            username: payload.username,
        };
    }
    catch {
        return null;
    }
}
async function getSession() {
    const cookieStore = await (0, headers_1.cookies)();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token)
        return null;
    return verifyToken(token);
}
function sessionCookieOptions(token) {
    return {
        name: COOKIE_NAME,
        value: token,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: MAX_AGE,
        path: "/",
    };
}
function clearCookieOptions() {
    return {
        name: COOKIE_NAME,
        value: "",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 0,
        path: "/",
    };
}
