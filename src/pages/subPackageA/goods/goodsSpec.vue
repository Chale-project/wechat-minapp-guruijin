<template>
  <view class="pages goods-spec">
    <view class="spec-group">
      <van-cell-group>

        <view class="category-name">
          <m-picker mode="multiSelector" label="类目" :index="multiIndex" rangekey="name" :range="multiArray" disabled @change="onChangeCategory" @columnchange="onColumnChangeCategory" />
        </view>

        <van-field :value="attrOptions.size" label="商品尺寸" placeholder="请填写商品尺寸(长*宽*高)或者" border="false" use-right-icon-slot @change="onChangeSize">
          <view class="select-picker" slot="right-icon">
            <m-picker :index="curSizeIndex" rangekey="parameterSplice" :range="sizeList" @change="onChangePickerSize" />
          </view>
        </van-field>

        <van-field :value="attrOptions.quantity" label="装件数" type="number" placeholder="请填写商品装件数或者" border="false" use-right-icon-slot @change="onChangeQuantity">
          <view class="select-picker" slot="right-icon">
            <m-picker :index="curQuantityIndex" rangekey="battlementsAmount" :range="quantityList" @change="onChangePickerQuantity" />
          </view>
        </van-field>

      </van-cell-group>
    </view>
    <view class="panel spec-selected">
      <view class="panel-header">
        <view class="title">已选属性</view>
        <view class="content">
          <m-input type="text" clearable v-model="tag" placeholder="请输入属性名称(如：透水、红色)" @confirm="onConfirmTag" />
        </view>
      </view>
      <view class="panel-body">
        <scroll-view class="tags-scroll-area" scroll-y="true" v-if="attrOptions.attribute.length>0">
          <view class="tag-item" v-for="(v,i) of attrOptions.attribute" :key="i">
            <text class="text">{{v.attributeName}}</text>
            <view class="clear" @tap="removeTag(i)">
              <uni-icons type="clear" size="16" color="#f00" />
            </view>
          </view>
        </scroll-view>

        <empty desc="请点选备选区属性~" v-else />
      </view>
    </view>
    <view class="panel spec-options">
      <view class="panel-header">
        <view class="title">该类目所有属性</view>
      </view>
      <view class="panel-body">
        <scroll-view class="tags-scroll-area" scroll-y="true" v-if="optionsList.length>0">
          <view class="tag-item" v-for="(v,i) of optionsList" :key="i" @tap="choiceTag(v)"><text class="text">{{v.attributeName}}</text></view>
        </scroll-view>

        <empty desc="此类目下尚未添加属性标签哦~" v-else />
      </view>
    </view>

    <view class="goods-spec-operate">
      <form @submit="saveSelected" class="operation-form-but" :report-submit='true'>
        <button type="default" class="operate-spec-save" form-type="submit">保存</button>
      </form>
    </view>
  </view>
</template>

<script>
import { uniIcons } from "@dcloudio/uni-ui";
import empty from "@/components/empty";
import mPicker from "@/components/m-picker";
import mInput from "@/components/m-input";

import util from "@/common/utils";

import {
  getCategoryList,
  addGoodAttribute,
  getGoodAttributeList,
  addGoodSize,
  getGoodSizeListAll,
  addGoodQuantity,
  getGoodQuantityListAll
} from "@/common/api";

import { mapGetters, mapMutations, mapActions } from "vuex";

