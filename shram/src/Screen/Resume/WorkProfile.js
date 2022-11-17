// import {TEXT_TYPE, INPUT_TYPE_OTHER} from '@resources/Constants';
// import Text from '@textView/TextView';
// import React, {useEffect, useState} from 'react';
// import {
//   TouchableOpacity,
//   View,
//   Dimensions,
//   Image,
//   Keyboard,
//   ScrollView,
//   RefreshControl,
//   SafeAreaView,
//   InteractionManager,
// } from 'react-native';
// import {FlatList} from 'react-native-gesture-handler';
// import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
// import {useDispatch, useSelector} from 'react-redux';
// import {URLs} from '@networking/Urls';
// import {callApi} from '@redux/CommonDispatch.js';
// import {COMPANY_ADD, COMPANY_LIST} from '@redux/Types';
// import AddCompanyIcon from '@icons/AddCompanyIcon';
// import Input from '@editText/EditText';
// import {useInput} from '@editText/EditTextHook';
// import {nonEmpty} from '@resources/Validate';
// import CalendarIcon from '@icons/CalendarIcon.svg';
// import moment from 'moment';
// import DateTimePicker from 'react-native-modal-datetime-picker';
// import Model from '@model/Model';
// import Button from '@button/Button';
// import {debounce} from '@utils/Util';
// import EditIcon from '@icons/EditIcon';
// import CloseIcon from '@icons/closeColor.svg';
// import strings from '@resources/Strings';
// import {sendBtnClickToAnalytics} from '@utils/Util';

// export default function WorkProfile({navigation}) {
//   const {
//     companyAddData,
//     companyListData,
//     companyListLoading,
//     companyAddLoading,
//   } = useSelector((state) => state.ResumeReducer);
//   const [addCompanyDetail, setAddCompanyDetail] = useState(false);
//   const [toDate, setToDate] = useState(moment().format('YYYY-MM-DD'));
//   const [fromDate, setFromDate] = useState(moment().format('YYYY-MM-DD'));
//   const [companyId, setCompanyID] = useState('');
//   const [dateVisible, setDateVisible] = useState(false);
//   const [currentPicker, setCurrentPicker] = useState('');
//   const [toDateError, setToDateError] = useState('');
//   const [fromDateError, setFromDateError] = useState('');

//   const {
//     value: companyName,
//     bind: companyNameBind,
//     setValue: setCompanyName,
//     setError: setCompanyNameError,
//     checkValidation: CheckCompanyNameValidation,
//   } = useInput('', INPUT_TYPE_OTHER, nonEmpty, strings?.invalidCompanyName);

//   const {
//     value: companyLocation,
//     bind: companyLocationBind,
//     setValue: setCompanyLocation,
//     setError: setCompanyLocationError,

//     checkValidation: CheckCompanyLocationValidation,
//   } = useInput('', INPUT_TYPE_OTHER, nonEmpty, strings?.invalidCompanyLocation);

//   const {
//     value: refPerson,
//     bind: refPersonBind,
//     setValue: setRefPerson,
//     setError: setRefPersonError,

//     checkValidation: CheckRefPersonValidation,
//   } = useInput('', INPUT_TYPE_OTHER, nonEmpty, strings?.invalidName);

//   const {
//     value: refRelation,
//     bind: refRelationBind,
//     setError: setRefRelationError,
//     setValue: setRefRelation,
//     checkValidation: CheckRefRelationValidation,
//   } = useInput('', INPUT_TYPE_OTHER, nonEmpty, strings?.invalidRelation);

//   const dispatch = useDispatch();
//   useEffect(() => {
//     const interactionPromise = InteractionManager.runAfterInteractions(() =>
//       getCompanyList(),
//     );
//     return () => interactionPromise.cancel();
//   }, []);

