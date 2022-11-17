import {
  RECOMMEND_JOB_LOADING,
  RECOMMEND_JOB_SUCCESS,
  RECOMMEND_JOB_FAILURE,
} from '@redux/Types';

const initialState = {
  recommendJobError: null,
  recommendJobLoading: false,
  recommendJobData: null,
};

const HomeReducer = (state = initialState, action) => {
  switch (action.type) {
    case RECOMMEND_JOB_LOADING:
      return {
        ...state,
        recommendJobLoading: true,
      };
    case RECOMMEND_JOB_FAILURE:
      return {
        ...state,
        recommendJobLoading: false,
        recommendJobError: action.payload.data.message,
      };
    case RECOMMEND_JOB_SUCCESS:
      return {
        ...state,
        recommendJobError: null,
        recommendJobLoading: false,
        recommendJobData: action.payload.data.data,
      };

    default:
      return state;
  }
};

export default HomeReducer;
