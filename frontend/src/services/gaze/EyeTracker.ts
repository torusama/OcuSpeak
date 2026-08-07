import {

LEFT_EYE_LEFT,

LEFT_EYE_RIGHT,

RIGHT_EYE_LEFT,

RIGHT_EYE_RIGHT

} from "../mediapipe/constants";

import {

FaceTrackingData

} from "../mediapipe/types";

export interface EyeTrackingResult{

    leftRatioX:number;

    rightRatioX:number;

    leftCenter:{

        x:number;

        y:number;

    };

    rightCenter:{

        x:number;

        y:number;

    };

}

export default class EyeTracker{

    static calculate(

        face:FaceTrackingData

    ):EyeTrackingResult{

        const leftCenter={x:0,y:0};

        const rightCenter={x:0,y:0};

        face.leftIris.forEach(p=>{

            leftCenter.x+=p.x;

            leftCenter.y+=p.y;

        });

        face.rightIris.forEach(p=>{

            rightCenter.x+=p.x;

            rightCenter.y+=p.y;

        });

        leftCenter.x/=5;

        leftCenter.y/=5;

        rightCenter.x/=5;

        rightCenter.y/=5;

        const leftEyeWidth=

            face.landmarks[LEFT_EYE_RIGHT].x-

            face.landmarks[LEFT_EYE_LEFT].x;

        const rightEyeWidth=

            face.landmarks[RIGHT_EYE_LEFT].x-

            face.landmarks[RIGHT_EYE_RIGHT].x;

        const leftRatio=

            (leftCenter.x-

            face.landmarks[LEFT_EYE_LEFT].x)

            /

            leftEyeWidth;

        const rightRatio=

            (face.landmarks[RIGHT_EYE_LEFT].x-

            rightCenter.x)

            /

            rightEyeWidth;

        return{

            leftRatioX:leftRatio,

            rightRatioX:rightRatio,

            leftCenter,

            rightCenter

        };

    }

}