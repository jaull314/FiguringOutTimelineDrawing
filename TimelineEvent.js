class TimelineEvent{
    splitTitleOrTimeArr(str){
        let splitArr = []
        let currLine = "";
        for(let i=0; i < str.length; i++){
            currLine += str[i];
            if(currLine.length % this.lineLength === 0 || i == str.length - 1){
                splitArr.push(currLine);
                currLine = ""
            }
        }
        return splitArr;
    }
    
    addHyphensToTitleOrTimeArr(splitArr){
        let hyphensArr = splitArr;
        for(let i=1; i < hyphensArr.length; i++){
            let prevLine = hyphensArr[i - 1]
            if(!(prevLine[prevLine.length - 1] === " " || hyphensArr[i][0] === " ")){
                hyphensArr[i - 1] = prevLine + "-"
            }
        }
        return hyphensArr;
    }
    
    trimTitleOrTimeArr(hyphensArr){
        let trimmedArr = hyphensArr;
        for(let i=0; i < trimmedArr.length; i++){
            let currLine = trimmedArr[i];
            trimmedArr[i] = currLine.trim();
        }
        return trimmedArr;
    }
    
    sliceArrAndAddElipsis(maxNumOfLines, trimmedArr){
        /* the title should take up to a maximum of 3 lines and 
        the time should take to up a maximum of 2 lines */
        let elipsisArr = trimmedArr;
        if(elipsisArr.length > maxNumOfLines){
            while(elipsisArr.length > maxNumOfLines){
                elipsisArr.pop();
            }
            let lastLine = elipsisArr[maxNumOfLines - 1];
            lastLine = lastLine.substring(0, this.lineLength - 3) + "...";

            elipsisArr[maxNumOfLines - 1] = lastLine;
        }
        return elipsisArr;
    }
    
    setFormattedTitleAndTime(titleStr, timeStr){
        let formattedTitle = this.splitTitleOrTimeArr(titleStr)
        formattedTitle = this.addHyphensToTitleOrTimeArr(formattedTitle);
        formattedTitle = this.trimTitleOrTimeArr(formattedTitle);
        //    sliceArrAndAddElipsis(maxNumOfLines, trimmedArrFromEitherTitleOrTime)
        formattedTitle = this.sliceArrAndAddElipsis(3, formattedTitle);
    
        let formattedTime = this.splitTitleOrTimeArr(timeStr)
        formattedTime = this.addHyphensToTitleOrTimeArr(formattedTime);
        formattedTime = this.trimTitleOrTimeArr(formattedTime);
        //    sliceArrAndAddElipsis(maxNumOfLines, trimmedArrFromEitherTitleOrTime)
        formattedTime = this.sliceArrAndAddElipsis(2, formattedTime);
    
        let formattedTitleAndTime = formattedTitle;
        for(let i=0; i < formattedTime.length; i++){
            formattedTitleAndTime.push(formattedTime[i])
        }
        return formattedTitleAndTime;
    }

    constructor(titleStr, timeOfEvent){
        this.title = titleStr;
        this.timeOfEvent = timeOfEvent;
        this.lineLength = 12;
        this.titleAndTime = this.setFormattedTitleAndTime(titleStr, timeOfEvent.toString());
        this.lineHeight = 12;
        this.xCord = undefined;
        this.yCord = 230;
    }

    returnElipsisObj(){
        let elipsisPlaceHolder = [];
        // change 5 to this.maxNumOfLinesForTitleAndTime
        for(let i=0; i < (this.maxNumLinesForTime + this.maxNumLinesForTitle); i++){
            if(i > 0 && i < 4){
                elipsisPlaceHolder.push(".");
            }else{
                elipsisPlaceHolder.push("");
            }
        }
        let elipsisObj = new TimelineEvent(this.title, this.timeOfEvent);
        elipsisObj.titleAndTime = elipsisPlaceHolder;
        elipsisObj.xCord = this.xCord;
        elipsisObj.yCord = undefined;
        return elipsisObj;
    }

} // end of TimelineEvent Class