<template>
  <div class="uni-tree">
    <template v-for="(item, index) in getChildren(parent || root)">
      <div class="uni-tree-item" :key="getId(item)">
        <div class="uni-tree-item-self">
          <div class="uni-tree-item-checkbox-wrapper" v-if="canShowCheckbox(item)" @click="handleToggleCheck(currentLevelData[index])">
            <image class="uni-tree-item-checkbox-icon" :src="`/static/images/icon_checked.png`" v-if="item._checked"></image>
            <image class="uni-tree-item-checkbox-icon" :src="`/static/images/icon_indeterminate.png`" v-else-if="item._indeterminate"></image>
            <image class="uni-tree-item-checkbox-icon" :src="`/static/images/icon_unchecked.png`" v-else></image>
          </div>
          <div v-if="canShowRadio(item)" class="uni-tree-item-radio-wrapper" @click="handleToggleSelect(currentLevelData[index])">
            <image class="uni-tree-item-radio-icon" :src="`/static/images/icon_checked.png`" v-if="item._selected"></image>
            <image class="uni-tree-item-radio-icon" :src="`/static/images/icon_unchecked.png`" v-else></image>
          </div>
          <div class="uni-tree-item-name-wrapper" @click="handleToggleExpand(currentLevelData[index])">
            <span class="uni-tree-item-name">{{item.name}}</span>
            <uni-icons :type="item._expand?'arrowup':'arrowdown'" v-if="item._hasChildren" />
          </div>
        </div>
        <div class="uni-tree-item-children" v-if="hasChildren(item)">
          <m-tree :root="root" :parent="item" :level="level+1" :has-children="hasChildren" :get-children="getChildren" :get-id="getId" :get-name="getName" :show-radio="showRadio" :leaf-only="leafOnly" :show-checkbox="showCheckbox" @on-change="onChange" @on-toggle-expand="onToggleExpand" v-if="item._expand"></m-tree>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { uniIcons } from "@dcloudio/uni-ui";

