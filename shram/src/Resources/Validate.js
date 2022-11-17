import strings from '@resources/Strings';

export const emailOrMobileValidation = (emailid) => {
  let errorMsg = '';
  let checkIfNumber = /^[0-9]*$/;
  let emailtest =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!checkIfNumber.test(emailid)) {
    if (emailtest.test(String(emailid).toLowerCase())) {
      return errorMsg;
    } else {
      return strings?.invalidEmail;
    }
  } else {
    if (emailid?.length == 10) {
      return errorMsg;
    } else {
      return 'Please enter valid mobile number';
    }
  }
};

export const passwordValidation = (password) => {
  var testpasswd = /^[a-zA-Z0-9]*$/;
  if (password?.length > 5 && password?.length < 21) {
    if (testpasswd.test(password)) {
      return '';
    } else {
      return strings?.invalidPassword;
    }
  } else {
    return strings?.passwordLengthError;
  }
};

export const numberValidation = (number) => {
  let numtest = /^[0-9]*$/;
  console.log('Number is', number);
  if (numtest.test(number)) {
    return '';
  } else {
    return 'Number invalid';
  }
};

export const mobileValidation = (number) => {
  let numtest = /^[0-9]*$/;
  if (numtest.test(number) && number.length == 10) {
    return '';
  } else {
    return 'Please enter valid mobile number';
  }
};

export const fullNameValidate = (name, customStr) => {
  console.log('name is ', name);
  // var testname = /^[a-zA-Z ]*$/;
  // var test = /^[0-9]|S*$ /;
  var test = /^[a-zA-Z ]{2,30}$/;
  // console.log('Test', test?.test(name), name.trim().length);
  if (name?.trim().length < 3 && name !== '') {
    // return 'Name should be 3 digit long';
    return `Invalid ${customStr}`;
  } else if (!test?.test(name)) return strings?.invalidCharacters;
  else {
    return '';
  }
};

export const nameValidate = (name, customStr) => {
  console.log('name is ', name);
  // var testname = /^[a-zA-Z ]*$/;
  // var test = /^[0-9]|S*$ /;
  var test = /^[a-zA-Z ]{2,30}$/;
  console.log('Test', test?.test(name));
  if (name?.length < 3 && name !== '') {
    // return 'Name should be 3 digit long';
    return `Invalid ${customStr}`;
  } else if (name?.includes(' ')) return strings?.invalidSpace;
  else if (!test?.test(name)) return strings?.invalidCharacters;
  else {
    return '';
  }
};

export const addressWithSpaceValidate = (name, customStr) => {
  // console.log('VALUE', name);
  var test = /[^a-zA-Z]/g;
  if (name?.length < 3) {
    return `${customStr}`;
  }
  // else if (name?.includes(' ')) return 'Space not allowed';
  else if (test?.test(name)) return strings?.invalidCharacters;
  else {
    return '';
  }
};

export const emailValidation = (emailid) => {
  let emailtest =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (emailtest.test(String(emailid).toLowerCase()) && emailtest !== '') {
    return '';
  } else {
    return strings?.invalidEmail;
  }
};

export const otpValidation = (otp) => {
  let otptest = /^[0-9]*$/;
  if (otptest.test(otp)) {
    if (otp?.length === 4) {
      return '';
    } else {
      return 'OTP must be 4 character long.';
    }
  } else {
    return 'Invalid otp.';
  }
};

export const confirmPassoword = (passowrd, confirmPassowrd) => {
  if (passowrd == confirmPassowrd) {
    return '';
  } else {
    return 'Password do not match.Please type again';
  }
};

export const searchText = (text) => {
  if (text?.length >= 3) {
    return '';
  } else {
    return 'please enter at least three characters';
  }
};

