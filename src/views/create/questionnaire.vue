<template>
  <div id="questionnaire">
    <!--顶部导航栏-->
    <el-row>
      <div id="top-nav-container">
        <nav-bar line-height="line-height: 64px">
          <template v-slot:nav-left>
            <i class="el-icon-arrow-left" @click="goBack"></i>
          </template>
          <template v-slot:nav-center>
            <div id="step-bar">
              <el-link type="primary" :underline="false">编辑项目</el-link>
              <div class="icon-wrap">
                <i class="el-icon-arrow-right"></i>
              </div>
              <el-link type="primary" :underline="false">发布项目</el-link>
              <div class="icon-wrap">
                <i class="el-icon-arrow-right"></i>
              </div>
              <el-link type="primary" :underline="false">统计报表</el-link>
            </div>
          </template>
          <template v-slot:nav-right>
            <div id="nav-right-setting">
              <el-button size="medium" @click="saveQuestionNaire">保存</el-button>
              <el-button type="primary" size="medium" style="margin-right: 30px"
                         @click="goToSendQuestionNaire">发布并分享
              </el-button>
              <el-avatar :src="tempHeadIconLink"></el-avatar>
            </div>
          </template>
        </nav-bar>
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
                                   @click.native="appendOneProblem('score')">
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
                                   @click.native="appendOneProblem('nps')">
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
              <div v-for="(problem, index) in questionnaireData.problems" :key="problem.tag">
                <single-select v-if="problem.common.type === 'singleSelect'"
                               @click.native="getActiveProblem(index)"
                               :problem-index="index" @passData="getProblemData"
                               :recover-data="problem.common">
                </single-select>
                <multiply-select v-if="problem.common.type === 'multiplySelect'"
                                 @click.native="getActiveProblem(index)"
                                 :problem-index="index"
                                 @passData="getProblemData" :recover-data="problem.common">
                </multiply-select>
                <blank-fill v-if="problem.common.type === 'blankFill'"
                            @click.native="getActiveProblem(index)"
                            :problem-index="index"
                            @passData="getProblemDataForBlankFill"
                            :recover-data="problem.common">
                </blank-fill>
                <drop-down v-if="problem.common.type === 'dropDown'"
                           @click.native="getActiveProblem(index)"
                           :problem-index="index"
                           @passData="getProblemData"
                           :recover-data="problem.common">

                </drop-down>
                <score v-if="problem.common.type === 'score'"
                       @click.native="getActiveProblem(index)"
                       :problem-index="index"
                       @passData="getProblemData"
                       :recover-data="problem.common">
                </score>
                <nps v-if="problem.common.type === 'nps'"
                     @click.native="getActiveProblem(index)"
                     :problem-index="index"
                     @passData="getProblemData"
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
            <div>
              <el-tag type="info" effect="dark">Question {{activeProblem + 1}} 题目设置</el-tag>
              <h3>整题设置</h3>
            </div>
            <div id="is-required-wrap">
              <el-link class="is-required-title">是否为必填项</el-link>
              <el-switch
                      active-color="#13ce66" inactive-color="#ff4949"></el-switch>
            </div>
            <div>
              <el-button type="danger" @click="deleteOneProblem(activeProblem)" size="mini">删除这道题目</el-button>
            </div>
          </div>

        </div>
      </el-col>
    </el-row>
  </div>
</template>


