export function calculateUnitsPerPixel(minEvent, maxEvent){
    if(maxEvent > minEvent){
        let timelineRange = maxEvent - minEvent;
        let logOfRange = Math.floor(Math.log10(timelineRange));
        return 10 ** (logOfRange - 2);
    }else{
        return 1;
    }
}