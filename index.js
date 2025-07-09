import "dotenv/config"
import express from "express";

const app = express();

app.get('/', (req,res)=>{
    res.json({message: "API Rest Medicine with Node.js"})
})

const PORT = process.env.PORT ||3001;

app.listen(PORT,()=> console.log(`Server running on http://localhost:${PORT}`))

