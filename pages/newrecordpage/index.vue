<template>
  <u--form class="container">
    <view class="uni-form-item uni-column">
      <view class="title">金额</view>
      <input class="uni-input" type="digit" placeholder="0.00" v-model="money" confirm-type="done" @input="checkMoney" />
    </view>
    <view class="uni-form-item uni-column">
      <view class="summary">哪去了</view>
      <input class="uni-input" type="text" placeholder="哪去了" v-model="summary" confirm-type="done" />
    </view>
    <view class="uni-form-item uni-column">
      <view class="title">项目</view>
      <u-picker :show="projectShow" :columns="[projectName]" closeOnClickOverlay @close="projectClose" @confirm="projectConfirm" @cancel="pickerCancel"></u-picker>
      <u-cell-group><u-cell :title="currentProjectName" @click="projectShow = true" class="picker-cell"></u-cell></u-cell-group>
      <!-- <picker :value="projectNameIndex" :range="projectName" @change="bindProjectNameChange">
        <view class="uni-input">{{ projectName[projectNameIndex] }}</view>
      </picker> -->
    </view>

    <view class="uni-form-item uni-column">
      <view class="title">是否已报销</view>
      <u-picker :show="reimedShow" :columns="[ReimedSelector]" closeOnClickOverlay @close="reimedClose" @confirm="reimedConfirm" @cancel="pickerCancel"></u-picker>
      <u-cell-group><u-cell :title="currentReimed" @click="reimedShow = true" class="picker-cell"></u-cell></u-cell-group>
      <!--      <picker :value="reimedIndex" :range="ReimedSelector" @change="bindReimedChange">
        <view class="uni-input">{{ ReimedSelector[reimedIndex] }}</view>
      </picker> -->
    </view>

    <view class="uni-form-item uni-column">
      <view class="title">是否电子票</view>
      <u-picker
        :show="electricTicketShow"
        :columns="[electricTicket]"
        closeOnClickOverlay
        @close="electricTicketClose"
        @confirm="electricTicketConfirm"
        @cancel="pickerCancel"
      ></u-picker>
      <u-cell-group><u-cell :title="currentElectricTicket" @click="electricTicketShow = true" class="picker-cell"></u-cell></u-cell-group>
      <!--      <picker :value="electricTicketIndex" :range="electricTicket" @change="bindElectricChange">
        <view class="uni-input">{{ electricTicket[electricTicketIndex] }}</view>
      </picker> -->
    </view>

    <view class="uni-form-item uni-column">
      <view class="title">是否需要替票</view>
      <u-picker
        :show="replaceTicketShow"
        :columns="[replaceTicket]"
        closeOnClickOverlay
        @close="replaceTicketClose"
        @confirm="replaceTicketConfirm"
        @cancel="pickerCancel"
      ></u-picker>
      <u-cell-group><u-cell :title="currentReplaceTicket" @click="replaceTicketShow = true" class="picker-cell"></u-cell></u-cell-group>
      <!--      <picker :value="replaceTicketIndex" :range="replaceTicket" @change="bindReplaceTicketChange">
        <view class="uni-input">{{ replaceTicket[replaceTicketIndex] }}</view>
      </picker> -->
    </view>

    <view class="uni-form-item uni-column">
      <view class="title">发生时间</view>
      <u-datetime-picker
        :show="dateShow"
        v-model="dateSelector"
        mode="date"
        :formatter="dateFormatter"
        ref="datePicker"
        @cancel="pickerCancel"
        @close="dateClose"
        @confirm="dateConfirm"
      ></u-datetime-picker>
      <u-cell-group><u-cell :title="currentDate" @click="dateShow = true" class="picker-cell"></u-cell></u-cell-group>
      <!-- <picker mode="date" style="background: #fff; padding: 4px;" :value="dateSelector" @change="bindDateChange">
        <uni-dateformat class="uni-input" :date="dateSelector" format="yyyy-MM-dd"></uni-dateformat>
      </picker> -->
    </view>

    <view class="uni-form-item uni-column">
      <u-button type="primary" @click="addRecord" class="primary-button">欧了</u-button>
      <u-button @click="onNavigateBack">算了</u-button>
    </view>
  </u--form>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { uuidv4 } from '@/common/util.js';

