import express, { Request, Response } from "express";
import Node from "../models/node.model";
import { INode } from "../models/node.model";
import mongoose from "mongoose";

class NodeController {
  async createRootNode(req: Request, res: Response) {
    try {
      const rootNode = await Node.findOne({ type: "root" });

      if (rootNode) {
        return res.status(400).json({ error: "Root node already exists" });
      }

      let { name } = req.body;
      let node = new Node({ name: name || "Root", type: "root" });
      await node.save();

      return res.status(201).json({
        message: "Node created successfully",
        item: node,
        status: "success",
      });
    } catch (error) {
      console.log({ error });
      return res
        .status(500)
        .json({ error: "Error creating node", stack: error });
    }
  }
  async createNode(req: Request, res: Response) {
    try {
      let { name, parentId } = req.body;

      if (!parentId || !name) {
        return res
          .status(400)
          .json({ error: "Both parentId and name are required." });
      }

      if (!isValidObjectId(parentId)) {
        return res
          .status(400)
          .json({ error: "parentId must be a valid ObjectId." });
      }

      let parentNode = await Node.findById(parentId);

      if (!parentNode) {
        return res.status(400).json({ error: "Parent node not found" });
      }

      let node = new Node({ parentId, name, type: "node" });
      await node.save();

      return res.status(201).json({
        message: "Node created successfully",
        item: node,
        status: "success",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Error creating node", stack: error });
    }
  }
  async getNodes(req: Request, res: Response) {
    try {
      const nodes = await Node.find({});

      return res.status(200).json({
        item: nodes,
        status: "success",
      });
    } catch (error) {
      return res.status(500).json({ error: "Error getting nodes" });
    }
  }
  async deleteNodeById(req: Request, res: Response) {
    try {
      const { id } = req.query;

      if (!isValidObjectId(id)) {
        return res.status(400).json({ error: "id is required" });
      }

      const node = await Node.findById(id);

      if (!node || node.type === "root") {
        return res.status(400).json({ error: "Node not found" });
      }

      let nodes = await Node.find({});
      let subNodes = tree(nodes, node._id.toString());

      await Node.deleteMany({ _id: { $in: [...subNodes, id] } });

      return res.status(200).json({
        message: `Node deleted successfully ${
          subNodes.length && "with all sub nodes"
        }`,
        item: [...subNodes, id],
        status: "success",
      });
    } catch (error) {
      return res.status(500).json({ error: "Error deleting node" });
    }
  }
}

const nodeController = new NodeController();

export default nodeController;

let tree = (
  nodes: INode[] = [],
  parentId: String = "",
  childrens: String[] = []
): String[] => {
  let result: String[] = childrens;
  let chilrens = nodes.filter((node: any) => node?.parentId == parentId);
  for (let i = 0; i < chilrens.length; i++) {
    let node: INode = chilrens[i];
    result.push(node._id.toString());
    tree(nodes, node._id.toString(), result);
  }
  return result;
};

let isValidObjectId = (id: any): Boolean => {
  if (id == undefined || !mongoose.Types.ObjectId.isValid(id.toString())) {
    return false;
  }
  return true;
};
