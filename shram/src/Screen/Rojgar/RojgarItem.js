
import React, {Component} from 'react';
import Button from '@button/Button';
import DocumentImage from '@icons/paper.svg';
import {URLs} from '@networking/Urls';
import {APPLY_JOB} from '@redux/Types';
import {TEXT_TYPE} from '@resources/Constants';
import ApplySuccessPopup from '@rojgar/ApplySuccessPopup';
import Text from '@textView/TextView';
import {debounce, showSnackBar} from '@utils/Util';
import moment from 'moment';
import {
  Dimensions,
  Image,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import VideoPlayer from 'react-native-video';
import {connect} from 'react-redux';
import RojgarBookmark from '@rojgar/RojgarBookmark';
import {applyJob} from '@rojgar/RojgarActions';
import {PureComponent} from 'react';
import CommonImage from '@cardItem/CommonImage';
import FastImage from 'react-native-fast-image';
import strings from '@resources/Strings';
import {GetPhotoBaseURL} from '@networking/Urls';
import ReusableImage from '@cardItem/ReusableImage';
import {sendBtnClickToAnalytics} from '@utils/Util';

const screenWidth = Math.round(Dimensions.get('window').width);

class RojgarItem extends PureComponent {
  constructor(props) {
    super(props);

    const {item} = this.props;
    this.applySuccess = false;
    this.jobStatus = item?.application_status || 0;
    this.applyBtnTitle = this.getAppliedTitle(this.jobStatus) || '';

    this.state = {
      refresh: false,
    };
  }

  getAppliedTitle = (status) => {
    switch (status) {
      case 0:
        return 'Apply';
      case 1:
        return 'Applied';
      case 2:
        return 'Offered';
      case 3:
        return strings?.rejectedByEmployer;
      case 4:
        return strings?.rejectedByCandidate;
      case 5:
        return strings?.offerAccepted;
      case 6:
        return 'Hold';
      case 7:
        return strings?.shortListed;
      default:
        break;
    }
  };

  onApplyJob = (item) => {
    console.log('Rojgar Items', item);
    // return false;
    const {job_id} = item;

    const {
      section_1,
      section_2,
      section_3,
      section_4,
      // section_5,
      section_6,
      // section_7,
    } = this.props.profileData || {};
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
      items.push('Skill Details');
    }
    if (section_6 !== 1) {
      items.push('Personal Details');
    }
    // if (section_5 !== 1) {
    //   items.push('Education Details');
    // }
    // if (section_7 !== 1) {
    //   items.push('Personal ID Details');
    // }
    if (items?.length === 0) {
      const payload = {job_id, type: 1};
      this.props.applyJob(APPLY_JOB, URLs.APPLY_JOB, payload, (data) => {
        console.log('Applied Data', job_id);
        this.applySuccess = true;
        this.jobStatus = 1;
        this.applyBtnTitle = this.getAppliedTitle(this.jobStatus) || '';
        // this.props.applyJobLocal('Applied', {job_id: job_id});
        this.props.updateApply(job_id);
      });
    } else {
      this.props.setUpdateItems(items);
      setTimeout(() => {
        this.props.setUpdateProfile(true);
      }, 100);
    }
  };

  openModel = () => {
    const {item} = this.props;
    if (this.applyBtnTitle === 'Apply') {
      this.onApplyJob(item);
    } else if (this.applyBtnTitle === 'Offered') {
      this.props.setOfferItem(item);
      setTimeout(() => {
        this.props.setShowOfferPopup(true);
      }, 200);
    }
  };

  onDocumentClick = (filename, index) => {
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

  render() {
    const {index, item, currentTab} = this.props;
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
      application_status,
      job_post_status,
      pay_offer,
    } = item;

    this.jobStatus = application_status || 0;
    this.applyBtnTitle = this.getAppliedTitle(this.jobStatus) || '';
    // console.log('Inside card', this.props.index);

    return (
      <View
        style={[
          {
            backgroundColor: '#fff',
            elevation: 8,
            paddingHorizontal: wp(2),
            marginTop: 10,
            borderRadius: 20,
            marginLeft: 10,
            marginRight: 10,
            flex: 1,
           justifyContent: "center",
           alignItems: "center",
          },
        ]}>
        <Image
          source={require('@icons/RojgarBg.png')}
          style={{position: 'absolute', borderRadius: 20, width: 392, height: 263}}
        />
        {/* <FastImage
          source={require('@icons/RojgarBg.png')}
          style={{position: 'absolute', top: 0, right: 0, borderWidth: 1}}
        /> */}
        {/* <CommonImage
          style={{position: 'absolute', top: 0, right: 0}}
          type={0} //means local
          source={require('@icons/RojgarBg.png')}
        /> */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: "center"
          
          }}>
          <View style={{flex: 1}}>
            <View style={{marginHorizontal: 10, marginVertical: 15,}}>
              <View style={{flex:1, flexDirection: 'row', }}>
                <Text
                  light
                  type={TEXT_TYPE.EXTRA_SMALL}
                  style={styles.leftText}>
                  Job Title
                </Text>
                <Text
                  bold
                  type={TEXT_TYPE.EXTRA_SMALL}
                  style={styles.rightText}>
                  {job_title}
                </Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text
                  light
                  type={TEXT_TYPE.EXTRA_SMALL}
                  style={styles.leftText}>
                  {strings?.company}
                </Text>
                <Text
                  light
            
                  
                  ellipsizeMode='tail' 
                  numberOfLines={2}
                  type={TEXT_TYPE.EXTRA_SMALL}
                  style={styles.rightText}>
                  {company}
                </Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text
                  light
                  type={TEXT_TYPE.EXTRA_SMALL}
                  style={styles.leftText}>
                  {strings?.location}
                </Text>
                <Text
                  light
                  type={TEXT_TYPE.EXTRA_SMALL}
                  style={styles.rightText}>
                  {location}
                </Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text
                  light
                  type={TEXT_TYPE.EXTRA_SMALL}
                  style={styles.leftText}>
                  Pay Rate
                </Text>
                <Text
                  light
                  type={TEXT_TYPE.EXTRA_SMALL}
                  style={styles.rightText}>
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
                  style={styles.leftText}>
                  Pay Range
                </Text>
                <Text
                  light
                  type={TEXT_TYPE.EXTRA_SMALL}
                  style={styles.rightText}>
                  {salary_from + '-' + salary_to}
                </Text>
              </View>
              {application_status === 5 && (
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <Text
                    light
                    type={TEXT_TYPE.EXTRA_SMALL}
                    style={styles.leftText}>
                    Offered Pay
                  </Text>
                  <Text
                    bold
                    type={TEXT_TYPE.EXTRA_SMALL}
                    style={styles.rightText}>
                    {pay_offer || '-'}
                  </Text>
                </View>
              )}
              <View style={{flexDirection: 'row'}}>
                <Text
                  light
                  type={TEXT_TYPE.EXTRA_SMALL}
                  style={styles.leftText}>
                  Job Type
                </Text>
                <Text
                  light
                  type={TEXT_TYPE.EXTRA_SMALL}
                  style={styles.rightText}>
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
                  style={styles.leftText}>
                  Posted On
                </Text>
                <Text
                  light
                  type={TEXT_TYPE.EXTRA_SMALL}
                  style={styles.rightText}>
                  {publish_date
                    ? moment(publish_date).format('DD MMM YYYY')
                    : null}
                </Text>
              </View>
            </View>
          </View>

          <View>
            <View
              style={{
                // alignSelf: 'center',
                // marginTop: 10,
                // marginRight: 10,
                // width: screenWidth * 0.3,
                // height: 100,
              }}>
              {jd_attachment && jd_type === 2 && (
                <VideoPlayer
                  // video={{
                  //   cache: 'only-if-cached',
                  //   uri: jd_attachment?.includes('amazonaws')
                  //     ? jd_attachment
                  //     : GetPhotoBaseURL() +
                  //       (jd_attachment?.charAt(0) === ','
                  //         ? jd_attachment?.substring(1)
                  //         : jd_attachment),
                  // }}
                  // autoplay
                  // pauseOnPress
                  // fullScreenOnLongPress
                  // videoWidth={screenWidth * 0.3}
                  // videoHeight={100}
                  // style={{
                  //   width: screenWidth * 0.3,
                  //   height: 100,
                  // }}
                />
              )}
              {/* {jd_attachment && jd_type === 1 && (
                <ReusableImage
                  cont_link={
                    jd_attachment?.includes('amazonaws')
                      ? jd_attachment
                      : GetPhotoBaseURL() +
                        (jd_attachment?.charAt(0) === ','
                          ? jd_attachment?.substring(1)
                          : jd_attachment)
                  }
                  style={{
                    width: screenWidth * 0.3,
                    height: 100,
                  }}
                />
              )} */}
              {jd_attachment && jd_type === 3 && (
                <TouchableOpacity
                  onPress={() => {
                    this.onDocumentClick(jd_attachment, index);
                    sendBtnClickToAnalytics('Attachment Download Rojgar');
                  }}>
                  {/* <DocumentImage
                    width={50}
                    height={50}
                    style={{
                      alignSelf: 'center',
                      width: screenWidth * 0.3,
                      height: 100,
                    }}
                  /> */}
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
        <View
          style={{
            // flexDirection: 'row',
            // justifyContent: 'space-between',
            alignItems: 'center',
            marginHorizontal: 10,
          }}>

            {this.applyBtnTitle ? (
            <View style={{maxWidth: '80%', marginBottom: 10, marginLeft: 200, marginTop: -60}}>
              <Button
                Style={{
                  marginVertical: 50,
                  marginTop: 500,
                  zIndex: 99,
                  marginRight: 500
                  // marginLeft: -10
                
               
                }}
                onPress={() => debounce(this.openModel())}
                disabled={
                  currentTab == 1 && job_post_status != 2 ? true : false
                }
                // disabled={this.applyBtnTitle !== 'Not Applied'}
                title={this.applyBtnTitle}
                titleStyle={{fontSize: 14, paddingHorizontal: 5}}
                backgroundColor={
                  this.applyBtnTitle === 'Offered' ||
                  this.applyBtnTitle == 'Job Offer' ||
                  this.applyBtnTitle === 'Offer accepted' ||
                  this.applyBtnTitle === 'Shortlisted' ||
                  this.applyBtnTitle === 'Aapke Shortlisted' ||
                  this.applyBtnTitle === 'Congrats Aap Select Hogaye Ho 👏🏻'
                    ? '#4EAF47'
                    : this.applyBtnTitle === 'Apply' ||
                      this.applyBtnTitle === 'Applied' ||
                      this.applyBtnTitle === 'Applied Jobs'
                    ? '#FFC003'
                    : this.applyBtnTitle === 'Hold'
                    ? 'grey'
                    : 'red'
                }
              />
            </View>
          ) : null}
          
          <View
            style={{
              // alignItems: 'flex-end',
              // justifyContent: 'flex-end',
              marginTop: -530,
              marginLeft: 280
            }}>
            <RojgarBookmark
              applicationStatus={job_post_status}
              currentTab={currentTab}
              job_id={job_id}
              isBookmarked={bookmark}
              job_link={job_link}
              rojgarItemCallback={(val) => {
                const temp = {...this.props.item};
                temp.bookmark = val;
                this.props.setDetailsItem(temp);
                // rojgarCallback && rojgarCallback(val);
              }}
            />
          </View>
        </View>
        {this.applySuccess && (
          <ApplySuccessPopup
            onClose={() => {
              this.applySuccess = false;
              this.setState({refresh: true});
            }}
          />
        )}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    profileData: state.ProfileReducer.profileData,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    applyJob: (type, url, payload, callbackFunc) =>
      dispatch(applyJob(type, url, payload, callbackFunc)),
    applyJobLocal: (type, payload) => dispatch({type: type, payload: payload}),
  };
}

const styles = StyleSheet.create({
  leftText: {
    flex: 1,
    marginTop: 10,
    color: 'black',
    fontSize: 17,
    fontWeight: '500',
    marginLeft: 10
    
  },

  rightText: {
    flex: 1,
    color: 'black',
    marginTop: 10,
    marginLeft: 100,
    fontSize: 17,
    fontWeight: '800',
    alignItems: "flex-end",
    position: "absolute", 
    width:200
   

  },
});

export default connect(mapStateToProps, mapDispatchToProps)(RojgarItem);
