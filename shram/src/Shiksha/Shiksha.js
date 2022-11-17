import React from 'react';
import FlatList from '@flatList/FlatList';
import {View} from 'react-native';
import {SHIKSHA} from '@redux/Types';
import strings from '@resources/Strings';

export default function Shiksha({navigation}) {
  return (
    <View style={{flex: 1}}>
      <FlatList
        action={SHIKSHA}
        navigation={navigation}
        title={strings?.shiksha}
        type={strings?.shiksha}
      />
    </View>
  );
}
