<template>
  <div id="multiplySelect">
    <div id="problem-header">
      <label>
        <input v-model="multiplySelect.title"
               @focus="bgcChange(1)"
               @blur="bgcChange(0)"
               :style="titleInputBgc" class="titleInput">
      </label>
      <el-tag id="problem-right-type-tag">多选题</el-tag>
    </div>
    <div id="choices">
      <div class="selection" v-for="(data, index) in multiplySelect.options" :key="data.key">
        <el-checkbox value="false">选项{{getProblemNumber(index)}}</el-checkbox>
        <label><input class="choiceInput" v-model="data.value"></label>
        <el-button type="danger" icon="el-icon-delete" circle size="small" class="delete-button"
                   @click="removeChoice(data)"></el-button>
      </div>
    </div>
    <div id="multiplySelect-bottom">
      <el-link type="primary" icon="el-icon-plus" @click="addChoice" class="plus-tag">添加选项</el-link>
    </div>
  </div>
</template>

<script>
  export default {
    name: "multiplySelect",
    created() {
      this.index = this.$store.state.questionnaireSendingData.problems.length;
    },
    watch: {
      multiplySelect: {
        handler() {
          this.submitDataToStore()
        },
        deep: true
      }
    },
    data() {
      return {
        index: "",
        multiplySelect: {
          type: "multiplySelect",
          title: "请输入问题标题",
          options: []
        },
        titleInputBgc: {
          "background-color": "#ffffff"
        }
      }
    },
    methods: {
      submitDataToStore() {
        this.$store.commit('appendOption', {
          index: this.index - 1,
          data: this.multiplySelect
        })
      },
      bgcChange(index) {
        let color = ['#ffffff', '#f4f4f4'];
        this.titleInputBgc["background-color"] = color[index]
      },
      addChoice() {
        this.multiplySelect.options.push({
          //将新的题号赋给他
          value: ""
        })
      },
      removeChoice(item) {
        let index = this.multiplySelect.options.indexOf(item);
        if (index !== -1) {
          this.multiplySelect.options.splice(index, 1);
        }
      },
      getProblemNumber(index) {
        return index <= 8 ? "0" + String(index + 1) : index + 1;
      },
      // getTypeChineseName(englishName) {
      //   let typechart = {
      //     'singleSelect': "单选题",
      //     'multiplySelect': "多选题",
      //     'blankFill': "填空题",
      //     'dropDown': '下拉题',
      //     'score': '评价题',
      //     'nps': 'nps题'
      //   };
      //   return typechart[englishName]
      // }
    },
  }
</script>

<style scoped>
  #problem-header {
    display: flex;
  }

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
    flex-direction: column;
  }

  #multiplySelect {
    margin-top: 20px;
    padding-bottom: 20px;
    background-color: #fff;
    width: 1300px;
    height: auto;
  }

  .titleInput {
    font-size: 18px;
    border: none;
    width: 1120px;
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