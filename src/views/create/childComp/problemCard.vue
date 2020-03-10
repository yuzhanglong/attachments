<template>
  <div id="problem-card">
    <div id="problem-header">
      <!-- 此处插入问题名称  一般是个输入框-->
      <slot name="problem-name"></slot>
      <!-- 此处为题号标签-->
      <el-tag id="problem-right-type-tag">问题{{Number(questionNumber) + 1}}: {{problemTypeChineseName}}</el-tag>
    </div>
    <slot name="problem-body"></slot>
    <slot name="problem-bottom"></slot>
  </div>
</template>

<script>
  export default {
    name: "problemCard",
    props: {
      // 问题编号
      questionNumber: {
        required: true,
        type: Number
      },
      problemType: {
        required: true,
      }
    },
    computed: {
      problemTypeChineseName: function () {
        let problemTypeChineseNameMap = {
          "SINGLE_SELECT": "单选题",
          "MULTIPLY_SELECT": "多选题",
          "BLANK_FILL": "填空题",
          "DROP_DOWN": "下拉题",
          "SCORE": "评价题"
        };
        return problemTypeChineseNameMap[this.problemType]
      }
    }
  }
</script>

<style scoped>
  #problem-card {
    margin-top: 20px;
    padding-bottom: 20px;
    background-color: #fff;
    width: calc(100vw - 570px);
    height: auto;
  }

  #problem-header {
    display: flex;
  }

  #problem-right-type-tag {
    margin-top: 30px;
  }
</style>

