import axios from 'axios';
import { apiUrl } from '~/config/config';

const API_BASE_URL = `${apiUrl}/api/jewel-types`;

export const createJewelType = async (jewelTypeData) => {
  const response = await axios.post(API_BASE_URL, jewelTypeData, {
    withCredentials: true
  });
  return response.data;
};