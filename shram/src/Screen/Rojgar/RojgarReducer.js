import {
  ROJGAR_LOADING,
  ROJGAR_SUCCESS,
  ROJGAR_NEW,
  ROJGAR_FAILURE,
  PLT_COMMON_LOADING,
  PLT_COMMON_SUCCESS,
  PLT_COMMON_FAILURE,
  OFFER_ACCEPT_LOADING,
  OFFER_ACCEPT_SUCCESS,
  OFFER_ACCEPT_FAILURE,
  OFFER_REJECT_LOADING,
  OFFER_REJECT_SUCCESS,
  OFFER_REJECT_FAILURE,
  UPDATE_BOOKMARK_ROJGAR,
} from '@redux/Types';

const initialState = {
  rojgarError: null,
  rojgarLoading: true,
  rojgarData: null,
  searchValue: '',

  pltError: null,
  pltLoading: true,
  pltData: null,

  offerAcceptError: null,
  offerAcceptLoading: false,
  offerAcceptData: [],

  offerRejectError: null,
  offerRejectLoading: false,
  offerRejectData: [],

  updatedBookmarkValue: {},

  // isMuted: undefined,
};

const RojgarReducer = (state = initialState, action) => {
  // console.log('Rojgar reducer', state, action);
  switch (action.type) {
    case 'Applied':
      console.log('Rojgar data for applied', action?.payload);
      const job_id = action?.payload?.job_id;
      const newState = state.rojgarData.data.map((obj) =>
        obj.job_id === job_id ? {...obj, application_status: 1} : obj,
      );
      // console.log('New satte', newState);
      return {
        ...state,
        rojgarError: null,
        rojgarLoading: false,
        rojgarData: {
          ...state.rojgarData,
          data: [...state.rojgarData.data, ...newState],
        },
      };

    case 'Search':
      console.log('Seach bar ', action?.payload);
      const newValue = action?.payload?.value;
      const newSearchString = state.searchValue + newValue;
      const isClear = action?.payload?.clear;
      const finalValue = isClear ? '' : newValue;
      // console.log('New satte', newState);
      return {
        ...state,
        searchValue: finalValue,
      };

    case ROJGAR_LOADING:
      return {
        ...state,
        rojgarLoading: true,
      };

    case ROJGAR_FAILURE:
      return {
        ...state,
        rojgarLoading: false,
        rojgarError: action.payload.data.message,
      };

    case ROJGAR_SUCCESS:
      // console.log(
      //   'Suckess',
      //   // ...state.rojgarData.data,
      //   action.payload.data.data,
      // );
      // console.log('after succ', state.rojgarData);
      return {
        ...state,
        rojgarError: null,
        rojgarLoading: false,
        rojgarData: state.rojgarData
          ? {
              ...state.rojgarData,
              data: [
                ...state.rojgarData.data,
                ...action.payload.data.data.data,
              ],
            }
          : action.payload.data.data,
      };

    case PLT_COMMON_LOADING:
      console.log('PLT loading');

      return {
        ...state,
        pltLoading: true,
      };

    case PLT_COMMON_FAILURE:
      console.log('PLT failure');

      return {
        ...state,
        pltLoading: false,
        pltError: action.payload.data.message,
      };

    case PLT_COMMON_SUCCESS:
      // console.log('PLT success', action.payload.data.data);
      return {
        ...state,
        pltError: null,
        pltLoading: false,
        pltData: action.payload.data.data,
      };

    case ROJGAR_NEW:
      // console.log('Data ', action.payload.data.data);
      return {
        ...state,
        rojgarError: null,
        rojgarLoading: false,
        rojgarData: action.payload.data.data,
      };

    case OFFER_ACCEPT_LOADING:
      return {
        ...state,
        offerAcceptLoading: true,
      };

    case OFFER_ACCEPT_FAILURE:
      return {
        ...state,
        offerAcceptLoading: false,
        offerAcceptError: action.payload.data.message,
      };

    case OFFER_ACCEPT_SUCCESS:
      return {
        ...state,
        offerAcceptError: null,
        offerAcceptLoading: false,
        offerAcceptData: action.payload.data.data,
      };

    case OFFER_REJECT_LOADING:
      return {
        ...state,
        offerRejectLoading: true,
      };

    case OFFER_REJECT_FAILURE:
      return {
        ...state,
        offerRejectLoading: false,
        offerRejectError: action.payload.data.message,
      };

    case OFFER_REJECT_SUCCESS:
      return {
        ...state,
        offerRejectError: null,
        offerRejectLoading: false,
        offerRejectData: action.payload.data.data,
      };
    case UPDATE_BOOKMARK_ROJGAR:
      const tempRojgarData = {...state.rojgarData};
      // console.log(
      //   'rojgar data',
      //   action.payload.data.job_id,
      //   action.payload.data.bookmark,
      // );
      tempRojgarData?.data?.map((item) => {
        if (action.payload.data.job_id === item.job_id) {
          item.bookmark = action.payload.data.bookmark;
        }
      });
      return {
        ...state,
        rojgarData: tempRojgarData,
      };
    default:
      return state;
  }
};

export default RojgarReducer;
