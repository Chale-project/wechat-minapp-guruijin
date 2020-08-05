<template>
  <view class="pages goods-add">
    <view class="goods-banner">
      <m-swiper :images="bannerList" v-if="bannerList.length>0" />
      <view class="banner-empty" v-else @tap="choiceBannerImg">
        <view class="empty-icon">
          <uni-icons type="camera" size="50" color="#fff" />
        </view>
        <view class="empty-text">添加商品图片</view>
      </view>
      <view class="increase-image-but" v-if="0<bannerList.length&&bannerList.length<3" @tap="choiceBannerImg">
        <uni-icons type="camera" size="40" color="#fff" />
      </view>
    </view>

    <view class="goods-public">
      <van-cell-group>
        <van-field :value="goods.goodsTitle" label="标题" placeholder="请填写商品标题" border="false" @change="onChangeTitle" />
        <view class="picker-category">
          <m-picker mode="multiSelector" label="类目" :index="multiIndex" rangekey="name" :range="multiArray" @change="onChangeCategory" @columnchange="onColumnChangeCategory" />
        </view>
      </van-cell-group>
    </view>

    <view class="goods-property">
      <van-cell-group custom-class="property-item" v-for="(v,i) of propertyList" :key="i">
        <van-cell label-class="property-item-index" :title="'第'+(i+1)+'组规格'" border="false" use-right-icon-slot v-if="propertyList.length>1">
          <uni-icons slot="right-icon" type="minus-filled" size="28" color="#f00" @click="subtractPropertyItem" v-if="i!==0" />
        </van-cell>
        <van-field :value="v.specificationName" label="规格" placeholder="请填写商品规格" border="false" use-right-icon-slot @click-icon="choicePropertyImg(i)" @change="onChangeName($event,i)">
          <uni-icons slot="right-icon" type="image" size="28" color="#f00" v-if="!v.specificationImages" />
          <image slot="right-icon" class="property-item-thumb" :src="v.specificationImages?v.specificationImages:'/static/images/default_logo_1x1.jpg'" v-else />
        </van-field>
        <van-field :value="v.codeNumber" label="编码" placeholder="请填写商品编码(由数字或字母组成)" border="false" use-right-icon-slot @click-icon="scanCode(i)" @change="onChangeCode($event,i)">
          <uni-icons slot="right-icon" type="scan" size="28" />
        </van-field>
        <van-field :value="v.barCode" label="条码" type="number" placeholder="请填写商品条码(只能是数字)" border="false" use-right-icon-slot @click-icon="scanBarCode(i)" @change="onChangeBarCode($event,i)">
          <uni-icons slot="right-icon" type="scan" size="28" />
        </van-field>
        <van-field :value="v.sellingPrice" label="价格" type="digit" placeholder="请填写销售价格" border="false" use-right-icon-slot @change="onChangePrice($event,i)">
          <text slot="right-icon" class="unit">元</text>
        </van-field>
        <van-field :value="v.specificationNumber" label="库存" type="number" placeholder="请填写销售库存" border="false" use-right-icon-slot @change="onChangeStock($event,i)">
          <text slot="right-icon" class="unit">件</text>
        </van-field>
        <van-cell :value="v.attribute.length>0?'已选择':'请选择'" title="商品属性" border="false" is-link @click="onChangeAttribute(i)" />
        <view class="attribute-area" v-if="v.attribute.length>0">
          <view class="tag-item" v-for="(k,j) of v.attribute" :key="j">
            <text class="text">{{k.attributeName}}</text>
            <view class="clear" @tap="removeTag(i,j)">
              <uni-icons type="clear" size="16" color="#f00" />
            </view>
          </view>
        </view>
      </van-cell-group>
    </view>

    <view class="goods-increase-property">
      <view class="add-operate" @tap="addPropertyItem">
        <uni-icons slot="right-icon" type="plus" size="16" color="#0d6eb8" />
        <text>增加商品规格</text>
      </view>
    </view>

    <view class="goods-detail">
      <m-editor @input="getGoodsContent" />
    </view>

    <view class="goods-operate">
      <view class="put-store-operate" @tap="saveGoods('out')">
        <view class="icon">
          <image src="/static/images/icon_put_store.png" mode="widthFix" />
        </view>
        <view class="text">
          <text>放入仓库</text>
        </view>
      </view>

      <view class="put-sale-operate">
        <form @submit="saveGoods('put',$event)" class="operation-form-but" :report-submit='true'>
          <button type="default" class="operate-release" form-type="submit">上架销售</button>
        </form>
      </view>
    </view>

    <!-- 图片裁剪上传 -->
    <m-avatar @upload="uploadImage" ref="avatar"></m-avatar>

  </view>
