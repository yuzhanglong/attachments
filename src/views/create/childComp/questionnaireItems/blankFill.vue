<template>
  <div id="blankFill">
    <label>
      <input v-model="blankFill.title"
             @focus="bgcChange(1)"
             @blur="bgcChange(0)"
             :style="titleInputBgc" class="blankFillTitleInput">
    </label>

    <el-input
            type="textarea"
            autosize
            placeholder="本题应在此处进行作答"
            v-model="blankFill.value"  class="blankFillInput">
    </el-input>


  </div>
</template>

<script>
  export default {
    name: "blank",
    created() {
      this.index = this.$store.state.questionnaireSendingData.problems.length;
    },
    watch: {
      blankFill: {
        handler() {
          this.submitDataToStore()
        },
        deep: true
      }
    },
    data() {
      return {
        index: "",
        titleInputBgc: {
          "background-color": "#ffffff"
        },
        blankFill: {
          type: "blankFill",
          title: "请输入问题标题",
          value: ""
        }
      }
    },
    methods: {
      submitDataToStore() {
        this.$store.commit('appendOption', {
          index: this.index - 1,
          data: this.blankFill
        })
      },
      bgcChange(index) {
        let color = ['#ffffff', '#f4f4f4'];
        this.titleInputBgc["background-color"] = color[index]
      }
    },
  }
</script>

<style scoped>
  #blankFill {
    margin-top: 20px;
    padding-bottom: 20px;
    background-color: #fff;
    width: 1300px;
    height: auto;
  }
  .blankFillTitleInput {
    font-size: 18px;
    border: none;
    width: 1200px;
    margin-top: 20px;
    padding-left: 15px;
    margin-left: 40px;
    margin-bottom: 8px;
    background-color: #ffffff;
    height: 40px;
  }
  .blankFillInput{
    width: 800px;
    padding-left: 15px;
    margin-left: 40px;
    margin-top: 10px;
  }
</style>