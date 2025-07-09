import "dotenv/config";
import express from "express";
import medicinesRouter from "./src/routes/medicines.router.js";
import error_404 from "./src/middlewares/status_404.js";

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "API Rest Medicine with Node.js" });
});

app.use(express.json());
app.use("/api/", medicinesRouter);
app.use(error_404);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
