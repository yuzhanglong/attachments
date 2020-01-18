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

            <problem-type-item itemicon="el-icon-menu" problem-type="单选题"></problem-type-item>

            <pop-over pop-width="300">
              <template v-slot:contentdata>
                <img src="../../../src/assets/img/problemType/multiple_select.png" alt="Smiley face" width="300"
                     height="110">
              </template>
              <template v-slot:ref>
                <problem-type-item itemicon="el-icon-menu" problem-type="多选题"></problem-type-item>
              </template>
            </pop-over>
            <pop-over pop-width="300">
              <template v-slot:contentdata>
                <img src="../../../src/assets/img/problemType/blank.png" alt="Smiley face" width="300" height="100">
              </template>
              <template v-slot:ref>
                <problem-type-item itemicon="el-icon-menu" problem-type="填空题"></problem-type-item>
              </template>
            </pop-over>
            <pop-over pop-width="300">
              <template v-slot:contentdata>
                <img src="../../../src/assets/img/problemType/dropdown.png" alt="Smiley face" width="300" height="200">
              </template>
              <template v-slot:ref>
                <problem-type-item itemicon="el-icon-menu" problem-type="下拉题"></problem-type-item>
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
            </div>
          </scroll-bar>
        </div>
      </el-col>
      <!--右侧设置-->
      <el-col :span="2">
        <div id="right-setting">
        <!--右侧动态添加设置项-->
        </div>
      </el-col>
    </el-row>


  </div>
</template>

<script>
  import navBar from "@/components/navBar/navBar";
  import leftNavBar from "@/components/leftNavBar/leftNavBar";
  import problemTypeItem from "@/views/create/childComp/problemTypeItem";
  import popOver from "@/views/create/childComp/popOver";
  import scrollBar from "@/components/scrollBar/scrollBar";

  export default {
    name: "questionnaire",
    components: {
      navBar,
      leftNavBar,
      problemTypeItem,
      popOver,
      scrollBar
    },
    methods: {
      goBack() {
        this.$router.replace('/manage');
      },
    },
    data() {
      //问卷表--基本表 传出最基本的信息 *包括所有的题目 不包含发布信息*
      return {
        questionnaireSendingData: {
          sender: "",
          title: "",
          subTitle: "",
          problems: []
        }
      }
    }

  }
</script>

<style scoped>

  #questionnaire {
    overflow: hidden;
  }

  #scrollwrap {
    margin-left: 100px;
    width: 88%;
    margin-top: 64px;
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
    top: 70px;
    left: 0;
    right: 0;
    width: 160px;
  }


  #left-nav {
    width: 150px;
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
    top: 69px;
    right: 20px;
    width: 400px;
    height: 100%;
    /*background-color: rgba(11, 49, 34, 0.53);*/
  }
</style>