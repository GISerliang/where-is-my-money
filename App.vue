<script>
import { mapState, mapMutations } from 'vuex';

Date.prototype.Format = function(fmt) {
      //author: meizz
      var o = {
        'M+': this.getMonth() + 1, //月份
        'd+': this.getDate(), //日
        'h+': this.getHours(), //小时
        'm+': this.getMinutes(), //分
        's+': this.getSeconds(), //秒
        'q+': Math.floor((this.getMonth() + 3) / 3), //季度
        S: this.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
      for (var k in o) if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
      return fmt;
    };
    
export default {
  onLaunch: function() {
    console.log('App Launch');

    const db = uniCloud.database();
    this.setUniDb(db);
  },
  onShow: function() {
    console.log('App Show');
  },
  onHide: function() {
    console.log('App Hide');
  },
  methods: {
    ...mapMutations(['setUniDb'])
  }
};
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "@/uni_modules/uview-ui/index.scss";
</style>

<style>
.container {
  font-size: 30rpx;
  background-color: #f4f5f6;
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

.primary-button {
  background-color: #6190e8;
}
.user-tag {
  font-size: 12px;
  padding: 2px 6px;
  color: #ffffff;
  border-radius: 4px;
}
page {
  width: 100%;
  height: 100%;
  font-family: Verdana;
  background: #f2f2f2;
}
</style>
