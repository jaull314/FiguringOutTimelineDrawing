import * as TimelineText from "./TimelineText.js"

export default class TimelineEvent{

    constructor(titleStr, timeOfEvent){
        this._title = titleStr;
        this.timeOfEvent = timeOfEvent;
        this._lineLength = 12;
        const titleMaxNumLines = 3;
        const timeMaxNumLines = 2;
        this.totalMaxNumLines = titleMaxNumLines + timeMaxNumLines;
        const timeStr = timeOfEvent.toString();
        this.titleAndTime = TimelineText.formatTitleAndTime(this._lineLength, titleMaxNumLines, titleStr, timeMaxNumLines, timeStr);
        this.lineHeight = 12;
        this.xCord = undefined;
        this.yCord = 230;
        this.yShiftForDrawnEvent = (5 * 15);
    }

    returnElipsisObj(){
        let elipsisObj = new TimelineEvent(this._title, this.timeOfEvent);
        let elipsisPlaceHolder = [];
        // change 5 to this.maxNumOfLinesForTitleAndTime
        for(let i=0; i < this.totalMaxNumLines; i++){
            if(i > 0 && i < 4){
                elipsisPlaceHolder.push(".");
            }else{
                elipsisPlaceHolder.push("");
            }
        }
        elipsisObj.titleAndTime = elipsisPlaceHolder;
        elipsisObj.xCord = this.xCord;
        // this yCord is for the last line of text in the current drawQueue Event
        elipsisObj.yCord = this.yCord - this.yShiftForDrawnEvent;
        return elipsisObj;
    }

} // end of TimelineEvent Class