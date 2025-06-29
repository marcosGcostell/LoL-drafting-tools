// Constants for API connection to Lolalyttics Site
export const MIN_DELAY = 0.5;
export const MAX_DELAY = 1.2;
export const PROXY_ON = false;
export const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
export const MAX_USER_AGENT_REQUESTS = 15;
export const USER_AGENTS = [
  // Chrome Windows
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',

  // Firefox Windows
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0',

  // Chrome macOS
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_3_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.4 Safari/605.1.15',

  // Edge Windows
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0',

  // Mobile Android Chrome
  'Mozilla/5.0 (Linux; Android 12; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',

  // Mobile iOS Safari
  'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1',
];

// Config parameters
export const TIME_BEFORE_UPDATE = 24;
export const DEFAULT_SORT_FIELD = 'pickRate';
export const ENCRYPT_STRENGTH = 12;
export const PASSWORD_MIN_LENGTH = 8;

// Riot static data
export const RIOT_DATA_DRAGON = 'https://ddragon.leagueoflegends.com/';
export const riotLolRoles = {
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
export const riotLolRolesArray = Object.values(riotLolRoles).map(el => el.id);

export const riotLolRanks = {
  all: {
    id: 'all',
    name: 'All Ranks',
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
