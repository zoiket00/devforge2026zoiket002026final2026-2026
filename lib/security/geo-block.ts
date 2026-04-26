// lib/security/geo-block.ts
interface GeoResult { blocked: boolean; reason?: string; }

// Países bloqueados (ajusta según tu mercado)
const BLOCKED_COUNTRIES: string[] = [
  // Ejemplo: bloquear países de alto riesgo de spam
  // "KP", // Corea del Norte
  // Deja vacío para no bloquear ninguno
];

export function geoBlock(country: string): GeoResult {
  if (!country) return { blocked: false };
  if (BLOCKED_COUNTRIES.includes(country.toUpperCase())) {
    return { blocked: true, reason: `Country ${country} is blocked` };
  }
  return { blocked: false };
}
