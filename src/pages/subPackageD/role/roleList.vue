<template>
  <view class="pages role-list">
    <view class="role-content">
      <uni-swipe-action v-if="roleList.length>0">
        <uni-swipe-action-item :options="operate" v-for="(v,i) of roleList" :key="i" @click="onTapOperate($event,v.id,i)">
          <role-item :options="v" class="role-list" @click="goToRole(v.id)" />
        </uni-swipe-action-item>

        <no-more :noMore="noMore" />
      </uni-swipe-action>

      <empty v-else desc="没有岗位哦~" />
    </view>

    <view class="role-operate">
      <form @submit="navigateToRoleAdd" class="operation-form-but" :report-submit='true'>
        <button type="default" class="operate-role-creater" form-type="submit">添加岗位</button>
      </form>
    </view>

    <!-- 模态操作 -->
    <modal ref="modal" :title="operates.title" :message="operates.message" @confirm="onConfirmOperate" />

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
import modal from "@/components/modal";
import roleItem from "./role-item";
import util from "@/common/utils";
import { getAppRoleList, setAppRoleState, deleteAppRole } from "@/common/api";

export default {
  name: "roleList",
  components: {
    empty,
    noMore,
    modal,
    uniIcons,
    roleItem,
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

      roleList: [],
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
        }
      ],

      operates: {
        id: null,
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
    this.getRoleList();
  },

  methods: {
    // initData
    initData() {
      this.curPage = 1;
      this.roleList = [];
    },

    // 点击按钮组事件
    onTapOperate(e, id, _index) {
      const index = e.index;
      const title = e.content.text;
      this.operates.id = id;
      this.operates.index = _index;
      switch (index) {
        case 0:
          this.operates.type = "disabled";
          this.operates.title = "禁用";
          this.operates.message = "确认要禁用此岗位吗？";
          break;
        case 1:
          this.operates.type = "enabled";
          this.operates.title = "启用";
          this.operates.message = "确认要启用此岗位吗？";
          break;
        case 2:
          this.operates.type = "delete";
          this.operates.title = "删除";
          this.operates.message = "确认要删除此岗位吗？";
          break;
      }
      this.$refs.modal.openPopup();
    },

    // 模态确认操作
    onConfirmOperate() {
      const _type = this.operates.type;
      switch (_type) {
        case "disabled":
          this.setRoleStatus();
          break;
        case "enabled":
          this.setRoleStatus();
          break;
        case "delete":
          this.removeRole();
          break;
      }
      this.$refs.modal.closePopup();
    },

    // 跳转岗位管理
    toRoleManage() {},

    // 跳转到岗位添加页面
    navigateToRoleAdd(e) {
      util.saveFormid(e.detail.formId);
      util.navigateTo("/pages/subPackageD/role/roleAdd");
    },

    // 跳转岗位编辑
    goToRole(id) {
      util.navigateTo(`/pages/subPackageD/role/roleAdd?id=${id}`);
    },

    // 禁用or启用
    setRoleStatus() {
      const _index = this.operates.index;
      const _roleList = this.roleList;
      const _data = {
        id: this.operates.id,
        status: this.operates.type
      };
      setAppRoleState(_data).then(res => {
        util.showToastSuccess("操作成功!");
        _roleList[_index].roleStatus = this.operates.type;
      });
    },

    // 删除岗位
    removeRole() {
      const _index = this.operates.index;
      const _roleList = this.roleList;
      deleteAppRole(this.operates.id).then(res => {
        util.showToastSuccess("删除成功!");
        _roleList.splice(_index, 1);
      });
    },

    // 获取岗位列表
    getRoleList() {
      const _data = {
        currentPage: this.curPage,
        pageSize: this.pageSize,
        where: {}
      };
      getAppRoleList(_data).then(res => {
        const data = res.page;
        this.allPage = data.totalPage;

        let list = this.roleList;
        const _list = data.list;
        if (_list.length > 0) {
          if (_list.length < this.pageSize) this.noMore = !0;
          else this.noMore = !1;

          let _newList = [...list, ..._list];
          this.roleList = _newList;
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
    if (this.curPage <= this.allPage) this.getRoleList();
    else this.noMore = !0;
  }
};
</script>

<style lang="scss">
.role-list {
  .role-content {
    padding-bottom: 110upx;
    margin-bottom: 20upx;
    .role-list {
      width: 100%;
      flex: 1;
    }
  }
  .role-operate {
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
