<template>
  <view class="pages print">
    <view class="print-top">
      <view class="print-type">
        <view class="print-type-label">
          <view class="label-icon">
            <image src="/static/images/icon_label.png" mode="widthFix" />
          </view>
          <view class="label-text">打印类型：</view>
        </view>
        <view class="print-type-value">
          <picker @change="onChangePrintType" mode="selector" :value="printTypeIndex" :range="printTypeList">
            <view class="picker">
              <view class="picker-text ellipsis"><text>{{printTypeList[printTypeIndex]}}</text></view>
              <view class="picker-icon">
                <uni-icons type="arrowright" color="#666" size="25" />
              </view>
            </view>
          </picker>
        </view>
      </view>
    </view>

    <view class="print-content">
      <van-cell-group>
        <van-cell :value="print.goodsId?print.goodsName:'请选择商品'" title="商品" is-link @click="showChoiceGoods" value-class="textstyle" />
        <view class="goods-product-date">
          <view class="date-label">生产日期</view>
          <view class="date-value">
            <picker mode="date" :value="print.goodsDateYear+'-'+print.goodsDateMonth+'-'+print.goodsDateDay" @change="onChangeDate">
              <view class="picker">
                <view class="picker-text ellipsis"><text>{{print.goodsDateYear+'-'+print.goodsDateMonth+'-'+print.goodsDateDay}}</text></view>
                <view class="picker-icon">
                  <uni-icons type="arrowright" color="#666" size="20" />
                </view>
              </view>
            </picker>
          </view>
        </view>
        <van-field type="number" :value="print.number" label="张数" placeholder="请输入打印张数（默认1张）" @change="onChangeNumber" input-class="textstyle" />
      </van-cell-group>
    </view>

    <view class="print-preview">
      <view class="preview-header">效果预览：</view>
      <view class="preview-body">
        <view class="print-effect print-effect-A">
          <view class="print-effect-A-left">
            <view class="print-logo">
              <canvas canvas-id='edit_area_canvas_logo' :style="{width:'80px',height:'88px',margin:'0 auto'}"></canvas>
            </view>
            <view class="print-qrcode">二维码</view>
          </view>
          <view class="print-effect-A-center">
            <view class="company-info">
              <view class="company-name"> {{print.companyName}} </view>
              <view class="company-en-name ellipsis"> {{print.companyEnName}} </view>
            </view>
            <view class="goods-info">
              <view class="item-info">
                <view class="item-label">产品名称：</view>
                <view class="item-value ellipsis">{{print.goodsName}}</view>
              </view>
              <view class="item-info">
                <view class="item-label">型号规格：</view>
                <view class="item-value ellipsis">{{print.goodsSpec}}</view>
              </view>
              <view class="item-info">
                <view class="item-label"><text style="padding-right: 28px;">数</text>量：</view>
                <view class="item-value ellipsis">{{print.goodsNumber}}</view>
              </view>
              <view class="item-info">
                <view class="item-label">生产日期：</view>
                <view class="item-value">{{print.goodsDateYear}}年{{print.goodsDateMonth}}月{{print.goodsDateDay}}日</view>
              </view>
              <view class="item-info">
                <view class="item-label">生产单位：</view>
                <view class="item-value ellipsis">{{print.companyName}}</view>
              </view>
              <view class="item-info">
                <view class="item-label">监制单位：</view>
                <view class="item-value ellipsis">{{print.goodsSupervise}}</view>
              </view>
              <view class="item-info">
                <view class="item-label">生产地址：</view>
                <view class="item-value ellipsis">{{print.companyAddress}}</view>
              </view>
              <view class="item-info">
                <view class="item-label">联系电话：</view>
                <view class="item-value ellipsis">{{print.companyTel}}</view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="print-footer">
      <view class="operate">
        <view class="operate-left">
          合计：<text>{{print.number}}</text>张
        </view>
        <view class="operate-right">
          <button type="default" class="but-print" @tap="onTapPrintLabel">
            <image src="/static/images/icon_print.png" mode="widthFix" />
            <text>确认打印</text>
          </button>
        </view>
      </view>
    </view>

    <!-- bluetooth -->
    <bluetooth ref="bluetooth" :bluetoothList="bleList" @connect="connectBle" />

    <popup-bottom ref="popupbottom" @confirm="onConfirmChoice">
      <scroll-view class="popup-scroll-area" scroll-y="true" bindscrolltolower="onReachBottom" :style="{height:(sysinfo.windowHeight-150)+'px'}">
        <view class="goods-container" v-if="goodsList.length>0">
          <view class="goods-item" v-for="(v,i) of goodsList" :key="i" @tap="onTapChoicePrintGoods(i)">
            <view class="list-checkbox">
              <uni-icons type="checkbox-filled" size="24" color="#0d6eb8" v-if="v.checked" />
              <uni-icons type="circle" size="24" color="#ddd" v-else />
            </view>
            <view class="goods-thumb">
              <image :src="v.coverImage?v.coverImage:defaultImage" @error="errImg(i)" />
            </view>
            <view class="goods-others">
              <view class="goods-title ellipsis">{{v.goodsTitle}}</view>
              <view class="goods-spec ellipsis">{{v.specificationName}} {{v.specificationAttributes}}</view>
              <view class="goods-volume ellipsis">{{v.parameters}}</view>
              <view class="goods-sales-stock ellipsis"><text class="sales">装件数{{v.battlementNum}}块</text></view>
            </view>
          </view>

          <no-more :noMore="noMore" />
        </view>
        <empty v-else desc="没有添加商品哦~" />

      </scroll-view>
    </popup-bottom>

  </view>
