import {
  INDUSTRY_ASSESSMENT_LOADING,
  INDUSTRY_ASSESSMENT_SUCCESS,
  INDUSTRY_ASSESSMENT_FAILURE,
  TRADE_ASSESSMENT_LOADING,
  TRADE_ASSESSMENT_SUCCESS,
  TRADE_ASSESSMENT_FAILURE,
} from '@redux/Types';

const initialState = {
  industryAssessmentError: null,
  industryAssessmentLoading: false,
  industryAssessmentData: [],

  tradeAssessmentError: null,
  tradeAssessmentLoading: false,
  tradeAssessmentData: [],
};

const AssessmentReducer = (state = initialState, action) => {
  switch (action.type) {
    case INDUSTRY_ASSESSMENT_LOADING:
      return {
        ...state,
        industryAssessmentLoading: true,
      };
    case INDUSTRY_ASSESSMENT_FAILURE:
      return {
        ...state,
        industryAssessmentLoading: false,
        industryAssessmentError: action.payload.data.message,
      };
    case INDUSTRY_ASSESSMENT_SUCCESS:
      return {
        ...state,
        industryAssessmentError: null,
        industryAssessmentLoading: false,
        industryAssessmentData: action.payload.data.data,
      };

    case TRADE_ASSESSMENT_LOADING:
      return {
        ...state,
        tradeAssessmentLoading: true,
      };
    case TRADE_ASSESSMENT_FAILURE:
      return {
        ...state,
        tradeAssessmentLoading: false,
        tradeAssessmentError: action.payload.data.message,
      };
    case TRADE_ASSESSMENT_SUCCESS:
      return {
        ...state,
        tradeAssessmentError: null,
        tradeAssessmentLoading: false,
        tradeAssessmentData: action.payload.data.data,
      };

    default:
      return state;
  }
};

export default AssessmentReducer;
