<template >
  <view class="code-area">
    <view class="flex-box">
      <input :value="val" type="text" focus="true" :maxlength="maxlength" class="hide-input" @input="getVal" />

      <view v-bind:class="['item', { active: codeIndex == i }]" v-for="i of maxlength" :key="i">
        <view class="line"></view>
        <block v-if="isPwd && codeArr.length >= i+1">
          <text class="dot">.</text>
        </block>
        <block v-else> {{ codeArr[i] ? codeArr[i] : ''}}</block>
      </view>

    </view>
  </view>
</template>

<script>
import { uniIcons } from "@dcloudio/uni-ui";
import util from "@/common/utils";

export default {
  name: "mInputCode",
  components: { uniIcons },
  props: {
    //最大长度 值为4或者6
    maxlength: {
      type: [Number, String],
      default: 4
    },
    //是否是密码
    isPwd: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      codeIndex: 0, //下标
      codeArr: [],
      val: "" //输入框的值
    };
  },
  computed: {},
  watch: {
    value(e) {
      this.getVal({ detail: { value: e } });
    }
  },
  created() {},

  mounted() {},

  methods: {
    //取值
    getVal(e) {
      let { value } = e.detail;
      this.val = value;
      // console.log("验证码:", value);
      let arr = value.split("");
      this.codeIndex = arr.length;
      this.codeArr = arr;
      // console.log(this.codeIndex, this.codeArr);
      if (this.codeIndex == Number(this.maxlength)) {
        //输入完成
        this.$emit("finish", this.codeArr.join(""));
      }
    },
    //清除验证码或者密码
    clear() {
      this.codeIndex = 1;
      this.codeArr = [];
      this.val = "";
    }
  }
};
</script>

<style lang="scss">
.code-area {
  text-align: center;
  .flex-box {
    display: flex;
    flex-wrap: wrap;
    position: relative;
    justify-content: space-around;
  }
  .item {
    flex: 1;
    position: relative;
    height: 80upx;
    font-size: 30upx;
    font-weight: bold;
    color: #333333;
    line-height: 82upx;
  }
  .item::after {
    position: absolute;
    content: "";
    top: 0;
    right: 0;
    bottom: 0;
    width: 2rpx;
    -webkit-transform: scaleX(0.5);
    transform: scaleX(0.5);
    overflow: hidden;
    background-color: #ddd;
  }
  .item:last-child::after {
    width: 0;
  }
  .active {
    border-color: #0d6eb8;
  }
  .active .line {
    display: block;
  }
  .line {
    display: none;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 2upx;
    height: 40upx;
    background: #0d6eb8;
    animation: twinkling 1s infinite ease;
  }
  .hide-input {
    position: absolute;
    top: 0;
    left: -100%;
    width: 200%;
    height: 100%;
    text-align: left;
    z-index: 9;
    opacity: 0;
  }
  @keyframes twinkling {
    0% {
      opacity: 0.2;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 0.2;
    }
  }
  .dot {
    display: inline-block;
    width: 30upx;
    height: 30upx;
    margin: 0 auto;
    background-color: #333;
    border-radius: 50%;
    overflow: hidden;
  }
}
</style>
