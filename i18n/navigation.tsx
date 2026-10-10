import type { ComponentProps } from 'react';
import { createNavigation } from 'next-intl/navigation';
import { toLogicalPath, toPublicHref } from '@/lib/seo/legacy-paths';
import { routing } from './routing';

const navigation = createNavigation(routing);

// Los componentes de la app enlazan con rutas lógicas (/learning/3/mates, /games...). Los wrappers las
// convierten a la URL pública (/primaria/3-primaria/matematicas, /juegos...) para que ningún enlace
// interno pase por un redirect. Ver lib/seo/legacy-paths.ts.
export function Link({ href, ...props }: ComponentProps<typeof navigation.Link>) {
    return <navigation.Link href={toPublicHref(href)} {...props} />;
}

export const redirect: typeof navigation.redirect = (args, ...rest) =>
    navigation.redirect({ ...args, href: toPublicHref(args.href) }, ...rest);

export const getPathname: typeof navigation.getPathname = (args) => navigation.getPathname({ ...args, href: toPublicHref(args.href) });

// Devuelve la ruta lógica para que las comprobaciones existentes (startsWith('/games')...) sigan valiendo
export function usePathname(): ReturnType<typeof navigation.usePathname> {
    return toLogicalPath(navigation.usePathname());
}

export function useRouter(): ReturnType<typeof navigation.useRouter> {
    const router = navigation.useRouter();
    return {
        ...router,
        push: (href, options) => router.push(toPublicHref(href), options),
        replace: (href, options) => router.replace(toPublicHref(href), options),
        prefetch: (href, options) => router.prefetch(toPublicHref(href), options),
    };
}
