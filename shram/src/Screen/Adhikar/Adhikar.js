import React from 'react';
import FlatList from '@flatList/FlatList';
import {View, Text} from 'react-native';
import {ADHIKAR} from '@redux/Types';
import strings from '@resources/Strings';
// Adhikar is now Samajhdar
export default function Adhikar({navigation}) {
  return (
    <View style={{flex: 1}}>
      <FlatList
        action={ADHIKAR}
        navigation={navigation}
        // title="Adhikar"
        title={strings?.samajhdar}
        type={strings?.samajhdar}
      />
    </View>
  );
}
