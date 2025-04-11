import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { openai } from ".";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import {
  storyTellingPrompt,
  theoPrompt,
  dataPrompt,
  questionPrompt,
  howToPrompt,
  listiclePrompt,
} from "./prompts";

const createTitleAgent = (prompt: string) => {
  return internalAction({
    args: { summary: v.string() },
    handler: async (ctx, args) => {
      const AgentSchema = z.object({
        titles: z.array(z.string()),
      });

      const response = await openai.beta.chat.completions.parse({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: prompt,
          },
          { role: "user", content: args.summary },
        ],
        response_format: zodResponseFormat(AgentSchema, "agent"),
      });

      if (!response.choices[0].message.parsed) {
        throw new Error("No response from OpenAI");
      }

      return response.choices[0].message.parsed.titles;
    },
  });
};

export const storyTellingAgent = createTitleAgent(storyTellingPrompt);
export const theoAgent = createTitleAgent(theoPrompt);
export const dataAgent = createTitleAgent(dataPrompt);
export const questionAgent = createTitleAgent(questionPrompt);
export const howToAgent = createTitleAgent(howToPrompt);
export const listicleAgent = createTitleAgent(listiclePrompt);
