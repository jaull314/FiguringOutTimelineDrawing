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
}

function getXCord(timeline, currEvent){
    const distanceFromTimelineStart = currEvent - timeline.numUnitsForDisplayedStart
    return Math.floor(distanceFromTimelineStart / timeline.unitsPerPixel)
}

function drawTimeline(timeline){
    /* draw main horizontal line of timeline
                    (x,  y, width, height)                              */
    timeline.ctx.fillRect(timeline.xCord, timeline.yCord, timeline.width, timeline.height);
    // draw a vertical line tick for each event
    if(timeline.eventsArr.length == 0) return;
    if(timeline.eventsArr.length == 1){
        /* this vertical line tick is 1 pixel wide and 44 pixels tall 
                        (x,  y, width, height)             */
        timeline.ctx.fillRect(timeline.xCord, timeline.yCord - 20, 1, 44);
        return;
    }else{
        let currEvent;
        let xCordOfCurrEvent;
        for(let i=0; i < timeline.eventsArr.length; i++){
            currEvent = timeline.eventsArr[i]
            //console.log(timeline.currEvent)
            if(currEvent >= timeline.numUnitsForDisplayedStart && currEvent <= timeline.numUnitsForDisplayedEnd){
                xCordOfCurrEvent = getXCord(timeline, currEvent);
                /* theis vertical line tick is 1 pixel wide and 44 pixels tall 
                        (x,  y, width, height)                              */
                timeline.ctx.fillRect(timeline.xCord + xCordOfCurrEvent, timeline.yCord - 20, 1, 44);
            }
        }
        return;
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
drawTimeline(timelineA)



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
drawTimeline(timelineB)
