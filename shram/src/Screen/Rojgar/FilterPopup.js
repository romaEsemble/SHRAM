import Input from '@editText/EditText';
import SaveIcon from '@icons/save.svg';
import PopupModal from '@popupModal/PopupModal';
import {TEXT_TYPE} from '@resources/Constants';
import Text from '@textView/TextView';
import React, {Component} from 'react';
import moment from 'moment';
import {TouchableOpacity, View, ScrollView} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import strings from '@resources/Strings';
import {sendBtnClickToAnalytics} from '@utils/Util';

export default class FilterPopup extends Component {
  constructor(props) {
    super(props);
    this.isNewPltdata = true;
    this.state = {
      refresh: false,
    };

    const {
      industry,
      trade,
      location,
      salary_from,
      salary_to,
      job_type,
      shift,
      createdAt,
    } = props.selectedFilter;

    this.trade1 = '';
    this.trade2 = '';
    this.trade3 = '';
    this.location1 = '';
    this.location2 = '';
    this.priceLow = salary_from;
    this.priceHigh = salary_to;
    // this.priceLow = salary_from ? salary_from : '3000';
    // this.priceHigh = salary_to ? salary_to : '5000';

    location &&
      location.forEach((item, index) => {
        if (index === 0) {
          this.location1 = item;
        } else if (index === 1) {
          this.location2 = item;
        }
      });
    trade &&
      trade.forEach((item, index) => {
        if (index === 0) {
          this.trade1 = item;
        } else if (index === 1) {
          this.trade2 = item;
        } else if (index === 2) {
          this.trade3 = item;
        }
      });

    // this.industry = [
    //   {
    //     name: 'Construction',
    //     select: true,
    //     value: 'cons',
    //   },
    //   {
    //     name: 'Retail',
    //     select: false,
    //     value: 'retail',
    //   },
    //   {
    //     name: 'Farming',
    //     select: false,
    //     value: 'farm',
    //   },
    // ];
    // this.industry = [
    //   {
    //     createdAt: '2020-12-29T08:25:38.000Z',
    //     created_by: 'Hardcoded',
    //     is_active: 1,
    //     name: 'Construction',
    //     plt_data_type: 'string',
    //     plt_disp_priority: 1,
    //     plt_name: 'industry',
    //     ptl_id: 2,
    //     select: true,
    //     updatedAt: '2020-12-29T08:25:38.000Z',
    //     updated_by: null,
    //     value: 'cons',
    //   },
    //   {
    //     createdAt: '2020-12-29T08:25:38.000Z',
    //     created_by: 'Hardcoded',
    //     is_active: 1,
    //     name: 'Manufacturing',
    //     plt_data_type: 'string',
    //     plt_disp_priority: 1,
    //     plt_name: 'industry',
    //     ptl_id: 3,
    //     select: false,
    //     updatedAt: '2020-12-29T08:25:38.000Z',
    //     updated_by: null,
    //     value: 'manu',
    //   },
    //   {
    //     createdAt: '2020-12-29T08:25:38.000Z',
    //     created_by: 'Hardcoded',
    //     is_active: 1,
    //     name: 'Logistics',
    //     plt_data_type: 'string',
    //     plt_disp_priority: 1,
    //     plt_name: 'industry',
    //     ptl_id: 4,
    //     select: false,
    //     updatedAt: '2020-12-29T08:25:38.000Z',
    //     updated_by: null,
    //     value: 'logistics',
    //   },
    //   {
    //     createdAt: '2020-12-29T08:25:38.000Z',
    //     created_by: 'Hardcoded',
    //     is_active: 1,
    //     name: 'Hotel/Restaurants',
    //     plt_data_type: 'string',
    //     plt_disp_priority: 1,
    //     plt_name: 'industry',
    //     ptl_id: 5,
    //     select: false,
    //     updatedAt: '2020-12-29T08:25:38.000Z',
    //     updated_by: null,
    //     value: 'hotel/restaurants',
    //   },
    //   {
    //     createdAt: '2021-07-05T19:03:10.000Z',
    //     created_by: 'Hardcoded',
    //     is_active: 1,
    //     name: 'Housekeeing',
    //     plt_data_type: 'string',
    //     plt_disp_priority: 1,
    //     plt_name: 'industry',
    //     ptl_id: 159,
    //     select: false,
    //     updatedAt: '2021-07-05T19:03:10.000Z',
    //     updated_by: '',
    //     value: 'housekeeping',
    //   },
    // ];
    this.industry = this.returnData();
    this.jobType = [
      {
        name: 'Contract',
        select: false,
      },
      {
        name: 'Permanent',
        select: true,
      },
    ];
    this.shiftTime = [
      {
        name: 'Morning',
        select: true,
      },
      {
        name: 'Evening',
        select: false,
      },
      {
        name: 'Night',
        select: false,
      },
    ];
    this.postedOn = [
      {
        name: '1 Week',
        select: true,
      },
      {
        name: '2 Weeks',
        select: false,
      },
      {
        name: '1 Month',
        select: false,
      },
    ];

    industry &&
      industry.length > 0 &&
      this.industry.forEach((item, index) => {
        // const value = index + 1;
        const value = item.value;
        item.select = industry.includes(value);
        console.log(
          'Industry val vs index',
          industry,
          value,
          item.select,
          industry.includes(value),
        );
      });
    job_type &&
      this.jobType.forEach((item, index) => {
        const value = index + 1;
        item.select = job_type === value;
        console.log(
          'Job val vs index',
          job_type,
          value,
          item.select,
          job_type,
          job_type === value,
        );
      });
    shift &&
      this.shiftTime.forEach((item, index) => {
        const value = index + 1;
        item.select = shift === value;
      });
    createdAt &&
      this.postedOn.forEach((item, index) => {
        item.select = false;
        if (
          index === 0 &&
          moment().subtract(7, 'd').format('YYYY-MM-DD') === createdAt
        ) {
          item.select = true;
        } else if (
          index === 1 &&
          moment().subtract(14, 'd').format('YYYY-MM-DD') === createdAt
        ) {
          item.select = true;
        } else if (
          index === 2 &&
          moment().subtract(30, 'd').format('YYYY-MM-DD') === createdAt
        ) {
          item.select = true;
        }
      });
  }

