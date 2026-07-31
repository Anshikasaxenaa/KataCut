"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const express_1 = require("express");
const jwt_1 = require("../utils/jwt");
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN
    if (!token) {
        res.status(401).json({ error: "Access denied. No token provided." });
        return;
    }
    const decoded = (0, jwt_1.verifyToken)(token);
    if (!decoded || !decoded.userId) {
        res.status(401).json({ error: "Invalid or expired token." });
        return;
    }
    req.userId = decoded.userId;
    next();
};
exports.authenticateToken = authenticateToken;
//# sourceMappingURL=auth.js.map