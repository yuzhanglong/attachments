<template>
  <div id="complete">
    <b-scroll class="content">
      <div id="secret-checker" v-show="isSecret">
        <secret-input @passkey="checkKeys"></secret-input>
      </div>
      <div id="questionnaire" v-show="!isSecret">
        <div id="title-group">
          <h3 id="title">{{data.basicInfo.title}}</h3>
          <h4 id="sub-title">{{data.basicInfo.subTitle}}</h4>
        </div>
        <div id="question-group">
          <div v-for="(problem, index) in data.problems" :key="problem.tag" class="question-items">
            <div class="single-select" v-if="problem.common.type === 'singleSelect'">
              <h5>
                <span class="required-star">{{checkIsRequire(problem.globalSetting.required)}}</span>
                [单选题] {{index + 1}}. {{problem.common.title}}
              </h5>
              <el-radio-group v-model="problemResults[index][0]">
                <div v-for="(option, index) in problem.common.options" :key="option.value" class="radio-wrap">
                  <el-radio :label="index">
                    {{option.value}}
                  </el-radio>
                </div>
              </el-radio-group>
            </div>
            <div class="multiply-select" v-if="problem.common.type === 'multiplySelect'">
              <h5>
                <span class="required-star">{{checkIsRequire(problem.globalSetting.required)}}</span>
                [多选题] {{index + 1}}. {{problem.common.title}}
              </h5>
              <el-checkbox-group v-model="problemResults[index]">
                <div v-for="(option, index) in problem.common.options" :key="option.value" class="checkbox-wrap">
                  <el-checkbox :label="index">
                    {{option.value}}
                  </el-checkbox>
                </div>
              </el-checkbox-group>
            </div>
            <div class="blank-fill" v-if="problem.common.type === 'blankFill'">
              <h5>
                <span class="required-star">{{checkIsRequire(problem.globalSetting.required)}}</span>
                [填空题] {{index + 1}}. {{problem.common.title}}
              </h5>
              <div class="blank-fill-wrap">
                <el-input placeholder="请在此处作答" autosize v-model="problemResults[index][0]"></el-input>
              </div>
            </div>
            <div class="drop-down" v-if="problem.common.type === 'dropDown'">
              <h5>
                <span class="required-star">{{checkIsRequire(problem.globalSetting.required)}}</span>
                [下拉题] {{index + 1}}. {{problem.common.title}}
              </h5>
              <el-select v-model="problemResults[index][0]" placeholder="请选择一个选项" class="drop-down-select">
                <el-option v-for="(option, index) in problem.common.options" :key="option.value" :label="option.value"
                           :value="index">
                </el-option>
              </el-select>
            </div>
            <div class="mark-score" v-if="problem.common.type === 'score'">
              <h5>
                <span class="required-star">{{checkIsRequire(problem.globalSetting.required)}}</span>
                [评价题] {{index + 1}}. {{problem.common.title}}
              </h5>
              <div v-for="(option, index2) in problem.common.options" :key="option.value" class="score-wrap">
                <div class="score-item-title"><span>{{index2 + 1}}). {{option.title}}</span></div>
                <el-rate
                        v-model="problemResults[index][index2]"
                        :colors="scoreColor">
                </el-rate>
              </div>
            </div>
          </div>
        </div>
        <div id="bottom-group">
          <el-button id="bottom-button" type="primary" @click="submitComplete">提交问卷</el-button>
        </div>
      </div>
    </b-scroll>

  </div>

</template>

