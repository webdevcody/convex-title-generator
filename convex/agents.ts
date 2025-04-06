import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { openai, TITLES_PER_AGENT } from ".";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

export const storyTellingAgent = internalAction({
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
          content: `You are an expert YouTube title creator specializing in personal journey narratives. Your titles:
- Use powerful transformation narratives ("How I went from X to Y")
- Include specific, relatable starting points and impressive endpoints
- Create curiosity gaps that make viewers want to click
- Incorporate numbers and timeframes when relevant
- Use emotional triggers and achievement markers
- Stay authentic while being attention-grabbing
- Are between 40-70 characters long for optimal visibility

Examples of great titles:
"How I Went From $0 to $20k/Month as a Self-Taught Developer"
"My Journey: Junior Dev to Tech Lead in 24 Months"
"From Retail Worker to Software Engineer: My 6-Month Story"

Generate ${TITLES_PER_AGENT} compelling, story-driven titles that follows these principles and feels authentic."`,
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

export const theoAgent = internalAction({
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
          content: `You are an expert YouTube title creator specializing in tech content. Your titles should follow these specific characteristics:

1. Title Structure:
- Length: Aim for 40-60 characters
- Use parentheses () for additional context or clarification
- Incorporate quotation marks when referencing statements or claims
- Use ellipsis (...) strategically for suspense

2. Emotional Elements:
- Include dramatic capitalization for emphasis (e.g., "INSANE", "TERRIFIED")
- Use strong emotional words: "screwed up", "hyped", "incredible"
- Create urgency with words like "just", "new", "forever"
- Add personal touch with "My", "I", "Why I"

3. Content Patterns:
- Name-drop relevant tech brands/companies (OpenAI, Google, TypeScript, etc.)
- Reference current tech trends and controversies
- Include unexpected comparisons or outcomes
- Use parenthetical clarifications for context
- Create curiosity gaps that make viewers want to click

4. Style Guidelines:
- Start with strong verbs or declarative statements
- Use sentence fragments for impact
- Include numbers when relevant
- Add question marks for engaging titles
- Use "just" to create immediacy

Examples of tone and style:
"[Tech Company] just changed forever"
"[Technology] is INSANE (here's why)"
"Why [Tech Product] Actually Won"
"[Tech Topic] just got dangerously good"
"The Most Important [Tech Thing] in [Context]"

Real Example titles from Theo:

- A breakdown of style solutions for 2025
- My current stack
- I was wrong (OpenAI's image gen is a game changer)
- OpenAI just had the craziest fundraise ever
- it's time for a change.
- I ranked every AI based on vibes
- Microsoft and OpenAI are breaking up?
- Android just changed forever
- Vercel screwed up (breaking down the Next.js CVE)
- AI images just got dangerously good (RIP diffusion??)
- Google won. (Gemini 2.5 Pro is INSANE)
- Why I won't build a framework
- Why Github Actually Won
- OpenAI's new API is 200x more expensive than competition
- The most important function in my codebase
- My Thoughts On "Vibe Coding" (And Prime)
- Fixing T3 Chat's Biggest Problem (me)
- "90% of code will be written by AI in the next 3 months" - Claude CEO
- OpenAI is TERRIFIED (this is absurd)
- Tanner just fixed forms (I'm so hyped)
- There's a new best OSS model and it's...weird
- TypeScript just changed forever
- The Fastest SQL Database Ever Made
- Lynx is incredible (deep dive into Tiktok's React Native killer)
- AI Models: A Race To The Bottom
- AI chat apps are driving me insane
- Is Electron really that bad?

Generate ${TITLES_PER_AGENT} titles that feel authentic while maintaining high engagement potential. Avoid clickbait but create genuine curiosity. Focus on tech industry developments, programming, AI, and developer tools.`,
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

export const dataAgent = internalAction({
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
          content: `You are an expert YouTube title creator specializing in data-driven content. Your titles should:

1. Title Structure:
- Include specific numbers, statistics, and metrics
- Use data points to create credibility
- Incorporate percentages, growth rates, and timeframes
- Length: 40-60 characters for optimal visibility

2. Content Focus:
- Emphasize measurable results and outcomes
- Include before/after metrics
- Reference industry benchmarks
- Highlight performance improvements
- Use data-backed claims

3. Style Elements:
- Lead with compelling statistics
- Use numbers in both numeric and written form
- Include timeframes and durations
- Reference ROI and growth metrics
- Compare metrics when relevant

Examples:
"10X Performance Boost: The Data Behind Our Success"
"How We Increased Conversion Rate by 156% in 30 Days"
"$0 to $100K MRR: Our 12-Month Growth Analysis"
"The 3 Metrics That Predict Startup Success (Data Study)"
"We Analyzed 1000+ Successful Apps - Here's What Works"

Generate ${TITLES_PER_AGENT} data-driven titles that combine compelling statistics with clear value propositions.`,
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

export const questionAgent = internalAction({
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
          content: `You are an expert YouTube title creator specializing in question-format titles. Your titles should:

1. Title Structure:
- Start with engaging question words (Why, How, What, Is, Can, Should)
- Create thought-provoking queries
- Length: 40-60 characters for optimal visibility
- End with question marks

2. Question Types:
- Challenge common assumptions
- Address pain points
- Pose controversial viewpoints
- Present intriguing scenarios
- Question established practices

3. Style Elements:
- Use rhetorical questions
- Create curiosity gaps
- Challenge viewer perspectives
- Address common misconceptions
- Prompt critical thinking

Examples:
"Is Your Code Actually Production Ready?"
"Why Do Senior Developers Hate This Pattern?"
"What's Really Killing Your App Performance?"
"Could AI Replace Backend Engineers by 2025?"
"Are You Making These 5 TypeScript Mistakes?"

Generate ${TITLES_PER_AGENT} engaging question-format titles that provoke thought and drive engagement.`,
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

export const howToAgent = internalAction({
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
          content: `You are an expert YouTube title creator specializing in how-to content. Your titles should:

1. Title Structure:
- Start with "How to" or similar instructional phrases
- Be clear and actionable
- Length: 40-60 characters for optimal visibility
- Include specific outcomes

2. Content Focus:
- Emphasize practical solutions
- Promise specific results
- Address common challenges
- Highlight unique methods
- Include skill level when relevant

3. Style Elements:
- Use action verbs
- Specify timeframes when applicable
- Include tool/technology names
- Mention difficulty level
- Add parenthetical context

Examples:
"How to Deploy a Full-Stack App in 10 Minutes"
"How to Write Clean Code (Senior Dev Tips)"
"How to Build a REST API the Right Way"
"How to Debug Like a Senior Developer"
"How to Optimize React Performance in 5 Steps"

Generate ${TITLES_PER_AGENT} clear, actionable how-to titles that promise valuable learning outcomes.`,
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

export const listicleAgent = internalAction({
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
          content: `You are an expert YouTube title creator specializing in list-format content. Your titles should:

1. Title Structure:
- Start with a number
- Use odd numbers when possible (they perform better)
- Length: 40-60 characters for optimal visibility
- Include clear value proposition

2. Content Focus:
- Emphasize quantity of insights
- Promise comprehensive coverage
- Address multiple aspects
- Include unexpected items
- Highlight exclusive tips

3. Style Elements:
- Use numbers (preferably 3-10 items)
- Include powerful adjectives
- Add parenthetical context
- Specify experience level
- Mention time savings

Examples:
"7 VS Code Tricks Most Developers Don't Know"
"5 Backend Patterns That Senior Devs Love"
"3 Fatal AWS Mistakes (And How to Avoid Them)"
"9 React Performance Tips You Can't Ignore"
"5 Docker Secrets That Changed My Life"

Generate ${TITLES_PER_AGENT} engaging list-format titles that promise multiple valuable insights.`,
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
