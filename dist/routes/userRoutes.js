"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dbIndex_1 = require("../dbIndex");
const zod_1 = require("zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const routes = (0, express_1.Router)();
const signupSchema = zod_1.z.object({
    username: zod_1.z.string(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().length(8)
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
routes.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        const { success } = signupSchema.safeParse(req.body);
        if (!success) {
            return res.status(400).json({
                success: false,
                message: "Improper credentials"
            });
        }
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Provide all credentials"
            });
        }
        const isPresent = yield (0, dbIndex_1.isEmailPresent)(email);
        if (isPresent === null || isPresent === void 0 ? void 0 : isPresent.email) {
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });
        }
        const result = yield (0, dbIndex_1.signupUser)(username, email, password);
        console.log(result);
        return res.status(200).json({
            success: true,
            message: "Signup successful"
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error
        });
    }
}));
routes.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const { success } = loginSchema.safeParse(req.body);
    if (!success) {
        res.status(400).json({
            success: false,
            message: "Improper credentials"
        });
    }
    const present = yield (0, dbIndex_1.isEmailPresent)(email);
    if (present == null) {
        res.status(400).json({
            success: false,
            message: "Email is not present"
        });
    }
    if ((present === null || present === void 0 ? void 0 : present.password) != password) {
        res.status(400).json({
            success: false,
            message: "Wrong password"
        });
    }
    const token = jsonwebtoken_1.default.sign({
        email: present === null || present === void 0 ? void 0 : present.email,
        id: present === null || present === void 0 ? void 0 : present.id
    }, "key");
    res.status(200).json({
        success: true,
        data: `token = ${token}`
    });
}));
routes.get('/posts', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization;
    try {
        let decode = null;
        if (typeof token === 'string') {
            decode = jsonwebtoken_1.default.verify(token, "key");
        }
        const posts = yield (0, dbIndex_1.postOnId)(decode.id);
        res.status(200).json({
            success: true,
            post: posts
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error
        });
    }
}));
routes.post('/posts', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization;
    const { title, body } = req.body;
    try {
        let decode = null;
        if (typeof token === 'string') {
            decode = jsonwebtoken_1.default.verify(token, "key");
        }
        const posts = yield (0, dbIndex_1.createBlog)(decode.id, title, body);
        res.status(200).json({
            success: true,
            post: posts
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error
        });
    }
}));
routes.get('/posts/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id, 10);
    const post = yield (0, dbIndex_1.postById)(id);
    if (!post) {
        res.status(400).json({
            success: false,
            message: "Post by given is not found"
        });
    }
    res.status(200).json({
        success: true,
        message: post
    });
}));
routes.put('/posts/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization;
    const id = parseInt(req.params.id, 10);
    const { title, body } = req.body;
    try {
        let decode = null;
        if (typeof token === 'string') {
            decode = jsonwebtoken_1.default.verify(token, "key");
        }
        const post = yield (0, dbIndex_1.updateBlog)(id, body, title);
        if (!post) {
            res.status(400).json({
                success: false,
                message: "Post by given is not found"
            });
        }
        res.status(200).json({
            success: true,
            message: post
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error
        });
    }
}));
routes.delete('/posts/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization;
    const id = parseInt(req.params.id, 10);
    try {
        let decode = null;
        if (typeof token === 'string') {
            decode = jsonwebtoken_1.default.verify(token, "key");
        }
        const post = yield (0, dbIndex_1.deleteBlog)(id);
        if (!post) {
            res.status(400).json({
                success: false,
                message: "Post by given is not found"
            });
        }
        res.status(200).json({
            success: true,
            message: post
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error
        });
    }
}));
exports.default = routes;
