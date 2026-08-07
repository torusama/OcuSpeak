import {
    CalibrationResult,
    CalibrationSample
} from "./types";

export default class CalibrationMath{

    static calculate(

        samples:CalibrationSample[]

    ):CalibrationResult{

        if(samples.length<2){

            throw new Error(
                "Need at least 2 calibration samples"
            );

        }

        const first=samples[0];

        const last=samples[samples.length-1];

        const scaleX=

            (last.screenX-first.screenX)/

            (last.eyeX-first.eyeX);

        const scaleY=

            (last.screenY-first.screenY)/

            (last.eyeY-first.eyeY);

        const offsetX=

            first.screenX-

            first.eyeX*scaleX;

        const offsetY=

            first.screenY-

            first.eyeY*scaleY;

        return{

            scaleX,

            scaleY,

            offsetX,

            offsetY

        };

    }

}