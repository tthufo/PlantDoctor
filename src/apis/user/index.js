import axiosCallApi from '../axiosCallApi';

const getQuestion = (params) => axiosCallApi('/appcontent/question-answer/list-question', 'post', params);

export default {
  getQuestion,
};