</template>

<script>
import { uniIcons } from "@dcloudio/uni-ui";
import bluetooth from "@/components/bluetooth";
import empty from "@/components/empty";
import noMore from "@/components/no-more";
import popupBottom from "@/components/popup-bottom";
import mPicker from "@/components/m-picker";

import util from "@/common/utils";

import tsc from "@/common/print/tsc";
import esc from "@/common/print/esc";
import encode from "@/common/print/encoding";

import { getGoodsListOrder, getGoodsPrintCode } from "@/common/api";

import { mapGetters, mapMutations, mapActions } from "vuex";

import print from "@/common/print/print";

const Print = new print();
export default {
  name: "print",
  components: {
    uniIcons,
    bluetooth,
    empty,
    noMore,
    popupBottom,
    mPicker
  },
  data() {
    return {
      printTypeList: ["商品标签"],
      printTypeIndex: 0,
      //查询
      queryTrem: {
        categoryId: null,
        status: "put",
        addDateTime: null,
        sales: null,
        stock: null,
        keywords: null
      },
      //分页
      curPage: 1,
      pageSize: 20,
      allPage: 0,
      noMore: !1,

      //
      goodsList: [],

      //
      goodsQrCodeArr: [],

      print: {},

      defaultImage: "/static/images/default_logo_1x1.jpg"
    };
  },
  computed: {
    ...mapGetters(["sysinfo", "bleList", "BLEInformation", "bleConnectStatus"])
  },
  watch: {
    bleList() {
      this.openBle();
    },

    bleConnectStatus() {
      const _deviceId = this.BLEInformation.deviceId;
      const _bleList = this.bleList;
      const _status = this.bleConnectStatus;
      _bleList.map(item => {
        item.loading = false;
        if (item.deviceId == _deviceId && _status) item.status = true;
        else item.status = false;
      });
    },

    print: {
      handler(e) {
        if (e.goodsId && e.number) this.getGoodsPrintQrCode();
      },
      deep: true
    }
  },

  onLoad() {
    this.initData();

    if (this.BLEInformation.deviceId) {
      this.CreateBLEConnection(this.BLEInformation.deviceId);
    } else {
      this.OpenBluetoothAdapter();
    }

    uni.notifyBLECharacteristicValueChange({
      deviceId: this.BLEInformation.deviceId,
      serviceId: this.BLEInformation.notifyServiceId,
      characteristicId: this.BLEInformation.notifyCharaterId,
      state: true,
      success: res => {
        uni.onBLECharacteristicValueChange(r => {
          console.log(
            `characteristic ${r.characteristicId} has changed, now is ${r}`
          );
        });
      },
      fail: e => {},
      complete: e => {}
    });

    this.getGoodsList();
  },

  onShow() {
    this.drawPrintLabelLogo();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    uni.closeBLEConnection({
      deviceId: this.BLEInformation.deviceId,
      success: function(res) {
        console.log("关闭蓝牙成功");
      }
    });
  },

  methods: {
    ...mapMutations("ble", ["SET_CURRENT_PRINT"]),

    ...mapActions("ble", ["OpenBluetoothAdapter", "CreateBLEConnection"]),

    // initData
    initData() {
      this.goodsQrCodeArr = [];
      const _print = {
        number: 1,
        companyName: "武汉固瑞锦建材有限公司",
        companyEnName: "Wuhan Guruijin building materials Co., Ltd",
        companyAddress: "武汉市青山区工人村特1号",
        companyTel: "027-59880651",
        goodsId: null,
        goodsQrCode: "固瑞锦建材",
        goodsName: "双8植草砖",
        goodsSpec: "400*400*80",
        goodsNumber: "108",
        goodsColor: "",
        goodsDateYear: new Date().getFullYear(),
        goodsDateMonth: new Date().getMonth() + 1,
        goodsDateDay: new Date().getDate(),
        goodsSupervise: "中冶武汉冶金建筑研究院",
        printLogo: "/static/images/print_logo.png"
      };
      this.print = _print;
    },

    // 打开蓝牙列表
    openBle() {
      if (this.bleList.length > 0) {
        const _bleList = this.bleList;
        _bleList.map(item => {
          item.loading = false;
        });
        this.$refs.bluetooth.openPopup();
      }
    },

    // 关闭蓝牙列表
    closeBle() {
      this.$refs.bluetooth.closePopup();
    },

    // 连接蓝牙
    connectBle(e) {
      const _deviceId = e.deviceId;
      const _bleList = this.bleList;
      _bleList.map(item => {
        if (item.deviceId == _deviceId) item.loading = true;
        else item.loading = false;
      });
      this.CreateBLEConnection(_deviceId);
    },

    //选择打印类型
    onChangePrintType(e) {
      this.printTypeIndex = e.detail.value;
    },

    // 选择商品
    showChoiceGoods() {
      this.$refs.popupbottom.openPopup();
    },

    // 打印条码
    onChangeCode() {
      this.print.code = e.detail;
    },

    // 生产日期
    onChangeDate(e) {
      const dateArr = e.detail.value.split("-");
      this.print.goodsDateYear = dateArr[0];
      this.print.goodsDateMonth = dateArr[1];
      this.print.goodsDateDay = dateArr[2];
    },

    // 打印数量
    onChangeNumber(e) {
      this.print.number = e.detail;
    },

    // canvas画logo
    drawPrintLabelLogo() {
      const ctx = uni.createCanvasContext("edit_area_canvas_logo");
      ctx.drawImage(this.print.printLogo, 0, 0, 80, 88);
      ctx.draw();
    },

    // 打印标签
    onTapPrintLabel() {
      const flag = this.checkData();
      if (flag) {
        this.printLabel();
      }
    },

    // 打印
    printLabel() {
      //标签测试
      const command = tsc.jpPrinter.createNew();
      command.setSize(90, 60); //719*479
      command.setGap(2);
      command.setCls();
      command.setBar(10, 15, 699, 2);
      command.setBar(709, 15, 2, 449);

      command.setQR(39, 250, "L", 4, "A", this.print.goodsId);
      command.setText(175, 55, "TSS24.BF2", 2, 2, this.print.companyName);
      command.setText(179, 108, "TSS24.BF2", 1, 1, this.print.companyEnName);

      command.setText(
        169,
        148,
        "TSS24.BF2",
        1,
        1,
        "产品名称：" + this.print.goodsName + " " + this.print.goodsColor
      );
      command.setText(
        169,
        180,
        "TSS24.BF2",
        1,
        1,
        "型号规格：" + this.print.goodsSpec
      );
      command.setText(
        169,
        212,
        "TSS24.BF2",
        1,
        1,
        "数    量：" + this.print.goodsNumber + "（块）"
      );
      command.setText(
        169,
        244,
        "TSS24.BF2",
        1,
        1,
        "生产日期：" +
          this.print.goodsDateYear +
          " 年" +
          this.print.goodsDateMonth +
          " 月"+
          this.print.goodsDateDay +
          " 日"
      );
      command.setText(
        169,
        276,
        "TSS24.BF2",
        1,
        1,
        "生产单位：" + this.print.companyName
      );
      command.setText(
        169,
        308,
        "TSS24.BF2",
        1,
        1,
        "监制单位：" + this.print.goodsSupervise
      );
      command.setText(
        169,
        340,
        "TSS24.BF2",
        1,
        1,
        "生产地址：" + this.print.companyAddress
      );
      command.setText(
        169,
        372,
        "TSS24.BF2",
        1,
        1,
        "联系电话：" + this.print.companyTel
      );
      command.setBar(10, 464, 699, 3);
      command.setBar(10, 15, 2, 449);

      // command.setBar(0, 348, 639, 1);
      // command.setBarCode(320, 180, "EAN8", 64, 1, 3, 3, "0123456");

      uni.canvasGetImageData({
        canvasId: "edit_area_canvas_logo",
        x: 0,
        y: 0,
        width: 80,
        height: 88,
        success: res => {
          command.setBitmap(54, 67, 1, res);
        },
        complete: () => {
          command.setPagePrint();
          Print.setPrinterNum = this.print.number;
          Print.prepareSend(command.getData());
        }
      });
    },

    // 选择要打印的商品
    onTapChoicePrintGoods(i) {
      let _goodsList = this.goodsList;
      _goodsList.map((item, index) => {
        if (index == i) {
          item.checked = !0;
          this.setPrintGoods(item);
        } else item.checked = !1;
      });
    },

    // 设置打印商品
    setPrintGoods(obj) {
      this.print.goodsId = obj.id;
      this.print.goodsName = obj.goodsTitle;
      this.print.goodsSpec = obj.parameters;
      this.print.goodsNumber = obj.battlementNum;
    },

    // 数据校验
    checkData() {
      const nReg = /^\d+$/;

      if (!this.print.goodsId) {
        util.showToastError("请选择商品！");
        return false;
      } else if (!this.print.goodsDateMonth) {
        util.showToastError("请选择商品生成日期！");
        return false;
      } else if (!nReg.test(this.print.number)) {
        util.showToastError("请输入正确的打印张数！");
        return false;
      } else if (this.print.number < 1) {
        util.showToastError("请至少打印1张！");
        return false;
      } else {
        return true;
      }
    },

    // 确认选择
    onConfirmChoice(e) {
      util.saveFormid(e.detail.formId);
      this.$refs.popupbottom.closePopup();
    },

    // 获取商品打印唯一码
    getGoodsPrintQrCode() {
      const _data = {
        id: this.print.goodsId,
        count: this.print.number
      };
      getGoodsPrintCode(_data).then(res => {
        const _list = res.result.codeList;
        if (_list.length > 0) {
          this.goodsQrCodeArr = _list;
        }
      });
    },

    // 获取商品列表
    getGoodsList() {
      const _data = {
        currentPage: this.curPage,
        pageSize: this.pageSize,
        where: this.queryTrem
      };
      getGoodsListOrder(_data).then(res => {
        const data = res.page;
        this.allPage = data.totalPage;

        let list = this.goodsList;
        const _list = data.list;
        if (_list.length > 0) {
          if (_list.length < this.pageSize) this.noMore = !0;
          else this.noMore = !1;
          _list.map(item => {
            item.checked = !1;
          });
          const _goodsList = [...list, ..._list];
          this.goodsList = _goodsList;
        }
      });
    },

    //处理no found 图片
    errImg(i) {
      this.goodsList[i].coverImage = this.defaultImage;
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.OpenBluetoothAdapter();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    this.curPage = this.curPage + 1;
    if (this.curPage <= this.allPage) this.getGoodsList();
    else this.noMore = !0;
  }
};
</script>

<style lang="scss">
.print {
  background-color: $uni-color-primary;
  &-top {
    padding: $uni-spacing-col-lg $uni-spacing-row-lg;
    .print-type {
      position: relative;
      display: flex;
      align-items: center;
      padding: $uni-spacing-col-lg $uni-spacing-row-lg;
      background-color: $uni-bg-color;
      border-radius: $uni-border-radius-base;
      box-shadow: 0 2upx 10upx rgba(0, 0, 0, 0.4);
      z-index: 99;
      &-label {
        width: 250upx;
        display: flex;
        align-items: center;
        .label-icon {
          margin-right: 20upx;
          image {
            width: 50upx;
          }
        }
        .label-text {
          color: $uni-text-color-grey;
        }
      }
      &-value {
        width: calc(100% - 250upx);
        .picker {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .picker-text {
            width: calc(100% - 60upx);
          }
          .picker-icon {
            width: 50upx;
            height: 50upx;
            line-height: 50upx;
            overflow: hidden;
          }
        }
      }
    }
  }
  &-content {
    margin-top: -50upx;
    padding: 50upx 0;
    background-color: $uni-bg-color;
    z-index: 9;
    .van-cell__title {
      max-width: 90px;
      min-width: 90px;
    }
    .van-cell__value {
      text-align: left;
    }
    .goods-product-date {
      position: relative;
      display: flex;
      align-items: center;
      padding: 20upx 30upx;
      box-sizing: border-box;
      .date-label {
        width: 180upx;
      }
      .date-value {
        width: calc(100% - 180upx);
        .picker {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .picker-text {
            width: calc(100% - 40upx);
          }
          .picker-icon {
            width: 36upx;
            height: 48upx;
            line-height: 48upx;
            text-align: center;
            overflow: hidden;
          }
        }
      }
    }
    .goods-product-date::after {
      @include backgroundLine(30upx, 0, 2upx);
    }
  }
  &-preview {
    padding-bottom: 130upx;
    background-color: $uni-bg-color;
    .preview-header {
      padding: 20upx 30upx;
      font-size: $uni-font-size-lg;
    }
    .preview-body {
      padding: 40upx 30upx;
      .print-effect {
        margin-bottom: 20upx;
        padding: 30upx 20upx;
        border: 1upx solid #a1b7b9;
        border-radius: 8upx;
      }
      .print-effect-A {
        display: flex;
        .print-effect-A-left {
          overflow: hidden;
          .print-logo {
            margin-top: 10upx;
            margin-bottom: 54upx;
            text-align: center;
            image {
              width: 80upx;
            }
          }
          .print-qrcode {
            width: 130upx;
            height: 130upx;
            margin: 0 auto;
            line-height: 130upx;
            border: 1upx solid #a1b7b9;
            background-color: #bae0e3;
            font-size: 38upx;
            text-align: center;
            color: #fff;
          }
        }
        .print-effect-A-center {
          overflow: hidden;
          .company-info {
            margin-bottom: 10upx;
            text-align: center;
            .company-name {
              font-size: 40upx;
              color: #000;
            }
            .company-en-name {
              font-size: 24upx;
            }
          }
          .goods-info {
            padding-left: 20upx;
            .item-info {
              display: flex;
              align-items: center;
              .item-label {
                width: 144upx;
              }
              .item-value {
              }
            }
            .bar-code-info {
              width: 90%;
              margin: 10upx auto;
              border: 1upx solid #a1b7b9;
              background-color: #bae0e3;
              text-align: center;
              color: #fff;
            }
          }
        }
      }
    }
  }
  &-footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 90;
    background-color: #f8f8f8;
    box-shadow: 0 2rpx 2rpx rgba(0, 0, 0, 0.7);
    .operate {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20upx 30upx;
      .operate-left {
      }
      .operate-right {
        .but-print {
          image {
            width: 40upx;
            margin-right: 10upx;
          }
        }
      }
    }
  }
}

.popup-scroll-area {
  height: 100px;
  .goods-container {
    position: relative;
    .goods-item {
      position: relative;
      padding: 20upx 30upx;
      display: flex;
      align-items: center;
      .list-checkbox {
        width: 48upx;
        margin-right: 10upx;
      }
      .goods-thumb {
        position: relative;
        width: 130upx;
        height: 130upx;
        margin-right: 20upx;
        overflow: hidden;
        border-radius: $uni-border-radius-base;
        image {
          width: 100%;
          height: 100%;
        }
      }
      .goods-others {
        width: calc(100% - 208upx);
        .goods-title,
        .goods-spec,
        .goods-volume,
        .goods-sales-stock,
        .goods-time {
          margin-bottom: 4upx;
          font-size: 24upx;
          color: #999;
          .stock {
            padding-left: 10upx;
          }
        }
        .goods-title {
          font-size: 28upx;
          color: #333;
        }
        .goods-time {
          margin-bottom: 0;
        }
      }
    }
    .goods-item::after {
      @include backgroundLine(30upx, 0, 2upx);
    }
    .goods-item:last-child::after {
      @include backgroundLine(0, 0, 0);
    }
  }
}
</style>
