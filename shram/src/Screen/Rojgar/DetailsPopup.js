import Button from '@button/Button';
import BookmarkFilled from '@icons/bookmark-filled.svg';
import BookmarkEmpty from '@icons/bookmark.svg';
import CloseIcon from '@icons/closeColor.svg';
import DocumentImage from '@icons/paper.svg';
import ProfileComplete from '@icons/profile_complete.svg';
import ProfileInComplete from '@icons/profile_Incomplete.svg';
import ResumeComplete from '@icons/resume_complete.svg';
import ResumeInComplete from '@icons/resume_incomplete.svg';
import UnVerifiedResume from '@icons/unverified_resume.svg';
import VerifiedResume from '@icons/verified_resume.svg';
import PopupModal from '@popupModal/PopupModal';
import {TEXT_TYPE} from '@resources/Constants';
import RojgarBookmark from '@rojgar/RojgarBookmark';
import Text from '@textView/TextView';
import {showSnackBar} from '@utils/Util';
import moment from 'moment';
import React, {Component} from 'react';
import {Dimensions, Image, TouchableOpacity, View, StyleSheet} from 'react-native';
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';
import {ScrollView} from 'react-native-gesture-handler';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import VideoPlayer from 'react-native-video';
import {connect} from 'react-redux';
import strings from '@resources/Strings';
import {GetPhotoBaseURL} from '@networking/Urls';
import {sendBtnClickToAnalytics} from '@utils/Util';

const screenWidth = Math.round(Dimensions.get('window').width);

class DetailsPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jobStatus: this?.props?.item?.application_status || 0,
      applyBtnTitle: '',
      isDetailImageVisible: false,
      doc: '',
      docType: 'image',
    };
  }
  componentWillUnmount() {
    this.setState({applyBtnTitle: this.getAppliedTitle(this.state.jobStatus)});
  }

  setJobState = () => {
    this.setState({jobStatus: 1});
  };

  getBookmarkIcon = (bookmark) => {
    if (bookmark !== 1) {
      return (
        <BookmarkEmpty width={wp(6)} height={wp(6)} style={{marginRight: 10}} />
      );
    }
    return (
      <BookmarkFilled width={wp(6)} height={wp(6)} style={{marginRight: 10}} />
    );
  };

  onDocumentClick = (filename, jd_attachment) => {
    const url = filename?.includes('amazonaws')
      ? filename
      : `${GetPhotoBaseURL()}${filename}`;
    const localFile = `${RNFS.DocumentDirectoryPath}/${
      filename?.includes('amazonaws') ? 'temp' + moment().valueOf() : filename
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

  getAppliedTitle(status) {
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
  }

  render() {
    const {
      item,
      onClose,
      localBookmark,
      onBookmarkPress,
      onApplyJob,
      profileData,
      resumePercentage,
      currentTab,
      applicationStatus,
    } = this.props;
    const {
      job_title,
      company,
      location,
      salary_from,
      salary_to,
      publish_date,
      jd_attachment,
      job_type,
      status,
      job_period_uom,
      job_id,
      job_period,
      job_from,
      shift,
      industry,
      trade,
      jd_details,
      jd_type,
      job_link,
      pay_rate,
      bookmark,
      comp_profile,
      job_post_status,
    } = item;
    // console.log('Item is', job_post_status, applicationStatus);
    const applyBtnTitle = this.getAppliedTitle(this.state.jobStatus);

    return (
      <View style={{backgroundColor: "#fffff"}}>
        <PopupModal onBackdropPress={onClose}>
          <ScrollView>
            <View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity onPress={onClose}>
                  <CloseIcon width={wp(8)} height={wp(10)} />
                </TouchableOpacity>
                <Text
                  bold
                  type={TEXT_TYPE.MEDIUM}
                  style={{marginTop: 5, flex: 1, marginLeft: 80, color:'black', fontSize: 30, fontWeight: "900"}}>
                   Job Details
                </Text>
               
              </View>
              {/* <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  flexDirection: 'row',
                  // marginTop: 40,
                  // marginHorizontal: 10,
                }}>
                {jd_attachment && jd_type === 2 && (
                  <VideoPlayer
                    video={{
                      uri: jd_attachment?.includes('amazonaws')
                        ? jd_attachment
                        : `${GetPhotoBaseURL()}${
                            jd_attachment?.charAt(0) === ','
                              ? jd_attachment?.substring(1)
                              : jd_attachment
                          }`,
                    }}
                    // autoplay
                    pauseOnPress
                    videoWidth={screenWidth}
                    videoHeight={120}
                    style={{
                      alignSelf: 'center',
                      marginTop: 10,
                      marginRight: 10,
                      width: screenWidth,
                      height: 120,
                    }}
                  />
                )}
                {jd_attachment && jd_type === 1 && (
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        doc: jd_attachment,
                        docType: 'image',
                        isDetailImageVisible: true,
                      });
                      sendBtnClickToAnalytics(
                        'Download Attachment from Rojgar',
                      );
                    }}>
                    <Image
                      source={{
                        uri: jd_attachment?.includes('amazonaws')
                          ? jd_attachment
                          : `${GetPhotoBaseURL()}${
                              jd_attachment?.charAt(0) === ','
                                ? jd_attachment?.substring(1)
                                : jd_attachment
                            }`,
                      }}
                      style={{
                        alignSelf: 'center',
                        marginTop: 10,
                        marginRight: 10,
                        width: screenWidth,
                        height: 120,
                      }}
                    />
                  </TouchableOpacity>
                )}
                {jd_attachment && jd_type === 3 && (
                  <TouchableOpacity
                    style={{
                      alignSelf: 'center',
                      marginTop: 10,
                      marginRight: 10,
                      width: screenWidth,
                      height: 120,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#d3d3d3',
                    }}
                    onPress={() => this.onDocumentClick(jd_attachment)}>
                    <DocumentImage
                      width={50}
                      height={50}
                      style={{
                        alignSelf: 'center',
                      }}
                    />
                  </TouchableOpacity>
                )}
              </View> */}
              {/* <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  // justifyContent: 'flex-start',
                  justifyContent: 'space-between',
                  flex: 1,
                }}>
                {profileData?.profile_star &&
                parseInt(profileData?.profile_star || 0, 10) === 7 ? (
                  <View
                    style={{
                      alignItems: 'center',
                      flex: 0.33,
                      height: 80,
                      justifyContent: 'flex-start',
                    }}>
                    <ProfileComplete
                      width={wp(6)}
                      height={wp(6)}
                      style={{marginTop: 10}}
                    />
                    <Text
                      type={TEXT_TYPE.EXTRA_SMALL}
                      style={{
                        marginTop: 5,
                        color: 'grey',
                        textAlign: 'center',
                        flexWrap: 'wrap',
                      }}>
                      Profile Complete
                    </Text>
                  </View>
                ) : (
                  <View
                    style={{
                      alignItems: 'center',
                      flex: 0.33,
                      height: 80,
                      justifyContent: 'flex-start',
                    }}>
                    <ProfileInComplete
                      width={wp(6)}
                      height={wp(6)}
                      style={{marginTop: 10}}
                    />
                    <Text
                      type={TEXT_TYPE.EXTRA_SMALL}
                      style={{
                        marginTop: 5,
                        color: 'grey',
                        textAlign: 'center',
                        flexWrap: 'wrap',
                      }}>
                      Profile Incomplete
                    </Text>
                  </View>
                )}
                {resumePercentage === 100 ? (
                  <View
                    style={{
                      alignItems: 'center',
                      flex: 0.33,
                      height: 80,
                      justifyContent: 'flex-start',
                    }}>
                    <ResumeComplete
                      width={wp(6)}
                      height={wp(6)}
                      style={{marginTop: 10}}
                    />
                    <Text
                      type={TEXT_TYPE.EXTRA_SMALL}
                      style={{
                        marginTop: 5,
                        color: 'grey',
                        flexWrap: 'wrap',
                        textAlign: 'center',
                      }}>
                      Resume Complete
                    </Text>
                  </View>
                ) : (
                  <View
                    style={{
                      alignItems: 'center',
                      flex: 0.33,
                      height: 80,
                      justifyContent: 'flex-start',
                    }}>
                    <ResumeInComplete
                      width={wp(6)}
                      height={wp(6)}
                      style={{marginTop: 10}}
                    />
                    <Text
                      type={TEXT_TYPE.EXTRA_SMALL}
                      style={{
                        marginTop: 5,
                        color: 'grey',
                        flexWrap: 'wrap',
                        textAlign: 'center',
                      }}>
                      Resume {resumePercentage}%
                    </Text>
                  </View>
                )}
                {profileData?.resume_verified ? (
                  <View
                    style={{
                      alignItems: 'center',
                      flex: 0.33,
                      height: 80,
                      justifyContent: 'flex-start',
                    }}>
                    <VerifiedResume
                      width={wp(6)}
                      height={wp(6)}
                      style={{marginTop: 10}}
                    />
                    <Text
                      type={TEXT_TYPE.EXTRA_SMALL}
                      style={{
                        marginTop: 5,
                        color: 'grey',
                        flexWrap: 'wrap',
                        textAlign: 'center',
                      }}>
                      Verified Resume
                    </Text>
                  </View>
                ) : (
                  <View
                    style={{
                      alignItems: 'center',
                      flex: 0.33,
                      height: 80,
                      justifyContent: 'flex-start',
                    }}>
                    <UnVerifiedResume
                      width={wp(6)}
                      height={wp(6)}
                      style={{marginTop: 10}}
                    />
                    <Text
                      type={TEXT_TYPE.EXTRA_SMALL}
                      style={{
                        marginTop: 5,
                        color: 'grey',
                        flexWrap: 'wrap',
                        textAlign: 'center',
                      }}>
                      Unverified Resume
                    </Text>
                  </View>
                )}
              </View> */}

              <View style={{flex: 1}}>
                <View style={{marginHorizontal: '2%', marginVertical: 10}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      type={TEXT_TYPE.EXTRA_SMALL}
                      style={styles.left}>
                      Job Title :
                    </Text>
                    <Text
                      type={TEXT_TYPE.EXTRA_SMALL}
                      style={styles.right}>
                      {job_title || '-'}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      type={TEXT_TYPE.EXTRA_SMALL}
                      style={styles.left}>
                      {strings?.company} :
                    </Text>
                    <Text
                      type={TEXT_TYPE.EXTRA_SMALL}
                      style={styles.right}>
                      {company || '-'}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      type={TEXT_TYPE.EXTRA_SMALL}
                      style={styles.left}>
                      {strings?.location} :
                    </Text>
                    <Text
                      type={TEXT_TYPE.EXTRA_SMALL}
                      style={styles.right}>
                      {location || '-'}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      bold
                      type={TEXT_TYPE.EXTRA_SMALL}
                      style={styles.left}>
                      Pay Rate :
                    </Text>
                    <Text
                      bold
                      type={TEXT_TYPE.EXTRA_SMALL}
                      style={styles.right}>
                      {parseInt(pay_rate || 0, 10) === 1
                        ? 'Daily'
                        : parseInt(pay_rate || 0, 10) === 2
                        ? 'Monthly'
                        : parseInt(pay_rate || 0, 10) === 3
                        ? 'Yearly'
                        : 'Weekly'}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      bold
                      type={TEXT_TYPE.EXTRA_SMALL}
                      style={styles.left}>
                      Pay Range :
                    </Text>
                    <Text
                      bold
                      type={TEXT_TYPE.EXTRA_SMALL}
                      style={styles.right}>
                      {salary_from + '-' + salary_to}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      bold
                      type={TEXT_TYPE.EXTRA_SMALL}
                      style={styles.left}>
                      Job Type :
                    </Text>
                    <Text
                      bold
                      type={TEXT_TYPE.EXTRA_SMALL}
                      style={styles.right}>
                      {parseInt(job_type || 0, 10) === 1
                        ? 'Contract'
                        : parseInt(job_type || 0, 10) === 2
                        ? 'Permanent'
                        : '-'}
                    </Text>
                  </View>
                  {parseInt(job_type || 0, 10) === 1 && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        bold
                        type={TEXT_TYPE.EXTRA_SMALL}
                        style={styles.left}>
                        Job Period :
                      </Text>
                      <Text
                        bold
                        type={TEXT_TYPE.EXTRA_SMALL}
                        style={styles.right}>
                        {job_period}{' '}
                        {parseInt(job_period_uom || 0, 10) === 1
                          ? 'Day'
                          : parseInt(job_period_uom || 0, 10) === 2
                          ? 'Months'
                          : parseInt(job_period_uom || 0, 10) === 3
                          ? 'Years'
                          : 'Weeks'}
                      </Text>
                    </View>
                  )}
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      type={TEXT_TYPE.EXTRA_SMALL}
                      style={styles.left}>
                      Start Date :
                    </Text>
                    <Text
                      type={TEXT_TYPE.EXTRA_SMALL}
                      style={styles.right}>
                      {job_from ? moment(job_from).format('DD MMM YYYY') : '-'}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      type={TEXT_TYPE.EXTRA_SMALL}
                      style={{marginTop: 5, color: 'black', fontSize: 18, fontWeight: "600"}}>
                      Company Profile :
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        comp_profile &&
                        ['.doc', '.docx,', '.txt', '.pdf'].some((el) =>
                          comp_profile?.includes(el),
                        )
                          ? this.onDocumentClick(comp_profile)
                          : ['.png', '.jpg,', '.jpeg'].some((el) =>
                              comp_profile?.includes(el),
                            )
                          ? this.setState({
                              doc: comp_profile,
                              docType: 'image',
                              isDetailImageVisible: true,
                            })
                          : this.setState({
                              doc: comp_profile,
                              docType: 'video',
                              isDetailImageVisible: true,
                            });
                        sendBtnClickToAnalytics(
                          'Click here to View Company Profile',
                        );
                      }}>
                      <Text
                        light
                        type={TEXT_TYPE.EXTRA_SMALL}
                        style={{
                          color: 'blue',
                          marginTop: 5,
                          marginLeft: 10,
                          borderBottomWidth: 1,
                          borderBottomColor: 'blue',
                          fontSize: 15,
                          fontWeight: "800"
                        }}>
                        Click here to view
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      type={TEXT_TYPE.EXTRA_SMALL}
                      style={styles.left}>
                      Shift Timing :
                    </Text>
                    <Text
                      type={TEXT_TYPE.EXTRA_SMALL}
                      style={styles.right}>
                      {parseInt(shift || 0, 10) === 1
                        ? 'Morning'
                        : parseInt(shift || 0, 10) === 2
                        ? 'Evening'
                        : parseInt(shift || 0, 10) === 3
                        ? 'Night'
                        : '-'}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      type={TEXT_TYPE.EXTRA_SMALL}
                      style={styles.left}>
                      Industry :
                    </Text>
                    <Text
                      type={TEXT_TYPE.EXTRA_SMALL}
                      style={styles.right}>
                      {industry || '-'}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      type={TEXT_TYPE.EXTRA_SMALL}
                      style={styles.left}>
                      Trade :
                    </Text>
                    <Text
                      type={TEXT_TYPE.EXTRA_SMALL}
                      style={styles.right}>
                      {trade || '-'}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      type={TEXT_TYPE.EXTRA_SMALL}
                      style={styles.left}
                      >
                      Job Description :
                    </Text>
                  </View>
                  <Text
                    bold
                    style={styles.right}
                    type={TEXT_TYPE.EXTRA_SMALL}
                    >
                    {jd_details || '-'}
                  </Text>
                  {/* <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      type={TEXT_TYPE.EXTRA_SMALL}
                      style={{marginTop: 5, color: 'black', fontSize: 18}}>
                      Posted On :
                    </Text>
                    <Text
                      light
                      type={TEXT_TYPE.EXTRA_SMALL}
                      style={{marginTop: 5, marginLeft: 10}}>
                      {publish_date
                        ? moment(publish_date).format('DD MMM YYYY')
                        : '-'}
                    </Text>
                  </View> */}
                </View>
              </View>
              <View 
                style={{
                  borderRadius: 200
                
                }}>
                
                {applyBtnTitle && (
                  <Button 
                  
                    onPress={() => {
                      this.state.jobStatus === 0 &&
                        onApplyJob(item, this.setJobState);
                    }}
                    disabled={
                      currentTab == 1 && applicationStatus != 2 ? true : false
                    }
                    // disabled={applyBtnTitle !== 'Not Applied'}
                    title={applyBtnTitle}
                    titleStyle={{fontSize: 16, paddingHorizontal: 60, alignItems: "center"}}
                    backgroundColor={
                      this.state.jobStatus === 2 ||
                      this.state.jobStatus === 5 ||
                      this.state.jobStatus === 7
                        ? '#4EAF47'
                        : this.state.jobStatus === 0 ||
                          this.state.jobStatus === 1
                        ? '#FFC003'
                        : this.state.jobStatus === 6
                        ? 'grey'
                        : 'red'
                    }
                  />
                )}
              
                {/* <View
                  style={{
                    marginHorizontal: '2%',
                    marginVertical: 10,
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                  }}>
                  <RojgarBookmark
                    applicationStatus={applicationStatus}
                    currentTab={currentTab}
                    job_id={job_id} n                                        
                    isBookmarked={bookmark}
                    job_link={job_link}
                    rojgarItemCallback={(val) => {
                      const temp = {...item};
                      temp.bookmark = val;
                      this.props.setDetailsItem(temp);
                      // I Commented this to avoid scroll issue after bookmark
                      // this.props.setLoading(true);
                      // setTimeout(() => {
                      //   this.props.setLoading(false);
                      // }, 50);
                      // rojgarCallback && rojgarCallback(val);
                    }}
                  />
                </View> */}
              </View>
            </View>
          </ScrollView>
        </PopupModal>
        {this.state.isDetailImageVisible && (
          <PopupModal
            onBackdropPress={() => {
              this.setState({isDetailImageVisible: false});
            }}>
            <View style={{alignItems: 'center', backgroundColor: "#ffff"}}>
              {this.state.docType === 'image' ? (
                <Image
                  source={{
                    uri: this.state.doc?.includes('amazonaws')
                      ? this.state.doc
                      : `${GetPhotoBaseURL()}${
                          this.state.doc?.charAt(0) === ','
                            ? this.state.doc?.substring(1)
                            : this.state.doc
                        }`,
                  }}
                  resizeMode={'contain'}
                  style={{
                    alignSelf: 'center',
                    width: screenWidth * 0.9,
                    height: '99%',
                  }}
                />
              ) : (
                <VideoPlayer
                  video={{
                    uri: jd_attachment?.includes('amazonaws')
                      ? jd_attachment
                      : `${GetPhotoBaseURL()}${
                          jd_attachment?.charAt(0) === ','
                            ? jd_attachment?.substring(1)
                            : jd_attachment
                        }`,
                  }}
                  // autoplay
                  pauseOnPress
                  videoWidth={screenWidth * 0.9}
                  videoHeight={250}
                  style={{
                    alignSelf: 'center',
                    marginTop: 10,
                    marginRight: 10,
                    width: screenWidth * 0.9,
                    height: 250,
                  }}
                />
              )}
              <TouchableOpacity
                style={{position: 'absolute', alignSelf: 'flex-end'}}
                onPress={() => this.setState({isDetailImageVisible: false})}>
                <CloseIcon width={wp(6)} height={wp(6)} />
              </TouchableOpacity>
            </View>
          </PopupModal>
        )}
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const {profileData} = state.ProfileReducer;
  return {profileData};
};



const styles=StyleSheet.create({
  left: {
    marginTop: 5,
    color: 'black',
    fontSize: 18, 
    fontWeight: "500"
  },

  right:{
    color: "black",
    marginTop: 5,
    marginLeft: 10,
    fontSize: 18, 
    fontWeight: "800",
    
  }
})

export default connect(mapStateToProps)(DetailsPopup);
