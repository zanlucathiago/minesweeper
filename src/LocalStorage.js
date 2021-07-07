const localStorageKey = 'com.thiagozanluca.minesweeper';
class LocalStorage {
  getPlayer(key) {
    return this.getFromLocalStorage()[key];
  }

  getLevel() {
    return this.getFromLocalStorage().level || 'sm';
  }

  getFormats() {
    return this.getFromLocalStorage().formats || [];
  }

  setPlayer(value, name) {
    this.setToLocalStorage('player', value);
    this.setToLocalStorage('name', name);
  }

  setLevel(value) {
    this.setToLocalStorage('level', value);
  }

  setFormats(value) {
    this.setToLocalStorage('formats', value);
  }

  addRecord(obj) {
    const arr = this.getFromLocalStorage().records || [];
    this.setToLocalStorage('records', [...arr, { ...obj, date: new Date() }]);
  }

  getRecords() {
    return this.getFromLocalStorage().records || [];
  }

  clearRecords() {
    this.setToLocalStorage('records', []);
  }

  setToLocalStorage(key, value) {
    const data = this.getFromLocalStorage();
    data[key] = value;
    localStorage.setItem(localStorageKey, JSON.stringify(data));
  }

  getFromLocalStorage() {
    const data = localStorage.getItem(localStorageKey);

    if (data && data !== 'undefined') {
      return JSON.parse(data);
    }

    return {};
  }
}

export default new LocalStorage();