<script>
  import {checkSecretKey, getCondition, getProblems, submitComplete} from "../../network/complete";
  import secretInput from "./childComp/secretInput";
  import bScroll from "../../components/bScroll/bScroll";

  export default {
    name: "complete",
    components: {
      secretInput,
      bScroll
    },
    created() {
      this.getCondition()
    },
    data() {
      return {
        isSecret: true,
        isSubmit: false,
        condition: {},
        data: {
          basicInfo: {
            subTitle: "",
            title: "",
          },
          problems: [],
        },
        problemResults: [],
        scoreColor: ['#99A9BF', '#F7BA2A', '#FF9900']
      }
    },
    methods: {
      getCondition() {
        getCondition(this.$route.params.flag)
                .then(res => {
                  //问卷过期
                  this.condition = res['information'];
                  if (!this.condition['questionnaireCondition']) {
                    this.$messageBox.showInfoMessage(this, "这个问卷已经过期");
                    return
                  }
                  if (this.condition['questionnaireIsSecret']) {
                    this.$messageBox.showInfoMessage(this, "请输入密码以进入");
                    return
                  }
                  //抽取问题
                  this.getProblems();
                })
                .catch(() => {
                  //问卷不存在
                  this.$messageBox.showErrorMessage(this, "这个问卷不存在,请确认链接无误!");
                })
      },
      checkKeys(res) {
        checkSecretKey(this.$route.params.flag, res)
                .then(() => {
                  this.$messageBox.showSuccessMessage(this, "验证通过!");
                  this.getProblems();
                })
                .catch(() => {
                  this.$messageBox.showErrorMessage(this, "验证失败!");
                })
      },
      getProblems() {
        this.isSecret = false;
        getProblems(this.$route.params.flag)
                .then(res => {
                  this.data = res['information'];
                  let pSize = res['information']['problems'].length;
                  for (let i = 0; i < pSize; i++) {
                    this.problemResults.push([]);
                  }
                })
      },
      checkIsRequire(requirement) {
        return requirement ? "*" : "&nbsp;";
      },
      submitComplete() {
        //必填项检验
        if (!this.checkIsComplete()) return;
        //设备检验 有限制 并且已经提交过
        if (this.condition['questionnaireEquipmentControl'] && this.checkIsSubmit()) return;
        //提交填报数据
        submitComplete(this.problemResults, this.$route.params.flag)
                .then(() => {
                  this.$messageBox.showSuccessMessage(this, "提交成功,感谢您的参与!");
                  this.setIsSubmit();
                  //接下来跳向发布者自定义的结束界面
                  this.$router.replace('/success');
                })
                .catch(() => {
                  this.$messageBox.showInfoMessage(this, "一个用户只能提交一次，请不要重复提交");
                })
      },
      checkIsComplete() {
        for (let i = 0; i < this.data.problems.length; i++) {
          if (this.data.problems[i].globalSetting.required && !this.problemResults[i].length) {
            this.$messageBox.showInfoMessage(this, "请完成所有必填项!");
            return false;
          }
        }
        return true;
      },
      setIsSubmit() {
        window.localStorage.setItem('isSubmit', 'true');
      },
      checkIsSubmit() {
        let i = window.localStorage.getItem('isSubmit') !== null;
        if (i) {
          this.$messageBox.showInfoMessage(this, "一个人只能提交一次,请不要重复提交!");
          return true;
        }
        return false;
      }
    }
  }
</script>

<style scoped>
  .question-items {
    padding-top: 15px;
    padding-bottom: 15px;
  }

  #bottom-group {
    display: flex;
    justify-content: center;
  }

  #bottom-button {
    width: 200px;
    margin-right: 15px;
  }

  .drop-down-select {
    padding: 5px;
    width: 300px;
  }

  .required-star {
    color: red;
  }

  #complete {
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    padding: 15px 12px;
  }

  #sub-title {
    font-weight: lighter;
  }

  #title-group {
    padding-bottom: 8px;
  }

  .radio-wrap, .checkbox-wrap {
    padding: 5px;
  }

  .blank-fill-wrap {
    width: 300px;
    padding: 5px;
  }

  .score-item-title {
    padding: 5px 5px 20px;
  }

  .score-wrap {
    padding: 10px;
  }
  .content{
    height: 90vh;
  }
</style>