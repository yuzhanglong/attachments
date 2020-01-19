<template>
  <div id="dropDown">
    <label>
      <input v-model="dropDown.title"
             @focus="bgcChange(1)"
             @blur="bgcChange(0)"
             :style="titleInputBgc" class="dropDownTitleInput">
    </label>

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
    data() {
      return {
        dropDown: {
          type: "dropDown",
          index: "",
          title: "请选择一个选项",
          options: []
        },
        titleInputBgc: {
          "background-color": "#ffffff"
        }
      }
    },
    methods: {
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
    width: 1200px;
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