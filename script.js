const levels = [
  [
    ['blue', 'blue', 'red', 'red'],
    ['red', 'blue'],
    []
  ],
  [
    ['blue', 'red', 'blue', 'red'],
    ['blue', 'blue'],
    ['red', 'red']
  ]
];

const gameContainer = document.getElementById('game-container');
const levelSelect = document.getElementById('level');
const playButton = document.getElementById('play');
const infoSpan = document.getElementById('info');

let tubes = [];
let currentTubesData = [];
let selectedTubeIndex = -1;

playButton.addEventListener('click', () => {
  const chosenLevel = parseInt(levelSelect.value, 10);
  startGame(chosenLevel);
});

function startGame(levelIndex) {
  gameContainer.innerHTML = '';
  tubes = [];
  selectedTubeIndex = -1;
  infoSpan.textContent = '';
  currentTubesData = JSON.parse(JSON.stringify(levels[levelIndex]));
  createTubes(currentTubesData);
}

function createTubes(levelData) {
  levelData.forEach((tubeData, idx) => {
    const tubeDiv = document.createElement('div');
    tubeDiv.classList.add('tube');
    tubeData.forEach(color => {
      const waterDiv = document.createElement('div');
      waterDiv.classList.add('water');
      waterDiv.style.backgroundColor = color;
      tubeDiv.appendChild(waterDiv);
    });
    tubeDiv.addEventListener('click', () => selectTube(idx));
    gameContainer.appendChild(tubeDiv);
    tubes.push(tubeDiv);
  });
}

function selectTube(tubeIndex) {
  if (selectedTubeIndex === -1) {
    selectedTubeIndex = tubeIndex;
    tubes[tubeIndex].classList.add('selected');
  } else if (selectedTubeIndex === tubeIndex) {
    tubes[tubeIndex].classList.remove('selected');
    selectedTubeIndex = -1;
  } else {
    pourWater(selectedTubeIndex, tubeIndex);
    tubes[selectedTubeIndex].classList.remove('selected');
    selectedTubeIndex = -1;
  }
}

function pourWater(fromIndex, toIndex) {
  const fromTubeData = currentTubesData[fromIndex];
  const toTubeData = currentTubesData[toIndex];
  const fromTopColor = fromTubeData[fromTubeData.length - 1];
  const toTopColor = toTubeData[toTubeData.length - 1];

  if (!fromTopColor) {
    infoSpan.textContent = '來源管子是空的。';
    return;
  }
  if (toTubeData.length >= 4) {
    infoSpan.textContent = '目標管子已滿。';
    return;
  }
  if (toTopColor && toTopColor !== fromTopColor) {
    infoSpan.textContent = '顏色不同，無法倒水。';
    return;
  }

  fromTubeData.pop();
  toTubeData.push(fromTopColor);
  renderTubes();
  checkWinCondition();
}

function renderTubes() {
  tubes.forEach((tubeDiv, idx) => {
    tubeDiv.innerHTML = '';
    const tubeData = currentTubesData[idx];
    tubeData.forEach(color => {
      const waterDiv = document.createElement('div');
      waterDiv.classList.add('water');
      waterDiv.style.backgroundColor = color;
      tubeDiv.appendChild(waterDiv);
    });
  });
}

function checkWinCondition() {
  const allDone = currentTubesData.every(tubeData => {
    if (tubeData.length === 0) return true;
    return tubeData.every(color => color === tubeData[0]);
  });

  if (allDone) {
    infoSpan.textContent = '恭喜通關！';
  }
}