export default {
  name: "mTree",
  components: {
    uniIcons
  },
  props: {
    root: {
      type: Object
    },
    parent: {
      type: Object
    },
    showCheckbox: {
      type: Boolean,
      default: false
    },
    showRadio: {
      type: Boolean,
      default: false
    },
    leafOnly: {
      type: Boolean,
      default: false
    },
    // #ifndef H5
    hasChildren: {
      type: Function,
      default: () => data => data.children
    },
    getChildren: {
      type: Function,
      default: () => data => data.children
    },
    getId: {
      type: Function,
      default: () => data => data.id
    },
    getName: {
      type: Function,
      default: () => data => data.name
    },
    changeHandler: {
      type: Function,
      default: () => () => {}
    },
    clickHandler: {
      type: Function,
      default: () => () => {}
    },
    // #endif
    // #ifdef H5
    hasChildren: {
      type: Function,
      default: data => data.children
    },
    getChildren: {
      type: Function,
      default: data => data.children
    },
    getId: {
      type: Function,
      default: data => data.id
    },
    getName: {
      type: Function,
      default: data => data.name
    },
    changeHandler: {
      type: Function,
      default: () => {}
    },
    clickHandler: {
      type: Function,
      default: () => {}
    },
    // #endif
    selected: {
      type: Object
    },
    checked: {
      type: Array,
      default: () => []
    },
    expand: {
      type: Array,
      default: () => []
    },
    autoExpand: {
      type: Boolean,
      default: false
    },
    level: {
      type: Number,
      default: 0
    },
    getRoot: {
      type: Function
    }
  },
  data() {
    return {
      currentLevelData: [],
      innerExpand: []
    };
  },
  mounted() {
    if (this.level === 0) {
      this.$on("on-change", ({ item, handler }) => {
        handler.call(this, item);
        this.$nextTick(() => {
          this.setCurrentLevelData();
          this.changeHandler(this.getChecked());
        });
      });
      this.$on("on-toggle-expand", ({ item, handler }) => {
        handler.call(this, item);
        this.$nextTick(() => {
          this.setCurrentLevelData();
          this.clickHandler(item);
        });
      });
    }
  },
  onUnload() {
    if (this.level === 0) {
      this.$off("on-change");
      this.$off("on-toggle-expand");
    }
  },
  watch: {
    root: {
      handler() {
        this.init({
          checked: true,
          selected: true,
          expand: true
        });
      },
      immediate: true
    },
    checked: {
      handler() {
        this.init({
          checked: true,
          expand: true
        });
      },
      immediate: true
    },
    expand: {
      handler() {
        this.init({
          expand: true
        });
      },
      immediate: true
    },
    selected: {
      handler() {
        this.init({
          selected: true,
          expand: true
        });
      },
      immediate: true
    }
  },
  methods: {
    init({ expand, checked, selected }) {
      if (this.level === 0) {
        this.syncState({
          checked,
          expand,
          selected
        });
      }
      this.setCurrentLevelData();
    },
    setCurrentLevelData() {
      this.currentLevelData = this.getChildren(this.parent || this.root);
    },
    onChange(args) {
      // #ifdef H5
      const { item, handler } = args;
      // #endif
      // #ifndef H5
      const { item, handler } = args.detail.__args__[0];
      // #endif
      if (this.level === 0) {
        const id = this.getId(item);
        const target = this.getItemById(id);
        handler.call(this, target);
        this.changeHandler(this.getChecked());
      } else {
        this.$emit("on-change", {
          item,
          handler
        });
      }
    },
    onToggleExpand(args) {
      // #ifdef H5
      const { item, handler } = args;
      // #endif

      // #ifndef H5
      const { item, handler } = args.detail.__args__[0];
      // #endif

      if (this.level === 0) {
        const id = this.getId(item);
        const target = this.getItemById(id);

        handler.call(this, target);
        this.clickHandler(target);
      } else {
        this.$emit("on-toggle-expand", {
          item,
          handler
        });
      }
    },
    syncState({ expand, checked, selected }) {
      if (checked) {
        this.syncStateChecked();
      }
      if (selected) {
        this.syncStateSelected();
      }
      if (expand) {
        this.syncStateExpand();
      }
    },
    syncStateChecked() {
      if (!this.checked) {
        return;
      }
      const parent = this.root;
      this.forEachTree(parent, (item, parent) => {
        this.$set(item, "_checked", this.isChecked(item));
        this.$set(item, "_expand", false);
        this.$set(item, "_indeterminate", false);
        this.$set(item, "_parent", this.getId(parent));
        this.$set(item, "_hasChildren", this.hasChildren(item));
      });
      this.forEachTree(parent, (item, parent) => {
        if (item._checked) {
          this.upStreamCheck(item);
          this.downStreamCheck(item);
          return true;
        }
      });
      return parent;
    },
    syncStateSelected() {
      if (!this.selected) {
        return;
      }
      const parent = this.root;
      this.forEachTree(parent, (item, parent) => {
        this.$set(item, "_selected", this.isSelected(item));
        this.$set(item, "_expand", false);
        this.$set(item, "_indeterminate", false);
        this.$set(item, "_parent", this.getId(parent));
        this.$set(item, "_hasChildren", this.hasChildren(item));
      });
      this.forEachTree(parent, (item, parent) => {
        if (item._selected) {
          this.upStreamSelect(item);
          return true;
        }
      });
      return parent;
    },
    syncStateExpand() {
      this.setInnerExpand();
      this.forEachTree(this.root, (item, parent) => {
        this.$set(item, "_expand", this.isExpand(item));
      });
    },
    setInnerExpand() {
      if (this.autoExpand) {
        this.forEachTree(this.root, (item, parent) => {
          if (!this.hasChildren(item)) {
            return true;
          }
          if (item._indeterminate) {
            this.innerExpand.push(item);
          }
        });
      } else {
        this.innerExpand = this.expand;
      }
    },
    forEachTree(tree, handler) {
      if (!tree) {
        return;
      }
      if (this.hasChildren(tree)) {
        const children = this.getChildren(tree);
        for (let item of children) {
          const stopForEach = handler(item, tree);
          if (!stopForEach) {
            this.forEachTree(item, handler);
          }
        }
      }
    },
    clearSelect() {
      this.forEachTree(this.root, item => {
        this.$set(item, "_indeterminate", false);
        this.$set(item, "_selected", false);
      });
    },
    upStreamSelect(node) {
      if (node) {
        const parent = this.getItemById(node._parent);
        if (!parent) {
          return;
        }
        this.$set(parent, "_indeterminate", true);
        this.upStreamCheck(parent);
      }
    },
    upStreamCheck(node) {
      if (node) {
        const parent = this.getItemById(node._parent);
        if (!parent) {
          return;
        }
        const children = this.getChildren(parent);
        const checked = children.filter(it => it._checked);
        const indeterminated = children.filter(it => it._indeterminate);
        this.$set(parent, "_checked", checked.length === children.length);
        this.$set(
          parent,
          "_indeterminate",
          !parent._checked && (indeterminated.length > 0 || checked.length > 0)
        );
        this.upStreamCheck(parent);
      }
    },
    downStreamCheck(node) {
      if (this.hasChildren(node)) {
        for (let item of this.getChildren(node)) {
          this.$set(item, "_checked", node._checked);
          this.$set(item, "_indeterminate", false);
          this.downStreamCheck(item);
        }
      }
    },
    isChecked(item) {
      return !!this.checked.find(it => this.isSame(item, it));
    },
    isSelected(item) {
      return this.isSame(item, this.selected);
    },
    isExpand(item) {
      return !!this.innerExpand.find(it => this.isSame(item, it));
    },
    isChildrenAllCheck(item) {
      if (this.hasChildren(item)) {
        const children = this.getChildren(item);
        return children.every(it => it._checked);
      }
      return item._checked;
    },
    isSame(itemA, itemB) {
      return this.getId(itemA) === this.getId(itemB);
    },
    canShowCheckbox(item) {
      if (this.showCheckbox) {
        if (this.leafOnly) {
          return !this.hasChildren(item);
        }
        return true;
      }
    },
    canShowRadio(item) {
      if (this.showRadio) {
        if (this.leafOnly) {
          return !this.hasChildren(item);
        }
        return true;
      }
    },
    getItemById(id) {
      let target = null;
      this.forEachTree(this.root, item => {
        if (this.getId(item) === id) {
          target = item;
          return true;
        }
      });
      return target;
    },
    handleToggleExpand(item) {
      const self = this;
      this.$emit("on-toggle-expand", {
        item,
        handler: function(item) {
          this.$set(item, "_expand", !item._expand);
          this.$nextTick(() => {
            this.setCurrentLevelData.call(self);
          });
        }
      });
    },
    handleToggleCheck(item) {
      const self = this;
      this.$emit("on-change", {
        item,
        handler: function(item) {
          this.$set(item, "_checked", !item._checked);
          this.$set(item, "_indeterminate", false);
          this.upStreamCheck(item);
          this.downStreamCheck(item);
          this.$nextTick(() => {
            this.setCurrentLevelData.call(self);
          });
        }
      });
    },
    handleToggleSelect(item) {
      const self = this;
      this.$emit("on-change", {
        item,
        handler: function(item) {
          this.clearSelect();
          this.$set(item, "_selected", true);
          this.upStreamSelect(item);
          this.$nextTick(() => {
            this.setCurrentLevelData.call(self);
          });
        }
      });
    },
    toggleAllExpand(expand) {
      this.forEachTree(this.root, (item, parent) => {
        this.$set(item, "_expand", expand);
      });
    },
    toggleAllChecked(checked) {
      this.forEachTree(this.root, (item, parent) => {
        this.$set(item, "_checked", checked);
        this.$set(item, "_indeterminate", false);
      });
    },
    getChecked(all = false) {
      const checked = [];
      if (this.showCheckbox) {
        this.forEachTree(this.root, item => {
          if (this.leafOnly) {
            if (item._checked && !item._hasChildren) {
              checked.push(item);
            }
          } else {
            if (item._checked) {
              checked.push(item);
              return !all;
            }
          }
        });
      }
      if (this.showRadio) {
        this.forEachTree(this.root, item => {
          if (item._selected) {
            checked.push(item);
            return !all;
          }
        });
      }
      return checked;
    },
    getAllChecked() {
      return this.getChecked(true);
    },
    getAllIndeterminate() {
      const checked = [];
      if (this.showCheckbox) {
        this.forEachTree(this.root, item => {
          if (this.leafOnly) {
            if (item._indeterminate && !item._hasChildren) {
              checked.push(item);
            }
          } else {
            if (item._indeterminate) {
              checked.push(item);
              return false;
            }
          }
        });
      }
      return checked;
    }
  }
};
</script>

<style>
.uni-tree {
}
.uni-tree-item {
  margin: 20upx 0;
}
.uni-tree-item-checkbox-icon {
  width: 34upx;
  height: 34upx;
}
.uni-tree-item-radio-icon {
  width: 34upx;
  height: 34upx;
}
.uni-tree-item-checkbox-wrapper {
  display: flex;
  align-items: center;
}
.uni-tree-item-radio-wrapper {
  display: flex;
  align-items: center;
}
.uni-tree-item-name-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  margin-left: 8upx;
}
.uni-tree-item-expand-icon {
  width: 26upx;
  height: 26upx;
  margin-right: 8upx;
  opacity: 0.9;
}
.uni-tree-item-self {
  display: flex;
  align-items: center;
}
.uni-tree-item-checkbox {
}
.uni-tree-item-name {
  flex: 1;
  text-align: left;
}
.uni-tree-item-children {
  margin-left: 36upx;
}
</style>