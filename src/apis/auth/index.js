import axiosCallApi from '../axiosCallApi';

const userInfo = (params) => axiosCallApi('/authapp/fetch/user', 'post', params);
const resend = (params) => axiosCallApi('/usermanagerment/register/regain-OTP', 'post', params);
const confirm = (params) => axiosCallApi('/usermanagerment/register/confirm-account', 'post', params);
const signUp = async params => axiosCallApi('/usermanagerment/register/user', 'post', params);

export default {
  userInfo,
  signUp,
  confirm,
  resend,
};
