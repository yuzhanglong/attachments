<template>
  <div id="chartBackground">
    <pule-data-card class="data-chart-cards">

      <!--图表标题-->
      <div class="chart-title">
        <span class="chart-title-text">Question{{questionNum + 1}}:{{questionData.title}}</span>
        <el-divider></el-divider>
      </div>

      <!--图表内容-->
      <div class="chart-img">
        <pie-chart :float-text="'Question ' + (questionNum + 1)" :data-dict="getDataDict()"
                   :is-show="checkIsShow(questionData.type)">
        </pie-chart>
      </div>

      <!--表单内容-->
      <div class="chart-table" v-if="questionData.type !== 'BLANK_FILL'">
        <el-table
                :data="questionData.resolution"
                stripe
                style="width: 100%">
          <el-table-column
                  prop="title"
                  :label="checkLeft(questionData.type)"
                  width="550">
            <!--<template slot-scope="scope">-->
            <!--  <span style="margin-left: 10px">{{scope.$index}}</span>-->
            <!--</template>-->
          </el-table-column>
          <el-table-column
                  prop="resolution"
                  :label="checkRight(questionData.type)">
          </el-table-column>
        </el-table>
      </div>


    </pule-data-card>
  </div>
</template>

<script>
  import puleDataCard from "../../../components/dataCard/puleDataCard";
  import pieChart from "../../../components/myCharts/pieChart";

  export default {
    name: "chartBackground",
    props: {
      questionNum: {
        required: true
      },
      questionData: {
        required: true,
      }
    },
    components: {
      puleDataCard,
      pieChart
    },
    data() {
      return {
        chartConfig: {
          SINGLE_SELECT: {
            isShowChart: true,
            labelLeft: "选项",
            labelRight: "选择此项的个数",
          },
          MULTIPLY_SELECT: {
            isShowChart: true,
            labelLeft: "选项",
            labelRight: "选择此项的个数",
          },
          BLANK_FILL: {
            isShowChart: false,
            labelLeft: "序号",
            labelRight: "答案",
          },
          DROP_DOWN: {
            isShowChart: true,
            labelLeft: "选项",
            labelRight: "选择此项的个数",
          },
          SCORE: {
            isShowChart: true,
            labelLeft: "等级(1为最低 5为最高)",
            labelRight: "选择此等级的个数",
          }
        }
      }
    },
    methods: {
      getDataDict() {
        let list = [];
        this.questionData.resolution.forEach(data => {
          // 移除数值为0的项目 提高饼图美观程度
          if (!data.resolution) return true;
          list.push({
            value: data.resolution,
            name: data.title
          })
        });
        return list
      },

      checkIsShow(type) {
        return this.chartConfig[type].isShowChart;
      },

      checkLeft(type) {
        return this.chartConfig[type].labelLeft;
      },

      checkRight(type) {
        return this.chartConfig[type].labelRight;
      }

    }
  }
</script>


<style scoped>
  .problem-title {
    text-align: center;
  }

  .chart-title {
    padding-top: 10px;
    width: 1000px;
  }

  .data-chart-cards {
    width: 1100px;
  }

  .chart-table {
    padding-bottom: 25px;
  }

  .chart-img {
    display: flex;
    justify-content: center;
  }
</style>