<template>
  <view class="container">
    <uni-section class="statistic-chart" title="各项目贡献" type="line"></uni-section>
    <uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" styleType="button" activeColor="#4cd964"></uni-segmented-control>
            <view class="content">
                <view v-show="current === 0">
                    选项卡1的内容
                </view>
                <view v-show="current === 1">
                    选项卡2的内容
                </view>
                <view v-show="current === 2">
                    选项卡3的内容
                </view>
            </view>
    <canvas class="charts-box" id="projectDhartsDataId" canvasId="projectDhartsDataId" />
  </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import uCharts from '@/uni_modules/qiun-data-charts/js_sdk/u-charts/u-charts.js'
export default {
  onLoad() {
    let that = this
    //#ifdef MP-ALIPAY || MP-WEIXIN
    this.pixelRatio = uni.getSystemInfoSync().pixelRatio;
    //#endif
    this.cWidth = uni.upx2px(750);
    this.cHeight = uni.upx2px(500);
    
    uni.$on('LOGIN_CHANGED', () => {
      console.log('login changed')
      that.updateCharts()
    })
  },
  onShow: function() {
    this.updateCharts()
  },
  mounted() {},
  data() {
    return {
      cWidth: 350,
      cHeight: 300,
      pixelRatio: 1
    };
  },
  components: {},
  computed: mapState(['uniDb', 'userInfo']),
  methods: {
    ...mapMutations(['setUserInfo']),
    updateCharts() {
      if (this.uniDb && this.$store.state.userInfo && this.$store.state.userInfo._id) {
        // uni.showLoading({
        //     title: '加载中'
        // });
        this.uniDb
          .collection('records')
          .where({
            'user_id': this.$store.state.userInfo._id
          })
          .field('project_name, reimed, money')
          .groupBy('project_name, reimed')
          .groupField('sum(money) as total_money')
          .get()
          .then(res => {
            console.log(res);
            if (res.result) {
              let data = res.result.data;
              let categories = [];
              let series = [
                {
                  name: '已报销',
                  data: []
                },
                {
                  name: '未报销',
                  data: []
                }
              ];
              let map = {};
              for (let i = data.length - 1; i >= 0; i--) {
                if (categories.indexOf(data[i].project_name) <= -1) {
                  categories.push(data[i].project_name);
                }
                let value = {};
                value[data[i].reimed] = data[i]['total_money'];
                if (!map.hasOwnProperty(data[i].project_name)) {
                  map[data[i].project_name] = {};
                }
                map[data[i].project_name][data[i].reimed] = data[i]['total_money'];
              }
              console.log(map);
              for (let i = 0; i < categories.length; i++) {
                let key = categories[i];
                let value = map[key];
                let hasReimed = false,
                  hasUnreimed = false;
                if (value.hasOwnProperty('1')) {
                  series[0].data.push(value['1']);
                  hasReimed = true;
                }
                if (value.hasOwnProperty('0')) {
                  series[1].data.push(value['0']);
                  hasUnreimed = true;
                }
                if (!hasReimed) {
                  series[0].data.push(0);
                }
                if (!hasUnreimed) {
                  series[1].data.push(0);
                }
              }
      
              console.log(series);
              const ctx = uni.createCanvasContext('projectDhartsDataId', this);
              let chart = new uCharts({
                type: 'column',
                tooltipShow: true,
                color: ['#3CA272', '#FC8452', '#9A60B4', '#ea7ccc'],
                context: ctx, //v2.0版本必须要传context
                fontSize: 11,
                fontColor: '#666',
                padding: [15, 15, 0, 15],
                dataLabel: true,
                categories: categories,
                series: series,
                animation: true,
                width: this.cWidth,
                height: this.cHeight,
                extra: {
                  column: {
                    type: 'stack',
                    seriesGap: 2,
                    categoryGap: 3
                  }
                }
              });
            } else {
              uni.showToast({
                title: '查询记录失败: ' + res.result.message,
                icon: 'none'
              });
            }
          })
          .catch(err => {
            console.error(err);
            uni.showToast({
              title: '查询记录失败: ' + err.message,
              icon: 'none'
            });
          });
      }
    }
  }
};
</script>

<style scoped>
.statistic-chart {
}
.cover {
  width: 100%;
}
.cover-author {
  width: 100%;
  height: 100rpx;
  line-height: 100rpx;
  margin-bottom: 30rpx;
}
.content {
  width: 80%;
  margin: 0 auto;
  line-height: 58rpx;
  text-align: left;
}
.content-author {
  height: 100rpx;
  line-height: 100rpx;
  font-size: 20rpx;
}
/* 请根据需求修改图表容器尺寸，如果父容器没有高度图表则会显示异常 */
.charts-box {
  width: 100%;
  height: 260px;
  background-color: #fff;
}
</style>
