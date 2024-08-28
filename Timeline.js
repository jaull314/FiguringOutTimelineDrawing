import TimelineEvent  from "./TimelineEvent.js";

export default class Timeline{
    constructor(context, eventsArr){
        eventsArr.sort((a, b) => a - b);
        this.eventsArr = eventsArr;
        this.ctx = context;
        this._xCord = 114;
        this._yCord = 250;
        this._width = 1000;
        this._height = 2;
        this._timelineTickYCord = 230;
        /* earliest/latestEventOfTimeline is used to determine if scrolling left or right will reveal more timeline 
        in that particular direction. They're also used to determine if an event is currently visible on the currently
        displayed portion of the timeline */
        this._earliestEventOfTimeline = (eventsArr.length > 0) ? eventsArr[0].timeOfEvent : undefined;
        this._latestEventOfTimeline = (eventsArr.length > 0) ? eventsArr[eventsArr.length - 1].timeOfEvent : undefined;
        this._visiblePartOfTimeline= [];
        this._unitsPerPixel = 1;
        this._maxUnitsPerPixel = 1;
        this._minUnitsPerPixel = .01;
        this._startOfVisibleTimeline =  undefined;
        this._endOfVisibleTimeline = undefined;
        if(eventsArr.length > 1){
            let timelineRange = eventsArr[eventsArr.length - 1].timeOfEvent - eventsArr[0].timeOfEvent;
            let logOfRange = Math.floor(Math.log10(timelineRange));
            this._unitsPerPixel = 10 ** (logOfRange - 2);
            this._maxUnitsPerPixel = 10 ** (logOfRange - 2);
        }
        if(eventsArr.length > 0){
            this._startOfVisibleTimeline =  eventsArr[0].timeOfEvent;
            this._endOfVisibleTimeline = this._startOfVisibleTimeline + (this._width * this._unitsPerPixel);
        }
        this._drawQueue = [];
    }

    _calculateUnitsPerPixel(minEvent, maxEvent){
        if(maxEvent > minEvent){
            let timelineRange = maxEvent - minEvent;
            let logOfRange = Math.floor(Math.log10(timelineRange));
            return 10 ** (logOfRange - 2);
        }else{
            return 1;
        }
    }

    //==================This section is only needed for comparing Timelines==========================================
    _setEarliestEventForBothTimelines(otherTimeline){
        if(this._earliestEventOfTimeline === undefined && otherTimeline._earliestEventOfTimeline !== undefined){
            this._earliestEventOfTimeline = otherTimeline._earliestEventOfTimeline;

        }else if(this._earliestEventOfTimeline !== undefined && otherTimeline._earliestEventOfTimeline === undefined){
            otherTimeline._earliestEventOfTimeline = this._earliestEventOfTimeline;

        }else if(this._earliestEventOfTimeline <= otherTimeline._earliestEventOfTimeline){
            otherTimeline._earliestEventOfTimeline = this._earliestEventOfTimeline;

        }else{
            this._earliestEventOfTimeline = otherTimeline._earliestEventOfTimeline;
        }
    }

    _setLatestEventForBothTimelines(otherTimeline){
        if(this._latestEventOfTimeline === undefined && otherTimeline._latestEventOfTimeline !== undefined){
            this._latestEventOfTimeline = otherTimeline._latestEventOfTimeline;

        }else if(this._latestEventOfTimeline !== undefined && otherTimeline._latestEventOfTimeline === undefined){
            otherTimeline._latestEventOfTimeline = this._latestEventOfTimeline;

        }else if(this._latestEventOfTimeline >= otherTimeline._latestEventOfTimeline){
            otherTimeline._latestEventOfTimeline = this._latestEventOfTimeline;

        }else{
            this._latestEventOfTimeline = otherTimeline._latestEventOfTimeline;
        }
    }

    setupComparedTimelines(otherTimeline){
        this._setEarliestEventForBothTimelines(otherTimeline);
        this._setLatestEventForBothTimelines(otherTimeline);

        const unitsPerPixel = this._calculateUnitsPerPixel(this._earliestEventOfTimeline, this._latestEventOfTimeline);
        this._unitsPerPixel = unitsPerPixel;
        this._maxUnitsPerPixel = unitsPerPixel;
        otherTimeline._unitsPerPixel = unitsPerPixel;
        otherTimeline._maxUnitsPerPixel = unitsPerPixel;

        this._startOfVisibleTimeline = this._earliestEventOfTimeline;
        otherTimeline._startOfVisibleTimeline = this._earliestEventOfTimeline;

        this._endOfVisibleTimeline = this._startOfVisibleTimeline + (this._width * this._unitsPerPixel);
        otherTimeline._endOfVisibleTimeline = this._startOfVisibleTimeline + (this._width * this._unitsPerPixel);
    }
    //===========================================================================================================
    
    _roundPixelXCordToNearestHundred(xCord){
        return Math.round(xCord / 100) * 100;
    }

    _getXCordForEvent(event){
        const distanceFromTimelineStart = event.timeOfEvent - this._startOfVisibleTimeline
        return Math.floor(distanceFromTimelineStart / this._unitsPerPixel)
    }

    
    _setVisiblePartOfTimeline(){
        if(this.eventsArr.length == 0) return;
        this._visiblePartOfTimeline = [];
        let currEvent;
        for(let i=0; i < this.eventsArr.length; i++){
            currEvent = this.eventsArr[i]
            if(currEvent.timeOfEvent >= this._startOfVisibleTimeline && currEvent.timeOfEvent <= this._endOfVisibleTimeline){
                this._visiblePartOfTimeline.push(currEvent)
            }
        }
    }

