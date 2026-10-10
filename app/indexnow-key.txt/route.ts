// Fichero de verificación de IndexNow (keyLocation). La clave vive en la variable de entorno INDEXNOW_KEY.
export const dynamic = 'force-dynamic';

export function GET() {
    const key = process.env.INDEXNOW_KEY;
    if (!key) return new Response('Not found', { status: 404 });
    return new Response(key, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
}
