import mongoose from 'mongoose';

import { RiotRole, RiotRank } from '../riot-static-model.js';
import Version from '../riot-version-model.js';
import Lolalytics from '../api/lolalytics-api.js';
import Tierlist from '../tierlist-model.js';
import { saveTierlist } from '../../controllers/tierlist-handlers.js';
import { getRandomInt, wait, isoTimeStamp, expirationDate } from './helpers.js';

const REQ_MIN_LAPSE = 2;
const REQ_MAX_LAPSE = 8;
const GROUP_MIN_LAPSE = 45 * 60;
const GROUP_MAX_LAPSE = 65 * 60;

const log = (icon, message) =>
  console.log(`${icon} - ${isoTimeStamp()}: ${message}`);

const createGroups = async remainingRanks => {
  const roles = await RiotRole.find();
  const ranks = remainingRanks ? remainingRanks : await RiotRank.find();
  const version = await Version.getVersionString();
  const patchs = [version, '7'];

  const groups = [];
  while (ranks.length) {
    const group = [];
    const groupSize = getRandomInt(2, 4);
    for (let i = 0; i < groupSize; i++) {
      if (!ranks.length) break;
      // First group always get 'all' rank (index = 0)
      const [rank] =
        ranks[0].id === 'all'
          ? [ranks.shift()]
          : ranks.splice(getRandomInt(0, ranks.length - 1), 1);
      roles.forEach(role =>
        patchs.forEach(patch =>
          group.push({ lane: role.id, rank: rank.id, patch })
        )
      );
    }
    groups.push(group);
  }

  return groups;
};

const getRemainingRanks = async () => {
  const ranks = await RiotRank.find();
  const allValidLists = await Tierlist.find({
    createdAt: { $gte: expirationDate(12) },
  });

  return ranks.filter(
    rank => allValidLists.filter(el => el.rank === rank.id).length < 10
  );
};

const replaceTierlist = async ({ lane, rank, patch }) => {
  const tierlist = await Lolalytics.getTierlist(lane, rank, patch);
  if (!tierlist.length)
    return console.error(
      `🔴 ERROR!: Couldn't get tierlist (${lane}, ${rank}, ${patch})`
    );
  await Tierlist.deleteOne({ lane, rank, patch });
  saveTierlist(lane, rank, patch, tierlist);
};

export const updateAllTierlists = async (DB, options) => {
  try {
    await mongoose.connect(DB);
    log('▶️', ' Worker conected to DB: ');

    const remainingRanks = options.noreset ? await getRemainingRanks() : null;
    const groups = await createGroups(remainingRanks);

    for (const tasks of groups) {
      log('\n\n📦', 'Starting with new group...');
      for (const task of tasks) {
        try {
          await replaceTierlist(task);
          log('', '');
        } catch (err) {
          console.error(`❌ Error getting: ${task} (${err})`);
        }
        await wait(getRandomInt(REQ_MIN_LAPSE, REQ_MAX_LAPSE));
      }
      // Last group doesn't wait for the next one
      if (groups.indexOf(tasks) < groups.length - 1) {
        await wait(getRandomInt(GROUP_MIN_LAPSE, GROUP_MAX_LAPSE));
      }
    }
    await mongoose.disconnect();
    log('⏹️', 'Worker finished and disconneted');
  } catch (err) {
    console.error('🔴 Critical Error!: ', err);
  }
};
