import { z } from 'zod';

// Lead capture form validation
export const leadCaptureSchema = z.object({
  name: z.string()
    .trim()
    .max(100, { message: "Le nom doit faire moins de 100 caractères" })
    .optional(),
  email: z.string()
    .trim()
    .email({ message: "Email invalide" })
    .max(255, { message: "L'email doit faire moins de 255 caractères" }),
  phone: z.string()
    .trim()
    .max(20, { message: "Le téléphone doit faire moins de 20 caractères" })
    .optional(),
});

// Funnel configuration validation
export const funnelConfigSchema = z.object({
  name: z.string()
    .trim()
    .min(1, { message: "Le nom est requis" })
    .max(200, { message: "Le nom doit faire moins de 200 caractères" }),
  description: z.string()
    .trim()
    .max(1000, { message: "La description doit faire moins de 1000 caractères" })
    .optional(),
});

// Profile update validation
export const profileUpdateSchema = z.object({
  full_name: z.string()
    .trim()
    .max(100, { message: "Le nom doit faire moins de 100 caractères" })
    .optional(),
  company_name: z.string()
    .trim()
    .max(100, { message: "Le nom de l'entreprise doit faire moins de 100 caractères" })
    .optional(),
  phone: z.string()
    .trim()
    .max(20, { message: "Le téléphone doit faire moins de 20 caractères" })
    .optional(),
  website: z.string()
    .trim()
    .url({ message: "URL de site web invalide" })
    .max(255, { message: "L'URL doit faire moins de 255 caractères" })
    .optional()
    .or(z.literal('')),
});

export type LeadCaptureFormData = z.infer<typeof leadCaptureSchema>;
export type FunnelConfigFormData = z.infer<typeof funnelConfigSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
