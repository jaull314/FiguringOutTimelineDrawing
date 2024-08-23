import TimelineEvent  from "./TimelineEvent.js";
import Timeline from "./Timeline.js"


const canvasA = document.getElementById('canvasA');
canvasA.width = window.innerWidth * .8;
canvasA.height = window.innerHeight * .4;
const contextA = canvasA.getContext("2d");
contextA.font = "575 12px serif";
contextA.textAlign = "center";
contextA.fillStyle = "red";

const arrTimelineA = [  new TimelineEvent("blah", 0),
                        new TimelineEvent("Hello", 200), 
                        new TimelineEvent("World", 900), 
                        new TimelineEvent("Bye", 1500)];
let timelineA = new Timeline(contextA, arrTimelineA)


const canvasB = document.getElementById('canvasB');
canvasB.width = window.innerWidth * .8;
canvasB.height = window.innerHeight * .4;
const contextB = canvasB.getContext("2d");
contextB.font = "575 12px serif";
contextB.textAlign = "center";
contextB.fillStyle = "Blue";

const arrTimelineB = [  new TimelineEvent("blah", 1),  
                        new TimelineEvent("blha", 500), 
                        new TimelineEvent("balh", 801), 
                        new TimelineEvent("halb",9990)];
let timelineB = new Timeline(contextB, arrTimelineB) 


timelineA.setupComparedTimelines(timelineB);
timelineA.drawTimeline();
timelineB.drawTimeline();
console.log(timelineA.eventsArr)

const scrollLeftButton = document.getElementById("scrollLeft")
scrollLeftButton.addEventListener("click", function(e){
    timelineA.scrollLeftForTimeline();
    timelineB.scrollLeftForTimeline();
})

const scrollRightButton = document.getElementById("scrollRight")
scrollRightButton.addEventListener("click", function(e){
    timelineA.scrollRightForTimeline();
    timelineB.scrollRightForTimeline();
})

const zoomOutButton = document.getElementById("zoomOut")
zoomOutButton.addEventListener("click", function(e){
    timelineA.zoomOutForTimeline();
    timelineB.zoomOutForTimeline();
})

const zoomInButton = document.getElementById("zoomIn")
zoomInButton.addEventListener("click", function(e){
    timelineA.zoomInForTimeline();
    timelineB.zoomInForTimeline();
})