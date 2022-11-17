import {
  OTP_LOADING,
  OTP_SUCCESS,
  OTP_FAILURE,
  LOGIN_FAILURE,
  LOGIN_LOADING,
  LOGIN_SUCCESS,
} from '@redux/Types';

const initialState = {
  otpError: null,
  otpLoading: false,
  loginError: null,
  loginLoading: false,
  loginErrorStatus: null,
};

const LoginReducer = (state = initialState, action) => {
  switch (action.type) {
    case OTP_LOADING:
      return {
        ...state,
        otpLoading: true,
      };

    case OTP_FAILURE:
      return {
        ...state,
        otpLoading: false,
        otpError: action.payload.data.message,
      };

    case OTP_SUCCESS:
      return {
        ...state,
        otpError: null,
        otpLoading: false,
      };
    case LOGIN_LOADING:
      return {
        ...state,
        loginLoading: true,
      };

    case LOGIN_FAILURE:
      return {
        ...state,
        loginError: action.payload?.data?.message,
        loginLoading: false,
        loginErrorStatus: action.payload?.data?.status,
      };

    case LOGIN_SUCCESS:
      return {
        ...state,
        loginError: null,
        loginLoading: false,
        loginErrorStatus: null,
      };
    default:
      return state;
  }
};

export default LoginReducer;
