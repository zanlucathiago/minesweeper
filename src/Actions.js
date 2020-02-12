import axios from 'axios';
import { local_baseURL } from './config.json';
import LocalStorage from './LocalStorage';

const config = {
  baseURL: `${local_baseURL}api/`,
  // baseURL: `${remote_baseURL}api/`,
  headers: {
    'Content-Type': 'application/json',
  },
};

class Actions {
  sendMail = async (data) => axios.post('/mail/send', data, config);

  getPlayer = async (player) =>
    axios.get(`/player?${new URLSearchParams(player).toString()}`, config);

  getRecords = async (filter) =>
    axios.get(
      `/record?${[
        ...filter.map((item) => `${item}=true`),
        `_id=${LocalStorage.getPlayer()}`,
        `level=${LocalStorage.getLevel()}`,
      ].join('&')}`,
      config,
    );

  addRecord = async (data) => axios.post('/record', data, config);

  addPlayer = async (player) => axios.post('/player', player, config);
}

export default new Actions();
