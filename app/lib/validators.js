import { z } from "zod";

export const projectSchema = z.object({
    name: z.string().min(1,"Project name is required!").max(25, "Project name must be less than 25 characters"),
    key: z.string().min(2,"Key is required").max(20,"Key must be less than 20 characters"),
    description: z.string().max(500,"Description must be less than or equal to 500 characters.").optional(),
})