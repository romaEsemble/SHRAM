//import liraries
import ReusableImage from '@cardItem/ReusableImage';
import ReusableVideo from '@cardItem/ReusableVideo';
import Circle from '@circle/Circle';
import CheckRight from '@icons/IconCheckCircle';
import Pending from '@icons/pending_approval.svg';
import Rejected from '@icons/rejected.svg';
import IconCircle from '@icons/speakerIcon';
import localStyles from '@myPost/MyPostStyles';
import Text from '@textView/TextView';
import moment from 'moment';
import React from 'react';
import {Image, View} from 'react-native';
import strings from '@resources/Strings';

// create a component
export default function ({item}, navigation) {
  const {
    cont_file_type,
    cont_type,
    cont_link_url,
    is_active,
    desc,
    video_thumb,
  } = item;
  // console.log('Thumb from reusable', video_thumb);
  const {backgroundFlowerContainer, backgroundFlowerPositions} = localStyles;

  return (
    <View style={{margin: 5, backgroundColor: '#fff'}}>
      <View style={{flexDirection: 'row', alignItems: 'center', width: '100%'}}>
        <View style={{padding: 10, width: '20%', alignItems: 'center'}}>
          <Circle
            type={'small'}
            circleColor={'red'}
            svg={<IconCircle width={25} height={25} style={{marginTop: 12}} />}
          />
        </View>
        <View
          style={{
            padding: 10,
            flex: 1,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
            }}>
            {item?.header}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: '#707070',
            }}>
            {item?.section}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: '#707070',
            }}>
            {item?.sch_date
              ? moment(item?.sch_date).format('YYYY-MM-DD hh:mm')
              : null}
          </Text>
          {is_active === 3 && (
            <View
              style={
                {
                  // marginTop: 15,
                  // alignItems: 'center',
                  // flexDirection: 'row',
                }
              }>
              <Text
                style={{
                  fontSize: 12,
                  // alignSelf: 'center',
                  color: 'red',
                  marginRight: 5,
                }}>
                Reason:
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  // alignSelf: 'center',
                  color: '#4B79D8',
                  marginRight: 5,
                }}>
                {item?.rejection_reason || 'No Description Available'}
              </Text>
            </View>
          )}
        </View>
        <View
          style={{
            // flex: 1,
            padding: 10,
            alignItems: 'flex-end',
          }}>
          <View style={backgroundFlowerContainer}>
            <Image
              source={require('@icons/backgroundFlower.png')}
              style={backgroundFlowerPositions}
            />
            {is_active === 1 && (
              <View style={{marginTop: 15, alignItems: 'center'}}>
                <CheckRight width={40} height={40} />
                <Text
                  style={{
                    fontSize: 12,
                    alignSelf: 'center',
                    color: '#4B79D8',
                    marginRight: 5,
                  }}>
                  {strings?.published}
                </Text>
              </View>
            )}
            {is_active === 2 && (
              <View style={{marginTop: 15, alignItems: 'center'}}>
                <Pending width={40} height={40} />
                <Text
                  style={{
                    fontSize: 12,
                    textAlign: 'center',
                    color: '#4B79D8',
                    marginRight: 5,
                  }}>
                  {strings?.pendingApproval}
                </Text>
              </View>
            )}
            {is_active === 3 && (
              <View style={{marginTop: 15, alignItems: 'center'}}>
                <Rejected width={40} height={40} />
                <Text
                  style={{
                    fontSize: 12,
                    alignSelf: 'center',
                    color: '#4B79D8',
                    marginRight: 5,
                  }}>
                  {strings?.rejected}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
      <View style={{marginHorizontal: 10, marginBottom: 10}}>
        {desc && (
          <Text
            style={{
              marginBottom: 10,
              marginHorizontal: 10,
              fontSize: 14,
              color: '#4B79D8',
            }}>
            {desc || ''}
          </Text>
        )}
        <View
          style={{
            // borderWidth: 0.5,
            // borderColor: '#2751A7',
            borderRadius: 10,
          }}>
          {cont_file_type === 1 && (
            <ReusableImage cont_link={cont_link_url} cont_type={cont_type} />
          )}

          {cont_file_type === 2 && (
            <ReusableVideo
              navigation={navigation}
              cont_link={cont_link_url}
              thumbnail={video_thumb}
              cont_type={cont_type}
            />
          )}
        </View>
      </View>
    </View>
  );
}
