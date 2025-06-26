import mongoose from 'mongoose';

import { riotRole, riotRank } from '../riot-static-model.js';
import Version from '../riot-version-model.js';
import Lolalytics from '../api/lolalytics-api.js';
import Tierlist from '../tierlist-model.js';
import { saveTierlist } from '../../controllers/tierlist-handlers.js';
import { getRandomInt, wait, isoTimeStamp } from './helpers.js';

const createGroups = async () => {
  const roles = await riotRole.find();
  const ranks = await riotRank.find();
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
        groups.length || group.length
          ? ranks.splice(getRandomInt(0, ranks.length - 1), 1)
          : [ranks.shift()];
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

const replaceTierlist = async ({ lane, rank, patch }) => {
  const tierlist = await Lolalytics.getTierlist(lane, rank, patch);
  if (!tierlist.length)
    return console.error(
      `🔴 ERROR!: Couldn't get tierlist (${lane}, ${rank}, ${patch})`
    );
  Tierlist.deleteOne({ lane, rank, patch });
  saveTierlist(lane, rank, patch, tierlist);
};

export const updateAllTierlists = async DB => {
  try {
    mongoose
      .connect(DB)
      .then(() => console.log('Worker conected to DB: ', isoTimeStamp()));
    const groups = await createGroups();
    for (const tasks of groups) {
      console.log('✅ Starting with new group...', isoTimeStamp());
      for (const task of tasks) {
        // console.log(task, isoTimeStamp());

        await wait(0.05);
      }
      if (groups.indexOf(tasks) < groups.length - 1) await wait(1);
    }
    mongoose.disconnect();
  } catch (err) {
    console.log('🔴 ERROR!!!: ', err);
  }
};
