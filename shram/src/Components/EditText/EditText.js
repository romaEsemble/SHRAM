/* eslint-disable import/no-extraneous-dependencies */
import {
  INPUT_TYPE_EMAIL,
  INPUT_TYPE_NAME,
  INPUT_TYPE_NUMBER,
  INPUT_TYPE_OTHER,
  INPUT_TYPE_PASSWORD,
  INPUT_TYPE_USERNAME,
} from '@resources/Constants';
import {withTheme} from '@theme/ThemeHelper';
import React, {useEffect, useRef, useState} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {Input} from '@rneui/base';
import {sendBtnClickToAnalytics} from '@utils/Util';

function EditText(props) {
  const [typeObj, setTypeObj] = useState({});
  const [error, setError] = useState(props.errmsg);
  const [inputValue, setinputValue] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const myRef = useRef();
  useEffect(() => {
    inputType();
  }, []);

  const {
    type,
    customValidation,
    style,
    disabled,
    disabledInputStyle,
    inputContainerStyle,
    errmsg,
    errorStyle,
    errorProps,
    inputComponent,
    inputStyle,
    label,
    labelStyle,
    labelProps,
    leftIcon,
    leftIconContainerStyle,
    rightIcon,
    rightIconContainerStyle,
    text,
    editable,
    secureTextEntry,
    onChange,
    value,
    onFocus,
    onBlur,
    multiLine,
    placeholderTextColor,
    keyboardType,
    maxLength,
    onSubmitEditing,
    inputRef,
    blurOnSubmit,
    bold,
    autoCapitalize,
    showSoftInputOnFocus,
    setValue,
    authInput,
    onKeyPress,
    noBox,
  } = props;
  useEffect(() => {
    // console.log('called', value);
    myRef && myRef?.current?.setValue(props?.value);
  }, [value]);
  function inputType() {
    let obj = {};

    switch (type) {
      case INPUT_TYPE_EMAIL:
        obj.autoCapitalize = 'none';
        obj.keyboardType = 'email-address';
        obj.maxLength = 50;
        break;
      case INPUT_TYPE_USERNAME:
        obj.autoCapitalize = 'none';
        obj.maxLength = 10;
        break;
      case INPUT_TYPE_PASSWORD:
        obj.maxLength = 6;
        obj.keyboardType = 'numeric';
        setPasswordVisible(true);
        break;

      case INPUT_TYPE_NAME:
        obj.maxLength = 50;
        break;

      case INPUT_TYPE_NUMBER:
        obj.keyboardType = 'numeric';
        obj.returnKeyType = 'done';
        obj.maxLength = 10;
        break;

      case INPUT_TYPE_OTHER:
        break;
    }
    setTypeObj(obj);
  }

  const passwordIcon = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          setPasswordVisible(passwordVisible);
          sendBtnClickToAnalytics('Password Show Icon');
        }}>
        <Text>{passwordVisible ? 'Show' : 'Hide'}</Text>
      </TouchableOpacity>
    );
  };

  const conditionalStyle = !authInput
    ? {
        ...(inputContainerStyle || {}),
        ...(errmsg ? {borderWidth: 1.5, borderColor: 'red'} : {}),
      }
    : {
        height: 45,
        justifyContent: 'flex-end',
        alignSelf: 'center',
        marginVertical: 0,
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 10,
        shadowColor: '#00000029',
        shadowOffset: {width: 1, height: 5},
        elevation: 6,
        backgroundColor: '#fff',

        ...(inputContainerStyle || {}),

        ...(style || {}),
        ...(errmsg ? {borderBottomWidth: 1.5, borderBottomColor: 'red'} : {}),
      };

  return (
    <Input
      blurOnSubmit={blurOnSubmit}
      ref={inputRef}
      multiLine={multiLine}
      containerStyle={style}
      disabled={disabled}
      editable={editable}
      placeholder={text}
      keyboardType={keyboardType}
      placeholderTextColor={placeholderTextColor}
      secureTextEntry={secureTextEntry || passwordVisible}
      value={value || inputValue}
      onChangeText={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      errorProps={errorProps}
      disabledInputStyle={disabledInputStyle}
      showSoftInputOnFocus={showSoftInputOnFocus}
      inputContainerStyle={conditionalStyle}
      errorMessage={errmsg}
      errorStyle={errorStyle}
      inputComponent={inputComponent}
      inputStyle={{
        fontSize: 24,
        paddingVertical: 0,
        ...(inputStyle || {}),
        fontFamily: 'Montserrat-Bold',
      }}
      label={label}
      maxLength={maxLength}
      labelStyle={labelStyle}
      labelProps={labelProps}
      leftIcon={leftIcon}
      leftIconContainerStyle={leftIconContainerStyle}
      rightIcon={type === 'password' ? passwordIcon() : rightIcon}
      onSubmitEditing={onSubmitEditing}
      rightIconContainerStyle={rightIconContainerStyle}
      autoCapitalize={autoCapitalize}
      onKeyPress={onKeyPress}
      {...typeObj}
    />
  );
}
EditText.propTypes = {
  // type: PropTypes.string.isRequired
};

export default withTheme(EditText);
