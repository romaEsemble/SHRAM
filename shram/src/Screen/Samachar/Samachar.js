import FlatList from '@flatList/FlatList';
import Header from '@header/Header';
import {SAMACHAR} from '@redux/Types';
import SubHeader from '@subHeader/SubHeader';
import React from 'react';
import {View} from 'react-native';
import strings from '@resources/Strings';

export default function Samachar({navigation}) {
  return (
    <View style={{flex: 1}}>
      <Header showDrawer />
      <SubHeader title={'Samachar'} navigation={navigation} />
      <FlatList
        action={SAMACHAR}
        hideHeader
        navigation={navigation}
        type={strings?.samachar}
        title={strings?.samachar}
      />
    </View>
  );
}