</template>

<script>
import { uniIcons } from "@dcloudio/uni-ui";
import mSwiper from "@/components/m-swiper";
import mInput from "@/components/m-swiper";
import mPicker from "@/components/m-picker";
import mAvatar from "@/components/m-avatar";
import mEditor from "@/components/editor/m-editor";

import util from "@/common/utils";

import { uploadFile, getCategoryList, addGoods } from "@/common/api";

import { mapGetters, mapMutations, mapActions } from "vuex";

export default {
  name: "goodsAdd",
  components: {
    uniIcons,
    mSwiper,
    mInput,
    mPicker,
    mAvatar,
    mEditor
  },
  data() {
    return {
      bannerList: [],
      categoryList: [],
      multiArray: [],
      multiIndex: [0, 0],
      goods: {
        goodsTitle: null,
        goodsSpec: null
      },
      propertyList: []
    };
  },
  computed: {
    ...mapGetters(["attributeObj"])
  },
  watch: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.initData();

    this.getGoodsCategoryList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    const _attributeObj = this.attributeObj;
    if (Object.keys(_attributeObj).length > 0) {
      let _propertyList = this.propertyList;
      _propertyList.map((item, index) => {
        item = Object.assign(item, _attributeObj[index]);
      });
      this.propertyList = _propertyList;
    }
  },

  methods: {
    ...mapMutations("goods", ["SET_ATTRIBUTE_OPTIONS"]),

    // initData
    initData() {
      this.bannerList = [];
      this.multiIndex = [0, 0];
      this.goods.goodsTitle = null;
      this.goods.goodsSpec = null;
      this.propertyList = [];

      const _item = {
        specificationName: null,
        specificationImages: null,
        codeNumber: null,
        barCode: null,
        sellingPrice: null,
        specificationNumber: null,
        attribute: []
      };
      this.propertyList.push(_item);
    },

    // 选择banner图片
    choiceBannerImg() {
      this.$refs.avatar.fChooseImg(-1, {
        selWidth: "600upx",
        selHeight: "600upx",
        expWidth: "750upx",
        expHeight: "750upx",
        canRotate: false,
        stretch: "x",
        lock: "x"
      });
    },

    // 标题
    onChangeTitle(e) {
      this.goods.goodsTitle = e.detail;
    },

    // 选择类目
    onChangeCategory(e) {
      this.categoryIndex = e.detail.value;
    },

    //  监听每一列滚动change事件
    onColumnChangeCategory(e) {
      let _multiArray = this.multiArray;
      let _multiIndex = this.multiIndex;
      _multiIndex[e.detail.column] = e.detail.value;
      switch (e.detail.column) {
        case 0:
          _multiArray[1] = this.categoryList[e.detail.value].children;
          _multiIndex[1] = 0;
          break;
      }
      this.$forceUpdate();
    },

    // 规格名称
    onChangeName(e, i) {
      this.propertyList[i].specificationName = e.detail;
    },

    // 选择规格图
    choicePropertyImg(i) {
      this.$refs.avatar.fChooseImg(i, {
        selWidth: "600upx",
        selHeight: "600upx",
        expWidth: "750upx",
        expHeight: "750upx",
        canRotate: false,
        stretch: "x",
        lock: "x"
      });
    },

    // 规格编码
    onChangeCode(e, i) {
      this.propertyList[i].codeNumber = e.detail;
    },

    // 扫码编码
    scanCode(i) {
      uni.scanCode({
        success: res => {
          this.propertyList[i].codeNumber = res.result;
        }
      });
    },

    // 规格条码
    onChangeBarCode(e, i) {
      this.propertyList[i].barCode = e.detail;
    },

    // 扫码条码
    scanBarCode(i) {
      uni.scanCode({
        success: res => {
          this.propertyList[i].barCode = res.result;
        }
      });
    },

    // 规格价格
    onChangePrice(e, i) {
      this.propertyList[i].sellingPrice = e.detail;
    },

    // 规格库存
    onChangeStock(e, i) {
      this.propertyList[i].specificationNumber = e.detail;
    },

    // 规格属性
    onChangeAttribute(i) {
      const _categoryIndex = this.multiIndex.join("~");
      const url = `/pages/subPackageA/goods/goodsSpec?propertyIndex=${i}&categoryIndexStr=${_categoryIndex}`;
      util.navigateTo(url);
    },

    // 剔除所选的属性
    removeTag(i, j) {
      const _propertyList = this.propertyList;
      const _attributeList = _propertyList[i].attribute;
      _attributeList.splice(j, 1);
    },

    // 减少规格item
    subtractPropertyItem(i) {
      const _propertyList = this.propertyList;
      _propertyList.splice(i, 1);
    },

    // 增加规格item
    addPropertyItem() {
      const _item = {
        specificationName: null,
        specificationImages: null,
        codeNumber: null,
        barCode: null,
        sellingPrice: null,
        specificationNumber: null,
        attribute: []
      };
      this.propertyList.push(_item);
    },

    // 上传图片
    uploadImage(e) {
      const _index = e.index;
      let files = { filePath: e.path };
      uploadFile(files).then(res => {
        util.showToastSuccess("上传成功!");
        const _url = res.url;
        if (_index == -1) {
          const obj = { picPath: _url };
          this.bannerList.push(obj);
        } else {
          this.propertyList[e.index].specificationImages = _url;
        }
      });
    },

    getGoodsContent(e) {
      let { html } = e;
      this.goods.goodsSpec = html;
    },

    // 校验数据
    checkData() {
      const codeReg = /^[a-z0-9]+$/i;
      const digitReg = /^\d+$/;
      const moneyReg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
      const _propertyList = this.propertyList;
      if (this.bannerList.length < 1) {
        util.showToastError("请上传商品轮播图！");
        return false;
      }
      if (!this.goods.goodsTitle) {
        util.showToastError("请填写商品标题！");
        return false;
      }
      if (this.multiArray.length < 2) {
        util.showToastError("请选择商品分类到二级！");
        return false;
      }
      for (const i in _propertyList) {
        if (!_propertyList[i].specificationName) {
          util.showToastError(`请填写第${+i + 1}组规格的规格名称`);
          return false;
        } else if (!_propertyList[i].specificationImages) {
          util.showToastError(`请上传第${+i + 1}组规格的规格图片`);
          return false;
        } else if (!codeReg.test(_propertyList[i].codeNumber)) {
          util.showToastError(`请填写第${+i + 1}组规格的编码由字母和数字组成`);
          return false;
        } else if (!digitReg.test(_propertyList[i].barCode)) {
          util.showToastError(`请填写第${+i + 1}组规格的条码由纯数字组成`);
          return false;
        } else if (!moneyReg.test(_propertyList[i].sellingPrice)) {
          util.showToastError(`请填写第${+i + 1}组规格的有效价格`);
          return false;
        } else if (!digitReg.test(_propertyList[i].specificationNumber)) {
          util.showToastError(`请填写第${+i + 1}组规格的有效库存`);
          return false;
        } else if (_propertyList[i].attribute.length < 1) {
          util.showToastError(`请选择第${+i + 1}组规格的商品属性`);
          return false;
        }
      }
      return true;
    },

    // 添加商品
    saveGoods(t, e) {
      if (e) util.saveFormid(e.detail.formId);

      const flag = this.checkData();
      if (flag) {
        const _bannerArr = this.bannerList.map(item => {
          return item.picPath;
        });
        const _bannerStr = _bannerArr.join(",");
        const _titleStr = this.goods.goodsTitle;
        const _detailStr = this.goods.goodsSpec;

        const _multiIndexArr = this.multiIndex;
        const _categoryIdArr = [
          ...[this.multiArray[0][_multiIndexArr[0]].id],
          ...[this.multiArray[1][_multiIndexArr[1]].id]
        ];

        const _specList = this.propertyList;
        _specList.map(item => {
          let specificationAttributesArr = item.attribute.map(ele => {
            return ele.attributeName;
          });
          item = Object.assign(item, {
            specificationAttributes: specificationAttributesArr.join(",")
          });
        });
        const _data = {
          goodsImages: _bannerStr,
          goodsTitle: _titleStr,
          categoryId: _categoryIdArr[1] || _categoryIdArr[0],
          marketable: t,
          specList: _specList,
          goodsSpec: encodeURIComponent(_detailStr)
        };
        addGoods(_data).then(res => {
          util.showToastSuccess("添加成功!");

          this.SET_ATTRIBUTE_OPTIONS({});
          this.initData();
        });
      }
    },

    // 获取商品分类
    getGoodsCategoryList() {
      getCategoryList().then(res => {
        const _list = res.list;
        if (_list.length > 0) {
          _list.map(item => {
            item.children = item.twoCategoryList;
          });
          this.categoryList = _list;
          this.multiArray = [[..._list], [..._list[0].children]];
        }
      });
    }
  }
};
</script>

