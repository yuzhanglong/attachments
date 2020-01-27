<template>
  <div id="chartBackground">
    <pule-data-card class="data-chart-cards">
      <div class="chart-title">
        <span class="chart-title-text">Question{{questionNum + 1}}:{{questionData.title}}</span>
        <el-divider></el-divider>
      </div>
      <div id="chart-img" style="height: 300px;width: 300px">

      </div>
      <div class="chart-table">
        <el-table
                :data="questionData.data"
                stripe
                style="width: 100%">
          <el-table-column
                  prop="title"
                  label="选项"
                  width="550">
          </el-table-column>
          <el-table-column
                  prop="numbers"
                  label="选择此项的个数">
          </el-table-column>
        </el-table>
      </div>
    </pule-data-card>
  </div>
</template>

<script>
  import puleDataCard from "../../../components/dataCard/puleDataCard";

  export default {
    name: "chartBackground",
    mounted() {
      this.makePieChart();
    },
    props: {
      questionNum: {
        required: true
      },
      questionData: {
        required: true,
      }
    },
    components: {
      puleDataCard
    },
    methods: {
      makePieChart() {
        let list = [];
        for (let index in this.questionData.data) {
          list.push({
            name: this.questionData.data[index].numbers,
            value: this.questionData.data[index].title
          })
        }
        console.log(list);
        this.$echart.pieChart('chart-img', "iiiii", list)
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
  }

  .data-chart-cards {
    width: 1100px;
  }

  .chart-table {
    padding-bottom: 25px;
  }

</style>