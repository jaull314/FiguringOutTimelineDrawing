import TimelineEvent  from "./TimelineEvent.js";

class Timeline{
    constructor(context, eventsArr){
        eventsArr.sort((a, b) => a - b);
        this.eventsArr = eventsArr;
        this.ctx = context;
        this.xCord = 80;
        this.yCord = 250;
        this.width = 1000;
        this.height = 2;
        this.timelineTickYCord = 230;
        /* can also use these two below to determine if scrolling left and right 
        will reveal more timeline in that particular direction */
        this.earliestEventOfTimeline = (eventsArr.length > 0) ? eventsArr[0].timeOfEvent : undefined;
        this.latestEventOfTimeline = (eventsArr.length > 0) ? eventsArr[eventsArr.length - 1].timeOfEvent : undefined;
        this.visiblePartOfTimeline= [];
        this.unitsPerPixel = 1;
        this.maxUnitsPerPixel = 1;
        this.minUnitsPerPixel = .01;
        this.startOfVisibleTimeline =  undefined;
        this.endOfVisibleTimeline = undefined;
        if(eventsArr.length > 1){
            let timelineRange = eventsArr[eventsArr.length - 1].timeOfEvent - eventsArr[0].timeOfEvent;
            let logOfRange = Math.floor(Math.log10(timelineRange));
            this.unitsPerPixel = 10 ** (logOfRange - 2);
            this.maxUnitsPerPixel = 10 ** (logOfRange - 2);
        }
        if(eventsArr.length > 0){
            this.startOfVisibleTimeline =  eventsArr[0].timeOfEvent;
            this.endOfVisibleTimeline = this.startOfVisibleTimeline + (this.width * this.unitsPerPixel);
        }
        this.drawQueue = [];
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
        this.endOfVisibleTimeline = this.startOfVisibleTimeline + (this.width * this.unitsPerPixel);
    }

    //==================This section is only needed for comparing Timelines==========================================
    setEarliestEventForBothTimelines(otherTimeline){
        if(this.earliestEventOfTimeline === undefined && otherTimeline.earliestEventOfTimeline !== undefined){
            this.earliestEventOfTimeline = otherTimeline.earliestEventOfTimeline;

        }else if(this.earliestEventOfTimeline !== undefined && otherTimeline.earliestEventOfTimeline === undefined){
            otherTimeline.earliestEventOfTimeline = this.earliestEventOfTimeline;

        }else if(this.earliestEventOfTimeline <= otherTimeline.earliestEventOfTimeline){
            otherTimeline.earliestEventOfTimeline = this.earliestEventOfTimeline;

        }else{
            this.earliestEventOfTimeline = otherTimeline.earliestEventOfTimeline;
        }
    }

    setLatestEventForBothTimelines(otherTimeline){
        if(this.latestEventOfTimeline === undefined && otherTimeline.latestEventOfTimeline !== undefined){
            this.latestEventOfTimeline = otherTimeline.latestEventOfTimeline;

        }else if(this.latestEventOfTimeline !== undefined && otherTimeline.latestEventOfTimeline === undefined){
            otherTimeline.latestEventOfTimeline = this.latestEventOfTimeline;

        }else if(this.latestEventOfTimeline >= otherTimeline.latestEventOfTimeline){
            otherTimeline.latestEventOfTimeline = this.latestEventOfTimeline;

        }else{
            this.latestEventOfTimeline = otherTimeline.latestEventOfTimeline;
        }
    }

    setupComparedTimelinesForDrawing(otherTimeline){
        this.setEarliestEventForBothTimelines(otherTimeline);
        this.setLatestEventForBothTimelines(otherTimeline);

        const unitsPerPixel = this.caclculateUnitsPerPixel(this.earliestEventOfTimeline, this.latestEventOfTimeline);
        this.unitsPerPixel = unitsPerPixel;
        this.maxUnitsPerPixel = unitsPerPixel;
        otherTimeline.unitsPerPixel = unitsPerPixel;
        otherTimeline.maxUnitsPerPixel = unitsPerPixel;

        this.startOfVisibleTimeline = this.earliestEventOfTimeline;
        otherTimeline.startOfVisibleTimeline = this.earliestEventOfTimeline;

        this.endOfVisibleTimeline = this.startOfVisibleTimeline + (this.width * this.unitsPerPixel);
        otherTimeline.endOfVisibleTimeline = this.startOfVisibleTimeline + (this.width * this.unitsPerPixel);
    }
    //===========================================================================================================
    
