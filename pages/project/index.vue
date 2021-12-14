<template>
  <view class="u-page">
    <view class="u-block">
      <text class="u-block__title">项目标签</text>
      <view class="u-block__content">
        <view class="u-page__tag-item" v-for="(project, index) in projectList" :key="index">
          <u-tag :name="project._id" :text="project.project_name" plain plainFill closable @close="removeProject"></u-tag>
        </view>
        <view class="u-page__tag-item project-add-tag"><u-tag icon="plus" plain plainFill @click="addProject"></u-tag></view>
      </view>
    </view>
    <uni-popup ref="projectPopup" type="dialog">
      <uni-popup-dialog
        mode="input"
        title="项目名称"
        placeholder="请输入项目名称"
        message="项目名称"
        :duration="2000"
        :before-close="true"
        @close="popupClose"
        @confirm="popupConfirm"
      ></uni-popup-dialog>
    </uni-popup>
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

      if (this.uniDb) {
        this.uniDb
          .collection('project_list')
          .where({
            user_id: this.userId
          })
          .get()
          .then(res => {
            console.log('project list', res);
            if (res.result) {
              that.projectList = res.result.data;
            } else {
              uni.showToast({
                title: '查询项目列表失败: ' + res.result.message,
                icon: 'none'
              });
            }
          })
          .catch(err => {
            console.error(err);
            uni.showToast({
              title: '查询项目列表失败: ' + err.message,
              icon: 'none'
            });
          });
      }
    }
  },
  data() {
    return {
      projectList: [],
      userId: null
    };
  },
  computed: {
    ...mapState(['uniDb'])
  },
  methods: {
    addProject() {
      console.log('add project');
      this.$refs.projectPopup.open();
    },
    removeProject(projectId) {
      let that = this;
      console.log(projectId);
      if (projectId) {
        uni.showModal({
          title: '提示',
          content: '是否删除该标签',
          cancelText: '取消删除',
          confirmText: '确定删除',
          success: res => {
            if (res.confirm) {
              if (that.uniDb) {
                that.uniDb
                  .collection('project_list')
                  .doc(projectId)
                  .remove()
                  .then(res => {
                    let index = -1;
                    for (let i = 0; i < that.projectList.length; i++) {
                      if (that.projectList[i]._id === projectId) {
                        index = i;
                        break;
                      }
                    }
                    if (index >= 0) {
                      that.projectList.splice(index, 1);
                    }
                  })
                  .catch(err => {
                    console.log(err);
                    uni.showToast({
                      title: '删除标签失败: ' + err.message,
                      icon: 'none'
                    });
                  });
              }
            }
          }
        });
      }
    },
    popupClose() {
      this.$refs.projectPopup.close();
    },
    popupConfirm(value) {
      let that = this;
      value = value.trim();
      if (value && value !== '' && this.userId) {
        let is_repeat = false;
        for (let i = 0; i < that.projectList.length; i++) {
          if (that.projectList[i].project_name === value) {
            is_repeat = true;
            break;
          }
        }

        if (is_repeat) {
          uni.showToast({
            title: '新建标签失败: 标签重复',
            icon: 'none'
          });
          return;
        }

        let project = {
          user_id: that.userId,
          project_name: value
        };
        if (that.uniDb) {
          that.uniDb
            .collection('project_list')
            .add(project)
            .then(res => {
              project._id = res.result.id;
              that.projectList.push(project);
              this.$refs.projectPopup.close();
            })
            .catch(err => {
              console.log(err);
              uni.showToast({
                title: '新增标签失败: ' + err.message,
                icon: 'none'
              });
            });
        }
      }
    }
  }
};
</script>

<style lang="scss">
.u-block {
  flex: 1;
  margin-bottom: 23px;

  &__content {
    @include flex(column);
  }

  &__title {
    font-size: 14px;
    color: rgb(143, 156, 162);
    margin-bottom: 8px;
    @include flex;
  }
}
</style>

<style>
.u-page {
  padding: 15px 15px 40px 15px;
}
.u-page__tag-item {
  margin-right: 20rpx;
}
.u-block__content {
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
}

.project-add-tag .u-tag {
  border-style: dashed !important;
  margin-top: 10px !important;
}

.project-add-tag .u-icon__icon {
  font-size: 16px !important;
}
</style>
