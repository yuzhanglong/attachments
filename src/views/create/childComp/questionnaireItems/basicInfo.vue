<!--基本信息组件-->
<template>
  <div id="basic-info">
    <label>
      <input v-model="basicInfo.title" @input="passbasicInfoData"
             @focus="bgc1Change(1)"
             @blur="bgc1Change(0)"
             :style="titleInput1Bgc">
    </label>
    <label>
      <input v-model="basicInfo.subTitle" id="sub-input" @input="passbasicInfoData"
             @focus="bgc2Change(1)"
             @blur="bgc2Change(0)"
             :style="titleInput2Bgc">
    </label>
  </div>
</template>

<script>
  export default {
    name: "basicInfo",
    props: {
      recoverData: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        basicInfo: this.getRecoverData(),
        titleInput1Bgc: {
          "background-color": "#ffffff"
        },
        titleInput2Bgc: {
          "background-color": "#ffffff"
        }
      }
    },
    methods: {
      getRecoverData(){
        return this.recoverData
      },
      passbasicInfoData() {
        this.$emit('passData', this.basicInfo)
      },
      bgc1Change(index) {
        let color = ['#ffffff', '#f4f4f4'];
        this.titleInput1Bgc["background-color"] = color[index]
      },
      bgc2Change(index) {
        let color = ['#ffffff', '#f4f4f4'];
        this.titleInput2Bgc["background-color"] = color[index]
      }
    }
  }
</script>

<style scoped>
  input {
    font-size: 20px;
    border: none;
    width: 1200px;
    margin-top: 20px;
    padding-left: 15px;
    margin-left: 40px;
    margin-bottom: 8px;
    background-color: #f4f4f4;
    height: 40px;
  }

  #sub-input {
    margin-top: 8px;
    font-size: 16px;
  }

  #basic-info {
    margin-top: 31px;
    background-color: #ffffff;
    width: 1300px;
    height: 140px;
  }
</style>