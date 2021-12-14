<template>
  <view class="container">
    <u--form>
      <u-form-item label="意见反馈" prop="content" required><u--textarea v-model="content" placeholder="请输入反馈意见"></u--textarea></u-form-item>
      <u-form-item label="反馈类型" prop="type" required>
        <u-picker :show="typeShow" :columns="types" closeOnClickOverlay @cancel="typeShow = false" @confirm="typeConfirm" @close="typeShow = false"></u-picker>
        <u-cell-group><u-cell :title="type" @click="typeShow = true" class="picker-cell"></u-cell></u-cell-group>
      </u-form-item>
      <u-form-item label="反馈截图">
        <u-upload
          maxSize="100000000"
          :fileList="imageList"
          @afterRead="afterRead"
          @delete="deletePic"
          name="feedback-image-upload"
          multiple
          :maxCount="9"
          :previewFullImage="true"
        ></u-upload>
      </u-form-item>
      <u-button @click="submitFeedback" type="primary">提交</u-button>
    </u--form>
  </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  onLoad(options) {
    let that = this;
    console.log('project list onload', options);
    if (!options.userId) {
      uni.showToast({
        title: '未登录用户',
        icon: 'none'
      });
    } else {
      this.userId = options.userId;
    }
  },
  data() {
    return {
      imageList: [],
      userId: null,
      content: '',
      types: [['意见建议', 'BUG反馈', '其他']],
      type: '意见建议',
      typeShow: false
    };
  },
  computed: {
    ...mapState(['uniDb'])
  },
  methods: {
    typeConfirm(e) {
      this.type = e.value && e.value[0] ? e.value[0] : '意见建议';
      this.typeShow = false;
    },
    // 删除图片
    deletePic(event) {
      this.imageList.splice(event.index, 1);
    },
    // 新增图片
    afterRead(event) {
      // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
      let lists = [].concat(event.file);
      let imageListLen = this.imageList.length;
      lists.map(item => {
        this.imageList.push({
          ...item
        });
      });
      // for (let i = 0; i < lists.length; i++) {
      //   let item = this[`imageList{event.name}`][imageListLen];
      //   this[`imageList{event.name}`].splice(
      //     imageListLen,
      //     1,
      //     item
      //   );
      //   imageListLen++;
      // }
    },
    async uploadFile(filePath) {
      let timestamp = new Date().getTime();
      const result = await uniCloud.uploadFile({
        filePath: filePath,
        cloudPath: timestamp + '.png'
      });
      return result.fileID;
    },
    async submitFeedback() {
      console.log(this.content, this.type, this.imageList);
      if (this.type === '') {
        uni.showToast({
          title: '请选择反馈类型',
          icon: 'none'
        });
        return;
      }
      if (this.content === '') {
        uni.showToast({
          title: '请填写反馈内容',
          icon: 'none'
        });
        return;
      }

      let images = [];
      for (let i = 0; i < this.imageList.length; i++) {
        const result = await this.uploadFile(this.imageList[i].thumb);
        images.push(result);
      }

      if (this.uniDb && this.userId && this.userId !== '') {
        this.uniDb
          .collection('feedback')
          .add({
            type: this.type,
            content: this.content,
            images,
            user_id: this.userId
          })
          .then(res => {
            uni.showToast({
              title: '意见反馈成功',
              icon: 'none'
            });
            setTimeout(() => {
              uni.navigateBack({
                animationDuration: 300
              });
            }, 2000);
          })
          .catch(err => {
            console.log(err);
            uni.showToast({
              title: '意见反馈失败: ' + err.message,
              icon: 'none'
            });
          });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  padding: 5px 15px 5px 15px;
}

/deep/ .u-cell-group,
/deep/ .u-upload__button {
  background-color: #fff !important;
}
</style>
