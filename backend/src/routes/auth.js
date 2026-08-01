"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const jwt_1 = require("../utils/jwt");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const loginLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login requests per windowMs
    message: {
        error: "Too many login attempts. Please try again after 15 minutes.",
    },
});
router.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: "Email and password are required." });
            return;
        }
        if (password.length < 8) {
            res
                .status(400)
                .json({ error: "Password must be at least 8 characters long." });
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({ error: "Invalid email format." });
            return;
        }
        const existingUser = await db_1.db
            .select()
            .from(schema_1.users)
            .where((0, drizzle_orm_1.eq)(schema_1.users.email, email));
        if (existingUser.length > 0) {
            res.status(409).json({ error: "Email already exists." });
            return;
        }
        const salt = await bcryptjs_1.default.genSalt(12);
        const passwordHash = await bcryptjs_1.default.hash(password, salt);
        const newUser = await db_1.db
            .insert(schema_1.users)
            .values({
            email,
            passwordHash,
        })
            .returning({ id: schema_1.users.id, email: schema_1.users.email });
        if (!newUser || newUser.length === 0) {
            res.status(500).json({ error: "Failed to create user." });
            return;
        }
        const token = (0, jwt_1.generateToken)(newUser[0].id);
        res.status(201).json({ token, user: newUser[0] });
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});
router.post("/login", loginLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: "Email and password are required." });
            return;
        }
        const foundUsers = await db_1.db
            .select()
            .from(schema_1.users)
            .where((0, drizzle_orm_1.eq)(schema_1.users.email, email));
        if (foundUsers.length === 0) {
            res.status(401).json({ error: "Invalid email or password." });
            return;
        }
        const user = foundUsers[0];
        if (!user) {
            res.status(401).json({ error: "Invalid email or password." });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            res.status(401).json({ error: "Invalid email or password." });
            return;
        }
        const token = (0, jwt_1.generateToken)(user.id);
        res.json({ token, user: { id: user.id, email: user.email } });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});
router.get("/me", auth_1.authenticateToken, async (req, res) => {
    try {
        if (!req.userId) {
            res.status(401).json({ error: "Unauthorized." });
            return;
        }
        const foundUsers = await db_1.db
            .select({
            id: schema_1.users.id,
            email: schema_1.users.email,
            createdAt: schema_1.users.createdAt,
        })
            .from(schema_1.users)
            .where((0, drizzle_orm_1.eq)(schema_1.users.id, req.userId));
        if (foundUsers.length === 0) {
            res.status(404).json({ error: "User not found." });
            return;
        }
        res.json({ user: foundUsers[0] });
    }
    catch (error) {
        console.error("Fetch user error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});
router.post("/logout", (req, res) => {
    res.json({ success: true, message: "Logged out successfully." });
});
exports.default = router;
//# sourceMappingURL=auth.js.map