<template>
  <view class="pages account-list">
    <view class="account-content">
      <uni-swipe-action v-if="accountList.length>0">
        <uni-swipe-action-item :options="operate" v-for="(v,i) of accountList" :key="i" @click="onTapOperate($event,v.id,i,v.userNumber)">
          <account-item :options="v" class="account-list" @click="goToAccount(v.id)" />
        </uni-swipe-action-item>

        <no-more :noMore="noMore" />
      </uni-swipe-action>

      <empty v-else desc="没有账号哦~" />
    </view>

    <view class="account-operate">
      <view class="role-operate" @tap="toRoleManage">
        <view class="icon">
          <image src="/static/images/icon_role_manage.png" mode="widthFix" />
        </view>
        <view class="text"><text>岗位管理</text></view>
      </view>
      <view class="add-account-operate">
        <form @submit="navigateToAccountAdd" class="operation-form-but" :report-submit='true'>
          <button type="default" class="operate-account-creater" form-type="submit">添加账号</button>
        </form>
      </view>
    </view>

    <!-- 模态启用禁用操作 -->
    <modal ref="modal" :title="operates.title" :message="operates.message" @confirm="onConfirmOperate" />

    <!-- 修改密码 -->
    <modal ref="modalPassword" title="修改密码" @confirm="onConfirmModifyPassword">
      <view class="modal-form">
        <m-input class="m-input" type="password" clearable v-model="oldPassword" placeholder="请输入原始密码" />
        <m-input class="m-input" type="password" clearable v-model="newPassword" placeholder="请输入新密码" />
      </view>
    </modal>

  </view>
</template>

<script>
import {
  uniIcons,
  uniBadge,
  uniSwipeAction,
  uniSwipeActionItem
} from "@dcloudio/uni-ui";
import empty from "@/components/empty";
import noMore from "@/components/no-more";
import mInput from "@/components/m-input";
import modal from "@/components/modal";
import accountItem from "./account-item";

import md5 from "md5";

import util from "@/common/utils";
import {
  getAppOperatorList,
  setAppOperatorState,
  deleteAppOperator,
  modifyAppOperatorPassword
} from "@/common/api";

