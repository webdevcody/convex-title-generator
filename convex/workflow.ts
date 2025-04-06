import { v } from "convex/values";
import { MAX_REWRITES, MIN_RATING, workflow } from ".";
import { internal } from "./_generated/api";
import { mutation } from "./_generated/server";

export const kickoffTitleGenerationWorkflow = mutation({
  args: { url: v.string() },
  handler: async (ctx, args) => {
    const titleGenerationWorkflowId = Math.random()
      .toString(36)
      .substring(2, 15);
    const workflowId: string = await workflow.start(
      ctx,
      internal.workflow.generateTitleWorkflow,
      {
        url: args.url,
        workflowId: titleGenerationWorkflowId,
      }
    );

    return titleGenerationWorkflowId;
  },
});

type ReviewType = {
  originalTitle: string;
  originalSummary: string;
  rating: number;
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  improvementSuggestions: string[];
};

export const generateTitleWorkflow = workflow.define({
  args: { url: v.string(), workflowId: v.string() },
  handler: async (step, args) => {
    const transcript: string = await step.runAction(
      internal.transcripts.getYoutubeTranscript,
      {
        url: args.url,
      }
    );

    const summary: string = await step.runAction(
      internal.transcripts.generateSummary,
      {
        transcript: transcript,
      }
    );

    const titlePool: string[][] = await Promise.all([
      step.runAction(internal.agents.storyTellingAgent, {
        summary: summary,
      }),
      step.runAction(internal.agents.theoAgent, {
        summary: summary,
      }),
      step.runAction(internal.agents.dataAgent, {
        summary: summary,
      }),
      step.runAction(internal.agents.questionAgent, {
        summary: summary,
      }),
      step.runAction(internal.agents.howToAgent, {
        summary: summary,
      }),
      step.runAction(internal.agents.listicleAgent, {
        summary: summary,
      }),
    ]);

    const allTitles = titlePool.flat();

    const reviews = (
      await Promise.all(
        allTitles.map((title) =>
          step.runAction(internal.reviewers.engagementReviewer, {
            title: title,
            summary: summary,
            workflowId: args.workflowId,
          })
        )
      )
    ).filter((review) => review !== undefined) as ReviewType[];

    let rewrites = 0;
    let currentReviews: typeof reviews = [...reviews];

    while (rewrites++ < MAX_REWRITES) {
      const badReviews = currentReviews.filter(
        (review) => review.rating < MIN_RATING
      );

      if (badReviews.length === 0) {
        break;
      }

      const rewrittenTitles = await Promise.all(
        badReviews.map((review) =>
          step.runAction(internal.rewriter.rewriterAgent, review)
        )
      );

      currentReviews = (
        await Promise.all(
          rewrittenTitles.map(({ title }) =>
            step.runAction(internal.reviewers.engagementReviewer, {
              title: title,
              summary: summary,
              workflowId: args.workflowId,
            })
          )
        )
      ).filter((review) => review !== undefined) as ReviewType[];
    }
  },
});
