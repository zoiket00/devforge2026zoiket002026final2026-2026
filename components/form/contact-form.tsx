// components/form/contact-form.tsx

"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactFormData } from "@/lib/validations";
import { api, getErrorMessage } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export interface ContactFormProps {
  onSuccess?: () => void;
  services?: Array<{ value: string; label: string }>;
}

export function ContactForm({ onSuccess, services }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Enviar a API
      const response = await api.post("/api/contact", data);
      const result = response as { success: boolean; message?: string };

      if (result.success) {
        setSuccessMessage("¡Mensaje enviado exitosamente! Te responderemos en breve.");
        reset();
        onSuccess?.();

        // Redirigir a WhatsApp como fallback
        const message = `Hola, acabo de enviar un formulario desde el sitio. Mi mensaje fue: ${data.message}`;
        const whatsappUrl = `https://wa.me/573001234567?text=${encodeURIComponent(message)}`;
        setTimeout(() => {
          window.open(whatsappUrl, "_blank");
        }, 2000);
      } else {
      throw new Error(result.message || "Error al enviar el formulario");
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const serviceOptions = services || [
    { value: "web-app", label: "Aplicación Web" },
    { value: "mobile-app", label: "App Móvil" },
    { value: "api", label: "API / Backend" },
    { value: "landing", label: "Landing Page" },
    { value: "devops", label: "DevOps / Cloud" },
    { value: "ai", label: "IA / Automatización" },
    { value: "consulting", label: "Consultoría" },
    { value: "maintenance", label: "Mantenimiento" },
  ];

  const budgetOptions = [
    { value: "under-2k", label: "Menos de $2,000" },
    { value: "2k-5k", label: "$2,000 - $5,000" },
    { value: "5k-15k", label: "$5,000 - $15,000" },
    { value: "15k-50k", label: "$15,000 - $50,000" },
    { value: "over-50k", label: "Más de $50,000" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto">
      {/* Success Alert */}
      {successMessage && (
        <Alert variant="success">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {/* Name & Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          {...register("name")}
          label="Nombre"
          placeholder="Juan Pérez"
          error={errors.name?.message}
          disabled={isSubmitting}
        />
        <Input
          {...register("email")}
          type="email"
          label="Email"
          placeholder="juan@empresa.com"
          error={errors.email?.message}
          disabled={isSubmitting}
        />
      </div>

      {/* Company & Service */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          {...register("company")}
          label="Empresa (Opcional)"
          placeholder="Mi Empresa"
          error={errors.company?.message}
          disabled={isSubmitting}
        />
        <Select
          {...register("service")}
          label="Servicio de Interés"
          options={serviceOptions}
          error={errors.service?.message}
          disabled={isSubmitting}
        />
      </div>

      {/* Budget */}
      <Select
        {...register("budget")}
        label="Presupuesto"
        options={budgetOptions}
        error={errors.budget?.message}
        disabled={isSubmitting}
      />

      {/* Message */}
      <Textarea
        {...register("message")}
        label="Tu Mensaje"
        placeholder="Cuéntanos sobre tu proyecto, objetivos y plazos..."
        rows={6}
        error={errors.message?.message}
        disabled={isSubmitting}
      />

      {/* Submit */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={isSubmitting}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
      </Button>

      {/* Privacy Notice */}
      <p className="text-xs text-muted-foreground text-center">
        Al enviar este formulario aceptas nuestra{" "}
        <a href="#" className="text-accent hover:underline">
          política de privacidad
        </a>
        . Nos comprometemos a proteger tus datos.
      </p>
    </form>
  );
}