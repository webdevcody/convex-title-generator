// convex/index.ts
import { WorkflowManager } from "@convex-dev/workflow";
import { components } from "./_generated/api";
import OpenAI from "openai";

export const workflow = new WorkflowManager(components.workflow);

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const TITLES_PER_AGENT = 1;
export const MIN_RATING = 9;
export const MAX_REWRITES = 3;
