<template>
  <view style="background-color: #fff; width: 100%; height: 100%;">
    <view style="width: 100%; height: 60px; text-align: center; padding-top: 80rpx;">
      <u--image width="100px" height="36px" style="width: 100px; height: 36px; background-color: #fff;" :mode="aspectFit" src="/static/about.png" error="小本本"></u--image>
    </view>
    <uni-group mode="card" title="灵感来源">
      <view style="text-indent: 30px; ">
        <text space="nbsp" style="font-size: 15px;">
          作者由于前几年出差较多，垫付或者差旅报销比较多，时常因为发票乱放或忘记找替票导致有些费用报销时候忘记或超过了报销时长，说多了都是泪啊😂😂😂。
        </text>
      </view>
      <view style="padding-top: 20rpx; text-indent: 30px;">
        <text space="nbsp" style="font-size: 15px;">
          小本本主要为了记录公事花费及是否需要替票，并可以按照项目生成统计报销金额生成图表。
        </text>
      </view>
    </uni-group>
    <!-- <uni-card> -->
      <!-- <uni-section title="更新日志"></uni-section> -->
      <uni-group mode="card" title="更新日志" top="15">
        <uni-group mode="card" title="V1.1.0">
          <view>
            <text style="font-size: 13px;">
              项目开源，欢迎star
            </text>
            <view class="u-content">
              <a href="https://github.com/GISerliang/where-is-my-money.git">where-is-my-money</a>
            </view>
          </view>
        </uni-group>
        <uni-group mode="card" title="V1.0.6">
          <view>
            <text style="font-size: 13px;">
              首页增加按照月份折叠功能
            </text>
          </view>
        </uni-group>
        <uni-group mode="card" title="V1.0.5">
          <view>
            <text style="font-size: 13px;">
              修复统计小数位数问题
            </text>
          </view>
        </uni-group>
        <uni-group mode="card" title="V1.0.4">
          <view>
            <text style="font-size: 13px;">
              修复统计时间错误问题
            </text>
          </view>
        </uni-group>
        <uni-group mode="card" title="V1.0.3">
          <view>
            <text style="font-size: 13px;">
              增加小程序更新功能
              修复部分BUG
            </text>
          </view>
        </uni-group>
        <uni-group mode="card" title="V1.0.2">
          <view>
            <text style="font-size: 13px;">
              修复一些BUG
            </text>
          </view>
        </uni-group>
        <uni-group mode="card" title="V1.0.1">
          <view>
            <text style="font-size: 13px;">
              修复退出登录时统计页面未刷新
            </text>
          </view>
        </uni-group>
        <uni-group mode="card" title="V1.0.0">
          <view>
            <text style="font-size: 13px;">
              增加已报销和未报销分类
              新增报销功能
              增加左滑和右滑操作
              项目列表查询删除
              增加统计图表（项目统计、年月统计）
              增加微信登录及退出功能
              增加关于页面
              增加意见反馈
            </text>
          </view>
        </uni-group>
      </uni-group>
      
    <!-- </uni-card> -->
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
/deep/ .u-image {
  display: block !important;
}

/deep/ .u-content {
        padding: 20rpx;
        font-size: 30rpx;
        color: $u-content-color;
        line-height: 1.6;
    }
</style>
