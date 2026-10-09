// Textos de "Sobre Eduaroo" y "Contacto". Solo afirmaciones comprobables en el repositorio
// (datos del pie de página, catálogo, currículo oficial). Nada de credenciales inventadas.
import { catalog } from './catalog';
import { contactEmail, legalName, type SiteLocale } from './site';

export function aboutContent(locale: SiteLocale) {
    const topics = catalog.reduce((sum, c) => sum + c.publishedCount, 0);
    const activities = catalog.reduce((sum, c) => sum + c.activityCount, 0);

    if (locale === 'en') {
        return {
            h1: 'About Eduaroo: primary school revision for families and teachers',
            lead: 'Eduaroo is a website with revision exercises for Spanish Primary Education, from year 1 to year 6, aligned with the LOMLOE curriculum.',
            sections: [
                {
                    heading: 'Who is behind Eduaroo',
                    paragraphs: [`Eduaroo is a project by ${legalName}, a company based in Murcia, Spain. You can reach us at ${contactEmail}.`],
                },
                {
                    heading: 'What you will find here',
                    paragraphs: [
                        `${topics} topics with ${activities} activities in Spanish Language, Mathematics, Natural Sciences, Social Sciences and English, organised by year and subject, plus a collection of educational games. Everything can be used without creating an account.`,
                    ],
                },
                {
                    heading: 'Teaching approach and the LOMLOE',
                    paragraphs: [
                        'Activities are grouped by year, subject and topic, and each topic states which evaluation criteria of the LOMLOE curriculum (Real Decreto 157/2022) it works on. Natural Sciences and Social Sciences are kept apart, even though the official curriculum groups them in one area, to keep revision paths clear.',
                        'Activity sets are produced with the help of artificial intelligence tools from those official criteria. If you find a mistake or something that could be improved, please tell us.',
                    ],
                },
                {
                    heading: 'Privacy and children',
                    paragraphs: ['You do not need an account or personal details to practise. Progress is saved in the browser of the device being used.'],
                },
            ],
            contactLink: 'Contact us',
        };
    }
    return {
        h1: 'Sobre Eduaroo: repaso de Primaria para familias y docentes',
        lead: 'Eduaroo es una web con ejercicios de repaso de Educación Primaria, de 1º a 6º, alineados con el currículo LOMLOE.',
        sections: [
            {
                heading: 'Quién está detrás de Eduaroo',
                paragraphs: [`Eduaroo es un proyecto de ${legalName}, empresa con sede en Murcia (España). Puedes escribirnos a ${contactEmail}.`],
            },
            {
                heading: 'Qué encontrarás aquí',
                paragraphs: [
                    `${topics} temas con ${activities} actividades de Lengua Castellana, Matemáticas, Ciencias Naturales, Ciencias Sociales e Inglés, organizados por curso y asignatura, además de una colección de juegos educativos. Todo se puede usar sin crear una cuenta.`,
                ],
            },
            {
                heading: 'Criterio pedagógico y enfoque LOMLOE',
                paragraphs: [
                    'Las actividades se agrupan por curso, asignatura y tema, y cada tema indica qué criterios de evaluación del currículo LOMLOE (Real Decreto 157/2022) trabaja. Ciencias Naturales y Ciencias Sociales se mantienen separadas, aunque el currículo oficial las agrupa en un área, para que los itinerarios de repaso sean claros.',
                    'Los bloques de actividades se elaboran con ayuda de herramientas de inteligencia artificial a partir de esos criterios oficiales. Si encuentras un error o algo que se pueda mejorar, cuéntanoslo.',
                ],
            },
            {
                heading: 'Privacidad y menores',
                paragraphs: ['Para practicar no hace falta crear una cuenta ni dar datos personales. El progreso se guarda en el navegador del dispositivo que se esté usando.'],
            },
        ],
        contactLink: 'Contacta con nosotros',
    };
}

export function contactContent(locale: SiteLocale) {
    if (locale === 'en') {
        return {
            h1: 'Contact Eduaroo',
            intro: 'Write to us if you find a mistake in an activity, have a suggestion, or want to propose a revision topic for your year.',
            emailLabel: 'Email',
            locationLabel: 'Location',
            location: 'Murcia, Spain',
            companyLabel: 'Company',
            tips: ['For mistakes, include the year, subject and topic (the page address is enough).', 'For suggestions, tell us the year and subject you would like to see covered.'],
        };
    }
    return {
        h1: 'Contacto con Eduaroo',
        intro: 'Escríbenos si encuentras un error en una actividad, tienes una sugerencia o quieres proponer un tema de repaso para tu curso.',
        emailLabel: 'Correo electrónico',
        locationLabel: 'Ubicación',
        location: 'Murcia, España',
        companyLabel: 'Empresa',
        tips: ['Si es un error, indica el curso, la asignatura y el tema (basta con la dirección de la página).', 'Si es una sugerencia, cuéntanos qué curso y asignatura te gustaría ver.'],
    };
}
