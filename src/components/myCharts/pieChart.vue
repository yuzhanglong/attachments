<template>
  <div>
    <div :id="uniqueId" style="width: 400px; height: 400px;" v-show="chartsShow">
    </div>
    <div class="no-chart-message-wrap">
      <span v-show="!chartsShow" class="no-chart-message">
        抱歉,这道题没有图表数据
          <el-tooltip class="item" effect="dark" :content="reason" placement="right">
            <i class="el-icon-question"></i>
          </el-tooltip>
      </span>
    </div>

  </div>
</template>

<script>
  // 基本组件
  import echarts from 'echarts'

  export default {
    name: "pieChart",
    props: {
      floatText: {
        type: String,
        required: true
      },
      DataDict: {
        type: Array,
        required: true
      },
      isShow: {
        type: Boolean,
        required: true
      }
    },
    created() {
      this.uniqueId = this.generateUniqueId();
      if (!this.DataDict.length) {
        this.chartsShow = false
      }
    },
    data() {
      return {
        chartsShow: this.isShow,
        uniqueId: "",
        reason: "这道题目没有人填写数据或者这道题目暂时不支持数据可视化展示"
      }
    },
    mounted() {
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [
          {
            name: this.floatText,
            type: 'pie',
            radius: '65%',
            center: ['50%', '50%'],
            data: this.DataDict,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      //初始化图表
      const chartObj = echarts.init(document.getElementById(this.uniqueId));
      chartObj.setOption(option);
    },
    methods: {
      generateUniqueId() {
        return new Date().getTime()
      },
    }
  }
</script>

<style scoped>
  .no-chart-message {
    color: rgba(7, 0, 3, 0.39);
  }

  .no-chart-message-wrap {
    padding-top: 20px;
    padding-bottom: 20px;
  }
</style>