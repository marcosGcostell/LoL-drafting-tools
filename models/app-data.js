import Version from './riot-version-model.js';
import Champion from './riot-champion-model.js';

export const getLocalVersion = async () => {
  const [version] = await Version.find();
  console.log(`Version readed from database: ${version.id} ✅`);
  return version;
};

export const saveVersion = async version => {
  try {
    const data = {
      id: version,
      createdAt: new Date().toISOString(),
    };
    console.log(
      `Version to be saved in database: ${data.id} ${data.createdAt}`
    );
    await Version.deleteMany();
    await Version.create(data);
    console.log('Version saved! ✅');
    return data;
  } catch (err) {
    throw err;
  }
};

export const getChampionIds = champions => Object.keys(champions);

export const getChampionNames = champions => {
  const championNames = [];
  getChampionIds(champions).forEach(id =>
    championNames.push(champions[id].name)
  );
  return championNames;
};

export const getChampionsFromDb = async () => {
  console.log('Getting champions from database...');
  const localChampions = {};
  let query = Champion.find();
  query = query.select('-__v');
  const championsArray = await query;
  championsArray.forEach(el => (localChampions[el.riotId] = el));
  return localChampions;
};

export const saveChampions = async champions => {
  try {
    console.log('Saving champions to database...');
    const championIds = getChampionIds(champions);
    const data = championIds.map(id => champions[id]);
    await Champion.deleteMany();
    await Champion.create(data);
  } catch (err) {
    throw err;
  }
};

export const addLolalyticsIds = async folders => {
  try {
    console.log('Adding lolalytics folders to database...');
    Object.keys(folders).forEach(name => {
      const champion = Champion.find({ name: name });
    });
  } catch (err) {
    throw err;
  }
};
