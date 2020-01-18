<template>
  <div id="left-nav-bar">
    <el-menu class="el-menu-vertical-demo">
      <slot></slot>
    </el-menu>
  </div>
</template>

<script>
  export default {
    name: "leftNavBar",
  }
</script>

<style scoped>

</style>