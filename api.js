import axios from 'axios';

const API_URL = "http://192.168.180.251:8000";

export const getRecommendation = async (mood, city) => {
  const response = await axios.post(`${API_URL}/recommendation`, { mood, city });
  return response.data;
};

export const pingServer = async () => {
  const response = await axios.get(`${API_URL}/ping`);
  return response.data;
};
