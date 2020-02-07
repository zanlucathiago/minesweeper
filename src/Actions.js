import axios from 'axios';
import { local_baseURL, remote_baseURL } from './config.json';
import LocalStorage from './LocalStorage.js';

const config = {
  baseURL: `${remote_baseURL}api/`,
  headers: {
    'Content-Type': 'application/json',
  },
};

class Actions {
  getPlayer = async (player) =>
    await axios.get(
      `/player/${player.name}${player.pin ? `?pin=${player.pin}` : ''}`,
      config,
    );
  // addPlayer = async (player) => await axios.post(`/player/${player}`, config);

  getRecords = async (filter) =>
    await axios.get(
      // `/record?${new URLSearchParams(filter).toString()}`,
      `/record?${[
        ...filter.map((item) => `${item}=true`),
        `_id=${LocalStorage.getPlayer()}`,
        `level=${LocalStorage.getLevel()}`,
      ].join('&')}`,
      config,
    );

  addRecord = async (data) => await axios.post('/record', data, config);

  addPlayer = async (player) => await axios.post('/player', player, config);
}

export default new Actions();
