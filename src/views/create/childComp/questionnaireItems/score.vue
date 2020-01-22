<template>
  <div id="score">
    <div id="problem-header">
      <label>
        <input v-model="score.title"
               @focus="bgcChange(1)"
               @blur="bgcChange(0)"
               :style="titleInputBgc" class="titleInput">
      </label>
      <el-tag id="problem-right-type-tag">问题{{problemIndex + 1}}: 评价题</el-tag>
    </div>


    <div id="choices">
      <div class="selection" v-for="(data, index) in score.options" :key="data.key">
        <label><input :placeholder="getProblemNumber(index)" v-model="data.title" class="choice-input"></label>
        <i class="el-icon-close" @click="removeChoice(data)"></i>
        <div class="starShowItems">
          <i class="el-icon-star-on"></i>
          <i class="el-icon-star-off"></i>
          <i class="el-icon-star-off"></i>
          <i class="el-icon-star-off"></i>
          <i class="el-icon-star-off"></i>
        </div>
      </div>
    </div>


    <div id="score-bottom">
      <el-link type="primary" icon="el-icon-plus" @click="addChoice" class="plus-tag">添加选项</el-link>
    </div>
  </div>
</template>

<script>
  export default {
    name: "score",
    props: {
      problemIndex: {
        required: true,
      },
      recoverData: {
        type: Object,
        required: true,
      },
    },
    watch: {
      score: {
        handler() {
          this.submitDataToQuestionnaire()
        },
        deep: true
      }
    },
    data() {
      return {
        score: {
          index: this.problemIndex,
          type: "score",
          title: this.recoverData.title ? this.recoverData.title : "点我为这一组评价题创建标题",
          options: this.recoverData.options,
        },
        titleInputBgc: {
          "background-color": "#ffffff"
        }
      }
    },
    methods: {
      submitDataToQuestionnaire() {
        this.$emit('passData', this.score);
      },
      bgcChange(index) {
        let color = ['#ffffff', '#f4f4f4'];
        this.titleInputBgc["background-color"] = color[index]
      },
      addChoice() {
        this.score.options.push({
          //将新的题号赋给他
          title: ""
        })
      },
      removeChoice(item) {
        let index = this.score.options.indexOf(item);
        if (index !== -1) {
          this.score.options.splice(index, 1);
        }
      },
      getProblemNumber(index) {
        return index <= 8 ? "选项" + "0" + String(index + 1) : "选项" + String(index + 1);
      }
    }
  }
</script>

<style scoped>
  #problem-header {
    display: flex;
  }

  #score {
    margin-top: 20px;
    padding-bottom: 20px;
    background-color: #fff;
    width: 1300px;
    height: auto;
  }

  .titleInput {
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
    padding-bottom: 40px;
  }

  #choices {
    display: flex;
    padding-top: 10px;
    padding-left: 60px;
    flex-direction: column;
  }

  .plus-tag {
    margin-top: 20px;
    margin-left: 60px;
  }

  .choice-input {
    border: none;
  }

  .starShowItems {
    display: flex;
    width: 200px;
  }

  .el-icon-star-on, .el-icon-star-off {
    flex-grow: 0.5;
    font-size: 25px;
    margin-top: 15px;
  }
</style>