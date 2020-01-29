<template>
  <div id="globalChartBackground">
    <pule-data-card>
      <china-map title="问卷来源概览" visual-map-show :data="getData()"></china-map>
    </pule-data-card>
  </div>
</template>

<script>
  import PuleDataCard from "../../../components/dataCard/puleDataCard";
  import ChinaMap from "../../../components/myCharts/chinaMap";

  export default {
    name: "globalChartBackground",
    components: {
      ChinaMap,
      PuleDataCard
    },
    props: {
      gData: {
        type: Object,
        required: true
      }
    },
    methods: {
      getData() {
        let list = [];
        for (let index in this.gData) {
          list.push({
            name: index,
            value: this.gData[index]
          })
        }
        return list
      }
    }
  }
</script>

<style scoped>
  #globalChartBackground {
    width: 1000px;
    padding-top: 200px;
  }
</style>