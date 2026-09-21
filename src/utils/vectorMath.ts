import { VectorCalculation } from '../types';
import { transformVectorPair } from './transformation';

/**
 * Calculates vector cosine similarity and distance for two 5-dimensional vectors.
 *
 * Core Logic:
 * - Pairwise max normalization: each pair is divided by max(A, B).
 * - Trust Coefficient (C):
 *   - If C is 1 or near 1: makes distance bigger even if the difference between values is small.
 *     In the default example where values are slightly different and C = 1, similarity is < 50%
 *     (e.g., ~40%) and distance is > 50% (e.g., ~60%).
 *   - If C is small (near 0): minimizes distance towards 0 if values are slightly different,
 *     approaching 100% similarity and 0 distance at C = 0.
 */
export function calculateVectorCosine(
  inputsA: string[],
  inputsB: string[],
  inputsTrust: string[] = ['1', '1', '1', '1', '1']
): VectorCalculation {
  const { vectorA, vectorB } = transformVectorPair(inputsA, inputsB, inputsTrust);

  const dimensionProducts = vectorA.map((a, i) => a.numericValue * vectorB[i].numericValue);
  const dotProduct = dimensionProducts.reduce((sum, val) => sum + val, 0);

  const sumSqA = vectorA.reduce((sum, a) => sum + a.numericValue ** 2, 0);
  const sumSqB = vectorB.reduce((sum, b) => sum + b.numericValue ** 2, 0);

  const normA = Math.sqrt(sumSqA);
  const normB = Math.sqrt(sumSqB);

  // Overall average trust
  const overallTrust =
    vectorB.reduce((sum, b) => sum + b.trustCoefficient, 0) / vectorB.length;

  // Baseline untrusted Euclidean distance
  const rawSumSqDiff = vectorA.reduce(
    (sum, a, i) => sum + (a.numericValue - vectorB[i].baseNormalizedValue) ** 2,
    0
  );
  const rawEuclideanDistance = Math.sqrt(rawSumSqDiff);

  // Baseline untrusted distance
  const rawAvgDiff =
    vectorB.reduce((sum, b) => sum + b.baseDifference, 0) / vectorB.length;
  const rawCosineDistance = Math.min(1, Math.max(0, rawAvgDiff));

  // Adjusted Euclidean distance between A and B'
  const sumSqDiff = vectorA.reduce(
    (sum, a, i) => sum + (a.numericValue - vectorB[i].numericValue) ** 2,
    0
  );
  const euclideanDistance = Math.sqrt(sumSqDiff);

  // Average effective distance across dimensions
  const avgEffectiveDistance =
    vectorB.reduce((sum, b) => sum + b.effectiveDifference, 0) / vectorB.length;

  // Trust-adjusted Cosine Distance and Cosine Similarity:
  // - If values are slightly different and C = 1 for all, avgEffectiveDistance ~ 0.594,
  //   resulting in Cosine Similarity ~ 0.406 (< 50%) and Cosine Distance ~ 0.594.
  // - If C is small (near 0), avgEffectiveDistance approaches 0,
  //   resulting in Cosine Similarity approaching 1.0 (100%) and Distance approaching 0.
  const cosineDistance = Math.max(0, Math.min(1, avgEffectiveDistance));
  const cosineSimilarity = Math.max(0, Math.min(1, 1 - cosineDistance));
  const similarityPercentage = cosineSimilarity * 100;

  // Angle derived from cosine similarity
  const angleRadians = Math.acos(Math.max(-1, Math.min(1, cosineSimilarity)));
  const angleDegrees = (angleRadians * 180) / Math.PI;

  return {
    vectorA,
    vectorB,
    dotProduct,
    normA,
    normB,
    cosineSimilarity,
    cosineDistance,
    euclideanDistance,
    rawCosineDistance,
    rawEuclideanDistance,
    overallTrust,
    angleRadians,
    angleDegrees,
    similarityPercentage,
    dimensionProducts,
    calculatedAt: new Date().toLocaleTimeString(),
  };
}
