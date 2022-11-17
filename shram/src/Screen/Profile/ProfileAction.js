// import { apiCall as api } from "@networking/withAPI";
import axios from 'axios';
export const callPinApi = (action, pin, isSuccess, isFail) => async (
  dispatch,
) => {
  console.warn('Came');
  dispatch({type: action + '_Loading'});

  await axios
    .get(`https://api.postalpincode.in/pincode/${pin}`)
    .then(async (response) => {
      if (response.status === 200) {
        console.warn('Response came');
        await dispatch({
          type: action + '_Success',
          payload: {data: response?.data[0]?.PostOffice},
        });
        isSuccess && isSuccess(response?.data[0]?.PostOffice);
      } else {
        await dispatch({
          type: action + '_Failure',
          payload: {response},
        });
        alert(response.message);
        isFail && isFail(response);
      }
    })
    .catch((err) => {
      // logger(LOGGER_TYPE.ERROR, err);
      dispatch({
        type: action + '_Failure',
        payload: {data: err.message},
      });
      alert(err?.message);
      //TODO: ADD nsackbar
      isFail && isFail(err.message);
    });
};
