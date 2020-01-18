<template>
  <div id="dataCard" :style="cardStyle">
    <el-card class="box-card" shadow="hover">
      <div slot="header" class="clearfix">
        <!--卡片标题 可以添加按钮等内容-->
        <span>{{cardName}}</span>
        <!--卡片头部插槽 可以添加按钮等内容-->
        <slot name="cardHead"></slot>
      </div>
      <!--卡片头部插槽 可以添加问卷的信息-->
      <slot name="cardBody"></slot>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "dataCard",
    props: {
      cardName: {
        type: String,
      },
      cardStyle: {
        type: Object,
      }
    }
  }
</script>

<style scoped>
</style>