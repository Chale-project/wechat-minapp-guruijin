<template>
  <view class="pages system">
    <van-cell-group>
      <van-cell value=" " :title="v.name" value-class="textstyle" v-for="(v,i) of systemList" :key="i" is-link @click="navigateToPath(v)" />
    </van-cell-group>
    <view class="submit-button">
      <form @submit="loginOut" class="operation-form-but" :report-submit='true'>
        <button type="default" class="but-login-out" form-type="submit">退出登录</button>
      </form>
    </view>

  </view>
</template>

<script>
import util from "@/common/utils";
import { mapActions } from "vuex";

export default {
  name: "system",
  components: {},
  data() {
    return {
      systemList: [
        { name: "账号属性配置", path: "/pages/subPackageD/system/property" }
      ]
    };
  },
  computed: {},
  watch: {},

  onLoad(options) {},

  onShow() {},

  mounted() {},

  methods: {
    ...mapActions("user", ["Logout"]),

    // 链接跳转
    navigateToPath(e) {
      const _url = e.path;
      util.navigateTo(_url);
    },

    // 退出登录
    loginOut(e) {
      util.saveFormid(e.detail.formId);
      this.Logout().then(() => {
        util.showToastSuccess("退出成功！");
        setTimeout(() => {
          util.reLaunch("/pages/home/home");
        }, 500);
      });
    }
  }
};
</script>

<style lang="scss">
.system {
  position: relative;
  .textstyle {
    text-align: right;
    color: #666;
  }
  .submit-button {
    margin: 200upx 30upx 100upx;
  }
}
</style>
