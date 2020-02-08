<template>
  <div id="stepBar">
    <nav-bar line-height="line-height: 64px">
      <template v-slot:nav-left>
        <i class="el-icon-arrow-left" @click="goBack"></i>
      </template>
      <template v-slot:nav-center>
        <div id="step-bar">
          <el-link type="primary" :underline="false" :class="getActiveTag('1')">编辑项目</el-link>
          <div class="icon-wrap">
            <i class="el-icon-arrow-right"></i>
          </div>
          <el-link type="primary" :underline="false" :class="getActiveTag('2')">发布项目</el-link>
          <div class="icon-wrap">
            <i class="el-icon-arrow-right"></i>
          </div>
          <el-link type="primary" :underline="false" :class="getActiveTag('3')">统计报表</el-link>
        </div>
      </template>
      <template v-slot:nav-right>
        <div id="nav-right-setting">
          <slot name="step-right">
          </slot>
          <el-avatar></el-avatar>
        </div>

      </template>
    </nav-bar>
  </div>
</template>

<script>
  import navBar from "../navBar/navBar";

  export default {
    name: "stepBar",
    props: {
      activeTag: {
        type: String,
        required: true
      }
    },
    components: {
      navBar
    },
    methods: {
      goBack() {
        this.$router.replace('/manage');
      },
      getActiveTag(index) {
        return index === this.activeTag ? "active-link" : "not-active-link"
      }
    }
  }
</script>

<style scoped>
  .el-icon-arrow-left {
    margin-left: 20px;
  }

  #step-bar {
    display: flex;
    justify-content: center;
    background-color: #fff;
  }

  #nav-right-setting {
    padding-top: 12px;
    display: flex;
    justify-content: center;
  }

  .icon-wrap {
    padding-left: 20px;
    padding-right: 20px;
  }

  #nav-right-setting {
    padding-top: 12px;
    display: flex;
    justify-content: center;
  }


  .el-icon-arrow-left {
    margin-left: 20px;
  }

  .active-link {
    border-bottom: 2px solid #409eff;
    height: 62px;
  }
</style>