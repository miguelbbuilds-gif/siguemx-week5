# SigueMX

Prototipo de Week 5: entrega operativa después de una detección simulada.

> Detección es solo el inicio. Alguien se encarga del siguiente paso.

Este no es un diagnóstico, no es un chequeo de síntomas y no guarda datos reales de pacientes.

## Cómo correrlo

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

```bash
npm test
npm run build
```

## Flujo

Landing → caso simulado → riesgo elevado de diabetes (SIMULADO) → ruta de cuidado → explicación → check-in → recordatorio / escalamiento → verificación pendiente → verificación de coordinadora.

## Commits sugeridos (aún no hechos)

Hazlos tú cuando quieras. El código ya está organizado para estos cortes:

1. Create SigueMX interface and simulated case  
   `src/app/page.tsx`, `src/app/deteccion/page.tsx`, `src/app/layout.tsx`, `src/app/globals.css`
2. Add operational handoff workflow  
   `src/app/ruta/page.tsx`, `src/lib/types.ts`, `src/lib/storage.ts`, `src/components/*`
3. Add structured follow-up check-ins  
   `src/app/seguimiento/page.tsx`, `src/app/explicacion/page.tsx`, `src/app/api/explicacion/route.ts`
4. Add escalation and verified handoff logic  
   `src/lib/case-machine.ts`, `src/app/recordatorio/page.tsx`, `src/app/escalamiento/page.tsx`, `src/app/verificacion/page.tsx`
5. Fix testing/persona issue and finalize demo  
   `src/lib/case-machine.test.ts`, `docs/*`, etiquetas de persona ficticia

## IA

`POST /api/explicacion` usa datos estructurados. Si no hay `OPENAI_API_KEY` en el servidor, responde con un fallback simulado. Copia `.env.example` a `.env.local` solo en tu máquina. Nunca pongas la llave en el cliente.
