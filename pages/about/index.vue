<template>
  <view style="background-color: #fff; width: 100%; height: 100%;">
    <view style="width: 100%; height: 60px; text-align: center; padding-top: 80rpx;">
      <u--image width="100px" height="36px" style="width: 100px; height: 36px; background-color: #fff;" :mode="aspectFit" src="/static/about.png"
                            error="小本本"></u--image>
    </view>
    <uni-card>
    <view style="text-indent: 30px; ">
      <text space="nbsp" style="font-size: 15px;">&nbsp;&nbsp;作者由于前几年出差较多，垫付或者差旅报销比较多，时常因为发票乱放或忘记找替票导致有些费用报销时候忘记或超过了报销时长，说多了都是泪啊😂😂😂。</text>
    </view>
    <view style="padding-top: 20rpx; text-indent: 30px;">
      <text space="nbsp" style="font-size: 15px;">&nbsp;&nbsp;小本本主要为了记录公事花费及是否需要替票，并可以按照项目生成统计报销金额生成图表。</text>
    </view>
    </uni-card>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        
      }
    },
    methods: {
      
    }
  }
</script>

<style lang="scss" scoped>
/deep/ .u-image {
  display: block !important;
}
</style>
