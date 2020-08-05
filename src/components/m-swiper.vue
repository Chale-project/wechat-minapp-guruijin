<template>
  <swiper class="swiper" :style="{height:sysinfo.windowWidth+'px'}" :current="current" :indicator-dots="indicatorDots" :indicator-color="indicatorColor" :indicator-active-color="indicatorActiveColor" :autoplay="autoplay" :interval="interval" :duration="duration">
    <block v-for="(item, index) in images" :key="index">
      <swiper-item>
        <image :src="item.picPath?item.picPath:errDefaultImage" @error="errImg(index)" @click="onClick(item.linkPath)" class="slide-image" :mode="mode" />
      </swiper-item>
    </block>
  </swiper>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "mSwiper",
  props: {
    current: {
      type: Number,
      default: 0
    },
    images: {
      type: Array
    },
    mode: {
      type: String,
      default: "widthFix"
    }
  },
  data() {
    return {
      indicatorDots: true,
      autoplay: true,
      interval: 3000,
      duration: 500,
      indicatorColor: "#ddd",
      indicatorActiveColor: "#0d6eb8",
      errDefaultImage: "/static/images/default_logo_1x1.jpg"
    };
  },
  computed: {
    ...mapGetters(["sysinfo"])
  },

  created() {},
  mounted() {},
  methods: {
    onClick(path) {
      path && this.$emit("toPath", path);
    },

    //处理no found 图片
    errImg(i) {
      this.images[i].picPath = this.errDefaultImage;
    }
  }
};
</script>

<style lang="scss">
.slide-image {
  width: 100%;
}
</style>