Date.prototype.Format = function(fmt) {
  //author: meizz
  var o = {
    'M+': this.getMonth() + 1, //月份
    'd+': this.getDate(), //日
    'h+': this.getHours(), //小时
    'm+': this.getMinutes(), //分
    's+': this.getSeconds(), //秒
    'q+': Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  for (var k in o) if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
  return fmt;
};

export default {
  mounted() {
    this.initPage();
  },
  components: {},
  onReady() {
    this.$refs.datePicker.setFormatter(this.dateFormatter);
  },
  onLoad(option) {
    let that = this;
    if (option.item) {
      try {
        const item = JSON.parse(decodeURIComponent(option.item));
        console.log(item);
        this.projectNameIndex = this.projectName.indexOf(item.project_name);
        this.currentProjectName = this.projectNameIndex >= 0 ? item.project_name : '选择项目';
        this.id = item._id;
        this.electricTicketIndex = item.electric;
        this.reimedIndex = item.reimed;
        this.selectorChecked = item.project_name;
        this.money = item.money;
        this.replaceTicketIndex = item.need_replace_ticket;
        this.dateSelector = item.date;
        this.summary = item.summary;
        this.userId = item.user_id;
      } catch (e) {
        console.error(e);
      }
    }

    if (option.userId) {
      this.userId = option.userId;
      console.log('User Id', this.userId);
    }
    if (this.userId) {
      if (this.uniDb) {
        this.uniDb
          .collection('project_list')
          .where({
            user_id: this.userId
          })
          .get()
          .then(res => {
            console.log('project list', res);
            if (res.result) {
              let projectList = res.result.data;
              for (let i = 0; i < projectList.length; i++) {
                that.projectName.push(projectList[i].project_name);
              }
              if (option.item) {
                const item = JSON.parse(decodeURIComponent(option.item));
                that.projectNameIndex = that.projectName.indexOf(item.project_name);
                that.currentProjectName = that.projectNameIndex >= 0 ? item.project_name : '选择项目';
              }
            } else {
              uni.showToast({
                title: '查询项目列表失败: ' + res.result.message,
                icon: 'none'
              });
            }
          })
          .catch(err => {
            console.error(err);
            uni.showToast({
              title: '查询项目列表失败: ' + err.message,
              icon: 'none'
            });
          });
      }
    }
  },
  computed: mapState(['uniDb']),
  data() {
    return {
      projectName: [], // 项目
      projectNameIndex: 0,
      currentProjectName: '选择项目',
      projectShow: false,

      replaceTicketShow: false,
      replaceTicket: ['否', '是'], // 替票
      currentReplaceTicket: '否',
      replaceTicketIndex: 0,

      electricTicketShow: false,
      electricTicket: ['否', '是'], // 电子票
      electricTicketIndex: 0,
      currentElectricTicket: '否',

      reimedShow: false,
      currentReimed: '否',
      ReimedSelector: ['否', '是'], // 报销
      reimedIndex: 0,

      dateShow: false,
      dateSelector: Number(new Date()), // 日期
      currentDate: new Date().Format('yyyy-MM-dd'),

      id: null,
      money: null,
      summary: null,
      userId: null
    };
  },
  methods: {
    async initPage() {},
    pickerCancel() {
      this.projectShow = false;
      this.replaceTicketShow = false;
      this.electricTicketShow = false;
      this.reimedShow = false;
      this.dateShow = false;
    },
    projectClose() {
      this.projectShow = false;
    },
    projectChange(e) {
      console.log(e);
    },
    projectConfirm(e) {
      console.log(e);
      this.projectNameIndex = e.indexs && e.indexs[0] > -1 ? e.indexs[0] : -1;
      this.currentProjectName = e.value && e.value[0] ? e.value[0] : '选择项目';
      this.projectShow = false;
    },
    replaceTicketClose() {
      this.replaceTicketShow = false;
    },
    replaceTicketChange(e) {},
    replaceTicketConfirm(e) {
      this.replaceTicketIndex = e.indexs && e.indexs[0] > -1 ? e.indexs[0] : -1;
      this.currentReplaceTicket = e.value && e.value[0] ? e.value[0] : '否';
      this.replaceTicketShow = false;
    },
    electricTicketClose() {
      this.replaceTicketShow = false;
    },
    electricTicketChange(e) {},
    electricTicketConfirm(e) {
      this.electricTicketIndex = e.indexs && e.indexs[0] > -1 ? e.indexs[0] : -1;
      this.currentElectricTicket = e.value && e.value[0] ? e.value[0] : '否';
      this.electricTicketShow = false;
    },
    reimedClose() {
      this.reimedShow = false;
    },
    reimedChange(e) {},
    reimedConfirm(e) {
      this.reimedIndex = e.indexs && e.indexs[0] > -1 ? e.indexs[0] : -1;
      this.currentReimed = e.value && e.value[0] ? e.value[0] : '否';
      this.reimedShow = false;
    },
    dateClose() {
      this.dateShow = false;
    },
    dateConfirm(e) {
      console.log(e, new Date(e.value));
      this.dateSelector = e.value;
      this.currentDate = new Date(e.value).Format('yyyy-MM-dd');
      this.dateShow = false;
    },
    dateFormatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      }
      if (type === 'month') {
        return `${value}月`;
      }
      if (type === 'day') {
        return `${value}日`;
      }
      return value;
    },
    checkMoney(e) {
      let that = this;
      let money = e.detail.value;
      let maxLength = money.indexOf('.');
      if (money.indexOf('.') < 0 && money != '') {
        money = parseFloat(money);
      } else if (money.indexOf('.') == 0) {
        //'首位小数点情况'
        money = money.replace(/[^$#$]/g, '0.');
        money = money.replace(/\.{2,}/g, '.');
      } else if (!/^(\d?)+(\.\d{0,2})?$/.test(money)) {
        //去掉最后一位
        money = money.substring(0, money.length - 1);
      }
      that.$nextTick(function() {
        that.money = money;
      });
    },
    bindProjectNameChange(e) {
      this.projectNameIndex = e.target.value;
    },
    bindReimedChange(e) {
      this.reimedIndex = e.target.value;
    },
    bindElectricChange(e) {
      this.electricTicketIndex = e.target.value;
    },
    bindReplaceTicketChange(e) {
      this.replaceTicketIndex = e.target.value;
    },
    bindDateChange(e) {
      console.log(e);
      this.dateSelector = e.target.value;
    },
    onNavigateBack() {
      uni.navigateBack({
        delta: 1
      });
    },
    addRecord(e) {
      if (this.money <= 0.0) {
        uni.showToast({
          title: '保存记录失败: 金额不能小于等于0',
          icon: 'none'
        });
        return;
      }

      if (!this.projectName[this.projectNameIndex] || this.currentProjectName === '选择项目') {
        uni.showToast({
          title: '保存记录失败: 所属项目未选择',
          icon: 'none'
        });
        return;
      }

      const record = {
        project_name: this.projectName[this.projectNameIndex],
        reimed: parseInt(this.reimedIndex),
        money: parseFloat(this.money),
        electric: parseInt(this.electricTicketIndex),
        need_replace_ticket: parseInt(this.replaceTicketIndex),
        date: new Date(this.dateSelector),
        summary: this.summary,
        user_id: this.userId
      };

      let that = this;
      if (this.uniDb) {
        if (this.id) {
          that.uniDb
            .collection('records')
            .doc(this.id)
            .update(record)
            .then(res => {
              if (res.result) {
                uni.navigateBack({
                  delta: 1
                });
                uni.$emit('ADD_RECORD_SUCCESS', record);
              } else {
                uni.showToast({
                  title: '保存记录失败: ' + res.result.message,
                  icon: 'none'
                });
              }
            })
            .catch(err => {
              console.error(err);
              uni.showToast({
                title: '保存记录失败: ' + err.message,
                icon: 'none'
              });
            });
        } else {
          this.uniDb
            .collection('records')
            .add(record)
            .then(res => {
              if (res.result) {
                uni.navigateBack({
                  delta: 1
                });
                uni.$emit('ADD_RECORD_SUCCESS', record);
              } else {
                uni.showToast({
                  title: '保存记录失败: ' + res.result.message,
                  icon: 'none'
                });
              }
            })
            .catch(err => {
              console.error(err);
              uni.showToast({
                title: '保存记录失败: ' + err.message,
                icon: 'none'
              });
            });
        }
      }
    }
  }
};
</script>

<style lang="scss">
@import '@/uni_modules/uview-ui/index.scss';
.uni-form-item.uni-column .u-cell {
  background-color: #fff !important;
}
</style>

<style scoped>
.uni-form-item {
  width: 100%;
  padding: 3px 0;
}

.uni-form-item .title {
  padding: 5px 14px;
  color: #999;
}

.uni-form-item .summary {
  padding: 5px 14px;
}

.uni-input {
  height: 28px;
  padding: 8px 14px;
  line-height: 28px;
  font-size: 15px;
  background: #fff;
  flex: 1;
}
</style>
