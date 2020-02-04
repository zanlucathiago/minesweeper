const localStorageKey = 'com.thiagozanluca.minesweeper';
class LocalStorage {
  getPlayer() {
    return this.getFromLocalStorage().player;
  }

  getLevel() {
    return this.getFromLocalStorage().level || 'sm';
  }

  setPlayer(value) {
    this.setToLocalStorage('player', value);
  }

  setLevel(value) {
    this.setToLocalStorage('level', value);
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
