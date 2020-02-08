<template>
  <div id="spread">
    <el-row>
      <div id="top-nav-container">
        <step-bar active-tag="2">
          <template v-slot:step-right>
            <el-button size="medium" type="primary" style="background-color:transparent; color: #2672ff"
                       @click="submitQuestionnaireSpreadData">保存以下设置
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
                             :questionnaireTitle="data['questionnaireBasicData']['basicInfo']['title']"
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
                  <el-switch class="setting-switch" v-model="data['questionnaireCondition']"></el-switch>
                </el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group>
                <template slot="title">答题次数</template>
                <el-menu-item>限制每台设备答题次数<i class="el-icon-question"></i>
                  <el-switch class="setting-switch" v-model="data['questionnaireEquipmentControl']"></el-switch>
                </el-menu-item>
                <el-menu-item>限制每个ip答题次数<i class="el-icon-question"></i>
                  <el-switch class="setting-switch" v-model="data['questionnaireIPControl']"></el-switch>
                </el-menu-item>
                <el-menu-item>限制每个微信答题次数<i class="el-icon-question"></i>
                  <el-switch class="setting-switch" v-model="data['questionnaireWechatControl']" disabled></el-switch>
                </el-menu-item>
              </el-menu-item-group>

              <el-menu-item-group>
                <template slot="title">答题限制</template>
                <el-menu-item>设置访问密码
                  <el-switch class="setting-switch" v-model="data['questionnaireIsSecret']"></el-switch>
                </el-menu-item>
                <el-menu-item v-show="data['questionnaireIsSecret']">
                  <el-input placeholder="请在此设置您的访问密码" v-model="data['questionnaireSecretKey']"></el-input>
                </el-menu-item>
                <el-menu-item>设置结束时间
                  <el-switch class="setting-switch" v-model="data['questionnaireDeadlineControl']"></el-switch>
                </el-menu-item>
                <el-menu-item v-show="data['questionnaireDeadlineControl']">
                  <el-date-picker placeholder="选择时间" v-model="data['questionnaireDeadline']"
                                  style="width: 100%;"></el-date-picker>
                </el-menu-item>
                <el-menu-item v-show="data['questionnaireDeadlineControl']">
                  <el-time-picker placeholder="选择时间" v-model="data['questionnaireDeadline']"
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
  import scrollBar from "@/components/scrollBar/scrollBar";
  import projectShare from "@/views/spread/childComp/projectShare";
  import {getQuesionNaireByFlag} from "@/network/questionnaire";
  import {submitQuestionnaireSpreadData} from "@/network/questionnaire";
  import StepBar from "../../components/stepBar/stepBar";

  export default {
    name: "spread",
    components: {
      StepBar,
      scrollBar,
      projectShare
    },
    created() {
      this.getQuesionNaireByFlag()
    },
    data() {
      return {
        cardstyle: {
          "padding-top": "40px"
        },
        data: {},
        showInfo: false,
      }
    },
    methods: {
      deleteDict(dict) {
        delete dict['information']['questionnaireFlag'];
        delete dict['information']['questionnaireRenewTime'];
        delete dict['information']['questionnaireUserId'];
        delete dict['information']._id;
      },
      submitQuestionnaireSpreadData() {
        submitQuestionnaireSpreadData(this.$store.state.user, this.$store.state.token, this.$route.params.flag, this.data)
                .then(() => {
                  this.$messageBox.showSuccessMessage(this, "数据更新成功了")
                })
      },
      getQuesionNaireByFlag() {
        getQuesionNaireByFlag(this.$store.state.user, this.$store.state.token, this.$route.params.flag)
                .then(res => {
                  this.$notify({
                    title: "系统消息",
                    message: '当前您处在发布模式',
                    type: 'success',
                    duration: 4000,
                    offset: 50
                  });
                  this.deleteDict(res);
                  this.showInfo = true;
                  this.data = res['information'];

                })
      },
      goBack() {
        this.$router.replace('/manage');
      },
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