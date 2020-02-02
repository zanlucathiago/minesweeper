const localStorageKey = 'com.thiagozanluca.minesweeper';
class LocalStorage {
  getLevel() {
    return this.getFromLocalStorage().level || 'sm';
  }

  setLevel(value) {
    const data = this.getFromLocalStorage();
    data.level = value;
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
