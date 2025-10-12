import { z } from "zod";

export const meetingsInsertSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).max(100),
  agentId: z.string().min(1, { message: "Agent ID is  required" }).optional(),
});


export const meetingsUpdateSchema = meetingsInsertSchema.extend({
  id: z.string().min(1, { message: "ID is required" }),
});
