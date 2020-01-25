<template>
  <div id="chartBackground">
    <div id="chart-container">
      <div id="chart-items">
        <pule-data-card class="data-chart-cards">
          <div class="chart-title">
            <span class="chart-title-text">Q(index + 1)</span>
            <el-divider></el-divider>
          </div>
          <div class="chart-img">
          </div>
          <div class="chart-table">
            <el-table
                    :data="tableData"
                    stripe
                    style="width: 100%">
              <el-table-column
                      prop="date"
                      label="选项"
                      width="550">
              </el-table-column>
              <el-table-column
                      prop="name"
                      label="回复情况">
              </el-table-column>
            </el-table>
          </div>
        </pule-data-card>
      </div>
    </div>


  </div>
</template>

<script>
  import puleDataCard from "../../../components/dataCard/puleDataCard";

  export default {
    name: "chartBackground",
    components: {
      puleDataCard
    },
    methods: {}
  }
</script>

<style scoped>
  #chart-container {
    padding-top: 20vh;
    padding-left: 10vw;
    padding-right: 10vw;
    display: flex;
    justify-content: center;
  }

  .chart-title {
    padding-top: 10px;
  }
  .data-chart-cards{
    width: 1100px;
  }
  .chart-table{
    padding-bottom: 25px;
  }

</style>