    _shiftYCordOfEventsInQueue(numEventsShifted){
        if(this._drawQueue.length > 0){
            const indexOfFirstXCord = this._drawQueue.length - numEventsShifted;
            for(let i=this._drawQueue.length - 1; i >= indexOfFirstXCord; i--){
                // this yCord is for the last line of text in the current drawQueue Event
                this._drawQueue[i].yCord = this._drawQueue[i].yCord - this._drawQueue[i].yShiftForDrawnEvent;
            }
        }
    }

    _setDrawQueue(){
        this._setVisiblePartOfTimeline();
        this._drawQueue = [];
        let lastXCord = undefined;
        let numWithXCord = 0;
        for(let i=0; i < this._visiblePartOfTimeline.length; i++){
            let currEvent = this._visiblePartOfTimeline[i];
            // this yCord is for the last line of text in the current drawQueue Event
            currEvent.yCord = 230;
            currEvent.xCord = this._roundPixelXCordToNearestHundred(this._getXCordForEvent(currEvent));
            numWithXCord = (currEvent.xCord !== lastXCord) ? 1 : numWithXCord + 1;

            if(numWithXCord <= 3){
                /* the yCord needs shifted for each Event in drawQueue with the same xCord as currEvent.
                This because it needs to make room before the current Event is pushed on */
                this._shiftYCordOfEventsInQueue(numWithXCord - 1);
                this._drawQueue.push(currEvent)

            }else{
                this._drawQueue.pop();
                this._drawQueue.pop();
                
                let elipsisEvent = currEvent.returnElipsisObj();
                this._drawQueue.push(elipsisEvent);
                this._drawQueue.push(currEvent)
            }
            lastXCord = currEvent.xCord;  
        }
    }

    _drawVisibleStartAndEndTimes(){
        this.ctx.fillText(this._startOfVisibleTimeline.toString(), 70, this._yCord + 5);
        this.ctx.fillText(this._endOfVisibleTimeline.toString(), this._xCord + this._width + 50, this._yCord + 5);
    }

    _drawEvent(currEvent){
        const savedColor = this.ctx.fillStyle;
        this.ctx.fillStyle = "black";
        let currYCord = currEvent.yCord - currEvent.lineHeight;
        for(let i=currEvent.titleAndTime.length - 1; i >= 0; i--){
            this.ctx.fillText(currEvent.titleAndTime[i], this._xCord + currEvent.xCord, currYCord)
            currYCord -= currEvent.lineHeight;
        }
        this.ctx.fillStyle = savedColor;
        // theis vertical line tick is 1 pixel wide and 44 pixels tall 
        //                              (x,                  y,                width, height) 
        this.ctx.fillRect(this._xCord + currEvent.xCord, this._timelineTickYCord, 1, 42);
    }
    
    drawTimeline(){
        // erase what's currently on the canvas before drawing the new timeline
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        /* draw main horizontal line of timeline
                        (x,  y, width, height)                              */
        this.ctx.fillRect(this._xCord, this._yCord, this._width, this._height);
        /* Based on the unitsPerPixel scale used, find which events fit 
        on the screen and therefore will be need to be displayed */
        this._setDrawQueue();
        for(let i=0; i < this._drawQueue.length; i++){
            this._drawEvent(this._drawQueue[i]);
        }
        this._drawVisibleStartAndEndTimes();
        console.log("unitsPerPixel: ", this._unitsPerPixel);
        console.log("startOfVisibleTimeline: ", this._startOfVisibleTimeline);
        console.log("endOfVisibleTimeline: ", this._endOfVisibleTimeline);
        console.log("===============================================")
    }

    scrollLeftForTimeline(){
        if(this._startOfVisibleTimeline > this._earliestEventOfTimeline){
            this._startOfVisibleTimeline = this._startOfVisibleTimeline -  (this._width * this._unitsPerPixel);
            if(this._startOfVisibleTimeline < this._earliestEventOfTimeline){
                this._startOfVisibleTimeline = this._earliestEventOfTimeline;
            }
            this._endOfVisibleTimeline = this._startOfVisibleTimeline + (this._width * this._unitsPerPixel);
            this.drawTimeline()
        }
    }

    scrollRightForTimeline(){
        if(this._endOfVisibleTimeline < this._latestEventOfTimeline){
            this._startOfVisibleTimeline = this._endOfVisibleTimeline;
            this._endOfVisibleTimeline = this._startOfVisibleTimeline + (this._width * this._unitsPerPixel);
            this.drawTimeline()
        }
    }

    zoomOutForTimeline(){
        if(this._unitsPerPixel < this._maxUnitsPerPixel){
            this._unitsPerPixel = this._unitsPerPixel * 10;
            this._endOfVisibleTimeline = this._startOfVisibleTimeline + (this._width * this._unitsPerPixel);
            this.drawTimeline();
        }
    }

    zoomInForTimeline(){
        if(this._unitsPerPixel > this._minUnitsPerPixel){
            this._unitsPerPixel = this._unitsPerPixel / 10;
            this._endOfVisibleTimeline = this._startOfVisibleTimeline + (this._width * this._unitsPerPixel);
            this.drawTimeline();
        }
    }

}//end of Timeline Class