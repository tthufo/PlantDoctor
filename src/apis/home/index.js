import axiosCallApi from '../axiosCallApi';

const getWeather = (params) => axiosCallApi('/appcontent/weather/data-weather', 'post', params);
const addCrop = (params) => axiosCallApi('/appcontent/cropsUser/add-crops-user', 'post', params);

export default {
  getWeather,
  addCrop
};
