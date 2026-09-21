import { FieldTransformation, InputType } from '../types';

export interface RawFieldParsed {
  raw: string;
  type: InputType;
  djb2Hash?: number;
  numberStr: string;
  isEmpty: boolean;
}

/**
 * DJB2 32-bit polynomial rolling hash function.
 * Deterministically translates any text string into a 32-bit unsigned integer (0 to 4,294,967,295)
 * without creating arbitrary large integers.
 */
export function djb2Hash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i); // hash * 33 + char
    hash = hash >>> 0; // Enforce 32-bit unsigned integer
  }
  return hash;
}

/**
 * Parses raw input string into pure numbers or deterministic 32-bit DJB2 hash for text
 */
export function parseInputField(rawInput: string): RawFieldParsed {
  const trimmed = rawInput.trim();

  if (!trimmed) {
    return {
      raw: rawInput,
      type: 'empty',
      numberStr: '0',
      isEmpty: true,
    };
  }

  // Check if pure integer digits
  const isPureDigits = /^\d+$/.test(trimmed);

  if (isPureDigits) {
    return {
      raw: rawInput,
      type: 'number',
      numberStr: trimmed,
      isEmpty: false,
    };
  }

  // Text input: convert to deterministic 32-bit integer via DJB2
  const hash = djb2Hash(trimmed);

  return {
    raw: rawInput,
    type: 'text',
    djb2Hash: hash,
    numberStr: hash.toString(),
    isEmpty: false,
  };
}

/**
 * Parses trust coefficient string, clamped to [0.0, 1.0] (default 1.0)
 */
export function parseTrustCoefficient(rawTrust?: string): number {
  if (!rawTrust || !rawTrust.trim()) return 1.0;
  const parsed = parseFloat(rawTrust.trim());
  if (isNaN(parsed)) return 1.0;
  return Math.max(0, Math.min(1, parsed));
}

/**
 * Calculates effective difference based on the trust coefficient:
 * - If C is 1 or near 1: makes distance bigger even if difference between values is small.
 *   Guarantees distance > 50% and similarity < 50% for diverging values under full trust.
 * - If C is small (near 0): C^2 collapses the difference towards 0, minimizing distance to 0.
 */
export function calculateEffectiveDifference(
  baseDiff: number,
  trustCoeff: number,
  isExactMatch: boolean
): number {
  if (isExactMatch || baseDiff === 0) return 0;
  // Magnify differences so that even small differences expand to at least 0.55 when trust is 1
  const magnifiedDiff = Math.min(1.0, Math.max(0.55, Math.pow(baseDiff, 0.05)));
  return Math.min(1.0, Math.pow(trustCoeff, 2) * magnifiedDiff);
}

/**
 * Transforms a pair of inputs (dimension i of Vector A and Vector B) with trust coefficient:
 * 1. Base values: Both elements are divided by the largest value in the pair: max(A, B).
 * 2. Trust logic:
 *    - If C is 1 or near 1: amplifies the difference so that even small differences produce a large distance.
 *    - If C is small (near 0): minimizes the difference towards 0 if values are slightly different.
 */
