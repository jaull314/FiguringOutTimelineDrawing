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
        this.timelineStart =  undefined;
        this.timelineEnd = undefined
        this.displayedEventsArr = [];
        if(!beingCompared){
            this.unitsPerPixel = this.calculateInitialUnitsPerPixel(eventsArr);
            this.timelineStart =  (eventsArr.length > 0) ? eventsArr[0] : 0;
            this.timelineEnd = this.timelineStart + (this.width * this.unitsPerPixel);
        }
    }

    getXCordForEvent(event){
        const distanceFromTimelineStart = event - this.timelineStart
        return Math.floor(distanceFromTimelineStart / this.unitsPerPixel)
    }

    setDisplayedEventsArr(){
        if(this.eventsArr.length == 0) return;
        this.displayedEventsArr = [];
        let currEvent;
        let xCordOfCurrEvent;
        if(this.eventsArr.length == 1){
            currEvent = this.eventsArr[0];
            xCordOfCurrEvent = 0;
            this.displayedEventsArr.push([xCordOfCurrEvent, currEvent]);
        }else{
            for(let i=0; i < this.eventsArr.length; i++){
                currEvent = this.eventsArr[i]
                if(currEvent >= this.timelineStart && currEvent <= this.timelineEnd){
                    xCordOfCurrEvent = this.getXCordForEvent(currEvent);
                    this.displayedEventsArr.push([xCordOfCurrEvent, currEvent])
                }
            }
        }
    }
    
    drawDisplayedEvents(){
        for(let i=0; i < this.displayedEventsArr.length; i++){
            const [xCordOfCurrEvent, currEvent] = this.displayedEventsArr[i];
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
        this.setDisplayedEventsArr();
        // draw a vertical line tick for each event and write out its corresponding text
        this.drawDisplayedEvents();
    }
}


const canvasA = document.getElementById('canvasA');
canvasA.width = window.innerWidth * .8;
canvasA.height = window.innerHeight * .5;
const contextA = canvasA.getContext("2d");
contextA.fillStyle = "red";

const arrTimelineA = [100];
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