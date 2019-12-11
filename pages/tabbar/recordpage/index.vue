<template>
	<view class="container">
		<uni-section title="未报销" type="line"></uni-section>
		<uni-swipe-action>
			<uni-swipe-action-item class="unreimed-swipe-action-item" :options="options" v-for="(item, index) in unreimedItems" :key="item.id">
				<uni-list-item class="unreimed-list-item" show-arrow="false">
					<text class="cont">{{ item.money }}</text>
				</uni-list-item>
			</uni-swipe-action-item>
		</uni-swipe-action>

		<uni-section title="已报销" type="line"></uni-section>
		<uni-swipe-action>
			<uni-swipe-action-item class="reimed-swipe-action-item" :options="options" v-for="(item, index) in reimedItems" :key="item.id">
				<uni-list-item class="reimed-list-item" show-arrow="false">
					<text class="cont">{{ item.money }}</text>
				</uni-list-item>
			</uni-swipe-action-item>
		</uni-swipe-action>
	</view>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import uniSection from '@/components/uni-section/uni-section.vue';
import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue';
import uniSwipeActionItem from '@/components/uni-swipe-action-item/uni-swipe-action-item.vue';
export default {
	mounted() {
		// this.initPage()
		this.getData();
	},
	components: {
		uniSection,
		uniSwipeAction,
		uniSwipeActionItem
	},
	computed: {},
	data() {
		return {
			unreimedItems: [],
			reimedItems: [],
			options: [
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
			]
		};
	},
	methods: {
		// ...mapActions('home', ['getData']),
		getData() {
			var unreimedItems = [
				{
					id: '222222-22222-22222-22222',
					projectName: '延长石油',
					isReimed: '否',
					money: 102.3,
					isElectric: '是',
					isNeedReplaceTicket: '否',
					isOpened: false,
					date: '2019-11-01'
				},
				{
					id: '333333-33333-33333-33333',
					projectName: '荥阳三调',
					isReimed: '否',
					money: 102.3,
					isElectric: '否',
					isNeedReplaceTicket: '否',
					isOpened: false,
					date: '2019-11-13'
				},
				{
					id: '444444-44444-44444-44444',
					projectName: '默认',
					isReimed: '否',
					money: 102.3,
					isElectric: '否',
					isNeedReplaceTicket: '否',
					isOpened: false,
					date: '2019-11-05'
				}
			];
			this.unreimedItems = unreimedItems;
			var reimedItems = [
				{
					id: '111111-11111-11111-11111',
					projectName: '荥阳三调',
					isReimed: '是',
					money: 102.3,
					isElectric: '否',
					isNeedReplaceTicket: '否',
					isOpened: false,
					date: '2019-11-01'
				}
			];
			this.reimedItems = reimedItems;
		}
	}
};
</script>

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
/*  .content {
    width: 80%;
    margin: 0 auto;
    line-height: 58rpx;
    text-align: left;
  } */
uni-section {
	text-align: left;
}

uni-section .line {
	background-color: #6190e8 !important;
}

uni-list-item {
	height: 45px;
}

uni-swipe-action-item {
	line-height: 45px;
	border-bottom-color: #f5f5f5;
	border-bottom-width: 1px;
	border-bottom-style: solid;
}

.cont {
	flex: 1;
	height: 45px;
	line-height: 45px;
	padding: 0 15px;
	position: relative;
	background-color: #fff;
	font-size: 15px;
	/* border-bottom-color: #F5F5F5; */
	/* border-bottom-width: 1px; */
	/* border-bottom-style: solid; */
}
</style>
