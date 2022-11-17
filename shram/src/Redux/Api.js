import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SERVERURL} from '@resources/Constants';

export const api = async (method, body) => {
  let token = await AsyncStorage.getItem('token');
  let config = {
    timeout: 5000,
    headers: {
      'access-token': token,
    },
  };
  try {
    const response = await axios.post(SERVERURL + method, body, config);
    if (response.status === 200) {
      if (response.data.status === 200) {
        return {apiSuccess: true, data: response.data};
      } else {
        return {apiSuccess: false, data: response.data};
      }
    } else {
      return {apiSuccess: false, data: response};
    }
  } catch (e) {
    return {apiSuccess: false, data: e.response.data};
  }
};
