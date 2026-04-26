// components/sections/team.tsx

"use client";

import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Github, Linkedin, Twitter } from "lucide-react";
import { Container, Section } from "@/components/layout/container";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  skills: string[];
  social?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}

export interface TeamProps {
  title?: string;
  description?: string;
  members: TeamMember[];
}

export function Team({
  title = "Nuestro Equipo",
  description = "Desarrolladores apasionados con expertise 2026",
  members,
}: TeamProps) {
  return (
    <Section>
      <Container>
        <div className="text-center mb-16 space-y-4">
          <h2 className="heading-lg">{title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.map((member) => (
            <div
              key={member.id}
              className="group relative overflow-hidden rounded-xl border border-border bg-card hover:border-accent transition-colors duration-200"
            >
              <div className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-accent/10 to-secondary/10">
                {member.image ? (
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                    [Team Photo]
                  </div>
                )}
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <h3 className="font-display text-xl font-bold">{member.name}</h3>
                  <p className="font-mono text-sm text-accent font-semibold">
                    {member.role}
                  </p>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {member.bio}
                </p>

                <div className="space-y-2">
                  <p className="font-mono text-xs font-bold uppercase text-muted-foreground">
                    Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {member.skills.slice(0, 4).map((skill) => (
                      <Badge key={skill} variant="muted" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {member.skills.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{member.skills.length - 4}
                      </Badge>
                    )}
                  </div>
                </div>

                {member.social && (
                  <div className="flex gap-2 pt-4 border-t border-border">
                    {member.social.github && (
                      <a
                        href={member.social.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-8 w-8 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-accent hover:border-accent transition-colors"
                        aria-label="GitHub"
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                    {member.social.linkedin && (
                      <a
                        href={member.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-8 w-8 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-accent hover:border-accent transition-colors"
                        aria-label="LinkedIn"
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                    {member.social.twitter && (
                      <a
                        href={member.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-8 w-8 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-accent hover:border-accent transition-colors"
                        aria-label="Twitter"
                      >
                        <Twitter className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}