import Riot from '../models/api/riot-api.js';
import Lolalytics from '../models/api/lolalytics-api.js';
import * as Data from '../models/app-data.js';
import { hasLocalVersionExpired } from '../models/common/helpers.js';

// Only for reseting stored version and force to update
import Version from '../models/riot-version-model.js';

export const getChampions = async (req, res) => {
  try {
    console.log('Getting champions...');
    // FIXME Create a version to init the database. Delete after created
    await Version.deleteMany();
    await Version.create({
      id: '15.10.1',
      createdAt: '1970-01-01T00:00:00Z',
    });

    let nameList = [];
    let idList = [];
    let localVersion = await Data.getLocalVersion();

    // Checks if the local version was updated recently
    if (hasLocalVersionExpired(localVersion.createdAt)) {
      console.log('Version backup expired!');
      const riotVersion = await Riot.getLastGameVersion();

      // Checks there is a new version and database needs update
      if (riotVersion !== localVersion.id) {
        console.log('There is a new version. Updating database...');
        const champions = await Riot.updateDataFromServer(riotVersion);
        idList = Data.getChampionIds(champions);
        nameList = Data.getChampionNames(champions);

        // Add the lolalytics folder for each champion
        const folders = await Lolalytics.getChampionFolders(idList, nameList);
        if (!Lolalytics.listIntegrity) {
          // TODO this error should be handled.
          // Id's tight coupled with lolalytics website
          console.log('Lolalytics folder list has errors! 🧨');
        }

        idList.forEach(id => (champions[id].id = folders[id]));

        // Save data to the database
        localVersion = await Data.saveVersion(riotVersion);
        await Data.saveChampions(champions);
      }
    }

    // We get the data from database anyway to get the database _id
    const champions = await Data.getChampionsFromDb();

    // Get idList and nameList if update database was not needed
    if (!idList.length) {
      idList = Data.getChampionIds(champions);
      nameList = Data.getChampionNames(champions);
    }
    console.log(`${idList.length} Champions read from database ✅`);

    // Send response
    res.status(200).json({
      status: 'success',
      results: idList.length,
      data: {
        champions,
        idList,
        nameList,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};
