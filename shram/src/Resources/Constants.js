export const DEFAULT_LOADER_TEXT = 'Loading';
export const LOADER_ACTIVITY_INDICATOR_SIZE = 40;
import OnBoardingA from '@icons/OnBoardingA.svg';
import OnBoardingB from '@icons/OnBoardingB.svg';
import OnBoardingC from '@icons/OnBoardingC.svg';
import OnBoardingD from '@icons/OnBoardingD.svg';
import React from 'react';
// import strings from '@resources/Strings';

export const REALM_INSERT = 'insert';
export const REALM_UPDATE = 'update';
export const REALM_GET = 'get';
export const REALM_DELETE = 'REALM_DELETE';
export const LOCATION_PERMISSION = 'location';
export const CONFIRM_PIN_ERROR = 'Pin Does Not match.';
export const FCM_TOKEN_ERROR_MSG = 'Token Error';

export const INPUT_TYPE_USERNAME = 'username';
export const INPUT_TYPE_EMAIL = 'email';
export const INPUT_TYPE_PASSWORD = 'password';
export const INPUT_TYPE_NAME = 'name';
export const INPUT_TYPE_NUMBER = 'number';
export const INPUT_TYPE_OTHER = 'other';

export const ASYNC_STORAGE_FCM_TOKEN = 'fcmToken';
export const ASYNC_STORAGE_USER_ID = 'user_id';
export const ASYNC_STORAGE_APP_LANGUAGE = 'app_language';
export const ASYNC_STORAGE_USER_NAME = 'userName';
export const ASYNC_STORAGE_STARS = 'stars';
export const ASYNC_STORAGE_IMAGE = 'image';
export const ASYNC_STORAGE_MOBILE = 'mobile';
export const ASYNC_STORAGE_ROLE_ID = 'role_id';
export const ASYNC_STORAGE_EMAIL = 'email';
export const ASYNC_STORAGE_ROLE_NAME = 'role_name';
export const ASYNC_STORAGE_ROLE_ACCESS = 'role_access';
export const ASYNC_STORAGE_TOKEN = 'token';
export const ASYNC_STORAGE_COMPANY_NAME = 'company_name';

export const PLATFORM_IOS = 'ios';
export const PLATFORM_ANDROID = 'android';
export const WINDOW = 'window';

export const KEYBOARD_TYPE_POSITION = 'position';
export const KEYBOARD_TYPE_NUMERIC = 'numeric';

export const MAP_URL = 'google.navigation:q=+';
export const TYPE_PAST = 'Past';
export const TYPE_NEW = 'New';
export const TYPE_ONGOING = 'Ongoing';
export const COMM_NAME_SELLER_TYPE = 'seller_type';
export const COMM_NAME_BANK_LIST = 'bank_data';
export const COMM_NAME_PAYMENT_TYPE = 'payment_method';

export const PROFILE_SELLER = 'seller';
export const SIGNUP_TYPE = 'onboarding';
export const TYPE_PENDING = 'New';
export const TYPE_IN_TRANSIT = 'Ongoing';

export const LOGGER_TYPE = {
  SET: 'set',
  LOG: 'log',
  ERROR: 'error',
};

export const TEXT_TYPE = {
  TINY: 'tiny',
  EXTRA_SMALL: 'EXTRA_SMALL',
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
  EXTRA_LARGE: 'EXTRA_LARGE',
  HEADER: 'header',
};

export const FONT_MONTSERRAT = 'Montserrat';

export const TEXT_WEIGHT = {
  BOLD: 'bold',
  REGULAR: 'regular',
  MEDIUM: 'medium',
};

export const ERROR_VIEW_TYPE = {
  ERROR: 'error',
  NODATA: 'nodata',
};

export const ONBOARDING_DATA = [
  {
    TITLE: 'Samajhdar',
    TEXT: 'Be informed of Government policies & benefits',
    // 'Know your Rights & Labour Laws \nBe informed of Government policies & benefits',
    IMAGE: <OnBoardingA style={{flex: 1}} />,
    BUTTON: 'SKIP',
    BgColor: '#FFC003',
  },
  {
    TITLE: 'Shiksha',
    TEXT: 'Develop your technical skills\nDevelop your personality',
    IMAGE: <OnBoardingB style={{flex: 1}} />,
    BUTTON: 'SKIP',
    BgColor: '#97D692',
  },
  {
    TITLE: 'Rozgar',
    TEXT: 'Create an impactful resume\nFind suitable Jobs\nRefer Jobs to friends & family',
    IMAGE: <OnBoardingC style={{flex: 1}} />,
    BUTTON: 'SKIP',
    BgColor: '#6190F1',
  },
  {
    TITLE: 'Parivaar',
    TEXT: 'Search, follow & chat with friends & family\nHear from prominent personalities & Influencers\nBe Inspired by stories\nFollow the local news',
    IMAGE: <OnBoardingD style={{flex: 1}} />,
    BUTTON: 'GET STARTED',
    BgColor: '#FF7171',
  },
];

{
  /*  This Code is Commented after adding NewPersonalDetails Screen. Don't Remove commented code written after this line */
}
export const PROFILE_SCREEN = [
  {
    SCREEN: 1,
  },
  {
    SCREEN: 2,
  },
  {
    SCREEN: 3,
  },
  // {
  //   SCREEN: 4,
  // },
  // {
  //   SCREEN: 5,
  // },
  // {
  //   SCREEN: 6,
  // },
  // {
  //   SCREEN: 7,
  // },
];
export const RESUME_SCREEN = [
  {
    SCREEN: 1,
    NAME: 'Video',
  },
  {
    SCREEN: 2,
    NAME: 'Photo',
  },
  {
    SCREEN: 3,
    NAME: 'Work Profile',
  },
  {
    SCREEN: 4,
    NAME: 'Verify',
  },
];
export const SAMACHAR_SCREEN = [
  {
    SCREEN: 0,
    NAME: 'All',
  },
  {
    SCREEN: 1,
    NAME: 'Politics',
  },
  {
    SCREEN: 2,
    NAME: 'Entertainment',
  },
  {
    SCREEN: 3,
    NAME: 'Sports',
  },
  {
    SCREEN: 4,
    NAME: 'Health',
  },
];
export const BOOKMARK_SCREEN = [
  {
    SCREEN: 0,
    NAME: 'All',
  },
  {
    SCREEN: 1,
    NAME: 'Samajhdar',
    // NAME: 'Adhikar',
  },
  {
    SCREEN: 2,
    NAME: 'Shiksha',
  },
  {
    SCREEN: 4,
    NAME: 'Parivar',
  },
  {
    SCREEN: 5,
    NAME: 'Samachar',
  },
];
export const MY_POST_STATUS = [
  {
    SCREEN: 2,
    // NAME: strings?.pendingApproval,
    NAME: 'Pending Approval',
    TYPE: 2,
  },
  {
    SCREEN: 1,
    // NAME: strings?.published,
    NAME: 'Published',
    TYPE: 1,
  },
  {
    SCREEN: 3,
    // NAME: strings?.rejected,
    NAME: 'Rejected',
    TYPE: 3,
  },
];
