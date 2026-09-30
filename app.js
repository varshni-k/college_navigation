const stops = [
  {
    direction: 'GO STRAIGHT',
    title: 'Main Gate',
    description: 'Begin at the main gate. Follow the road straight toward the Break Zone.',
    position: [380, 304],
    angle: 0,
    progress: 0,
  },
  {
    direction: 'TURN LEFT',
    title: 'Break Zone',
    description: 'At the Break Zone, turn left and continue straight until you reach D Block.',
    position: [380, 220],
    angle: 270,
    progress: 84,
  },
  {
    direction: 'TAKE THE LIFT',
    title: 'D Block',
    description: 'Go inside D Block and take the lift up to the second floor.',
    position: [180, 220],
    angle: 0,
    progress: 284,
  },
  {
    direction: 'TURN LEFT',
    title: 'Second floor',
    description: 'From the lift on the second floor, turn left and walk to the end of the corridor. AV Hall is on your left.',
    position: [180, 110],
    angle: 270,
    progress: 394,
  },
  {
    direction: 'ARRIVED',
    title: 'AV Hall',
    description: 'You have reached AV Hall.',
    position: [75, 110],
    angle: null,
    progress: 499,
  },
];

let currentStop = 0;

const collegeView = document.querySelector('.college-view');
const hallView = document.querySelector('.hall-view');
const marker = document.querySelector('#you-marker');
const markerArrow = marker.querySelector('.marker-arrow');
const progress = document.querySelector('#route-progress');
const stepItems = [...document.querySelectorAll('#route-steps li')];
const previousButton = document.querySelector('#previous-step');
const nextButton = document.querySelector('#next-step');

function showView(view) {
  const showHall = view === 'hall';
  collegeView.hidden = showHall;
  hallView.hidden = !showHall;
  collegeView.classList.toggle('is-active', !showHall);
  hallView.classList.toggle('is-active', showHall);
  if (showHall) document.querySelector('#hall-title').focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderStop() {
  const stop = stops[currentStop];
  document.querySelector('#step-number').textContent = String(currentStop + 1).padStart(2, '0');
  document.querySelector('#step-direction').textContent = stop.direction;
  document.querySelector('#step-title').textContent = stop.title;
  document.querySelector('#step-description').textContent = stop.description;
  const rotation = stop.angle === null ? '' : ` rotate(${stop.angle})`;
  marker.setAttribute('transform', `translate(${stop.position[0]} ${stop.position[1]})${rotation}`);
  markerArrow.setAttribute('visibility', stop.angle === null ? 'hidden' : 'visible');
  progress.style.strokeDasharray = `${stop.progress} 600`;
  stepItems.forEach((item, index) => {
    item.classList.toggle('is-current', index === currentStop);
    item.classList.toggle('is-past', index < currentStop);
  });
  previousButton.disabled = currentStop === 0;
  nextButton.disabled = currentStop === stops.length - 1;
  nextButton.querySelector('span').textContent = currentStop === stops.length - 1 ? 'Arrived' : 'Next';
}

function updateConnection() {
  const offline = !navigator.onLine;
  const connection = document.querySelector('.connection');
  connection.classList.toggle('is-offline', offline);
  document.querySelector('#connection-label').textContent = offline ? 'Offline · hall guide ready' : 'Online';
}

document.querySelector('#next-button').addEventListener('click', () => showView('hall'));
document.querySelector('#back-button').addEventListener('click', () => showView('college'));
previousButton.addEventListener('click', () => {
  if (currentStop > 0) currentStop -= 1;
  renderStop();
});
nextButton.addEventListener('click', () => {
  if (currentStop < stops.length - 1) currentStop += 1;
  renderStop();
});
window.addEventListener('online', updateConnection);
window.addEventListener('offline', updateConnection);
window.addEventListener('hashchange', () => showView(location.hash === '#hall' ? 'hall' : 'college'));

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}

updateConnection();
renderStop();
if (location.hash === '#hall') showView('hall');