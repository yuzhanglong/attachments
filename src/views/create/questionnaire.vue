<template>
  <div id="questionnaire" v-if="dataIsSuccess">
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
                                   @click.native="appendOneProblem('singleSelect')">
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
                                   @click.native="appendOneProblem('multiplySelect')">

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
                                   @click.native="appendOneProblem('blankFill')">
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
                                   @click.native="appendOneProblem('dropDown')">
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
                                   @click="appendOneProblem('score')">
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
              <div v-for="(problem, index) in questionnaireData.problems" :key="index + new Date().getTime()">
                <single-select v-if="problem.common.type === 'singleSelect'"
                               @click.native="getActiveProblem(index)"
                               :problem-index="index"
                               :recover-data="problem.common"
                               :questionnaireFlag="questionnaireData.questionnaireFlag">
                </single-select>
                <multiply-select v-if="problem.common.type === 'multiplySelect'"
                                 @click.native="getActiveProblem(index)"
                                 :problem-index="index" :recover-data="problem.common"
                                 :questionnaireFlag="questionnaireData.questionnaireFlag">
                </multiply-select>
                <blank-fill v-if="problem.common.type === 'blankFill'"
                            @click.native="getActiveProblem(index)"
                            :problem-index="index"
                            :recover-data="problem.common"
                            :questionnaireFlag="questionnaireData.questionnaireFlag">
                </blank-fill>
                <drop-down v-if="problem.common.type === 'dropDown'"
                           @click.native="getActiveProblem(index)"
                           :problem-index="index"
                           :recover-data="problem.common"
                           :questionnaireFlag="questionnaireData.questionnaireFlag">

                </drop-down>
                <score v-if="problem.common.type === 'score'"
                       @click.native="getActiveProblem(index)"
                       :problem-index="index"
                       :recover-data="problem.common">
                </score>
                <nps v-if="problem.common.type === 'nps'"
                     @click.native="getActiveProblem(index)"
                     :problem-index="index"
                     :recover-data="problem.common">
                </nps>
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
                             v-model="questionnaireData.problems[activeProblem].globalSetting.required"
                             @change="editProblemBasicInfo"></el-switch>
                </el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group>
                <template slot="title">危险项</template>
                <el-menu-item>删除
                  <el-button class="delete-button" type="danger" size="mini" @click="deleteOneProblem(activeProblem)">
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
  import leftNavBar from "@/components/leftNavBar/leftNavBar";
  import problemTypeItem from "@/views/create/childComp/problemTypeItem";
  import popOver from "@/views/create/childComp/popOver";
  import scrollBar from "@/components/scrollBar/scrollBar";

  //题目组件
  import basicInfo from "@/views/create/childComp/questionnaireItems/basicInfo";
  import singleSelect from "@/views/create/childComp/questionnaireItems/singleSelect";
  import multiplySelect from "@/views/create/childComp/questionnaireItems/multiplySelect";
  import blankFill from "@/views/create/childComp/questionnaireItems/blankFill";
  import dropDown from "@/views/create/childComp/questionnaireItems/dropDown";
  import score from "@/views/create/childComp/questionnaireItems/score";
  import nps from "@/views/create/childComp/questionnaireItems/nps";

  //数据处理
  import {checkToken} from "@/network/user";
  import {getQuesionNaireByFlag} from "@/network/questionnaire";
  import {
    appendOneProblem,
    deleteOneProblem, editProblemBasicInfo,
    editQuestionnaireBasicInfo,
    newQuestionnaire
  } from "../../network/questionnaireEdition";
  import StepBar from "../../components/stepBar/stepBar";

  export default {
    name: "questionnaire",
    components: {
      StepBar,
      //基本组件
      leftNavBar,
      problemTypeItem,
      popOver,
      scrollBar,

      //题目组件
      basicInfo,
      singleSelect,
      multiplySelect,
      blankFill,
      dropDown,
      score,
      nps
    },
    created() {
      this.judgeSituation(this.$route.params.situation);
      checkToken(this.$store.state.token)
              .catch(() => {
                this.$messageBox.showErrorMessage(this, "404！   !!!∑(ﾟДﾟノ)ノ");
                this.$router.replace('/login');
                this.$store.commit("removeTokenAndUser");
              });
    },
    data() {
      return {
        dataIsSuccess: false,
        activeProblem: "",
        setting: {
          requireSwitchAbility: false
        },
        questionnaireData: {
          //创建好就给flag 防止用户多次保存而出现一大堆问卷
          questionnaireFlag: new Date().getTime(),
          sender: this.$store.state.user,
          basicInfo: {
            title: "请在这里创建一个问卷标题",
            subTitle: "感谢您能抽出几分钟时间来参加本次问卷调查，现在我们就马上开始吧！"
          },
          problems: []
        },
      }
    },
    methods: {
      //跳转到此页面情形
      // 1.新建问卷 2.编辑问卷
      // 可以用动态路由来区分之
      judgeSituation(targetRouter) {
        //新建情况
        if (targetRouter !== "new") {
          document.title = "问卷设计-编辑";
          getQuesionNaireByFlag(this.$store.state.user, this.$store.state.token, targetRouter)
                  .then(res => {
                    this.questionnaireData = res['information']['questionnaireBasicData'];
                    console.log(this.questionnaireData);
                    this.dataIsSuccess = true;
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
          document.title = "问卷设计-新建";
          this.newQuestionnaire();
          this.dataIsSuccess = true;
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
        let globalSet = this.questionnaireData.problems[this.activeProblem].globalSetting;
        editProblemBasicInfo(this.$store.state.token, this.questionnaireData.questionnaireFlag, this.activeProblem, "None", globalSet);
      },
      goToSendQuestionnaire() {
        //路由跳转到发布界面
        this.$router.push('/spread/' + this.$route.params.situation);
      },
      newQuestionnaire() {
        newQuestionnaire(this.$store.state.user, this.$store.state.token, this.questionnaireData.questionnaireFlag, this.questionnaireData)
                .catch(() => {
                  this.$messageBox.showErrorMessage(this, "ERROR!");
                })
      },
      appendOneProblem(problemType) {
        let pushData = {
          //制造唯一id
          problemId: new Date().getTime(),
          globalSetting: {
            required: false
          },
          common: {
            type: problemType,
            title: "",
            options: []
          }
        };
        if (problemType === 'blankFill') {
          delete pushData.common.options
        }
        this.questionnaireData.problems.push(pushData);
        appendOneProblem(this.$store.state.token, this.questionnaireData.questionnaireFlag, pushData.common, pushData.problemId);
      },
      //删除一个problem 需要传入要删除的下标
      deleteOneProblem(index) {
        this.questionnaireData.problems.splice(index, 1);
        this.activeProblem = "";
        deleteOneProblem(this.$store.state.token, this.questionnaireData.questionnaireFlag, index);
      },
      //获取当前鼠标点击下的问题 并传入data.activeProblem
      getBasicInfo(res) {
        this.questionnaireData.basicInfo.title = res.title;
        this.questionnaireData.basicInfo.subTitle = res.subTitle;
        editQuestionnaireBasicInfo(this.$store.state.token, this.questionnaireData.questionnaireFlag, res);
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
    width: 400px;
    height: 87%;
    background-color: #ffffff;
  }


  .setting-switch {
    padding-left: 18px;
  }

  .delete-button {
    margin-left: 70px;
  }
</style>