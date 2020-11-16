import axios from 'axios';
import auth from './auth';
import home from './home';

const API = {
  auth,
  home,
};

axios.defaults.baseURL = "http://api-hst.weatherplus.vn";

export default API;
