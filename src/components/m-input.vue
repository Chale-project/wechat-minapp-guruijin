<template>
  <view class="m-input-view">
    <input :focus="focus_" :type="inputType" :value="value" :maxlength="maxlength" @input="onInput" class="m-input-input" :placeholder="placeholder" :password="type==='password'&&!showPassword" @focus="onFocus" @blur="onBlur" @confirm="onConfirm" />
    <!-- 优先显示密码可见按钮 -->
    <view v-if="clearable_&&!displayable_&&value.length" class="m-input-icon">
      <uni-icons color="#666" type="clear" @click="clear"></uni-icons>
    </view>
    <view v-if="displayable_" class="m-input-icon">
      <uni-icons type="eye" :color="showPassword?'#666':'#ccc'" @click="display"></uni-icons>
    </view>
  </view>
</template>

<script>
import { uniIcons } from "@dcloudio/uni-ui";
export default {
  components: {
    uniIcons
  },
  props: {
    /**
     * 输入类型
     */
    type: String,
    /**
     * 值
     */
    value: String,
    /**
     * 占位符
     */
    placeholder: String,
    /**
     * 最大长度
     */
    maxlength: {
      type: [Number, String],
      default: -1
    },
    /**
     * 是否显示清除按钮
     */
    clearable: {
      type: [Boolean, String],
      default: false
    },
    /**
     * 是否显示密码可见按钮
     */
    displayable: {
      type: [Boolean, String],
      default: false
    },
    /**
     * 自动获取焦点
     */
    focus: {
      type: [Boolean, String],
      default: false
    }
  },
  model: {
    prop: "value",
    event: "input"
  },
  data() {
    return {
      /**
       * 显示密码明文
       */
      showPassword: false,
      /**
       * 是否获取焦点
       */
      isFocus: false
    };
  },
  computed: {
    inputType() {
      const type = this.type;
      return type === "password" ? "text" : type;
    },
    clearable_() {
      return String(this.clearable) !== "false";
    },
    displayable_() {
      return String(this.displayable) !== "false";
    },
    focus_() {
      return String(this.focus) !== "false";
    }
  },
  methods: {
    clear() {
      this.$emit("input", "");
    },
    display() {
      this.showPassword = !this.showPassword;
    },
    onFocus() {
      this.isFocus = true;
    },
    onBlur() {
      this.$nextTick(() => {
        this.isFocus = false;
      });
    },
    onInput(e) {
      this.$emit("input", e.target.value);
    },
    onConfirm(e) {
      this.$emit("confirm", e.target.value);
    }
  }
};
</script>

<style lang="scss">
.m-input-view {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding: 0 10px;
}
.m-input-input {
  width: 100%;
  line-height: inherit;
  background-color: rgba(0, 0, 0, 0);
}
.m-input-icon {
  width: 20px;
  font-size: 20px;
  line-height: 20px;
  color: #666666;
}
</style>