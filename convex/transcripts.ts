import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { OpenAI } from "openai";
import { Innertube } from "youtubei.js/web";

export const getYoutubeTranscript = internalAction({
  args: {
    url: v.string(),
  },
  handler: async (ctx, args) => {
    const videoId = args.url.split("v=")[1];
    const youtube = await Innertube.create({
      lang: "en",
      location: "US",
      retrieve_player: false,
    });
    const info = await youtube.getInfo(videoId);
    const transcript = await info.getTranscript();
    const transcriptText = transcript.transcript.content?.body?.initial_segments
      .map((segment) => segment.snippet.text ?? "")
      .join(" ");

    if (!transcriptText) {
      throw new Error("No transcript found");
    }

    return transcriptText;
  },
});

export const generateSummary = internalAction({
  args: {
    transcript: v.string(),
  },
  handler: async (ctx, args) => {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant who needs to summarize the following transcript from a youtube video.  Please provide a few paragraphs that explain the content of the video and also provide a lot of keywords that I could use to improve SEO.  Please output in Markdown format.",
        },
        {
          role: "user",
          content: `here is my transcript from the youtube video: ${args.transcript}`,
        },
      ],
    });

    if (!response.choices[0].message.content) {
      throw new Error("No response from OpenAI");
    }

    return response.choices[0].message.content;
  },
});
