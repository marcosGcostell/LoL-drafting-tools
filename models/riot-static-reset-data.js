import { riotRole, riotRank } from './riot-static-model.js';

const resetStaticData = async () => {
  await riotRole.deleteMany();
  await riotRole.create([
    {
      index: 1,
      id: 'top',
      name: 'Top',
      img: 'top.webp',
    },
    {
      index: 2,
      id: 'jungle',
      name: 'Jungle',
      img: 'jungle.webp',
    },
    {
      index: 3,
      id: 'middle',
      name: 'Mid',
      img: 'middle.webp',
    },
    {
      index: 4,
      id: 'bottom',
      name: 'ADC',
      img: 'bottom.webp',
    },
    {
      index: 5,
      id: 'support',
      name: 'Support',
      img: 'support.webp',
    },
  ]);
  await riotRank.deleteMany();
  await riotRank.create([
    {
      index: 0,
      id: 'all',
      name: 'All',
      img: 'all.webp',
    },
    {
      index: 1,
      id: 'challenger',
      name: 'Challenger',
      img: 'challenger.webp',
    },
    {
      index: 2,
      id: 'grandmaster',
      name: 'Grand Master',
      img: 'grandmaster.webp',
    },
    {
      index: 3,
      id: 'grandmaster_plus',
      name: '+Grand Master',
      img: 'grandmaster.webp',
    },
    {
      index: 4,
      id: 'master',
      name: 'Master',
      img: 'master.webp',
    },
    {
      index: 5,
      id: 'master_plus',
      name: '+Master',
      img: 'master.webp',
    },
    {
      index: 6,
      id: 'diamond',
      name: 'Diamond',
      img: 'diamond.webp',
    },
    {
      index: 7,
      id: 'd2_plus',
      name: '+D2',
      img: 'diamond.webp',
    },
    {
      index: 8,
      id: 'diamond_plus',
      name: '+Diamond',
      img: 'diamond.webp',
    },
    {
      index: 9,
      id: 'emerald',
      name: 'Emerald',
      img: 'emerald.webp',
    },
    {
      index: 10,
      id: 'emerald_plus',
      name: '+Emerald',
      img: 'emerald.webp',
    },
    {
      index: 11,
      id: 'platinum',
      name: 'Platinum',
      img: 'platinum.webp',
    },
    {
      index: 12,
      id: 'platinum_plus',
      name: '+Platinum',
      img: 'platinum.webp',
    },
    {
      index: 13,
      id: 'gold',
      name: 'Gold',
      img: 'gold.webp',
    },
    {
      index: 14,
      id: 'gold_plus',
      name: '+Gold',
      img: 'gold.webp',
    },
    {
      index: 15,
      id: 'silver',
      name: 'Silver',
      img: 'silver.webp',
    },
    {
      index: 16,
      id: 'bronze',
      name: 'Bronze',
      img: 'bronze.webp',
    },
    {
      index: 17,
      id: 'iron',
      name: 'Iron',
      img: 'iron.webp',
    },
    {
      index: 18,
      id: 'unranked',
      name: 'Unranked',
      img: 'unranked.webp',
    },
  ]);
};

export default resetStaticData;
