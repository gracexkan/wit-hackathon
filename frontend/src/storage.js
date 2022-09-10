import defaults from './constants/defaults';

const STORAGE_KEY = 'data';

const storage = {
  get: (key) => {
    const data = storage.load();

    if (key in data) {
      return data[key];
    }
    if (key in defaults) {
      storage.set(key, defaults[key]);
      return defaults[key];
    }

    return null;
  },

  set: (key, value) => {
    const data = storage.load();
    data[key] = value;
    storage.save(data);
  },

  load: () => {
    let data = {};

    if (localStorage[STORAGE_KEY]) {
      data = JSON.parse(localStorage[STORAGE_KEY]);
    } else {
      storage.save(data);
    }

    return data;
  },

  save: (data) => {
    localStorage[STORAGE_KEY] = JSON.stringify(data);
  },
};

storage.load();

export default storage;