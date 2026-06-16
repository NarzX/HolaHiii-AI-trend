import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  bigint,
  json,
  decimal,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Tabel sesi chat
export const chatSessions = mysqlTable("chat_sessions", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  platform: varchar("platform", { length: 50 }).default("all"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export type ChatSession = typeof chatSessions.$inferSelect;
export type InsertChatSession = typeof chatSessions.$inferInsert;

// Tabel pesan chat
export const chatMessages = mysqlTable("chat_messages", {
  id: serial("id").primaryKey(),
  sessionId: bigint("session_id", { mode: "number", unsigned: true }).references(() => chatSessions.id).notNull(),
  role: varchar("role", { length: 20 }).notNull(), // "user" | "assistant" | "system"
  content: text("content").notNull(),
  metadata: json("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;

// Tabel data trending
export const trendingData = mysqlTable("trending_data", {
  id: serial("id").primaryKey(),
  platform: varchar("platform", { length: 50 }).notNull(),
  category: varchar("category", { length: 100 }),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  url: varchar("url", { length: 500 }),
  thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
  creator: varchar("creator", { length: 255 }),
  views: bigint("views", { mode: "number" }),
  likes: bigint("likes", { mode: "number" }),
  shares: bigint("shares", { mode: "number" }),
  trendScore: decimal("trend_score", { precision: 5, scale: 2 }),
  trendDirection: varchar("trend_direction", { length: 10 }),
  hashtags: json("hashtags").$type<string[]>(),
  publishedAt: timestamp("published_at"),
  fetchedAt: timestamp("fetched_at").defaultNow(),
});

export type TrendingData = typeof trendingData.$inferSelect;
export type InsertTrendingData = typeof trendingData.$inferInsert;

// Tabel preferensi user
export const userPreferences = mysqlTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).references(() => users.id).unique(),
  preferredPlatforms: json("preferred_platforms").$type<string[]>(),
  preferredCategories: json("preferred_categories").$type<string[]>(),
  language: varchar("language", { length: 10 }).default("id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export type UserPreference = typeof userPreferences.$inferSelect;
export type InsertUserPreference = typeof userPreferences.$inferInsert;
