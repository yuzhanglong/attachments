<!--基本信息组件-->
<template>
  <div id="basic-info">
    <label>
      <input v-model="basicInfo.title"
             @focus="input1Change(1)"
             @blur="input1Change(0)"
             :style="titleInput1Bgc">
    </label>
    <label>
      <input v-model="basicInfo.subTitle" id="sub-input"
             @focus="input2Change(1)"
             @blur="input2Change(0)"
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
      getRecoverData() {
        return this.recoverData
      },
      passbasicInfoData() {
        this.$emit('passData', this.basicInfo)
      },
      input1Change(index) {
        let color = ['#ffffff', '#f4f4f4'];
        this.titleInput1Bgc["background-color"] = color[index];
        if (!index) {
          this.passbasicInfoData();
        }
      },
      input2Change(index) {
        let color = ['#ffffff', '#f4f4f4'];
        this.titleInput2Bgc["background-color"] = color[index];
        if (!index) {
          this.passbasicInfoData();
        }
      }
    }
  }
</script>

<style scoped>
  input {
    font-size: 20px;
    border: none;
    width: calc(100vw - 820px);
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
    width: calc(100vw - 620px);
    height: 140px;
  }
</style>