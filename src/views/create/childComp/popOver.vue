<template>
  <div id="pop-over">
    <el-popover
            placement="right-end"
            :title="popTitle"
            :width="popWidth"
            trigger="hover">
      <slot name="contentdata"></slot>
      <slot slot="reference" name="ref"></slot>
    </el-popover>
  </div>

</template>

<script>
  export default {
    name: "popOver",
    props: {
      popTitle: {
        type: String,
      },
      popWidth: {
        type: String,
        required: true
      }
    }
  }
</script>

<style scoped>

</style>