<style lang="scss">
.goods-add {
  .goods-banner {
    position: relative;
    margin-bottom: 20upx;
    .banner-empty {
      padding: 100upx 30upx 80upx;
      text-align: center;
      .empty-icon {
        width: 200upx;
        height: 200upx;
        margin: 0 auto;
        border-radius: 50%;
        text-align: center;
        line-height: 200upx;
        overflow: hidden;
        background-color: #47bafe;
      }
      .empty-text {
        padding: 30upx 0;
        color: $uni-text-color-grey;
      }
    }
    .increase-image-but {
      position: absolute;
      width: 100upx;
      height: 100upx;
      left: 30upx;
      top: 30upx;
      border-radius: 50%;
      text-align: center;
      line-height: 98upx;
      overflow: hidden;
      background-color: rgba(71, 186, 254, 0.7);
      z-index: 99;
    }
  }

  .goods-public {
    margin-bottom: 20upx;
    .picker-category {
      padding: 0 30upx;
      background-color: #fff;
      .picker-text {
        text-align: left !important;
      }
    }
  }

  .goods-property {
    margin-bottom: 20upx;
    .property-item {
      margin-bottom: 20upx;
      .property-item-index {
        font-weight: 700;
      }
      .property-item-thumb {
        width: 56upx;
        height: 56upx;
      }
      .unit {
      }
      .attribute-area {
        padding: 10upx 30upx 30upx;
        border-bottom: 1upx solid $uni-border-color;
        background-color: #fff;
        .tag-item {
          position: relative;
          display: inline-block;
          margin-right: 20upx;
          margin-top: 20upx;
          padding: 6upx 16upx;
          text-align: center;
          color: $uni-color-primary;
          border: 1upx solid $uni-color-primary;
          border-radius: $uni-border-radius-base;
          .clear {
            position: absolute;
            width: 32upx;
            height: 32upx;
            top: -10upx;
            right: -10upx;
            line-height: 32upx;
            z-index: 99;
          }
        }
      }
    }
  }

  .goods-increase-property {
    margin-bottom: 20upx;
    padding: 20upx 30upx;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .add-operate {
      text-align: right;
    }
  }

  .goods-detail {
    padding-bottom: 110upx;
    margin-bottom: 20upx;
  }

  .goods-operate {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    padding: 10upx 30upx;
    background-color: #fff;
    z-index: 99;
    .put-store-operate {
      width: 120upx;
      margin-right: 30upx;
      text-align: center;
      .icon {
        width: 40upx;
        height: 40upx;
        margin: 0 auto 10upx;
        line-height: 40upx;
        text-align: center;
        image {
          width: 100%;
        }
      }
    }
    .put-sale-operate {
      width: calc(100% - 150upx);
    }
  }
}
</style>
