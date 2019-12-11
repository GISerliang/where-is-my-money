<template>
	<div class="container">
		<view class="uni-form-item uni-column">
			<view class="title">金额</view>
			<input class="uni-input" type="digit" placeholder="0.00" />
		</view>

		<view class="uni-form-item uni-column">
			<view class="title">项目</view>
			<picker :value="selectorChecked" :range="selector">
				<view class="uni-input">{{ selectorChecked }}</view>
			</picker>
		</view>

		<view class="uni-form-item uni-column">
			<view class="title">是否已报销</view>
			<picker :value="isReimed" :range="ReimedSelector">
				<view class="uni-input">{{ isReimed }}</view>
			</picker>
		</view>

		<view class="uni-form-item uni-column">
			<view class="title">是否电子票</view>
			<picker :value="isElectricTicket" :range="electricTicket">
				<view class="uni-input">{{ isElectricTicket }}</view>
			</picker>
		</view>

		<view class="uni-form-item uni-column">
			<view class="title">是否需要替票</view>
			<picker :value="replaceTicketChecked" :range="replaceTicket">
				<view class="uni-input">{{ replaceTicketChecked }}</view>
			</picker>
		</view>

		<view class="uni-form-item uni-column">
			<view class="title">发生时间</view>
			<picker mode="date" :value="dateSelector">
				<view class="uni-input">{{ dateSelector }}</view>
			</picker>
		</view>
		
		<view class="uni-form-item uni-column">
			<button type="primary" class="ok-button">欧了</button>
			<button type="normal">算了</button>
		</view>
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
// import weather from './weather'
export default {
	mounted() {
		this.initPage();
	},
	components: {
		// weather
	},
	computed: {
		// ...mapState('home', ['data']),
		// ...mapState('weather', ['weather']),
		content() {
			// return this.data.hp_content.split('by')[0]
		}
	},
	data() {
		const currentDate = this.getDate({
			format: true
		});
		return {
			selector: ['默认', '延长石油', '荥阳三调'], // 项目
			selectorChecked: '默认',
			replaceTicket: ['是', '否'], // 替票
			replaceTicketChecked: '否',
			electricTicket: ['是', '否'], // 电子票
			isElectricTicket: '否',
			ReimedSelector: ['是', '否'], // 报销
			isReimed: '否',
			dateSelector: currentDate, // 日期
			id: '',
			money: 0.0
		};
	},
	methods: {
		// ...mapActions('home', ['getNewIds', 'getHomeData']),
		async initPage() {
			// await this.getNewIds()
			// await this.getHomeData()
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

.uni-input {
	height: 28px;
	padding: 8px 14px;
	line-height: 28px;
	font-size: 15px;
	background: #fff;
	flex: 1;
}

.ok-button {
	background-color: #6190e8;
}
</style>
