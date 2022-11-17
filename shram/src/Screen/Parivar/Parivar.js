import React from 'react';
import FlatList from '@flatList/FlatList';
import {View} from 'react-native';
import {PARIVAR} from '@redux/Types';
import strings from '@resources/Strings';

export default function Parivar({navigation}) {
  return (
    <View style={{flex: 1}}>
      <FlatList
        action={PARIVAR}
        navigation={navigation}
        title={strings?.parivar}
        type={strings?.parivar}
      />
    </View>
  );
}
