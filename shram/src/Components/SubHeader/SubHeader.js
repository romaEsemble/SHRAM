import IconBookmark from '@icons/IconBookmark';
import IconChatBubbles from '@icons/IconChatBubbles';
import IconPaper from '@icons/IconPaper';
import IconPersonAdd from '@icons/IconPersonAdd';
import Text from '@textView/TextView';
import TouchableOpacity from '@touchable/TouchableOpacity';
import React from 'react';
import {View} from 'react-native';
import {
  NAVIGATION_BOOKMARK,
  NAVIGATION_SAMACHAR,
} from '@navigation/NavigationKeys';
import {sendBtnClickToAnalytics} from '@utils/Util';

export default function SubHeader({title, navigation}) {
  return (
    <View style={{height: 60, backgroundColor: '#5C8CF1'}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            padding: 10,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation?.navigate(NAVIGATION_BOOKMARK);
              sendBtnClickToAnalytics('Bookmark Icon SubHeader');
            }}>
            <IconBookmark style={{marginRight: 10}} width={25} height={25} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation?.navigate(NAVIGATION_SAMACHAR);
              sendBtnClickToAnalytics('Samachar Icon SubHeader');
            }}>
            <IconPaper style={{marginHorizontal: 10}} width={25} height={25} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            padding: 10,
            margin: 10,
            alignItems: 'center',
          }}>
          <Text style={{color: '#fff', fontSize: 20, fontWeight: 'bold'}}>
            {title || ''}
          </Text>
        </View>

        <View
          style={{
            padding: 10,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('addFriend', {type: 'contact'});
              sendBtnClickToAnalytics('Add Friend Icon SubHeader');
            }}>
            <IconPersonAdd style={{marginRight: 10}} width={25} height={25} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('addFriend', {type: 'msg'});
              sendBtnClickToAnalytics('Chat Icon SubHeader');
            }}>
            <IconChatBubbles
              style={{marginHorizontal: 10}}
              width={25}
              height={25}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
