<template>
  <div id="analysis">
    <el-row>
      <div id="top-nav-container">
        <step-bar active-tag="3"></step-bar>
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
              <el-link type="primary" @click="changeShow('showCommonChart')">基本图表</el-link>
              <el-divider direction="vertical"></el-divider>
              <el-link type="primary">答卷详情</el-link>
              <el-divider direction="vertical"></el-divider>
              <el-link type="primary" @click="changeShow('showGlobalChart')">数据总览</el-link>
            </div>
          </template>
        </nav-bar>
      </div>
    </el-row>
    <div id="chart-container">
      <div id="common-chart" v-show="this.showControl.showCommonChart">
        <div :class="getClassName(index)" v-for="(data, index) in analysisData['completes']"
             :key="index + new Date().getTime()">
          <chart-background :question-num="index" :question-data="data" v-if="showChart"></chart-background>
        </div>
      </div>
      <div id="global-chart" v-show="this.showControl.showGlobalChart">
        <global-chart-background :g-data="analysisData['placeCondition']" v-if="provinceDataFlag">
        </global-chart-background>
      </div>
    </div>
  </div>
</template>
<script>
  import chartBackground from "./ChlidComp/chartBackground";
  import navBar from "../../components/navBar/navBar";
  import {getAnalysisData} from "../../network/analysis";
  import GlobalChartBackground from "./ChlidComp/globalChartBackground";
  import StepBar from "../../components/stepBar/stepBar";

  export default {
    name: "analysis",
    components: {
      StepBar,
      GlobalChartBackground,
      chartBackground,
      navBar
    },
    data() {
      return {
        analysisData: {},
        showControl: {
          showCommonChart: true,
          showDetailedChart: false,
          showGlobalChart: false
        },
        provinceDataFlag: false,
        showChart: false
      }
    },
    created() {
      this.getAnalysisData()
    },
    methods: {
      getClassName(index) {
        return index !== 0 ? "chart-card-wrap" : "chart-card-wrap-top"
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
                  this.provinceDataFlag = true;
                  this.showChart = true;
                })
                .catch(() => {
                  this.$messageBox.showErrorMessage(this, "访问错误")
                })
      },
      changeShow(showWhat) {
        let showItems = ['showCommonChart', 'showDetailedChart', 'showGlobalChart'];
        showItems.forEach(item => {
          showWhat === item ? this.showControl[item] = true : this.showControl[item] = false;
        })
      }
    },
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
    padding-top: 15px;
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

  #global-chart {
    display: flex;
    justify-content: center;
  }

</style>