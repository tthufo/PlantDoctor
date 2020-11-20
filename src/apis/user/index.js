import axiosCallApi from '../axiosCallApi';

const getQuestion = (params) => axiosCallApi('/appcontent/question-answer/list-question', 'post', params);
const getAnswer = (params) => axiosCallApi('/appcontent/question-answer/list-answer', 'post', params);

export default {
  getQuestion,
  getAnswer,
};
