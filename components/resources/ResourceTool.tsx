import type { ResourceGuide } from '@/lib/resources/catalog';
import {
    ArithmeticTool,
    AngleTool,
    ClockTool,
    FractionTool,
    RomanTool,
} from './MathTools';
import {
    DictationTool,
    PreschoolTool,
    SyllablesTool,
    VerbsTool,
} from './LanguageTools';
import { HandwritingTool, TimetableTool } from './PrintTools';
import SpainMap from './SpainMap';
import { Link } from '@/i18n/navigation';
import { paths } from '@/lib/seo/urls';
export default function ResourceTool({ guide }: { guide: ResourceGuide }) {
    switch (guide.tool) {
        case 'arithmetic':
            return <ArithmeticTool slug={guide.slug} />;
        case 'clock':
            return <ClockTool />;
        case 'fractions':
            return <FractionTool />;
        case 'roman':
            return <RomanTool />;
        case 'angles':
            return <AngleTool />;
        case 'handwriting':
            return <HandwritingTool />;
        case 'timetable':
            return <TimetableTool />;
        case 'dictation':
            return <DictationTool />;
        case 'syllables':
            return <SyllablesTool />;
        case 'verbs':
            return <VerbsTool />;
        case 'map':
            return <SpainMap />;
        case 'preschool':
            return <PreschoolTool />;
        case 'summer':
            return (
                <section className="resource-tool">
                    <h2 className="text-2xl font-black">
                        Elige el curso que has terminado
                    </h2>
                    <p>
                        Cada cuaderno reúne cuatro temas: dos de Matemáticas y
                        dos de Lengua. Puedes añadir ideas clave y soluciones.
                    </p>
                    <div className="grid gap-3 sm:grid-cols-3">
                        {['1', '2', '3', '4', '5', '6'].map((grade) => (
                            <Link
                                key={grade}
                                href={paths.summerBook(grade)}
                                className="resource-button text-center"
                            >
                                Cuaderno de {grade}º →
                            </Link>
                        ))}
                    </div>
                </section>
            );
        default:
            return null;
    }
}
