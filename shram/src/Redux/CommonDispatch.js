import {apiCall as api} from '@networking/withAPI';
import {showSnackBar} from '@utils/Util';
import {
  FEED,
  ROJGAR,
  ADHIKAR,
  SHIKSHA,
  PARIVAR,
  SAMACHAR,
  BOOKMARK,
} from '@redux/Types';

export const callApi = (
  action,
  method,
  body,
  isSuccess,
  isFail,
  token,
) => async (dispatch) => {
  dispatch({type: `${action}_Loading`});
  console.log('API Name', method, action, token);
  console.log('API Body', JSON.stringify(body));
  const {apiSuccess, data} = await api(method, body, token);
  // console.log('API DATA', JSON.stringify(data, null, 4));
  console.log('API Success', apiSuccess);

  if (apiSuccess) {
    if (
      (action === FEED ||
        action === ROJGAR ||
        action === ADHIKAR ||
        action === SHIKSHA ||
        action === PARIVAR ||
        action === SAMACHAR ||
        action === BOOKMARK) &&
      body.pageno === 0
    ) {
      dispatch({type: `${action}_New`, payload: {data}});
    } else {
      await dispatch({
        type: `${action}_Success`,
        payload: {data},
      });
    }

    if (isSuccess) isSuccess(data);
  } else {
    await dispatch({
      type: `${action}_Failure`,
      payload: {data},
    });
    showSnackBar(data.message, 'error');

    if (isFail) isFail(data);
  }
};
