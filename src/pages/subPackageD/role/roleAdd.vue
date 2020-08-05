<template>
  <view class="pages role-form">
    <view class="form-content">
      <van-cell-group>
        <van-field :value="role.roleName" label="岗位名称" placeholder="请填写岗位名称" border="false" required @change="onChangeName" />
        <van-field :value="role.roleRemark" label="岗位描述" placeholder="请填写岗位描述" border="false" required @change="onChangeDescription" />
      </van-cell-group>
      <view class="role-auth">
        <view class="auth-title">
          <view>权限清单</view>
          <view class="choice-all" @tap="onChoiceRole">
            <image :src="`/static/images/icon_${checkAll?'checked':'unchecked'}.png`" mode="widthFix" />
            <text>全选</text>
          </view>
        </view>
        <view class="auth-content">
          <m-tree ref="mTree" show-checkbox :root="roleList" :checked="checkedList" :expand="expandList" :change-handler="onChangeHandlerRole"></m-tree>
        </view>
      </view>
    </view>

    <view class="form-operate">
      <form @submit="saveRole" class="operation-form-but" :report-submit='true'>
        <button type="default" class="operate-role-add" form-type="submit">保存</button>
      </form>
    </view>
  </view>
</template>

<script>
import { uniIcons } from "@dcloudio/uni-ui";
import mPicker from "@/components/m-picker";
import mTree from "@/components/m-tree";
import util from "@/common/utils";

import {
  addAppRole,
  getAppRoleInfo,
  modifyAppRole,
  getAppMenu,
  getAppNav,
  getAppAccountAuth
} from "@/common/api";

export default {
  name: "roleAdd",
  components: {
    uniIcons,
    mPicker,
    mTree
  },
  data() {
    return {
      operate: "add",
      id: null,
      role: {},
      checkAll: !1,
      halfCheckedList: [], // 半选状态
      checkedList: [], // 选中状态
      expandList: [], // 展开list
      roleList: {
        children: []
      }
    };
  },
  computed: {},
  watch: {
    checkedList: {
      handler(e) {},
      deep: true
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.initData();

    this.getMenuList();
    const _id = options.id;
    if (_id) {
      this.id = _id;
      this.operate = "edit";
      this.getRoleDetail();
      util.setNavigationBarTitle("修改岗位-固瑞锦建材");
    } else {
      this.id = null;
      this.operate = "add";
      util.setNavigationBarTitle("添加岗位-固瑞锦建材");
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  methods: {
    // initData
    initData() {
      this.checkAll = !1;
      this.halfCheckedList = [];
      this.checkedList = [];
      const _role = {
        roleName: null,
        roleRemark: null,
        childrenIdList: [],
        menuIdList: [],
        state: "enabled"
      };
      this.role = _role;
    },

    // 岗位名称
    onChangeName(e) {
      this.role.roleName = e.detail;
    },

    // 岗位介绍
    onChangeDescription(e) {
      this.role.roleRemark = e.detail;
    },

    // 权限全选反选
    onChoiceRole(e) {
      this.checkAll = !this.checkAll;
      this.$refs.mTree.toggleAllChecked(this.checkAll);

      const _halfCheckedList = this.$refs.mTree.getAllIndeterminate();
      const _allChecked = this.$refs.mTree.getAllChecked();
      this.halfCheckedList = _halfCheckedList;
      this.checkedList = _allChecked;
    },

    // 监听选项变化事件获取选中项
    onChangeHandlerRole(selected) {
      const _halfCheckedList = this.getAllIndeterminate();
      const _allChecked = this.getAllChecked();
      this.$root.halfCheckedList = _halfCheckedList;
      this.$root.checkedList = _allChecked;
    },

    // 校验数据
    checkData() {
      const _role = this.role;
      const mobileReg = /^(1)[0-9]{10}$/;
      if (!_role.roleName) {
        util.showToastError("请填写岗位名称！");
        return false;
      } else if (!_role.roleRemark) {
        util.showToastError("请填写岗位描述！");
        return false;
      } else if (this.checkedList.length < 1) {
        util.showToastError("请选择该岗位的权限！");
        return false;
      } else {
        return true;
      }
    },

    // 保存账号信息
    saveRole(e) {
      util.saveFormid(e.detail.formId);
      const flag = this.checkData();
      if (flag) {
        switch (this.operate) {
          case "add":
            this.addRole();
            break;
          case "edit":
            this.editRole();
            break;
        }
      }
    },

    // 添加
    addRole() {
      let _data = this.role;
      const _checkedListArr = this.checkedList.map(item => {
        return item.id;
      });
      const _halfCheckedListArr = this.halfCheckedList.map(item => {
        return item.id;
      });
      const _roleListArr = [..._checkedListArr, ..._halfCheckedListArr];
      _data.childrenIdList = _checkedListArr;
      _data.menuIdList = _roleListArr;

      addAppRole(_data).then(res => {
        this.initData();
        util.showToastSuccess("添加成功!");
      });
    },

    // 编辑
    editRole() {
      let _data = this.role;
      const _checkedListArr = this.checkedList.map(item => {
        return item.id;
      });
      const _halfCheckedListArr = this.halfCheckedList.map(item => {
        return item.id;
      });
      const _roleListArr = [..._checkedListArr, ..._halfCheckedListArr];
      _data.childrenIdList = _checkedListArr;
      _data.menuIdList = _roleListArr;

      modifyAppRole(_data).then(res => {
        this.initData();
        util.showToastSuccess("编辑成功!");
        util.navigateBack();
      });
    },

    // 获取岗位详情
    getRoleDetail() {
      getAppRoleInfo(this.id).then(res => {
        const _info = res.role;
        this.role = _info;
        if (_info.childrenIdList.length > 0) {
          this.checkedList = _info.childrenIdList.map(item => {
            return { id: item };
          });
        }
      });
    },

    // 设置权限树展开项（有children的才展开）
    expandRole(arrTree) {
      for (let i in arrTree) {
        if (arrTree[i].children.length > 0) {
          this.expandList.push({ id: arrTree[i].id });
          this.expandRole(arrTree[i].children);
        }
      }
    },

    // 获取所有权限菜单
    getMenuList() {
      getAppMenu()
        .then(res => {})
        .catch(err => {
          const _rootChildren = util.toTree(err);
          this.roleList.children = _rootChildren;
          // 展开全部有children的栏目
          this.expandRole(_rootChildren);
        });
    }
  }
};
</script>

<style lang="scss">
.role-form {
  .form-content {
    padding-bottom: 110upx;
    margin-bottom: 20upx;
    .role-role {
      padding: 0 30upx;
      .picker-text {
        text-align: left !important;
      }
    }
    .role-auth {
      .auth-title {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 24upx 30upx;
        background-color: #fff;
        .choice-all {
          display: flex;
          align-items: center;
          image {
            width: 32upx;
            height: 32upx;
          }
          text {
            margin-left: 10upx;
          }
        }
      }
      .auth-title::before {
        position: absolute;
        content: "*";
        left: 16upx;
        color: #ee0a24;
      }
      .auth-title::after {
        @include backgroundLine(30upx, 0, 2upx);
      }
      .auth-content {
        padding: 24upx 30upx;
        background-color: #fff;
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
