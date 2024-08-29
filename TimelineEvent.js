export default class TimelineEvent{
    _splitTitleOrTimeArr(str){
        let splitArr = []
        let currLine = "";
        for(let i=0; i < str.length; i++){
            currLine += str[i];
            if(currLine.length % this._lineLength === 0 || i == str.length - 1){
                splitArr.push(currLine);
                currLine = ""
            }
        }
        return splitArr;
    }
    
    _addHyphensToTitleOrTimeArr(splitArr){
        let hyphensArr = splitArr;
        for(let i=1; i < hyphensArr.length; i++){
            let prevLine = hyphensArr[i - 1]
            if(prevLine[prevLine.length - 1] !== " " && hyphensArr[i][0] !== " "){
                hyphensArr[i - 1] = prevLine + "-";
            }
        }
        return hyphensArr;
    }
    
    _trimTitleOrTimeArr(hyphensArr){
        let trimmedArr = hyphensArr;
        for(let i=0; i < trimmedArr.length; i++){
            let currLine = trimmedArr[i];
            trimmedArr[i] = currLine.trim();
        }
        return trimmedArr;
    }
    
    _sliceArrAndAddElipsis(maxNumOfLines, trimmedArr){
        /* the title should take up to a maximum of 3 lines and 
        the time should take to up a maximum of 2 lines */
        let elipsisArr = trimmedArr;
        if(elipsisArr.length > maxNumOfLines){
            while(elipsisArr.length > maxNumOfLines){
                elipsisArr.pop();
            }
            let lastLine = elipsisArr[maxNumOfLines - 1];
            lastLine = lastLine.substring(0, this._lineLength - 3) + "...";

            elipsisArr[maxNumOfLines - 1] = lastLine;
        }
        return elipsisArr;
    }
    
    setFormattedTitleAndTime(maxNumLinesForTitle, titleStr, maxNumLinesForTime, timeStr){
        let formattedTitle = this._splitTitleOrTimeArr(titleStr)
        formattedTitle = this._addHyphensToTitleOrTimeArr(formattedTitle);
        formattedTitle = this._trimTitleOrTimeArr(formattedTitle);
        //    _sliceArrAndAddElipsis(maxNumOfLines, trimmedArrFromEitherTitleOrTime)
        formattedTitle = this._sliceArrAndAddElipsis(maxNumLinesForTitle, formattedTitle);
    
        let formattedTime = this._splitTitleOrTimeArr(timeStr)
        formattedTime = this._addHyphensToTitleOrTimeArr(formattedTime);
        formattedTime = this._trimTitleOrTimeArr(formattedTime);
        //    _sliceArrAndAddElipsis(maxNumOfLines, trimmedArrFromEitherTitleOrTime)
        formattedTime = this._sliceArrAndAddElipsis(maxNumLinesForTime, formattedTime);
    
        let formattedTitleAndTime = formattedTitle;
        for(let i=0; i < formattedTime.length; i++){
            formattedTitleAndTime.push(formattedTime[i])
        }
        return formattedTitleAndTime;
    }

    constructor(titleStr, timeOfEvent){
        this._title = titleStr;
        this.timeOfEvent = timeOfEvent;
        this._lineLength = 12;
        const titleMaxNumLines = 3;
        const timeMaxNumLines = 2;
        this.titleAndTime = this.setFormattedTitleAndTime(titleMaxNumLines, titleStr, timeMaxNumLines, timeOfEvent.toString());
        this.totalMaxNumLines = titleMaxNumLines + timeMaxNumLines;
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