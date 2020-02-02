<template>
  <div id="blankFill">
    <div id="problem-header">
      <label>
        <input v-model="blankFill.title"
               @focus="inputChange(1)"
               @blur="inputChange(0)"
               :style="titleInputBgc" class="blankFillTitleInput">
      </label>
      <el-tag id="problem-right-type-tag">问题{{problemIndex + 1}}: 填空题</el-tag>
    </div>


    <el-input
            type="textarea"
            autosize
            placeholder="本题应在此处进行作答"
            v-model="blankFill.value" class="blankFillInput">
    </el-input>


  </div>
</template>

<script>
  import {editProblemBasicInfo} from "../../../../network/questionnaireEdition";

  export default {
    name: "blank",
    props: {
      problemIndex: {
        required: true,
      },
      recoverData: {
        type: Object,
        required: true,
      },
      questionnaireFlag: {
        required: true,
      }
    },
    data() {
      return {
        titleInputBgc: {
          "background-color": "#ffffff"
        },
        blankFill: {
          index: this.problemIndex,
          type: "blankFill",
          title: this.recoverData.title ? this.recoverData.title : "点我为这道填空题创建一个标题",
          value: this.recoverData.value
        }
      }
    },
    methods: {
      inputChange(index) {
        let color = ['#ffffff', '#f4f4f4'];
        this.titleInputBgc["background-color"] = color[index];
        if (!index) {
          editProblemBasicInfo(this.$store.state.token, this.questionnaireFlag, this.problemIndex, this.blankFill.title, "None");
        }
      }
    },
  }
</script>

<style scoped>
  #problem-header {
    display: flex;
  }

  #blankFill {
    margin-top: 20px;
    padding-bottom: 20px;
    background-color: #fff;
    width: calc(100vw - 620px);
    height: auto;
  }

  .blankFillTitleInput {
    font-size: 18px;
    border: none;
    width: calc(100vw - 820px);
    margin-top: 20px;
    padding-left: 15px;
    margin-left: 40px;
    margin-bottom: 8px;
    background-color: #ffffff;
    height: 40px;
  }

  .blankFillInput {
    width: calc(100vw - 820px);
    padding-left: 15px;
    margin-left: 40px;
    margin-top: 10px;
  }
</style>