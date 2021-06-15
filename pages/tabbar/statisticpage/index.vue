<template>
	<div class="container">
		<view class="charts-box">
			<qiun-data-charts type="tline" :chartData="chartData" background="none" :canvas2d="true" :canvasId="chartsDataId"/>
		</view>
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
	mounted() {},
	data() {
		return {
			chartData: {
				series: [
					{
						name: '时间轴1',
						data: [[10000, 55], [30000, 25], [50000, 55], [70000, 25], [90000, 55]]
					},
					{
						name: '时间轴2',
						data: [[0, 25], [20000, 55], [40000, 25], [60000, 55], [80000, 25]]
					},
					{
						name: '时间轴3',
						data: [[0, 55], [15000, 25], [30000, 55], [45000, 25], [60000, 55]]
					}
				]
			}
		};
	},
	components: {},
	computed: {
		content() {}
	},
	methods: {}
};
</script>

<style scoped>
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
	height: 300px;
}
</style>
