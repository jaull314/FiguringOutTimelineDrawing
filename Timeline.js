export default class Timeline{
    constructor(context, eventsArr){
        eventsArr.sort((a, b) => a - b);
        this.eventsArr = eventsArr;
        this.ctx = context;
        this.xCord = 114;
        this.yCord = 250;
        this.width = 1000;
        this.height = 2;
        this.timelineTickYCord = 230;
        /* earliest/latestEventOfTimeline is used to determine if scrolling left or right will reveal more timeline 
        in that particular direction. They're also used to determine if an event is currently visible on the currently
        displayed portion of the timeline */
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

    _calculateUnitsPerPixel(minEvent, maxEvent){
        if(maxEvent > minEvent){
            let timelineRange = maxEvent - minEvent;
            let logOfRange = Math.floor(Math.log10(timelineRange));
            return 10 ** (logOfRange - 2);
        }else{
            return 1;
        }
    }

    _setNewUnitsPerPixel(unitsPerPixel){
        this.unitsPerPixel = unitsPerPixel;
        this.endOfVisibleTimeline = this.startOfVisibleTimeline + (this.width * this.unitsPerPixel);
    }

    //==================This section is only needed for comparing Timelines==========================================
    _setEarliestEventForBothTimelines(otherTimeline){
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

    _setLatestEventForBothTimelines(otherTimeline){
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

    setupComparedTimelines(otherTimeline){
        this._setEarliestEventForBothTimelines(otherTimeline);
        this._setLatestEventForBothTimelines(otherTimeline);

        const unitsPerPixel = this._calculateUnitsPerPixel(this.earliestEventOfTimeline, this.latestEventOfTimeline);
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
    
    _roundPixelXCordToNearestHundred(xCord){
        return Math.round(xCord / 100) * 100;
    }

    _getXCordForEvent(event){
        const distanceFromTimelineStart = event.timeOfEvent - this.startOfVisibleTimeline
        return Math.floor(distanceFromTimelineStart / this.unitsPerPixel)
    }

    
    _setVisiblePartOfTimeline(){
        if(this.eventsArr.length == 0) return;
        this.visiblePartOfTimeline = [];
        let currEvent;
        for(let i=0; i < this.eventsArr.length; i++){
            currEvent = this.eventsArr[i]
            if(currEvent.timeOfEvent >= this.startOfVisibleTimeline && currEvent.timeOfEvent <= this.endOfVisibleTimeline){
                currEvent.xCord = this._getXCordForEvent(currEvent);
                this.visiblePartOfTimeline.push(currEvent)
            }
        }
    }

    _shiftYCordOfEventsInQueue(numEventsShifted){
        let numXCordAlreadyInQueue = (numEventsShifted - 1);
        let indexOfFirstXCord = this.drawQueue.length - numXCordAlreadyInQueue;
        for(let i=this.drawQueue.length - 1; i >= indexOfFirstXCord; i--){
            // this yCord is for the last line of text in the current drawQueue Event
            this.drawQueue[i].yCord = this.drawQueue[i].yCord - this.drawQueue[i].yShiftForDrawnEvent;
        }
    }

    _setDrawQueue(){
        this.drawQueue = [];
        let lastXCord = undefined;
        let numWithXCord = 0;
        for(let i=0; i < this.visiblePartOfTimeline.length; i++){
            let currEvent = this.visiblePartOfTimeline[i];
            numWithXCord = (currEvent.xCord !== lastXCord) ? 1 : numWithXCord + 1;

            if(numWithXCord <= 3){
                /* the yCord needs shifted for each Event in drawQueue with the same xCord as currEvent.
                This because it needs to make room before the current Event is pushed on */
                this._shiftYCordOfEventsInQueue(numWithXCord);
                // this yCord is for the last line of text in the current drawQueue Event
                currEvent.yCord = 230;
                this.drawQueue.push(currEvent)

            }else{
                this.drawQueue.pop();
                this.drawQueue.pop();
        
                let elipsisEvent = currEvent._returnElipsisObj();
                // this yCord is for the last line of text in the current drawQueue Event
                elipsisEvent.yCord = 230 - elipsisEvent.yShiftForDrawnEvent;
                this.drawQueue.push(elipsisEvent);
                // this yCord is for the last line of text in the current drawQueue Event
                currEvent.yCord = 230;
                this.drawQueue.push(currEvent)
            }
            lastXCord = currEvent.xCord;  
        }
    }

    _drawEvent(currEvent){
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
        // erase what's currently on the canvas before drawing the new timeline
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        /* draw main horizontal line of timeline
                        (x,  y, width, height)                              */
        this.ctx.fillRect(this.xCord, this.yCord, this.width, this.height);
        /* Based on the unitsPerPixel scale used, find which events fit 
        on the screen and therefore will be need to be displayed */
        this._setVisiblePartOfTimeline();
        this._setDrawQueue();
        
        for(let i=0; i < this.drawQueue.length; i++){
            this._drawEvent(this.drawQueue[i]);
        }
        console.log("unitsPerPixel: ", this.unitsPerPixel);
        console.log("startOfVisibleTimeline: ", this.startOfVisibleTimeline);
        console.log("endOfVisibleTimeline: ", this.endOfVisibleTimeline);
        console.log("===============================================")
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
        console.log("this.unitsPerPixel", this.unitsPerPixel)
        console.log("this.maxUnitsPerPixel", this.maxUnitsPerPixel)
        if(this.unitsPerPixel < this.maxUnitsPerPixel){
            this._setNewUnitsPerPixel(this.unitsPerPixel * 10);
            this.drawTimeline();
        }
    }

    zoomInForTimeline(){
        if(this.unitsPerPixel > this.minUnitsPerPixel){
            this._setNewUnitsPerPixel(this.unitsPerPixel / 10);
            this.drawTimeline();
        }
    }

}//end of Timeline Class