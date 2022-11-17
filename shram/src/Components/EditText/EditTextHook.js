import {
  aadharValidation,
  DrivingValidation,
  emailValidation,
  empCodeOrMobileValidation,
  mobileValidation,
  panValidation,
  passportValidation,
  passwordValidation,
  usernameValidate,
} from '@resources/Validate';
import {useState} from 'react';
export const useInput = (
  initialValue,
  type,
  customValidation,
  customValidationStr,
) => {
  //TODO:merge both input
  const [value, setValue] = useState(initialValue);
  const [errmsg, setError] = useState();
  let inputValidator = () => {
    let err = '';
    // console.log('input typeeeeeee', type);
    switch (type) {
      case 'email':
        err = emailValidation(value);
        break;
      case 'password':
        err = passwordValidation(value);
        break;
      case 'name':
        err = usernameValidate(value);
        break;
      case 'number':
        err = mobileValidation(value);
        break;
      case 'username':
        err = empCodeOrMobileValidation(value);

        break;
      case 'Aadhar':
        err = aadharValidation(value);

        break;
      case 'PAN':
        err = panValidation(value);

        break;
      case 'Driving':
        err = DrivingValidation(value);

        break;
      case 'Passport':
        err = passportValidation(value);

        break;
      case 'other': {
        err = customValidation
          ? customValidation(value, customValidationStr)
          : '';
        break;
      }
    }

    setError(err);
    return err;
  };
  return {
    value,
    setValue,
    errmsg,
    setError,
    bind: {
      value,
      type,
      errmsg,
      onBlur: () => {
        inputValidator();
      },
      onChange: (event) => {
        // if (type == INPUT_TYPE_OTHER) {
        //   console.log('value', event, value);
        //   setValue(event.toUpperCase());
        // } else {
        //   console.log('value lese', event, value);
        //   setValue(event);
        // }
        setValue(event);
        setError('');
      },
    },
    checkValidation: () => inputValidator(),
  };
};
