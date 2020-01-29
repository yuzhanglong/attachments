<template>
  <div id="chinaMap">
  </div>
</template>

<script>
  import echarts from "echarts/lib/echarts";
  import 'echarts/lib/component/tooltip'
  import 'echarts/lib/component/legend'
  import 'echarts/map/js/china'

  export default {
    name: "chinaMap",
    props: {
      title: {
        type: String,
        required: true
      },
      subTitle: {
        type: String,
      },
      titleSize: {
        type: Number,
        default: 15
      },
      subtitleSize: {
        type: Number,
        default: 12
      },
      titleColor: {
        type: String,
        default: "black"
      },
      tooltipShow: {
        type: Boolean,
        default: true
      },
      visualMapShow: {
        type: Boolean,
        default: false
      },
      colorSection: {
        type: Array,
        default() {
          return ['#929993', '#3AB9FF']
        }
      },
      visuaMapShowSection: {
        type: Array,
        default() {
          return [0, 100]
        }
      },
      visualMapShowText: {
        type: Array,
        default() {
          return ['高', '低']
        }
      },
      showProvinceText: {
        type: Boolean,
        default: true
      },
      isZoom: {
        type: Boolean,
        default: false
      },
      provinceBorderColor: {
        type: String,
        default: '#3B5077'
      },
      provinceEmphasisColor: {
        type: String,
        default: '#d2d6bf'
      },
      data: {
        type: Array,
        required: true
      }
    },
    mounted() {
      const option = {
        title: {
          text: this.title,
          subtext: this.subTitle,
          x: 'center',
          textStyle: {
            color: this.titleColor,
            fontSize: this.titleSize
          },
          subtextStyle: {
            fontSize: this.subtitleSize,
          }
        },
        tooltip: {
          show: this.tooltipShow,
          trigger: 'item',
          formatter: '{b} : {c}'
        },
        visualMap: {
          show: this.visualMapShow,
          min: this.visuaMapShowSection[0],
          max: this.visuaMapShowSection[1],
          left: 'left',
          top: 'bottom',
          text: this.visualMapShowText,
          calculable: true,
          seriesIndex: [1],
          inRange: {
            color: this.colorSection
          }
        },
        series: [
          {
            name: '地图',
            type: 'scatter',
            coordinateSystem: 'geo',
          },
          {
            type: 'map',
            map: 'china',
            geoIndex: 0,
            aspectScale: 0.75,
            showLegendSymbol: false,
            label: {
              normal: {
                show: this.showProvinceText
              },
              emphasis: {
                show: false,
                textStyle: {
                  color: '#fff'
                }
              }
            },
            roam: this.isZoom,
            itemStyle: {
              normal: {
                areaColor: '#d6d6d6',
                borderColor: this.provinceBorderColor,
              },
              emphasis: {
                areaColor: this.provinceEmphasisColor
              }
            },
            animation: false,
            data: this.data
          },
        ]
      };
      //初始化图表
      const chartObj = echarts.init(document.getElementById('chinaMap'));
      chartObj.setOption(option);
    },
  }
</script>

<style scoped>
  #chinaMap {
    padding-left: 125px;
    width: 800px;
    height: 600px;
  }
</style>