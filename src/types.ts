export type InputType = 'number' | 'text' | 'empty';

export interface AsciiCharacter {
  char: string;
  ascii: number;
}

export interface FieldTransformation {
  raw: string;
  type: InputType;
  numberStr: string;
  djb2Hash?: number;
  pairMaxNumberStr: string;
  baseNormalizedValue: number;
  trustCoefficient: number;
  numericValue: number;
  baseDifference: number;
  effectiveDifference: number;
  formulaStr: string;
  counterpartRaw?: string;
  isCustomEmpty?: boolean;
}

export interface VectorCalculation {
  vectorA: FieldTransformation[];
  vectorB: FieldTransformation[];
  dotProduct: number;
  normA: number;
  normB: number;
  cosineSimilarity: number | null;
  cosineDistance: number | null;
  euclideanDistance: number;
  rawCosineDistance: number | null;
  rawEuclideanDistance: number;
  overallTrust: number;
  angleRadians: number | null;
  angleDegrees: number | null;
  similarityPercentage: number | null;
  dimensionProducts: number[];
  calculatedAt: string;
}