//   const getCompanyList = () => {
//     dispatch(callApi(COMPANY_LIST, URLs.COMPANY_LIST, {}, () => {}));
//   };
//   const addCompanyData = (id) => {
//     Keyboard.dismiss();
//     if (CheckCompanyNameValidation()) return false;
//     else if (CheckCompanyLocationValidation()) return false;
//     else if (CheckRefPersonValidation()) return false;
//     else if (CheckRefRelationValidation()) return false;
//     if (!fromDateError && !toDateError) {
//       dispatch(
//         callApi(
//           COMPANY_ADD,
//           URLs.COMPANY_ADD,
//           {
//             ref_comp_id: id ? id : '',
//             comp_name: companyName,
//             from_dt: fromDate,
//             to_dt: toDate,
//             location_city: companyLocation,
//             ref_person: refPerson,
//             ref_relation: refRelation,
//             // is_active: 0,
//           },
//           () => {
//             setAddCompanyDetail(false);
//             resetNullValues();
//             getCompanyList();
//           },
//         ),
//       );
//     }
//   };

//   const editDetails = (item, index) => {
//     setCompanyName(item?.comp_name);
//     setCompanyID(item?.ref_comp_id);
//     setCompanyLocation(item?.location_city);
//     setRefPerson(item?.ref_person);
//     setRefRelation(item?.ref_relation);
//     setFromDate(moment(item?.from_dt).format('YYYY-MM-DD'));
//     setToDate(moment(item?.to_dt).format('YYYY-MM-DD'));
//     setAddCompanyDetail(true);
//   };

//   const resetNullValues = () => {
//     setCompanyName('');
//     setCompanyLocation('');
//     setRefPerson('');
//     setRefRelation('');
//     setFromDate('');
//     setToDate('');
//     setCompanyNameError('');
//     setCompanyLocationError('');
//     setRefPersonError('');
//     setRefRelationError('');
//   };
//   const handleFromDatePicked = (date) => {
//     setDateVisible(false);
//     if (currentPicker == 'to') {
//       setToDate(date);
//     } else {
//       setFromDate(date);
//     }
//     let fromDateLocal = currentPicker != 'to' ? date : fromDate;
//     let toDateLocal = currentPicker == 'to' ? date : toDate;

//     if (fromDateLocal || toDateLocal) {
//       if (fromDateLocal) {
//         if (toDateLocal) {
//           if (moment(fromDateLocal) <= moment(toDateLocal)) {
//             setFromDateError('');
//             setToDateError('');
//           } else {
//             setToDateError("To date can't be greater than from date.");
//           }
//         } else {
//           setToDateError('To date is required.');
//         }
//       } else {
//         setFromDateError('From date is required.');
//       }
//     }
//   };
//   let companyRef = null;
//   let locationRef = null;
//   let ReferenceRef = null;
//   let workRef = null;
//   return (
//     <View style={{flex: 1}}>
//       <View style={{width: '30%', marginBottom: 5}}>
//         <TouchableOpacity
//           onPress={() => {
//             setAddCompanyDetail(true);
//             sendBtnClickToAnalytics(strings?.addNew);
//           }}
//           style={{
//             margin: 5,
//             borderWidth: 1,
//             borderColor: '#FFC003',
//             borderRadius: 5,
//             padding: 5,
//             flexDirection: 'row',
//             alignItems: 'center',
//           }}>
//           <AddCompanyIcon width={25} height={25} />
//           <Text
//             style={{
//               fontSize: 14,
//               color: '#777171',
//               margin: 5,
//             }}>
//             {strings?.addNew}
//           </Text>
//         </TouchableOpacity>
//       </View>
//       <View style={{flex: 1}}>
//         <FlatList
//           keyExtractor={(item, index) => 'resume' + index}
//           data={companyListData}
//           contentContainerStyle={{flexGrow: 1, paddingBottom: 150}}
//           refreshControl={
//             <RefreshControl
//               colors={['#9Bd35A', '#689F38']}
//               refreshing={companyListLoading}
//               onRefresh={() => {
//                 getCompanyList();
//               }}
//             />
//           }
//           ListEmptyComponent={
//             <View
//               style={{
//                 // height: Dimensions.get('window').height,
//                 alignItems: 'center',
//                 justifyContent: 'center',
//               }}>
//               <Text style={{fontSize: 14, color: '#4B79D8'}}>
//                 {strings?.addWorkProfile}{' '}
//               </Text>
//             </View>
//           }
//           renderItem={({item, index}) => (
//             <SafeAreaView>
//               <View
//                 style={[
//                   {
//                     width: '95%',
//                     backgroundColor: '#fff',
//                     elevation: 8,
//                     marginHorizontal: wp(2),
//                     marginTop: 10,
//                   },
//                 ]}>
//                 <View
//                   style={{
//                     flexDirection: 'row',
//                     paddingHorizontal: wp(2),
//                   }}>
//                   <View style={{flex: 1}}>
//                     <View style={{marginHorizontal: '2%', marginVertical: 10}}>
//                       <View
//                         style={{flexDirection: 'row', alignItems: 'center'}}>
//                         <View style={{width: '30%'}}>
//                           <Text
//                             light
//                             type={TEXT_TYPE.EXTRA_SMALL}
//                             style={{marginTop: 5, color: 'grey'}}>
//                             {strings?.company}
//                           </Text>
//                         </View>
//                         <View style={{width: '60%'}}>
//                           <Text
//                             light
//                             type={TEXT_TYPE.EXTRA_SMALL}
//                             style={{marginTop: 5, marginLeft: 10}}>
//                             {item.comp_name}
//                           </Text>
//                         </View>
//                         <TouchableOpacity
//                           onPress={() => {
//                             editDetails(item, index);
//                             sendBtnClickToAnalytics('Edit Work Profile');
//                           }}
//                           style={{width: '10%'}}>
//                           <EditIcon width={20} height={20} />
//                         </TouchableOpacity>
//                       </View>

