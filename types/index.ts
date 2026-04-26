// types/index.ts

export type NavItem = {
  title: string;
  href: string;
  description?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: string;
};

export type MainNavItem = NavItem & {
  items?: NavItem[];
};

export type SidebarNavItem = NavItem & {
  items: NavItem[];
  icon?: string;
};

export type Service = {
  id: string;
  title: string;
  description: string;
  icon: string;
  price: string;
  timeline: string;
  features: string[];
  technologies: string[];
};

export type Project = {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  link?: string;
  github?: string;
  featured: boolean;
  status: "Live" | "In Development" | "Archived";
  category: "Web" | "Mobile" | "AI" | "DevOps";
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  skills: string[];
  social: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
};

export type Testimonial = {
  id: string;
  author: string;
  role: string;
  company: string;
  image: string;
  content: string;
  rating: 1 | 2 | 3 | 4 | 5;
};

export type Technology = {
  category: string;
  items: {
    name: string;
    icon: string;
    description?: string;
  }[];
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  author: string;
  published: Date;
  updated?: Date;
  content: string;
  tags: string[];
  readTime: number;
};

export type ContactFormData = {
  name: string;
  email: string;
  company?: string;
  service: string;
  budget: string;
  message: string;
};

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export type PaginatedResponse<T> = ApiResponse<{
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}>;
