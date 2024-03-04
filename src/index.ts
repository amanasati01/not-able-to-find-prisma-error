import express,{ Request,Response } from "express";
import userRoutes from './routes/userRoutes'
const app = express();

app.use(express.json())
app.use('/api/v1/user',userRoutes)
app.listen(3000,()=>{
    console.log(`app is running at http://localhost:3000`);
}) 