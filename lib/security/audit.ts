// lib/security/audit.ts
// ┌─────────────────────────────────────────────────────────────┐
// │  AUDIT LOGGING - Registro de eventos de seguridad           │
// │  Detecta anomalías · Alerta en tiempo real · Auditable      │
// └─────────────────────────────────────────────────────────────┘

export type SecurityEvent =
  | "AUTH_SUCCESS"
  | "AUTH_FAILURE"
  | "AUTH_LOCKOUT"
  | "RATE_LIMIT_EXCEEDED"
  | "CSRF_FAILED"
  | "BOT_BLOCKED"
  | "IP_BLOCKED"
  | "GEO_BLOCKED"
  | "SQL_INJECTION_ATTEMPT"
  | "XSS_ATTEMPT"
  | "PATH_TRAVERSAL"
  | "UNAUTHORIZED_ACCESS"
  | "DATA_BREACH_ATTEMPT"
  | "CONTACT_FORM_SUBMITTED"
  | "NEWSLETTER_SUBSCRIBED"
  | "SUSPICIOUS_ACTIVITY"
  | "API_KEY_INVALID"
  | "PERMISSION_DENIED";

export interface AuditLog {
  id: string;
  timestamp: string;
  event: SecurityEvent;
  severity: "info" | "warning" | "error" | "critical";
  ip: string;
  userAgent?: string;
  userId?: string;
  path?: string;
  data?: Record<string, unknown>;
}

// Severidad por evento
const EVENT_SEVERITY: Record<SecurityEvent, AuditLog["severity"]> = {
  AUTH_SUCCESS:             "info",
  AUTH_FAILURE:             "warning",
  AUTH_LOCKOUT:             "error",
  RATE_LIMIT_EXCEEDED:      "warning",
  CSRF_FAILED:              "error",
  BOT_BLOCKED:              "warning",
  IP_BLOCKED:               "error",
  GEO_BLOCKED:              "info",
  SQL_INJECTION_ATTEMPT:    "critical",
  XSS_ATTEMPT:              "critical",
  PATH_TRAVERSAL:           "error",
  UNAUTHORIZED_ACCESS:      "error",
  DATA_BREACH_ATTEMPT:      "critical",
  CONTACT_FORM_SUBMITTED:   "info",
  NEWSLETTER_SUBSCRIBED:    "info",
  SUSPICIOUS_ACTIVITY:      "warning",
  API_KEY_INVALID:          "warning",
  PERMISSION_DENIED:        "warning",
};

// Buffer de logs en memoria (en producción: usar DB o servicio externo)
const logBuffer: AuditLog[] = [];
const MAX_BUFFER_SIZE = 10000;

/**
 * Registra un evento de seguridad
 */
export function logSecurityEvent(
  event: SecurityEvent,
  context: {
    ip?: string;
    userAgent?: string;
    userId?: string;
    path?: string;
    data?: Record<string, unknown>;
  } = {}
): AuditLog {
  const log: AuditLog = {
    id:        `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
    event,
    severity:  EVENT_SEVERITY[event],
    ip:        context.ip || "unknown",
    ...context,
  };

  // Buffer circular
  if (logBuffer.length >= MAX_BUFFER_SIZE) {
    logBuffer.shift();
  }
  logBuffer.push(log);

  // Output estructurado para sistemas de log (Datadog, Cloudwatch, etc.)
  const logEntry = JSON.stringify(log);

  if (log.severity === "critical" || log.severity === "error") {
    console.error(`[SECURITY:${log.severity.toUpperCase()}]`, logEntry);
    // En producción: alertar a Slack, PagerDuty, email, etc.
    sendSecurityAlert(log);
  } else if (log.severity === "warning") {
    console.warn(`[SECURITY:WARNING]`, logEntry);
  } else {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[SECURITY:INFO]`, logEntry);
    }
  }

  return log;
}

/**
 * Detecta patrones de ataque en logs recientes
 */