export default {
  name: "goodsSpec",
  components: {
    empty,
    uniIcons,
    mPicker,
    mInput
  },
  data() {
    return {
      categoryList: [],
      multiArray: [],
      multiIndex: [0, 0], // 当前所选分类（从来源页获取）

      propertyIndex: 0, // 当前属性索引（从来源页获取）

      categoryIdList: [], // 当前操作分类ID

      // 尺寸
      curSizeIndex: 0,
      sizeList: [],

      // 装件数
      curQuantityIndex: 0,
      quantityList: [],

      attrOptions: {
        size: null,
        quantity: null,
        attribute: []
      },

      tag: null,
      optionsList: []
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
    console.log(options);
    this.initData();

    const _propertyIndex = options.propertyIndex;
    const _multiIndexStr = options.categoryIndexStr;
    const _multiIndexArr = _multiIndexStr.split("~");

    this.propertyIndex = _propertyIndex;
    this.multiIndex = _multiIndexArr;

    this.getGoodsCategoryList().then(() => {
      this.multiArray = [
        [...this.categoryList],
        [...this.categoryList[_multiIndexArr[1]].children]
      ];

      this.categoryIdList = [
        ...[this.multiArray[0][_multiIndexArr[0]].id],
        ...[this.multiArray[1][_multiIndexArr[1]].id]
      ];
      this.getSizeList();
      this.getQuantityList();
      this.getAttrList();
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  methods: {
    ...mapMutations("goods", ["SET_ATTRIBUTE_OPTIONS"]),
    // initData
    initData() {
      this.categoryList = [];
      this.multiArray = [];
      this.multiIndex = [0, 0];
      this.propertyIndex = 0;
      this.categoryIdList = [];

      this.curSizeIndex = 0;
      this.curQuantityIndex = 0;
      this.attrOptions.size = null;
      this.attrOptions.quantity = null;
      this.attrOptions.attribute = [];
      this.tag = null;
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

    // 输入尺寸
    onChangeSize(e) {
      this.attrOptions.size = e.detail;
    },

    // 选择尺寸
    onChangePickerSize(e) {
      const _index = e.detail.value;
      this.curSizeIndex = _index;
      this.attrOptions.size = this.sizeList[_index].parameterSplice;
    },

    // 输入装件数
    onChangeQuantity(e) {
      this.attrOptions.quantity = e.detail;
    },

    // 选择装件数
    onChangePickerQuantity(e) {
      const _index = e.detail.value;
      this.curQuantityIndex = _index;
      this.attrOptions.quantity = this.quantityList[_index].battlementsAmount;
    },

    // 添加标签
    onConfirmTag(e) {
      this.addAttr();
    },

    // 点选属性标签
    choiceTag(e) {
      const _selectedList = this.attrOptions.attribute;
      const _id = e.id;
      if (_selectedList.length > 0) {
        let flag = !1;
        for (const i in _selectedList) {
          if (_selectedList[i].id === _id) {
            flag = !0;
            break;
          }
        }
        if (!flag) {
          _selectedList.push(e);
        }
      } else {
        _selectedList.push(e);
      }
    },

    //  删除所选
    removeTag(i) {
      const _selectedList = this.attrOptions.attribute;
      _selectedList.splice(i, 1);
    },

    // 保存所选属性
    saveSelected() {
      const flag = this.checkData();
      if (flag) {
        const _attributeObj = this.attributeObj;
        _attributeObj[this.propertyIndex] = {
          parameters: this.attrOptions.size,
          battlementNum: this.attrOptions.quantity,
          attribute: this.attrOptions.attribute
        };
        this.SET_ATTRIBUTE_OPTIONS(_attributeObj);
        Promise.all([this.addSize(), this.addQuantity()]).then(() => {
          util.navigateBack();
        });
      }
    },

    // 数据校验
    checkData() {
      const lwhReg = /^\d+([.]?\d)*\*\d+([.]?\d)*\*\d+([.]?\d)*$/;
      const nReg = /^\d+$/;
      if (!lwhReg.test(this.attrOptions.size)) {
        util.showToastError("请输入有效的 长*宽*高 格式！");
        return false;
      } else if (!nReg.test(this.attrOptions.quantity)) {
        util.showToastError("请输入有效的数量！");
        return false;
      } else if (this.attrOptions.attribute.length < 1) {
        util.showToastError("请选择属性！");
        return false;
      } else {
        return true;
      }
    },

    // 添加尺寸
    addSize() {
      const _data = {
        categoryId: this.categoryIdList[1] || this.categoryIdList[0],
        parameterSplice: this.attrOptions.size
      };
      addGoodSize(_data).then(res => {
        this.attrOptions.size = null;
      });
    },

    // 获取尺寸列表数据
    getSizeList() {
      const _id = this.categoryIdList[1] || this.categoryIdList[0];
      getGoodSizeListAll(_id).then(res => {
        const _list = res.list;
        if (_list.length > 0) {
          this.sizeList = _list;
        }
      });
    },

    // 添加装件数
    addQuantity() {
      const _data = {
        categoryId: this.categoryIdList[1] || this.categoryIdList[0],
        battlementsAmount: this.attrOptions.quantity
      };
      addGoodQuantity(_data).then(res => {
        this.attrOptions.quantity = null;
      });
    },

    // 获取装件数列表数据
    getQuantityList() {
      const _id = this.categoryIdList[1] || this.categoryIdList[0];
      getGoodQuantityListAll(_id).then(res => {
        const _list = res.list;
        if (_list.length > 0) {
          this.quantityList = _list;
        }
      });
    },

    // 添加属性
    addAttr() {
      const _data = {
        categoryId: this.categoryIdList[1] || this.categoryIdList[0],
        attributeName: this.tag
      };
      addGoodAttribute(_data).then(res => {
        this.getAttrList();
        this.tag = null;
      });
    },

    // 获取属性列表数据
    getAttrList() {
      const _id = this.categoryIdList[1] || this.categoryIdList[0];
      getGoodAttributeList(_id).then(res => {
        const _list = res.list;
        if (_list.length > 0) {
          this.optionsList = _list;
        }
      });
    },

    // 获取商品分类
    getGoodsCategoryList() {
      return new Promise((resolve, reject) => {
        getCategoryList()
          .then(res => {
            const _list = res.list;
            if (_list.length > 0) {
              _list.map(item => {
                item.children = item.twoCategoryList;
              });
              this.categoryList = _list;
              resolve();
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    }
  }
};
</script>

<style lang="scss">
.goods-spec {
  .spec-group {
    .category-name {
      padding: 0 30upx;
      background-color: #fff;
    }
    .select-picker {
      width: 180upx;
      .m-picker {
        padding: 0;
      }
      .m-picker::after {
        height: 0;
      }
    }
  }
  .panel {
    position: relative;
    margin-bottom: 40upx;
    background-color: #fff;
    &-header {
      display: flex;
      align-items: center;
      padding: 20upx 30upx;
      border-bottom: 1rpx solid $uni-border-color;
      .title {
        margin-right: 60upx;
      }
      .content {
        padding: 8upx 10upx;
        border-radius: 40upx;
        background-color: #bae0e3;
        border: 1upx solid #a1b7b9;
        .m-input-view {
          box-sizing: border-box;
        }
      }
    }
    &-body {
      min-height: 200upx;
      padding: 10upx 30upx;
      border-bottom: 1rpx solid $uni-border-color;

      .tags-scroll-area {
        height: 300upx;
      }
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
  .spec-options {
    margin-bottom: 110upx;
  }
  .goods-spec-operate {
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
