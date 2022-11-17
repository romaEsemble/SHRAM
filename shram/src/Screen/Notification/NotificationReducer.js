import {
  NOTIFICATION_LOADING,
  NOTIFICATION_SUCCESS,
  NOTIFICATION_FAILURE,
  RESET_VALUE,
  MARK_ALL_AS_READ_LOADING,
  MARK_ALL_AS_READ_SUCCESS,
  MARK_ALL_AS_READ_FAILURE,
} from '@redux/Types';
const initialState = {
  errorMessage: null,
  loading: false,
  todayNoti: [],
  earlierNoti: [],
  markAllAsReadError: null,
  markAllAsReadLoading: false,
};

const NotificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case NOTIFICATION_SUCCESS:
      // console.log('Have to check date', action?.payload?.data);
      return {
        ...state,
        loading: false,
        errorMessage: action.payload.errorMessage,
        todayNoti: action?.payload?.data?.todaynoti,
        earlierNoti: action?.payload?.data?.earliernoti,
      };
    case NOTIFICATION_FAILURE:
      return {
        ...state,
        loading: false,
        errorMessage: action.payload.errorMessage,
      };
    case NOTIFICATION_LOADING:
      return {
        ...state,
        loading: true,

        errorMessage: '',
      };
    case RESET_VALUE:
      return {
        ...state,
        errorMessage: '',
        loading: false,
        earlierNoti: [],
        todayNoti: [],
      };
    case MARK_ALL_AS_READ_SUCCESS:
      return {
        ...state,
        markAllAsReadLoading: false,
        markAllAsReadError: action.payload.errorMessage,
      };
    case MARK_ALL_AS_READ_FAILURE:
      return {
        ...state,
        markAllAsReadLoading: false,
        markAllAsReadError: action.payload.errorMessage,
      };
    case MARK_ALL_AS_READ_LOADING:
      return {
        ...state,
        markAllAsReadLoading: true,

        markAllAsReadError: '',
      };
    default:
      return state;
  }
};

export default NotificationReducer;
