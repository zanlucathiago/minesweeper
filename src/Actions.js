import axios from 'axios';
import { localBaseURL, remoteBaseURL } from './config.json';
import LocalStorage from './LocalStorage';

const config = {
  baseURL: `${
    process.env.NODE_ENV === 'development' ? localBaseURL : remoteBaseURL
  }api/`,
  headers: {
    'Content-Type': 'application/json',
  },
};

class Actions {
  downloadImage = async (id) =>
    fetch(`${config.baseURL}player/download/${id}`, {
      method: 'GET',
      headers: config.headers,
    }).then((res) => res.blob());

  sendMail = async (data) => axios.post('/mail/send', data, config);

  getPlayer = async (player) =>
    axios.get(`/player?${new URLSearchParams(player).toString()}`, config);

  getRecords = async () =>
    axios.get(
      `/record?${[
        `_id=${LocalStorage.getPlayer()}`,
        `level=${LocalStorage.getLevel()}`,
      ].join('&')}`,
      config,
    );

  addRecord = async (data) => axios.post('/record', data, config);

  addPlayer = async (player) => axios.post('/player', player, config);

  updatePlayer = async (player, id) =>
    axios.post(`/player/upload/${id}`, player, config);
}

export default new Actions();