  refreshScreen() {
    this.setState((prev) => ({refresh: !prev.refresh}));
  }

  selButton = (title, type) => {
    let isSelected = false;
    let value;
    if (type === 'INDUSTRY') {
      value = this.industry.filter((item) => item.name === title);
      // console.log('Sel buttn', value);
    } else if (type === 'JOB') {
      value = this.jobType.filter((item) => item.name === title);
    } else if (type === 'SHIFT') {
      value = this.shiftTime.filter((item) => item.name === title);
    } else if (type === 'POST') {
      value = this.postedOn.filter((item) => item.name === title);
    }
    if (value?.length > 0) {
      isSelected = value[0].select;
    }

    return (
      <TouchableOpacity
        onPress={() => {
          if (type === 'INDUSTRY') {
            value = this.industry.filter((item) => item.name === title);
            this.industry.forEach((item) => {
              item.select = false;
            });
            console.log('Value on click', value);
          } else if (type === 'JOB') {
            value = this.jobType.filter((item) => item.name === title);
            this.jobType.forEach((item) => {
              item.select = false;
            });
          } else if (type === 'SHIFT') {
            value = this.shiftTime.filter((item) => item.name === title);
            this.shiftTime.forEach((item) => {
              item.select = false;
            });
          } else if (type === 'POST') {
            value = this.postedOn.filter((item) => item.name === title);
            this.postedOn.forEach((item) => {
              item.select = false;
            });
          }
          if (value?.length > 0) {
            value[0].select = true;
          }
          console.log('Value after slection', value, this.industry);
          this.refreshScreen();
        }}>
        <View
          style={{
            borderColor: '#4b79d8',
            borderWidth: 1,
            backgroundColor: isSelected ? '#4b79d8' : '#F1F9FF',
            paddingHorizontal: wp(3),
            borderRadius: wp(1),
            marginHorizontal: wp(1),
            paddingVertical: wp(1.5),
          }}>
          <Text
            bold
            type={TEXT_TYPE.EXTRA_SMALL}
            style={{color: isSelected ? '#FFF' : '#4b79d8', fontSize: 11}}>
            {title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  onPressSave = (isClear) => {
    if (isClear) {
      this.props.onSuccess({});
      sendBtnClickToAnalytics('Clear Filter');
    } else {
      const trade = [];
      if (this.trade1 !== '') {
        trade.push(this.trade1);
      }
      if (this.trade2 !== '') {
        trade.push(this.trade2);
      }
      if (this.trade3 !== '') {
        trade.push(this.trade3);
      }

      const location = [];
      if (this.location1 !== '') {
        location.push(this.location1);
      }
      if (this.location2 !== '') {
        location.push(this.location2);
      }

      const industry = [];
      this.industry.forEach((item, index) => {
        if (item.select) {
          industry.push(item.value);
        }
      });
      console.log('Industry after save', this.industry);
      let jobType = 0;
      this.jobType.forEach((item, index) => {
        if (item.select) {
          jobType = index + 1;
        }
      });
      let shift = 0;
      this.shiftTime.forEach((item, index) => {
        if (item.select) {
          shift = index + 1;
        }
      });

      let postedOn = 0;
      this.postedOn.forEach((item, index) => {
        if (item.select) {
          postedOn =
            item.name === '1 Week'
              ? moment().subtract(7, 'd').format('YYYY-MM-DD')
              : item.name === '2 Weeks'
              ? moment().subtract(14, 'd').format('YYYY-MM-DD')
              : moment().subtract(30, 'd').format('YYYY-MM-DD');
        }
      });

      this.props.onSuccess({
        industry,
        trade,
        location,
        salary_from: this.priceLow,
        salary_to: this.priceHigh,
        job_type: jobType,
        shift,
        createdAt: postedOn,
      });
      sendBtnClickToAnalytics('Apply Filter', {
        industry,
        trade,
        location,
        salary_from: this.priceLow,
        salary_to: this.priceHigh,
        job_type: jobType,
        shift,
        createdAt: postedOn,
      });
    }
  };

  industryView() {
    console.log('industry Project', this.industry);
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: hp(2),
        }}>
        <Text bold type={TEXT_TYPE.EXTRA_SMALL} style={{marginRight: 20}}>
          {strings?.industry}
        </Text>
        <ScrollView horizontal={true}>
          {this.industry.map((item) => {
            return this.selButton(item.name, 'INDUSTRY');
          })}
        </ScrollView>
      </View>
    );
  }