export default {
  name: "accountList",
  components: {
    empty,
    noMore,
    mInput,
    modal,
    uniIcons,
    accountItem,
    uniBadge,
    uniSwipeAction,
    uniSwipeActionItem
  },
  data() {
    return {
      //分页
      curPage: 1,
      pageSize: 20,
      allPage: 0,
      noMore: !1,

      accountList: [],
      oldPassword: null,
      newPassword: null,
      operate: [
        {
          text: "禁用"
        },
        {
          text: "启用",
          style: {
            backgroundColor: "#007aff"
          }
        },
        {
          text: "删除",
          style: {
            backgroundColor: "#ff3a31"
          }
        },
        {
          text: "修改密码",
          style: {
            backgroundColor: "#f0ad4e"
          }
        }
      ],

      operates: {
        id: null,
        userNumber: null,
        index: 0,
        type: "enabled",
        title: "提示",
        message: ""
      }
    };
  },
  computed: {},
  watch: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.initData();
    this.getAccountList();
  },

  methods: {
    // initData
    initData() {
      this.curPage = 1;
      this.accountList = [];
    },

    // 点击按钮组事件
    onTapOperate(e, id, _index, n) {
      const index = e.index;
      const title = e.content.text;
      this.operates.id = id;
      this.operates.userNumber = n;
      this.operates.title = title;
      this.operates.index = _index;
      switch (index) {
        case 0:
          this.operates.type = "disabled";
          this.operates.message = "确认要禁用此账号吗？";
          this.$refs.modal.openPopup();
          break;
        case 1:
          this.operates.type = "enabled";
          this.operates.message = "确认要启用此账号吗？";
          this.$refs.modal.openPopup();
          break;
        case 2:
          this.operates.type = "delete";
          this.operates.message = "确认要删除此账号吗？";
          this.$refs.modal.openPopup();
          break;
        case 3:
          this.operates.type = "modify";
          this.operates.message = "";
          this.oldPassword = null;
          this.newPassword = null;
          this.$refs.modalPassword.openPopup();
          break;
      }
    },

    // 启用禁用删除模态确认操作
    onConfirmOperate() {
      const _type = this.operates.type;
      switch (_type) {
        case "disabled":
          this.setAccountStatus();
          break;
        case "enabled":
          this.setAccountStatus();
          break;
        case "delete":
          this.removeAccount();
          break;
      }
      this.$refs.modal.closePopup();
    },

    // 修改密码模态确认操作
    onConfirmModifyPassword() {
      const _type = this.operates.type;
      switch (_type) {
        case "modify":
          this.setAccountPassword();
          break;
      }
    },

    // 跳转岗位管理
    toRoleManage() {
      util.navigateTo("/pages/subPackageD/role/roleList");
    },

    // 跳转到账号添加页面
    navigateToAccountAdd(e) {
      util.saveFormid(e.detail.formId);
      util.navigateTo("/pages/subPackageD/account/accountAdd");
    },

    // 跳转账号编辑
    goToAccount(id) {
      util.navigateTo(`/pages/subPackageD/account/accountAdd?id=${id}`);
    },

    // 禁用or启用
    setAccountStatus() {
      const _index = this.operates.index;
      const _accountList = this.accountList;
      const _data = {
        id: this.operates.id,
        status: this.operates.type
      };
      setAppOperatorState(_data).then(res => {
        util.showToastSuccess("操作成功!");
        _accountList[_index].operatorStatus = this.operates.type;
      });
    },

    // 删除账号
    removeAccount() {
      const _index = this.operates.index;
      const _accountList = this.accountList;
      deleteAppOperator(this.operates.id).then(res => {
        util.showToastSuccess("删除成功!");
        _accountList.splice(_index, 1);
      });
    },

    // 修改密码
    setAccountPassword() {
      const flag = this.checkData();
      if (flag) {
        const data = {
          userNumber: this.operates.userNumber,
          oldPassword: md5(this.oldPassword),
          newPassword: md5(this.newPassword)
        };
        modifyAppOperatorPassword(data).then(res => {
          util.showToastSuccess("修改成功!");
          this.$refs.modalPassword.closePopup();
        });
      }
    },

    // 校验数据
    checkData() {
      const _oldPassword = this.oldPassword;
      const _newPassword = this.newPassword;
      if (!_oldPassword) {
        util.showToastError("请填写原始密码！");
        return false;
      } else if (!_newPassword) {
        util.showToastError("请填写新密码！");
        return false;
      } else {
        return true;
      }
    },

    // 获取账号列表
    getAccountList() {
      const _data = {
        currentPage: this.curPage,
        pageSize: this.pageSize,
        where: {}
      };
      getAppOperatorList(_data).then(res => {
        const data = res.page;
        this.allPage = data.totalPage;

        let list = this.accountList;
        const _list = data.list;
        if (_list.length > 0) {
          if (_list.length < this.pageSize) this.noMore = !0;
          else this.noMore = !1;

          let _newList = [...list, ..._list];
          this.accountList = _newList;
        }
      });
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    this.curPage = this.curPage + 1;
    if (this.curPage <= this.allPage) this.getAccountList();
    else this.noMore = !0;
  }
};
</script>

<style lang="scss">
.account-list {
  .account-content {
    padding-bottom: 110upx;
    margin-bottom: 20upx;
    .account-list {
      width: 100%;
      flex: 1;
    }
  }
  .account-operate {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    padding: 10upx 30upx;
    background-color: #fff;
    z-index: 99;
    .role-operate {
      width: 120upx;
      margin-right: 30upx;
      text-align: center;
      .icon {
        width: 40upx;
        height: 40upx;
        margin: 0 auto 10upx;
        line-height: 40upx;
        text-align: center;
        image {
          width: 100%;
        }
      }
    }
    .add-account-operate {
      width: calc(100% - 150upx);
    }
  }

  .modal-form {
    position: relative;
    padding: 20upx 30upx;
    .m-input {
      .m-input-view {
        position: relative;
        padding: 16upx 0;
      }
      .m-input-view::after {
        @include backgroundLine(0, 0, 2upx);
      }
    }
  }
}
</style>
