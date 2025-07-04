import appData from './appData';

export default class ChampionList {
  constructor(list = []) {
    this._data = list;
  }

  get data() {
    return this._data;
  }

  set data(list) {
    this._data = list;
  }

  addChampionIds() {
    this._data.forEach(champion => {
      appData.champions[champion.name]
        ? (champion.id = appData.champions[champion.name].id)
        : (champion.id = appData.getChampionByName(champion.name).id);
    });
  }

  addChampionImages() {
    this._data.forEach(champion => {
      if (appData.champions[champion.id])
        champion.img = appData.champions[champion.id].img;
    });
  }

  addChampionSprites() {
    this._data.forEach(champion => {
      if (appData.champions[champion.id])
        champion.sprite = appData.champions[champion.id].sprite;
    });
  }

  addIndexes() {
    this._data.reduce((acc, champion) => {
      champion.index = acc;
      return ++acc;
    }, 0);
  }

  completeListData() {
    this.addChampionIds();
    this.addChampionImages();
    this.addChampionSprites();
  }
}
