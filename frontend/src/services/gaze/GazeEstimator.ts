import { CalibrationResult } from "../calibration/types";

export interface ScreenPoint {
  x: number;
  y: number;
}

export default class GazeEstimator {
  static estimate(
    eyeRatioX: number,
    eyeRatioY: number,
    calibration: CalibrationResult
  ): ScreenPoint {
    return {
      x: eyeRatioX * calibration.scaleX + calibration.offsetX,
      y: eyeRatioY * calibration.scaleY + calibration.offsetY,
    };
  }
}