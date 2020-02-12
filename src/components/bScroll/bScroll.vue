<template>
  <!--用ref 防止被干扰-->
  <div class="wrapper" ref="wrap">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

  export default {
    name: "scroll",
    data() {
      return {
        scroll: null
      }
    },
    props: {
      probeType: {
        type: Number,
        default: 0
      },
      pullUpLoad: {
        type: Boolean,
        default: false
      }
    },
    mounted() {
      //BS对象创建
      this.scroll = new BScroll(this.$refs.wrap, {
        //注意这里必须设置 click: true 否则原生事件无法点击
        click: true,
        tap: true,
        probeType: this.probeType,
        pullUpLoad: this.pullUpLoad
      });
      //滚动位置监听
      this.scroll.on('scroll', (position) => {
        //自定义事件传出位置
        this.$emit('scroll', position);
      });
      this.scroll.on('pullingUp', () => {
        this.$emit("pullingUp");
      });
    },
    methods: {
      scrollTo(x, y, time = 1500) {
        this.scroll && this.scroll.scrollTo(x, y, time);
      },
      finishPullUp() {
        this.scroll && this.scroll.finishPullUp();
      },
      refresh() {
        this.scroll && this.scroll.refresh();
      }
    }
  }
</script>

<style scoped>

</style>