//                       <View style={{flexDirection: 'row'}}>
//                         <View style={{width: '30%'}}>
//                           <Text
//                             light
//                             type={TEXT_TYPE.EXTRA_SMALL}
//                             style={{marginTop: 5, color: 'grey'}}>
//                             {strings?.location}
//                           </Text>
//                         </View>
//                         <Text
//                           light
//                           type={TEXT_TYPE.EXTRA_SMALL}
//                           style={{marginTop: 5, marginLeft: 10}}>
//                           {item.location_city}
//                         </Text>
//                       </View>
//                       <View style={{flexDirection: 'row'}}>
//                         <View style={{width: '30%'}}>
//                           <Text
//                             light
//                             type={TEXT_TYPE.EXTRA_SMALL}
//                             style={{marginTop: 5, color: 'grey'}}>
//                             {strings?.from}
//                           </Text>
//                         </View>
//                         <Text
//                           light
//                           type={TEXT_TYPE.EXTRA_SMALL}
//                           style={{marginTop: 5, marginLeft: 10}}>
//                           {item.from_dt
//                             ? moment(item.from_dt).format('dddd, Do MMMM')
//                             : null}
//                         </Text>
//                       </View>
//                       <View style={{flexDirection: 'row'}}>
//                         <View style={{width: '30%'}}>
//                           <Text
//                             light
//                             type={TEXT_TYPE.EXTRA_SMALL}
//                             style={{marginTop: 5, color: 'grey'}}>
//                             {strings?.reference}
//                           </Text>
//                         </View>
//                         <Text
//                           light
//                           type={TEXT_TYPE.EXTRA_SMALL}
//                           style={{marginTop: 5, marginLeft: 10}}>
//                           {item.ref_person}
//                         </Text>
//                       </View>
//                       <View style={{flexDirection: 'row'}}>
//                         <View style={{width: '30%'}}>
//                           <Text
//                             light
//                             type={TEXT_TYPE.EXTRA_SMALL}
//                             style={{marginTop: 5, color: 'grey'}}>
//                             {strings?.workRelationship}
//                           </Text>
//                         </View>
//                         <Text
//                           light
//                           type={TEXT_TYPE.EXTRA_SMALL}
//                           style={{marginTop: 5, marginLeft: 10}}>
//                           {item.ref_relation}
//                         </Text>
//                       </View>
//                     </View>
//                   </View>
//                 </View>
//               </View>
//             </SafeAreaView>
//           )}
//         />
//       </View>
//       <Model
//         isVisible={addCompanyDetail}
//         onBackdropPress={() => {
//           setAddCompanyDetail(false);
//         }}
//         overlayStyle={{minHeight: 500}}>
//         <ScrollView>
//           <View
//             style={{
//               margin: 10,
//               padding: 10,
//               // alignItems: 'center',
//               // justifyContent: 'center',
//             }}>
//             <TouchableOpacity
//               style={{alignItems: 'flex-end'}}
//               onPress={() => setAddCompanyDetail(false)}>
//               <CloseIcon width={wp(6)} height={wp(6)} />
//             </TouchableOpacity>
//             <View
//               style={{
//                 alignContent: 'center',
//                 margin: 5,
//               }}>
//               <View
//                 style={{
//                   margin: 5,
//                 }}>
//                 <Text
//                   style={{
//                     fontSize: 14,
//                     color: '#777171',
//                     marginHorizontal: 5,
//                   }}>
//                   {strings?.company}
//                 </Text>
//               </View>

