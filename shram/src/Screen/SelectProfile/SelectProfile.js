import BG from '@icons/mandaleydesign.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Text from '@textView/TextView';
import {withTheme} from '@theme/ThemeHelper';
import TouchableOpacity from '@touchable/TouchableOpacity';
import React from 'react';
import {StatusBar, View, SafeAreaView} from 'react-native';
import {useDispatch} from 'react-redux';
import {ASYNC_STORAGE_TOKEN} from '@resources/Constants';
import {NAVIGATION_WEB_LOGIN} from '@navigation/NavigationKeys';
import {ScrollView} from 'react-native';
import {sendBtnClickToAnalytics} from '@utils/Util';

function SelectProfile({navigation}) {
  const dispatch = useDispatch();
  return (
    <SafeAreaView style={{flex: 1, marginTop: StatusBar.currentHeight}}>
      <StatusBar backgroundColor="#436DC2" />
      <View
        style={{
          position: 'absolute',
          height: '100%',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <BG
          style={{
            position: 'absolute',
            alignSelf: 'center',
          }}
        />
      </View>

      <ScrollView style={{flexGrow: 1}}>
        <View
          style={{justifyContent: 'center', alignItems: 'center', padding: 10}}>
          <Text
            style={{
              fontSize: 18,
              color: '#2751A7',
              marginTop: 10,
              fontWeight: 'bold',
            }}>
            {'SELECT PROFILE'}
          </Text>
          <View style={{marginTop: 5}}>
            <TouchableOpacity
              onPress={async () => {
                let token = await AsyncStorage.getItem(ASYNC_STORAGE_TOKEN);
                console.warn(token);
                dispatch({
                  type: 'SetToken',
                  payload: {
                    token,
                  },
                });
                sendBtnClickToAnalytics('Khoj Star Clicked');
              }}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#4B79D8',
                padding: 10,
                borderRadius: 20,
                marginBottom: 20,
              }}>
              <View
                style={{
                  marginBottom: 5,
                  width: '100%',
                  borderWidth: 1,
                  borderColor: '#4B79D8',
                  borderRadius: 10,
                  shadowColor: '#00000029',
                  shadowOffset: {width: 1, height: 5},
                  elevation: 6,
                  backgroundColor: '#4B79D8',
                }}>
                <Text
                  style={{
                    color: '#FFFFFF',
                    textAlign: 'center',
                    margin: 5,
                    fontSize: 18,
                  }}>
                  {'Khoj Star'}
                </Text>
              </View>
              <Text style={{color: '#FFFFFF', textAlign: 'center', padding: 8}}>
                {
                  'You are a skilled or unskilled worker contributing to businesses or projects across different Industries'
                }
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                navigation.navigate(NAVIGATION_WEB_LOGIN);
                sendBtnClickToAnalytics('Khoj Talent Clicked');
              }}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#4EAF47',
                padding: 10,
                borderRadius: 20,
                marginBottom: 20,
              }}>
              <View
                style={{
                  marginBottom: 10,
                  width: '100%',
                  borderWidth: 1,
                  borderColor: '#4EAF47',
                  borderRadius: 10,
                  shadowColor: '#00000029',
                  shadowOffset: {width: 1, height: 5},
                  elevation: 6,
                  backgroundColor: '#4EAF47',
                }}>
                <Text
                  style={{
                    color: '#FFFFFF',
                    textAlign: 'center',
                    margin: 5,
                    fontSize: 18,
                  }}>
                  {'Khoj Talent'}
                </Text>
              </View>
              <Text style={{color: '#FFFFFF', textAlign: 'center', padding: 8}}>
                {
                  'You are a professional supporting Skilled or unskilled workers in finding suitable jobs'
                }
              </Text>
            </TouchableOpacity>

            {/* <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => navigation.navigate(NAVIGATION_WEB_LOGIN)}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#EBB000',
                padding: 10,
                borderRadius: 20,
                marginBottom: 20,
              }}>
              <View
                style={{
                  marginBottom: 10,
                  width: '100%',
                  borderWidth: 1,
                  borderColor: '#EBB000',
                  borderRadius: 10,
                  shadowColor: '#00000029',
                  shadowOffset: {width: 1, height: 5},
                  elevation: 6,
                  backgroundColor: '#EBB000',
                }}>
                <Text
                  style={{
                    color: '#FFFFFF',
                    textAlign: 'center',
                    margin: 5,
                    fontSize: 18,
                  }}>
                  {'Employer'}
                </Text>
              </View>
              <Text style={{color: '#FFFFFF', textAlign: 'center', padding: 8}}>
                {
                  'You are an organisation engaging the services of Skilled or unskilled workers To manage your business or project tasks'
                }
              </Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
export default withTheme(SelectProfile);
