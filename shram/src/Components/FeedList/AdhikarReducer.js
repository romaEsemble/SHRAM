import {
  ADHIKAR_LOADING,
  ADHIKAR_SUCCESS,
  ADHIKAR_FAILURE,
  ADHIKAR_NEW,
} from '@redux/Types';

const initialState = {
  adhikarError: null,
  adhikarLoading: true,
  adhikarData: null,
};

const FeedReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADHIKAR_LOADING:
      return {
        ...state,
        adhikarLoading: true,
      };

    case ADHIKAR_FAILURE:
      return {
        ...state,
        adhikarLoading: false,
        adhikarError: action.payload.data.message,
      };

    case ADHIKAR_SUCCESS:
      return {
        ...state,
        adhikarError: null,
        adhikarLoading: false,
        adhikarData: state.adhikarData
          ? [...state.adhikarData, ...action.payload.data.data]
          : action.payload.data.data,
      };
    case ADHIKAR_NEW:
      return {
        ...state,
        adhikarError: null,
        adhikarLoading: false,
        adhikarData: action.payload.data.data,
      };
    case 'updateAdhikarBookmarkLike':
      const adhikarLikeData = Array.from(state.feedData);
      adhikarLikeData?.map((item) => {
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
        adhikarData: adhikarLikeData,
      };
    default:
      return state;
  }
};

export default FeedReducer;
