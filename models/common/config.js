// Constants for API connection to Lolalyttics Site
export const MIN_DELAY = 0.4;
export const MAX_DELAY = 1.6;
export const PROXY_ON = false;
export const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';

// Config parameters
export const TIME_BEFORE_CHECK = 12;
export const DEFAULT_SORT_FIELD = 'pickRate';

// Riot static data
export const RIOT_DATA_DRAGON = 'https://ddragon.leagueoflegends.com/';
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
export const riotLolRolesArray = Object.keys(riotLolRoles)
  .filter(role => role != 'main')
  .map(el => riotLolRoles[el].id);

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
