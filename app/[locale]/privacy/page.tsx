import { getTranslations } from 'next-intl/server';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    const t = await getTranslations({ locale, namespace: 'Privacy' });

    return {
        title: t('title'),
        description: 'Política de privacidad de Eduaroo'
    };
}

export default async function PrivacyPage(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    const t = await getTranslations({ locale, namespace: 'Privacy' });

    const isSpanish = locale === 'es';

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
            <div className="max-w-4xl mx-auto px-6">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    {t('title')}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mb-8">
                    {t('lastUpdated')}: 28 de enero de 2026
                </p>

                <div className="prose prose-lg dark:prose-invert max-w-none">
                    <p className="text-gray-700 dark:text-gray-300 text-lg mb-8">
                        {t('intro')}
                    </p>

                    {/* Responsable del Tratamiento */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            {t('sections.responsible')}
                        </h2>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                                <li><strong>{isSpanish ? 'Titular' : 'Owner'}:</strong> Archivados Network S.L.</li>
                                <li><strong>NIF:</strong> B-73770729</li>
                                <li><strong>{isSpanish ? 'Domicilio' : 'Address'}:</strong> C/ Poeta Vicente Medina 20, Murcia - España</li>
                                <li><strong>Email:</strong> nicolas@archivados.com</li>
                                <li><strong>{isSpanish ? 'Registro Mercantil' : 'Commercial Registry'}:</strong> {isSpanish ? 'Inscrita en el registro mercantil de Murcia, tomo 2915, sección 8, H MU 79496, I/A 1, folio 223' : 'Registered in the Commercial Registry of Murcia, volume 2915, section 8, H MU 79496, I/A 1, page 223'}</li>
                            </ul>
                        </div>
                    </section>

                    {/* Datos que Recopilamos */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            {t('sections.dataCollected')}
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            {isSpanish
                                ? 'Recopilamos la siguiente información:'
                                : 'We collect the following information:'}
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                            <li>{isSpanish ? 'Datos de progreso de aprendizaje (puntuaciones, ejercicios completados)' : 'Learning progress data (scores, completed exercises)'}</li>
                            <li>{isSpanish ? 'Preferencias de usuario (idioma, configuración de sonido)' : 'User preferences (language, sound settings)'}</li>
                            <li>{isSpanish ? 'Datos de uso anónimos para mejorar el servicio' : 'Anonymous usage data to improve the service'}</li>
                        </ul>
                    </section>

                    {/* Finalidad */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            {t('sections.purpose')}
                        </h2>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                            <li>{isSpanish ? 'Proporcionar y personalizar la experiencia educativa' : 'Provide and personalize the educational experience'}</li>
                            <li>{isSpanish ? 'Guardar el progreso del estudiante' : 'Save student progress'}</li>
                            <li>{isSpanish ? 'Mejorar nuestros contenidos y servicios' : 'Improve our content and services'}</li>
                            <li>{isSpanish ? 'Comunicarnos con padres/tutores cuando sea necesario' : 'Communicate with parents/guardians when necessary'}</li>
                        </ul>
                    </section>

                    {/* Derechos */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            {t('sections.rights')}
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            {isSpanish
                                ? 'De acuerdo con el RGPD, tienes derecho a:'
                                : 'In accordance with GDPR, you have the right to:'}
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                            <li>{isSpanish ? 'Acceso a tus datos personales' : 'Access your personal data'}</li>
                            <li>{isSpanish ? 'Rectificación de datos incorrectos' : 'Rectification of incorrect data'}</li>
                            <li>{isSpanish ? 'Supresión de tus datos ("derecho al olvido")' : 'Erasure of your data ("right to be forgotten")'}</li>
                            <li>{isSpanish ? 'Portabilidad de tus datos' : 'Portability of your data'}</li>
                            <li>{isSpanish ? 'Oposición al tratamiento' : 'Opposition to processing'}</li>
                        </ul>
                    </section>

                    {/* Protección de Menores */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            {t('sections.children')}
                        </h2>
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                            <p className="text-gray-700 dark:text-gray-300">
                                {isSpanish
                                    ? 'Eduaroo está diseñado para menores de edad. No recopilamos datos personales de menores sin el consentimiento de sus padres o tutores. Si eres padre/tutor y crees que hemos recopilado información de tu hijo sin tu consentimiento, contáctanos inmediatamente.'
                                    : 'Eduaroo is designed for minors. We do not collect personal data from minors without parental/guardian consent. If you are a parent/guardian and believe we have collected information from your child without your consent, please contact us immediately.'}
                            </p>
                        </div>
                    </section>

                    {/* Cookies */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            {t('sections.cookies')}
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300">
                            {isSpanish
                                ? 'Utilizamos cookies técnicas necesarias para el funcionamiento del sitio y cookies analíticas para mejorar la experiencia. Puedes configurar tu navegador para rechazar cookies, aunque esto puede afectar la funcionalidad del servicio.'
                                : 'We use necessary technical cookies for site operation and analytical cookies to improve the experience. You can configure your browser to reject cookies, although this may affect service functionality.'}
                        </p>
                    </section>

                    {/* Contacto */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            {t('sections.contact')}
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300">
                            {isSpanish
                                ? 'Para ejercer tus derechos o cualquier consulta sobre privacidad, contacta con nosotros:'
                                : 'To exercise your rights or any privacy inquiries, contact us:'}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 mt-2">
                            <strong>Email:</strong> <a href="mailto:nicolas@archivados.com" className="text-emerald-600 hover:text-emerald-500">nicolas@archivados.com</a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