//               <View
//                 style={{
//                   width: '90%',
//                 }}>
//                 <Input
//                   {...companyNameBind}
//                   inputStyle={{
//                     fontSize: 16,
//                     marginHorizontal: 5,
//                     color: '#3D3D3D',
//                   }}
//                   // onSubmitEditing={() => companyRef?.focus()}
//                 />
//               </View>
//             </View>
//             <View
//               style={{
//                 alignContent: 'center',
//                 margin: 5,
//               }}>
//               <View
//                 style={{
//                   margin: 5,
//                 }}>
//                 <Text
//                   style={{
//                     fontSize: 14,
//                     marginHorizontal: 5,
//                     color: '#777171',
//                   }}>
//                   Location
//                 </Text>
//               </View>

//               <View
//                 style={{
//                   width: '90%',
//                 }}>
//                 <Input
//                   {...companyLocationBind}
//                   inputStyle={{
//                     fontSize: 16,
//                     marginHorizontal: 5,
//                     color: '#3D3D3D',
//                   }}
//                   // onSubmitEditing={() => locationRef?.focus()}
//                   inputRef={(ref) => (companyRef = ref)}
//                 />
//               </View>
//             </View>
//             <View
//               style={{
//                 alignContent: 'center',
//                 margin: 5,
//               }}>
//               <View
//                 style={{
//                   margin: 5,
//                 }}>
//                 <Text
//                   style={{
//                     fontSize: 14,
//                     marginHorizontal: 5,
//                     color: '#777171',
//                   }}>
//                   {strings?.reference}
//                 </Text>
//               </View>

//               <View
//                 style={{
//                   width: '90%',
//                 }}>
//                 <Input
//                   {...refPersonBind}
//                   inputStyle={{
//                     fontSize: 16,
//                     marginHorizontal: 5,
//                     color: '#3D3D3D',
//                   }}
//                   // onSubmitEditing={() => ReferenceRef?.focus()}
//                   inputRef={(ref) => (locationRef = ref)}
//                 />
//               </View>
//             </View>
//             <View
//               style={{
//                 alignContent: 'center',
//                 margin: 5,
//               }}>
//               <View
//                 style={{
//                   margin: 5,
//                 }}>
//                 <Text
//                   style={{
//                     fontSize: 14,
//                     marginHorizontal: 5,
//                     color: '#777171',
//                   }}>
//                   {strings?.workReference}
//                 </Text>
//               </View>

//               <View
//                 style={{
//                   width: '90%',
//                 }}>
//                 <Input
//                   {...refRelationBind}
//                   inputStyle={{
//                     fontSize: 16,
//                     marginHorizontal: 5,
//                     color: '#3D3D3D',
//                   }}
//                   inputRef={(ref) => (ReferenceRef = ref)}
//                 />
//               </View>
//             </View>

