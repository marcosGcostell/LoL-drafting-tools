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

// User config
export const RESERVED_USER_NAMES = [
  'login',
  'signup',
  'logout',
  'admin',
  'me',
  'user',
  'users',
];

// Riot static data
export const RIOT_DATA_DRAGON = 'https://ddragon.leagueoflegends.com/';
export const riotLolRoles = {
  top: {
    index: 1,
    id: 'top',
    name: 'Top',
    longName: 'Top Lane',
    img: 'top.webp',
  },
  jungle: {
    index: 2,
    id: 'jungle',
    name: 'Jungle',
    longName: 'Jungle',
    img: 'jungle.webp',
  },
  mid: {
    index: 3,
    id: 'middle',
    name: 'Mid',
    longName: 'Mid Lane',
    img: 'middle.webp',
  },
  adc: {
    index: 4,
    id: 'bottom',
    name: 'ADC',
    longName: 'AD Carry',
    img: 'bottom.webp',
  },
  support: {
    index: 5,
    id: 'support',
    name: 'Support',
    longName: 'Support',
    img: 'support.webp',
  },
};
export const riotLolRolesArray = Object.values(riotLolRoles).map(el => el.id);

export const riotLolRanks = {
  all: {
    index: 0,
    id: 'all',
    name: 'All',
    longName: 'All Ranks',
    img: 'all.webp',
  },
  challenger: {
    index: 2,
    id: 'challenger',
    name: 'Challenger',
    longName: 'Challenger rank',
    img: 'challenger.webp',
  },
  grandmaster: {
    index: 2,
    id: 'grandmaster',
    name: 'Grand Master',
    longName: 'Grand Master divisions',
    img: 'grandmaster.webp',
  },
  grandmaster_plus: {
    index: 3,
    id: 'grandmaster_plus',
    name: '+Grand Master',
    longName: 'Grand Master divisions and +',
    img: 'grandmaster.webp',
  },
  master: {
    index: 4,
    id: 'master',
    name: 'Master',
    longName: 'Master divisions',
    img: 'master.webp',
  },
  master_plus: {
    index: 5,
    id: 'master_plus',
    name: '+Master',
    longName: 'Master divisions and +',
    img: 'master.webp',
  },
  diamond: {
    index: 6,
    id: 'diamond',
    name: 'Diamond',
    longName: 'Diamond divisions',
    img: 'diamond.webp',
  },
  d2_plus: {
    index: 7,
    id: 'd2_plus',
    name: '+D2',
    longName: 'Diamond 2 and +',
    img: 'diamond.webp',
  },
  diamond_plus: {
    index: 8,
    id: 'diamond_plus',
    name: '+Diamond',
    longName: 'Diamond divisions and +',
    img: 'diamond.webp',
  },
  emerald: {
    index: 9,
    id: 'emerald',
    name: 'Emerald',
    longName: 'Emerald divisions',
    img: 'emerald.webp',
  },
  emerald_plus: {
    index: 10,
    id: 'emerald_plus',
    name: '+Emerald',
    longName: 'Emerald divisions and +',
    img: 'emerald.webp',
  },
  platinum: {
    index: 11,
    id: 'platinum',
    name: 'Platinum',
    longName: 'Platinum divisions',
    img: 'platinum.webp',
  },
  platinum_plus: {
    index: 12,
    id: 'platinum_plus',
    name: '+Platinum',
    longName: 'Platinum divisions and +',
    img: 'platinum.webp',
  },
  gold: {
    index: 13,
    id: 'gold',
    name: 'Gold',
    longName: 'Gold divisions',
    img: 'gold.webp',
  },
  gold_plus: {
    index: 14,
    id: 'gold_plus',
    name: '+Gold',
    longName: 'Gold divisions and +',
    img: 'gold.webp',
  },
  silver: {
    index: 15,
    id: 'silver',
    name: 'Silver',
    longName: 'Silver divisions',
    img: 'silver.webp',
  },
  bronze: {
    index: 16,
    id: 'bronze',
    name: 'Bronze',
    longName: 'Bronze divisions',
    img: 'bronze.webp',
  },
  iron: {
    index: 17,
    id: 'iron',
    name: 'Iron',
    longName: 'Iron divisions',
    img: 'iron.webp',
  },
  unranked: {
    index: 18,
    id: 'unranked',
    name: 'Unranked',
    longName: 'Unranked',
    img: 'unranked.webp',
  },
};
export const riotLolRanksArray = Object.values(riotLolRanks).map(el => el.id);
