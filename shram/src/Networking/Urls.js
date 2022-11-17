export const ENV_STAGING = 'STAGING';
export const ENV_PRODUCTION = 'ENV_STAGING';

export const CURRENT_API_ENVIRONMENT = ENV_PRODUCTION;

export function GetBaseURL() {
  switch (CURRENT_API_ENVIRONMENT) {
    case ENV_STAGING:
      return 'http://3.6.108.152:3020/';
    case ENV_PRODUCTION:
      return 'https://api.khojtalent.com/';
  }
}

export function GetPhotoBaseURL() {
  switch (CURRENT_API_ENVIRONMENT) {
    case ENV_STAGING:
      return 'https://s3.ap-south-1.amazonaws.com/khoj.dev/';
    // return 'https://s3.ap-south-1.amazonaws.com/pics.test.mm/';
    case ENV_PRODUCTION:
      return 'https://s3.ap-south-1.amazonaws.com/khoj.prod/';
  }
}

export function GetAdminBaseURL() {
  switch (CURRENT_API_ENVIRONMENT) {
    case ENV_STAGING:
      return 'http://3.7.239.154/shramphp';
    // return 'https://s3.ap-south-1.amazonaws.com/pics.test.mm/';
    case ENV_PRODUCTION:
      return 'http://www.khojtalent.com/admin/home';
  }
}

// export function GetBaseURL() {
//   return 'http://3.6.108.152:3020/';
// }

export const URLs = {
  LOGIN_USER: {
    URL: 'loginshramik',
  },
  SIGN_UP: {
    URL: 'signup1',
  },
  FORGOT_PWD: {
    URL: 'forgotpwdshramik',
  },
  NEW_PERSONAL_DETAIL: {
    URL: 'profileDetail',
  },
  PERSONAL_DETAIL: {
    URL: 'signup2',
  },
  ADDRESS_DETAIL: {
    URL: 'signup7',
  },
  HEALTH_DETAIL: {
    URL: 'signup3',
  },
  EDUCATION_DETAIL: {
    URL: 'signup6',
  },
  PROFESSIONAL_DETAIL: {
    URL: 'signup4',
  },
  GET_USER_DATA: {
    URL: 'getuserdata',
  },
  APPLY_JOB: {
    URL: 'jobapply',
  },
  SKILL_DETAIL: {
    URL: 'signup5',
  },
  PLT_COMMON_DATA: {
    URL: 'pltCommonData',
  },
  UPLOAD_PROFILE_IMG: {
    URL: 'uploadpic',
  },
  NOTIFICATION: {
    URL: 'notification',
  },
  RECOMMEND_JOB: {
    URL: 'jobRecommend',
  },
  FEED: {
    URL: 'feed',
  },
  Bookmark: {
    URL: 'contentBookmark',
  },
  JobBookmark: {
    URL: 'jobbookmark',
  },
  bookmarkList: {
    URL: 'bookmarkList',
  },
  ASSESSMENT_LIST: {
    URL: 'getQuestions',
  },
  POST_ASSESSMENT_ANS: {
    URL: 'postAnswer',
  },
  DOCUMENT_UPLOAD: {
    URL: 'uploadDoc',
  },
  CREATE_POST: {
    URL: 'contentAdd',
  },
  UPLOAD_VIDEO: {
    URL: 'uploadResume',
  },
  JOB_LIST: {
    URL: 'joblist',
  },
  MY_POST: {
    URL: 'contentList',
  },
  COMPANY_LIST: {
    URL: 'compList',
  },
  COMPANY_ADD: {
    URL: 'compadd',
  },
  CHANGE_JOB_STATUS: {
    URL: 'changejobstatus',
  },
  GET_DOCS: {
    URL: 'getDocs',
  },
  GET_CONTACT: {
    URL: 'syncContact',
  },
  SEND_FRIEND_REQ: {
    URL: 'sendFriendRequest',
  },
  GET_FRIEND_DATA: {
    URL: 'getuserdata',
  },
  GET_CHAT_HEAD: {
    URL: 'chatList',
  },
  GET_CHAT_HISTORY: {
    URL: 'getChatHistory',
  },
  MSG_READED: {
    URL: 'msgReaded',
  },
  DECRYPTED_DATA: {
    URL: 'qrnlink',
  },
  CHANGE_REQUEST_STATUS: {
    URL: 'changeFrndStatus',
  },
  DELETE_CHAT_HEAD: {
    URL: 'chatHeadDelete',
  },
  CHANGE_APP_LANGUAGE: {
    URL: 'setLang',
  },
  VALIDATE_REFFERAL_CODE: {
    URL: 'validate_referr_code',
  },
  FORCE_UPDATE: {
    URL: 'appVersionInfo',
  },
  SET_USERINFO: {
    URL: 'set_userinfo',
  },
};
