import appState from '../appState.js';

// Init funcion for the background event controller
export default async () => {
  // Hide popups if clicking outside them or press ESC
  document.addEventListener('click', () => {
    appState.hideAllPopUps();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') appState.hideAllPopUps();
  });
};
