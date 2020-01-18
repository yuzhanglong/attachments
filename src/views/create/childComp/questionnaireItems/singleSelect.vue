<template>
  <div id="singleSelect">
    <label>
      <input v-model="singleSelect.title"
             @focus="bgcChange(1)"
             @blur="bgcChange(0)"
             :style="titleInputBgc" class="titleInput">
    </label>
    <div id="choices">
      <div class="selection" v-for="(data, index) in singleSelect.options" :key="data.key">
        <el-radio>选项{{getProblemNumber(index)}}</el-radio>
        <label><input class="choiceInput" v-model="data.value"></label>
        <el-button type="danger" icon="el-icon-delete" circle size="small" class="delete-button"
                   @click="removeChoice(data)"></el-button>
      </div>
    </div>
    <div id="singleSelect-bottom">
      <el-link type="primary" icon="el-icon-plus" @click="addChoice" class="plus-tag">添加选项</el-link>
    </div>

  </div>
</template>

<script>
  export default {
    name: "singleSelect",
    data() {
      return {
        singleSelect: {
          type: "singleSelect",
          index: "",
          title: "请输入问题标题",
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
        this.singleSelect.options.push({
          //将新的题号赋给他
          value: ""
        })
      },
      removeChoice(item) {
        let index = this.singleSelect.options.indexOf(item);
        if (index !== -1) {
          this.singleSelect.options.splice(index, 1);
        }
      },
      getProblemNumber(index) {
        return index <= 8 ? "0" + String(index + 1) : index + 1;
      }
    },
  }
  //单选题样例
  // {
  //   "type": "单选题",
  //         "title": "这是题目的标题",
  //         "index": 1,
  //         //这是题号
  //         "options": [
  //   {
  //     //选项序号
  //     "text": "第一个选项"
  //     //选项描述
  //   },
  //   {
  //     "text": "第二个选项"
  //   },
  //   {
  //     "text": "第三个选项"
  //   }
  // ]
  // }
</script>

<style scoped>
  .plus-tag {
    margin-top: 20px;
    margin-left: 60px;
  }

  .choiceInput {
    height: 23px;
  }

  .delete-button {
    margin-left: 20px;
  }

  #choices {
    display: flex;
    padding-top: 10px;
    padding-left: 60px;
    flex-direction: column;;
  }

  #singleSelect {
    margin-top: 20px;
    padding-bottom: 20px;
    background-color: #fff;
    width: 1300px;
    height: auto;
  }

  .titleInput {
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
</style>