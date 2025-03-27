export const localStorageWrapper = {
  get<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
      throw new Error(`Error while retrieving data from localStorage "${key}": ${error}`);
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      throw new Error(`Error while saving data to localStorage "${key}": ${error}`);
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      throw new Error(`Error while deleting data from localStorage "${key}": ${error}`);
    }
  },
};
