import React, { useState } from 'react';
import { VectorCalculation } from './types';
import { calculateVectorCosine } from './utils/vectorMath';
import { formatFloat } from './utils/transformation';

export default function App() {
  const [inputsA, setInputsA] = useState<string[]>(['22', '7', '890', 'cat', '12']);
  const [inputsB, setInputsB] = useState<string[]>(['23', '8', '905', 'car', '13']);
  const [inputsTrust, setInputsTrust] = useState<string[]>(['1.0', '1.0', '1.0', '1.0', '1.0']);
  const [calculation, setCalculation] = useState<VectorCalculation | null>(() =>
    calculateVectorCosine(['22', '7', '890', 'cat', '12'], ['23', '8', '905', 'car', '13'], ['1.0', '1.0', '1.0', '1.0', '1.0'])
  );

  const handleInputChangeA = (index: number, val: string) => {
    setInputsA((prev) => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

  const handleInputChangeB = (index: number, val: string) => {
    setInputsB((prev) => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

  const handleInputChangeTrust = (index: number, val: string) => {
    setInputsTrust((prev) => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

  const handleCalculate = () => {
    const result = calculateVectorCosine(inputsA, inputsB, inputsTrust);
    setCalculation(result);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-7">
        
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Vector Distance & Cosine Calculator
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            Values are divided by the largest value in the pair (text is deterministically hashed via 32-bit DJB2). When trust is 1 or near 1, distance is magnified even for small differences; when trust is small, distance is minimized towards 0.
          </p>
        </div>

        {/* 3 Columns for Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Column 1: Set 1 (Vector A) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-800">Set 1 (Vector A)</h2>
              <span className="text-[11px] font-medium text-slate-400">Reference</span>
            </div>
            <div className="space-y-2.5">
              {inputsA.map((val, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs font-mono font-medium text-slate-400 w-6">A{idx + 1}</span>
                  <input
                    id={`input-a-${idx + 1}`}
                    type="text"
                    value={val}
                    onChange={(e) => handleInputChangeA(idx, e.target.value)}
                    placeholder={`Input A${idx + 1}`}
                    className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-lg text-sm text-slate-900 font-mono focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Set 2 (Vector B - Right side) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-800">Set 2 (Vector B)</h2>
              <span className="text-[11px] font-medium text-slate-400">Right Side</span>
            </div>
            <div className="space-y-2.5">
              {inputsB.map((val, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs font-mono font-medium text-slate-400 w-6">B{idx + 1}</span>
                  <input
                    id={`input-b-${idx + 1}`}
                    type="text"
                    value={val}
                    onChange={(e) => handleInputChangeB(idx, e.target.value)}
                    placeholder={`Input B${idx + 1}`}
                    className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-lg text-sm text-slate-900 font-mono focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Coefficient of Trust */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-800">Trust Coefficient (C)</h2>
              <span className="text-[11px] font-medium text-indigo-600 font-mono">0.0 – 1.0</span>
            </div>
            <div className="space-y-2.5">
              {inputsTrust.map((val, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs font-mono font-medium text-indigo-500 w-6">C{idx + 1}</span>
                  <input
                    id={`input-trust-${idx + 1}`}
                    type="number"
                    step="0.05"
                    min="0"
                    max="1"
                    value={val}
                    onChange={(e) => handleInputChangeTrust(idx, e.target.value)}
                    placeholder="1.0"
                    className="w-full px-3 py-2 bg-indigo-50/40 hover:bg-indigo-50/70 focus:bg-white border border-indigo-200/80 rounded-lg text-sm text-slate-900 font-mono focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Calculate Button */}
        <div>
          <button
            id="calculate-btn"
            onClick={handleCalculate}
            className="w-full py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-xl transition-colors shadow-xs cursor-pointer text-sm"
          >
            Calculate
          </button>
        </div>

        {/* Output Result */}
        {calculation && (
          <div id="result-container" className="pt-4 border-t border-slate-100 space-y-6">
            
            {/* Primary Metrics Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* Cosine Distance Card */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 text-center space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Cosine Distance
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
                  {calculation.cosineDistance !== null
                    ? calculation.cosineDistance.toFixed(6)
                    : 'Undefined'}
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  {calculation.overallTrust >= 0.9 ? 'Magnified by high trust' : calculation.overallTrust <= 0.2 ? 'Minimized by low trust' : 'Trust adjusted'}
                </div>
              </div>

              {/* Euclidean Distance Card */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 text-center space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Euclidean Distance
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
                  {calculation.euclideanDistance.toFixed(6)}
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  Base diff: {calculation.rawEuclideanDistance.toFixed(4)}
                </div>
              </div>

              {/* Cosine Similarity Card */}
              <div className="bg-indigo-50/60 rounded-xl p-4 border border-indigo-100 text-center space-y-1">
                <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider block">
                  Cosine Similarity
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-indigo-700 font-mono">
                  {calculation.cosineSimilarity !== null
                    ? calculation.cosineSimilarity.toFixed(6)
                    : 'Undefined'}
                </div>
                <div className="text-[11px] text-indigo-600/80 font-mono">
                  {calculation.similarityPercentage !== null ? `${calculation.similarityPercentage.toFixed(2)}%` : ''}
                </div>
              </div>

            </div>

            {/* Pairwise Dimension Breakdown Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-100/80 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Dim</th>
                    <th className="py-2.5 px-3">Pair Max</th>
                    <th className="py-2.5 px-3">Vector A (Norm)</th>
                    <th className="py-2.5 px-3">Vector B (Base)</th>
                    <th className="py-2.5 px-3">Base Diff</th>
                    <th className="py-2.5 px-3 text-indigo-700 font-bold">Trust (C)</th>
                    <th className="py-2.5 px-3 text-indigo-900 font-bold">Vector B (Adjusted)</th>
                    <th className="py-2.5 px-3 text-slate-800 font-bold">Effective Diff |A - B&apos;|</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {calculation.vectorA.map((a, i) => {
                    const b = calculation.vectorB[i];
                    return (
                      <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2 px-3 font-semibold text-slate-500">#{i + 1}</td>
                        <td className="py-2 px-3 text-slate-600 font-mono">{a.pairMaxNumberStr}</td>
                        <td className="py-2 px-3 text-slate-900 font-semibold">
                          {formatFloat(a.numericValue, 4)}
                          <span className="text-[10px] text-slate-400 font-normal ml-1">
                            ({a.type === 'text' ? `DJB2: ${a.numberStr}` : a.numberStr})
                          </span>
                        </td>
                        <td className="py-2 px-3 text-slate-700">
                          {formatFloat(b.baseNormalizedValue, 4)}
                          <span className="text-[10px] text-slate-400 font-normal ml-1">
                            ({b.type === 'text' ? `DJB2: ${b.numberStr}` : b.numberStr})
                          </span>
                        </td>
                        <td className="py-2 px-3 font-mono text-slate-500">
                          {formatFloat(b.baseDifference, 4)}
                        </td>
                        <td className="py-2 px-3 font-bold text-indigo-600">
                          {b.trustCoefficient.toFixed(2)}
                        </td>
                        <td className="py-2 px-3 font-bold text-indigo-900">
                          {formatFloat(b.numericValue, 4)}
                        </td>
                        <td className="py-2 px-3 font-mono font-bold text-slate-900">
                          {formatFloat(b.effectiveDifference, 4)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Norms & Angle Detail */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-500 px-1">
              <span>‖A‖ = {calculation.normA.toFixed(4)}</span>
              <span>‖B_adj‖ = {calculation.normB.toFixed(4)}</span>
              <span>Dot Product = {calculation.dotProduct.toFixed(4)}</span>
              <span>
                Angle = {calculation.angleDegrees !== null ? `${calculation.angleDegrees.toFixed(2)}°` : 'N/A'}
              </span>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
