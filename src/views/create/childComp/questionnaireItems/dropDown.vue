<template>
  <div id="dropDown">
    <div id="problem-header">
      <label>
        <input v-model="dropDown.title"
               @focus="bgcChange(1)"
               @blur="bgcChange(0)"
               :style="titleInputBgc" class="dropDownTitleInput">
      </label>
      <el-tag id="problem-right-type-tag">问题{{problemIndex + 1}}: 下拉题</el-tag>
    </div>


    <div id="choices">
      <div class="selection" v-for="(data, index) in dropDown.options" :key="data.key">
        <i class="el-icon-caret-bottom"></i>
        <label><input class="choiceInput" v-model="data.value" :placeholder="getProblemNumber(index)"></label>
        <i type="danger" class="el-icon-close" @click="removeChoice(data)"></i>
      </div>
    </div>
    <div id="dropDown-bottom">
      <el-link type="primary" icon="el-icon-plus" @click="addChoice" class="plus-tag">添加单个选项</el-link>
    </div>
  </div>
</template>

<script>
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
    },
    watch: {
      dropDown: {
        handler() {
          this.submitDataToQuestionnaire()
        },
        deep: true
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
      submitDataToQuestionnaire() {
        this.$emit('passData', this.dropDown);
      },
      bgcChange(index) {
        let color = ['#ffffff', '#f4f4f4'];
        this.titleInputBgc["background-color"] = color[index]
      },
      addChoice() {
        this.dropDown.options.push({
          //将新的题号赋给他
          value: ""
        })
      },
      removeChoice(item) {
        let index = this.dropDown.options.indexOf(item);
        if (index !== -1) {
          this.dropDown.options.splice(index, 1);
        }
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
    width: 1300px;
    height: auto;
  }

  .dropDownTitleInput {
    font-size: 18px;
    border: none;
    width: 1100px;
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