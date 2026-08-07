import {
    FilesetResolver,
    FaceLandmarker
} from "@mediapipe/tasks-vision";

class FaceLandmarkerService {

    private detector: FaceLandmarker | null = null;

    async initialize() {

        if (this.detector) return;

        const vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        this.detector = await FaceLandmarker.createFromOptions(
            vision,
            {
                baseOptions: {
                    modelAssetPath:
                        "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task"
                },
                runningMode: "VIDEO",
                numFaces: 1,
                outputFaceBlendshapes: true,
                outputFacialTransformationMatrixes: true
            }
        );

        console.log("MediaPipe Loaded");
    }

    detect(video: HTMLVideoElement) {

        if (!this.detector) return null;

        return this.detector.detectForVideo(
            video,
            performance.now()
        );
    }
}

export default new FaceLandmarkerService();