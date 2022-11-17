import {callApi} from '@redux/CommonDispatch.js';

export function applyBookmarkLike(type, url, payload) {
  return async (dispatch) => {
    dispatch(callApi(type, url, payload));
  };
}

export function updateBookmarkLike(type, payload) {
  console.warn('Changes came', type, payload);
  return async (dispatch) => {
    dispatch({type, payload});
  };
}
