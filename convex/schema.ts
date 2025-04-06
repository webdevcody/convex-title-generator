import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  titles: defineTable({
    workflowId: v.string(),
    rating: v.float64(),
    title: v.string(),
  }).index("by_workflow_id", ["workflowId"]),
});
