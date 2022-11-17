import Button from '@button/Button';
import DocumentImage from '@icons/paper.svg';
import {URLs} from '@networking/Urls';
import {callApi} from '@redux/CommonDispatch.js';
import {APPLY_JOB} from '@redux/Types';
import {TEXT_TYPE} from '@resources/Constants';
import ApplySuccessPopup from '@rojgar/ApplySuccessPopup';
import Text from '@textView/TextView';
import {debounce, showSnackBar} from '@utils/Util';
import moment from 'moment';
import React, {useState, useEffect} from 'react';
import {Dimensions, Image, TouchableOpacity, View} from 'react-native';
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import VideoPlayer from 'react-native-video-player';
import {useDispatch, useSelector} from 'react-redux';
import RojgarBookmark from './RojgarBookmark';
import {GetPhotoBaseURL} from '@networking/Urls';

const screenWidth = Math.round(Dimensions.get('window').width);

export default function RojgarItem({
  item,
  index,
  setShowOfferPopup,
  setDetailsItem,
  setOfferItem,
  setUpdateProfile,
  setUpdateItems,
  // RojgarBg,
  rojgarCallback,
}) {
  const dispatch = useDispatch();

  const {profileData} = useSelector((state) => state.ProfileReducer);
  const [applySuccess, setApplySuccess] = useState(false);
  const [jobStatus, setJobStatus] = useState(item?.application_status || 0);
  const [applyBtnTitle, setApplyBtnTitle] = useState('');

  useEffect(() => {
    setJobStatus(item?.application_status);
  }, []);

  const onDocumentClick = (filename, index) => {
    const url = filename?.includes('amazonaws')
      ? filename
      : GetPhotoBaseURL() + filename;
    const localFile = `${RNFS.DocumentDirectoryPath}/${
      filename?.includes('amazonaws') ? 'temp' + index : filename
    }`;

    const options = {
      fromUrl: url,
      toFile: localFile,
    };

    RNFS.downloadFile(options)
      .promise.then(() => FileViewer.open(localFile))
      .then(() => {
        // success
      })
      .catch((error) => {
        // error
        showSnackBar(error.message, 'error');
      });
  };

  const getAppliedTitle = (status) => {
    switch (status) {
      case 0:
        return 'Apply';
      case 1:
        return 'Applied';
      case 2:
        return 'Offered';
      case 3:
        return 'Rejected by employer';
      case 4:
        return 'Rejected by employee';
      case 5:
        return 'Offer accepted';
      case 6:
        return 'Hold';
      default:
        break;
    }
  };

  const onApplyJob = (item) => {
    const {job_id} = item;

    const {
      section_1,
      section_2,
      section_3,
      section_4,
      section_5,
      section_6,
      section_7,
    } = profileData || {};
    let items = [];
    if (section_1 !== 1) {
      items.push('Contact Details');
    }
    if (section_2 !== 1) {
      items.push('Address Details');
    }
    if (section_3 !== 1) {
      items.push('Professional Details');
    }
    if (section_4 !== 1) {
      items.push('Skills');
    }
    if (section_5 !== 1) {
      items.push('Education Details');
    }
    if (section_6 !== 1) {
      items.push('Personal Details');
    }
    if (section_7 !== 1) {
      items.push('Personal ID Details');
    }
    if (items?.length === 0) {
      // console.log('$%^&*^%$%^&E^&^%^&^%$%^%$%^%');
      dispatch(
        callApi(APPLY_JOB, URLs.APPLY_JOB, {job_id, type: 1}, () => {
          setApplySuccess(true);
          setJobStatus(1);
        }),
      );
    } else {
      setUpdateItems(items);
      setTimeout(() => {
        setUpdateProfile(true);
      }, 100);
    }
  };

  const {
    job_title,
    company,
    location,
    pay_rate,
    salary_from,
    salary_to,
    publish_date,
    jd_attachment,
    job_type,
    job_id,
    jd_type,
    bookmark,
    job_link,
  } = item;
  const openModel = () => {
    if (applyBtnTitle === 'Apply') {
      onApplyJob(item);
    } else if (applyBtnTitle === 'Offered') {
      setOfferItem(item);
      setTimeout(() => {
        setShowOfferPopup(true);
      }, 200);
    }
  };
  useEffect(() => {
    setApplyBtnTitle(getAppliedTitle(jobStatus));
  }, [jobStatus]);
  {
    // console.log('Rojgharitem', item);
  }
  return (
    <View
      style={[
        {
          backgroundColor: '#fff',
          elevation: 8,
          marginHorizontal: wp(2),
          marginTop: 10,
        },
      ]}>
      {/* <RojgarBg style={{position: 'absolute', top: 0, right: 0}} /> */}
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: wp(2),
        }}>
        <View style={{flex: 1}}>
          <View style={{marginHorizontal: 5, marginVertical: 10}}>
            <View style={{flexDirection: 'row'}}>
              <Text
                light
                type={TEXT_TYPE.EXTRA_SMALL}
                style={{marginTop: 5, color: 'grey'}}>
                Job Title
              </Text>
              <Text
                bold
                type={TEXT_TYPE.EXTRA_SMALL}
                style={{marginTop: 5, marginLeft: 10, flex: 1}}>
                {job_title}
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text
                light
                type={TEXT_TYPE.EXTRA_SMALL}
                style={{marginTop: 5, color: 'grey'}}>
                Company
              </Text>
              <Text
                light
                type={TEXT_TYPE.EXTRA_SMALL}
                style={{marginTop: 5, marginLeft: 10, flex: 1}}>
                {company}
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text
                light
                type={TEXT_TYPE.EXTRA_SMALL}
                style={{marginTop: 5, color: 'grey'}}>
                Location
              </Text>
              <Text
                light
                type={TEXT_TYPE.EXTRA_SMALL}
                style={{marginTop: 5, marginLeft: 10, flex: 1}}>
                {location}
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text
                light
                type={TEXT_TYPE.EXTRA_SMALL}
                style={{marginTop: 5, color: 'grey'}}>
                Pay Rate
              </Text>
              <Text
                light
                type={TEXT_TYPE.EXTRA_SMALL}
                style={{marginTop: 5, marginLeft: 10, flex: 1}}>
                {parseInt(pay_rate || 0, 10) === 1
                  ? 'Daily'
                  : parseInt(pay_rate || 0, 10) === 2
                  ? 'Monthly'
                  : parseInt(pay_rate || 0, 10) === 3
                  ? 'Yearly'
                  : 'Weekly'}
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text
                light
                type={TEXT_TYPE.EXTRA_SMALL}
                style={{marginTop: 5, color: 'grey'}}>
                Pay Range
              </Text>
              <Text
                light
                type={TEXT_TYPE.EXTRA_SMALL}
                style={{marginTop: 5, marginLeft: 10, flex: 1}}>
                {salary_from + '-' + salary_to}
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text
                light
                type={TEXT_TYPE.EXTRA_SMALL}
                style={{marginTop: 5, color: 'grey'}}>
                Job Type
              </Text>
              <Text
                light
                type={TEXT_TYPE.EXTRA_SMALL}
                style={{marginTop: 5, marginLeft: 10, flex: 1}}>
                {parseInt(job_type || 0, 10) === 1
                  ? 'Contract'
                  : parseInt(job_type || 0, 10) === 2
                  ? 'Permanent'
                  : '-'}
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text
                light
                type={TEXT_TYPE.EXTRA_SMALL}
                style={{marginTop: 5, color: 'grey'}}>
                Posted On
              </Text>
              <Text
                light
                type={TEXT_TYPE.EXTRA_SMALL}
                style={{marginTop: 5, marginLeft: 10}}>
                {publish_date
                  ? moment(publish_date).format('DD MMM YYYY')
                  : null}
              </Text>
            </View>
          </View>
        </View>

        <View style={{marginTop: 60}}>
          <View
            style={{
              alignSelf: 'center',
              marginTop: 10,
              marginRight: 10,
              width: screenWidth * 0.3,
              height: 100,
            }}>
            {jd_attachment && jd_type === 2 && (
              <VideoPlayer
                video={{
                  cache: 'only-if-cached',
                  uri: jd_attachment?.includes('amazonaws')
                    ? jd_attachment
                    : GetPhotoBaseURL() +
                      (jd_attachment?.charAt(0) === ','
                        ? jd_attachment?.substring(1)
                        : jd_attachment),
                }}
                // autoplay
                pauseOnPress
                videoWidth={screenWidth * 0.3}
                videoHeight={100}
                style={{
                  width: screenWidth * 0.3,
                  height: 100,
                }}
              />
            )}
            {jd_attachment && jd_type === 1 && (
              <Image
                source={{
                  cache: 'only-if-cached',
                  uri: jd_attachment?.includes('amazonaws')
                    ? jd_attachment
                    : GetPhotoBaseURL() +
                      (jd_attachment?.charAt(0) === ','
                        ? jd_attachment?.substring(1)
                        : jd_attachment),
                }}
                style={{
                  width: screenWidth * 0.3,
                  height: 100,
                }}
              />
            )}
            {jd_attachment && jd_type === 3 && (
              <TouchableOpacity
                onPress={() => onDocumentClick(jd_attachment, index)}>
                <DocumentImage
                  width={50}
                  height={50}
                  style={{
                    alignSelf: 'center',
                    width: screenWidth * 0.3,
                    height: 100,
                  }}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginHorizontal: 10,
        }}>
        {applyBtnTitle ? (
          <Button
            containerStyle={{
              marginVertical: 10,
              zIndex: 99,
            }}
            onPress={() => debounce(openModel())}
            // disabled={applyBtnTitle !== 'Not Applied'}
            title={applyBtnTitle}
            titleStyle={{fontSize: 14, paddingHorizontal: 5}}
            backgroundColor={
              applyBtnTitle === 'Offered'
                ? '#4EAF47'
                : applyBtnTitle === 'Apply' || applyBtnTitle === 'Applied'
                ? '#FFC003'
                : applyBtnTitle === 'Hold'
                ? 'grey'
                : 'red'
            }
          />
        ) : null}
        <View style={{alignItems: 'flex-end', justifyContent: 'flex-end'}}>
          <RojgarBookmark
            job_id={job_id}
            isBookmarked={bookmark}
            job_link={job_link}
            rojgarItemCallback={(val) => {
              // console.log('Rojgar Item callback called', val);
              const temp = {...item};
              temp.bookmark = val;
              setDetailsItem(temp);
              // console.log('temp changed data', temp);
              // rojgarCallback && rojgarCallback(val);
            }}
          />
        </View>
      </View>

      {applySuccess && (
        <ApplySuccessPopup
          onClose={() => {
            setApplySuccess(false);
          }}
        />
      )}
    </View>
  );
}
