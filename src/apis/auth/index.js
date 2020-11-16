import axiosCallApi from '../axiosCallApi';

const userInfo = (params) => axiosCallApi('/authapp/fetch/user', 'post', params);
// const signUp = async params => axiosCallApi('/api/v1/signup', 'post', params);
// const resendVerifyEmail = params => axiosCallApi('api/v1/send-verification', 'post', params);
// const verifyEmail = params => axiosCallApi('api/v1/forgot-password', 'post', params);

export default {
  userInfo,
  // signUp,
  // resendVerifyEmail,
  // verifyEmail,
};