export function detectAnomalies(ip: string, windowMinutes: number = 5): {
  suspicious: boolean;
  score: number;
  reasons: string[];
} {
  const windowMs = windowMinutes * 60 * 1000;
  const since    = Date.now() - windowMs;
  const reasons: string[] = [];
  let score = 0;

  const ipLogs = logBuffer.filter(
    (log) => log.ip === ip && new Date(log.timestamp).getTime() > since
  );

  // Múltiples fallos de autenticación
  const authFailures = ipLogs.filter((l) => l.event === "AUTH_FAILURE").length;
  if (authFailures >= 3) { score += 40; reasons.push(`${authFailures} fallos de auth`); }

  // Rate limit múltiple
  const rateLimits = ipLogs.filter((l) => l.event === "RATE_LIMIT_EXCEEDED").length;
  if (rateLimits >= 2) { score += 30; reasons.push(`${rateLimits} rate limits`); }

  // Intentos de inyección
  const injections = ipLogs.filter(
    (l) => l.event === "SQL_INJECTION_ATTEMPT" || l.event === "XSS_ATTEMPT"
  ).length;
  if (injections >= 1) { score += 60; reasons.push(`${injections} intentos de inyección`); }

  // CSRF fallido
  const csrfFails = ipLogs.filter((l) => l.event === "CSRF_FAILED").length;
  if (csrfFails >= 2) { score += 25; reasons.push(`${csrfFails} fallos CSRF`); }

  return {
    suspicious: score >= 50,
    score:      Math.min(100, score),
    reasons,
  };
}

/**
 * Envía alerta de seguridad crítica
 */
async function sendSecurityAlert(log: AuditLog): Promise<void> {
  // En producción, implementar notificación real:
  // - Slack webhook
  // - Email
  // - PagerDuty
  // - SMS

  if (process.env.SECURITY_WEBHOOK_URL) {
    try {
      await fetch(process.env.SECURITY_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `🚨 *Security Alert*: ${log.event}`,
          attachments: [{
            color: log.severity === "critical" ? "#FF0000" : "#FF6600",
            fields: [
              { title: "Event",    value: log.event,     short: true },
              { title: "Severity", value: log.severity,  short: true },
              { title: "IP",       value: log.ip,        short: true },
              { title: "Time",     value: log.timestamp, short: true },
              { title: "Path",     value: log.path || "-", short: true },
            ],
          }],
        }),
      });
    } catch {
      // Silencioso - no romper el flujo principal
    }
  }
}

/**
 * Obtener logs recientes para dashboard admin
 */
export function getRecentLogs(options: {
  limit?: number;
  severity?: AuditLog["severity"];
  event?: SecurityEvent;
  since?: Date;
} = {}): AuditLog[] {
  let filtered = [...logBuffer];

  if (options.severity) {
    filtered = filtered.filter((l) => l.severity === options.severity);
  }

  if (options.event) {
    filtered = filtered.filter((l) => l.event === options.event);
  }

  if (options.since) {
    filtered = filtered.filter(
      (l) => new Date(l.timestamp) >= options.since!
    );
  }

  return filtered
    .slice(-(options.limit || 100))
    .reverse();
}

/**
 * Estadísticas de seguridad
 */
export function getSecurityStats(windowHours: number = 24) {
  const since = Date.now() - windowHours * 3600 * 1000;
  const recent = logBuffer.filter(
    (l) => new Date(l.timestamp).getTime() > since
  );

  return {
    total:         recent.length,
    critical:      recent.filter((l) => l.severity === "critical").length,
    errors:        recent.filter((l) => l.severity === "error").length,
    warnings:      recent.filter((l) => l.severity === "warning").length,
    blocked:       recent.filter((l) => ["BOT_BLOCKED", "IP_BLOCKED", "GEO_BLOCKED"].includes(l.event)).length,
    injections:    recent.filter((l) => ["SQL_INJECTION_ATTEMPT", "XSS_ATTEMPT"].includes(l.event)).length,
    rateLimits:    recent.filter((l) => l.event === "RATE_LIMIT_EXCEEDED").length,
    authFailures:  recent.filter((l) => l.event === "AUTH_FAILURE").length,
    uniqueIPs:     new Set(recent.map((l) => l.ip)).size,
  };
}
