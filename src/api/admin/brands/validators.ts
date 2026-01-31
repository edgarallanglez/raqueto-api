import { z } from "@medusajs/framework/zod"

export const PostAdminCreateBrand = z.object({
  name: z.string().min(1, "Brand name is required"),
  slug: z.string().optional(),
  description: z.string().optional(),
  logo_url: z.string().optional(),
  website_url: z.string().url().optional().or(z.literal("")),
  order: z.number().int().min(0).optional().default(999),
  is_active: z.boolean().optional().default(true),
  sports: z.array(z.string()).optional(),
  country: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
})

export const PostAdminUpdateBrand = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
  logo_url: z.string().optional(),
  website_url: z.string().url().optional().or(z.literal("")),
  order: z.number().int().min(0).optional(),
  is_active: z.boolean().optional(),
  sports: z.array(z.string()).optional(),
  country: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
})

