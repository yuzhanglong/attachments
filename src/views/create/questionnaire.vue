<template>
  <div id="questionnaire">
    <!--顶部导航栏-->
    <el-row>
      <div id="top-nav-container">
        <step-bar active-tag="1">
          <template v-slot:step-right>
            <el-button type="primary" size="medium" style="margin-right: 30px"
                       @click="goToSendQuestionnaire">发布并分享
            </el-button>
          </template>
        </step-bar>
      </div>
    </el-row>
    <el-row>
      <el-col :span="2">
        <!--侧边栏-->
        <div id="left-nav-container">
          <left-nav-bar id="left-nav">
            <pop-over pop-width="300">
              <template v-slot:contentdata>
                <img src="../../../src/assets/img/problemType/single_select.png" alt="Smiley face" width="300"
                     height="110">
              </template>
              <template v-slot:ref>
                <problem-type-item itemicon="el-icon-menu"
                                   problem-type="单选题"
                                   @click.native="appendOneProblem('SINGLE_SELECT')">
                </problem-type-item>
              </template>
            </pop-over>
            <pop-over pop-width="300">
              <template v-slot:contentdata>
                <img src="../../../src/assets/img/problemType/multiple_select.png" alt="Smiley face" width="300"
                     height="110">
              </template>
              <template v-slot:ref>
                <problem-type-item itemicon="el-icon-menu" problem-type="多选题"
                                   @click.native="appendOneProblem('MULTIPLY_SELECT')">

                </problem-type-item>
              </template>
            </pop-over>
            <pop-over pop-width="300">
              <template v-slot:contentdata>
                <img src="../../../src/assets/img/problemType/blank.png" alt="Smiley face" width="300" height="100">
              </template>
              <template v-slot:ref>
                <problem-type-item itemicon="el-icon-menu"
                                   problem-type="填空题"
                                   @click.native="appendOneProblem('BLANK_FILL')">
                </problem-type-item>
              </template>
            </pop-over>
            <pop-over pop-width="300">
              <template v-slot:contentdata>
                <img src="../../../src/assets/img/problemType/dropdown.png" alt="Smiley face" width="300" height="200">
              </template>
              <template v-slot:ref>
                <problem-type-item itemicon="el-icon-menu"
                                   problem-type="下拉题"
                                   @click.native="appendOneProblem('DROP_DOWN')">
                </problem-type-item>
              </template>
            </pop-over>
            <pop-over pop-width="300">
              <template v-slot:contentdata>
                <img src="../../../src/assets/img/problemType/score.png" alt="Smiley face" width="300" height="100">
              </template>
              <template v-slot:ref>
                <problem-type-item itemicon="el-icon-menu"
                                   problem-type="评价题"
                                   @click.native="appendOneProblem('SCORE')">
                </problem-type-item>
              </template>
            </pop-over>
            <pop-over pop-width="300">
              <template v-slot:contentdata>
                <img src="../../../src/assets/img/problemType/nps.png" alt="Smiley face" width="300" height="110">
              </template>
              <template v-slot:ref>
                <problem-type-item itemicon="el-icon-menu"
                                   problem-type="NPS题"
                                   @click="appendOneProblem('nps')">
                </problem-type-item>
              </template>
            </pop-over>
            <problem-type-item itemicon="el-icon-menu" problem-type="文件上传"></problem-type-item>
            <problem-type-item itemicon="el-icon-menu" problem-type="信息表"></problem-type-item>
          </left-nav-bar>
        </div>


        <!--中间题目-->
      </el-col>
      <el-col :span="20">
        <div id="scrollwrap">
          <scroll-bar>
            <div id="problems-container">
              <!--此处动态添加问题-->
              <basic-info @passData="getBasicInfo"
                          :recover-data="questionnaireData.basicInfo">
              </basic-info>


              <!--这里的index是动态的-->
              <div v-for="(problem, problemIndex) in questionnaireData.problems"
                   :key="problemIndex + new Date().getTime()">
                <problem-card :problem-type="problem.type"
                              :question-number="problemIndex" @click.native="getActiveProblem(problemIndex)">
                  <!--插入问题标题输入框-->
                  <template v-slot:problem-name>
                    <label>
                      <input class="title-input"
                             v-model="problem.title"
                             @focus="titleInputFocus(problem)"
                             @blur="titleInputBlur(problem)">
                    </label>
                  </template>

                  <template v-slot:problem-body>
                    <!--有选项的问题类型 例如 单选 多选题 下拉题-->
                    <div class="choices" v-if="checkType(problem.type)">
                      <div class="selection" v-for="(data, optionIndex) in problem.options" :key="data.key">

                        <!--选项前缀-->
                        <el-radio value="false" v-if="problem.type === 'SINGLE_SELECT'">
                          选项{{getOptionNumber(optionIndex)}}
                        </el-radio>
                        <el-checkbox value="false" v-if="problem.type === 'MULTIPLY_SELECT'">
                          选项{{getOptionNumber(optionIndex)}}
                        </el-checkbox>
                        <i class="el-icon-caret-bottom" v-if="problem.type === 'DROP_DOWN'">
                          选项{{getOptionNumber(optionIndex)}}
                        </i>
                        <!--选项输入框-->
                        <label>
                          <input class="choice-input" v-model="data.title" @blur="editOneProblem(problem)">
                        </label>

                        <!--选项删除按钮框-->
                        <el-button type="danger" icon="el-icon-delete"
                                   circle size="small" class="delete-button"
                                   @click="deleteOneOption(problem, problemIndex, optionIndex)">
                        </el-button>
                      </div>
                    </div>

                    <div class="score-wrap" v-if="problem.type === 'SCORE'">
                      <div class="star-show-items">
                        <i class="el-icon-star-off"></i>
                        <i class="el-icon-star-off"></i>
                        <i class="el-icon-star-off"></i>
                        <i class="el-icon-star-off"></i>
                        <i class="el-icon-star-off"></i>
                      </div>
                    </div>

                    <el-input
                            type="textarea"
                            v-if="problem.type === 'BLANK_FILL'"
                            autosize
                            placeholder="本题应在此处进行作答"
                            class="blank-fill-input">
                    </el-input>


                  </template>

                  <!--添加选项按钮-->
                  <template v-slot:problem-bottom v-if="checkType(problem.type)">
                    <el-link type="primary" icon="el-icon-plus"
                             class="plus-tag"
                             @click="appendOneOption(problem, problemIndex)"
                    >添加选项
                    </el-link>
                  </template>
                </problem-card>
              </div>
            </div>
          </scroll-bar>
        </div>
      </el-col>


      <!--右侧设置-->
      <el-col :span="2">
        <div id="right-setting">
          <!--右侧动态添加设置项-->
          <div id="right-setting-contain" v-if="activeProblem !== ''">
            <el-menu>
              <el-submenu index="1">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>Question {{activeProblem + 1}}题目设置</span>
                </template>
              </el-submenu>
              <el-menu-item-group>
                <template slot="title">基本设置</template>
                <el-menu-item>设置为必填项
                  <el-switch class="setting-switch"
                             v-model="questionnaireData.problems[activeProblem].isRequire"
                             @change="setProblemRequired()"></el-switch>
                </el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group>
                <template slot="title">危险项</template>
                <el-menu-item>删除
                  <el-button class="delete-button" type="danger" size="mini" @click="deleteOneProblem()">
                    删除这道题目
                  </el-button>
                </el-menu-item>
              </el-menu-item-group>
            </el-menu>
          </div>

        </div>
      </el-col>
    </el-row>
  </div>
