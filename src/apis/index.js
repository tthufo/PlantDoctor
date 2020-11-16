import axios from 'axios';
import auth from './auth';

const API = {
  auth,
};

axios.defaults.baseURL = "http://api-hst.weatherplus.vn";

export default API;
