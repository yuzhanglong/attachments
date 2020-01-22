<template>
  <div id="manage">
    <el-header></el-header>
    <el-main id="manage-main">
      <div id="boxcontainer">
        <div class="myProjectItemBox">
          <!-- 根据传来的数据（应该是一个包含对象的数组）v-for即可-->
          <data-card card-name="新的项目..."
                     :card-style="getCardStyle(250)" :key="0"
                     class="myProjectItem">
            <template v-slot:cardBody>
              <div id="icon-wrap">
                <i class="el-icon-plus" @click="gotoCreatequestionnaire"></i>
              </div>
            </template>
          </data-card>
          <data-card v-for="(questionnaire, index) in myQuestionnaire"
                     :key="questionnaire.questionnaireFlag"
                     :card-name="questionnaire['questionnaireBasicData'].basicInfo.title"
                     :card-style="getCardStyle(250)"
                     class="myProjectItem">
            <template v-slot:cardHead>
              <el-tag size="mini" class="cardTags">问卷</el-tag>
            </template>
            <template v-slot:cardBody>
              <div id="card-body">
                <el-link style="font-size: 9px; margin-left: 10px" :type="showConditionStyle(index)" :underline="false">
                  {{showCondition(index)}}
                </el-link>
              </div>
            </template>
            <template v-slot:cardFoot>
              <div id="card-foot">
                <div class="card-icon-wrap">
                  <el-button icon="el-icon-edit" type="mini" class="card-bottom-button"
                             @click="gotoEdit(questionnaire, questionnaire.questionnaireFlag)">编辑
                  </el-button>
                </div>
                <div class="card-icon-wrap">
                  <el-button icon="el-icon-position" type="mini" class="card-bottom-button">发布</el-button>
                </div>
                <div class="card-icon-wrap">
                  <el-button icon="el-icon-position" type="mini" class="card-bottom-button">数据</el-button>
                </div>
              </div>
            </template>
          </data-card>
        </div>
      </div>
    </el-main>


  </div>
</template>

<script>
  //公共组件
  import dataCard from "@/components/dataCard/dataCard";


  //数据处理
  import {getQuesionNaire} from "@/network/questionnaire";

  export default {
    name: "manage",
    components: {
      dataCard,
    },
    created() {
      getQuesionNaire(this.$store.state.user, this.$store.state.token)
              .then(res => {
                this.myQuestionnaire = res['information']
              })
              .catch(() => {
                this.$messageBox.showErrorMessage(this, "404！   !!!∑(ﾟДﾟノ)ノ");
                this.$router.replace('/login');
                this.$store.commit("removeTokenAndUser");
              })
    },
    data() {
      return {
        myQuestionnaire: [],
        cardActive: []
      }
    },
    methods: {
      gotoEdit(questionnaire, target) {
        let q = JSON.stringify(questionnaire);
        window.localStorage.setItem('data', q);
        this.$router.push('/questionnaire/' + target);
      },
      showCondition(index) {
        let conditiondata = ["未发布", "发布中", "已截止"];
        let code = this.myQuestionnaire[index]['questionnaireBasicData'].condition;
        return conditiondata[code];
      },
      showConditionStyle(index) {
        let conditionStyledata = ["warning", "success", "danger"];
        let code = this.myQuestionnaire[index]['questionnaireBasicData'].condition;
        return conditionStyledata[code];
      },
      showParticipants(index) {
        return this.myQuestionnaire[index]['questionnaireBasicData'].participants;
      },
      showRenewTime(index) {
        return this.myQuestionnaire[index]['questionnaireRenewTime'].$date;
      },
      getCardStyle(width) {
        return {
          "width": width + "px"
        }
      },
      gotoCreatequestionnaire() {
        this.$router.push('/questionnaire/new');
      }
    },
  }
</script>

<style scoped>
  #card-body {
    height: 50px;
  }

  #card-foot {
    display: flex;
  }

  #boxcontainer {
    display: flex;
    justify-content: center;
  }

  .myProjectItemBox {
    display: flex;
    flex-wrap: wrap;
    width: 1200px;
    /*background-color: red;*/
  }

  .myProjectItem {
    padding: 20px;
  }

  .cardTags {
    padding-left: 12px;
    padding-right: 12px;
  }

  #manage-main {
    background-color: #f7f8fa;
  }

  #icon-wrap {
    padding-left: 85px;
    padding-top: 10px;
    padding-bottom: 25px;
    font-size: 40px;
  }

  .card-icon-wrap {
    width: 90px;
  }

  .card-bottom-button {
    padding-left: 10px;
    padding-right: 10px;
    border: 0;
  }

</style>