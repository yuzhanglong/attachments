<template>
  <div id="singleSelect">
    <div id="problem-header">
      <label>
        <input v-model="singleSelect.title"
               @focus="bgcChange(1)"
               @blur="bgcChange(0)"
               :style="titleInputBgc" class="titleInput">
      </label>
      <el-tag id="problem-right-type-tag">问题{{problemIndex + 1}}: 单选题</el-tag>
    </div>
    <div id="choices">
      <div class="selection" v-for="(data, index) in singleSelect.options" :key="data.key">
        <el-radio value="false">选项{{getProblemNumber(index)}}</el-radio>
        <label>
          <input class="choiceInput" v-model="data.value">
        </label>
        <el-button type="danger" icon="el-icon-delete" circle size="small" class="delete-button"
                   @click="removeChoice(data)">
        </el-button>
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
      singleSelect: {
        handler() {
          this.submitDataToQuestionnaire();
        },
        deep: true
      }
    },
    data() {
      return {
        singleSelect: {
          index: this.problemIndex,
          type: "singleSelect",
          title: this.recoverData.title ? this.recoverData.title : "点我为这道单选题创建一个标题",
          options: this.recoverData.options,
        },
        titleInputBgc: {
          "background-color": "#ffffff"
        }
      }
    },
    methods: {
      //监听改变 上传数据
      submitDataToQuestionnaire() {
        this.$emit('passData', this.singleSelect);
      },
      bgcChange(index) {
        let color = ['#ffffff', '#f4f4f4'];
        this.titleInputBgc["background-color"] = color[index]
      },
      addChoice() {
        this.singleSelect.options.push({
          //为每个选项分配一个id
          optionId: new Date().getTime(),
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
      },
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

  #singleSelect {
    margin-top: 20px;
    padding-bottom: 20px;
    background-color: #fff;
    width: calc(100vw - 620px);
    height: auto;
  }

  .titleInput {
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
</style>