/* eslint-disable camelcase */
import {GetBaseURL} from '@networking/Urls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from 'axios';
import strings from '@resources/Strings';
import {getBaseOs} from 'react-native-device-info';
let axiosInstance;
const connectionTimeout = 20000; // 20 Secs

async function getAxiosInstance(token) {
  let accessToken = token;
  if (!accessToken) {
    accessToken = await AsyncStorage.getItem('token');
    // accessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJVc2VyXzEiLCJyb2xlSWQiOiIxIiwicm9sZU5hbWUiOiJ1c2VyIiwidXNlck1vYiI6Ijk2MTkwMjY2MTEiLCJ1c2VyTmFtZSI6bnVsbCwiaWF0IjoxNjA5NTgwOTYwLCJpc3MiOiJsb2NhaG9zdCJ9.OVq422RhDMPWPsXM7yfrrWRNC6qf4DfkVaRSOrPqUfk`;
  }
  // if (!axiosInstance) {TODO: as instance was created during login without token so after that the header is not updated after login success
  // console.log('Vase url', GetBaseURL());
  axiosInstance = Axios.create({
    baseURL: GetBaseURL(),
    timeout: connectionTimeout,

    headers: {
      // withCredentials: true,
      'access-token': accessToken,

      // "access-token":
      // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMTQiLCJyb2xlSWQiOiIzIiwicm9sZU5hbWUiOiJTZWxsZXIiLCJ1c2VyTW9iIjoiODY4OTkwMzY4OCIsInVzZXJOYW1lIjoiemViYSIsImFyZWFJZCI6MCwiaWF0IjoxNjAxNzE1NjQ1LCJpc3MiOiJsb2NhaG9zdCJ9.2vOX9zRdx0VOePWipm48QYmxLPCAR-GyFKmOxFG7iQE"
      // "Content-Type": "multipart/form-data"
    },
  });
  // }
  return axiosInstance;
}

export const apiCall = async (request, payload, token) => {
  let {URL} = request;
  const axiosInstance = await getAxiosInstance(token);
  // console.log('Url and pay', URL, payload);
  try {
    // console.log('Url: ', URL, ' Body: ', JSON.stringify(payload));
    const response = await axiosInstance.post(URL, payload);
    // console.log('Response', response);
    if (response.status === 200) {
      if (response.data.status === 200) {
        // console.log('Url: ', URL, ' Response: ', JSON.stringify(response));
        if (URL === 'joblist') return {apiSuccess: true, data: response};
        return {apiSuccess: true, data: response.data};
      } else {
        return {apiSuccess: false, data: response.data};
      }
    } else {
      return {apiSuccess: false, data: response};
    }
  } catch (error) {
    console.warn('Error', error);
    // console.log(JSON.stringify(error));
    if (error.code === 'ECONNABORTED') {
      return {
        data: {message: strings?.somethingWentWrongTry},
        apiSuccess: false,
      };
    } else {
      return {
        data: error?.response?.data || error,
        apiSuccess: false,
      };
    }
  }
};
