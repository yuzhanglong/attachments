<template>
  <div id="scrollBar">
    <el-scrollbar>
      <slot></slot>
    </el-scrollbar>
  </div>
</template>

<script>
  export default {
    name: "scrollBar"
  }
</script>

<style scoped>
</style>