// lib/security/bot-detection.ts
// ┌─────────────────────────────────────────────────────────────┐
// │  BOT DETECTION - Fingerprinting de User-Agents              │
// │  Distingue crawlers legítimos de scrapers y ataques         │
// └─────────────────────────────────────────────────────────────┘

interface BotResult {
  isBot: boolean;
  isMalicious: boolean;
  isLegitimateBot: boolean;
  botName?: string;
  confidence: number; // 0 - 100
}

/** Bots legítimos permitidos (SEO, monitoreo, etc.) */
const LEGITIMATE_BOTS = [
  { name: "Googlebot", pattern: /googlebot/i },
  { name: "Google-InspectionTool", pattern: /google-inspectiontool/i },
  { name: "Bingbot", pattern: /bingbot/i },
  { name: "DuckDuckBot", pattern: /duckduckbot/i },
  { name: "Slurp", pattern: /slurp/i },
  { name: "Baiduspider", pattern: /baiduspider/i },
  { name: "YandexBot", pattern: /yandexbot/i },
  { name: "Applebot", pattern: /applebot/i },
  { name: "Twitterbot", pattern: /twitterbot/i },
  { name: "LinkedInBot", pattern: /linkedinbot/i },
  { name: "facebookexternalhit", pattern: /facebookexternalhit/i },
  { name: "WhatsApp", pattern: /whatsapp/i },
  { name: "Discordbot", pattern: /discordbot/i },
  { name: "Slackbot", pattern: /slackbot/i },
  { name: "UptimeRobot", pattern: /uptimerobot/i },
  { name: "Datadog", pattern: /datadog/i },
  { name: "PingdomBot", pattern: /pingdom/i },
  { name: "GTmetrix", pattern: /gtmetrix/i },
  { name: "PageSpeed", pattern: /pagespeed/i },
  { name: "Lighthouse", pattern: /chrome-lighthouse/i },
];

/** Patrones de bots maliciosos */
const MALICIOUS_BOT_PATTERNS = [
  /scrapy/i,
  /python-requests/i,
  /java\/\d/i,
  /go-http-client/i,
  /libwww-perl/i,
  /curl\/\d/i,
  /wget/i,
  /nikto/i,             // Escáner de vulnerabilidades
  /nmap/i,              // Port scanner
  /masscan/i,           // Mass IP scanner
  /sqlmap/i,            // SQL injection tool
  /havij/i,             // SQL injection tool
  /dirbuster/i,         // Directory brute-forcer
  /gobuster/i,          // Directory/file brute-forcer
  /nuclei/i,            // Vulnerability scanner
  /zgrab/i,
  /nessus/i,            // Vulnerability scanner
  /zgrab2/i,
  /webshag/i,
  /arachni/i,           // Web scanner
  /acunetix/i,          // Web vulnerability scanner
  /openvas/i,
  /vega/i,
  /w3af/i,              // Web scanner
  /skipfish/i,
  /burpsuite/i,
  /httprint/i,
  /metasploit/i,
  /netsparker/i,
  /appscan/i,
  /webinspect/i,
  /paros/i,
];

/**
 * Detecta si el User-Agent es un bot y si es malicioso
 */
export function detectBot(userAgent: string): BotResult {
  if (!userAgent || userAgent.trim() === "") {
    return {
      isBot: true,
      isMalicious: true,
      isLegitimateBot: false,
      botName: "Empty User-Agent",
      confidence: 95,
    };
  }

  // Verificar bots legítimos
  for (const bot of LEGITIMATE_BOTS) {
    if (bot.pattern.test(userAgent)) {
      return {
        isBot: true,
        isMalicious: false,
        isLegitimateBot: true,
        botName: bot.name,
        confidence: 90,
      };
    }
  }

  // Verificar bots maliciosos
  for (const pattern of MALICIOUS_BOT_PATTERNS) {
    if (pattern.test(userAgent)) {
      return {
        isBot: true,
        isMalicious: true,
        isLegitimateBot: false,
        botName: pattern.source,
        confidence: 95,
      };
    }
  }

  // Análisis heurístico
  const score = calculateBotScore(userAgent);
  const isBot = score > 60;
  const isMalicious = score > 80;

  return {
    isBot,
    isMalicious,
    isLegitimateBot: false,
    confidence: score,
  };
}

/**
 * Scoring heurístico (0=humano, 100=bot seguro)
 */
function calculateBotScore(ua: string): number {
  let score = 0;

  // Sin versión de navegador reconocible
  if (!/chrome|firefox|safari|edge|opera/i.test(ua)) score += 30;

  // Muy corto
  if (ua.length < 30) score += 25;

  // Patrones de scripts
  if (/requests|urllib|axios|node-fetch|superagent|got/i.test(ua)) score += 40;

  // Headers típicos de automatización
  if (/headless/i.test(ua)) score += 50;
  if (/phantom/i.test(ua)) score += 50;

  // UA que termina en versión simple
  if (/\/\d+\.\d+$/.test(ua)) score += 20;

  return Math.min(100, score);
}
