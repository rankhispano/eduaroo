import Script from 'next/script';

// Analítica sin cookies (Plausible) y solo si se configura NEXT_PUBLIC_PLAUSIBLE_DOMAIN. Sin la variable
// no se carga ningún script de terceros. Es un sitio infantil: nada de píxeles ni identificadores.
// Los eventos se etiquetan con clases (sin JS propio), p. ej. className="plausible-event-name=Resource+click".
// Las vistas de hub se miden como páginas: /primaria/*-primaria y /primaria/*-primaria/{asignatura}.
export default function Analytics() {
    const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
    if (!domain) return null;
    return <Script defer data-domain={domain} src="https://plausible.io/js/script.tagged-events.js" strategy="afterInteractive" />;
}
