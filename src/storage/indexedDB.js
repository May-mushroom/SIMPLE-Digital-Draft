import { nanoid } from "nanoid";

let db;

export function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("digital-draft", 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      const STORES = ["current", "files"];
      STORES.forEach((store) => {
        if (!db.objectStoreNames.contains(store)) {
          db.createObjectStore(store, { keyPath: "fileId" });
        }
      });
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onerror = () => reject(request.error);
  });
}
export function resetFileObjToDefault(fileId) {
  return {
    fileId: fileId,
    fileTitle: new Date().toJSON().slice(0, 10),
    pinned: false,
    HTMLContent: "",
  };
}
export function createNewFileObj() {
  return {
    fileId: nanoid(),
    fileTitle: new Date().toJSON().slice(0, 10),
    pinned: false,
    HTMLContent: "",
  };
}
/**
 *
 * @param {String} key
 * @param {"current"|"files"} storeName
 * @returns
 */
export function getFile(key, storeName) {
  return new Promise((resolve, reject) => {
    const store = db.transaction(storeName, "readonly").objectStore(storeName);
    const request = store.get(key);
    request.onsuccess = () => {
      resolve(request.result);
      console.log(`SUCCESS: got the file obj from "${storeName}"`);
    };
    request.onerror = (err) => {
      reject(`ERROR: ${err}`);
    };
  });
}
export function getCurrentFileObj() {
  return new Promise((resolve, reject) => {
    const store = db.transaction("current", "readonly").objectStore("current");

    const request = store.getAll();

    request.onsuccess = () => {
      resolve(
        request.result[0] ?? {
          fileId: nanoid(),
          fileTitle: new Date().toJSON().slice(0, 10),
          HTMLContent: "",
        },
      );
    };

    request.onerror = () => reject(request.error);
  });
}
/**
 *
 * @param {'current'|'files'} storeName
 * @returns {Promise<*>}
 */
export function getAllFiles(storeName) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readonly");
    const objStore = transaction.objectStore(storeName);
    const request = objStore.getAll();
    request.onsuccess = () => {
      resolve(request.result);
      console.log("SUCCESS: got all the records in obj store");
    };
    request.onerror = (err) => {
      reject(err);
      console.log(`ERROR: ${err}`);
    };
  });
}
/**
 *
 * @param {'current'|'files'} storeName
 * CLEAR all record in the object store
 */
export function clearObjStore(storeName) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const objStore = transaction.objectStore(storeName);
    const clearRequest = objStore.clear();
    clearRequest.onsuccess = () => {
      console.log(`SUCCESS: successfully clear the ${storeName} store `);
      resolve();
    };
    clearRequest.onerror = (err) => {
      console.log(`ERROR: ${err}`);
      reject(err);
    };
  });
}
/**
 *
 * @param {string} key
 * @param {'current'|'files'} storeName
 * @returns
 */
export function deleteObj(key, storeName) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const objStore = transaction.objectStore(storeName);
    const deleteRequest = objStore.delete(key);
    deleteRequest.onsuccess = () => {
      console.log("SUCCESS: successfully delete the obj ");
      resolve();
    };
    deleteRequest.onerror = (err) => {
      console.log(`ERROR: ${err}`);
      reject(err);
    };
  });
}
export function updateObj(storeName, fileObj) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const objStore = transaction.objectStore(storeName);
    const updateRequest = objStore.put(fileObj);

    updateRequest.onsuccess = () => {
      console.log("SUCCESS");
      resolve();
    };
    updateRequest.onerror = (event) => {
      console.error("PUT ERROR:", event.target.error);
      reject(event.target.error);
    };

    transaction.onerror = (event) => {
      console.error("TRANSACTION ERROR:", event.target.error);
    };
  });
}

// AUTO SAVE FUNCTION
/**
 *
 * @param {Function} func
 * @param {Int} delay
 * debouncing function
 */
function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}
async function autoSave(currentFile) {
  console.log(currentFile);
  await saveFileToDBStore(currentFile, "current");
}
/**
 *
 * @param {Object} fileObj
 * @param {'current'|'files'} storeName
 */
export function saveFileToDBStore(fileObj, storeName) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const objStore = transaction.objectStore(storeName);
    const request = objStore.put(fileObj);
    console.log(fileObj);
    request.onsuccess = () => {
      console.log(`successfully added file object to ${storeName} store`);
      const getRequest = objStore.get(fileObj.fileId);

      getRequest.onsuccess = () => {
        console.log("Stored object:", getRequest.result);
      };
      resolve();
    };
    request.onerror = (err) => {
      console.error(request.error);
      reject(err);
    };
    transaction.onerror = (err) => {
      console.error("transaction failed:", transaction.error);
      reject(err);
    };
  });
}
/**
 * autoSave function in its debounced version.
 * autoSave func runs every 5 minutes in debounce
 */
export const debouncedAutoSave = debounce(autoSave, 0);
