import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertMessageSchema = createInsertSchema(contactMessages).pick({
  name: true,
  email: true,
  message: true
});

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof contactMessages.$inferSelect;
