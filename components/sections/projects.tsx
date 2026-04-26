// components/sections/projects.tsx

"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Github, ExternalLink } from "lucide-react";
import { Container, Section } from "@/components/layout/container";
import { cn } from "@/lib/utils";

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  link?: string;
  github?: string;
  featured?: boolean;
  status: "Live" | "In Development" | "Archived";
  category: "Web" | "Mobile" | "AI" | "DevOps";
}

export interface ProjectsProps {
  title?: string;
  description?: string;
  projects: Project[];
  featured?: boolean;
}

export function Projects({
  title = "Nuestro Portafolio",
  description = "Proyectos que demuestran nuestra experiencia",
  projects,
  featured = false,
}: ProjectsProps) {
  const displayProjects = featured
    ? projects.filter((p) => p.featured)
    : projects;

  return (
    <Section>
      <Container>
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="heading-lg">{title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProjects.map((project) => (
            <div
              key={project.id}
              className="group relative overflow-hidden rounded-xl border border-border bg-card hover:border-accent transition-colors duration-200"
            >
              {/* Image */}
              <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-accent/10 to-secondary/10">
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                    [Project Image]
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <Badge
                    variant={
                      project.status === "Live"
                        ? "default"
                        : project.status === "In Development"
                        ? "secondary"
                        : "muted"
                    }
                  >
                    {project.status}
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-display text-lg font-bold">{project.title}</h3>
                    <Badge variant="muted" className="whitespace-nowrap">
                      {project.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                  {project.technologies.length > 3 && (
                    <Badge variant="muted" className="text-xs">
                      +{project.technologies.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Links */}
                <div className="flex gap-2 pt-4 border-t border-border">
                  {project.link && (
                    <Button asChild variant="ghost" size="sm" fullWidth>
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Ver proyecto
                      </a>
                    </Button>
                  )}
                  {project.github && (
                    <Button asChild variant="ghost" size="sm" fullWidth>
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="h-4 w-4" />
                        GitHub
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        {featured && (
          <div className="flex justify-center mt-12">
            <Button asChild size="lg" variant="secondary">
              <Link href="/work">
                Ver todos los proyectos
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </Container>
    </Section>
  );
}