</template>


<script>
  //基本组件
  import leftNavBar from "../../components/leftNavBar/leftNavBar";
  import problemTypeItem from "./childComp/problemTypeItem";
  import popOver from "./childComp/popOver";
  import scrollBar from "../../components/scrollBar/scrollBar";
  // import {Questionnaire} from "../../models/questionnaire_model";

  //题目组件
  import basicInfo from "./childComp/basicInfo";

  //数据处理
  import {
    appendOneProblem,
    createQuestionnaire, deleteOneProblem,
    editOneProblem,
    editQuestionnaireBasicInfo
  } from "../../network/questionnaireEdition";
  import StepBar from "../../components/stepBar/stepBar";
  import ProblemCard from "./childComp/problemCard";
  import {getQuesionnaire} from "../../network/questionnaire";

  export default {
    name: "questionnaire",
    components: {
      ProblemCard,
      StepBar,
      //基本组件
      leftNavBar,
      problemTypeItem,
      popOver,
      scrollBar,

      //题目组件
      basicInfo,
    },
    created() {
      this.judgeSituation(this.$route.params.situation);
    },
    data() {
      return {
        // 用户访问的类型 0表示新建 1 表示编辑
        choicesProblemType: ["SINGLE_SELECT", "MULTIPLY_SELECT", "DROP_DOWN"],
        type: 0,
        activeProblem: "",
        setting: {
          requireSwitchAbility: false
        },
        questionnaireData: {
          basicInfo: {
            title: "请在这里创建一个问卷标题",
            subTitle: "感谢您能抽出几分钟时间来参加本次问卷调查，现在我们就马上开始吧！",
            questionnireId: null
          },
          problems: []
        },
      }
    },
    methods: {
      setProblemRequired() {
        let data = this.questionnaireData.problems[this.activeProblem];
        this.editOneProblem(data);
      },
      titleInputFocus(problemInfo) {
        console.log(problemInfo);
      },
      titleInputBlur(problemInfo) {
        this.editOneProblem(problemInfo)
      },

      // 编辑一个问题
      editOneProblem(problemInfo) {
        editOneProblem(problemInfo).catch(() => {
          console.log("error");
        });
      },

      deleteOneOption(problemInfo, problemIndex, optionIndex) {
        this.questionnaireData.problems[problemIndex].options.splice(optionIndex, 1);
        this.editOneProblem(problemInfo);
      },
      getOptionNumber(index) {
        return index <= 8 ? "0" + String(index + 1) : index + 1;
      },
      checkType(type) {
        return this.choicesProblemType.indexOf(type) !== -1;
      },
      appendOneOption(problemInfo, problemIndex) {
        this.questionnaireData.problems[problemIndex].options.push({
          optionId: new Date().getTime(),
          title: ""
        });
        this.editOneProblem(problemInfo);
      },
      // 页面初始化
      judgeSituation(targetRouter) {
        //新建情况
        if (targetRouter !== "new") {
          document.title = "问卷设计-编辑";
          console.log(targetRouter);
          getQuesionnaire(targetRouter).then((res) => {
            this.questionnaireData = res;
          });

          //通过flag拿到需要编辑的问卷数据
          this.$notify({
            title: "系统消息",
            message: '当前您处在编辑模式',
            type: 'success',
            duration: 4000,
            offset: 50
          });
        } else {
          this.type = 0;
          document.title = "问卷设计-新建";
          this.createQuestionnaire();
          this.$notify({
            title: '系统消息',
            message: '当前您处在新建模式',
            type: 'success',
            duration: 4000,
            offset: 50
          });
        }
      },


      /*问卷发布相关
      *
      * */
      editProblemBasicInfo() {
        editQuestionnaireBasicInfo(this.questionnaireData.basicInfo).catch(() => {
          this.$messageBox.showErrorMessage(this, "抱歉 编辑失败 请检查网络状况");
        })
      },

      //路由跳转到发布界面
      goToSendQuestionnaire() {
        this.$router.push('/spread/' + this.$route.params.situation);
      },

      createQuestionnaire() {
        createQuestionnaire()
          .then((res) => {
            this.questionnaireData.basicInfo.questionnireId = res['questionnaireId'];
          })
          .catch(() => {
            this.$messageBox.showErrorMessage(this, "抱歉 问卷获取失败");
          })
      },


      // 添加一个问题
      async appendOneProblem(problemType) {
        let problemTypeChineseNameMap = {
          "SINGLE_SELECT": "单选题",
          "MULTIPLY_SELECT": "多选题",
          "BLANK_FILL": "填空题",
          "DROP_DOWN": "下拉题",
          "SCORE": "评价题"
        };

        let dataToPush = {
          //制造唯一id
          type: problemType,
          title: `点我为这道${problemTypeChineseNameMap[problemType]}创建一个标题`,
          options: [],
          targetQuestionnireId: this.questionnaireData.basicInfo.questionnireId,
          isRequire: false,
          problemId: null
        };

        let qid;
        try {
          qid = await appendOneProblem(dataToPush);
        } catch (e) {
          this.$messageBox.showErrorMessage(this, "抱歉 添加题目失败");
          return
        }
        dataToPush.problemId = qid['problemId'];
        this.questionnaireData.problems.push(dataToPush);
      },


      //删除一个problem 需要传入要删除的下标
      async deleteOneProblem() {
        let problemId = this.questionnaireData.problems[this.activeProblem].problemId;
        try {
          await deleteOneProblem(problemId);
        } catch (e) {
          this.$messageBox.showErrorMessage(this, "抱歉 删除题目失败");
          return
        }
        this.questionnaireData.problems.splice(this.activeProblem, 1);
        this.activeProblem = "";
      },

      getBasicInfo(res) {
        this.questionnaireData.basicInfo.title = res.title;
        this.questionnaireData.basicInfo.subTitle = res.subTitle;
        this.editProblemBasicInfo();
      },

      getActiveProblem(index) {
        this.activeProblem = index;
      },

      goBack() {
        this.$router.replace('/manage');
      },
    },
  }
