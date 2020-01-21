<template>
  <div id="blankFill">
    <div id="problem-header">
      <label>
        <input v-model="blankFill.title"
               @focus="bgcChange(1)"
               @blur="bgcChange(0)"
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
  export default {
    name: "blank",
    props: {
      problemIndex: {
        required: true,
      },
    },
    watch: {
      blankFill: {
        handler() {
          this.submitDataToQuestionnaire()
        },
        deep: true
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
          title: "请输入问题标题",
          value: ""
        }
      }
    },
    methods: {
      submitDataToQuestionnaire() {
        this.$emit('passData', this.blankFill);
      },
      bgcChange(index) {
        let color = ['#ffffff', '#f4f4f4'];
        this.titleInputBgc["background-color"] = color[index]
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
    width: 1300px;
    height: auto;
  }

  .blankFillTitleInput {
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

  .blankFillInput {
    width: 800px;
    padding-left: 15px;
    margin-left: 40px;
    margin-top: 10px;
  }
</style>