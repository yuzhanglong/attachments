<template>
  <div id="complete">
    <b-scroll class="content">
      <div id="secret-checker" v-if="isShowSecretInput">
        <secret-input @passkey="checkKeys"></secret-input>
      </div>
      <!--表单开始-->
      <div id="questionnaire" v-if="isShowCompleteForm">

        <!--表单标题-->
        <div id="title-group">
          <h3 id="title">{{data.basicInfo.title}}</h3>
          <h4 id="sub-title">{{data.basicInfo.subTitle}}</h4>
        </div>
        <div id="question-group">
          <div v-for="(problem, index) in data.problems" :key="problem.tag" class="question-items">

            <!-- 单选题 -->
            <div class="single-select" v-if="problem.type === 'SINGLE_SELECT'">
              <h5>
                <span class="required-star">{{checkIsRequire(problem.isRequire)}}</span>
                [单选题] {{index + 1}}. {{problem.title}}
              </h5>
              <el-radio-group v-model="problemResults[index].resolution[0]">
                <div v-for="(option, index) in problem.options" :key="option.optionId" class="radio-wrap">
                  <el-radio :label="index">
                    {{option.title}}
                  </el-radio>
                </div>
              </el-radio-group>
            </div>

            <!-- 多选题 -->
            <div class="multiply-select" v-if="problem.type === 'MULTIPLY_SELECT'">
              <h5>
                <span class="required-star">{{checkIsRequire(problem.isRequire)}}</span>
                [多选题] {{index + 1}}. {{problem.title}}
              </h5>
              <el-checkbox-group v-model="problemResults[index].resolution">
                <div v-for="(option, index) in problem.options" :key="option.optionId" class="checkbox-wrap">
                  <el-checkbox :label="index">
                    {{option.title}}
                  </el-checkbox>
                </div>
              </el-checkbox-group>
            </div>

            <!-- 填空题 -->
            <div class="blank-fill" v-if="problem.type === 'BLANK_FILL'">
              <h5>
                <span class="required-star">{{checkIsRequire(problem.isRequire)}}</span>
                [填空题] {{index + 1}}. {{problem.title}}
              </h5>
              <div class="blank-fill-wrap">
                <el-input placeholder="请在此处作答" autosize v-model="problemResults[index].resolution[0]"></el-input>
              </div>
            </div>

            <!-- 下拉题-->
            <div class="drop-down" v-if="problem.type === 'DROP_DOWN'">
              <h5>
                <span class="required-star">{{checkIsRequire(problem.isRequire)}}</span>
                [下拉题] {{index + 1}}. {{problem.title}}
              </h5>
              <el-select v-model="problemResults[index].resolution[0]" placeholder="请选择一个选项"
                         class="drop-down-select">
                <el-option v-for="(option, index) in problem.options" :key="option.title" :label="option.title"
                           :value="index">
                </el-option>
              </el-select>
            </div>

            <!--评价题-->
            <div class="score" v-if="problem.type === 'SCORE'">
              <h5>
                <span class="required-star">{{checkIsRequire(problem.isRequire)}}</span>
                [评价题] {{index + 1}}. {{problem.title}}
              </h5>

              <el-rate v-model="problemResults[index].resolution[0]" :colors="rateColor">
              </el-rate>
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
  import {checkSecretKey, getCondition, submitComplete} from "../../network/complete";
  import secretInput from "./childComp/secretInput";
  import bScroll from "../../components/bScroll/bScroll";
  import {Questionnaire, QuestionnaireCondition} from "../../models/questionnaire_model";

  export default {
    name: "complete",
    components: {
      secretInput,
      bScroll
    },
    created() {
      this.judgeSituation(this.situation);
    },
    data() {
      return {
        rateColor: ['#99A9BF', '#F7BA2A', '#FF9900'],
        // 是否展示问卷密码输入框
        isShowSecretInput: false,
        // 是否展示问卷填报表单
        isShowCompleteForm: false,
        isSubmit: false,
        condition: {},
        data: {
          basicInfo: {
            subTitle: "",
            title: "",
          },
          problems: [],
        },
        situation: this.$route.query.type,
        problemResults: [],
        scoreColor: ['#99A9BF', '#F7BA2A', '#FF9900']
      }
    },

    methods: {
      renewTitle() {
        if (this.situation === 'fill') {
          document.title = this.data.basicInfo.title
        } else if (this.situation === 'preview') {
          document.title = "预览-" + this.data.basicInfo.title;
        }
      },

      // 判断情况是预览还是填写
      judgeSituation(type) {
        if (type === "fill") {
          this.getCondition();
        } else if (type === "preview") {
          this.getProblems();
        }
      },

      getCondition() {
        getCondition(this.$route.params.flag)
          .then(res => {
            // 问卷过期
            let q = new QuestionnaireCondition(res);
            if (!q.condition) {
              document.title = "问卷已过期";
              this.$messageBox.showInfoMessage(this, "这个问卷已经过期");
              return
            }
            // 问卷加密
            if (q.isSecret) {
              document.title = "身份验证";
              this.isShowSecretInput = true;
              this.$messageBox.showInfoMessage(this, "请输入密码以进入");
              return
            }
            //抽取问题
            this.getProblems();
          })
          .catch(() => {
            //问卷不存在
            document.title = "问卷不存在";
            this.$messageBox.showErrorMessage(this, "这个问卷不存在,请确认链接无误!");
          })
      },

      showPreviewNotice() {
        this.$notify({
          title: "系统消息",
          message: '当前您处在预览模式<p>注意：所有的提交都不会被保存',
          type: 'success',
          duration: 4000,
          dangerouslyUseHTMLString: true,
        });
      },

      // 验证问卷密码 通过则开始渲染表单
      checkKeys(res) {
        checkSecretKey(this.$route.params.flag, res)
          .then((res) => {
            console.log(res);
            let q = new Questionnaire(res);
            this.data.basicInfo = q.basicInfo;
            this.data.problems = q.problems;
            this.$messageBox.showSuccessMessage(this, "验证通过!");
            this.initResolution(q.problems);
          })
          .catch(() => {
            this.$messageBox.showErrorMessage(this, "验证失败!");
          })
      },

      // 开始渲染答题表单
      getProblems() {
        checkSecretKey(this.$route.params.flag, null)
          .then(res => {
            let q = new Questionnaire(res);
            this.data.basicInfo = q.basicInfo;
            this.data.problems = q.problems;
            this.initResolution(q.problems);
          })
      },


      // 初始化提交环境
      initResolution(problems) {
        this.isShowSecretInput = false;
        this.renewTitle();
        for (let i = 0; i < problems.length; i++) {
          this.problemResults.push({
            targetProblemId: problems[i].problemId,
            resolution: [],
            type: problems[i].type
          });
        }
        this.isShowCompleteForm = true;
      },

      // 是否为必填项
      checkIsRequire(requirement) {
        return requirement ? "*" : "";
      },

      // 提交表单
      submitComplete() {
        // 预览模式不提交
        if (this.situation === "preview") {
          this.$messageBox.showInfoMessage(this, "当前是预览模式 提交不会被保存");
          return;
        }
        //必填项检验
        if (!this.checkIsComplete()) return;

        //设备检验 有限制 并且已经提交过
        if (this.data.basicInfo.equipmentControl && this.checkIsSubmit()) return;

        //提交填报数据
        submitComplete(this.problemResults, this.$route.params.flag)
          .then(() => {
            this.$messageBox.showSuccessMessage(this, "提交成功,感谢您的参与!");
            this.setIsSubmit();
            //接下来跳向发布者自定义的结束界面
            this.$router.replace('/success');
          })
          .catch(() => {
            this.$messageBox.showInfoMessage(this, "抱歉 提交失败");
          })
      },

      checkIsComplete() {
        for (let i = 0; i < this.data.problems.length; i++) {
          if (this.data.problems[i].isRequire && !this.problemResults[i].resolution.length) {
            this.$messageBox.showInfoMessage(this, "请完成所有必填项!");
            return false;
          }
        }
        return true;
      },

      setIsSubmit() {
        window.localStorage.setItem(this.data.basicInfo.questionnaireId, 'true');
      },

      checkIsSubmit() {
        let i = window.localStorage.getItem(this.data.basicInfo.questionnaireId) !== null;
        if (i) {
          this.$messageBox.showInfoMessage(this, "您已经提交过了,请不要重复提交");
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

  .content {
    height: 90vh;
  }
</style>