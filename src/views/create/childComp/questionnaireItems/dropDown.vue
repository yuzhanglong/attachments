<template>
  <div id="dropDown">
    <div id="problem-header">
      <label>
        <input v-model="dropDown.title"
               @focus="inputChange(1)"
               @blur="inputChange(0)"
               :style="titleInputBgc" class="dropDownTitleInput">
      </label>
      <el-tag id="problem-right-type-tag">问题{{problemIndex + 1}}: 下拉题</el-tag>
    </div>


    <div id="choices">
      <div class="selection" v-for="(data, index) in dropDown.options" :key="data.key">
        <i class="el-icon-caret-bottom"></i>
        <label>
          <input class="choiceInput"
                 v-model="data.value"
                 :placeholder="getProblemNumber(index)"
                 @blur="editOptionValue(index, data.value)">
        </label>
        <i type="danger" class="el-icon-close" @click="removeChoice(data)"></i>
      </div>
    </div>
    <div id="dropDown-bottom">
      <el-link type="primary" icon="el-icon-plus" @click="addChoice" class="plus-tag">添加单个选项</el-link>
    </div>
  </div>
</template>

<script>
  import {
    appendOneOption,
    deleteOneOption,
    editOptionValue,
    editProblemBasicInfo
  } from "../../../../network/questionnaireEdition";

  export default {
    name: "dropDown",
    props: {
      recoverData: {
        type: Object,
        required: true,
      },
      problemIndex: {
        required: true,
      },
      questionnaireFlag: {
        required: true,
      }
    },
    data() {
      return {
        dropDown: {
          index: this.problemIndex,
          type: "dropDown",
          title: this.recoverData.title ? this.recoverData.title : "点我为这道下拉题创建一个标题",
          options: this.recoverData.options,
        },
        titleInputBgc: {
          "background-color": "#ffffff"
        }
      }
    },
    methods: {
      editOptionValue(index, value) {
        editOptionValue(this.$store.state.token, this.questionnaireFlag, this.problemIndex, index, value);
      },
      inputChange(index) {
        let color = ['#ffffff', '#f4f4f4'];
        this.titleInputBgc["background-color"] = color[index];
        if (!index) {
          editProblemBasicInfo(this.$store.state.token, this.questionnaireFlag, this.problemIndex, this.dropDown.title, "None");
        }
      },
      addChoice() {
        let choiceData = {
          //为每个选项分配一个id
          optionId: new Date().getTime(),
          value: ""
        };
        this.dropDown.options.push(choiceData);
        appendOneOption(this.$store.state.token, this.questionnaireFlag, this.problemIndex, choiceData);
      },
      removeChoice(item) {
        let index = this.dropDown.options.indexOf(item);
        if (index !== -1) {
          this.dropDown.options.splice(index, 1);
        }
        deleteOneOption(this.$store.state.token, this.questionnaireFlag, this.problemIndex, index);
      },
      getProblemNumber(index) {
        return index <= 8 ? "选项 " + "0" + String(index + 1) : "选项 " + String(index + 1);
      }
    }
  }
</script>

<style scoped>
  #problem-header {
    display: flex;
  }

  .choice-title {
    padding-left: 8px;
  }

  .plus-tag {
    margin-top: 20px;
    margin-left: 60px;
  }

  #dropDown {
    margin-top: 20px;
    padding-bottom: 20px;
    background-color: #fff;
    width: calc(100vw - 620px);
    height: auto;
  }

  .dropDownTitleInput {
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

  .selection {
    padding-bottom: 10px;
  }

  #choices {
    display: flex;
    padding-top: 10px;
    padding-left: 60px;
    flex-direction: column;
  }

  .choiceInput {
    margin-left: 12px;
    border: none;
  }
</style>