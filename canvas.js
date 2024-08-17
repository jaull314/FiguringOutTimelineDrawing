function calculateInitialUnitsPerPixel(timeline){
    if(timeline.eventsArr.length > 1){
        let timelineRange = timeline.eventsArr[timeline.eventsArr.length - 1] - timeline.eventsArr[0]
        let logOfRange = Math.floor(Math.log10(timelineRange))
        return 10 ** (logOfRange - 2)
    }else{
        return undefined;
    }
}

function getXCord(timeline){
    const distanceFromTimelineStart = timeline.currEvent - timeline.numUnitsForDisplayedStart
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
        for(let i=0; i < timeline.eventsArr.length; i++){
            timeline.currEvent = timeline.eventsArr[i]
            //console.log(timeline.currEvent)
            if(timeline.currEvent >= timeline.numUnitsForDisplayedStart && timeline.currEvent <= timeline.numUnitsForDisplayedEnd){
                timeline.xCordOfCurrEvent = getXCord(timeline);
                /* theis vertical line tick is 1 pixel wide and 44 pixels tall 
                        (x,  y, width, height)                              */
                timeline.ctx.fillRect(timeline.xCord + timeline.xCordOfCurrEvent, timeline.yCord - 20, 1, 44);
            }
        }
        return;
    }
}

const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth * .8;
canvas.height = window.innerHeight * .8;
const context = canvas.getContext("2d");
context.fillStyle = "red";

const timelineArr = [100, 500, 801, 1099];
timelineArr.sort((a, b) => {
    return a - b;
})
let timeline = {
    eventsArr : timelineArr,
    ctx: context,
    xCord: 80,
    yCord: 250,
    width: 1000,
    height: 2,
    unitsPerPixel: undefined,
    numUnitsForDisplayedStart:  undefined,
    numUnitsForDisplayedEnd: undefined,
    currEvent: undefined,
    xCordOfCurrEvent: undefined
}

timeline.unitsPerPixel = calculateInitialUnitsPerPixel(timeline);
timeline.numUnitsForDisplayedStart = (timeline.eventsArr.length > 0) ? timeline.eventsArr[0] : 0;
timeline.numUnitsForDisplayedEnd = timeline.numUnitsForDisplayedStart + (timeline.width * timeline.unitsPerPixel);

drawTimeline(timeline)