'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle, AlertCircle, HelpCircle, Edit3 } from 'lucide-react';
import { useTranslations } from 'next-intl';

// Tipos de problemas
type ProblemType = 'A' | 'B' | 'C' | 'D';

interface Problem {
  type: ProblemType;
  statement: React.ReactNode;
  correctAnswer: number; // Valor numérico para validación
  acceptableFormats: string[]; // Strings aceptables para validación exacta si es necesario
  expectedInputType: 'fraction' | 'text'; // Type of input to show
  units?: string;
  hint?: string;
}

const InlineFraction = ({ num, den }: { num: React.ReactNode, den: React.ReactNode }) => (
    <span className="inline-flex flex-col items-center mx-1 align-middle" style={{ verticalAlign: 'middle', fontSize: '1.2em' }}>
        <span className="border-b-2 border-slate-700 px-1 leading-none pb-0.5 mb-0.5 font-bold text-slate-800">{num}</span>
        <span className="leading-none px-1 pt-0.5 font-bold text-slate-800">{den}</span>
    </span>
);

export default function FractionsWordProblems() {
  const t = useTranslations('FractionsWordProblems');
  const [problem, setProblem] = useState<Problem | null>(null);
  const [dataInput, setDataInput] = useState('');
  const [operationInput, setOperationInput] = useState('');
  const [solutionInput, setSolutionInput] = useState('');
  const [fractionInput, setFractionInput] = useState<{ num: string, den: string }>({ num: '', den: '' });
  const [inputMode, setInputMode] = useState<'text' | 'fraction'>('text');
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [message, setMessage] = useState('');

  // 1. Lógica de Generación de Problemas
  const generateProblem = () => {
    // Reset state
    setDataInput('');
    setOperationInput('');
    setSolutionInput('');
    setFractionInput({ num: '', den: '' });
    setInputMode('text'); // Start in text mode or maybe smart default based on problem type?
    setFeedback('idle');
    setMessage('');

    const types: ProblemType[] = ['A', 'B', 'C', 'D'];
    const selectedType = types[Math.floor(Math.random() * types.length)];
    // const selectedType = 'D'; // Testing specific type

    let newProblem: Problem;

    // Utiles
    const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
    const simplify = (num: number, den: number) => {
      const divisor = gcd(num, den);
      return [num / divisor, den / divisor];
    };

    switch (selectedType) {
      case 'A': // Suma/Resta con mismo denominador
        {
          const den = randomInt(3, 12);
          const num1 = randomInt(1, den - 2);
          const num2 = randomInt(1, den - num1 - 1); // Asegurar que la suma no exceda el denominador (o ajustar si queremos > 1)
          
          // Escenario: Senderismo
          newProblem = {
            type: 'A',
            statement: t.rich('typeA.statement', { 
                val1: () => <InlineFraction num={num1} den={den} />,
                val2: () => <InlineFraction num={num2} den={den} />
            }),
            correctAnswer: (num1 + num2) / den,
            acceptableFormats: [`${num1 + num2}/${den}`],
            expectedInputType: 'fraction',
            hint: t('typeA.hint')
          };
        }
        break;

      case 'B': // El Resto/Complemento
        {
          const denB = randomInt(3, 10);
          const startNum = randomInt(2, denB);
          const consumeNum = randomInt(1, startNum - 1);
          
          newProblem = {
            type: 'B',
            statement: t.rich('typeB.statement', { 
                val1: () => <InlineFraction num={startNum} den={denB} />,
                val2: () => <InlineFraction num={consumeNum} den={denB} />
            }),
            correctAnswer: (startNum - consumeNum) / denB,
            acceptableFormats: [`${startNum - consumeNum}/${denB}`],
            expectedInputType: 'fraction',
            hint: t('typeB.hint')
          };
        }
        break;

      case 'C': // Fracción de una cantidad
        {
            // Paginas de un libro
            const den = randomInt(3, 9);
            const num = randomInt(1, den - 1);
            const multiplier = randomInt(2, 12);
            const total = den * multiplier; // Asegurar que sea divisible
            
            const result = (total / den) * num;

            newProblem = {
                type: 'C',
                statement: t.rich('typeC.statement', { 
                    val1: () => <InlineFraction num={num} den={den} />,
                    total 
                }),
                correctAnswer: result,
                acceptableFormats: [`${result}`, `${result} ${t('units.pages')}`],
                expectedInputType: 'text',
                units: t('units.pages'),
                hint: t('typeC.hint', { total, den, num })
            };
        }
        break;
        
      case 'D': // Unidades de medida (Cuartos y Medios)
        {
            // Ejemplo: "Tengo 4 paquetes de 1/4 de kilo. ¿Cuántos kilos tengo?"
            const options = [
                { qty: 4, num: 1, den: 4, val: 0.25, name: t('units.kilo'), totalName: t('units.kilos') },
                { qty: 2, num: 1, den: 2, val: 0.5, name: t('units.litro'), totalName: t('units.litros') },
                { qty: 8, num: 1, den: 4, val: 0.25, name: t('units.kilo'), totalName: t('units.kilos') },
                { qty: 3, num: 1, den: 2, val: 0.5, name: t('units.litro'), totalName: t('units.litros') }, // 1.5
            ];
            const opt = options[Math.floor(Math.random() * options.length)];
            const totalVal = opt.qty * opt.val;
            
            newProblem = {
                type: 'D',
                statement: t.rich('typeD.statement', { 
                    qty: opt.qty, 
                    unit: () => <InlineFraction num={opt.num} den={opt.den} />, 
                    name: opt.name, 
                    totalName: opt.totalName 
                }),
                correctAnswer: totalVal,
                acceptableFormats: [`${totalVal}`, `${totalVal} ${opt.totalName}`],
                expectedInputType: 'text',
                // Añadir fracciones impropias o mixtas si es necesario, pero el prompt pide "cuantos kilos" (entero o decimal sencillo)
                hint: t('typeD.hint', { sumString: Array(opt.qty).fill(`${opt.num}/${opt.den}`).join(' + ') })
            };
        }
        break;

      default:
        // Fallback
        newProblem = {
             type: 'A',
             statement: 'Generating problem...',
             correctAnswer: 0,
             acceptableFormats: [],
             expectedInputType: 'text'
        };
    }

    setProblem(newProblem);
    // Auto set input mode based on problem type
    setInputMode(newProblem.expectedInputType === 'fraction' ? 'fraction' : 'text');
  };

  // Inicializar
  useEffect(() => {
    generateProblem();
  }, []);

  // 3. Lógica de Validación
  const checkAnswer = () => {
    if (!problem) return;

    // Normalizar entrada: quitar espacios, convertir coma a punto, quitar unidades de texto comunes
    let cleanInput = '';
    
    if (inputMode === 'fraction') {
        const n = parseFloat(fractionInput.num);
        const d = parseFloat(fractionInput.den);
        if (isNaN(n) || isNaN(d) || d === 0) {
             setFeedback('incorrect');
             setMessage(t('feedback_incorrect'));
             return;
        }
        cleanInput = `${n}/${d}`;
    } else {
        cleanInput = solutionInput.toLowerCase().trim();
    }
    
    // Intentar extraer números o fracciones
    // Casos: "3/4", "0.75", "3", "3 litros"
    
    // Primero ver si matchea formats aceptables directamente
    const isExactMatch = problem.acceptableFormats.some(fmt => 
        cleanInput === fmt.toLowerCase() || cleanInput.startsWith(fmt.toLowerCase())
    );

    if (isExactMatch) {
        handleSuccess();
        return;
    }

    // Parsing matemático
    let numericVal: number | null = null;

    if (cleanInput.includes('/')) {
        const parts = cleanInput.split('/');
        if (parts.length === 2) {
            const n = parseFloat(parts[0]);
            const d = parseFloat(parts[1]);
            if (d !== 0) numericVal = n / d;
        }
    } else {
        // Remover texto no numérico excepto punto y coma
        const numStr = cleanInput.replace(/[^\d.,]/g, '').replace(',', '.');
        if (numStr) numericVal = parseFloat(numStr);
    }

    if (numericVal !== null && Math.abs(numericVal - problem.correctAnswer) < 0.01) {
        handleSuccess();
    } else {
        setFeedback('incorrect');
        setMessage(t('feedback_incorrect'));
    }
  };

  const handleSuccess = () => {
    setFeedback('correct');
    setMessage(t('feedback_correct'));
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg border-2 border-slate-100">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-indigo-700 flex items-center gap-2">
            <Edit3 className="w-6 h-6" />
            {t('title')}
        </h2>
        <Button onClick={generateProblem} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            {t('new_problem')}
        </Button>
      </div>

      {problem && (
        <div className="space-y-8">
            {/* ENUNCIADO */}
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                <p className="text-xl text-slate-800 font-medium leading-relaxed">
                    {problem.statement}
                </p>
            </div>

            {/* AREA DE TRABAJO - 3 COLUMNAS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* COLUMNA 1: DATOS */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs">1</span>
                        {t('data_label')}
                    </label>
                    <textarea 
                        className="flex-1 min-h-[200px] p-4 rounded-lg border-2 border-slate-200 focus:border-indigo-400 focus:ring-0 resize-none bg-slate-50 text-lg"
                        placeholder={t('data_placeholder')}
                        value={dataInput}
                        onChange={(e) => setDataInput(e.target.value)}
                    />
                </div>

                {/* COLUMNA 2: OPERACION */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs">2</span>
                        {t('operation_label')}
                    </label>
                    <textarea 
                        className="flex-1 min-h-[200px] p-4 rounded-lg border-2 border-slate-200 focus:border-indigo-400 focus:ring-0 resize-none bg-white font-mono text-lg"
                        placeholder={t('operation_placeholder')}
                        value={operationInput}
                        onChange={(e) => setOperationInput(e.target.value)}
                    />
                </div>

                {/* COLUMNA 3: SOLUCION (Validada) */}
                <div className="flex flex-col gap-2 relative">
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs">3</span>
                        {t('solution_label')}
                    </label>
                    <div className={`p-4 rounded-lg border-2 border-emerald-100 bg-emerald-50/30 flex flex-col justify-between h-[200px] ${feedback === 'correct' ? 'ring-2 ring-emerald-500' : ''}`}>
                        <div>
                            <p className="text-xs text-slate-500 mb-2 italic">
                                {t('solution_help')}
                            </p>
                            
                            {inputMode === 'text' ? (
                                <input 
                                    type="text"
                                    className="w-full text-center text-2xl font-bold py-3 px-2 rounded border border-emerald-200 focus:border-emerald-500 focus:outline-none bg-white placeholder:text-slate-300"
                                    placeholder="?"
                                    value={solutionInput}
                                    onChange={(e) => {
                                        setSolutionInput(e.target.value);
                                        if(feedback !== 'idle') setFeedback('idle');
                                    }}
                                    onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center gap-1 w-full p-2 bg-white rounded border border-emerald-200">
                                    <input
                                        type="number"
                                        className="w-16 h-10 text-center text-xl font-bold border-b-2 border-slate-300 focus:border-emerald-500 focus:outline-none no-spinner bg-transparent"
                                        placeholder="Num"
                                        value={fractionInput.num}
                                        onChange={(e) => {
                                            setFractionInput(prev => ({ ...prev, num: e.target.value }));
                                            if(feedback !== 'idle') setFeedback('idle');
                                        }}
                                    />
                                    {/* <div className="w-16 h-0.5 bg-slate-800 my-0.5"></div> */} 
                                    {/* Using border-b-2 on upper input instead for tighter integration or stick with explicit div */}
                                    <input
                                        type="number"
                                        className="w-16 h-10 text-center text-xl font-bold focus:border-emerald-500 focus:outline-none no-spinner bg-transparent"
                                        placeholder="Den"
                                        value={fractionInput.den}
                                        onChange={(e) => {
                                            setFractionInput(prev => ({ ...prev, den: e.target.value }));
                                            if(feedback !== 'idle') setFeedback('idle');
                                        }}
                                        onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                                    />
                                </div>
                            )}
                        </div>
                        
                        <div className="mt-4">
                             <Button 
                                onClick={checkAnswer} 
                                className={`w-full ${feedback === 'correct' ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                                disabled={feedback === 'correct'}
                             >
                                {feedback === 'correct' ? (
                                    <span className="flex items-center gap-2"><CheckCircle className="w-5 h-5"/> {t('correct')}</span>
                                ) : t('check')}
                             </Button>
                        </div>
                    </div>
                </div>

            </div>

            {/* ALERTA / AYUDA */}
            <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg text-amber-800 text-sm border border-amber-100">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p 
                    dangerouslySetInnerHTML={{ __html: t.raw('warning_body') }}
                />
            </div>

            {/* FIELD DE MENSAJES */}
            {message && (
                <div className={`p-4 rounded-lg text-center font-bold text-lg animate-in fade-in slide-in-from-bottom-2 ${
                    feedback === 'correct' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                    {message}
                </div>
            )}
        </div>
      )}
    </div>
  );
}
