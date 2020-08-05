<template>
  <view class="pages account-form">
    <view class="form-content">
      <van-cell-group>
        <van-field :value="account.operatorName" label="姓名" placeholder="请填写账号姓名" border="false" required @change="onChangeName" />
        <van-field :value="account.userMobilePhone" label="登录账号" placeholder="请填写登录手机号" border="false" maxlength="11" required :disabled="operate=='edit'?true:false" @change="onChangeMobile" />
        <van-field :value="account.operatorLoginPwd" label="登录密码" placeholder="请填写登录密码" border="false" type="password" required @change="onChangePassword" v-if="operate=='add'" />
        <view class="account-type">
          <m-picker mode="selector" label="操作员类型" :index="curAccountTypeIndex" rangekey="name" :range="accountType" required :disabled="operate=='edit'?true:false" @change="onChoiceAccountType" />
        </view>
        <view class="account-role">
          <m-picker mode="selector" label="岗位权限" :index="curRoleIndex" rangekey="roleName" :range="roleList" required @change="onChoiceRole" />
        </view>
      </van-cell-group>
    </view>

    <view class="form-operate">
      <form @submit="saveAccount" class="operation-form-but" :report-submit='true'>
        <button type="default" class="operate-account-add" form-type="submit">保存</button>
      </form>
    </view>
  </view>
</template>

<script>
import { uniIcons } from "@dcloudio/uni-ui";
import mPicker from "@/components/m-picker";

import md5 from "md5";

import util from "@/common/utils";

import {
  regAppOperator,
  addAppOperator,
  getAppOperatorInfo,
  modifyAppOperator,
  getAppRoleListAll
} from "@/common/api";

export default {
  name: "accountAdd",
  components: {
    uniIcons,
    mPicker
  },
  data() {
    return {
      operate: "add",
      id: null,
      curAccountTypeIndex: null,
      accountType: [],
      account: {},
      curRoleIndex: null,
      roleList: []
    };
  },
  computed: {},
  watch: {
    curAccountTypeIndex(e) {
      this.account.operatorType = this.accountType[e].type;
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    this.initData();

    await this.getRoleListAll();
    const _id = options.id;
    if (_id) {
      this.id = _id;
      this.operate = "edit";
      this.getAccountDetail();
      util.setNavigationBarTitle("修改账号-固瑞锦建材");
      this.accountType = [
        { name: "配送员", type: "DELIVERYMAN_CUSTOMER" },
        { name: "客户", type: "CLIENT_CUSTOMER" },
        { name: "系统操作员", type: "SYSTEME_OPERATOR" }
      ];
    } else {
      this.id = null;
      this.operate = "add";
      util.setNavigationBarTitle("添加账号-固瑞锦建材");
      this.accountType = [{ name: "系统操作员", type: "SYSTEME_OPERATOR" }];
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  methods: {
    // initData
    initData() {
      const _account = {
        operatorName: null,
        userMobilePhone: null,
        operatorLoginPwd: null,
        roleIdList: [],
        operatorStatus: "enabled"
      };
      this.account = _account;
    },

    // 姓名
    onChangeName(e) {
      this.account.operatorName = e.detail;
    },

    // 登陆手机号
    onChangeMobile(e) {
      this.account.userMobilePhone = e.detail;
    },

    // 密码
    onChangePassword(e) {
      this.account.operatorLoginPwd = e.detail;
    },

    // 操作员类型
    onChoiceAccountType(e) {
      this.curAccountTypeIndex = e.detail.value;
    },

    // 岗位权限
    onChoiceRole(e) {
      this.curRoleIndex = e.detail.value;
    },

    // 校验数据
    checkData() {
      const _account = this.account;
      const mobileReg = /^(1)[0-9]{10}$/;
      if (!_account.operatorName) {
        util.showToastError("请填写账号名称！");
        return false;
      } else if (!mobileReg.test(_account.userMobilePhone)) {
        util.showToastError("请填写有效的手机号！");
        return false;
      } else if (this.operate == "add" && !_account.operatorLoginPwd) {
        util.showToastError("请填写登录密码！");
        return false;
      } else if (!this.curAccountTypeIndex) {
        util.showToastError("请选择账号类型！");
        return false;
      } else {
        return true;
      }
    },

    // 保存客户信息
    saveAccount(e) {
      util.saveFormid(e.detail.formId);
      const flag = this.checkData();
      if (flag) {
        switch (this.operate) {
          case "add":
            this.addAccount();
            break;
          case "edit":
            this.editAccount();
            break;
        }
      }
    },

    // 添加
    addAccount() {
      let data = this.account;
      data.operatorLoginPwd = md5(data.operatorLoginPwd);
      data.roleIdList.push(this.roleList[this.curRoleIndex].id);
      regAppOperator(data).then(res => {
        this.initData();
        util.showToastSuccess("添加成功!");
      });
    },

    // 编辑
    editAccount() {
      modifyAppOperator(this.account).then(res => {
        this.initData();
        util.showToastSuccess("编辑成功!");
        util.navigateBack();
      });
    },

    // 获取账号详情
    getAccountDetail() {
      getAppOperatorInfo(this.id).then(res => {
        const _info = res.operator;
        this.account = _info;
        const _curRoleId = _info.roleIdList[0];
        const _accountType = this.accountType;
        const _roleList = this.roleList;
        for (const i in _accountType) {
          if (_accountType[i].type === _info.operatorType) {
            this.curAccountTypeIndex = i;
            break;
          }
        }
        for (const i in _roleList) {
          if (_roleList[i].id === _curRoleId) {
            this.curRoleIndex = i;
            break;
          }
        }
      });
    },

    // 获取所有角色
    getRoleListAll() {
      getAppRoleListAll().then(res => {
        this.roleList = res.list;
      });
    }
  }
};
</script>

<style lang="scss">
.account-form {
  .form-content {
    padding-bottom: 110upx;
    margin-bottom: 20upx;
    .account-type,
    .account-role {
      padding: 0 30upx;
      background-color: #fff;
      .picker-text {
        text-align: left !important;
      }
    }
  }
  .form-operate {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 10upx 30upx;
    background-color: #fff;
    z-index: 99;
  }
}
</style>
