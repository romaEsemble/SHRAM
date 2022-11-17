import {
  VIDEO_UPLOAD_LOADING,
  VIDEO_UPLOAD_SUCCESS,
  VIDEO_UPLOAD_FAILURE,
  PHOTO_UPLOAD_LOADING,
  PHOTO_UPLOAD_SUCCESS,
  PHOTO_UPLOAD_FAILURE,
  COMPANY_LIST_LOADING,
  COMPANY_LIST_SUCCESS,
  COMPANY_LIST_FAILURE,
  COMPANY_ADD_LOADING,
  COMPANY_ADD_SUCCESS,
  COMPANY_ADD_FAILURE,
  ASSESSMENT_LIST_LOADING,
  ASSESSMENT_LIST_SUCCESS,
  ASSESSMENT_LIST_FAILURE,
  TRADE_ASSESSMENT_LOADING,
  TRADE_ASSESSMENT_SUCCESS,
  TRADE_ASSESSMENT_FAILURE,
  SKILL_ASSESSMENT_LOADING,
  SKILL_ASSESSMENT_SUCCESS,
  SKILL_ASSESSMENT_FAILURE,
  COMPUTER_ASSESSMENT_LOADING,
  COMPUTER_ASSESSMENT_SUCCESS,
  COMPUTER_ASSESSMENT_FAILURE,
} from '@redux/Types';

const initialState = {
  videoUploadError: null,
  videoUploadLoading: false,

  photoUploadError: null,
  photoUploadLoading: false,

  companyListError: null,
  companyListLoading: false,
  companyListData: [],

  companyAddError: null,
  companyAddLoading: false,
  companyAddData: [],

  assessmentListError: null,
  assessmentListLoading: true,
  assessmentListData: [],

  tradeListError: null,
  tradeListLoading: true,
  tradeListData: [],

  skillListError: null,
  skillListLoading: true,
  skillListData: [],

  computerListError: null,
  computerListLoading: true,
  computerListData: [],

  industryAssessmentTaken: false,
  tradeAssessmentTaken: false,
  skillAssessmentTaken: false,
  computerAssessmentTaken: false,
};

