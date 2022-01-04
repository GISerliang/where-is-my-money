<template>
  <view class="container">
    <view slot="contentSection">
      <view style="text-align: left;background-color: #fff;padding-bottom: 10rpx; padding-top: 10rpx; display: flex; align-items: center;" class="user-container">
        <view @click="updateUserProfile" style="display: flex; align-items: center; margin-right: 10px;">
          <u--image
            :src="userInfo.avatarUrl && userInfo.avatarUrl !== '' ? userInfo.avatarUrl : '/static/user.png'"
            mode="widthFix"
            shape="circle"
            width="80px"
            height="80px"
            style="width:80px;height:80px; border-radius: 40px;background-color: #8F8F94; margin-left: 10rpx; border: #fff 1px solid;"
          ></u--image>
          <view style="padding-left: 10rpx;">{{ userInfo.nickName }}</view>
        </view>
        <u-button :type="userInfo.nickName && userInfo.nickName != '微信用户' ? 'error' : 'primary'" @click="userClicked" size="mini" style="margin-right: 10px;">
          {{ userInfo.nickName && userInfo.nickName != '微信用户' ? '退出登录' : '点击登录' }}
        </u-button>
        <!-- <view><text class="user-tag" style="background-color: #3aa64e;">同步微信信息</text></view> -->
      </view>
      <view style="width: 100%;background:#F2F2F2,display:''; margin-top: 10rpx;">
        <!--        <u-grid :border="true" @click="gridClicked">
          <u-grid-item v-for="(baseListItem, baseListIndex) in baseList" :key="baseListIndex">
            <u-icon :customStyle="{ paddingTop: 20 + 'rpx' }" :name="baseListItem.name" :size="22"></u-icon>
            <text class="grid-text">{{ baseListItem.title }}</text>
          </u-grid-item>
        </u-grid> -->
        <u-cell-group>
          <u-cell title="项目列表" @click="projectListClicked" :isLink="true" arrow-direction="right"></u-cell>
          <!-- <u-cell title="开启订阅通知" @click="openSubscribeMessageClicked" :isLink="true" arrow-direction="right"></u-cell> -->
          <u-cell title="关于" url="/pages/about/index" :isLink="true" arrow-direction="right"></u-cell>
          <u-cell title="意见反馈" @click="feedbackClicked" :isLink="true" arrow-direction="right"></u-cell>
        </u-cell-group>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import loginUser from '../../../common/currentUser.js';
import cloudApi from '../../../common/cloudApi.js';

export default {
  onLoad() {
    let that = this;
    uni.$on('LOGIN_CHANGED', () => {
      console.log('login changed');
      that.userInfo = that.$store.state.userInfo;
    });
  },
  mounted() {
    this.initPage();
  },
  components: {
    // weather
  },
  data() {
    return {
      baseList: [
        {
          name: 'tags',
          title: '项目列表'
        },
        {
          name: 'info-circle',
          title: '关于'
        }
      ]
    };
  },
  computed: {
    ...mapState(['uniDb', 'userInfo'])
  },
  methods: {
    ...mapMutations(['setUserInfo']),
    gridClicked(name) {
      console.log(name);
    },
    async initPage() {},
    updateUserProfile() {
      let that = this;
      uni.getUserProfile({
        desc: '用于完善会员资料',
        success: res => {
          that.userInfo = Object.assign(that.userInfo, res.userInfo);
          console.log(that.userInfo);
          loginUser.updateUserInfo(that.userInfo);
          that.setUserInfo(that.userInfo);
        }
      });
    },
    async userClicked() {
      if (this.$store.state.userInfo && this.$store.state.userInfo.nickName && this.$store.state.userInfo.nickName != '微信用户') {
        // 退出登录
        uni.setStorageSync('is_login', false);
        this.setUserInfo({
          nickName: '微信用户',
          avatarUrl: '',
          gender: 0,
          country: '',
          province: '',
          city: ''
        });
      } else {
        let userData = await loginUser.login();
        this.userInfo = Object.assign(this.userInfo, userData);
        this.updateUserProfile();
        uni.setStorageSync('is_login', true);
      }
    },
    projectListClicked() {
      if (this.$store.state.userInfo && this.$store.state.userInfo._id) {
        uni.navigateTo({
          url: '../../project/index?userId=' + this.$store.state.userInfo._id
        });
      } else {
        uni.showToast({
          title: '请您先登录小程序',
          icon: 'none'
        });
      }
    },
    feedbackClicked() {
      if (this.$store.state.userInfo && this.$store.state.userInfo._id) {
        uni.navigateTo({
          url: '../../feedback/index?userId=' + this.$store.state.userInfo._id
        });
      } else {
        uni.showToast({
          title: '请您先登录小程序',
          icon: 'none'
        });
      }
    },
    async openSubscribeMessageClicked() {
      let that = this;
      if (this.$store.state.userInfo && this.$store.state.userInfo._id) {
        let userCount = await that.uniDb
          .collection('subscribe_message')
          .where({
            user_id: this.$store.state.userInfo._id
          })
          .count();

        uni.requestSubscribeMessage({
          tmplIds: ['98iqExrOLkphYuTIq5SkDdNUTy4CwYFYR6_G2tu8zZ4'],
          success(res) {
            console.log(res);
            let result = res;
            delete result['errMsg'];

            if (userCount.result.total <= 0) {
              that.uniDb.collection('subscribe_message').add({
                user_id: that.$store.state.userInfo._id,
                templeteid_list: result
              });
            } else {
              that.uniDb
                .collection('subscribe_message')
                .where({
                  user_id: that.$store.state.userInfo._id
                })
                .update({
                  templeteid_list: result
                });
            }
          },
          fail(res) {
            uni.showToast({
              title: '开启订阅消息失败，错误信息：' + res.errMsg,
              icon: 'none'
            });
          }
        });
      } else {
        uni.showToast({
          title: '请您先登录小程序',
          icon: 'none'
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  height: 100% !important;
}

.user-container /deep/ .u-button {
  max-width: 120px !important;
}

.user-container /deep/ .u-image {
  margin-left: 10rpx;
}

/deep/ .u-cell-group {
  background-color: #fff;
}
</style>
