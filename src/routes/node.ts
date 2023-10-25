import express from "express";

import nodeController from "../controllers/node.controller";

const router = express.Router();

// Create a new node
router.post("/create/root-node", nodeController.createRootNode);
router.post("/create/single-node", nodeController.createNode);
router.get("/get/all-nodes", nodeController.getNodes);
router.delete("/delete/by-id", nodeController.deleteNodeById);

export default router;
