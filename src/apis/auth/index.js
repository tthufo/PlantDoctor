import axiosCallApi from '../axiosCallApi';

const userInfo = (params) => axiosCallApi('/authapp/fetch/user', 'post', params);
// const signUp = async params => axiosCallApi('/api/v1/signup', 'post', params);

export default {
  userInfo,
  // signUp,
};
