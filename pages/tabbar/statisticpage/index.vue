<template>
  <view class="container">
    <view class="projectChartContainer">
      <uni-section class="statistic-chart" title="各项目贡献" type="line"></uni-section>
      <u-subsection :list="projectChartTypeList" :current="projectChartCurrent" @change="projectChartTypeChanged"></u-subsection>
      <qiun-data-charts
        class="charts-box"
        :type="currentProjectChartType"
        id="projectDhartsDataId"
        canvasId="projectDhartsDataId"
        :chartData="projectChartData"
        background="#fff"
        :canvas2d="true"
        :reload="projectReload"
        :tooltipFormat="projectTooltipFormatter"
        :opts="{
          yAxis: {
            data: [
              {
                title: '单位（元）'
              }
            ],
            showTitle: true
          },
          extra: {
            tooltip: {
              showCategory: true,
              yAxisLabel: true
            },
            column: {
              lineType: 'custom'
            }
          },
          formatter: {
            tooltipFormatter: function(item, category, index, opts) {
              console.log('formatter', item, category, index, opts);
              return item.data + '元';
            }
          }
        }"
      />
    </view>
    <view class="dateChartContainer">
      <uni-section class="statistic-chart" title="各时间贡献" type="line"></uni-section>
      <u-subsection :list="dateChartTypeList" :current="dateChartCurrent" @change="dateChartTypeChanged"></u-subsection>
      <qiun-data-charts
        class="charts-box"
        id="dateChartsDataId"
        canvasId="dateChartsDataId"
        background="#fff"
        :canvas2d="true"
        :reload="dateReload"
        type="mix"
        :chartData="dateChartData"
        :tooltipFormat="dateTooltipFormatter"
        :opts="{
          padding: [10, 5, 0, 5],
          yAxis: {
            data: [
              {
                title: '单位（元）'
              }
            ],
            showTitle: true
          },
          extra: {
            tooltip: {
              showCategory: true,
              yAxisLabel: true
            },
            mix: {
              column: {
                lineType: 'custom',
                linearOpacity: 1,
                colorStop: 0
              }
            }
          },
          formatter: {
            tooltipFormatter: function(item, category, index, opts) {
              console.log('formatter', item, category, index, opts);
              return item.data + '元';
            }
          }
        }"
      ></qiun-data-charts>
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import uCharts from '@/uni_modules/qiun-data-charts/js_sdk/u-charts/config-ucharts.js';
export default {
  onLoad() {
    let that = this;
    //#ifdef MP-ALIPAY || MP-WEIXIN
    this.pixelRatio = uni.getSystemInfoSync().pixelRatio;
    //#endif
    this.cWidth = uni.upx2px(750);
    this.cHeight = uni.upx2px(500);

    uni.$on('LOGIN_CHANGED', () => {
      console.log('login changed');
      this.userInfo = this.$store.state.userInfo;
    });
    uCharts.formatter[this.projectTooltipFormatter] = function(item, category, index, opts) {
      if (category) {
        return item.name + ': ' + item.data + ' 元';
      } else {
        return item.name + ': ' + item.data + ' 元';
      }
      return item.data + '元';
    };
    uCharts.formatter[this.dateTooltipFormatter] = function(item, category, index, opts) {
      if (category) {
        return item.name + ': ' + item.data + ' 元';
      } else {
        return item.name + ': ' + item.data + ' 元';
      }
      return item.data + '元';
    };
  },
  onShow: function() {
    this.updateProjectCharts();
    this.updateDateCharts();
  },
  mounted() {},
  data() {
    return {
      cWidth: 350,
      cHeight: 300,
      pixelRatio: 1,
      projectChartTypeList: ['柱状图', '区域图', '玫瑰图'],
      projectChartCurrent: 0,
      projectChartType: ['column', 'area', 'rose'],
      currentProjectChartType: 'column',
      projectReload: false,

      dateChartTypeList: ['年', '月'],
      dateChartCurrent: 0,
      dateReload: false,

      projectChartData: {
        categories: [],
        series: []
      },
      projectChartRoseData: {
        series: []
      },
      projectChartCommonData: {
        categories: [],
        series: []
      },
      dateChartData: {
        categories: [],
        series: []
      },
      projectTooltipFormatter: 'tooltipTemp1',
      dateTooltipFormatter: 'tooltipTemp1'
    };
  },
  components: {},
  computed: mapState(['uniDb', 'userInfo']),
  methods: {
    ...mapMutations(['setUserInfo']),
    projectChartTypeChanged(index) {
      let that = this;
      this.projectChartCurrent = index;
      this.currentProjectChartType = this.projectChartType[index];
      if (index < 2) {
        this.projectChartData = this.projectChartCommonData;
      } else {
        this.projectChartData = this.projectChartRoseData;
      }
      this.projectReload = true;
      setTimeout(() => {
        that.projectReload = false;
      }, 1000);
    },
    dateChartTypeChanged(index) {
      let that = this;
      this.dateChartCurrent = index;

      this.updateDateCharts();

      // this.dateReload = true;
      // setTimeout(() => {
      //   that.dateReload = false;
      // }, 1000);
    },
    updateProjectCharts() {
      let that = this;
      if (this.uniDb && this.$store.state.userInfo && this.$store.state.userInfo._id) {
        // uni.showLoading({
        //     title: '加载中'
        // });
        this.uniDb
          .collection('records')
          .where({
            user_id: this.$store.state.userInfo._id
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

              that.projectChartCommonData['categories'] = categories;
              that.projectChartCommonData['series'] = series;

              console.log(that.projectChartCommonData);
              that.projectChartData = that.projectChartCommonData;

              let roseSeries = [
                {
                  data: []
                }
              ];
              for (let key in map) {
                let total = 0.0;
                for (let index in map[key]) {
                  total += map[key][index];
                }
                roseSeries[0].data.push({
                  name: key,
                  value: total
                });
              }
              that.projectChartRoseData['series'] = roseSeries;
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
      } else {
        this.projectChartData = {
          categories: [],
          series: []
        };
      }
    },
    updateDateCharts() {
      let that = this;
      if (this.uniDb && this.$store.state.userInfo && this.$store.state.userInfo._id) {
        this.uniDb
          .collection('records')
          .where({
            user_id: this.$store.state.userInfo._id
          })
          .field('project_name, reimed, money, date')
          .groupBy(this.dateChartCurrent === 0 ? "dateToString(date,'%Y年') as text, reimed" : "dateToString(date,'%Y年%m月') as text, reimed")
          .groupField('sum(money) as total_money')
          .orderBy('text')
          .get()
          .then(res => {
            console.log(res);
            if (res.result) {
              let categories = [];
              let data = res.result.data;
              let series = [
                {
                  name: '已报销',
                  data: [],
                  type: 'column'
                },
                {
                  name: '未报销',
                  data: [],
                  type: 'column'
                },
                {
                  name: '合计',
                  data: [],
                  type: 'area',
                  style: 'curve',
                  textOffset: -10
                },
                {
                  name: '合计',
                  data: [],
                  type: 'line',
                  style: 'curve',
                  lineType: 'dash',
                  color: '#FAC858',
                  disableLegend: true,
                  textOffset: -10
                }
              ];
              let map = {};
              for (let i = 0; i < data.length; i++) {
                if (categories.indexOf(data[i].text) <= -1) {
                  categories.push(data[i].text);
                }
                let value = {};
                value[data[i].reimed] = data[i]['total_money'];
                if (!map.hasOwnProperty(data[i].text)) {
                  map[data[i].text] = {};
                }
                map[data[i].text][data[i].reimed] = data[i]['total_money'];
              }
              console.log(map);
              for (let key in map) {
                let total = 0.0;
                for (let m in map[key]) {
                  if (m === '0') {
                    // 未报销
                    let money = map[key][m];
                    total += money;
                    series[1].data.push(money);
                  } else {
                    let money = 0.0;
                    total += money;
                    series[1].data.push(money);
                  }
                  if (m === '1') {
                    let money = map[key][m];
                    total += money;
                    series[0].data.push(money);
                  } else {
                    let money = 0.0;
                    total += money;
                    series[0].data.push(money);
                  }
                }
                series[2].data.push(total);
                series[3].data.push(total);
              }

              that.dateChartData['categories'] = categories;
              that.dateChartData['series'] = series;

              console.log(that.dateChartData);
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
      } else {
        this.dateChartData = {
          categories: [],
          series: []
        };
      }
    }
  }
};
</script>

<style scoped lang="scss">
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
  background-color: #fff;
}
.projectChartContainer /deep/ .u-subsection,
.dateChartContainer /deep/ .u-subsection {
  width: 160px;
  float: right;
}

.container {
  height: 100%;
}
</style>
