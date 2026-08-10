/**
 * Điểm import duy nhất cho Patient Web:
 *   import { EyeTrackingEngine } from '@/eye-engine';
 */
export { EyeTrackingEngine, type EyeTrackingEngineOptions } from './EyeTrackingEngine';
export type {
  Point2D,
  GazeSample,
  CalibrationMethod,
  CalibrationPointResult,
  CalibrationProfile,
  TrackingState,
  QualityMetrics,
  DistressSignals,
  DistressScore,
  VitalsSample,
  EngineEventMap,
  EngineEventName,
} from './types';
