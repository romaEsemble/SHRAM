import {callApi} from '@redux/CommonDispatch.js';

export function fetchFeedData(
  type,
  url,
  payload,
  successCallback,
  failCallback,
) {
  return async (dispatch) => {
    dispatch(callApi(type, url, payload, successCallback, failCallback));
  };
}
