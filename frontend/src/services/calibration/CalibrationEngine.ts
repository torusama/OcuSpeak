export interface CalibrationPoint {

    screenX:number;

    screenY:number;

    eyeX:number;

    eyeY:number;

}

export default class CalibrationEngine{

    private samples:CalibrationPoint[]=[];

    addSample(

        screenX:number,

        screenY:number,

        eyeX:number,

        eyeY:number

    ){

        this.samples.push({

            screenX,

            screenY,

            eyeX,

            eyeY

        });

    }

    getSamples(){

        return this.samples;

    }

    clear(){

        this.samples=[];

    }

}