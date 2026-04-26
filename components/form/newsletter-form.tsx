// components/form/newsletter-form.tsx

"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newsletterSchema, type NewsletterFormData } from "@/lib/validations";
import { api, getErrorMessage } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NewsletterFormProps {
  placeholder?: string;
  className?: string;
  layout?: "horizontal" | "vertical";
  onSuccess?: () => void;
}

export function NewsletterForm({
  placeholder = "tu@email.com",
  className,
  layout = "horizontal",
  onSuccess,
}: NewsletterFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = async (data: NewsletterFormData) => {
    setStatus("loading");
    setMessage("");

    try {
      const response = await api.post("/api/newsletter", data);
      const result = response as { success: boolean; message?: string };

      if (result.success) {
        setStatus("success");
        setMessage("¡Gracias por suscribirte!");
        reset();
        onSuccess?.();

        setTimeout(() => {
          setStatus("idle");
          setMessage("");
        }, 5000);
      } else {
        throw new Error(result.message || "Error al suscribirse");
      }
    } catch (error) {
      setStatus("error");
      setMessage(getErrorMessage(error));
    }
  };

  return (
    <div
      className={cn(
        "space-y-3",
        layout === "horizontal" && "flex flex-col sm:flex-row gap-2",
        className
      )}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={cn(
          "flex flex-col gap-2",
          layout === "horizontal" && "flex-row flex-1"
        )}
      >
        <div className="relative flex-1">
          <Input
            {...register("email")}
            type="email"
            placeholder={placeholder}
            leftIcon={<Mail className="h-4 w-4" />}
            error={errors.email?.message}
            disabled={status === "loading" || status === "success"}
            className={cn(
              "pr-10",
              errors.email && "border-destructive"
            )}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={status === "loading"}
          disabled={status === "success" || status === "loading"}
          className={cn(
            layout === "horizontal" && "whitespace-nowrap"
          )}
        >
          {status === "success" ? "¡Suscrito!" : "Suscribirse"}
        </Button>
      </form>

      {/* Messages */}
      {status === "success" && (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <CheckCircle2 className="h-4 w-4" />
          <span>{message}</span>
        </div>
      )}

      {status === "error" && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>{message}</span>
        </div>
      )}
    </div>
  );
}