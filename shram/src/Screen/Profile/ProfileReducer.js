import {
  PROFILE_LOADING,
  PROFILE_SUCCESS,
  PROFILE_FAILURE,
  INDUSTRY_LOADING,
  INDUSTRY_SUCCESS,
  INDUSTRY_FAILURE,
  TRADE_LOADING,
  TRADE_SUCCESS,
  TRADE_FAILURE,
  EDUCATION_LOADING,
  EDUCATION_SUCCESS,
  EDUCATION_FAILURE,
  SKILL_LOADING,
  SKILL_SUCCESS,
  SKILL_FAILURE,
  PROFILE_IMAGE_LOADING,
  PROFILE_IMAGE_SUCCESS,
  PROFILE_IMAGE_FAILURE,
  DOCUMENT_UPLOAD_LOADING,
  DOCUMENT_UPLOAD_SUCCESS,
  DOCUMENT_UPLOAD_FAILURE,
  GET_UPLOADED_DOCS_LOADING,
  GET_UPLOADED_DOCS_SUCCESS,
  GET_UPLOADED_DOCS_FAILURE,
} from '@redux/Types';

const initialState = {
  profileError: null,
  profileLoading: false,
  profileData: null,

  industryError: null,
  industryLoading: false,
  industryData: [],

  tradeError: null,
  tradeLoading: false,
  tradeData: [],

  educationError: null,
  educationLoading: false,
  educationData: [],

  skillError: null,
  skillLoading: false,
  skillData: [],

  documentUploadError: null,
  documentUploadLoading: false,

  getDocumentsError: null,
  getDocumentsLoading: false,
  getDocumentsData: [],
};

const ProfileReducer = (state = initialState, action) => {
  switch (action.type) {
    case PROFILE_LOADING:
      return {
        ...state,
        profileLoading: true,
      };
    case PROFILE_FAILURE:
      return {
        ...state,
        profileLoading: false,
        profileError: action.payload.data.message,
      };
    case PROFILE_SUCCESS:
      return {
        ...state,
        profileError: null,
        profileLoading: false,
        profileData: action.payload.data.data,
      };
    case INDUSTRY_LOADING:
      return {
        ...state,
        industryLoading: true,
      };
    case INDUSTRY_FAILURE:
      return {
        ...state,
        industryLoading: false,
        industryError: action.payload.data.message,
      };
    case INDUSTRY_SUCCESS:
      return {
        ...state,
        industryError: null,
        industryLoading: false,
        industryData: action.payload.data.data,
      };
    case TRADE_LOADING:
      return {
        ...state,
        tradeLoading: true,
      };
    case TRADE_FAILURE:
      return {
        ...state,
        tradeLoading: false,
        tradeError: action.payload.data.message,
      };
    case TRADE_SUCCESS:
      return {
        ...state,
        tradeError: null,
        tradeLoading: false,
        tradeData: action.payload.data.data,
      };
    case EDUCATION_LOADING:
      return {
        ...state,
        educationLoading: true,
      };
    case EDUCATION_FAILURE:
      return {
        ...state,
        educationLoading: false,
        educationError: action.payload.data.message,
      };
    case EDUCATION_SUCCESS:
      return {
        ...state,
        educationError: null,
        educationLoading: false,
        educationData: action.payload.data.data,
      };
    case SKILL_LOADING:
      return {
        ...state,
        skillLoading: true,
      };
    case SKILL_FAILURE:
      return {
        ...state,
        skillLoading: false,
        skillError: action.payload.data.message,
      };
    case SKILL_SUCCESS:
      return {
        ...state,
        skillError: null,
        skillLoading: false,
        skillData: action.payload.data.data,
      };
    case PROFILE_IMAGE_LOADING:
      return {
        ...state,
        profileLoading: true,
      };
    case PROFILE_IMAGE_FAILURE:
      return {
        ...state,
        profileLoading: false,
        profileError: action.payload.data.message,
      };
    case PROFILE_IMAGE_SUCCESS:
      return {
        ...state,
        profileError: null,
        profileLoading: false,
      };

    case DOCUMENT_UPLOAD_LOADING:
      return {
        ...state,
        documentUploadLoading: true,
      };
    case DOCUMENT_UPLOAD_FAILURE:
      return {
        ...state,
        documentUploadLoading: false,
        documentUploadError: action.payload.data.message,
      };
    case DOCUMENT_UPLOAD_SUCCESS:
      return {
        ...state,
        documentUploadError: null,
        documentUploadLoading: false,
      };

    case GET_UPLOADED_DOCS_LOADING:
      return {
        ...state,
        getDocumentsLoading: true,
      };
    case GET_UPLOADED_DOCS_FAILURE:
      return {
        ...state,
        getDocumentsLoading: false,
        getDocumentsError: action.payload.data.message,
      };
    case GET_UPLOADED_DOCS_SUCCESS:
      return {
        ...state,
        getDocumentsError: null,
        getDocumentsLoading: false,
        getDocumentsData: action.payload.data.data,
      };

    default:
      return state;
  }
};

export default ProfileReducer;
