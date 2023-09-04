var boatLeft = document.querySelector('.boat-left');
var boatRight = document.querySelector('.boat-right');

// var state = [2, 2, 0];

var AllState = [
  [3, 3, 1],
  [2, 2, 0],
  [1, 3, 0],
  [2, 3, 0],
  [3, 2, 0],
  [0, 0, 0],
];

function resetStyles() {
  boatLeft.style.display = "";
  boatRight.style.display = "";

  for (let i = 1; i <= 3; i++) {
    var devilRight = document.querySelector(`.devil-right-${i}`);
    devilRight.style.display = "";
    var devilLeft = document.querySelector(`.devil-left-${i}`);
    devilLeft.style.display = "";

    var manRight = document.querySelector(`.man-right-${i}`);
    manRight.style.display = "";
    var manLeft = document.querySelector(`.man-left-${i}`);
    manLeft.style.display = "";
  }
}

function processNextState(index) {
  if (index >= AllState.length) {
    return;
  }

  var currentState = AllState[index];

  if (JSON.stringify(currentState) === JSON.stringify([3, 3, 1])) {
    document.getElementById('wooden-plank-1').style.marginTop = "25px";
  } else {
    document.getElementById('wooden-plank-1').style.marginTop = "";
  }

  if (JSON.stringify(currentState) === JSON.stringify([0, 0, 0])) {
    document.getElementById('wooden-plank-2').style.marginTop = "25px";
    for (let i = 1; i <= 3; i++) {
      var devilRight = document.querySelector(`.devil-right-${i}`);
      devilRight.style.display = "none";
      var manRight = document.querySelector(`.man-right-${i}`);
      manRight.style.display = "none";
    }
    boatRight.style.display = "none";
    for (let i = 1; i <= 3; i++) {
      var devilLeft = document.querySelector(`.devil-left-${i}`);
      devilLeft.style.display = "";
      var manLeft = document.querySelector(`.man-left-${i}`);
      manLeft.style.display = "";
    }
    boatLeft.style.display = "";
    
  } else {
    document.getElementById('wooden-plank-2').style.marginTop = "";

    if (currentState[2] === 1) {
      boatLeft.style.display = "none";
    } else {
      boatRight.style.display = "none";
    }

    let devilCount = 3 - currentState[0];
    for (let i = 1; i <= devilCount; i++) {
      var devilElement = document.querySelector(`.devil-right-${i}`)
      devilElement.style.display = "none";
    }
    for (let i = 1; i <= currentState[0]; i++) {
      var devilElement = document.querySelector(`.devil-left-${i}`)
      devilElement.style.display = "none";
    }
    let manCount = 3 - currentState[1];
    for (let i = 1; i <= manCount; i++) {
      var manElement = document.querySelector(`.man-right-${i}`)
      manElement.style.display = "none";
    }

    for (let i = 1; i <= currentState[1]; i++) {
      var manElement = document.querySelector(`.man-left-${i}`)
      manElement.style.display = "none";
    }
  }

   document.getElementById('state-value').innerHTML = AllState[index];
  if (index < AllState.length - 1) { // Check if not the last iteration
    setTimeout(function () {
      resetStyles();
      processNextState(index + 1);
    }, 5000);
  }
}

processNextState(0);
