import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { openai } from ".";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

export const engagementReviewer = internalAction({
  args: { title: v.string(), summary: v.string() },
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

    const response = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You will analyze one YouTube title and provide a comprehensive review based on engagement and appeal factors. Please evaluate the title using the following criteria:

1. Engagement & Appeal (Score out of 10)
   - Emotional Impact: Does it evoke curiosity, excitement, or other emotions?
   - Curiosity Gap: Does it create intrigue without being clickbait?
   - Click Appeal: Would viewers want to click on this?
   - Value Proposition: Does it clearly communicate video content value?

2. Strengths Analysis
   - List key positive elements of the title
   - Highlight what works well for audience engagement
   - Note any effective SEO elements

3. Weaknesses Analysis
   - Identify areas needing improvement
   - Point out potential engagement barriers
   - Flag any SEO or clarity issues

4. Improvement Suggestions
   - Provide specific, actionable recommendations
   - Suggest alternative phrasings if applicable
   - Include SEO optimization tips
  
5. Title Length
  - the best title are usually 6-8 words in length
  - more emotinally powerful titles can be shorter
  - do not make very long titles over 8 words if possible

Please provide your review in a structured format with a numerical rating (1-10), followed by detailed feedback including strengths, weaknesses, and specific improvement suggestions. Please make sure the title is related to the summary`,
        },
        {
          role: "user",
          content: `Original Video Summary: ${args.summary}\n\nTitle: ${args.title}`,
        },
      ],
      response_format: zodResponseFormat(AgentSchema, "agent"),
    });

    if (!response.choices[0].message.parsed) {
      throw new Error("No response from OpenAI");
    }

    return response.choices[0].message.parsed;
  },
});