export const empCodeOrMobileValidation = (code) => {
  let errorMsg = '';
  let checkIfNumber = /^[0-9]*$/;
  var test = /^[a-zA-Z0-9]*$/;

  if (checkIfNumber.test(code) && code?.length == 10) {
    return errorMsg;
  } else {
    if (code?.length == 6) {
      if (test.test(code)) {
        return errorMsg;
      } else {
        return strings?.invalidEmployeeCode;
      }
    } else {
      if (code?.length < 6) {
        return strings?.employeeCodeLength;
      } else {
        return strings?.mobileNumberLengthError;
      }
    }
  }
};
export let postTextValidation = (value, customStr) => {
  //only checking length of the values greater than 3 character.
  if (value?.length >= 3) {
    return '';
  } else {
    return `${customStr}`;
  }
};
export let nonEmpty = (value, customStr) => {
  var test = /^[0-9]|S*$ /;
  var testS = /\s/;
  if (!value) return 'Invalid ';
  else {
    if (value) {
      if (value.length == 0) return strings?.mandatoryField;
      else if (
        value.includes('.') ||
        value.includes(',') ||
        value.includes('-') ||
        value.includes('/') ||
        value.includes('  ')
      )
        return strings?.invalid;
      else if (test.test(value)) return strings?.invalidCharacters;
      // else if (!testS.test(value)) return 'Space are not allow.';
    } else if (customStr) return `${customStr}`;
    else {
      return null;
    }
  }
};
export let referralCodeValidations = (value, customStr) => {
  // var test = /^[0-9]|S*$ /;
  if (!value) return 'Invalid ';
  else {
    if (value) {
      if (value.length == 0) return strings?.mandatoryField;
      else if (
        value.includes('.') ||
        value.includes(',') ||
        value.includes('-') ||
        value.includes('_') ||
        value.includes('/') ||
        value.includes('  ')
      )
        return strings?.invalid;
      // else if (test.test(value)) return strings?.invalidCharacters;
      // else if (!testS.test(value)) return 'Space are not allow.';
    } else if (customStr) return `${customStr}`;
    else {
      return null;
    }
  }
};

export let NumberValidation = (value, customStr, updateInputType) => {
  if (!value) return `Invalid ${customStr}`;
  else {
    return null;
  }
};
export let documentNumberValidation = (value, customStr, updateInputType) => {
  var test = /^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/;
  if (!value) return `Invalid ${customStr}`;
  else if (!test.test(value)) {
    return 'Invalid Document Number';
  } else {
    return null;
  }
};

export const healthValidation = (value) => {
  var test = /^[0-9]*$/;
  if (value !== '') {
    if (value?.length === 0) {
      return strings?.invalidInput;
    } else {
      if (test.test(value)) {
      } else {
        return strings?.invalidInput;
      }
    }
  }
};

export const bankNumberValidation = (value) => {
  var test = /^[0-9]*$/;
  if (value?.length === 0) {
    return strings?.mandatoryField;
  } else {
    if (test.test(value)) {
    } else {
      return strings?.invalidAccountNumber;
    }
  }
};

export const ifscValidation = (value) => {
  var test = /([A-Za-z0]{4})(0\d{6})$/;
  if (value?.length === 0) {
    return strings?.mandatoryField;
  } else {
    if (test.test(value)) {
    } else {
      return strings?.invalidIFSCCode;
    }
  }
};
export const gstValidatiABCon = (password) => {
  var testpasswd = /^[a-zA-Z0-9]*$/;
  if (password?.length == 15) {
    if (testpasswd.test(password)) {
      return ' ';
    } else {
      return strings?.invalidGSTINNumber;
    }
  } else {
    return strings?.gstinNumberError;
  }
};

export const panValidation = (password) => {
  var testpasswd = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;

  if (testpasswd.test(password)) {
    return '';
  } else {
    return strings?.invalidPan;
  }
};

export const aadharValidation = (password) => {
  var testpasswd = /^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/;

  if (testpasswd.test(password)) {
    return '';
  } else {
    return strings?.invalidAadharNumber;
  }
};

export const passportValidation = (password) => {
  var testpasswd = /^[A-PR-WYa-pr-wy][1-9]\\d\\s?\\d{4}[1-9]$/;

  if (testpasswd.test(password)) {
    return '';
  } else {
    return strings?.invalidPassportNumber;
  }
};

export const DrivingValidation = (password) => {
  var testpasswd =
    /^(([A-Z]{2}[0-9]{2})( )|([A-Z]{2}-[0-9]{2}))((19|20)[0-9][0-9])[0-9]{7}$/;

  if (testpasswd.test(password)) {
    return '';
  } else {
    return strings?.invalidLicenseNumber;
  }
};
