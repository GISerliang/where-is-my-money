<template>
  <view class="container">
    <uni-section class="unreimed-section" title="未报销" type="line"></uni-section>
    <uni-swipe-action>
      <uni-swipe-action-item
        class="unreimed-swipe-action-item"
        :right-options="unreimedOptions"
        :left-options="deleteOptions"
        v-for="(item, index) in unreimedItems"
        :key="item._id"
        autoClose="true"
        @click="onActionUnreimedItemClick($event, item)"
      >
        <uni-list-item
          class="unreimed-list-item unreimed-view"
          show-arrow="false"
          :title="item.money.toFixed(2) + '-' + item.summary"
          :note="item.project_name + ' ' + new Date(item.date).Format('yyyy-MM-dd')"
          clickable
          @click="onItemTap(index, item, 'unreimed')"
        ></uni-list-item>
      </uni-swipe-action-item>
    </uni-swipe-action>

    <uni-section title="已报销" type="line"></uni-section>
    <uni-swipe-action>
      <uni-swipe-action-item
        class="reimed-swipe-action-item"
        :left-options="deleteOptions"
        :right-options="reimedOptions"
        v-for="(item, index) in reimedItems"
        :key="item._id"
        autoClose="true"
        @click="onActionReimedItemClick($event, item)"
      >
        <uni-list-item
          class="reimed-list-item reimed-view"
          show-arrow="false"
          :title="item.money.toFixed(2) + '-' + item.summary"
          :note="item.project_name + ' ' + new Date(item.date).Format('yyyy-MM-dd')"
          clickable
          @click="onItemTap(index, item, 'reimed')"
        ></uni-list-item>
      </uni-swipe-action-item>
    </uni-swipe-action>

    <view class="uni-form-item uni-column">
      <u-button type="primary" class="primary-button" @click="addRecord">
        <Text>+</Text>
        记一下
      </u-button>
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import loginUser from '../../../common/currentUser.js';

