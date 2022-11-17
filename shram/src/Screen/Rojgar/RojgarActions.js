import {callApi} from '@redux/CommonDispatch.js';

export function fetchFeedData(type, url, payload) {
  return async (dispatch) => {
    dispatch(callApi(type, url, payload));
  };
}

// export function applyJob(type, url, payload, callbackFunc) {
//   return async (dispatch) => {
//     dispatch(callApi(type, url, payload, callbackFunc));
//   };
// }

// export function jobBookmark(type, url, payload) {
//   return async (dispatch) => {
//     dispatch(callApi(type, url, payload));
//   };
// }
export function pltCommonData(type, url, payload) {
  return async (dispatch) => {
    dispatch(callApi(type, url, payload));
  };
}

export function updateBookmark(type, payload) {
  return async (dispatch) => {
    dispatch({type, payload});
  };
}

export function offerAccept(type, url, payload, callbackFunc) {
  return async (dispatch) => {
    dispatch(callApi(type, url, payload, callbackFunc));
  };
}

export function offerReject(type, url, payload, callbackFunc) {
  return async (dispatch) => {
    dispatch(callApi(type, url, payload, callbackFunc));
  };
}
