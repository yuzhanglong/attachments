<template>
  <div id="problemTypeItem">
    <el-menu-item>
      <i :class="itemicon"></i>
      <span slot="title">{{problemType}}</span>
    </el-menu-item>
  </div>
</template>

<script>
  export default {
    name: "problemTypeItem",
    props:{
      problemType:{
        type:String,
        required:true
      },
      itemicon:{
        type:String,
        required:true
      }
    }
  }
</script>

<style scoped>

</style>