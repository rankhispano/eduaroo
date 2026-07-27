import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    const isSpanish = locale === 'es';

    return {
        title: isSpanish ? 'Política de Privacidad | Eduaroo' : 'Privacy Policy | Eduaroo',
        description: isSpanish
            ? 'Política de privacidad oficial de Eduaroo: Tablas de Multiplicar. Transparencia sobre datos locales, AdMob infantil y compras Premium.'
            : 'Official Privacy Policy for Eduaroo: Multiplication Tables. Transparency on local data, child-directed AdMob, and Premium purchases.'
    };
}

export default async function PrivacyPage(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    const isSpanish = locale === 'es';

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
            <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 sm:p-10 md:p-12">

                {/* Header */}
                <div className="border-b border-slate-200 dark:border-slate-700 pb-8 mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-4">
                        {isSpanish ? 'Documento Oficial' : 'Official Policy'}
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
                        {isSpanish ? 'Política de Privacidad' : 'Privacy Policy'}
                    </h1>
                    <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
                        {isSpanish ? 'Fecha de entrada en vigor:' : 'Effective date:'}{' '}
                        <span className="font-semibold text-slate-700 dark:text-slate-200">
                            27 de julio de 2026
                        </span>
                    </p>
                </div>

                {/* App Identifier Summary Card */}
                <div className="mb-10 bg-slate-100 dark:bg-slate-700/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-600/60">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                        {isSpanish ? 'Datos de la Aplicación' : 'Application Specification'}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700 dark:text-slate-300">
                        <div>
                            <span className="font-semibold">{isSpanish ? 'Nombre Comercial:' : 'Commercial Name:'}</span> Eduaroo: Tablas de Multiplicar
                        </div>
                        <div>
                            <span className="font-semibold">{isSpanish ? 'Nombre Corto App:' : 'Short App Name:'}</span> Eduaroo Tablas
                        </div>
                        <div>
                            <span className="font-semibold">{isSpanish ? 'Paquete Android:' : 'Android Package:'}</span> <code className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-xs">com.archivados.multiplication.table.kids</code>
                        </div>
                        <div>
                            <span className="font-semibold">{isSpanish ? 'Desarrollador:' : 'Developer:'}</span> Archivados Network S.L.
                        </div>
                        <div>
                            <span className="font-semibold">{isSpanish ? 'Soporte y Privacidad:' : 'Support & Privacy Email:'}</span> <a href="mailto:nicolas@archivados.com" className="text-emerald-600 dark:text-emerald-400 hover:underline">nicolas@archivados.com</a>
                        </div>
                        <div>
                            <span className="font-semibold">{isSpanish ? 'Proveedor Publicitario:' : 'Ad Provider:'}</span> Google AdMob
                        </div>
                    </div>
                </div>

                <div className="space-y-10 text-slate-700 dark:text-slate-300 text-base leading-relaxed">

                    {/* 1. Introducción */}
                    <section className="scroll-mt-20" id="introduccion">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500 text-white text-sm font-black">1</span>
                            {isSpanish ? 'Introducción' : '1. Introduction'}
                        </h2>
                        <p className="mb-3">
                            {isSpanish
                                ? 'Eduaroo: Tablas de Multiplicar (nombre corto: Eduaroo Tablas) es una aplicación educativa interactiva diseñada especialmente para que niños y familias aprendan y practiquen las tablas de multiplicar de forma divertida, segura y adaptada a su ritmo.'
                                : 'Eduaroo: Multiplication Tables (short name: Eduaroo Tablas) is an interactive educational app designed for children and families to learn and practice multiplication tables in a fun, safe, and self-paced environment.'}
                        </p>
                        <p>
                            {isSpanish
                                ? 'La privacidad de nuestros usuarios y la seguridad de los menores es nuestra máxima prioridad. Esta política detalla de manera transparente qué datos se procesan, cómo se protegen y las medidas aplicadas para ofrecer una experiencia adecuada a entornos educativos e infantiles.'
                                : 'The privacy of our users and the safety of children are our top priorities. This policy transparently explains what data is processed, how it is protected, and the measures enforced to ensure a safe experience for kids and families.'}
                        </p>
                    </section>

                    {/* 2. Información guardada localmente */}
                    <section className="scroll-mt-20" id="almacenamiento-local">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500 text-white text-sm font-black">2</span>
                            {isSpanish ? 'Información Guardada Localmente en el Dispositivo' : '2. Locally Stored Device Information'}
                        </h2>
                        <p className="mb-4">
                            {isSpanish
                                ? 'Eduaroo funciona sin necesidad de crear cuentas de usuario ni iniciar sesión. Todo el progreso educativo y la configuración de la aplicación se guardan únicamente de forma local en el almacenamiento interno de tu dispositivo.'
                                : 'Eduaroo operates without requiring user accounts or logins. All educational progress and app configuration are saved strictly locally on your device storage.'}
                        </p>
                        <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl p-5">
                            <h3 className="font-semibold text-emerald-900 dark:text-emerald-200 mb-2">
                                {isSpanish ? 'Datos almacenados localmente:' : 'Locally stored data includes:'}
                            </h3>
                            <ul className="list-disc pl-5 space-y-1.5 text-emerald-950 dark:text-emerald-300 text-sm">
                                <li>{isSpanish ? 'Progreso de aprendizaje y lecciones completadas' : 'Learning progress and completed lessons'}</li>
                                <li>{isSpanish ? 'Puntuaciones, racha y estadísticas de ejercicios' : 'Scores, streaks, and exercise performance stats'}</li>
                                <li>{isSpanish ? 'Preferencias del usuario (idioma, efectos de sonido y tema visual)' : 'User preferences (language, sound effects, and visual theme)'}</li>
                                <li>{isSpanish ? 'Estado de activación de la versión Premium' : 'Premium version activation status'}</li>
                                <li>{isSpanish ? 'Código PIN de control parental' : 'Parental control PIN'}</li>
                            </ul>
                        </div>
                        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 italic">
                            {isSpanish
                                ? 'IMPORTANTE: Estos datos educativos jamás se transmiten ni se envían a servidores propios del desarrollador. La aplicación no dispone de backend propio ni de bases de datos remotas para el almacenamiento de estos registros.'
                                : 'IMPORTANT: These educational records are never transmitted to any developer-owned server. The app does not maintain custom backend servers or remote databases for these records.'}
                        </p>
                    </section>

                    {/* 3. Publicidad mediante Google AdMob */}
                    <section className="scroll-mt-20" id="google-admob">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500 text-white text-sm font-black">3</span>
                            {isSpanish ? 'Publicidad mediante Google AdMob' : '3. Advertising via Google AdMob'}
                        </h2>
                        <p className="mb-4">
                            {isSpanish
                                ? 'La versión gratuita de la aplicación utiliza el servicio publicitario Google AdMob únicamente para mostrar anuncios intersticiales durante pausas naturales de la experiencia (por ejemplo, al finalizar una partida o bloque de ejercicios). Los usuarios de la versión Premium no reciben ningún tipo de publicidad.'
                                : 'The free version of the application utilizes Google AdMob to display interstitial ads only during natural pauses in gameplay (for example, upon finishing a game round). Users of the Premium version do not receive any advertisements.'}
                        </p>

                        <div className="bg-slate-100 dark:bg-slate-700/40 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 mb-6">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-3 text-base">
                                {isSpanish ? 'Configuración de Protección Infantil y Anuncios No Personalizados' : 'Child Protection and Non-Personalized Ad Configuration'}
                            </h3>
                            <p className="text-sm mb-3">
                                {isSpanish
                                    ? 'Todas las solicitudes publicitarias realizadas a Google AdMob se configuran explícitamente desde el código de la aplicación con los siguientes parámetros estrictos:'
                                    : 'All ad requests sent to Google AdMob are explicitly configured within the app using strict compliance flags:'}
                            </p>
                            <ul className="list-disc pl-5 space-y-1 text-sm">
                                <li><strong>{isSpanish ? 'Tratamiento dirigido a niños:' : 'Child-directed treatment:'}</strong> TagForChildDirectedTreatment (TFCD = true).</li>
                                <li><strong>{isSpanish ? 'Anuncios no personalizados:' : 'Non-personalized ads:'}</strong> TFUA / Non-Personalized Ads mode activo. No se crean perfiles publicitarios de los usuarios.</li>
                                <li><strong>{isSpanish ? 'Clasificación máxima de contenido:' : 'Max ad content rating:'}</strong> Clasificación G (General / Apto para todas las edades).</li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                                {isSpanish ? 'Datos procesados por Google Mobile Ads SDK' : 'Data processed by Google Mobile Ads SDK'}
                            </h3>
                            <p>
                                {isSpanish
                                    ? 'Para la entrega técnica de los anuncios contextuales, la prevención del fraude y el diagnóstico de la red, el SDK de Google Mobile Ads puede procesar o compartir de forma automatizada:'
                                    : 'To deliver contextual ads, prevent fraud, and perform network diagnostics, the Google Mobile Ads SDK may automatically process or share:'}
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-sm">
                                <li>
                                    <strong>{isSpanish ? 'Dirección IP:' : 'IP Address:'}</strong> {isSpanish ? 'Utilizada por Google para estimar una ubicación general o aproximada (a nivel país o ciudad), jamás ubicación GPS precisa.' : 'Used by Google to estimate general/coarse location (country/city level), never precise GPS location.'}
                                </li>
                                <li>
                                    <strong>{isSpanish ? 'Interacciones con la app y anuncios:' : 'App & ad interactions:'}</strong> {isSpanish ? 'Datos técnicos sobre la visualización del anuncio, tiempos de interacción y rendimiento.' : 'Technical data regarding ad views, interaction timing, and performance.'}
                                </li>
                                <li>
                                    <strong>{isSpanish ? 'Información de diagnóstico y errores:' : 'Diagnostic & crash data:'}</strong> {isSpanish ? 'Información técnica de rendimiento, registros de errores y tiempos de respuesta de la red.' : 'Performance metrics, crash logs, and network response times.'}
                                </li>
                                <li>
                                    <strong>{isSpanish ? 'Identificadores técnicos permitidos:' : 'Allowed technical identifiers:'}</strong> {isSpanish ? 'Identificadores de instalación no persistentes como App Set ID u otros identificadores autorizados para entornos infantiles.' : 'Non-persistent installation identifiers such as App Set ID or other IDs approved for family apps.'}
                                </li>
                                <li>
                                    <strong>{isSpanish ? 'Información de seguridad:' : 'Security data:'}</strong> {isSpanish ? 'Datos necesarios para la prevención de fraude, detección de bots, verificación de impresiones y cumplimiento normativo.' : 'Data required for fraud prevention, bot detection, ad impression validation, and legal compliance.'}
                                </li>
                            </ul>
                        </div>

                        <div className="mt-6 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 rounded-2xl p-5">
                            <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 text-sm">
                                🛡️ {isSpanish ? 'Eliminación del permiso AD_ID e identificadores restringidos' : 'Removal of AD_ID permission and restricted identifiers'}
                            </h3>
                            <p className="text-xs text-blue-950 dark:text-blue-300 leading-relaxed">
                                {isSpanish
                                    ? 'Declaración técnica explícita: La aplicación ha eliminado el permiso Android Advertising ID (AD_ID), así como los permisos y servicios de Advertising ID, Topics y Privacy Sandbox. La aplicación NO recopila ni transmite Android Advertising ID (AAID), IMEI, IMSI, número de teléfono, dirección MAC, BSSID, SSID ni ningún otro identificador persistente prohibido para aplicaciones infantiles.'
                                    : 'Explicit technical statement: The application has removed the Android Advertising ID (AD_ID) permission, as well as Advertising ID, Topics, and Privacy Sandbox services. The app DOES NOT collect or transmit Android Advertising ID (AAID), IMEI, IMSI, phone number, MAC address, BSSID, SSID, or any other prohibited persistent identifier.'}
                            </p>
                        </div>

                        <div className="mt-6 space-y-2">
                            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                                {isSpanish ? 'Finalidades del tratamiento publicitario:' : 'Purposes of ad processing:'}
                            </h3>
                            <ul className="list-disc pl-5 space-y-1 text-sm">
                                <li>{isSpanish ? 'Mostrar publicidad contextual y no personalizada apta para menores.' : 'Display child-safe, non-personalized contextual ads.'}</li>
                                <li>{isSpanish ? 'Medición básica del funcionamiento y rendimiento de los anuncios.' : 'Basic measurement of ad performance and impressions.'}</li>
                                <li>{isSpanish ? 'Análisis técnico de errores y estabilidad de la red publicitaria.' : 'Technical analysis of errors and ad network stability.'}</li>
                                <li>{isSpanish ? 'Prevención del fraude, seguridad y cumplimiento normativo.' : 'Fraud prevention, system security, and regulatory compliance.'}</li>
                            </ul>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                                {isSpanish ? 'Todos los datos gestionados por Google se transmiten de forma cifrada en tránsito (HTTPS/TLS).' : 'All data handled by Google is encrypted in transit (HTTPS/TLS).'}
                            </p>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 text-sm space-y-2">
                            <p className="font-medium text-slate-900 dark:text-white">
                                {isSpanish ? 'Enlaces oficiales de consulta:' : 'Official policy links:'}
                            </p>
                            <ul className="space-y-1 text-xs">
                                <li>
                                    🔗 <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                                        {isSpanish ? 'Política de Privacidad de Google' : 'Google Privacy Policy'} (https://policies.google.com/privacy)
                                    </a>
                                </li>
                                <li>
                                    🔗 <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                                        {isSpanish ? 'Cómo utiliza Google los datos de sitios o aplicaciones asociadas' : 'How Google uses information from sites or apps that use our services'} (https://policies.google.com/technologies/partner-sites)
                                    </a>
                                </li>
                                <li>
                                    🔗 <a href="https://support.google.com/admob/answer/6223431" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                                        {isSpanish ? 'Política de AdMob para Familias' : 'AdMob Families Policy Support'} (https://support.google.com/admob/answer/6223431)
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* 4. Compras Premium */}
                    <section className="scroll-mt-20" id="compras-premium">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500 text-white text-sm font-black">4</span>
                            {isSpanish ? 'Compras Premium' : '4. Premium Purchases'}
                        </h2>
                        <p className="mb-3">
                            {isSpanish
                                ? 'Eduaroo ofrece una compra in-app para desbloquear la versión Premium. Las transacciones financieras son procesadas directa y exclusivamente por las plataformas oficiales:'
                                : 'Eduaroo offers an in-app purchase to unlock the Premium version. All financial transactions are processed directly and exclusively by official app store platforms:'}
                        </p>
                        <ul className="list-disc pl-5 space-y-1.5 text-sm mb-4">
                            <li><strong>Google Play Billing</strong> {isSpanish ? 'para dispositivos Android.' : 'for Android devices.'}</li>
                            <li><strong>Apple App Store In-App Purchases</strong> {isSpanish ? 'para dispositivos iOS.' : 'for iOS devices.'}</li>
                        </ul>
                        <p className="text-sm">
                            {isSpanish
                                ? 'El desarrollador NO recibe ni almacena en ningún momento datos bancarios, números de tarjeta de crédito ni claves de pago. La aplicación únicamente recibe la confirmación técnica, el recibo cifrado o el identificador de transacción emitido por la tienda oficial con el único objetivo de activar y restaurar la suscripción Premium en el dispositivo, ofrecer soporte al cliente y prevenir el fraude.'
                                : 'The developer DOES NOT receive or store bank accounts, credit card numbers, or payment credentials. The app only receives a technical receipt status or transaction identifier from the official store solely to enable or restore Premium features, provide customer support, and prevent fraudulent purchases.'}
                        </p>
                    </section>

                    {/* 5. Privacidad infantil */}
                    <section className="scroll-mt-20" id="privacidad-infantil">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500 text-white text-sm font-black">5</span>
                            {isSpanish ? 'Privacidad Infantil y Protección Familiar' : '5. Child Privacy and Family Protection'}
                        </h2>
                        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-6 space-y-3">
                            <p className="text-sm text-amber-950 dark:text-amber-200 font-medium">
                                👨‍👩‍👧‍👦 {isSpanish ? 'Compromiso con la seguridad de menores:' : 'Commitment to child safety:'}
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-amber-900 dark:text-amber-300">
                                <li>
                                    {isSpanish
                                        ? 'La aplicación está diseñada para aplicar medidas compatibles con las políticas infantiles aplicables (Google Play Families Policy y normativas de protección de menores).'
                                        : 'The application is designed to implement measures compatible with applicable children policies (Google Play Families Policy and child privacy standards).'}
                                </li>
                                <li>
                                    {isSpanish
                                        ? 'No se crean perfiles publicitarios ni de comportamiento de los menores.'
                                        : 'No behavioral or advertising profiles are created for children.'}
                                </li>
                                <li>
                                    {isSpanish
                                        ? 'No se utiliza remarketing ni retargeting publicitario.'
                                        : 'No remarketing or behavioral retargeting is performed.'}
                                </li>
                                <li>
                                    {isSpanish
                                        ? 'No se solicita ni accede a ubicación GPS precisa, cámara, micrófono, contactos ni número de teléfono.'
                                        : 'No precise GPS location, camera, microphone, contacts, or phone number permissions are requested.'}
                                </li>
                                <li>
                                    {isSpanish
                                        ? 'No se permite la publicación de contenidos ni la interacción con desconocidos. La aplicación no contiene salas de chat ni funciones sociales.'
                                        : 'No content publishing or communication with strangers is allowed. The app contains no chat rooms or social networking features.'}
                                </li>
                                <li>
                                    {isSpanish
                                        ? 'Las operaciones sensibles (como el acceso a enlaces de soporte o compras) están resguardadas tras controles parentales (PIN parental).'
                                        : 'Sensitive actions (such as accessing support links or purchases) are protected behind Parental Controls (parental PIN).'}
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* 6. Conservación y eliminación */}
                    <section className="scroll-mt-20" id="conservacion-eliminacion">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500 text-white text-sm font-black">6</span>
                            {isSpanish ? 'Conservación y Eliminación de Datos' : '6. Data Retention and Deletion'}
                        </h2>
                        <p className="mb-3">
                            {isSpanish
                                ? 'Puesto que los datos de progreso educativo y personalización residen exclusivamente en tu dispositivo, los usuarios o sus padres/tutores pueden eliminarlos íntegramente en cualquier momento mediante cualquiera de las siguientes opciones:'
                                : 'Because learning progress and preferences reside strictly on your device, users or their parents/guardians can completely wipe all stored data at any time via:'}
                        </p>
                        <ol className="list-decimal pl-6 space-y-1.5 text-sm mb-4">
                            <li>
                                <strong>{isSpanish ? 'Borrado de almacenamiento:' : 'Clear App Storage:'}</strong> {isSpanish ? 'Accediendo a los Ajustes de tu dispositivo -> Aplicaciones -> Eduaroo Tablas -> Almacenamiento -> Borrar Datos.' : 'Go to Device Settings -> Apps -> Eduaroo Tablas -> Storage -> Clear Data.'}
                            </li>
                            <li>
                                <strong>{isSpanish ? 'Desinstalación de la app:' : 'Uninstall the App:'}</strong> {isSpanish ? 'Al desinstalar la aplicación del dispositivo se eliminan automáticamente todos sus registros locales.' : 'Uninstalling the app automatically deletes all local storage data from the device.'}
                            </li>
                        </ol>
                        <p className="text-sm">
                            {isSpanish
                                ? 'Para cualquier consulta o ejercicio de derechos sobre datos gestionados por proveedores externos (Google/Apple), el usuario puede contactar directamente al desarrollador en:'
                                : 'For any privacy inquiries or requests regarding external provider data (Google/Apple), contact the developer directly at:'}{' '}
                            <a href="mailto:nicolas@archivados.com" className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
                                nicolas@archivados.com
                            </a>.
                        </p>
                    </section>

                    {/* 7. Proveedores externos (Tabla) */}
                    <section className="scroll-mt-20" id="proveedores-externos">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500 text-white text-sm font-black">7</span>
                            {isSpanish ? 'Proveedores Externos de Servicios' : '7. Third-Party Service Providers'}
                        </h2>
                        <p className="mb-4 text-sm">
                            {isSpanish
                                ? 'A continuación se desglosan los proveedores externos que intervienen en el funcionamiento de la aplicación:'
                                : 'Below is the summary of external third-party providers involved in the application operations:'}
                        </p>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs sm:text-sm border-collapse border border-slate-200 dark:border-slate-700">
                                <thead>
                                    <tr className="bg-slate-100 dark:bg-slate-700/60 text-slate-900 dark:text-white">
                                        <th className="p-3 border border-slate-200 dark:border-slate-700">{isSpanish ? 'Proveedor' : 'Provider'}</th>
                                        <th className="p-3 border border-slate-200 dark:border-slate-700">{isSpanish ? 'Finalidad' : 'Purpose'}</th>
                                        <th className="p-3 border border-slate-200 dark:border-slate-700">{isSpanish ? 'Datos Posibles' : 'Possible Data'}</th>
                                        <th className="p-3 border border-slate-200 dark:border-slate-700">{isSpanish ? 'Política de Privacidad' : 'Privacy Policy'}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-slate-200 dark:border-slate-700">
                                        <td className="p-3 font-semibold border border-slate-200 dark:border-slate-700">Google AdMob</td>
                                        <td className="p-3 border border-slate-200 dark:border-slate-700">
                                            {isSpanish ? 'Publicidad contextual no personalizada en versión gratuita, medición de rendimiento, prevención de fraude y seguridad.' : 'Non-personalized contextual ads in free version, performance measurement, fraud prevention & security.'}
                                        </td>
                                        <td className="p-3 border border-slate-200 dark:border-slate-700">
                                            {isSpanish ? 'Dirección IP (ubicación aproximada), interacciones con la app/anuncios, datos de diagnóstico e identificadores técnicos permitidos (App Set ID).' : 'IP address (coarse location), app/ad interactions, diagnostic metrics, allowed technical IDs (App Set ID).'}
                                        </td>
                                        <td className="p-3 border border-slate-200 dark:border-slate-700">
                                            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                                                Google Privacy Policy
                                            </a>
                                        </td>
                                    </tr>
                                    <tr className="border-b border-slate-200 dark:border-slate-700">
                                        <td className="p-3 font-semibold border border-slate-200 dark:border-slate-700">Google Play Billing / Apple App Store</td>
                                        <td className="p-3 border border-slate-200 dark:border-slate-700">
                                            {isSpanish ? 'Procesar, validar y restaurar compras de la versión Premium.' : 'Process, validate, and restore Premium version purchases.'}
                                        </td>
                                        <td className="p-3 border border-slate-200 dark:border-slate-700">
                                            {isSpanish ? 'Estado de la transacción, recibo digital de compra e identificador técnico de la transacción.' : 'Transaction status, digital receipt, technical transaction identifier.'}
                                        </td>
                                        <td className="p-3 border border-slate-200 dark:border-slate-700 space-y-1">
                                            <div>
                                                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                                                    Google Privacy
                                                </a>
                                            </div>
                                            <div>
                                                <a href="https://www.apple.com/legal/privacy/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                                                    Apple Privacy
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* 8. Seguridad */}
                    <section className="scroll-mt-20" id="seguridad">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500 text-white text-sm font-black">8</span>
                            {isSpanish ? 'Seguridad' : '8. Security'}
                        </h2>
                        <p className="mb-3">
                            {isSpanish
                                ? 'Todas las comunicaciones de datos efectuadas por los SDKs de los proveedores externos (Google AdMob, Google Play, Apple) se realizan mediante protocolos de cifrado estándar en tránsito (HTTPS / TLS).'
                                : 'All data communications performed by external provider SDKs (Google AdMob, Google Play, Apple) are transmitted using industry-standard encryption in transit (HTTPS / TLS).'}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            {isSpanish
                                ? 'El desarrollador aplica medidas organizativas y de diseño orientadas a la minimización de datos. No obstante, tenga en cuenta que ningún sistema de transmisión por Internet o almacenamiento electrónico es 100% seguro, por lo que no se puede garantizar una seguridad absoluta.'
                                : 'The developer applies organizational and design safeguards focused on data minimization. However, please note that no system of electronic transmission or storage is 100% secure, and absolute security cannot be guaranteed.'}
                        </p>
                    </section>

                    {/* 9. Cambios y contacto */}
                    <section className="scroll-mt-20 border-t border-slate-200 dark:border-slate-700 pt-8" id="contacto">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500 text-white text-sm font-black">9</span>
                            {isSpanish ? 'Cambios en la Política y Contacto' : '9. Policy Updates and Contact'}
                        </h2>
                        <p className="mb-4">
                            {isSpanish
                                ? 'Nos reservamos el derecho de actualizar esta política de privacidad para reflejar cambios normativos o actualizaciones funcionales de la aplicación. Cualquier modificación será publicada en esta misma página con la correspondiente fecha de actualización.'
                                : 'We reserve the right to update this privacy policy to reflect regulatory changes or functional app updates. Any modifications will be posted on this page with the updated effective date.'}
                        </p>

                        <div className="bg-slate-100 dark:bg-slate-700/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-600">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                                {isSpanish ? 'Datos de Contacto y Titularidad:' : 'Owner & Contact Details:'}
                            </h3>
                            <ul className="space-y-1.5 text-sm">
                                <li><strong>{isSpanish ? 'Última actualización:' : 'Last updated:'}</strong> 27 de julio de 2026</li>
                                <li><strong>{isSpanish ? 'Desarrollador:' : 'Developer:'}</strong> Archivados Network S.L.</li>
                                <li><strong>NIF:</strong> B-73770729</li>
                                <li><strong>{isSpanish ? 'Email de soporte y privacidad:' : 'Support & Privacy Email:'}</strong> <a href="mailto:nicolas@archivados.com" className="text-emerald-600 dark:text-emerald-400 hover:underline">nicolas@archivados.com</a></li>
                                <li><strong>{isSpanish ? 'Dirección:' : 'Address:'}</strong> C/ Poeta Vicente Medina 20, Murcia - España</li>
                            </ul>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}
