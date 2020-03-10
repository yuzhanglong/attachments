<template>
  <div id="spread">
    <el-row>
      <div id="top-nav-container">
        <step-bar active-tag="2">
          <template v-slot:step-right>
            <el-button size="medium" type="primary" style="background-color:transparent; color: #2672ff"
                       @click="editBasicData">保存以下设置
            </el-button>
            <div style="margin-right: 30px"></div>
          </template>
        </step-bar>
      </div>
    </el-row>
    <el-row>
      <el-col :span="20">
        <div id="scrollwrap">
          <scroll-bar>
            <div id="spread-setting-container">
              <project-share :share-flag="$route.params.flag"
                             :questionnaireTitle="conditions.title"
                             v-if="showInfo">
              </project-share>
            </div>
          </scroll-bar>
        </div>

      </el-col>

      <el-col :span="4">
        <div id="right-setting">
          <!--右侧动态添加设置项-->
          <div id="right-setting-contain">
            <el-menu>
              <el-submenu index="1">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>问卷全局设置</span>
                </template>
              </el-submenu>
              <el-menu-item-group>
                <template slot="title">当前状态: 发布中</template>
                <el-menu-item>发布/暂停发布这个问卷
                  <el-switch class="setting-switch" v-model="conditions.condition"></el-switch>
                </el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group>
                <template slot="title">答题次数</template>
                <el-menu-item>限制每台设备答题次数<i class="el-icon-question"></i>
                  <el-switch class="setting-switch" v-model="conditions.equipmentControl"></el-switch>
                </el-menu-item>
                <el-menu-item>限制每个ip答题次数<i class="el-icon-question"></i>
                  <el-switch class="setting-switch" v-model="conditions.ipControl"></el-switch>
                </el-menu-item>
                <el-menu-item>限制每个微信答题次数<i class="el-icon-question"></i>
                  <el-switch class="setting-switch" v-model="conditions.wechatControl" disabled></el-switch>
                </el-menu-item>
              </el-menu-item-group>

              <el-menu-item-group>
                <template slot="title">答题限制</template>
                <el-menu-item>设置访问密码
                  <el-switch class="setting-switch" v-model="conditions.isSecret"></el-switch>
                </el-menu-item>
                <el-menu-item v-show="conditions.isSecret">
                  <el-input placeholder="请在此设置您的访问密码" v-model="conditions.secretKey"></el-input>
                </el-menu-item>
                <el-menu-item>设置结束时间
                  <el-switch class="setting-switch" v-model="conditions.deadlineControl"></el-switch>
                </el-menu-item>
                <el-menu-item v-show="conditions.deadlineControl">
                  <el-date-picker placeholder="选择时间" v-model="conditions.deadline"
                                  style="width: 100%;"></el-date-picker>
                </el-menu-item>
                <el-menu-item v-show="conditions.deadlineControl">
                  <el-time-picker placeholder="选择时间" v-model="conditions.deadline"
                                  style="width: 100%;"></el-time-picker>
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
  import scrollBar from "../../components/scrollBar/scrollBar";
  import projectShare from "./childComp/projectShare";
  import StepBar from "../../components/stepBar/stepBar";
  import {QuestionnaireCondition} from "../../models/questionnaire_model";
  import {editQuesitonnaire, getQuesionnaireCondition} from "../../network/questionnaire";

  export default {
    name: "spread",
    components: {
      StepBar,
      scrollBar,
      projectShare
    },
    created() {
      this.getQuestionnaireCondition()
    },
    data() {
      return {
        cardstyle: {
          "padding-top": "40px"
        },
        conditions: {
          condition: null,
          deadline: null,
          deadlineControl: false,
          equipmentControl: false,
          ipControl: false,
          isSecret: false,
          questionnireId: null,
          renewTime: null,
          secretKey: null,
          subTitle: null,
          title: null,
          wechatControl: false
        },
        showInfo: false,
      }
    },

    methods: {
      getQuestionnaireCondition() {
        getQuesionnaireCondition(this.$route.params.flag)
          .then(res => {
            this.$notify({
              title: "系统消息",
              message: '当前您处在发布模式',
              type: 'success',
              duration: 4000,
              offset: 50
            })
            this.conditions = new QuestionnaireCondition(res);
            this.showInfo = true;
          })
          .catch(res => {
            console.log(res);
          })
      },
      goBack() {
        this.$router.replace('/manage');
      },
      editBasicData() {
        editQuesitonnaire(this.conditions)
          .then(() => {
            this.$messageBox.showSuccessMessage(this, "已保存修改~");
          })
          .catch(() => {
            this.$messageBox.showSuccessMessage(this, "抱歉 编辑失败");
          })
      }
    }


  }
</script>

<style scoped>
  #scrollwrap {
    margin-left: 100px;
    width: 88%;
    margin-top: 55px;
    height: calc(100vh - 58px);
  }

  #spread-setting-container {
    display: flex;
    flex-direction: column;
    width: 500px;
    margin-left: 80px;
    height: calc(100vh - 70px);
    z-index: 1;
  }

  #right-setting {
    position: fixed;
    top: 90px;
    right: 20px;
    width: 350px;
    height: 86%;
    background-color: #ffffff;
  }

  #spread {
    overflow: hidden;
    background-color: #f3f5f6;
  }


  #top-nav-container {
    position: fixed;
    right: 0;
    left: 0;
    top: 0;
    z-index: 10;
  }


  .setting-switch {
    padding-left: 18px;
  }
</style>