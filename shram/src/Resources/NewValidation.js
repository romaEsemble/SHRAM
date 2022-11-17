import strings from '@resources/Strings';

export const emailOrMobileValidation = (emailid) => {
  let errorMsg = '';
  let checkIfNumber = /^[0-9]*$/;
  let emailtest = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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
