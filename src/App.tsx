import React, { useState } from 'react';
import { VectorCalculation } from './types';
import { calculateVectorCosine } from './utils/vectorMath';
import { formatFloat } from './utils/transformation';

export default function App() {
  const [inputsA, setInputsA] = useState<string[]>(['7898', '240', '890', 'TEST1', '1020']);
  const [inputsB, setInputsB] = useState<string[]>(['7889', '240', '890', 'TEST1', '1020']);
  const [inputsTrust, setInputsTrust] = useState<string[]>(['0.5', '1.0', '1.0', '1.0', '1.0']);
  const [calculation, setCalculation] = useState<VectorCalculation | null>(() =>
    calculateVectorCosine(['7898', '240', '890', 'TEST1', '1020'], ['7889', '240', '890', 'TEST1', '1020'], ['0.5', '1.0', '1.0', '1.0', '1.0'])
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
            Cosine similarity
          </h1>
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
            <div className="max-w-md mx-auto">
              {/* Cosine Similarity Card */}
              <div className="bg-indigo-50/60 rounded-xl p-5 border border-indigo-100 text-center space-y-1.5">
                <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider block">
                  Cosine Similarity
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-indigo-700 font-mono">
                  {calculation.cosineSimilarity !== null
                    ? calculation.cosineSimilarity.toFixed(6)
                    : 'Undefined'}
                </div>
                <div className="text-xs font-medium text-indigo-600/80 font-mono">
                  {calculation.similarityPercentage !== null ? `${calculation.similarityPercentage.toFixed(2)}% match` : ''}
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
