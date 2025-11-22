import { z } from 'zod';

// Code must follow [A-Za-z0-9]{6,8} pattern
const codePattern = /^[A-Za-z0-9]{6,8}$/;

export const createLinkSchema = z.object({
  url: z
    .string()
    .min(1, 'URL is required')
    .url('Invalid URL format')
    .refine(
      (url) => {
        try {
          const urlObj = new URL(url);
          return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
        } catch {
          return false;
        }
      },
      { message: 'URL must use http or https protocol' }
    ),
  customCode: z
    .string()
    .regex(codePattern, 'Code must be 6-8 alphanumeric characters [A-Za-z0-9]')
    .optional(),
});

export const updateLinkSchema = z.object({
  url: z
    .string()
    .url('Invalid URL format')
    .refine(
      (url) => {
        try {
          const urlObj = new URL(url);
          return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
        } catch {
          return false;
        }
      },
      { message: 'URL must use http or https protocol' }
    )
    .optional(),
});

export type CreateLinkInput = z.infer<typeof createLinkSchema>;
export type UpdateLinkInput = z.infer<typeof updateLinkSchema>;
