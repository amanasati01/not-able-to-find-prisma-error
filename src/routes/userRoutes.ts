import { Router, Response, Request } from "express";
import {
  createBlog,
  deleteBlog,
  isEmailPresent,
  postById,
  postOnId,
  signupUser,
  updateBlog,
} from "../dbIndex";
import { string, z } from "zod";
import jwt from "jsonwebtoken";
const routes = Router();
const signupSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string().length(8),
});
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
routes.post("/signup", async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    // const { success } = signupSchema.safeParse(req.body);

    // if (!success) {
    //     return res.status(400).json({
    //         success: false,
    //         message: "Improper credentials"
    //     });
    // }

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Provide all credentials",
      });
    }

    const isPresent = await isEmailPresent(email);
    if (isPresent?.email) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const result = await signupUser(username, email, password);
    console.log(result);

    return res.status(200).json({
      success: true,
      message: "Signup successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
});
routes.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  //   const { success } = loginSchema.safeParse(req.body);
  //   if (!success) {
  //     res.status(400).json({
  //       success: false,
  //       message: "Improper credentials",
  //     });
  //   }
  const present = await isEmailPresent(email);
  if (present == null) {
    res.status(400).json({
      success: false,
      message: "Email is not present",
    });
  }
  if (present?.password != password) {
    res.status(400).json({
      success: false,
      message: "Wrong password",
    });
  }
  const token = jwt.sign(
    {
      email: present?.email,
      id: present?.id,
    },
    "key"
  );
  res.status(200).json({
    success: true,
    data: `token = ${token}`,
  });
});
routes.get("/posts", async (req: Request, res: Response) => {
  const token = req.headers.authorization;
  try {
    let decode: any = null;
    if (typeof token === "string") {
      decode = jwt.verify(token, "key");
    }
    const posts = await postOnId(decode.id);
    res.status(200).json({
      success: true,
      post: posts,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error,
    });
  }
});
routes.post("/posts", async (req: Request, res: Response) => {
  const token = req.headers.authorization;
  const { title, body } = req.body;

  let actualToken;
  if (token && typeof token === "string" && token.startsWith("Bearer ")) {
    actualToken = token.split(" ")[1]; // Splitting by space and getting the second part, which is the actual token
  }

  try {
    let decode: any = null;
    if (typeof actualToken === "string") {
      decode = jwt.verify(actualToken, "key");
    }

    const posts = await createBlog(decode.id, title, body);
    res.status(200).json({
      success: true,
      post: posts,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error,
    });
  }
});
routes.get("/posts/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const post = await postById(id);
  if (!post) {
    res.status(400).json({
      success: false,
      message: "Post by given is not found",
    });
  }
  res.status(200).json({
    success: true,
    message: post,
  });
});
routes.put("/posts/:id", async (req: Request, res: Response) => {
  const token = req.headers.authorization;
  const id = parseInt(req.params.id, 10);
  const { title, body } = req.body;
  try {
    let decode: any = null;
    if (typeof token === "string") {
      decode = jwt.verify(token, "key");
    }
    const post = await updateBlog(id, body, title);
    if (!post) {
      res.status(400).json({
        success: false,
        message: "Post by given is not found",
      });
    }
    res.status(200).json({
      success: true,
      message: post,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error,
    });
  }
});
routes.delete("/posts/:id", async (req: Request, res: Response) => {
  const token = req.headers.authorization;
  const id = parseInt(req.params.id, 10);
  try {
    let decode: any = null;
    if (typeof token === "string") {
      decode = jwt.verify(token, "key");
    }
    const post = await deleteBlog(id);
    if (!post) {
      res.status(400).json({
        success: false,
        message: "Post by given is not found",
      });
    }
    res.status(200).json({
      success: true,
      message: post,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error,
    });
  }
});
export default routes;