export default {
  async onLoad(options) {
    let that = this;

    this.userInfo = await loginUser.login();

    const is_login = uni.getStorageSync('is_login');
    console.log('is_login', is_login);
    if (!is_login) {
      this.userInfo = {
        nickName: '微信用户',
        avatarUrl: '',
        gender: 0,
        country: '',
        province: '',
        city: ''
      };
    }
    this.setUserInfo(this.userInfo);
    // this.$store.commit('userInfo', this.userInfo);
    console.log('Record page', this.userInfo);

    uni.$on('LOGIN_CHANGED', () => {
      console.log('login changed');
      that.getData();
    });

    this.getData();
    uni.$on('ADD_RECORD_SUCCESS', function(record) {
      that.getData();
    });
  },
  onPullDownRefresh() {
    console.log('refresh');
    let that = this;
    if (that.$store.state.userInfo && that.$store.state.userInfo._id) {
      uni.showNavigationBarLoading();
      this.getData();
      setTimeout(() => {
        uni.hideNavigationBarLoading();
        uni.stopPullDownRefresh();
      }, 1000);
    } else {
      uni.stopPullDownRefresh();
      uni.showToast({
        title: '请您先登录小程序',
        icon: 'none'
      });
      return;
    }
  },
  mounted() {},
  computed: {
    ...mapState(['uniDb'])
  },
  data() {
    return {
      pretimestamp: new Date().valueOf(),
      unreimedItems: [],
      reimedItems: [],
      deleteOptions: [
        {
          text: '删除',
          style: {
            backgroundColor: '#dd524d'
          }
        }
      ],
      unreimedOptions: [
        {
          text: '取消',
          style: {
            backgroundColor: '#007aff'
          }
        },
        {
          text: '已报',
          style: {
            backgroundColor: '#dd524d'
          }
        }
      ],
      reimedOptions: [
        {
          text: '取消',
          style: {
            backgroundColor: '#007aff'
          }
        },
        {
          text: '未报',
          style: {
            backgroundColor: '#dd524d'
          }
        }
      ]
    };
  },
  methods: {
    ...mapMutations(['setUserInfo', 'getUserInfo']),
    addRecord(e) {
      let that = this;
      if (that.$store.state.userInfo && that.$store.state.userInfo._id) {
        uni.navigateTo({
          url: '../../newrecordpage/index?userId=' + that.$store.state.userInfo._id
        });
      } else {
        uni.showToast({
          title: '请您先登录小程序',
          icon: 'none'
        });
      }
    },
    onActionReimedItemClick(e, item) {
      let currenttimestamp = new Date().valueOf();
      if (Math.abs(this.pretimestamp - currenttimestamp) < 200) {
        return;
      }
      this.pretimestamp = currenttimestamp;

      let that = this;
      let { content } = e;
      if (content.text === '删除') {
        uni.showModal({
          title: '提示',
          content: '是否删除该记录',
          cancelText: '取消删除',
          confirmText: '确定删除',
          success: res => {
            if (res.confirm) {
              if (that.uniDb) {
                that.uniDb
                  .collection('records')
                  .doc(item._id)
                  .remove()
                  .then(res => {
                    that.getReimedData();
                  })
                  .catch(err => {
                    console.log(err);
                    uni.showToast({
                      title: '删除记录失败: ' + err.message,
                      icon: 'none'
                    });
                  });
              }
            }
          }
        });
      } else if (content.text === '未报') {
        uni.showModal({
          title: '提示',
          content: '是否更改该记录状态',
          cancelText: '取消更改',
          confirmText: '确定更改',
          success: res => {
            if (res.confirm) {
              if (that.uniDb) {
                let convert_item = JSON.parse(JSON.stringify(item));
                convert_item.reimed = 0;
                let id = convert_item._id;
                convert_item.date = new Date(convert_item.date);
                delete convert_item['_id'];
                that.uniDb
                  .collection('records')
                  .doc(id)
                  .update(convert_item)
                  .then(res => {
                    that.getData();
                  })
                  .catch(err => {
                    console.log(err);
                    uni.showToast({
                      title: '更新记录失败: ' + err.message,
                      icon: 'none'
                    });
                  });
              }
            }
          }
        });
      }
    },
    onActionUnreimedItemClick(e, item) {
      let currenttimestamp = new Date().valueOf();
      if (Math.abs(this.pretimestamp - currenttimestamp) < 200) {
        // 事件会被触发两次（原因未知，可能和嵌套显示有关系），根据时间差过滤
        return;
      }
      this.pretimestamp = currenttimestamp;

      let that = this;
      let { content } = e;
      if (content.text === '删除') {
        uni.showModal({
          title: '提示',
          content: '是否删除该记录',
          cancelText: '取消删除',
          confirmText: '确定删除',
          success: res => {
            if (res.confirm) {
              if (that.uniDb) {
                that.uniDb
                  .collection('records')
                  .doc(item._id)
                  .remove()
                  .then(res => {
                    that.getUnreimedData();
                  })
                  .catch(err => {
                    console.log(err);
                    uni.showToast({
                      title: '删除记录失败: ' + err.message,
                      icon: 'none'
                    });
                  });
              }
            }
          }
        });
      } else if (content.text === '已报') {
        uni.showModal({
          title: '提示',
          content: '是否更改该记录状态',
          cancelText: '取消更改',
          confirmText: '确定更改',
          success: res => {
            if (res.confirm) {
              if (that.uniDb) {
                let convert_item = JSON.parse(JSON.stringify(item));
                convert_item.reimed = 1;
                let id = convert_item._id;
                convert_item.date = new Date(convert_item.date);
                delete convert_item['_id'];
                that.uniDb
                  .collection('records')
                  .doc(id)
                  .update(convert_item)
                  .then(res => {
                    that.getData();
                  })
                  .catch(err => {
                    console.log(err);
                    uni.showToast({
                      title: '更新记录失败: ' + err.message,
                      icon: 'none'
                    });
                  });
              }
            }
          }
        });
      }
    },
    onItemTap(index, item, type) {
      let that = this;
      if (item && that.$store.state.userInfo) {
        console.log(index, item);
        uni.navigateTo({
          url: '../../newrecordpage/index?item=' + encodeURIComponent(JSON.stringify(item))
        });
      }
    },
    getUnreimedData() {
      let that = this;
      if (this.uniDb && that.$store.state.userInfo && that.$store.state.userInfo._id) {
        this.uniDb
          .collection('records')
          .where({
            reimed: 0,
            user_id: that.$store.state.userInfo._id
          })
          .orderBy('date', 'desc')
          .get()
          .then(res => {
            console.log('search unreimed', res);
            if (res.result) {
              that.unreimedItems = res.result.data;
            } else {
              uni.showToast({
                title: '查询未报销失败: ' + res.result.message,
                icon: 'none'
              });
            }
          })
          .catch(err => {
            console.error(err);
            uni.showToast({
              title: '查询未报销失败: ' + err.message,
              icon: 'none'
            });
          });
      }
    },
    getReimedData() {
      let that = this;
      if (this.uniDb && that.$store.state.userInfo && that.$store.state.userInfo._id) {
        this.uniDb
          .collection('records')
          .where({
            reimed: 1,
            user_id: that.$store.state.userInfo._id
          })
          .orderBy('date', 'desc')
          .get()
          .then(res => {
            console.log('search reimed', res);
            if (res.result) {
              that.reimedItems = res.result.data;
            } else {
              uni.showToast({
                title: '查询已报销失败: ' + res.result.message,
                icon: 'none'
              });
            }
          })
          .catch(err => {
            console.error(err);
            uni.showToast({
              title: '查询已报销失败: ' + err.message,
              icon: 'none'
            });
          });
      }
    },
    getData() {
      this.reimedItems = [];
      this.unreimedItems = [];
      this.getReimedData();
      this.getUnreimedData();
    }
  }
};
</script>

<style>
.uni-form-item .u-button {
  position: absolute !important;
  bottom: 0;
  width: 100%;
}
</style>

<style scoped>
@font-face {
  font-family: uniicons;
  font-weight: normal;
  font-style: normal;
  src: url('~@/static/uni.ttf') format('truetype');
}

page {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background-color: #efeff4;
  min-height: 100%;
  height: auto;
}

view {
  font-size: 14px;
  line-height: inherit;
}

uni-section {
  text-align: left;
}

uni-section .line {
  height: 20px;
  background-color: #6190e8 !important;
}

uni-list-item {
  height: 45px;
}

uni-swipe-action-item {
  border-bottom-color: #f5f5f5;
  border-bottom-width: 1px;
  border-bottom-style: solid;
}

.reimed-view,
.unreimed-view,
.reimed-list,
.reimed-list-item,
.unreimed-list-item {
  width: 100%;
  text-align: left;
}

.cont {
  flex: 1;
  height: 45px;
  line-height: 45px;
  padding: 0 15px;
  position: relative;
  background-color: #fff;
  font-size: 15px;
}

.sub-cont {
  flex: 1;
  height: 25px;
  line-height: 25px;
  padding: 0 20px;
  position: relative;
  background-color: #fff;
  font-size: 12px;
}

.primary-button {
  position: absolute !important;
  bottom: 0;
  width: 100%;
}
</style>