const ResumeReducer = (state = initialState, action) => {
  switch (action.type) {
    case VIDEO_UPLOAD_LOADING:
      return {
        ...state,
        videoUploadLoading: true,
      };

    case VIDEO_UPLOAD_FAILURE:
      return {
        ...state,
        videoUploadLoading: false,
        videoUploadError: action.payload.data.message,
      };

    case VIDEO_UPLOAD_SUCCESS:
      return {
        ...state,
        videoUploadError: null,
        videoUploadLoading: false,
      };

    case PHOTO_UPLOAD_LOADING:
      return {
        ...state,
        photoUploadLoading: true,
      };

    case PHOTO_UPLOAD_FAILURE:
      return {
        ...state,
        photoUploadLoading: false,
        photoUploadError: action.payload.data.message,
      };

    case PHOTO_UPLOAD_SUCCESS:
      return {
        ...state,
        photoUploadError: null,
        photoUploadLoading: false,
      };

    case COMPANY_LIST_LOADING:
      return {
        ...state,
        companyListLoading: true,
      };

    case COMPANY_LIST_FAILURE:
      return {
        ...state,
        companyListLoading: false,
        companyListError: action.payload.data.message,
      };

    case COMPANY_LIST_SUCCESS:
      return {
        ...state,
        companyListError: null,
        companyListLoading: false,
        companyListData: action.payload.data.data,
      };

    case COMPANY_ADD_LOADING:
      return {
        ...state,
        companyAddLoading: true,
      };

    case COMPANY_ADD_FAILURE:
      return {
        ...state,
        companyAddLoading: false,
        companyAddError: action.payload.data.message,
      };

    case COMPANY_ADD_SUCCESS:
      return {
        ...state,
        companyAddError: null,
        companyAddLoading: false,
        companyAddData: action.payload.data.data,
      };

    case ASSESSMENT_LIST_LOADING:
      return {
        ...state,
        assessmentListLoading: true,
      };

    case ASSESSMENT_LIST_FAILURE:
      return {
        ...state,
        assessmentListLoading: false,
        assessmentListError: action.payload.data.message,
      };

    case ASSESSMENT_LIST_SUCCESS:
      let data = null;
      let indAssessmentTaken = false;
      if (action?.payload?.data?.data?.length > 0) {
        data = Array.from(action?.payload?.data?.data);
        if (data?.length > 0) {
          data.map((item) => {
            if (item?.your_ans !== null) {
              indAssessmentTaken = true;
              item.localAnswer = item?.your_ans?.split(', ');
            } else {
              item.localAnswer = [0, 0, 0, 0];
            }
          });
        }
      }
      return {
        ...state,
        assessmentListError: null,
        assessmentListLoading: false,
        assessmentListData: data,
        industryAssessmentTaken: indAssessmentTaken,
      };

    case 'Assessment_Change':
      const new_assessmentListData = Array.from(state.assessmentListData);
      new_assessmentListData?.map((item) => {
        if (item.assessment_id === action?.payload?.index) {
          item.localAnswer = action?.payload?.data;
        }
      });
      return {
        ...state,
        assessmentListData: new_assessmentListData,
      };

    case TRADE_ASSESSMENT_LOADING:
      return {
        ...state,
        tradeListLoading: true,
      };

    case TRADE_ASSESSMENT_FAILURE:
      return {
        ...state,
        tradeListLoading: false,
        tradeListError: action.payload.data.message,
      };

    case TRADE_ASSESSMENT_SUCCESS:
      let trade_data = null;
      let tradeTaken = false;
      if (action?.payload?.data?.data?.length > 0) {
        trade_data = Array.from(action?.payload?.data?.data);

        try {
          trade_data.map((item) => {
            if (item?.your_ans !== null) {
              tradeTaken = true;
              item.localAnswer = item?.your_ans
                ? item?.your_ans?.split(', ')
                : [0, 0, 0, 0];
            } else {
              item.localAnswer = [0, 0, 0, 0];
            }
          });
        } catch (error) {
          console.warn(error);
        }
      }
      return {
        ...state,
        tradeListError: null,
        tradeListLoading: false,
        tradeListData: trade_data,
        tradeAssessmentTaken: tradeTaken,
      };

    case 'Trade_Change':
      const new_trade_data = Array.from(state.tradeListData);
      new_trade_data?.map((item) => {
        if (item.assessment_id === action?.payload?.index) {
          item.localAnswer = action?.payload?.data;
        }
      });
      return {
        ...state,
        tradeListData: new_trade_data,
      };

    case SKILL_ASSESSMENT_LOADING:
      return {
        ...state,
        skillListLoading: true,
      };

    case SKILL_ASSESSMENT_FAILURE:
      return {
        ...state,
        skillListLoading: false,
        skillListError: action.payload.data.message,
      };

    case SKILL_ASSESSMENT_SUCCESS:
      let skillsData = null;
      let skillsTaken = false;
      if (action?.payload?.data?.data?.length > 0) {
        skillsData = Array.from(action?.payload?.data?.data);
        if (skillsData?.length > 0) {
          skillsData.map((item) => {
            if (item?.your_ans !== null) {
              skillsTaken = true;
              item.localAnswer = item?.your_ans
                ? item?.your_ans?.split(', ')
                : [0, 0, 0, 0];
            } else {
              item.localAnswer = [0, 0, 0, 0];
            }
          });
        }
      }
      return {
        ...state,
        skillListError: null,
        skillListLoading: false,
        skillListData: skillsData,
        skillAssessmentTaken: skillsTaken,
      };

    case 'Skill_Change':
      const new_skillsData = Array.from(state.skillListData);
      new_skillsData?.map((item) => {
        if (item.assessment_id === action?.payload?.index) {
          item.localAnswer = action?.payload?.data;
        }
      });
      return {
        ...state,
        skillListData: new_skillsData,
      };

    case COMPUTER_ASSESSMENT_LOADING:
      return {
        ...state,
        computerListLoading: true,
      };
    case COMPUTER_ASSESSMENT_FAILURE:
      return {
        ...state,
        computerListLoading: false,
        computerListError: action.payload.data.message,
      };
    case COMPUTER_ASSESSMENT_SUCCESS:
      let computerData = null;
      let computerTaken = false;
      if (action?.payload?.data?.data?.length > 0) {
        computerData = Array.from(action?.payload?.data?.data);
        if (computerData?.length > 0) {
          computerData.map((item) => {
            if (item?.your_ans !== null) {
              computerTaken = true;
              item.localAnswer = item?.your_ans
                ? item?.your_ans?.split(', ')
                : [0, 0, 0, 0];
            } else {
              item.localAnswer = [0, 0, 0, 0];
            }
          });
        }
      }
      return {
        ...state,
        computerListError: null,
        computerListLoading: false,
        computerListData: computerData,
        computerAssessmentTaken: computerTaken,
      };

    case 'Computer_Change':
      const new_computerListData = Array.from(state.computerListData);
      new_computerListData?.map((item) => {
        if (item.assessment_id === action?.payload?.index) {
          item.localAnswer = action?.payload?.data;
        }
      });
      return {
        ...state,
        computerListData: new_computerListData,
      };

    default:
      return state;
  }
};

export default ResumeReducer;
