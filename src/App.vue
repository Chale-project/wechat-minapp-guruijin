<script>
import { mapMutations, mapActions } from "vuex";

export default {
  onLaunch() {
    this.GetSystemInfoSync().then(res => {
      this.SET_BLEINFO_PLATFORM(res.platform);
    });
    this.CheckLogin().then(res => {
      if (res) {
        this.GetAuthNavList();
        this.GetPermissionList();
      }
    });
    console.log("App Launch");
  },
  onShow() {
    console.log("App Show");
  },
  onHide() {
    console.log("App Hide");
  },
  methods: {
    ...mapMutations("ble", ["SET_BLEINFO_PLATFORM"]),
    ...mapActions("sys", ["GetSystemInfoSync"]),
    ...mapActions("user", ["CheckLogin"]),
    ...mapActions("permission", ["GetAuthNavList", "GetPermissionList"])
  }
};
</script>

<style lang="scss">
/*每个页面公共css */
@import "./static/css/common.scss";
</style>
