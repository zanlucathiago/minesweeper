import axios from 'axios';
import { local_baseURL } from './config.json';

const config = {
  baseURL: `${local_baseURL}api/`,
  headers: {
    'Content-Type': 'application/json',
  },
};

class Actions {
  getRecords = async (filter) =>
    await axios.get(
      `/record?${new URLSearchParams(filter).toString()}`,
      config,
    );

  addRecord = async (data) => {
    return await axios.post(
      '/record',
      {
        player: '5e37741736560942e6169ca6',
        performance: 123.456,
        level: '5e3764bcd0239c2c672d1834',
      },
      config,
    );
  };
}

export default new Actions();
