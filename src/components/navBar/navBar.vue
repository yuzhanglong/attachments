<template>
  <div id="nav-bar">
    <div class="nav-left">
      <slot name="nav-left"></slot>
    </div>
    <div class="nav-center">
      <slot name="nav-center"></slot>
    </div>
    <div class="nav-right">
      <slot name="nav-right"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "navBar"
  }
</script>

<style scoped>
  #nav-bar {
    display: flex;
    line-height: 64px;
    box-shadow: 0 1px rgba(100, 100, 0, 0.1);
  }
  .nav-left {
    width: 260px;
    background-color: #ffffff;
  }
  .nav-right{
    width: 300px;
    background-color: #ffffff;
  }
  .nav-center {
    flex: 1;
  }
</style>