import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { openai } from ".";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import { internal } from "./_generated/api";

export const engagementReviewer = internalAction({
  args: { title: v.string(), summary: v.string(), workflowId: v.string() },
  handler: async (ctx, args) => {
    const AgentSchema = z.object({
      originalTitle: z.string(),
      originalSummary: z.string(),
      rating: z.number(),
      feedback: z.string(),
      strengths: z.array(z.string()),
      weaknesses: z.array(z.string()),
      improvementSuggestions: z.array(z.string()),
    });

    const response = await openai.beta.chat.completions
      .parse({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You will analyze one YouTube title and provide a comprehensive review based on engagement and appeal factors. Please evaluate the title using the following criteria:

1. Emotional Impact & Curiosity Gap (3 points)
   - Emotional Impact: Does it evoke curiosity, excitement, or other emotions?
   - Curiosity Gap: Does it create intrigue without being clickbait?
   - Click Appeal: Would viewers want to click on this?
   - Value Proposition: Does it clearly communicate video content value?

2. Keyword Relevance (2 points)
   - is the title related to the summary?
   - does the title contain the main keyword?

3. Power Words (2 points)
   - List key power words used in the title
   - Highlight what works well for audience engagement
   - Note any effective SEO elements

4. SEO Optimization (2 points)
   - List key SEO elements used in the title
   - Highlight what works well for audience engagement
   - Note any effective SEO elements
  
5. Title Length (2 points)
  - the best title are usually 6-8 words in length
  - more emotinally powerful titles can be shorter
  - do not make very long titles over 8 words if possible
  - do not use Noun Phrases or Headline type of titles, subtract a point if you use one


Please provide your numerical rating (1-11) for the title, followed by detailed feedback including strengths, weaknesses, and specific improvement suggestions. Please make sure the title is related to the summary`,
          },
          {
            role: "user",
            content: `Original Video Summary: ${args.summary}\n\nTitle: ${args.title}`,
          },
        ],
        response_format: zodResponseFormat(AgentSchema, "agent"),
      })
      .catch((err) => {
        console.error(err);
      });

    const parsed = response?.choices[0].message.parsed ?? undefined;

    if (parsed) {
      await ctx.runMutation(internal.titles.storeTitles, {
        workflowId: args.workflowId,
        titles: [
          {
            title: parsed.originalTitle,
            rating: parsed.rating,
          },
        ],
      });
    }

    return parsed;
  },
});
