import React, {useEffect} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {ASYNC_STORAGE_TOKEN} from '@resources/Constants';
import localStyles from '@loaderScreen/LoaderScreenStyle';
import strings from '@resources/Strings';
import {
  NAVIGATION_HOME,
  NAVIGATION_WALK_THROUGH_ONBOARDING,
} from '@navigation/NavigationKeys';
import {CommonActions} from '@react-navigation/native';
import {showSnackBar} from '@utils/Util';

function LoaderScreen({navigation}) {
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      let token = await AsyncStorage.getItem(ASYNC_STORAGE_TOKEN);

      token &&
        dispatch({
          type: 'SetToken',
          payload: {
            token,
          },
        });
    })();
  }, []);

  useEffect(() => {
    setRoute();
  }, []);

  const setRoute = async () => {
    const token = await AsyncStorage.getItem(ASYNC_STORAGE_TOKEN);
    console.warn('token', token);
    if (token) {
      navigation?.navigate(NAVIGATION_HOME);
    } else {
      navigation?.navigate(NAVIGATION_WALK_THROUGH_ONBOARDING);
    }
  };
  const {flex1} = localStyles;
  return (
    <View style={flex1}>
      <Text>{strings?.loadingDataPleaseWait}</Text>
      <ActivityIndicator
        size="large"
        color="#f7951d"
        style={{alignSelf: 'center'}}
      />
    </View>
  );
}
export default LoaderScreen;
