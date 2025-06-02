// Constants for local API connection
export const LOCAL_API = 'http://127.0.0.1:3000/api/v1/';
export const APP_DATA = 'app-data';
export const TIERLIST = 'tierlist';
export const COUNTERS = 'counters';

// Pahts of resources (relative from index.html)
export const ICONS = './img/icons/icons.svg';
export const IMG_SRC =
  'https://ddragon.leagueoflegends.com/cdn/15.11.1/img/champion/';
export const LANE_PATH = './img/lanes/';
export const RANK_PATH = './img/ranks/';

// Config parameters
export const PERCENT_LIMIT = 1.5;
export const MAX_LIST_ITEMS = 35;

// Riot static data
export const riotLolRoles = {
  main: {
    id: 'main',
    name: 'Main',
  },
  top: {
    id: 'top',
    name: 'Top Lane',
  },
  jungle: {
    id: 'jungle',
    name: 'Jungle',
  },
  mid: {
    id: 'middle',
    name: 'Mid Lane',
  },
  adc: {
    id: 'bottom',
    name: 'AD Carry',
  },
  support: {
    id: 'support',
    name: 'Support',
  },
};

export const riotLolRanks = {
  all: {
    id: 'all',
    name: 'All Ranks',
  },
  onetric: {
    id: '1tric',
    name: 'One Trick Pony',
  },
  challenger: {
    id: 'challenger',
    name: 'Challenger',
  },
  grandmaster: {
    id: 'grandmaster',
    name: 'Grand Master',
  },
  grandmaster_plus: {
    id: 'grandmaster_plus',
    name: '+Grand Master',
  },
  master: {
    id: 'master',
    name: 'Master',
  },
  master_plus: {
    id: 'master_plus',
    name: '+Master',
  },
  diamond: {
    id: 'diamond',
    name: 'Diamond',
  },
  d2_plus: {
    id: 'd2_plus',
    name: '+Diamond 2',
  },
  diamond_plus: {
    id: 'diamond_plus',
    name: '+Diamond',
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald',
  },
  emerald_plus: {
    id: 'emerald_plus',
    name: '+Emerald',
  },
  platinum: {
    id: 'platinum',
    name: 'Platinum',
  },
  platinum_plus: {
    id: 'platinum_plus',
    name: '+Platinum',
  },
  gold: {
    id: 'gold',
    name: 'Gold',
  },
  gold_plus: {
    id: 'gold_plus',
    name: '+Gold',
  },
  silver: {
    id: 'silver',
    name: 'Silver',
  },
  bronze: {
    id: 'bronze',
    name: 'Bronze',
  },
  iron: {
    id: 'iron',
    name: 'Iron',
  },
  unranked: {
    id: 'unranked',
    name: 'Unranked',
  },
};
