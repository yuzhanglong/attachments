//此处封装echarts

import echarts from 'echarts'

const install = function (Vue) {
  //Object.defineProperties() 方法直接在一个对象上定义新的属性或修改现有属性，并返回该对象。
  Object.defineProperties(Vue.prototype, {
    $echart: {
      get() {
        return {
          //柱状图
          //需要：元素的id  元素的标题  x轴的内容（array） y轴的内容（array）
          //适用于选择题一类 x轴为每一个选项 y轴为每一个选项的人数
          barChart(elementid, title, xData, ydata) {
            this.echart = echarts.init(document.getElementById(elementid));
            this.echart.clear();
            const optionData = {
              title: {
                text: title,
                left: 'center'
              },
              tooltip: {},
              xAxis: {
                data: xData
              },
              yAxis: {},
              series: [{
                name: '选项',
                type: 'bar',
                data: ydata
              }]
            };
            this.echart.setOption(optionData);
          },
          //需要：piedata  array  例如  data: [{value: 335, name: '直接访问'},{value: 310, name: '邮件营销'}]
          pieChart(elementid, title, pieData) {
            this.echart = echarts.init(document.getElementById(elementid));
            this.echart.clear();
            const optionData = {
              title: {
                text: title,
                left: 'center'
              },
              tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
              },
              series: [
                {
                  name: title,
                  type: 'pie',
                  radius: '55%',
                  center: ['50%', '45%'],
                  data: pieData,
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
            this.echart.setOption(optionData);
          }
        }
      }
    }
  })
};

export default {
  install
}