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

export function getInitialFileObject() {
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
function autoSave(currentFile) {
  saveFileToDBStore(currentFile, "current");
}
function saveFileToDBStore(fileObj, storeName) {
  const transaction = db.transaction(storeName, "readwrite");
  const objStore = transaction.objectStore(storeName);
  const request = objStore.put(fileObj);
  request.onsuccess = () =>
    console.log(`successfully added file object to ${storeName} store`);
  request.onerror = () => console.error(request.error);
  transaction.onerror = () => {
    console.error("transaction failed:", transaction.error);
  };
}
/**
 * autoSave function in its debounced version.
 * autoSave func runs every 5 minutes in debounce
 */
export const debouncedAutoSave = debounce(autoSave, 0);
