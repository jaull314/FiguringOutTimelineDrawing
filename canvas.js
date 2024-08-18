class Timeline{
    constructor(eventsArr, context){
        eventsArr.sort((a, b) => a - b);
        this.eventsArr = eventsArr;
        this.ctx = context;
        this.xCord = 80;
        this.yCord = 300;
        this.width = 1000;
        this.height = 2;
        /* can also use these two below to determine if scrolling left and right 
        will reveal more timeline in that particular direction */
        this.minEventOfTimeline = (eventsArr.length > 0) ? eventsArr[0] : undefined;
        this.maxEventOfTimeline = (eventsArr.length > 0) ? eventsArr[eventsArr.length - 1] : undefined;
        this.visiblePartOfTimeline= [];
        this.unitsPerPixel = 1;
        this.startOfVisibleTimeline =  undefined;
        this.endOfVisibleTimeline = undefined;
        if(eventsArr.length > 1){
            let timelineRange = eventsArr[eventsArr.length - 1] - eventsArr[0];
            let logOfRange = Math.floor(Math.log10(timelineRange));
            this.unitsPerPixel = 10 ** (logOfRange - 2);
        }
        if(eventsArr.length > 0){
            this.startOfVisibleTimeline =  eventsArr[0];
            this.endOfVisibleTimeline = this.startOfVisibleTimeline + (this.width * this.unitsPerPixel);
        }
        this.isBeingCompared = false;
        this.minEventOfBothTimelines = undefined;
        this.maxEventOfBothTimelines = undefined;
    }

    caclculateUnitsPerPixel(minEvent, maxEvent){
        if(maxEvent > minEvent){
            let timelineRange = maxEvent - minEvent;
            let logOfRange = Math.floor(Math.log10(timelineRange));
            return 10 ** (logOfRange - 2);
        }else{
            return 1;
        }
    }

    setNewUnitsPerPixel(unitsPerPixel){
        this.unitsPerPixel = unitsPerPixel;
        this.startOfVisibleTimeline = this.minEventOfTimeline;
        this.endOfVisibleTimeline = this.startOfVisibleTimeline + (this.width * this.unitsPerPixel);
    }

    //==================This section is only needed for comparing Timelines==========================================
    setMinEventForBothTimelines(otherTimeline){
        if(this.minEventOfTimeline === undefined && otherTimeline.minEventOfTimeline === undefined){
            this.minEventOfBothTimelines = undefined;
            otherTimeline.minEventOfBothTimelines = undefined;

        }else if(this.minEventOfTimeline === undefined && otherTimeline.minEventOfTimeline !== undefined){
            this.minEventOfBothTimelines = otherTimeline.minEventOfTimeline;
            otherTimeline.minEventOfBothTimelines = otherTimeline.minEventOfTimeline;

        }else if(this.minEventOfTimeline !== undefined && otherTimeline.minEventOfTimeline === undefined){
            this.minEventOfBothTimelines = this.minEventOfTimeline;
            otherTimeline.minEventOfBothTimelines = this.minEventOfTimeline;

        }else if(this.minEventOfTimeline <= otherTimeline.minEventOfTimeline){
            this.minEventOfBothTimelines = this.minEventOfTimeline;
            otherTimeline.minEventOfBothTimelines = this.minEventOfTimeline;

        }else{
            this.minEventOfBothTimelines = otherTimeline.minEventOfTimeline;
            otherTimeline.minEventOfBothTimelines = otherTimeline.minEventOfTimeline;
        }
    }

    setMaxEventForBothTimelines(otherTimeline){
        if(this.maxEventOfTimeline === undefined && otherTimeline.maxEventOfTimeline === undefined){
            this.maxEventOfBothTimelines = undefined;
            otherTimeline.maxEventOfBothTimelines = undefined;

        }else if(this.maxEventOfTimeline === undefined && otherTimeline.maxEventOfTimeline !== undefined){
            this.maxEventOfBothTimelines = otherTimeline.maxEventOfTimeline;
            otherTimeline.maxEventOfBothTimelines = otherTimeline.maxEventOfTimeline;

        }else if(this.maxEventOfTimeline !== undefined && otherTimeline.maxEventOfTimeline === undefined){
            this.maxEventOfBothTimelines = this.maxEventOfTimeline;
            otherTimeline.maxEventOfBothTimelines = this.maxEventOfTimeline;

        }else if(this.maxEventOfTimeline >= otherTimeline.maxEventOfTimeline){
            this.maxEventOfBothTimelines = this.maxEventOfTimeline;
            otherTimeline.maxEventOfBothTimelines = this.maxEventOfTimeline;
        }else{
            this.maxEventOfBothTimelines = otherTimeline.maxEventOfTimeline;
            otherTimeline.maxEventOfBothTimelines = otherTimeline.maxEventOfTimeline;
        }
    }

    setupComparedTimelinesForDrawing(otherTimeline){
        this.isBeingCompared = true;
        this.setMinEventForBothTimelines(otherTimeline);
        this.setMaxEventForBothTimelines(otherTimeline);

        const unitsPerPixel = this.caclculateUnitsPerPixel(this.minEventOfBothTimelines, this.maxEventOfBothTimelines);
        this.unitsPerPixel = unitsPerPixel;
        otherTimeline.unitsPerPixel = unitsPerPixel;

        this.startOfVisibleTimeline = this.minEventOfBothTimelines;
        otherTimeline.startOfVisibleTimeline = this.minEventOfBothTimelines;

        this.endOfVisibleTimeline = this.startOfVisibleTimeline + (this.width * this.unitsPerPixel);
        otherTimeline.endOfVisibleTimeline = this.startOfVisibleTimeline + (this.width * this.unitsPerPixel);
    }
    //===========================================================================================================
    
    getXCordForEvent(event){
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
                console.log([xCordOfCurrEvent, currEvent])
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
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        /* draw main horizontal line of timeline
                        (x,  y, width, height)                              */
        this.ctx.fillRect(this.xCord, this.yCord, this.width, this.height);
        /* Based on the unitsPerPixel scale used, find which events fit 
        on the screen and therefore will be need to be displayed */
        this.setVisiblePartOfTimeline();
        // draw a vertical line tick for each event and write out its corresponding text
        this.drawDisplayedEvents();
    }

    scrollRight(){
        if(this.isBeingCompared){
            if(this.endOfVisibleTimeline < this.maxEventOfBothTimelines){
                this.startOfVisibleTimeline = this.endOfVisibleTimeline;
                this.endOfVisibleTimeline = this.startOfVisibleTimeline + (this.width * this.unitsPerPixel);
                this.drawTimeline()
            }
        }else{
            if(this.endOfVisibleTimeline < this.maxEventOfTimeline){
                this.startOfVisibleTimeline = this.endOfVisibleTimeline;
                this.endOfVisibleTimeline = this.startOfVisibleTimeline + (this.width * this.unitsPerPixel);
                this.drawTimeline()
            }
        }
    }
}


const canvasA = document.getElementById('canvasA');
canvasA.width = window.innerWidth * .8;
canvasA.height = window.innerHeight * .5;
const contextA = canvasA.getContext("2d");
contextA.fillStyle = "red";


/*
const canvasB = document.getElementById('canvasB');
canvasB.width = window.innerWidth * .8;
canvasB.height = window.innerHeight * .5;
const contextB = canvasB.getContext("2d");
contextB.fillStyle = "Blue";
*/


const arrTimelineA = [0, 200, 900, 1500];
let timelineA = new Timeline(arrTimelineA, contextA)
timelineA.setNewUnitsPerPixel(1);

//const arrTimelineB = [1,  500, 801, 9990];
//let timelineB = new Timeline(arrTimelineB, contextB) 

//timelineA.setupComparedTimelinesForDrawing(timelineB);
timelineA.drawTimeline();
//timelineB.drawTimeline();

/*
const scrollLeftButton = document.getElementById("scrollLeft")
scrollLeftButton.addEventListener("click", function(e){
    
})
 */
const scrollRightButton = document.getElementById("scrollRight")
scrollRightButton.addEventListener("click", function(e){
    timelineA.scrollRight();
})
   