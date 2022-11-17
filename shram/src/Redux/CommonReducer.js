import {SHARE_BASE_URL_SUCCESS} from '@redux/Types';

const initialState = {
  userToken: '',
  intialLoading: true,
  shareBaseUrl: '',
};

const CommonReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SetToken':
      return {
        ...state,
        userToken: action?.payload?.token,
        intialLoading: false,
      };
    case SHARE_BASE_URL_SUCCESS:
      console.log('Data for utl', action?.payload?.data);
      return {
        ...state,
        shareBaseUrl: action?.payload?.data?.data[0].plt_val,
      };
    default:
      return state;
  }
};

export default CommonReducer;
