import FlatList from '@flatList/FlatList';
import Header from '@header/Header';
import {URLs} from '@networking/Urls';
import {BOOKMARK} from '@redux/Types';
import {BOOKMARK_SCREEN} from '@resources/Constants';
import SubHeader from '@subHeader/SubHeader';
import React from 'react';
import {View} from 'react-native';

export default function Bookmarks({navigation}) {
  return (
    <View style={{flex: 1}}>
      <Header showDrawer />
      <SubHeader title={'Bookmark'} navigation={navigation} />
      <FlatList
        action={BOOKMARK}
        navigation={navigation}
        hideSearch
        hideHeader
        type={[
          BOOKMARK_SCREEN[0].NAME?.toLowerCase(),
          BOOKMARK_SCREEN[1].NAME?.toLowerCase(),
          BOOKMARK_SCREEN[2].NAME?.toLowerCase(),
          BOOKMARK_SCREEN[3].NAME?.toLowerCase(),
          BOOKMARK_SCREEN[4].NAME?.toLowerCase(),
        ]}
        url={URLs.bookmarkList}
      />
    </View>
  );
}
