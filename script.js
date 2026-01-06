const STAGES = [
  { name: 'Mortal', requirement: 20 },
  { name: 'Qi Condensation', requirement: 60 },
  { name: 'Foundation Establishment', requirement: 140 },
  { name: 'Core Formation', requirement: 260 },
  { name: 'Nascent Soul', requirement: 420 },
  { name: 'Soul Ascension', requirement: 600 },
];

const player = {
  stageIndex: 0,
  qi: 0,
  insight: 0,
  body: 0,
  spirit: 0,
  progress: 0,
};

const elements = {
  stage: document.querySelector('#stage'),
  qi: document.querySelector('#qi'),
  insight: document.querySelector('#insight'),
  body: document.querySelector('#body'),
  spirit: document.querySelector('#spirit'),
  progress: document.querySelector('#progress-fill'),
  log: document.querySelector('#log'),
  buttons: {
    meditate: document.querySelector('#meditate-btn'),
    study: document.querySelector('#study-btn'),
    train: document.querySelector('#train-btn'),
    focus: document.querySelector('#focus-btn'),
    explore: document.querySelector('#explore-btn'),
    breakthrough: document.querySelector('#breakthrough-btn'),
    reset: document.querySelector('#reset-btn'),
  },
};

function format(num) {
  return Math.round(num * 10) / 10;
}

function updateUI() {
  elements.stage.textContent = STAGES[player.stageIndex].name;
  elements.qi.textContent = `${format(player.qi)} / ${STAGES[player.stageIndex].requirement}`;
  elements.insight.textContent = format(player.insight);
  elements.body.textContent = format(player.body);
  elements.spirit.textContent = format(player.spirit);
  elements.progress.style.width = `${Math.min(100, (player.progress / STAGES[player.stageIndex].requirement) * 100)}%`;
}

function addLog(message) {
  const item = document.createElement('div');
  item.className = 'log__item';
  const time = new Date().toLocaleTimeString();
  item.innerHTML = `<strong>[${time}]</strong> ${message}`;
  elements.log.prepend(item);
  while (elements.log.children.length > 80) {
    elements.log.lastChild.remove();
  }
}

function gainQi(amount) {
  player.qi += amount;
  player.progress = Math.min(player.progress + amount, STAGES[player.stageIndex].requirement);
}

function tickPassive() {
  const base = 1 + player.stageIndex * 0.5;
  const qiGain = base + player.insight * 0.04 + player.spirit * 0.03;
  gainQi(qiGain);
  if (Math.random() < 0.12) {
    player.insight += 0.2;
    addLog('You glimpse a fleeting epiphany. (+0.2 Insight)');
  }
  updateUI();
}

function meditate() {
  const gain = 6 + player.spirit * 0.6;
  gainQi(gain);
  addLog(`You meditate quietly. (+${format(gain)} Qi)`);
  updateUI();
}

function studyDao() {
  const gain = 2 + player.stageIndex * 0.6;
  player.insight += gain;
  addLog(`Studying ancient scrolls refines your Dao. (+${format(gain)} Insight)`);
  updateUI();
}

function trainBody() {
  const gain = 1.6 + player.stageIndex * 0.5;
  player.body += gain;
  addLog(`Temper your body with spirit iron sands. (+${format(gain)} Body)`);
  updateUI();
}

function focusSpirit() {
  const gain = 1.2 + player.stageIndex * 0.4;
  player.spirit += gain;
  addLog(`You steady your divine sense. (+${format(gain)} Spirit)`);
  updateUI();
}

function exploreWorld() {
  const roll = Math.random();
  if (roll < 0.35) {
    const qi = 12 + player.stageIndex * 3;
    gainQi(qi);
    addLog(`You absorb a drifting qi vortex. (+${format(qi)} Qi)`);
  } else if (roll < 0.65) {
    const gain = 2 + Math.random() * 2;
    player.insight += gain;
    addLog(`You find a whispering tablet. (+${format(gain)} Insight)`);
  } else if (roll < 0.85) {
    const gain = 2 + Math.random() * 3;
    player.body += gain;
    addLog(`You refine your physique in a spirit spring. (+${format(gain)} Body)`);
  } else {
    const gain = 3 + Math.random() * 2;
    player.spirit += gain;
    addLog(`A roaming spirit offers guidance. (+${format(gain)} Spirit)`);
  }
  updateUI();
}

function canBreakthrough() {
  const requirement = STAGES[player.stageIndex].requirement;
  return player.qi >= requirement && player.insight >= requirement * 0.3;
}

function attemptBreakthrough() {
  if (player.stageIndex >= STAGES.length - 1) {
    addLog('You have reached the apex realm. Continue polishing your Dao.');
    return;
  }

  if (!canBreakthrough()) {
    addLog('Your foundation wavers. You need more Qi and Insight.');
    return;
  }

  const stability = 0.4 + player.spirit * 0.004 + player.body * 0.002;
  const success = Math.random() < Math.min(0.9, stability);

  if (success) {
    player.stageIndex += 1;
    player.qi = player.qi * 0.25;
    player.progress = 0;
    addLog(`Breakthrough! You advance to ${STAGES[player.stageIndex].name}.`);
  } else {
    player.qi *= 0.6;
    player.progress = player.qi;
    addLog('A backlash shakes your meridians. You lose some Qi.');
  }
  updateUI();
}

function softReset() {
  player.stageIndex = 0;
  player.qi = 0;
  player.insight = 0;
  player.body = 0;
  player.spirit = 0;
  player.progress = 0;
  elements.log.innerHTML = '';
  addLog('You return to the mortal realm to rebuild your foundation.');
  updateUI();
}

function bindEvents() {
  elements.buttons.meditate.addEventListener('click', meditate);
  elements.buttons.study.addEventListener('click', studyDao);
  elements.buttons.train.addEventListener('click', trainBody);
  elements.buttons.focus.addEventListener('click', focusSpirit);
  elements.buttons.explore.addEventListener('click', exploreWorld);
  elements.buttons.breakthrough.addEventListener('click', attemptBreakthrough);
  elements.buttons.reset.addEventListener('click', softReset);
}

function init() {
  bindEvents();
  updateUI();
  addLog('Welcome cultivator. Meditate to gather Qi and seek the Dao.');
  setInterval(tickPassive, 2000);
}

init();
