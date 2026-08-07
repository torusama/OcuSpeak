import { NormalizedLandmark } from "@mediapipe/tasks-vision";

import {

LEFT_IRIS,

RIGHT_IRIS

} from "./constants";

import {

FaceTrackingData

} from "./types";

export default class IrisTracker{

    static extract(

        landmarks:NormalizedLandmark[]

    ):FaceTrackingData{

        return{

            landmarks,

            leftIris:

            LEFT_IRIS.map(i=>({

                x:landmarks[i].x,

                y:landmarks[i].y

            })),

            rightIris:

            RIGHT_IRIS.map(i=>({

                x:landmarks[i].x,

                y:landmarks[i].y

            }))

        };

    }

}