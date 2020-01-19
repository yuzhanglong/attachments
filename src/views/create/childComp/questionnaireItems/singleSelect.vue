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
        <el-radio value="false">选项{{getProblemNumber(index)}}</el-radio>
        <label><input class="choiceInput" v-model="data.value"></label>
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
    created() {
      //拿到index(就是题号)方便定位 *题号减一就是下标
      this.index = this.$store.state.questionnaireSendingData.problems.length;
      // console.log(this.index);
    },
    watch: {
      singleSelect: {
        handler() {
          this.submitDataToStore()
        },
        deep: true
      }
    },
    data() {
      return {
        index: "",
        singleSelect: {
          type: "singleSelect",
          title: "这是问题的标题 点我进行修改",
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
          data: this.singleSelect
        })
      },
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
    flex-direction: column;
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