<script>
  //基本组件
  import navBar from "@/components/navBar/navBar";
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
  import {sendQuesionNaire} from "@/network/questionnaire";
  import {checkToken} from "@/network/user";
  import {getQuesionNaireByFlag} from "@/network/questionnaire";

  export default {
    name: "questionnaire",
    components: {
      //基本组件
      navBar,
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
        tempHeadIconLink: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
        activeProblem: "",
        setting: {
          requireSwitchAbility: false
        },
        questionnaireData: {
          //创建好就给flag 防止用户多次保存而出现一大堆问卷
          questionnaireFlag: new Date().getTime(),
          //0 未发布    1 发布中    2 已截止
          condition: 0,
          participants: 0,
          sender: this.$store.state.user,
          basicInfo: {
            title: "请在这里创建一个问卷标题",
            subTitle: "感谢您能抽出几分钟时间来参加本次问卷调查，现在我们就马上开始吧！"
          },
          problems: []
        }
      }
    },
    methods: {
      //跳转到此页面情形
      // 1.新建问卷 2.编辑问卷
      // 可以用动态路由来区分之
      judgeSituation(targetRouter) {
        //新建情况
        if (targetRouter !== "new") {
          this.questionnaireData = JSON.parse(window.localStorage.getItem('data'))['questionnaireBasicData'];
          //通过flag拿到需要编辑的问卷数据
          this.$notify({
            title: "系统消息",
            message: '当前您处在编辑模式',
            type: 'success',
            duration: 4000,
          });
        } else {

          this.$notify({
            title: '系统消息',
            message: '当前您处在新建模式',
            type: 'success',
            duration: 4000
          });
        }
      },
      /*问卷发布相关
      *
      * */
      saveQuestionNaire() {
        //发送请求
        if (!this.questionnaireData.problems.length) {
          this.$messageBox.showInfoMessage(this, "请至少添加一道题目~");
          return
        }
        sendQuesionNaire(this.$store.state.user, this.questionnaireData, this.$store.state.token, this.questionnaireData.questionnaireFlag)
                .then(() => {
                  this.$messageBox.showSuccessMessage(this, "保存成功,可以在【我的项目】页面中查看");
                  this.refreshQuestionnaireData();
                })
                .catch(() => {
                  this.$messageBox.showErrorMessage(this, "请求失败error");
                })
      },
      goToSendQuestionNaire() {
        //1.先保存
        sendQuesionNaire(this.$store.state.user, this.questionnaireData, this.$store.token)
                .then(() => {
                  this.$messageBox.showSuccessMessage(this, "项目已保存");
                })
                .catch(() => {
                  this.$messageBox.showErrorMessage(this, "请求失败error");
                });
        //1.路由跳转到发布界面
        this.$router.push('/spread');
      },
      refreshQuestionnaireData() {
        getQuesionNaireByFlag(this.$store.state.user, this.$store.state.token, this.questionnaireData.questionnaireFlag)
                .then(res => {
                  let q = JSON.stringify(res['information']);
                  window.localStorage.setItem('data', q);
                })
      },

      /*实时更新problem数据相关
      *
      * */
      getProblemData(res) {
        //针对  单选题 多选题 下拉题
        this.questionnaireData.problems[res.index].common.title = res.title;
        this.questionnaireData.problems[res.index].common.options = res.options;
      },
      //针对填空题(没有动态option)
      getProblemDataForBlankFill(res) {
        this.questionnaireData.problems[res.index].common.title = res.title;
        this.questionnaireData.problems[res.index].common.value = res.value;
      },
      appendOneProblem(problemType) {
        this.questionnaireData.problems.push({
          //制造唯一id
          tag: new Date().getTime(),
          globalSetting: {
            required: false
          },
          common: {
            type: problemType,
            title: "",
            options: []
          }
        })
      },
      //删除一个problem 需要传入要删除的下标
      deleteOneProblem(index) {
        this.questionnaireData.problems.splice(index, 1);
      },
      //获取当前鼠标点击下的问题 并传入data.activeProblem
      getBasicInfo(res) {
        this.questionnaireData.basicInfo.title = res.title;
        this.questionnaireData.basicInfo.subTitle = res.subTitle;
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
    padding-top: 20px;
    padding-left: 18px;
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
    height: calc(100vh - 76px);
  }

  #top-nav-container {
    position: fixed;
    right: 0;
    left: 0;
    top: 0;
    z-index: 10;
  }

  #step-bar {
    display: flex;
    justify-content: center;
    background-color: #fff;
  }

  .icon-wrap {
    padding-left: 20px;
    padding-right: 20px;
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
    height: 100%;
    background-color: #ffffff;
  }

  .el-icon-arrow-left {
    margin-left: 20px;
  }
</style>