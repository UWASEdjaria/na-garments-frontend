import { z } from 'zod';

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Please enter your full name.')
    .max(120, 'Name must be 120 characters or fewer.'),
  email: z.email('Please enter a valid email address.'),
  phone: z.string().max(40, 'Phone number must be 40 characters or fewer.'),
  subject: z
    .string()
    .trim()
    .min(1, 'Please enter a subject.')
    .max(160, 'Subject must be 160 characters or fewer.'),
  message: z
    .string()
    .trim()
    .min(1, 'Please enter a message.')
    .max(5000, 'Message must be 5000 characters or fewer.'),
});

export type ContactFormValues = z.infer<typeof contactSchema>;