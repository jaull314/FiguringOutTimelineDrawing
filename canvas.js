class Timeline{
    constructor(eventsArr, context){
        eventsArr.sort((a, b) => a - b);
        this.eventsArr = eventsArr;
        this.ctx = context;
        this.xCord = 80;
        this.yCord = 300;
        this.width = 1000;
        this.height = 2;
        this.unitsPerPixel = undefined;
        this.visiblePartOfTimeline= [];
        this.startOfVisibleTimeline =  undefined;
        this.endOfVisibleTimeline = undefined;
        this.minOfBothTimelines = undefined;
        this.maxOfBothTimelines = undefined;

        if(eventsArr.length > 1){
            let timelineRange = eventsArr[eventsArr.length - 1] - eventsArr[0];
            let logOfRange = Math.floor(Math.log10(timelineRange));
            this.unitsPerPixel = 10 ** (logOfRange - 2);
        }else{
            this.unitsPerPixel = 1;
        }
        this.startOfVisibleTimeline =  (eventsArr.length > 0) ? eventsArr[0] : 0;
        this.endOfVisibleTimeline = this.startOfVisibleTimeline + (this.width * this.unitsPerPixel);
    }

    setMinForBothTimelines(otherTimeline){
        if(this.eventsArr.length == 0 && otherTimeline.eventsArr.length == 0){
            this.minOfBothTimelines = undefined;
            otherTimeline.minOfBothTimelines = undefined;
        }else if(this.eventsArr.length == 0 && otherTimeline.eventsArr.length > 0){
            this.minOfBothTimelines = otherTimeline.eventsArr[0];
            otherTimeline.minOfBothTimelines = otherTimeline.eventsArr[0];
        }else if(this.eventsArr.length > 0 && otherTimeline.eventsArr.length == 0){
            this.minOfBothTimelines = this.eventsArr[0];
            otherTimeline.minOfBothTimelines = this.eventsArr[0];
        }else if(this.eventsArr[0] <= otherTimeline.eventsArr[0]){
            this.minOfBothTimelines = this.eventsArr[0];
            otherTimeline.minOfBothTimelines = this.eventsArr[0];
        }else{
            this.minOfBothTimelines = otherTimeline.eventsArr[0];
            otherTimeline.minOfBothTimelines = otherTimeline.eventsArr[0];
        }
    }

    setMaxForBothTimelines(otherTimeline){
        if(this.eventsArr.length == 0 && otherTimeline.eventsArr.length == 0){
            this.maxOfBothTimelines = undefined;
            otherTimeline.maxOfBothTimelines = undefined;
        }else if(this.eventsArr.length == 0 && otherTimeline.eventsArr.length > 0){
            this.maxOfBothTimelines = otherTimeline.eventsArr[otherTimeline.eventsArr.length - 1];
            otherTimeline.maxOfBothTimelines = otherTimeline.eventsArr[otherTimeline.eventsArr.length - 1];
        }else if(this.eventsArr.length > 0 && otherTimeline.eventsArr.length == 0){
            this.maxOfBothTimelines = this.eventsArr[this.eventsArr.length - 1];
            otherTimeline.maxOfBothTimelines = this.eventsArr[this.eventsArr.length - 1];
        }else if(this.eventsArr[this.eventsArr.length - 1] >= otherTimeline.eventsArr[otherTimeline.eventsArr.length - 1]){
            this.maxOfBothTimelines = this.eventsArr[this.eventsArr.length - 1];
            otherTimeline.maxOfBothTimelines = this.eventsArr[this.eventsArr.length - 1];
        }else{
            this.maxOfBothTimelines = otherTimeline.eventsArr[otherTimeline.eventsArr.length - 1];
            otherTimeline.maxOfBothTimelines = otherTimeline.eventsArr[otherTimeline.eventsArr.length - 1];
        }
    }

    setUnitsPerPixelForComparedTimelines(otherTimeline){
        this.setMinForBothTimelines(otherTimeline);
        this.setMaxForBothTimelines(otherTimeline);

        if(this.maxOfBothTimelines > this.minOfBothTimelines){
            let timelineRange = this.maxOfBothTimelines - this.minOfBothTimelines;
            let logOfRange = Math.floor(Math.log10(timelineRange));
            this.unitsPerPixel = 10 ** (logOfRange - 2);
            otherTimeline.unitsPerPixel = 10 ** (logOfRange - 2);
        }else{
            this.unitsPerPixel = 1;
            otherTimeline.unitsPerPixel = 1;
        }
    }

    setupComparedTimelinesForDrawing(otherTimeline){
        this.setUnitsPerPixelForComparedTimelines(otherTimeline);

        this.startOfVisibleTimeline = this.minOfBothTimelines;
        otherTimeline.startOfVisibleTimeline = this.minOfBothTimelines;

        this.endOfVisibleTimeline = this.startOfVisibleTimeline + (this.width * this.unitsPerPixel);
        otherTimeline.endOfVisibleTimeline = this.startOfVisibleTimeline + (this.width * this.unitsPerPixel);
    }

    getXCordForEvent(event){
        console.log(this.startOfVisibleTimeline)
        console.log(event)
        const distanceFromTimelineStart = event - this.startOfVisibleTimeline
        return Math.floor(distanceFromTimelineStart / this.unitsPerPixel)
    }

    setVisiblePartOfTimeline(){
        if(this.eventsArr.length == 0) return;

        this.visiblePartOfTimeline = [];
        let currEvent;
        let xCordOfCurrEvent;
        for(let i=0; i < this.eventsArr.length; i++){
            currEvent = this.eventsArr[i]
            if(currEvent >= this.startOfVisibleTimeline && currEvent <= this.endOfVisibleTimeline){
                xCordOfCurrEvent = this.getXCordForEvent(currEvent);
                this.visiblePartOfTimeline.push([xCordOfCurrEvent, currEvent])
            }
        }
    }
    
    drawDisplayedEvents(){
        for(let i=0; i < this.visiblePartOfTimeline.length; i++){
            const [xCordOfCurrEvent, currEvent] = this.visiblePartOfTimeline[i];
            // theis vertical line tick is 1 pixel wide and 44 pixels tall 
            //      (x,  y, width, height)                              
            this.ctx.fillRect(this.xCord + xCordOfCurrEvent, this.yCord - 20, 1, 44);
        }
    }

    drawTimeline(){
        /* draw main horizontal line of timeline
                        (x,  y, width, height)                              */
        this.ctx.fillRect(this.xCord, this.yCord, this.width, this.height);
        /* Based on the unitsPerPixel scale used, find which events fit 
        on the screen and therefore will be need to be displayed */
        this.setVisiblePartOfTimeline();
        // draw a vertical line tick for each event and write out its corresponding text
        this.drawDisplayedEvents();
    }
}


const canvasA = document.getElementById('canvasA');
canvasA.width = window.innerWidth * .8;
canvasA.height = window.innerHeight * .5;
const contextA = canvasA.getContext("2d");
contextA.fillStyle = "red";

const canvasB = document.getElementById('canvasB');
canvasB.width = window.innerWidth * .8;
canvasB.height = window.innerHeight * .5;
const contextB = canvasB.getContext("2d");
contextB.fillStyle = "Blue";

const arrTimelineA = [1000];
let timelineA = new Timeline(arrTimelineA, contextA)

const arrTimelineB = [1,  500, 801, 9990];
let timelineB = new Timeline(arrTimelineB, contextB) 

timelineA.setupComparedTimelinesForDrawing(timelineB);
timelineA.drawTimeline();
timelineB.drawTimeline();