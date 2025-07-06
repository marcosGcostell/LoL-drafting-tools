import appState from '../appState.js';
import { PROFILE_PAGE_TEMPLATE } from '../utils/config.js';

export const init = async () => {
  try {
    // Insert the HTML page
    const response = await fetch(PROFILE_PAGE_TEMPLATE);
    const template = await response.text();
    if (!template) throw new Error('HTML template is not found');

    document.querySelector('main').innerHTML = template;
    appState.setCurrentPage('profile');
  } catch (err) {
    // TODO should handle error here
    throw err;
  }
};