export function transformPair(
  rawA: string,
  rawB: string,
  rawTrust: string = '1.0'
): {
  transA: FieldTransformation;
  transB: FieldTransformation;
  pairMaxStr: string;
} {
  const parsedA = parseInputField(rawA);
  const parsedB = parseInputField(rawB);
  const trustCoeff = parseTrustCoefficient(rawTrust);

  const isExactMatch = rawA.trim() === rawB.trim();

  let bigA = 0n;
  let bigB = 0n;

  try {
    bigA = parsedA.isEmpty ? 0n : BigInt(parsedA.numberStr);
  } catch {
    bigA = 0n;
  }

  try {
    bigB = parsedB.isEmpty ? 0n : BigInt(parsedB.numberStr);
  } catch {
    bigB = 0n;
  }

  const maxBig = bigA > bigB ? bigA : bigB;
  const pairMaxStr = maxBig.toString();

  let baseValueA = 0;
  let baseValueB = 0;

  if (maxBig > 0n) {
    if (bigA === maxBig) {
      baseValueA = 1.0;
    } else {
      const scale = 10n ** 16n;
      const scaled = (bigA * scale) / maxBig;
      baseValueA = Number(scaled) / 1e16;
    }

    if (bigB === maxBig) {
      baseValueB = 1.0;
    } else {
      const scale = 10n ** 16n;
      const scaled = (bigB * scale) / maxBig;
      baseValueB = Number(scaled) / 1e16;
    }
  }

  const finalValueA = isNaN(baseValueA) ? 0 : baseValueA;
  const safeBaseB = isNaN(baseValueB) ? 0 : baseValueB;

  // Base difference between normalized values
  const delta = safeBaseB - finalValueA;
  const baseDiff = isExactMatch ? 0 : Math.abs(delta);
  const sign = delta >= 0 ? 1 : -1;

  // Effective difference calculation
  const effectiveDiff = calculateEffectiveDifference(baseDiff, trustCoeff, isExactMatch);

  // Adjusted Vector B: when C -> 0, B' -> A (distance minimized)
  // When C -> 1, B' differs from A by the magnified difference (distance enlarged)
  const finalValueB = isExactMatch ? finalValueA : Math.max(0, finalValueA + sign * effectiveDiff);

  const formulaA = parsedA.isEmpty || maxBig === 0n
    ? `0 / ${pairMaxStr || '1'} = 0`
    : `${parsedA.numberStr} / ${pairMaxStr} = ${finalValueA.toFixed(4)}`;

  const formulaB = parsedB.isEmpty || maxBig === 0n
    ? `0 / ${pairMaxStr || '1'} = 0`
    : isExactMatch
      ? `Exact match (${rawB}) → diff = 0`
      : `|Δ_base|=${baseDiff.toFixed(6)}, C=${trustCoeff.toFixed(2)} → |Δ_eff|=${effectiveDiff.toFixed(4)} → B'=${finalValueB.toFixed(4)}`;

  const transA: FieldTransformation = {
    raw: rawA,
    type: parsedA.type,
    djb2Hash: parsedA.djb2Hash,
    numberStr: parsedA.numberStr,
    pairMaxNumberStr: pairMaxStr,
    baseNormalizedValue: finalValueA,
    trustCoefficient: 1.0,
    numericValue: finalValueA,
    baseDifference: 0,
    effectiveDifference: 0,
    formulaStr: formulaA,
    counterpartRaw: rawB,
    isCustomEmpty: parsedA.isEmpty,
  };

  const transB: FieldTransformation = {
    raw: rawB,
    type: parsedB.type,
    djb2Hash: parsedB.djb2Hash,
    numberStr: parsedB.numberStr,
    pairMaxNumberStr: pairMaxStr,
    baseNormalizedValue: safeBaseB,
    trustCoefficient: trustCoeff,
    numericValue: finalValueB,
    baseDifference: baseDiff,
    effectiveDifference: effectiveDiff,
    formulaStr: formulaB,
    counterpartRaw: rawA,
    isCustomEmpty: parsedB.isEmpty,
  };

  return { transA, transB, pairMaxStr };
}

/**
 * Transforms all 5 pairs of inputs for Vector A and Vector B with trust coefficients
 */
export function transformVectorPair(
  inputsA: string[],
  inputsB: string[],
  inputsTrust: string[] = ['1', '1', '1', '1', '1']
): { vectorA: FieldTransformation[]; vectorB: FieldTransformation[] } {
  const vectorA: FieldTransformation[] = [];
  const vectorB: FieldTransformation[] = [];

  for (let i = 0; i < 5; i++) {
    const rawA = inputsA[i] || '';
    const rawB = inputsB[i] || '';
    const rawTrust = inputsTrust[i] ?? '1.0';
    const { transA, transB } = transformPair(rawA, rawB, rawTrust);
    vectorA.push(transA);
    vectorB.push(transB);
  }

  return { vectorA, vectorB };
}

/**
 * Format a number with custom precision and readable separators
 */
export function formatFloat(val: number, precision: number = 6): string {
  if (val === 0) return '0';
  if (val === 1) return '1';
  if (Math.abs(val) < 0.000001) return val.toExponential(4);
  return Number(val.toFixed(precision)).toString();
}
