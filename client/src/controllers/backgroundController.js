import appState from '../appState.js';

export default async () => {
  // Hide popups if clicking outside them or press ESC
  document.addEventListener('click', () => {
    appState.hideAllPopUps();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') appState.hideAllPopUps();
  });
};
