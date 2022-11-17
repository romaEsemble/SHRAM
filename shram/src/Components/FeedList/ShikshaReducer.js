import {
  SHIKSHA_LOADING,
  SHIKSHA_SUCCESS,
  SHIKSHA_FAILURE,
  SHIKSHA_NEW,
} from '@redux/Types';

const initialState = {
  shikshaError: null,
  shikshaLoading: true,
  shikshaData: null,
};

const FeedReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHIKSHA_LOADING:
      return {
        ...state,
        shikshaLoading: true,
      };

    case SHIKSHA_FAILURE:
      return {
        ...state,
        shikshaLoading: false,
        shikshaError: action.payload.data.message,
      };

    case SHIKSHA_SUCCESS:
      return {
        ...state,
        shikshaError: null,
        shikshaLoading: false,
        shikshaData: state.shikshaData
          ? [...state.shikshaData, ...action.payload.data.data]
          : action.payload.data.data,
      };
    case SHIKSHA_NEW:
      return {
        ...state,
        shikshaError: null,
        shikshaLoading: false,
        shikshaData: action.payload.data.data,
      };
    case 'updateShikshaBookmarkLike':
      const shikshaLikeData = Array.from(state.shikshaData);
      shikshaLikeData?.map((item) => {
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
        shikshaData: shikshaLikeData,
      };
    default:
      return state;
  }
};

export default FeedReducer;
