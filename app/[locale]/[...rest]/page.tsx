import { notFound } from 'next/navigation';

// Cualquier ruta sin página propia responde 404 real (no un 200 con mensaje de error)
export default function CatchAllPage() {
    notFound();
}
