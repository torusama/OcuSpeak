import { NormalizedLandmark } from "@mediapipe/tasks-vision";

export interface IrisPoint{

    x:number;

    y:number;

}

export interface FaceTrackingData{

    landmarks:NormalizedLandmark[];

    leftIris:IrisPoint[];

    rightIris:IrisPoint[];

}