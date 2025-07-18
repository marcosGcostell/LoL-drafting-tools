import puppeteer from 'puppeteer';
import { JSDOM } from 'jsdom';

import {
  MIN_DELAY,
  MAX_DELAY,
  PROXY_ON,
  PROXY_URL,
  MAX_USER_AGENT_REQUESTS,
} from '../utils/config.js';
import {
  getRandomNumber,
  waitMs,
  getRandomUserAgent,
} from '../utils/helpers.js';
import AppError from '../utils/app-error.js';

///////////////////////////////////////

/**
 * @class Lolalytics -
 * API to manage Lolalytics content
 */
class Lolalytics {
  #baseURL = 'https://lolalytics.com/lol/';

  listIntegrity;

  constructor() {
    this._lastConnection = Date.now() - MAX_DELAY * 1000;
    this._currentUserAgent = getRandomUserAgent();
    this._userAgentCount = 0;
  }

  // PRIVATE METHODS

  /**
   * @method #allowConnection
   * Prevents from making connections before a preset delay
   */
  async #allowConnection() {
    const allowedTime =
      getRandomNumber(MIN_DELAY, MAX_DELAY) * 1000 + this._lastConnection;
    if (Date.now() < allowedTime) await waitMs(allowedTime - Date.now());
    this._lastConnection = Date.now();
  }

  /**
   * @method #getTierlistURL
   * Returns the url for the tierlist webpage
   * @return {String} The url for (this rank, and lane).
   */
  #getTierlistURL({ lane = 'top', rank = 'all', patch = '' }) {
    return `${this.#baseURL}tierlist/?${
      lane !== 'main' ? `lane=${lane}&` : ''
    }tier=${rank}${patch === '7' ? '&patch=7' : ''}&view=grid`;
  }

  /**
   * @method #getCountersURL
   * Returns the url for counters webpage. champion should be Lolalytics folder name.
   * @return {String} The url for (this champion, rank, lane, [vs this lane]) .
   */
  #getCountersURL({ champion, lane, rank = 'all', vsLane = lane, patch = '' }) {
    let str = `${this.#baseURL}${champion}/counters/?lane=${lane}&tier=${rank}`;
    if (vsLane !== 'main' && vsLane !== lane) str += `&vslane=${vsLane}`;
    if (patch === '7') str += '&patch=7';
    return str;
  }

  /**
   * @method #getBuildURL
   * Returns the url for counters webpage. champion should be Lolalytics folder name.
   * @return {String} The url for (this champion, rank, lane, [vs this lane]) .
   */
  #getBuildURL({ champion, lane, rank = 'all', patch = '' }) {
    return `${this.#baseURL}${champion}/build/?lane=${lane}&tier=${rank}${
      patch === '7' ? '&patch=7' : ''
    }`;
  }

  /**
   * @async
   * @method #scrapeWebPage
   * Get html data from lolalytics website
   * @param {String} url to download.
   * @return {Promise<Document>} The html page as DOM Document.
   */
  async #scrapeWebPage(url) {
    // Always wait for lolalytics requests
    await this.#allowConnection();
    const response = await fetch(`${PROXY_ON ? PROXY_URL : ''}${url}`);
    const html = await response.text();
    const dom = new JSDOM(html);

    return dom.window.document;
  }

  async #getVirtualWebPage(url) {
    const browserArgs = ['--no-sandbox', '--disable-setuid-sandbox'];
    if (PROXY_ON) {
      browserArgs.push(`--proxy-server=${PROXY_URL}`);
    }
    const browser = await puppeteer.launch({
      headless: 'new',
      args: browserArgs,
      slowMo: 100,
    });
    const webPage = await browser.newPage();
    // Rotate user agents
    if (
      this._userAgentCount >
      MAX_USER_AGENT_REQUESTS + getRandomNumber(-2, 5)
    ) {
      this._userAgentCount = 0;
      this._currentUserAgent = getRandomUserAgent();
    }
    await webPage.setUserAgent(this._currentUserAgent);
    await webPage.setExtraHTTPHeaders({
      'accept-language': 'en-US,en;q=0.9',
      referer: 'https://www.google.com/',
    });
    await webPage.goto(url, { waitUntil: 'networkidle2' });

    // Wait to the privacy settings pop-up
    await webPage
      .waitForSelector('.ncmp__btn', { timeout: 5000 })
      .catch(() => {});
    await webPage.evaluate(() => {
      // Click accept button
      const buttons = Array.from(document.querySelectorAll('.ncmp__btn'));
      const acceptBtn = buttons.find(btn =>
        btn.textContent?.toLowerCase().includes('accept'),
      );
      if (acceptBtn) acceptBtn.click();
    });

    // Wait for the consent privacy to resolve the page
    await waitMs(2000 + getRandomNumber(-500, 500));
    await webPage.waitForSelector('main', { timeout: 10000 });

    // Need to scroll down to load all champions on the grid
    await webPage.evaluate(async () => {
      await new Promise(resolve => {
        let totalHeight = 0;
        const distance = 300 + (Math.random() * 100 - 50);
        const timer = setInterval(() => {
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= document.body.scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 150);
      });
    });
    await waitMs(1500 + getRandomNumber(-500, 500));
    return { browser, webPage };
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
    // Scrape the lolalytics web page
    const virtualDomDocument = await this.#scrapeWebPage(
      `${this.#baseURL}aatrox/counters/`,
    );

    // Select the table where the champion information is (HTMLCollection)
    // convert it to an Array and filter only champions (elements with children)
    const championsGrid = Array.from(
      virtualDomDocument.querySelector('main').children[5].children[1]
        .firstElementChild.firstElementChild.children,
    ).filter(element => element.children.length);

    // Store an array of name and path pairs
    // from the HTMLElemts array
    const entries = championsGrid.map(cell => [
      cell.firstElementChild.firstElementChild.firstElementChild.getAttribute(
        'alt',
      ),
      cell.firstElementChild.getAttribute('href').split('/')[2],
    ]);

    // All names have to exist in the same way in Riot List
    this.listIntegrity = entries.reduce(
      (integrity, [championName, _]) =>
        riotNames.includes(championName) && integrity,
      true,
    );

    // Replace the Riot names for Riot Ids
    // And return the array of objects { RiotId: lolalyticsId }
    return Object.fromEntries(
      entries.map(([championName, id]) => [
        riotIds[riotNames.indexOf(championName)],
        id,
      ]),
    );
  }

  /**
   * @async
   * @method getTierlist
   * Get a tier list from lolalytics website
   * @param {String} [rank] in this rank (default = 'all').
   * @param {String} [lane] for this role (default = 'main').
   * @return {Promise<Array>} of champion objects.
   */
  async getTierlist(queryObj) {
    // Get the puppeteer browser and lolalytics web page
    const { browser, webPage } = await this.#getVirtualWebPage(
      this.#getTierlistURL(queryObj),
    );

    // Get the webpage info navigating through children
    const tierlist = await webPage.evaluate(() => {
      // Get the grid checking the path
      const main = document.querySelector('main');
      if (!main) return null;
      const section = main.children[5];
      if (!section || !section.children[1]) return null;

      // Convert HTMLCollection with champion information to an array
      // Select only champion cells (skip elements without childrens)
      const championsGrid = section.children[1];
      if (!championsGrid.children) {
        throw new AppError(
          'There is still not enough games. Try another patch or rank.',
          204,
        );
      }
      const championCells = Array.from(championsGrid.children).filter(
        el => el.children.length,
      );

      // evaluate callback returns an array of objects (one from each HTML Element)
      return championCells
        .map(cell => {
          const championElement = cell.firstElementChild.firstElementChild;
          const dataSection =
            championElement.children[1].children[1].firstElementChild;
          return {
            name: championElement.firstElementChild.textContent.trim(),
            roleRate: parseFloat(
              championElement.children[1].firstElementChild.children[2]
                .firstElementChild.textContent,
            ),
            winRatio: parseFloat(dataSection.children[1].textContent),
            pickRate: parseFloat(dataSection.children[2].textContent),
            banRate: parseFloat(dataSection.children[3].textContent),
          };
        })
        .filter(Boolean);
    });

    await browser.close();
    if (tierlist === null)
      throw new AppError('Could not find the tierlists data', 404);
    return tierlist;
  }

  // -------------------
  // Fetch version without puppeteer
  // -------------------
  // async getTierlist(lane = 'top', rank = 'all') {
  //   // Scrape the lolalytics web page
  //   const virtualDomDocument = await this.#scrapeWebPage(
  //     this.#getTierlistURL(lane, rank)
  //   );

  //   // Select the table where the champion information is (HTMLCollection)
  //   // convert it to an Array and filter only champions (elements with children)
  //   const championsGrid = Array.from(
  //     virtualDomDocument.querySelector('main').children[5].children[1]
  //       .children
  //   ).filter(element => element.children.length);

  //   // return an array of objects of some selected data
  //   // from the HTMLElemts array
  //   return championsGrid.map(cell => {
  //     const championElement = cell.firstElementChild.firstElementChild;
  //     const dataSection =
  //       championElement.children[1].children[1].firstElementChild;
  //     return {
  //       name: championElement.firstElementChild.textContent,
  //       roleRate:
  //         +championElement.children[1].firstElementChild.children[2]
  //           .firstElementChild.textContent,
  //       winRatio: +dataSection.children[1].textContent,
  //       pickRate: +dataSection.children[2].textContent,
  //       banRate: +dataSection.children[3].textContent,
  //       // img: '',
  //     };
  //   });
  // }

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
  async getCounters(queryObj) {
    // Scrape the lolalytics web page
    const virtualDomDocument = await this.#scrapeWebPage(
      this.#getCountersURL(queryObj),
    );

    // Select the table where the champion information is (HTMLCollection)
    // convert it to an Array and filter only the <span> elements
    const championsGrid = Array.from(
      virtualDomDocument.querySelector('main').children[5].firstElementChild
        .children[1].children,
    ).filter(element => element.tagName === 'SPAN');

    // return an array of objects of some selected data
    // from the HTMLElemts array
    return championsGrid.map(cell => {
      const dataSection =
        cell.firstElementChild.firstElementChild.firstElementChild;
      return {
        name: dataSection.firstElementChild.textContent,
        winRatio: parseFloat(dataSection.children[2].children[1].textContent),
        delta1: parseFloat(
          dataSection.children[3].firstElementChild.textContent.slice(3),
        ),
        delta2: parseFloat(
          dataSection.children[3].children[1].textContent.slice(3),
        ),
      };
    });
  }

  /**
   * @async
   * @method getStats
   * Get counters data from lolalytics website
   * @param {String} champion for this champion.
   * @param {String} [rank] in this rank (default = 'all').
   * @param {String} [lane] for this role (default = 'main').
   * @param {String} [vsLane] versus this other role (default = 'lane').
   * @return {Promise<Array>} of champion objects.
   */
  async getStats(queryObj) {
    // Scrape the lolalytics web page
    const virtualDomDocument = await this.#scrapeWebPage(
      this.#getBuildURL(queryObj),
    );

    // Select the table where the champion information is (HTMLCollection)
    // convert it to an Array and filter only the <span> elements
    const rolesItems = Array.from(
      virtualDomDocument.querySelector('main').firstElementChild
        .firstElementChild.firstElementChild.children[1].children,
    );

    const roleRates = Object.fromEntries(
      rolesItems.map(el => [
        el.querySelector('img').getAttribute('alt').split(' ')[0],
        parseFloat(el.querySelector('div').textContent),
      ]),
    );

    const statsSection =
      virtualDomDocument.querySelector('main').children[4].children[1]
        .children[1].children[2];

    // return an object of some selected data
    return {
      winRatio: parseFloat(
        statsSection.firstElementChild.firstElementChild.firstElementChild
          .textContent,
      ),
      pickRate: parseFloat(
        statsSection.firstElementChild.lastElementChild.firstElementChild
          .textContent,
      ),
      banRate: parseFloat(
        statsSection.lastElementChild.children[2].firstElementChild.textContent,
      ),
      games: parseInt(
        statsSection.lastElementChild.lastElementChild.firstElementChild.textContent
          .split(',')
          .join(''),
        10,
      ),
      roleRates,
    };
  }
}

export default new Lolalytics();
