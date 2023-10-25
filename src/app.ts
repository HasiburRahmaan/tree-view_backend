import express, { Application } from "express";
import cors from "cors";

import NodeRouter from "./routes/node";

const app: Application = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  return res.send("project overview");
});
app.use("/api/nodes", NodeRouter);

export default app;