  tradeView() {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: hp(2),
        }}>
        <Text bold type={TEXT_TYPE.EXTRA_SMALL} style={{marginRight: wp(2)}}>
          {strings?.trade}
        </Text>
        <Input
          placeholderTextColor={'#00000029'}
          text={'Mason'}
          noBox
          style={{width: wp(22)}}
          value={this.trade1}
          onChange={(input) => {
            this.trade1 = input;
            this.refreshScreen();
          }}
          inputStyle={{fontSize: 14, color: '#3D3D3D'}}
        />
        <Input
          placeholderTextColor={'#00000029'}
          text={'Tile Mason'}
          noBox
          style={{width: wp(22)}}
          value={this.trade2}
          onChange={(input) => {
            this.trade2 = input;
            this.refreshScreen();
          }}
          inputStyle={{fontSize: 14, color: '#3D3D3D'}}
        />
        <Input
          placeholderTextColor={'#00000029'}
          // text={'Mason'}
          noBox
          style={{width: wp(22)}}
          value={this.trade3}
          onChange={(input) => {
            this.trade3 = input;
            this.refreshScreen();
          }}
          inputStyle={{fontSize: 14, color: '#3D3D3D'}}
        />
      </View>
    );
  }

  locationView() {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text bold type={TEXT_TYPE.EXTRA_SMALL} style={{marginRight: wp(2)}}>
          {strings?.location}
        </Text>
        <Input
          placeholderTextColor={'#00000029'}
          text={'Mumbai'}
          noBox
          style={{width: wp(30)}}
          value={this.location1}
          onChange={(input) => {
            this.location1 = input;
            this.refreshScreen();
          }}
          inputStyle={{fontSize: 14, marginHorizontal: 5, color: '#3D3D3D'}}
        />
        <Input
          noBox
          placeholderTextColor={'#00000029'}
          value={this.location2}
          style={{width: wp(30)}}
          onChange={(input) => {
            this.location2 = input;
            this.refreshScreen();
          }}
          inputStyle={{fontSize: 14, marginHorizontal: 5, color: '#3D3D3D'}}
        />
      </View>
    );
  }

  payRangeView() {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text bold type={TEXT_TYPE.EXTRA_SMALL} style={{marginRight: hp(2)}}>
          PAY RANGE
        </Text>
        <Input
          placeholderTextColor={'#00000029'}
          text={'Min Price'}
          noBox
          style={{width: wp(30)}}
          value={this.priceLow}
          onChange={(input) => {
            this.priceLow = input;
            this.refreshScreen();
          }}
          inputStyle={{fontSize: 14, marginHorizontal: 5, color: '#3D3D3D'}}
        />
        <Input
          placeholderTextColor={'#00000029'}
          value={this.priceHigh}
          text={'Max Price'}
          noBox
          style={{width: wp(30)}}
          onChange={(input) => {
            this.priceHigh = input;
            this.refreshScreen();
          }}
          inputStyle={{fontSize: 14, marginHorizontal: 5, color: '#3D3D3D'}}
        />
      </View>
    );
  }

  jobTypeView() {
    console.log('Job data', this.jobType);
    return (
      <>
        <Text bold type={TEXT_TYPE.EXTRA_SMALL} style={{marginTop: hp(1)}}>
          {strings?.jobType}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: hp(1),
          }}>
          {this.jobType.map((item) => {
            return this.selButton(item.name, 'JOB');
          })}
        </View>
      </>
    );
  }

  shiftTimingView() {
    return (
      <>
        <Text bold type={TEXT_TYPE.EXTRA_SMALL} style={{marginTop: hp(2)}}>
          {strings?.shiftTiming}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: hp(1),
          }}>
          {this.shiftTime.map((item) => {
            return this.selButton(item.name, 'SHIFT');
          })}
        </View>
      </>
    );
  }

  returnData = () => {
    const {onClose, pltData} = this.props;

    const newArrayOfObj = pltData.map(
      ({plt_disp_val: name, plt_val: value, ...rest}) => ({
        name,
        value,
        ...rest,
      }),
    );
    var result = newArrayOfObj.map(function (el) {
      var o = Object.assign({}, el);
      o.select = false;
      return o;
    });
    // this.industry = result;
    result[0].select = true;
    console.log(result);
    // console.log('New PLt data', pltData);
    return result;
  };
  postedOnView() {
    return (
      <>
        <Text bold type={TEXT_TYPE.EXTRA_SMALL} style={{marginTop: hp(2)}}>
          {strings?.postedOn}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: hp(1),
          }}>
          {this.postedOn.map((item) => {
            return this.selButton(item.name, 'POST');
          })}
        </View>
      </>
    );
  }

  render() {
    const {onClose} = this.props;
    return (
      <PopupModal onBackdropPress={onClose}>
        <View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text light type={TEXT_TYPE.MEDIUM} style={{marginTop: 5, flex: 1}}>
              {strings?.jobFilter}
            </Text>
            <TouchableOpacity onPress={() => this.onPressSave(true)}>
              <Text style={{marginRight: 10}}>Clear Filters</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.onPressSave(false)}>
              <SaveIcon width={wp(6)} height={wp(6)} />
            </TouchableOpacity>
          </View>
          {this.industryView()}
          {this.tradeView()}
          {this.locationView()}
          {this.payRangeView()}
          {this.jobTypeView()}
          {this.shiftTimingView()}
          {this.postedOnView()}
        </View>
      </PopupModal>
    );
  }
}
