import TimelineEvent  from "./TimelineEvent.js";
import Timeline from "./Timeline.js"


const canvasA = document.getElementById('canvasA');
canvasA.width = window.innerWidth * .8;
canvasA.height = window.innerHeight * .4;
const contextA = canvasA.getContext("2d");
contextA.font = "575 12px serif";
contextA.textAlign = "center";
contextA.fillStyle = "red";

const arrTimelineA = [  new TimelineEvent("Declaration Of Independence", 1776),
                        new TimelineEvent("Treaty of Paris", 1783), 
                        new TimelineEvent("Start of Civil War", 1861), 
                        new TimelineEvent("End of Civil War", 1865)];
let timelineA = new Timeline(arrTimelineA)


const canvasB = document.getElementById('canvasB');
canvasB.width = window.innerWidth * .8;
canvasB.height = window.innerHeight * .4;
const contextB = canvasB.getContext("2d");
contextB.font = "575 12px serif";
contextB.textAlign = "center";
contextB.fillStyle = "Blue";

const arrTimelineB = [  new TimelineEvent("French Revolution", 1789),
                        new TimelineEvent("Coup of 18 Brumaire", 1799),
                        new TimelineEvent("Napoleon defeated in Warerloo", 1815)];
let timelineB = new Timeline(arrTimelineB) 


timelineA.setupComparedTimelines(timelineB);
timelineA.drawTimeline(contextA);
timelineB.drawTimeline(contextB);
console.log(timelineA.eventsArr)

const scrollLeftButton = document.getElementById("scrollLeft")
scrollLeftButton.addEventListener("click", function(e){
    timelineA.scrollLeftForTimeline(contextA);
    timelineB.scrollLeftForTimeline(contextB);
})

const scrollRightButton = document.getElementById("scrollRight")
scrollRightButton.addEventListener("click", function(e){
    timelineA.scrollRightForTimeline(contextA);
    timelineB.scrollRightForTimeline(contextB);
})

const zoomOutButton = document.getElementById("zoomOut")
zoomOutButton.addEventListener("click", function(e){
    timelineA.zoomOutForTimeline(contextA);
    timelineB.zoomOutForTimeline(contextB);
})

const zoomInButton = document.getElementById("zoomIn")
zoomInButton.addEventListener("click", function(e){
    timelineA.zoomInForTimeline(contextA);
    timelineB.zoomInForTimeline(contextB);
})