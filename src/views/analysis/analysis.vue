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
              <span>{{analysisData.title}}</span>
            </div>
          </template>
          <template v-slot:nav-right>
            <div id="questionnaire-total-counter-container">
              <span>当前已收集问卷:{{analysisData["totalComplete"]}}份</span>
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
              <span>最后更新时间:{{analysisData['renewTime']}}</span>
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
    <div id="chart-container">
      <div :class="getClassName(index)" v-for="(data, index) in analysisData['completes']"
           :key="index + new Date().getTime()">
        <chart-background :question-num="index" :question-data="data"></chart-background>
      </div>
    </div>
  </div>
</template>
<script>
  import chartBackground from "./ChlidComp/chartBackground";
  import navBar from "../../components/navBar/navBar";
  import {getAnalysisData} from "../../network/analysis";

  export default {
    name: "analysis",
    components: {
      chartBackground,
      navBar
    },
    data() {
      return {
        analysisData: {}
      }
    },
    created() {
      this.getAnalysisData()
    },
    methods: {
      getClassName(index) {
        return index !== 0 ? "chart-card-wrap" : "chart-card-wrap-top"
      },
      goBack() {
        this.$router.replace('/manage');
      },
      getAnalysisData() {
        getAnalysisData(this.$route.params.flag, this.$store.state.token)
                .then(res => {
                  this.analysisData = res['information'];
                  this.$notify({
                    title: "系统消息",
                    message: '当前您处在数据分析模式',
                    type: 'success',
                    duration: 4000,
                    offset: 50
                  });
                })
                .catch(() => {
                  this.$messageBox.showErrorMessage(this, "访问错误")
                })
      }
    }
  }
</script>

<style scoped>
  #questionnaire-title-container {
    padding: 20px 12px 20px 30px;
    font-size: 17px;
    width: 500px;
  }

  #questionnaire-total-counter-container {
    display: flex;
    padding: 20px 12px 0 35px;
    font-size: 17px;
  }

  #second-nav-container {
    position: fixed;
    right: 0;
    left: 0;
    padding-top: 1px;
    top: 65px;
    background-color: #ffffff;
    z-index: 13;
  }

  #third-nav-container-right {
    padding-left: 55px;
    padding-top: 12px;
    display: flex;
  }

  #third-nav-container-left {
    height: 30px;
    padding: 12px 12px 0 30px;
    background-color: #fafbfb;
    width: 400px;
  }

  #third-nav-container {
    position: fixed;
    right: 0;
    left: 0;
    top: 122px;
    background-color: #fafbfb;
    z-index: 11;
  }

  #top-nav-container {
    position: fixed;
    right: 0;
    left: 0;
    top: 0;
    z-index: 10;
    box-shadow: 0 15px #f3f3f3;
    height: 63px;
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

  .chart-card-wrap-top {
    padding-top: 25vh;
    display: flex;
    justify-content: center;
    padding-bottom: 50px;
  }

  .chart-card-wrap {
    padding-bottom: 40px;
    display: flex;
    justify-content: center;
  }
</style>