class Timeline{
    calculateInitialUnitsPerPixel(eventsArr){
        if(eventsArr.length > 1){
            let timelineRange = eventsArr[eventsArr.length - 1] - eventsArr[0]
            let logOfRange = Math.floor(Math.log10(timelineRange))
            return 10 ** (logOfRange - 2)
        }else{
            return undefined;
        }
    }

    constructor(eventsArr, context, beingCompared){
        this.eventsArr = eventsArr;
        this.ctx = context;
        this.xCord = 80;
        this.yCord = 300;
        this.width = 1000;
        this.height = 2;
        this.unitsPerPixel = undefined;
        this.numUnitsForDisplayedStart =  undefined;
        this.numUnitsForDisplayedEnd = undefined
        if(!beingCompared){
            this.unitsPerPixel = this.calculateInitialUnitsPerPixel(eventsArr);
            this.numUnitsForDisplayedStart =  (eventsArr.length > 0) ? eventsArr[0] : 0;
            this.numUnitsForDisplayedEnd = this.numUnitsForDisplayedStart + (this.width * this.unitsPerPixel);
        }
    }

    getXCordForEvent(event){
        const distanceFromTimelineStart = event - this.numUnitsForDisplayedStart
        return Math.floor(distanceFromTimelineStart / this.unitsPerPixel)
    }

    drawTimeline(){
        /* draw main horizontal line of timeline
                        (x,  y, width, height)                              */
        this.ctx.fillRect(this.xCord, this.yCord, this.width, this.height);
        // draw a vertical line tick for each event
        if(this.eventsArr.length == 0) return;
        if(this.eventsArr.length == 1){
            /* this vertical line tick is 1 pixel wide and 44 pixels tall 
                            (x,  y, width, height)             */
            this.ctx.fillRect(this.xCord, this.yCord - 20, 1, 44);
            return;
        }else{
            let currEvent;
            let xCordOfCurrEvent;
            for(let i=0; i < this.eventsArr.length; i++){
                currEvent = this.eventsArr[i]
                //console.log(timeline.currEvent)
                if(currEvent >= this.numUnitsForDisplayedStart && currEvent <= this.numUnitsForDisplayedEnd){
                    xCordOfCurrEvent = this.getXCordForEvent(currEvent);
                    /* theis vertical line tick is 1 pixel wide and 44 pixels tall 
                            (x,  y, width, height)                              */
                    this.ctx.fillRect(this.xCord + xCordOfCurrEvent, this.yCord - 20, 1, 44);
                }
            }
            return;
        }
    }
}



const canvasA = document.getElementById('canvasA');
canvasA.width = window.innerWidth * .8;
canvasA.height = window.innerHeight * .5;
const contextA = canvasA.getContext("2d");
contextA.fillStyle = "red";

const arrTimelineA = [100, 500, 701, 899];
arrTimelineA.sort((a, b) => {
    return a - b;
})
let timelineA = new Timeline(arrTimelineA, contextA, false)
timelineA.drawTimeline()



const canvasB = document.getElementById('canvasB');
canvasB.width = window.innerWidth * .8;
canvasB.height = window.innerHeight * .5;
const contextB = canvasB.getContext("2d");
contextB.fillStyle = "Blue";

const arrTimelineB = [100, 500, 801, 1099];
arrTimelineB.sort((a, b) => {
    return a - b;
})
let timelineB = new Timeline(arrTimelineB, contextB, false) 
timelineB.drawTimeline()