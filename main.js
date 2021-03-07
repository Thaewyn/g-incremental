console.log("loaded main.js");

let silhouettePanel = $(".silhouette");
let logPanel = $(".statuslog");
let statusLogList = $(".statuslog .display");
let adventurePanel = $(".adventurestatus");
let portalPanel = $(".portaldetails");
let controlPanel = $(".maincontrols");
let relicPanel = $(".relics");
let silhouette = $(".statuscontent .woman");
let relicSelect = $(".relicPick")

let growthStats = { //change per growth
  height: 300, //30cm, for testing
  bust: 2,
  waist: 0,
  hips: 1,
  bmi: 0,
  lactation: 0,
  fertility: 0
}

let girlStats = { //all distance stats in millimeters.
  height: 1500,
  bust: 750, //bust actual. band size is 50% of height.
  waist: 600, //minimum is 40% of height
  hips: 750, //minimum 50% of height
  weight: 45, //kilograms
  bmi: 20,
  lactation: 0,
  fertility: 1
}

let pleasureTools = {
  vibrator: 0
}

let currentPleasure = 0;
let pleasureThreshold = 10;
let pleasureLevel = 1;

$('#fondlebtn').on('click', function() {
  currentPleasure++;
});

$('#buy-vibe').on('click', function() {
  pleasureTools.vibrator++;
  $('#buy-vibe .count').text(pleasureTools.vibrator);
})

let growthCount = 0;
let firstGrowthScript = [
  "Mmmm... that feels so good!",
  "Wait, what is happening?",
  "Oh that feels nice...",
  "My clothes! Am I... growing!?!",
  "NNNgh. Getting too big! How are you doing this?!"
]
function applyGrowth() {
  //we got a pleasure level, apply growth to our girl.
  //dumb loop version.
  /*for (const [attr, rate] of Object.entries(growthStats)) {
    girlStats[attr] += rate;
  }*/
  //height first
  girlStats.height += growthStats.height;
  //half of height is applied to BWH because of band size increase
  let newBust = (growthStats.height * 0.5) + growthStats.bust;
  girlStats.bust += newBust;
  let newwaist = (growthStats.height * 0.4) + growthStats.waist;
  girlStats.waist += newwaist;
  let newhips = (growthStats.height * 0.5) + growthStats.hips;
  girlStats.hips += newhips;
  calcWeight();
  //addItemToLog("Growth level up!");
  updateSilhouette();
  if(growthCount == 0) {
    addItemToLog("Oh wow! She seemed to really enjoy that. And I saw her get taller too!");
  }
  if (growthCount < firstGrowthScript.length) {
    addItemToLog(firstGrowthScript[growthCount], "girl");
    growthCount++;
    if (growthCount >= firstGrowthScript.length) {
      //out of script, trigger something else?
    }
  }
}
function updateSilhouette() {
  //take the new numbers, update image height
  // 100px = 1500mm / 1.5 meters = 1px = 15mm
  let newPixelHeight = Math.floor(girlStats.height / 15);
  console.log(silhouette);
  console.log(silhouette.css("height"))
  silhouette.css("background-size", newPixelHeight+"px");
}

function calcWeight() {
  //given BMI and height, we can calculate weight.
  // BMI = weight in kg / height in meters squared
  // therefore weight = BMI * height in meters squared.
  let weight = Math.round(girlStats.bmi * (girlStats.height/1000) * (girlStats.height/1000));
  girlStats.weight = weight;
  return weight;
}

function updateDisplay(rate) {
  //update progress bar
  let progresstxt = Math.floor((currentPleasure/pleasureThreshold)*100)+"%";
  //console.log(rate+", "+pleasureThreshold+" - "+(rate/pleasureThreshold));
  if((rate/pleasureThreshold) < 0.05) {
    //$('#pleasureprogress').css("width",progresstxt);
    $(".statuscontent .progressbar > .fill").css("height",progresstxt);
  } else {
    //$('#pleasureprogress').css("width","100%");
    $(".statuscontent .progressbar > .fill").css("height","100%");
  }
  //$('#pleasureprogress').text(progresstxt);

  //update girl's stats
  $('.girlstats .height .num').text((girlStats.height/10)+" cm");
  $('.girlstats .bust .num').text((girlStats.bust/10)+" cm");
  $('.girlstats .waist .num').text((girlStats.waist/10)+" cm");
  $('.girlstats .hips .num').text((girlStats.hips/10)+" cm");
  $('.girlstats .weight .num').text(girlStats.weight+" kg");

  //display growth rates
  $('.growthstats .height .num').text((growthStats.height/10)+" cm");
  $('.growthstats .bust .num').text((growthStats.bust/10)+" cm");
  $('.growthstats .waist .num').text((growthStats.waist/10)+" cm");
  $('.growthstats .hips .num').text((growthStats.hips/10)+" cm");
}

function addItemToLog(data, highlight="plain") {
  $(".statuslog .display .item.new").removeClass("new");
  let newItem = $("<div class='item new'>"+data+"</div>");
  statusLogList.prepend(newItem);
}

// Run UI update code every 10ms: 1/100 of a second
window.setInterval(function () {
  let pleasureRate = (pleasureTools.vibrator * 1 / 100); // 1 per vibrator per second.
  currentPleasure += pleasureRate

  if(currentPleasure >= pleasureThreshold) {
    console.log("pleasure threshold hit");
    pleasureLevel++;
    $('.pleasureactual').text(pleasureLevel);
    currentPleasure = 0;
    pleasureThreshold += 5;//(pleasureLevel * 10);
    applyGrowth();
  }
  
  updateDisplay(pleasureRate);
}, 10);


let prologueSpeech = [
  "Greetings, mortal. I require your aid.",
  "My world is dying. The women of your world could help, but they are not tall or strong enough.",
  "This relic can prepare them, but legend says it requires the touch of a chosen one from another world to work.",
  "You are the first I've found, so you must be the chosen. I have no other options.",
  "Please, do what you can. You are my last hope."
];
let prologueStep = 0;
let prologue = setInterval(() => {
  addItemToLog(prologueSpeech[prologueStep], "goddess");
  prologueStep++;
  if(prologueStep >= prologueSpeech.length) {
    // addItemToLog("Well, let's see what this thing can do...");
    addRelic("necklace");
    relicPanel.css("opacity",1);
    clearInterval(prologue);
  }
}, 100); //TODO: set up to 3000ms for final. This basically 'skips' the prologue.

let relicList = {
  necklace: {
    html: '<option value="necklace">Simple Necklace</option>'
  }
}
function addRelic(relic) {
  if(relicList[relic]) {
    relicSelect.append(relicList[relic].html);
  }
}
let firstRelic = false;
function applyRelic(e) {
  e.preventDefault();
  let which = $("#relicPick").val();
  console.log(which);
  if (!firstRelic) {
    firstRelic = true;
    silhouettePanel.css("opacity",1);
    addItemToLog("Let's give the necklace to a coworker as a gift...");
    setTimeout(() => {
      addItemToLog("Nothing is happening. Wait, the goddess said something about 'touch'? Maybe I can offer her a massage.");
      controlPanel.css("opacity",1);
    }, 3000)
  }
}

$("#relicBtn").on("click", applyRelic);