//             {/* <Date
//               parentFromDate={fromDate}
//               parentToDate={toDate}
//               onSuccessDate={(to, from) => {
//                 setToDate(to);
//                 setFromDate(from);
//               }}
//             /> */}

//             <View style={{width: '100%', padding: 5, margin: 5}}>
//               <Text light style={{color: '#777171'}}>
//                 {strings?.from}
//               </Text>
//               <View style={{flexDirection: 'row', width: '100%'}}>
//                 <View
//                   style={{
//                     flexDirection: 'row',
//                     justifyContent: 'space-between',
//                     borderWidth: 1,
//                     padding: 10,
//                     borderRadius: 5,
//                     borderColor: '#fff',
//                     elevation: 6,
//                     backgroundColor: '#fff',
//                     flex: 0.6,
//                     marginRight: 10,
//                   }}>
//                   <Text light type={TEXT_TYPE.TINY}>
//                     {fromDate ? moment(fromDate).format('DD/MM/YY') : ''}
//                     {/* {moment('2019-01-01').format('DD/MM/YY')} */}
//                   </Text>
//                 </View>
//                 <TouchableOpacity
//                   onPress={() => {
//                     setDateVisible(true);
//                     setCurrentPicker('from');
//                   }}
//                   style={{marginTop: 5}}>
//                   <CalendarIcon
//                     width={20}
//                     height={20}
//                     style={{
//                       alignSelf: 'center',
//                       backgroundColor: '#4B79D8',
//                       padding: 5,
//                     }}
//                     fill={'#fff'}
//                     color={'blue'}
//                   />
//                 </TouchableOpacity>
//               </View>
//               {fromDateError ? (
//                 <Text type={TEXT_TYPE.TINY} style={{color: 'red'}}>
//                   {fromDateError}
//                 </Text>
//               ) : null}
//             </View>
//             <View style={{width: '100%', padding: 5, margin: 5}}>
//               <Text light style={{color: '#777171'}}>
//                 {strings?.to}
//               </Text>
//               <View style={{flexDirection: 'row', width: '100%'}}>
//                 <View
//                   style={{
//                     flexDirection: 'row',
//                     justifyContent: 'space-between',
//                     borderWidth: 1,
//                     padding: 10,
//                     borderRadius: 5,
//                     borderColor: '#fff',
//                     elevation: 6,
//                     backgroundColor: '#fff',
//                     // flex: 1,
//                     flex: 0.6,
//                     marginRight: 10,
//                   }}>
//                   <Text light type={TEXT_TYPE.TINY}>
//                     {/* {moment('2019-01-01').format('DD/MM/YY')} */}
//                     {toDate ? moment(toDate).format('DD/MM/YY') : ''}
//                   </Text>
//                 </View>
//                 <TouchableOpacity
//                   onPress={() => {
//                     setDateVisible(true);
//                     setCurrentPicker('to');
//                   }}
//                   style={{marginTop: 5}}>
//                   <CalendarIcon
//                     width={20}
//                     height={20}
//                     style={{
//                       alignSelf: 'center',
//                       backgroundColor: '#4B79D8',
//                       padding: 5,
//                     }}
//                     fill={'#fff'}
//                     color={'blue'}
//                   />
//                 </TouchableOpacity>
//               </View>
//               {toDateError ? (
//                 <Text type={TEXT_TYPE.TINY} style={{color: 'red'}}>
//                   {toDateError}
//                 </Text>
//               ) : null}
//             </View>
//             <View style={{paddingVertical: 15}}>
//               <Button
//                 buttonStyle={{borderRadius: 10}}
//                 full
//                 title={strings?.done}
//                 loading={companyAddLoading}
//                 onPress={debounce(() => addCompanyData(companyId))}></Button>
//             </View>
//           </View>
//         </ScrollView>
//       </Model>
//       <DateTimePicker
//         isVisible={dateVisible}
//         onConfirm={handleFromDatePicked}
//         maximumDate={new Date()}
//         onCancel={() => {
//           setDateVisible(false);
//         }}
//       />
//     </View>
//   );
// }
