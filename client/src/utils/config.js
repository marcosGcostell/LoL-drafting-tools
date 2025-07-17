// Constants for local API connection
export const LOCAL_API = 'http://127.0.0.1:3000/api/v1/';
export const APP_DATA_ROUTE = 'app-data';
export const VERSION_ROUTE = 'app-data/version';
export const TIERLIST_ROUTE = 'tierlist';
export const COUNTERS_ROUTE = 'counters';
export const STATS_ROUTE = 'stats';
export const USER_ROUTE = 'users/me';
export const LOGIN_ROUTE = 'users/login';
export const SIGNUP_ROUTE = 'users/signup';
export const CHECK_USER_ROUTE = 'users/check';

// Keys for local storage
export const LS_APP_DATA = 'draftKingAppData';
export const LS_STATE = 'draftKingState';
export const LS_USER = 'draftKingUser';
export const LS_USER_CACHE = 'draftKingUserCache';

// Paths of resources (relative from index.html)
export const ICONS = './assets/img/icons/icons.svg';
export const IMG_SRC =
  'https://ddragon.leagueoflegends.com/cdn/15.11.1/img/champion/';
export const SPRITE_SRC =
  'https://ddragon.leagueoflegends.com/cdn/15.13.1/img/sprite/';
export const LANE_ICONS = './assets/img/lanes/';
export const RANK_ICONS = './assets/img/ranks/';

// HTML templates (relative from index.html)
// For main pages
export const STARTER_PAGE_TEMPLATE = './templates/global/page-starter.html';
export const COUNTER_PAGE_TEMPLATE = './templates/global/page-counters.html';
export const PROFILE_PAGE_TEMPLATE = './templates/global/page-profile.html';
export const SIGNUP_PAGE_TEMPLATE = './templates/global/page-signup.html';
// For components
export const SELECTOR_ITEM_TEMPLATE =
  './templates/components/selector-item.html';
export const SEARCH_ITEM_TEMPLATE = './templates/components/search-item.html';
export const CHAMPION_TEMPLATE = './templates/components/champion-item.html';
export const CHAMPION_ON_HOLD_TEMPLATE =
  './templates/components/champion-on-hold.html';
export const PROFILE_CHAMPION_ITEM =
  './templates/components/profile-champion-item.html';
// For views
export const TIERLIST_ITEM_TEMPLATE = './templates/counters/tierlist-item.html';
export const STATS_COLUMN_TEMPLATE = './templates/counters/stats-column.html';
export const STATS_ITEM_TEMPLATE = './templates/counters/stats-item.html';
export const PROFILE_SECTION_TEMPLATE =
  './templates/profile/profile-pool-lane.html';

// Config parameters
export const PICK_RATE_THRESHOLD = 1.0;
export const MAX_LIST_ITEMS = 35;
export const MIN_LETTERS_TO_SECOND_SEARCH = 2;
