<template>
  <view class="pages payment">
    <view class="pay-money">
      应付金额：<text>{{payMoney}}</text> 元
    </view>

    <view class="pay-title">选择支付方式：</view>
    <view class="pay-type">
      <view :class="payType==item.type?'pay-type-itme checked':'pay-type-itme'" v-for="(item,index) in providerList" :key="index" @tap="checkPayType(index)">
        <uni-icons :type="item.type=='alipay'?'alipay':item.type=='wxpay'?'weixin':'weibo'" size="24" color="#4bc065" class="pay-type-logo" />
        <view class="pay-type-name">{{item.name}}支付</view>
        <uni-icons v-if="payType==item.type" type="checkbox-filled" size="20" color="#e00000" class="pay-type-icon" />
        <uni-icons v-else type="circle" size="20" class="pay-type-icon" />
      </view>
    </view>

    <view class="pay-button">
      <form @submit="requestPayment" :report-submit='true'>
        <button type="default" class="but-pay" form-type="submit" :disabled="canPay">确认支付</button>
      </form>
      <button type="default" class="but-cancel-pay" @click="cancelPay">取消支付</button>
    </view>
  </view>
</template>

<script>
import { uniIcons } from "@dcloudio/uni-ui";
import { saveFormId } from "@/common/api";
import util from "@/common/utils";
import { mapState } from "vuex";
export default {
  name: "payment",
  components: { uniIcons },

  data() {
    return {
      payType: "wxpay",
      providerList: [],
      payMoney: 0,
      curBalance: 0,
      canPay: !1
    };
  },

  computed: {},

  created() {},

  mounted() {},

  methods: {
    checkPayType(i) {
      this.payType = this.providerList[i].type;
    },

    requestPayment(e) {
      saveFormId(e.detail.formId);
      this.surePay();
    },

    //确认支付
    surePay() {
      util.requestPayment(this.payType, {}).then(res => {
        console.log(res);
      });
    },

    //取消支付
    cancelPay() {
      util.navigateBack(1);
    }
  },

  onLoad(options) {
    util.getProvider("payment").then(res => {
      console.log(res);
      this.providerList = res.provider.map(value => {
        switch (value) {
          case "alipay":
            return {
              name: "支付宝",
              type: value
            };
          case "wxpay":
            return {
              name: "微信",
              type: value
            };
        }
      });
    });
  }
};
</script>


<style lang="scss">
.payment {
  position: relative;
  .pay-money {
    padding: 20px 15px;
    text {
      font-size: 20px;
      color: #e00000;
    }
  }
  .pay-title {
    padding: 10px 15px;
    font-weight: bold;
    background-color: $uni-text-color-inverse;
    font-size: 16px;

    text {
      font-weight: normal;
      font-size: 15px;
    }
  }
  .pay-type {
    padding: 10px 15px;
    background-color: $uni-text-color-inverse;
    .pay-type-itme {
      display: flex;
      align-items: center;
      justify-content: space-around;
      margin-bottom: 10px;
      padding: 10px 15px;
      border: 1px solid #eee;
      border-radius: 4px;
      .pay-type-logo {
        width: 24px;
        height: 24px;
        margin-right: 10px;
      }
      .pay-type-name {
        width: calc(100% - 60px);
        font-size: 16px;
        text {
          margin-left: 5px;
          font-size: 13px;
          color: #0ae;
        }
      }
    }
    .pay-type-itme.checked {
      border-color: #e00000;
    }
  }
  .pay-button {
    margin: 30px 15px 10px;
    .but-pay {
      margin-bottom: 15px;
    }
    .but-cancel-pay {
      color: $uni-text-color;
      background-color: $uni-bg-color-hover;
    }
  }
}
</style>
