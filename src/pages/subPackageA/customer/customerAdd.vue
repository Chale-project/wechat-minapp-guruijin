<template>
  <view class="pages customer-form">
    <view class="form-content">
      <van-cell-group>
        <van-field :value="customer.corporateName" label="客户主体" placeholder="请填写客户主体名称" border="false" required @change="onChangeSubject" />
        <van-field :value="customer.corporateNickName" label="客户简称" placeholder="请填写客户简称" border="false" required @change="onChangeSubname" />
        <van-field :value="customer.name" label="联系人" placeholder="请填写联系人姓名" border="false" required @change="onChangeContacts" />
        <van-field :value="customer.phoneNumber" label="手机号" type="number" placeholder="请填写联系人手机号" border="false" maxlength="11" required @change="onChangeMobile" />
        <van-field :value="customer.wxNumber" label="微信号" placeholder="请填写微信号" border="false" @change="onChangeWechat" />
      </van-cell-group>
    </view>

    <view class="form-operate">
      <form @submit="saveCustomer" class="operation-form-but" :report-submit='true'>
        <button type="default" class="operate-customer-add" form-type="submit">保存</button>
      </form>
    </view>
  </view>
</template>

<script>
import { uniIcons } from "@dcloudio/uni-ui";
import util from "@/common/utils";

import {
  registerCustomer,
  getCustomerInfo,
  modifyCustomer
} from "@/common/api";

export default {
  name: "customerAdd",
  components: {
    uniIcons
  },
  data() {
    return {
      operate: "add",
      id: null,
      customer: {}
    };
  },
  computed: {},
  watch: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.initData();
    const _id = options.id;
    if (_id) {
      this.id = _id;
      this.operate = "edit";
      this.getCustomerDetail();
    } else {
      this.id = null;
      this.operate = "add";
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  methods: {
    // initData
    initData() {
      const _customer = {
        corporateName: null,
        corporateNickName: null,
        name: null,
        phoneNumber: null,
        wxNumber: null,
        state: "enabled"
      };
      this.customer = _customer;
    },

    // 客户主体
    onChangeSubject(e) {
      this.customer.corporateName = e.detail;
    },

    // 客户简称
    onChangeSubname(e) {
      this.customer.corporateNickName = e.detail;
    },

    // 联系人
    onChangeContacts(e) {
      this.customer.name = e.detail;
    },

    // 联系人手机号
    onChangeMobile(e) {
      this.customer.phoneNumber = e.detail;
    },

    // 微信
    onChangeWechat(e) {
      this.customer.wxNumber = e.detail;
    },

    // 校验数据
    checkData() {
      const _customer = this.customer;
      const mobileReg = /^(1)[0-9]{10}$/;
      if (!_customer.corporateName) {
        util.showToastError("请填写客户主体！");
        return false;
      } else if (!_customer.corporateNickName) {
        util.showToastError("请填写客户简称！");
        return false;
      } else if (!_customer.name) {
        util.showToastError("请填写联系人！");
        return false;
      } else if (!mobileReg.test(_customer.phoneNumber)) {
        util.showToastError("请填写有效的手机号！");
        return false;
      } else {
        return true;
      }
    },

    // 保存客户信息
    saveCustomer(e) {
      util.saveFormid(e.detail.formId);
      const flag = this.checkData();
      if (flag) {
        switch (this.operate) {
          case "add":
            this.addCustomer();
            break;
          case "edit":
            this.editCustomer();
            break;
        }
      }
    },

    // 添加
    addCustomer() {
      registerCustomer(this.customer).then(res => {
        this.initData();
        util.showToastSuccess("添加成功!");
      });
    },

    // 编辑
    editCustomer() {
      modifyCustomer(this.customer).then(res => {
        this.initData();
        util.showToastSuccess("编辑成功!");
        util.navigateBack();
      });
    },

    // 获取客户详情
    getCustomerDetail() {
      getCustomerInfo(this.id).then(res => {
        this.customer = res.info;
      });
    }
  }
};
</script>

<style lang="scss">
.customer-form {
  .form-content {
    padding-bottom: 110upx;
    margin-bottom: 20upx;
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
