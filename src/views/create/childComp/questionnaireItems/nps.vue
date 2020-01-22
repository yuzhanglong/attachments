<template>
  <div id="nps">
    <div id="problem-header">
      <label>
        <input v-model="nps.title"
               @focus="bgcChange(1)"
               @blur="bgcChange(0)"
               :style="titleInputBgc" class="titleInput">
      </label>
      <el-tag id="problem-right-type-tag">问题{{problemIndex + 1}}: NPS题</el-tag>
    </div>


    <div id="choices">
      <div class="selection" v-for="(data, index) in nps.options" :key="data.key">
        <label><input :placeholder="getProblemNumber(index)" v-model="data.title" class="choice-input"></label>
        <i class="el-icon-close" @click="removeChoice(data)"></i>
        <div class="starShowItems">
          <img src="../../../../assets/img/problemType/nps_show.png" alt="" width="500px">
          <div id="nps-input-wrap">
            <label><input class="nps-left-input" v-model="data.lowest"></label>
            <label><input class="nps-right-input" v-model="data.highest"></label>
          </div>

        </div>
      </div>
    </div>


    <div id="nps-bottom">
      <el-link type="primary" icon="el-icon-plus" @click="addChoice" class="plus-tag">添加选项</el-link>
    </div>
  </div>
</template>

<script>
  export default {
    name: "nps",
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
      nps: {
        handler() {
          this.submitDataToQuestionnaire()
        },
        deep: true
      }
    },
    data() {
      return {
        nps: {
          index: this.problemIndex,
          type: "nps",
          title: this.recoverData.title ? this.recoverData.title : "点我为这一组NPS题创建标题",
          options: this.recoverData.options,
        },
        titleInputBgc: {
          "background-color": "#ffffff"
        }
      }
    },
    methods: {
      submitDataToQuestionnaire() {
        this.$emit('passData', this.nps);
      },
      bgcChange(index) {
        let color = ['#ffffff', '#f4f4f4'];
        this.titleInputBgc["background-color"] = color[index]
      },
      addChoice() {
        this.nps.options.push({
          //将新的题号赋给他
          title: "您向朋友或同事推荐我们的可能性有多大？",
          //最低评价期望
          lowest: "没有可能",
          //最高评价期望
          highest: "很有可能",
        })
      },
      removeChoice(item) {
        let index = this.nps.options.indexOf(item);
        if (index !== -1) {
          this.nps.options.splice(index, 1);
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

  .choice-input {
    border: none;
    padding-left: 8px;
    width: 400px;
    height: 35px;
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

  #nps {
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

  .starShowItems {
    display: flex;
    flex-direction: column;
  }

  #nps-input-wrap {
    padding-top: 10px;
  }

  .nps-left-input {
    border: none;
    margin-left: 10px;
  }

  .nps-right-input {
    border: none;
    margin-left: 130px;
  }

  .plus-tag {
    margin-top: 20px;
    margin-left: 60px;
  }

</style>