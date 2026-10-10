// JSON-LD renderizado en servidor (va en el HTML inicial, sin depender de JS cliente).

export type JsonLdValue = string | number | boolean | null | JsonLdNode | JsonLdValue[];
// Un nodo es cualquier objeto JSON; los nodos con identidad llevan '@type' y, para referenciarse, '@id'
export interface JsonLdNode {
    [property: string]: JsonLdValue;
}

export default function JsonLd({ data }: { data: JsonLdNode | JsonLdNode[] }) {
    const payload = Array.isArray(data) ? { '@context': 'https://schema.org', '@graph': data } : { '@context': 'https://schema.org', ...data };
    // "<" escapado para que ningún texto pueda cerrar la etiqueta <script>
    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(payload).replace(/</g, '\\u003c') }} />;
}