    roundPixelXCordToNearestHundred(xCord){
        return Math.round(xCord / 100) * 100;
    }

    getXCordForEvent(event){
        const distanceFromTimelineStart = event.timeOfEvent - this.startOfVisibleTimeline
        return Math.floor(distanceFromTimelineStart / this.unitsPerPixel)
    }

    
    setVisiblePartOfTimeline(){
        if(this.eventsArr.length == 0) return;
        this.visiblePartOfTimeline = [];
        let currEvent;
        for(let i=0; i < this.eventsArr.length; i++){
            currEvent = this.eventsArr[i]
            if(currEvent.timeOfEvent >= this.startOfVisibleTimeline && currEvent.timeOfEvent <= this.endOfVisibleTimeline){
                currEvent.xCord = this.getXCordForEvent(currEvent);
                this.visiblePartOfTimeline.push(currEvent)
            }
        }
    }

    setDrawQueue(){
        this.drawQueue = [];
        let lastXCord = undefined;
        let numWithXCord = 0;
        const shiftForDrawnEventYCord = (5 * 15);
        for(let i=0; i < this.visiblePartOfTimeline.length; i++){
            let currEvent = this.visiblePartOfTimeline[i];
            numWithXCord = (currEvent.xCord !== lastXCord) ? 1 : numWithXCord + 1;

            if(numWithXCord <= 3){
                let numXCordAlreadyInQueue = (numWithXCord - 1);
                let indexOfFirstXCord = this.drawQueue.length - numXCordAlreadyInQueue;
                //shift yCord for each drawQueue Event with the same xCord as visibleTimeline[i]
                for(let i=this.drawQueue.length - 1; i >= indexOfFirstXCord; i--){
                    // this yCord is for the last line of text in the current drawQueue Event
                    this.drawQueue[i].yCord = this.drawQueue[i].yCord - shiftForDrawnEventYCord;
                }
                // this yCord is for the last line of text in the current drawQueue Event
                currEvent.yCord = 230;
                this.drawQueue.push(currEvent)
                //drawQueue.push([xCord, 230, eventTitleAndTime])

            }else{
                this.drawQueue.pop();
                this.drawQueue.pop();

                let elipsisObj = currEvent.returnElipsisObj();
                elipsisObj.yCord = 230 - shiftForDrawnEventYCord;
                this.drawQueue.push(elipsisObj);

                // this yCord is for the last line of text in the current drawQueue Event
                currEvent.yCord = 230;
                this.drawQueue.push(currEvent);
                //drawQueue.push([xCord, 230, eventTitleAndTime])
            }
            lastXCord = currEvent.xCord;  
        }
    }

    drawEvent(currEvent){
        let currYCord = currEvent.yCord - currEvent.lineHeight;
        for(let i=currEvent.titleAndTime.length - 1; i >= 0; i--){
            this.ctx.fillText(currEvent.titleAndTime[i], this.xCord + currEvent.xCord, currYCord)
            currYCord -= currEvent.lineHeight;
        }
        // theis vertical line tick is 1 pixel wide and 44 pixels tall 
        //                              (x,                  y,                width, height) 
        this.ctx.fillRect(this.xCord + currEvent.xCord, this.timelineTickYCord, 1, 42);

    }
    