</script>

<style scoped>
  #nav-right-setting {
    padding-top: 12px;
    display: flex;
    justify-content: center;
  }

  .is-required-title {
    font-size: 16px;
    font-weight: bolder;
    padding-right: 10px;
    padding-bottom: 40px;
  }

  #is-required-wrap {
    display: flex;
  }

  #right-setting-contain {
    display: flex;
    padding-top: 10px;
    flex-direction: column;
  }

  #questionnaire {
    overflow: hidden;
    background-color: #f3f5f6;
  }

  #scrollwrap {
    margin-left: 100px;
    width: 88%;
    margin-top: 55px;
    height: calc(100vh - 58px);
  }

  #top-nav-container {
    position: fixed;
    right: 0;
    left: 0;
    top: 0;
    z-index: 10;
  }


  #left-nav-container {
    position: fixed;
    top: 85px;
    left: 0;
    right: 0;
  }


  #left-nav {
    width: 160px;
  }

  #problems-container {
    display: flex;
    flex-direction: column;
    width: 500px;
    margin-left: 80px;
    height: calc(100vh - 70px);
    z-index: 1;
  }

  #right-setting {
    position: fixed;
    top: 85px;
    right: 20px;
    width: 350px;
    height: 87%;
    background-color: #ffffff;
  }

  .choices {
    display: flex;
    padding-top: 10px;
    padding-left: 60px;
    flex-direction: column;
  }


  .setting-switch {
    padding-left: 18px;
  }

  .delete-button {
    margin-left: 70px;
  }

  .title-input {
    font-size: 18px;
    border: none;
    width: calc(100vw - 790px);
    margin-top: 20px;
    padding-left: 15px;
    margin-left: 40px;
    margin-bottom: 8px;
    background-color: #ffffff;
    height: 40px;
  }

  .plus-tag {
    margin-top: 20px;
    margin-left: 60px;
  }

  .selection {
    padding-bottom: 10px;
  }

  .blank-fill-input {
    width: calc(100vw - 820px);
    padding-left: 15px;
    margin-left: 40px;
    margin-top: 10px;
  }

  .star-show-items {
    display: flex;
    width: 200px;
  }

  .score-wrap {
    display: flex;
    padding-top: 10px;
    padding-left: 60px;
    flex-direction: column;
  }

  .el-icon-star-off {
    flex-grow: 0.5;
    font-size: 25px;
    margin-top: 15px;
  }
</style>