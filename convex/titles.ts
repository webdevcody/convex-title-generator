import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const storeTitles = internalMutation({
  args: v.object({
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
          title: title.title,
          rating: title.rating,
        })
      )
    );
  },
});
