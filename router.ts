import { authRouter } from "./auth-router";
import { trendRouter } from "./trend-router";
import { chatRouter } from "./chat-router";
import { aiRouter } from "./ai-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  trend: trendRouter,
  chat: chatRouter,
  ai: aiRouter,
});

export type AppRouter = typeof appRouter;
