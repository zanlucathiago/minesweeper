import axios from 'axios';
import { remoteBaseURL } from './config.json';
import LocalStorage from './LocalStorage';

const config = {
  baseURL: `${remoteBaseURL}api/`,
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
        `_id=${LocalStorage.getPlayer('player')}`,
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
