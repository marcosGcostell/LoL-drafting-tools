// Constants for local API connection
export const LOCAL_API = 'http://127.0.0.1:3000/api/v1/';
export const APP_DATA_ROUTE = 'app-data';
export const VERSION_ROUTE = 'app-data/version';
export const TIERLIST_ROUTE = 'tierlist';
export const COUNTERS_ROUTE = 'counters';
export const STATS_ROUTE = 'stats';

// Keys for local storage
export const LS_APP_DATA = 'draftKingAppData';
export const LS_STATE = 'draftKingState';

// Paths of resources (relative from index.html)
export const ICONS = './img/icons/icons.svg';
export const IMG_SRC =
  'https://ddragon.leagueoflegends.com/cdn/15.11.1/img/champion/';
export const SPRITE_SRC =
  'https://ddragon.leagueoflegends.com/cdn/15.13.1/img/sprite/';
export const LANE_ICONS = './img/lanes/';
export const RANK_ICONS = './img/ranks/';

// HTML templates (relative from index.html)
export const LANE_ITEM_TEMPLATE = './templates/lane-selector-item.html';
export const RANK_ITEM_TEMPLATE = './templates/rank-selector-item.html';
export const LANE_STARTER_TEMPLATE = './templates/lane-starter-item.html';
export const TIERLIST_ITEM_TEMPLATE = './templates/tierlist-item.html';
export const SEARCH_ITEM_TEMPLATE = './templates/search-item.html';
export const CHAMPION_TEMPLATE = './templates/champion-item.html';
export const CHAMPION_ON_HOLD_TEMPLATE = './templates/champion-on-hold.html';
export const STATS_COLUMN_TEMPLATE = './templates/stats-column.html';
export const STATS_ITEM_TEMPLATE = './templates/stats-item.html';

// Config parameters
export const PICK_RATE_THRESHOLD = 1.0;
export const MAX_LIST_ITEMS = 35;
export const TIME_BEFORE_UPDATE = 24;
