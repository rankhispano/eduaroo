import { getTranslations } from 'next-intl/server';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    const t = await getTranslations({ locale, namespace: 'Terms' });

    return {
        title: t('title'),
        description: 'Términos de servicio de Eduaroo'
    };
}

export default async function TermsPage(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    const t = await getTranslations({ locale, namespace: 'Terms' });

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

                    {/* Identificación del Titular */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            {t('sections.identification')}
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

                    {/* Aceptación de Términos */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            {t('sections.acceptance')}
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300">
                            {isSpanish
                                ? 'Al acceder y utilizar Eduaroo, aceptas estos términos y condiciones en su totalidad. Si no estás de acuerdo con alguna parte de estos términos, no debes usar nuestros servicios.'
                                : 'By accessing and using Eduaroo, you accept these terms and conditions in full. If you disagree with any part of these terms, you must not use our services.'}
                        </p>
                    </section>

                    {/* Descripción del Servicio */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            {t('sections.service')}
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            {isSpanish
                                ? 'Eduaroo es una plataforma educativa interactiva diseñada para niños de primaria que ofrece:'
                                : 'Eduaroo is an interactive educational platform designed for primary school children that offers:'}
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                            <li>{isSpanish ? 'Ejercicios interactivos de matemáticas, lengua y ciencias' : 'Interactive exercises in math, language, and science'}</li>
                            <li>{isSpanish ? 'Sistema de gamificación con recompensas y logros' : 'Gamification system with rewards and achievements'}</li>
                            <li>{isSpanish ? 'Seguimiento del progreso educativo' : 'Educational progress tracking'}</li>
                            <li>{isSpanish ? 'Contenido alineado con el currículo español' : 'Content aligned with Spanish curriculum'}</li>
                        </ul>
                    </section>

                    {/* Cuentas de Usuario */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            {t('sections.accounts')}
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300">
                            {isSpanish
                                ? 'Para menores de 14 años, se requiere el consentimiento de un padre o tutor para crear una cuenta. Los padres/tutores son responsables de supervisar el uso de la plataforma por parte del menor.'
                                : 'For children under 14, parental or guardian consent is required to create an account. Parents/guardians are responsible for supervising the minor\'s use of the platform.'}
                        </p>
                    </section>

                    {/* Propiedad Intelectual */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            {t('sections.content')}
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300">
                            {isSpanish
                                ? 'Todo el contenido de Eduaroo, incluyendo pero no limitado a textos, gráficos, logos, iconos, imágenes, clips de audio, descargas digitales y compilaciones de datos, es propiedad de Archivados Network S.L. o sus licenciantes y está protegido por las leyes de propiedad intelectual españolas e internacionales.'
                                : 'All Eduaroo content, including but not limited to texts, graphics, logos, icons, images, audio clips, digital downloads, and data compilations, is the property of Archivados Network S.L. or its licensors and is protected by Spanish and international intellectual property laws.'}
                        </p>
                    </section>

                    {/* Conducta del Usuario */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            {t('sections.conduct')}
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            {isSpanish ? 'Los usuarios se comprometen a:' : 'Users agree to:'}
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                            <li>{isSpanish ? 'Usar la plataforma únicamente con fines educativos' : 'Use the platform only for educational purposes'}</li>
                            <li>{isSpanish ? 'No intentar acceder a áreas restringidas del sistema' : 'Not attempt to access restricted areas of the system'}</li>
                            <li>{isSpanish ? 'No compartir credenciales de acceso' : 'Not share access credentials'}</li>
                            <li>{isSpanish ? 'Reportar cualquier problema de seguridad' : 'Report any security issues'}</li>
                        </ul>
                    </section>

                    {/* Limitación de Responsabilidad */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            {t('sections.liability')}
                        </h2>
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800">
                            <p className="text-gray-700 dark:text-gray-300">
                                {isSpanish
                                    ? 'Eduaroo se proporciona "tal cual". No garantizamos que el servicio sea ininterrumpido o libre de errores. No seremos responsables por daños indirectos, incidentales o consecuentes derivados del uso de la plataforma.'
                                    : 'Eduaroo is provided "as is". We do not guarantee that the service will be uninterrupted or error-free. We will not be liable for indirect, incidental, or consequential damages arising from the use of the platform.'}
                            </p>
                        </div>
                    </section>

                    {/* Ley Aplicable */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            {t('sections.law')}
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300">
                            {isSpanish
                                ? 'Estos términos se rigen por la legislación española. Cualquier disputa será sometida a los tribunales de Murcia, España.'
                                : 'These terms are governed by Spanish law. Any dispute shall be submitted to the courts of Murcia, Spain.'}
                        </p>
                    </section>

                    {/* Contacto */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            {t('sections.contact')}
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300">
                            {isSpanish
                                ? 'Para cualquier consulta sobre estos términos, contacta con nosotros:'
                                : 'For any inquiries about these terms, contact us:'}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 mt-2">
                            <strong>Email:</strong> <a href="mailto:nicolas@archivados.com" className="text-emerald-600 hover:text-emerald-500">nicolas@archivados.com</a>
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 mt-2">
                            <strong>{isSpanish ? 'Dirección' : 'Address'}:</strong> C/ Poeta Vicente Medina 20, Murcia - España
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
