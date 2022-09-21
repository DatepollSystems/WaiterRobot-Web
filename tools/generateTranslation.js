/**
 * Credits go to https://github.com/qunabu/translate-script.
 * Adds compatibility to LibreTranslation API
 * Adds cache feature
 * Adds check against manual written language files in /src/assets/i18n/{target}.json
 *
 * Command syntax:
 *  node ./node_modules/dfx-translate/translation/generateTranslation.js {API_URL} {INPUT_LANG} {TARGET_LANG}
 *
 * Command examples:
 *  node ./node_modules/dfx-translate/translation/generateTranslation.js https://translate.abc.abc/translate de en
 *  node ./node_modules/dfx-translate/translation/generateTranslation.js https://translate.abc.abc/translate de fr
 *  node ./node_modules/dfx-translate/translation/generateTranslation.js https://translate.abc.abc/translate de es
 */

import fs from 'fs'; // eslint-disable-line
import fetch from 'node-fetch';

const URL = process.argv[2] || null;
const INPUT_LANG = process.argv[3] || 'de';
const TARGET_LANG = process.argv[4] || 'en';

let localCache = null;
let localManual = null;

/**
 * Get json from local machine
 * @param {String} filename on local machine
 * @returns {Promise} resolved object is JSON
 */
const getJSON = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf-8', (err, data) => {
      if (err) {
        reject(err);
      }
      try {
        resolve(JSON.parse(data));
      } catch (err) {
        reject(err);
      }
    });
  });
};

/**
 * Loads the cache and returns int
 * @param {String} term, to get translation
 * @param {String} target language code eg `en`
 * @returns {Object} or null if there is no entry
 */
const getManualEntry = (target, term) => {
  if (localManual == null) {
    const path = './src/assets/i18n/' + target + '.json';
    if (!fs.existsSync(path)) {
      console.log('!!! NO MANUAL LANGUAGE FILES EXISTS !!!');
      localManual = {};
    } else {
      localManual = JSON.parse(fs.readFileSync(path, 'utf-8'));
    }
  }
  return localManual[term] ? localManual[term] : null;
};

/**
 * Loads the cache and returns int
 * @param {String} term, key to be translated
 * @param {String} target language code eg `en`
 * @returns {Object} or null if there is no entry
 */
const getCacheEntry = (target, term) => {
  if (localCache == null) {
    const path = './node_modules/dfx-translate/translation/translation_cache_' + target + '.json';
    if (!fs.existsSync(path)) {
      localCache = {};
    } else {
      localCache = JSON.parse(fs.readFileSync(path, 'utf-8'));
    }
  }
  return localCache[term] ? localCache[term] : null;
};

/**
 * Saves new cache entry to cache
 * @param {String} key New cache entry key
 * @param {String} newCacheEntry New cache entry line
 * @param {String} target language code eg `en`
 * @returns {string[]} list of cache entries
 */
const writeToCache = (key, newCacheEntry, target) => {
  if (localCache == null) {
    localCache = {};
  }
  localCache[key] = newCacheEntry;
  fs.writeFile('./node_modules/dfx-translate/translation/translation_cache_' + target + '.json', JSON.stringify(localCache), (err) => {
    if (err) throw err;
    console.log('Saving "' + key + '" in ' + target + ': "' + newCacheEntry + '" to cache');
  });
};

/**
 * @param {Object} term, term to be translated the shape of `{key:"", value:""}`, eg. `{key:"fullName", value:"Full name"}
 * @param {String} target language code eg `en`
 * @returns {Promise} resolve object is in the same shape as input
 */
const getTranslation = (term, target) => {
  const cacheEntry = getCacheEntry(target, term.value);
  if (cacheEntry != null) {
    return new Promise((resolve) => {
      console.log('Translating from cache "' + term.value + '" to ' + target + ': "' + cacheEntry + '"');
      resolve({
        // resole the translation
        key: term.key,
        value: cacheEntry,
      });
    });
  }

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (URL == null) {
        throw Error('URL not provided');
      }
      fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
          format: 'text',
          q: term.value,
          target: target,
          source: INPUT_LANG,
        }),
      })
        .then((response) => (response.ok ? response : reject(`Fetch failed with status code ${response.status}`)))
        .then((response) => response.json()) // parses response to JSON
        .then((json) => {
          if (json.error) {
            reject(json.error); // reject if response contains error
          } else {
            console.log('Translating "' + term.value + '" to ' + target + ': "' + json.translatedText + '"');
            writeToCache(term.value, json.translatedText, target);
            resolve({
              // resole the translation
              key: term.key,
              value: json.translatedText,
            });
          }
        })
        .catch((error) => reject(error)); // reject in case of any error
    });
  });
};

/**
 * Saves object as JSON into file
 * @param {String} filename, name of file to be saved
 * @param {Object} obj to be saved as json
 * @returns {Promise}
 */
const writeToFile = (filename, obj) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, JSON.stringify(obj), (err) => (err ? reject(err) : resolve(filename)));
  });
};

/**
 * Processes all the input array and calls `getTranslation` onEach row
 * @param {Array} arr, array of objects term to be translated in the shape of `{key:"", value:""}`, eg. `{key:"fullName", value:"Full name"}
 * @param target
 * @returns {Promise} resolved array is in the same shape as input
 */
const processTranslation = (arr, target = 'en') => {
  let toDeletes = [];
  for (const term of arr) {
    if (getManualEntry(target, term.key) != null) {
      toDeletes.push(term);
    }
  }
  for (const toDelete of toDeletes) {
    const i = arr.indexOf(toDelete);
    arr.splice(i, 1);
  }

  return new Promise((resolve) => {
    /**
     *
     * @param {Array} arr input variables array. Terms to be translated
     * @param {Array} book output variable array. Translated terms.
     * @param {Number} currentIndex of processing queue
     */
    const convert = (arr, book = [], currentIndex = 0) =>
      currentIndex <= arr.length - 1
        ? getTranslation(arr[currentIndex], target).then((obj) => convert(arr, [...book, obj], currentIndex + 1))
        : resolve(book);
    convert(arr);
  });
};

/**
 * Converts object to array
 * @param {Object} obj
 * @returns {Array}
 * @example
 * // returns [{key:"fullName", value:"Full name"}]
 * convertToArray({fullName:"Full Name"})
 */
const convertToArray = (obj) => Object.keys(obj).map((key) => ({key, value: obj[key]}));

/**
 * Converts array to object
 * @returns {Object}
 * @example
 * // returns {fullName:"Full Name"}
 * convertToObject([{key:"fullName", value:"Full name"}])
 * @param arr
 */
const convertToObject = (arr) => arr.reduce((acc = {}, curr) => ({...acc, [curr.key]: curr.value}), {});

/** Runs the application */

getJSON('./src/assets/i18n/' + INPUT_LANG + '.json') // get data from input file
  .then((input_vars) => convertToArray(input_vars)) // convert data from object to array
  .then((input_arr) => processTranslation(input_arr, TARGET_LANG)) // process the whole array
  .then((transl_arr) => convertToObject(transl_arr)) // convert data from array to object
  .then((output_vars) => writeToFile(`./src/assets/i18n/${TARGET_LANG}_auto.json`, output_vars)) // saves translated object into file
  .then((filename) => console.log(`translation successfully saved in ${filename}`)) // outputs success
  .catch((err) => console.error('Error', err)); // shows error in case above fails
