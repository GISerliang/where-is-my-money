<script>
export default {
	onLaunch: function() {
		console.log('App Launch');

		// setTimeout(() => {
		// 	uni.setTabBarBadge({
		// 		index: 1,
		// 		text: '31'
		// 	});
		// 	uni.showTabBarRedDot({
		// 		index: 3
		// 	});
		// }, 1000);
	},
	onShow: function() {
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	}
};
</script>

<style>
.container {
  font-size: 26rpx;
  text-align: center;
}
.wrapper {
  font-size: 26rpx;
  text-align: left;
}
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
/* font color */
* {
  color: #353535;
}
.gray {
  color: #808080;
}
.wxParse {
  text-indent: 2em;
}
.wxParse image {
  text-indent: 0;
}
.wxParse ._view {
  padding: 0 10rpx;
  text-indent: 0;
}
.wxParse .p {
  text-indent: 1em;
}
</style>
