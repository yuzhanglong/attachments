<template>
  <div id="analysis">
    <el-row>
      <div id="top-nav-container">
        <nav-bar line-height="line-height: 64px">
          <template v-slot:nav-left>
            <i class="el-icon-arrow-left" @click="goBack"></i>
          </template>
          <template v-slot:nav-center>
            <div id="step-bar">
              <el-link type="primary" :underline="false">编辑项目</el-link>
              <div class="icon-wrap">
                <i class="el-icon-arrow-right"></i>
              </div>
              <el-link type="primary" :underline="false">发布项目</el-link>
              <div class="icon-wrap">
                <i class="el-icon-arrow-right"></i>
              </div>
              <el-link type="primary" :underline="false">统计报表</el-link>
            </div>
          </template>
          <template v-slot:nav-right>
            <div id="nav-right-setting">
              <el-avatar></el-avatar>
            </div>
          </template>
        </nav-bar>
      </div>
    </el-row>
    <el-row>
      <div id="second-nav-container">
        <nav-bar>
          <template v-slot:nav-left>
            <div id="questionnaire-title-container">
              <span>analysisData.title</span>
            </div>
          </template>
          <template v-slot:nav-right>
            <div id="questionnaire-total-counter-container">
              <span>当前已收集问卷:</span>
              <span>count份</span>
            </div>
          </template>
        </nav-bar>
      </div>
    </el-row>
    <el-row>
        <div id="third-nav-container">
          <nav-bar>
            <template v-slot:nav-left>
              <div id="third-nav-container-left">
                <span>最后更新时间:</span>
              </div>
            </template>
            <template v-slot:nav-right>
              <div id="third-nav-container-right">
                <el-link type="primary">基本图表</el-link>
                <el-divider direction="vertical"></el-divider>
                <el-link type="primary">答卷详情</el-link>
              </div>
            </template>
          </nav-bar>
        </div>
    </el-row>
    <chart-background></chart-background>
  </div>
</template>
<script>
  import chartBackground from "./ChlidComp/chartBackground";
  import navBar from "../../components/navBar/navBar";

  export default {
    name: "analysis",
    components: {
      chartBackground,
      navBar
    },
    methods: {
      goBack() {
        this.$router.replace('/manage');
      },
    }
  }
</script>

<style scoped>
  #questionnaire-title-container {
    padding: 8px 12px 20px 30px;
    font-size: 17px;
  }

  #questionnaire-total-counter-container {
    display: flex;
    padding: 8px 12px 0 0;
    font-size: 17px;
  }

  #second-nav-container {
    position: fixed;
    right: 0;
    left: 0;
    top: 80px;
  }
  #third-nav-container-right{
    padding-left: 55px;
    padding-top: 12px;
    display: flex;
  }
  #third-nav-container-left{
    height: 30px;
    padding: 12px 12px 0 30px;
    background-color: #fafbfb;
  }
  #third-nav-container {
    position: fixed;
    right: 0;
    left: 0;
    top: 128px;
    background-color: #fafbfb;
  }

  #top-nav-container {
    position: fixed;
    right: 0;
    left: 0;
    top: 0;
    z-index: 10;
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

  #step-bar {
    display: flex;
    justify-content: center;
    background-color: #fff;
  }

  .el-icon-arrow-left {
    margin-left: 20px;
  }
</style>