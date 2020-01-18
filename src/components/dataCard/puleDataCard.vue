<template>
  <div id="pule-data-card" :style="cardStyle">
    <el-card class="box-card">
      <slot></slot>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "puleDataCard",
    props: {
      cardStyle: {
        type: Object
      }
    }
  }
</script>

<style scoped>

</style>