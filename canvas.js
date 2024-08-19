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
        this.earliestEventOfTimeline = (eventsArr.length > 0) ? eventsArr[0] : undefined;
        this.latestEventOfTimeline = (eventsArr.length > 0) ? eventsArr[eventsArr.length - 1] : undefined;
        this.visiblePartOfTimeline= [];
        this.unitsPerPixel = 1;
        this.maxUnitsPerPixel = 1;
        this.minUnitsPerPixel = .1;
        this.startOfVisibleTimeline =  undefined;
        this.endOfVisibleTimeline = undefined;
        if(eventsArr.length > 1){
            let timelineRange = eventsArr[eventsArr.length - 1] - eventsArr[0];
            let logOfRange = Math.floor(Math.log10(timelineRange));
            this.unitsPerPixel = 10 ** (logOfRange - 2);
            this.maxUnitsPerPixel = 10 ** (logOfRange - 2);
        }
        if(eventsArr.length > 0){
            this.startOfVisibleTimeline =  eventsArr[0];
            this.endOfVisibleTimeline = this.startOfVisibleTimeline + (this.width * this.unitsPerPixel);
        }
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
        this.startOfVisibleTimeline = this.earliestEventOfTimeline;
        this.endOfVisibleTimeline = this.startOfVisibleTimeline + (this.width * this.unitsPerPixel);
    }

    //==================This section is only needed for comparing Timelines==========================================
    setMinEventForBothTimelines(otherTimeline){
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

    setMaxEventForBothTimelines(otherTimeline){
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
        this.setMinEventForBothTimelines(otherTimeline);
        this.setMaxEventForBothTimelines(otherTimeline);

        const unitsPerPixel = this.caclculateUnitsPerPixel(this.earliestEventOfTimeline, this.latestEventOfTimeline);
        this.unitsPerPixel = unitsPerPixel;
        otherTimeline.unitsPerPixel = unitsPerPixel;

        this.startOfVisibleTimeline = this.earliestEventOfTimeline;
        otherTimeline.startOfVisibleTimeline = this.earliestEventOfTimeline;

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
            this.setNewUnitsPerPixel(Math.floor(this.unitsPerPixel / 10));
            this.drawTimeline();
        }
    }

}//end of Timeline Class


const canvasA = document.getElementById('canvasA');
canvasA.width = window.innerWidth * .8;
canvasA.height = window.innerHeight * .5;
const contextA = canvasA.getContext("2d");
contextA.fillStyle = "red";

const arrTimelineA = [0, 200, 900, 1500];
let timelineA = new Timeline(arrTimelineA, contextA)
//timelineA.setNewUnitsPerPixel(1);


const canvasB = document.getElementById('canvasB');
canvasB.width = window.innerWidth * .8;
canvasB.height = window.innerHeight * .5;
const contextB = canvasB.getContext("2d");
contextB.fillStyle = "Blue";

const arrTimelineB = [1,  500, 801, 9990];
let timelineB = new Timeline(arrTimelineB, contextB) 


timelineA.setupComparedTimelinesForDrawing(timelineB);
timelineA.drawTimeline();
timelineB.drawTimeline();


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