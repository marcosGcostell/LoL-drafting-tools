import { RiotRole, RiotRank } from './riot-static-model.js';

const resetStaticData = async () => {
  await RiotRole.deleteMany();
  await RiotRole.create([
    {
      index: 1,
      id: 'top',
      name: 'Top',
      longName: 'Top Lane',
      img: 'top.webp',
    },
    {
      index: 2,
      id: 'jungle',
      name: 'Jungle',
      longName: 'Jungle',
      img: 'jungle.webp',
    },
    {
      index: 3,
      id: 'middle',
      name: 'Mid',
      longName: 'Mid Lane',
      img: 'middle.webp',
    },
    {
      index: 4,
      id: 'bottom',
      name: 'ADC',
      longName: 'AD Carry',
      img: 'bottom.webp',
    },
    {
      index: 5,
      id: 'support',
      name: 'Support',
      longName: 'Support',
      img: 'support.webp',
    },
  ]);
  await RiotRank.deleteMany();
  await RiotRank.create([
    {
      index: 0,
      id: 'all',
      name: 'All',
      longName: 'All ranks',
      img: 'all.webp',
    },
    {
      index: 1,
      id: 'challenger',
      name: 'Challenger',
      longName: 'Challenger rank',
      img: 'challenger.webp',
    },
    {
      index: 2,
      id: 'grandmaster',
      name: 'Grand Master',
      longName: 'Grand Master divisions',
      img: 'grandmaster.webp',
    },
    {
      index: 3,
      id: 'grandmaster_plus',
      name: '+Grand Master',
      longName: 'Grand Master divisions and +',
      img: 'grandmaster.webp',
    },
    {
      index: 4,
      id: 'master',
      name: 'Master',
      longName: 'Master divisions',
      img: 'master.webp',
    },
    {
      index: 5,
      id: 'master_plus',
      name: '+Master',
      longName: 'Master divisions and +',
      img: 'master.webp',
    },
    {
      index: 6,
      id: 'diamond',
      name: 'Diamond',
      longName: 'Diamond divisions',
      img: 'diamond.webp',
    },
    {
      index: 7,
      id: 'd2_plus',
      name: '+D2',
      longName: 'Diamond 2 and +',
      img: 'diamond.webp',
    },
    {
      index: 8,
      id: 'diamond_plus',
      name: '+Diamond',
      longName: 'Diamond divisions and +',
      img: 'diamond.webp',
    },
    {
      index: 9,
      id: 'emerald',
      name: 'Emerald',
      longName: 'Emerald divisions',
      img: 'emerald.webp',
    },
    {
      index: 10,
      id: 'emerald_plus',
      name: '+Emerald',
      longName: 'Emerald divisions and +',
      img: 'emerald.webp',
    },
    {
      index: 11,
      id: 'platinum',
      name: 'Platinum',
      longName: 'Platinum divisions',
      img: 'platinum.webp',
    },
    {
      index: 12,
      id: 'platinum_plus',
      name: '+Platinum',
      longName: 'Platinum divisions and +',
      img: 'platinum.webp',
    },
    {
      index: 13,
      id: 'gold',
      name: 'Gold',
      longName: 'Gold divisions',
      img: 'gold.webp',
    },
    {
      index: 14,
      id: 'gold_plus',
      name: '+Gold',
      longName: 'Gold divisions and +',
      img: 'gold.webp',
    },
    {
      index: 15,
      id: 'silver',
      name: 'Silver',
      longName: 'Silver divisions',
      img: 'silver.webp',
    },
    {
      index: 16,
      id: 'bronze',
      name: 'Bronze',
      longName: 'Bronze divisions',
      img: 'bronze.webp',
    },
    {
      index: 17,
      id: 'iron',
      name: 'Iron',
      longName: 'Iron divisions',
      img: 'iron.webp',
    },
    {
      index: 18,
      id: 'unranked',
      name: 'Unranked',
      longName: 'Unranked',
      img: 'unranked.webp',
    },
  ]);
};

export default resetStaticData;
