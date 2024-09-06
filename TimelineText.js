function _splitTitleOrTimeArr(lineLength, str){
    let splitArr = []
    let currLine = "";
    for(let i=0; i < str.length; i++){
        currLine += str[i];
        if(currLine.length % lineLength === 0 || i == str.length - 1){
            splitArr.push(currLine);
            currLine = ""
        }
    }
    return splitArr;
}

function _addHyphensToTitleOrTimeArr(splitArr){
    let hyphensArr = splitArr;
    for(let i=1; i < hyphensArr.length; i++){
        let prevLine = hyphensArr[i - 1]
        if(prevLine[prevLine.length - 1] !== " " && hyphensArr[i][0] !== " "){
            hyphensArr[i - 1] = prevLine + "-";
        }
    }
    return hyphensArr;
}

function _trimTitleOrTimeArr(hyphensArr){
    let trimmedArr = hyphensArr;
    for(let i=0; i < trimmedArr.length; i++){
        let currLine = trimmedArr[i];
        trimmedArr[i] = currLine.trim();
    }
    return trimmedArr;
}

function _sliceArrAndAddElipsis(maxNumOfLines, trimmedArr){
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

export function formatText(lineLength, maxNumLinesForText, text){
    let formattedTitle = _splitTitleOrTimeArr(lineLength, text)
    formattedTitle = _addHyphensToTitleOrTimeArr(formattedTitle);
    formattedTitle = _trimTitleOrTimeArr(formattedTitle);
    //    _sliceArrAndAddElipsis(maxNumOfLines, trimmedArrFromEitherTitleOrTime)
    formattedTitle = _sliceArrAndAddElipsis(maxNumLinesForText, formattedTitle);
    return formattedTitle
}

export function formatTitleAndTime(lineLength, titleMaxNumLines, titleStr, timeMaxNumLines, timeStr){
    let formattedTitleAndTime = formatText(lineLength, titleMaxNumLines, titleStr)
    let formattedTime = formatText(lineLength, timeMaxNumLines, timeStr)
    for(let i=0; i < formattedTime.length; i++){
        formattedTitleAndTime.push(formattedTime[i])
    }
    return formattedTitleAndTime;
}