import { JSDOM } from 'jsdom';

import { MIN_DELAY, MAX_DELAY } from '../common/config.js';
import { PROXY_ON, PROXY_URL } from '../common/config.js';
import { getRandomNumber, wait } from '../common/helpers.js';

///////////////////////////////////////

/**
 * @class Lolalytics -
 * API to manage Lolalytics content
 */
class Lolalytics {
  #baseURL = 'https://lolalytics.com/lol/';
  listIntegrity;

  // PRIVATE METHODS

  /**
   * @method #getCountersURL
   * Returns the url for counters webpage. champion should be Lolalytics folder name.
   * @return {String} The url for (this champion, rank, lane, [vs this lane]) .
   */
  #getCountersURL(champion, rank, lane, vsLane = lane) {
    let str = `${this.#baseURL}${champion}/counters/?lane=${lane}&tier=${rank}`;
    if (vsLane !== 'main' && vsLane !== lane) str += `&vslane=${vsLane}`;
    return str;
  }

  /**
   * @method #getTierlistURL
   * Returns the url for the tierlist webpage
   * @return {String} The url for (this rank, and lane).
   */
  #getTierlistURL = function (rank = 'all', lane = 'main') {
    return `${this.#baseURL}tierlist/?${
      lane !== 'main' ? `lane=${lane}&` : ''
    }tier=${rank}&view=grid`;
  };

  /**
   * @async
   * @method #scrapeWebPage
   * Get html data from lolalytics website
   * @param {String} url to download.
   * @return {Promise<Document>} The html page as DOM Document.
   */
  async #scrapeWebPage(url) {
    try {
      // Always wait for lolalytics requests
      await wait(getRandomNumber(MIN_DELAY, MAX_DELAY));
      const response = await fetch(`${PROXY_ON ? PROXY_URL : ''}${url}`);
      const html = await response.text();
      const dom = new JSDOM(html);

      return dom.window.document;

      // This is with DOMParser of browser DOM API. Doesn't work in node.js
      // const parser = new DOMParser();
      // const doc = parser.parseFromString(html, 'text/html');
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  // PUBLIC METHODS

  /**
   * @async
   * @method #getChampionFolders
   * Get the champion folders for lolalytics website urls
   * @param {Array<String>} riotIds list of Riot champion ids.
   * @param {Array<String>} riotNames list of Riot champion names.
   * @return {Array<Object>} riotIds(keys) LolalyticsFolders(values).
   */
  async getChampionFolders(riotIds, riotNames) {
    try {
      // Scrape the lolalytics web page
      const virtualDomDocument = await this.#scrapeWebPage(
        `${this.#baseURL}aatrox/counters/`
      );

      // Select the table where the champion information is (HTMLCollection)
      // convert it to an Array and filter only champions (elements with children)
      const championsGrid = Array.from(
        virtualDomDocument.getElementsByTagName('main')[0].children[5]
          .children[1].firstElementChild.firstElementChild.children
      ).filter(element => element.children.length);

      // Store an array of name and path pairs
      // from the HTMLElemts array
      const entries = championsGrid.map(cell => {
        return [
          cell.firstElementChild.firstElementChild.firstElementChild.getAttribute(
            'alt'
          ),
          cell.firstElementChild.getAttribute('href').split('/')[2],
        ];
      });

      // All names have to exist in the same way in Riot List
      this.listIntegrity = entries.reduce(
        (integrity, elem) => riotNames.includes(elem[0]) && integrity,
        true
      );

      // Replace the Riot names for Riot Ids
      // And return the array converted to a list of objects
      return Object.fromEntries(
        entries.map(entry => [riotIds[riotNames.indexOf(entry[0])], entry[1]])
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  /**
   * @async
   * @method getTierlist
   * Get a tier list from lolalytics website
   * @param {String} [rank] in this rank (default = 'all').
   * @param {String} [lane] for this role (default = 'main').
   * @return {Promise<Array>} of champion objects.
   */
  async getTierlist(rank = 'all', lane = 'main') {
    try {
      // Scrape the lolalytics web page
      const virtualDomDocument = await this.#scrapeWebPage(
        this.#getTierlistURL(rank, lane)
      );

      // Select the table where the champion information is (HTMLCollection)
      // convert it to an Array and filter only champions (elements with children)
      const championsGrid = Array.from(
        virtualDomDocument.getElementsByTagName('main')[0].children[5]
          .children[1].children
      ).filter(element => element.children.length);

      // return an array of objects of some selected data
      // from the HTMLElemts array
      return championsGrid.map(cell => {
        const championElement = cell.firstElementChild.firstElementChild;
        const dataSection =
          championElement.children[1].children[1].firstElementChild;
        return {
          name: championElement.firstElementChild.textContent,
          winRatio: +dataSection.children[1].textContent,
          pickRate: +dataSection.children[2].textContent,
          banRate: +dataSection.children[3].textContent,
          // img: '',
        };
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  /**
   * @async
   * @method getCounters
   * Get counters data from lolalytics website
   * @param {String} champion for this champion.
   * @param {String} [rank] in this rank (default = 'all').
   * @param {String} [lane] for this role (default = 'main').
   * @param {String} [vsLane] versus this other role (default = 'lane').
   * @return {Promise<Array>} of champion objects.
   */
  async getCounters(champion, lane, rank = 'all', vsLane = lane) {
    try {
      // Scrape the lolalytics web page
      const virtualDomDocument = await this.#scrapeWebPage(
        this.#getCountersURL(champion, rank, lane, vsLane)
      );

      // Select the table where the champion information is (HTMLCollection)
      // convert it to an Array and filter only the <span> elements
      const championsGrid = Array.from(
        virtualDomDocument.getElementsByTagName('main')[0].children[5]
          .firstElementChild.children[1].children
      ).filter(element => element.tagName === 'SPAN');

      // return an array of objects of some selected data
      // from the HTMLElemts array
      return championsGrid.map(cell => {
        const dataSection =
          cell.firstElementChild.firstElementChild.firstElementChild;
        return {
          name: dataSection.firstElementChild.textContent,
          winRatio: Number.parseFloat(
            dataSection.children[2].children[1].textContent
          ),
          delta1: Number.parseFloat(
            dataSection.children[3].firstElementChild.textContent.slice(3)
          ),
          delta2: Number.parseFloat(
            dataSection.children[3].children[1].textContent.slice(3)
          ),
        };
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

export default new Lolalytics();
