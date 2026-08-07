import {
  FilesetResolver,
  FaceLandmarker,
  FaceLandmarkerResult,
} from "@mediapipe/tasks-vision";

import IrisTracker from "./IrisTracker";
class FaceLandmarkerService {
  private detector: FaceLandmarker | null = null;

  async initialize() {
    if (this.detector) return;

    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

    this.detector = await FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task",
      },

      runningMode: "VIDEO",
      numFaces: 1,
      outputFaceBlendshapes: true,
      outputFacialTransformationMatrixes: true,
    });

    console.log("✅ MediaPipe FaceLandmarker loaded");
  }

    detect(video: HTMLVideoElement) {

        if (!this.detector)
            return null;

        const result =
            this.detector.detectForVideo(
                video,
                performance.now()
            );

        if(result.faceLandmarks.length===0)
            return null;

        return IrisTracker.extract(

            result.faceLandmarks[0]

        );

    }
}

export default new FaceLandmarkerService();