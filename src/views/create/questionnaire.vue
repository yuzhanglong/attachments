<template>
  <div id="questionnaire">
    <!--顶部导航栏-->
    <el-row>
      <div id="top-nav-container">
        <nav-bar>
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
                <problem-type-item itemicon="el-icon-menu" problem-type="评价题"></problem-type-item>
              </template>
            </pop-over>
            <pop-over pop-width="300">
              <template v-slot:contentdata>
                <img src="../../../src/assets/img/problemType/nps.png" alt="Smiley face" width="300" height="110">
              </template>
              <template v-slot:ref>
                <problem-type-item itemicon="el-icon-menu" problem-type="NPS题"></problem-type-item>
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
              <basic-info @passData="refleshBasicData"></basic-info>
              <div v-for="(problem, index) in questionnaireSendingData.problems" :key="index">
                <single-select v-if="problem.type === 'singleSelect'"></single-select>
                <multiply-select v-if="problem.type === 'multiplySelect'"></multiply-select>
                <blank-fill v-if="problem.type === 'blankFill'"></blank-fill>
                <drop-down v-if="problem.type === 'dropDown'"></drop-down>
              </div>
            </div>
          </scroll-bar>
        </div>
      </el-col>
      <!--右侧设置-->
      <el-col :span="2">
        <div id="right-setting">
          <!--右侧动态添加设置项-->
          <div id="right-setting-contain">
            <el-tag>Question{{}}设置</el-tag>
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
      dropDown
    },
    created() {
      this.questionnaireSendingData.sender = this.$store.state.user
    },
    methods: {
      goBack() {
        this.$router.replace('/manage');
      },
      refleshBasicData(res) {
        this.questionnaireSendingData.title = res.title;
        this.questionnaireSendingData.subTitle = res.subTitle;
      },
      appendOneProblem(problemName) {
        this.questionnaireSendingData.problems.push({
          type: problemName,
          index: "",
          title: "请输入问题标题",
          options: []
        })
      }
    },
    data() {
      return {
        //问卷表--基本表 传出最基本的信息 *包括所有的题目 不包含发布信息*
        questionnaireSendingData: {
          sender: "",
          title: "",
          subTitle: "",
          problems: []
        }
      }
    },
  }
</script>

<style scoped>
  #right-setting-contain {
    padding-top: 20px;
    padding-left: 18px;
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
</style>