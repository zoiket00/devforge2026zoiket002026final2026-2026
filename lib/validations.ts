// lib/validations.ts

import { z } from "zod";

/**
 * Schema para contacto
 */
export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres"),
  email: z
    .string()
    .email("Por favor ingresa un email válido"),
  company: z
    .string()
    .max(100, "La empresa no puede exceder 100 caracteres")
    .optional(),
  service: z
    .string()
    .min(1, "Por favor selecciona un servicio"),
  budget: z
    .string()
    .min(1, "Por favor selecciona un presupuesto"),
  message: z
    .string()
    .min(10, "El mensaje debe tener al menos 10 caracteres")
    .max(5000, "El mensaje no puede exceder 5000 caracteres"),
});

export type ContactFormData = z.infer<typeof contactSchema>;

/**
 * Schema para newsletter
 */
export const newsletterSchema = z.object({
  email: z
    .string()
    .email("Por favor ingresa un email válido"),
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .optional(),
});

export type NewsletterFormData = z.infer<typeof newsletterSchema>;

/**
 * Schema para comentarios de blog
 */
export const commentSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z
    .string()
    .email("Email inválido"),
  content: z
    .string()
    .min(5, "El comentario debe tener al menos 5 caracteres")
    .max(2000, "El comentario no puede exceder 2000 caracteres"),
  website: z
    .string()
    .url("URL inválida")
    .optional()
    .or(z.literal("")),
});

export type CommentFormData = z.infer<typeof commentSchema>;

/**
 * Schema para proyecto
 */
export const projectSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  image: z.string(),
  technologies: z.array(z.string()),
  link: z.string().url().optional(),
  github: z.string().url().optional(),
  featured: z.boolean().default(false),
  status: z.enum(["Live", "In Development", "Archived"]),
  category: z.enum(["Web", "Mobile", "AI", "DevOps"]),
});

export type ProjectData = z.infer<typeof projectSchema>;

/**
 * Schema para servicio
 */
export const serviceSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  price: z.string(),
  timeline: z.string(),
  features: z.array(z.string()),
  technologies: z.array(z.string()),
});

export type ServiceData = z.infer<typeof serviceSchema>;

/**
 * Schema para miembro del equipo
 */
export const teamMemberSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  image: z.string(),
  bio: z.string(),
  skills: z.array(z.string()),
  social: z.object({
    github: z.string().optional(),
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
  }).optional(),
});

export type TeamMemberData = z.infer<typeof teamMemberSchema>;

/**
 * Schema para testimonial
 */
export const testimonialSchema = z.object({
  id: z.string(),
  author: z.string(),
  role: z.string(),
  company: z.string(),
  image: z.string(),
  content: z.string(),
  rating: z.enum(["1", "2", "3", "4", "5"]),
});

export type TestimonialData = z.infer<typeof testimonialSchema>;

/**
 * Schema para blog post
 */
export const blogPostSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  image: z.string(),
  author: z.string(),
  published: z.date(),
  updated: z.date().optional(),
  content: z.string(),
  tags: z.array(z.string()),
  readTime: z.number(),
});

export type BlogPostData = z.infer<typeof blogPostSchema>;

/**
 * Schema para respuesta API genérica
 */
export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

export type ApiResponse<T = any> = z.infer<typeof apiResponseSchema> & {
  data?: T;
};
