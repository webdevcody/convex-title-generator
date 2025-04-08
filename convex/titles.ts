import { v } from "convex/values";
import { internalMutation, query, mutation } from "./_generated/server";

export const storeTitles = internalMutation({
  args: v.object({
    workflowId: v.string(),
    titles: v.array(
      v.object({
        title: v.string(),
        rating: v.number(),
      })
    ),
  }),
  handler: async (ctx, args) => {
    await Promise.all(
      args.titles.map((title) =>
        ctx.db.insert("titles", {
          workflowId: args.workflowId,
          title: title.title,
          rating: title.rating,
        })
      )
    );
  },
});

export const getTitles = query({
  args: v.object({
    workflowId: v.string(),
  }),
  handler: async (ctx, args) => {
    const titles = await ctx.db
      .query("titles")
      .withIndex("by_workflow_id", (q) => q.eq("workflowId", args.workflowId))
      .collect();
    return titles;
  },
});

export const incrementScore = mutation({
  args: {
    titleId: v.string(),
    workflowId: v.string(),
  },
  handler: async (ctx, args) => {
    // TODO: Implement score increment in your titles table
    // For now, just log that we would increment the score
    console.log(
      `Incrementing score for title ${args.titleId} in workflow ${args.workflowId}`
    );
    return null;
  },
});