    drawTimeline(){
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        /* draw main horizontal line of timeline
                        (x,  y, width, height)                              */
        this.ctx.fillRect(this.xCord, this.yCord, this.width, this.height);
        /* Based on the unitsPerPixel scale used, find which events fit 
        on the screen and therefore will be need to be displayed */
        this.setVisiblePartOfTimeline();
        this.setDrawQueue();
        
        for(let i=0; i < this.drawQueue.length; i++){
            this.drawEvent(this.drawQueue[i]);
            //this.ctx.fillRect(this.xCord + this.drawQueue[i].xCord, this.timelineTickYCord, 1, 42);
        }
        console.log("unitsPerPixel: ", this.unitsPerPixel);
        console.log("startOfVisibleTimeline: ", this.startOfVisibleTimeline);
        console.log("endOfVisibleTimeline: ", this.endOfVisibleTimeline);
        console.log("===================================================")
    }

    scrollLeftForTimeline(){
        if(this.startOfVisibleTimeline > this.earliestEventOfTimeline){
            this.startOfVisibleTimeline = this.startOfVisibleTimeline -  (this.width * this.unitsPerPixel);
            if(this.startOfVisibleTimeline < this.earliestEventOfTimeline){
                this.startOfVisibleTimeline = this.earliestEventOfTimeline;
            }
            this.endOfVisibleTimeline = this.startOfVisibleTimeline + (this.width * this.unitsPerPixel);
            this.drawTimeline()
        }
    }

    scrollRightForTimeline(){
        if(this.endOfVisibleTimeline < this.latestEventOfTimeline){
            this.startOfVisibleTimeline = this.endOfVisibleTimeline;
            this.endOfVisibleTimeline = this.startOfVisibleTimeline + (this.width * this.unitsPerPixel);
            this.drawTimeline()
        }
    }

    zoomOutForTimeline(){
        if(this.unitsPerPixel < this.maxUnitsPerPixel){
            this.setNewUnitsPerPixel(this.unitsPerPixel * 10);
            this.drawTimeline();
        }
    }

    zoomInForTimeline(){
        if(this.unitsPerPixel > this.minUnitsPerPixel){
            this.setNewUnitsPerPixel(this.unitsPerPixel / 10);
            this.drawTimeline();
        }
    }

}//end of Timeline Class


const canvasA = document.getElementById('canvasA');
canvasA.width = window.innerWidth * .8;
canvasA.height = window.innerHeight * .4;
const contextA = canvasA.getContext("2d");
contextA.font = "575 12px serif";
contextA.textAlign = "center";
contextA.fillStyle = "red";

const arrTimelineA = [  new TimelineEvent("blah", 0),
                        new TimelineEvent("", 200), 
                        new TimelineEvent("", 900), 
                        new TimelineEvent("", 1500)];
let timelineA = new Timeline(contextA, arrTimelineA)



const canvasB = document.getElementById('canvasB');
canvasB.width = window.innerWidth * .8;
canvasB.height = window.innerHeight * .4;
const contextB = canvasB.getContext("2d");
contextB.font = "575 12px serif";
contextB.textAlign = "center";
contextB.fillStyle = "Blue";

const arrTimelineB = [  new TimelineEvent("blah", 1),  
                        new TimelineEvent("", 500), 
                        new TimelineEvent("", 801), 
                        new TimelineEvent("",9990)];
let timelineB = new Timeline(contextB, arrTimelineB) 




//timelineA.setNewUnitsPerPixel(1);
timelineA.setupComparedTimelinesForDrawing(timelineB);
timelineA.drawTimeline();
timelineB.drawTimeline();
console.log(timelineA.eventsArr)



const scrollLeftButton = document.getElementById("scrollLeft")
scrollLeftButton.addEventListener("click", function(e){
    timelineA.scrollLeftForTimeline();
    timelineB.scrollLeftForTimeline();
})

const scrollRightButton = document.getElementById("scrollRight")
scrollRightButton.addEventListener("click", function(e){
    timelineA.scrollRightForTimeline();
    timelineB.scrollRightForTimeline();
})

const zoomOutButton = document.getElementById("zoomOut")
zoomOutButton.addEventListener("click", function(e){
    timelineA.zoomOutForTimeline();
    timelineB.zoomOutForTimeline();
})

const zoomInButton = document.getElementById("zoomIn")
zoomInButton.addEventListener("click", function(e){
    timelineA.zoomInForTimeline();
    timelineB.zoomInForTimeline();
})