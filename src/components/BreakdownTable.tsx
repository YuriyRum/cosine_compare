import React from 'react';
import { VectorCalculation } from '../types';
import { formatFloat } from '../utils/transformation';

interface BreakdownTableProps {
  calculation: VectorCalculation;
}

export const BreakdownTable: React.FC<BreakdownTableProps> = ({ calculation }) => {
  return (
    <div className="space-y-4 pt-2">
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

      {/* Norms & Angle Detail Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-500 px-1">
        <span>‖A‖ = {calculation.normA.toFixed(4)}</span>
        <span>‖B_adj‖ = {calculation.normB.toFixed(4)}</span>
        <span>Dot Product = {calculation.dotProduct.toFixed(4)}</span>
        <span>
          Angle = {calculation.angleDegrees !== null ? `${calculation.angleDegrees.toFixed(2)}°` : 'N/A'}
        </span>
      </div>
    </div>
  );
};
