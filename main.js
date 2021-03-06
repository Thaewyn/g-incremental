console.log("loaded main.js");

let silhouettePanel = $(".silhouette");
let logPanel = $(".statuslog");
let statusLogList = $(".statuslog .display");
let adventurePanel = $(".adventurestatus");
let portalPanel = $(".portaldetails");
let controlPanel = $(".maincontrols");
let relicPanel = $(".relics");

let growthStats = { //change per growth
  height: 10,
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
}

function calcWeight() {
  //given BMI and height, we can calculate weight.
  // BMI = weight in kg / height in meters squared
  // therefore weight = BMI * height in meters squared.
  let weight = girlStats.bmi * (girlStats.height/1000) * (girlStats.height/1000);
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
    pleasureThreshold += 10;//(pleasureLevel * 10);
    applyGrowth();
  }
  
  updateDisplay(pleasureRate);
}, 10);
