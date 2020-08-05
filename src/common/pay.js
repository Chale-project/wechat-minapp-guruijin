/**
 * 支付相关服务
 */
import { payment } from '@/common/api';
import util from '@/common/utils';
/**
 * 支付
 */
function payOrder(data) {
  return new Promise(function (resolve, reject) {
    payment(data).then((res) => {
      // console.log('请求接口shoubei/pay后的结果', res)
      const payParam = res.result;
      // console.log('payParam这些应该是后台计算好的签名等', payParam.timeStamp)
      const timeStampParam = payParam.timeStamp ? payParam.timeStamp : '';
      const nonceStrParam = payParam.nonceStr ? payParam.nonceStr : '';
      const packageParam = payParam.packages ? payParam.packages : '';
      const signTypeParam = payParam.signType ? payParam.signType : '';
      const paySignParam = payParam.paySign ? payParam.paySign : '';
      util.getProvider('payment').then(res => {
        const provider = res.provider
        uni.requestPayment({
          provider: provider,
          orderInfo: "",
          timeStamp: timeStampParam,
          nonceStr: nonceStrParam,
          package: packageParam,
          signType: signTypeParam,
          paySign: paySignParam,
          success: function (res) {
            resolve(res);
          },
          fail: function (res) {
            reject(res);
          },
          complete: function (res) {
            reject(res);
          }
        });
      })

    }).catch(err => {
      reject(err);
    });
  });
}

const pay = {
  payOrder
}

export default pay
