import { v } from "convex/values";
import { MAX_REWRITES, MIN_RATING, workflow } from ".";
import { internal } from "./_generated/api";
import { mutation } from "./_generated/server";
import { z } from "zod";

export const kickoffTitleGenerationWorkflow = mutation({
  args: { url: v.string() },
  handler: async (ctx, args) => {
    await workflow.start(ctx, internal.workflow.generateTitleWorkflow, {
      url: args.url,
    });
  },
});

export const generateTitleWorkflow = workflow.define({
  args: { url: v.string() },
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
    ]);

    const allTitles = titlePool.flat();

    const reviews: {
      originalTitle: string;
      originalSummary: string;
      rating: number;
      feedback: string;
      strengths: string[];
      weaknesses: string[];
      improvementSuggestions: string[];
    }[] = await Promise.all(
      allTitles.map((title) =>
        step.runAction(internal.reviewers.engagementReviewer, {
          title: title,
          summary: summary,
        })
      )
    );

    let rewrites = 0;
    let currentReviews: typeof reviews = [...reviews];

    while (rewrites++ < MAX_REWRITES) {
      await step.runMutation(internal.titles.storeTitles, {
        titles: currentReviews.map((review) => ({
          title: review.originalTitle,
          rating: review.rating,
        })),
      });

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

      currentReviews = await Promise.all(
        rewrittenTitles.map(({ title }) =>
          step.runAction(internal.reviewers.engagementReviewer, {
            title: title,
            summary: summary,
          })
        )
      );

      reviews.push(...currentReviews);
    }

    await step.runMutation(internal.titles.storeTitles, {
      titles: currentReviews.map((review) => ({
        title: review.originalTitle,
        rating: review.rating,
      })),
    });
  },
});
