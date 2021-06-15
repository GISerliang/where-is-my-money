<template>
	<form class="container" @submit="addRecord">
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
			<picker :value="projectNameIndex" :range="projectName" @change="bindProjectNameChange">
				<view class="uni-input">{{ projectName[projectNameIndex] }}</view>
			</picker>
		</view>

		<view class="uni-form-item uni-column">
			<view class="title">是否已报销</view>
			<picker :value="reimedIndex" :range="ReimedSelector" @change="bindReimedChange">
				<view class="uni-input">{{ ReimedSelector[reimedIndex] }}</view>
			</picker>
		</view>

		<view class="uni-form-item uni-column">
			<view class="title">是否电子票</view>
			<picker :value="electricTicketIndex" :range="electricTicket" @change="bindElectricChange">
				<view class="uni-input">{{ electricTicket[electricTicketIndex] }}</view>
			</picker>
		</view>

		<view class="uni-form-item uni-column">
			<view class="title">是否需要替票</view>
			<picker :value="replaceTicketIndex" :range="replaceTicket" @change="bindReplaceTicketChange">
				<view class="uni-input">{{ replaceTicket[replaceTicketIndex] }}</view>
			</picker>
		</view>

		<view class="uni-form-item uni-column">
			<view class="title">发生时间</view>
			<picker mode="date" :value="dateSelector" @change="bindDateChange"><uni-dateformat class="uni-input" format="yyyy-MM-dd"></uni-dateformat></picker>
		</view>

		<view class="uni-form-item uni-column">
			<button type="primary" formType="submit" class="primary-button">欧了</button>
			<button type="normal" @click="onNavigateBack">算了</button>
		</view>
	</form>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { uuidv4 } from '@/common/util.js';
export default {
	mounted() {
		this.initPage();
	},
	components: {},
	onLoad(option) {
		if (option.item) {
			try {
				const item = JSON.parse(decodeURIComponent(option.item));
				console.log(item);
				this.projectNameIndex = this.projectName.indexOf(item.project_name);
				this.id = item._id;
				this.electricTicketIndex = item.electric;
				this.reimedIndex = item.reimed;
				this.selectorChecked = item.project_name;
				this.money = item.money;
				this.replaceTicketIndex = item.need_replace_ticket;
				this.dateSelector = item.date;
				this.summary = item.summary;
			} catch (e) {
				console.error(e);
			}
		}
	},
	computed: mapState(['uniDb']),
	data() {
		const currentDate = this.getDate({
			format: true
		});
		return {
			projectName: ['默认项目', '延长石油', '荥阳三调'], // 项目
			projectNameIndex: 0,
			replaceTicket: ['否', '是'], // 替票
			replaceTicketIndex: 0,
			electricTicket: ['否', '是'], // 电子票
			electricTicketIndex: 0,
			ReimedSelector: ['否', '是'], // 报销
			reimedIndex: 0,
			dateSelector: currentDate, // 日期
			id: null,
			money: null,
			summary: null
		};
	},
	methods: {
		async initPage() {},
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
		getDate(type) {
			const date = new Date();
			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			let day = date.getDate();

			if (type === 'start') {
				year = year - 60;
			} else if (type === 'end') {
				year = year + 2;
			}
			month = month > 9 ? month : '0' + month;
			day = day > 9 ? day : '0' + day;
			return `${year}-${month}-${day}`;
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

			const record = {
				project_name: this.projectName[this.projectNameIndex],
				reimed: parseInt(this.reimedIndex),
				money: parseFloat(this.money),
				electric: parseInt(this.electricTicketIndex),
				need_replace_ticket: parseInt(this.replaceTicketIndex),
				date: new Date(this.dateSelector),
				summary: this.summary
			};

			let that = this;
			if (this.uniDb) {
				if (this.id) {
					that.uniDb
						.collection('records')
						.doc(this.id)
						.update(record)
						.then(res => {
							if (res.success) {
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
							if (res.success) {
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

<style scoped>
.uni-form-item {
	width: 100%;
	padding: 3px 0;
}

.uni-form-item .title {
	padding: 5px 14px;
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
