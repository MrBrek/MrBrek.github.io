import { z } from "zod";

export const roleSchema = z.enum(["user", "assistant", "system"]);

export const chatMessageSchema = z.object({
  role: roleSchema,
  content: z.string().trim().min(1).max(60_000),
});

export const chatRequestSchema = z.object({
  chatId: z.string().cuid(),
  messages: z.array(chatMessageSchema).min(1).max(80),
  model: z.string().min(1).max(120),
});

export const createChatSchema = z.object({
  title: z.string().trim().min(1).max(120).optional(),
});

export const renameChatSchema = z.object({
  title: z.string().trim().min(1).max(120),
});
