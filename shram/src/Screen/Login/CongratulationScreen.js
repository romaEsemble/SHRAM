import React, {useEffect} from 'react';
import {View} from 'react-native';
import Text from '@textView/TextView';
import {TEXT_TYPE} from '@resources/Constants';
import BlueBg from '@icons/congratulations.svg';
import {NAVIGATION_SELECT_PROFILE} from '@navigation/NavigationKeys';

export default function CongratulationScreen({navigation}) {
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate(NAVIGATION_SELECT_PROFILE);
    }, 3000);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#CCD9F0',
      }}>
      <BlueBg style={{position: 'absolute'}} />
      <BlueBg style={{position: 'absolute', bottom: -220}} />
      <Text bold style={{color: '#2751A7'}} type={TEXT_TYPE.LARGE}>
        CONGRATULATION !
      </Text>
      <Text
        bold
        style={{color: '#2751A7', marginTop: 5}}
        type={TEXT_TYPE.SMALL}>
        You are now part of our
      </Text>
      <Text
        bold
        style={{color: '#2751A7', marginTop: 5}}
        type={TEXT_TYPE.SMALL}>
        KHOJ FAMILY
      </Text>
    </View>
  );
}
