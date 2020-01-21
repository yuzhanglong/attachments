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
                <el-link style="font-size: 9px" :type="showConditionStyle(index)" :underline="false">
                  {{showCondition(index)}}
                </el-link>
              </div>
            </template>
            <template v-slot:cardFoot>
              <div id="card-foot">
                <div style="width: 140px;" v-show="false">
                  <el-link style="font-size: 9px;" type="info" :underline="false">
                    {{showParticipants(index)}}份数据
                  </el-link>
                </div>
                <div v-show="false">
                  <el-link style="font-size: 12px" type="info" :underline="false">
                    {{showRenewTime(index)}}
                  </el-link>
                </div>
                <div class="card-icon-wrap">
                  <i class="el-icon-edit" style="font-size: 15px;"> 编辑</i>
                </div>
                <div class="card-icon-wrap">
                  <i class="el-icon-position" style="font-size: 15px"> 发布</i>
                </div>
                <div class="card-icon-wrap">
                  <i class="el-icon-copy-document" style="font-size: 15px"> 数据</i>
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
        myQuestionnaire: []
      }
    },
    methods: {
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
        this.$router.replace('/questionnaire');
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
    font-size: 40px;
  }
  .card-icon-wrap{
    width: 100px;
  }

</style>