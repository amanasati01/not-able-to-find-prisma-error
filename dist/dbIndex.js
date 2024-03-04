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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlog = exports.updateBlog = exports.postById = exports.createBlog = exports.postOnId = exports.uploadBlog = exports.isEmailPresent = exports.signupUser = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({ log: ['info', 'query'], });
function signupUser(username, email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = prisma.user.create({
            data: {
                username,
                email,
                password
            },
            select: {
                username: true,
                password: true,
                id: true,
                email: true
            }
        });
        return res;
    });
}
exports.signupUser = signupUser;
function isEmailPresent(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield prisma.user.findUnique({
            where: {
                email: email,
            },
            select: {
                email: true,
                password: true,
                id: true
            },
        });
        return user;
    });
}
exports.isEmailPresent = isEmailPresent;
function uploadBlog(id, title, body) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield prisma.blog.create({
            data: {
                title,
                body,
                user: {
                    connect: {
                        id
                    }
                }
            }
        });
        return res;
    });
}
exports.uploadBlog = uploadBlog;
function postOnId(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const posts = yield prisma.blog.findMany({
            where: {
                userId: id
            },
            select: {
                title: true,
                body: true
            }
        });
    });
}
exports.postOnId = postOnId;
function createBlog(userId, title, body) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield prisma.blog.create({
            data: {
                title,
                body,
                userId
            },
            select: {
                id: true,
                title: true,
                body: true
            }
        });
        return res;
    });
}
exports.createBlog = createBlog;
function postById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const post = yield prisma.blog.findUnique({
            where: {
                id
            },
            select: {
                title: true,
                body: true
            }
        });
        return post;
    });
}
exports.postById = postById;
function updateBlog(id, body, title) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const updatedBlog = yield prisma.blog.update({
                where: {
                    id: id,
                },
                data: {
                    title,
                    body,
                },
                select: {
                    id: true,
                    title: true,
                    body: true,
                },
            });
            return updatedBlog;
        }
        catch (error) {
            console.error('Error updating blog:', error);
            return null;
        }
    });
}
exports.updateBlog = updateBlog;
function deleteBlog(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield prisma.blog.delete({
            where: {
                id
            },
            select: {
                title: true,
                body: true
            }
        });
        return res;
    });
}
exports.deleteBlog = deleteBlog;
