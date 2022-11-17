import {
  SAMACHAR_LOADING,
  SAMACHAR_SUCCESS,
  SAMACHAR_FAILURE,
  SAMACHAR_NEW,
} from '@redux/Types';

const initialState = {
  samacharError: null,
  samacharLoading: true,
  samacharData: null,
};

const FeedReducer = (state = initialState, action) => {
  switch (action.type) {
    case SAMACHAR_LOADING:
      return {
        ...state,
        samacharLoading: true,
      };

    case SAMACHAR_FAILURE:
      return {
        ...state,
        samacharLoading: false,
        samacharError: action.payload.data.message,
      };

    case SAMACHAR_SUCCESS:
      return {
        ...state,
        samacharError: null,
        samacharLoading: false,
        samacharData: state.samacharData
          ? [...state.samacharData, ...action.payload.data.data]
          : action.payload.data.data,
      };
    case SAMACHAR_NEW:
      return {
        ...state,
        samacharError: null,
        samacharLoading: false,
        samacharData: action.payload.data.data,
      };
    case 'updateSamacharBookmarkLike':
      const samacharLikeData = Array.from(state.samacharData);
      samacharLikeData?.map((item) => {
        if (action.payload.data.cont_id === item.cont_id) {
          if (action.payload.data.type === 1) {
            item.bookmark = action.payload.data.status;
          } else {
            item.like = action.payload.data.status;
          }
        }
      });
      return {
        ...state,
        samacharData: samacharLikeData,
      };
    default:
      return state;
  }
};

export default FeedReducer;
