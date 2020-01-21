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
          <data-card v-for="i in 10"
                     card-name="name"
                     :card-style="getCardStyle(250)" :key="i"
                     class="myProjectItem">
            <template v-slot:cardHead>
              <el-tag size="mini" class="cardTags">问卷</el-tag>
            </template>
          </data-card>
        </div>
      </div>
    </el-main>


  </div>
</template>

<script>
  import dataCard from "@/components/dataCard/dataCard";
  import {checkToken} from "@/network/user";

  export default {
    name: "manage",
    components: {
      dataCard,
    },
    methods: {
      getCardStyle(width) {
        return {
          "width": width + "px"
        }
      },
      gotoCreatequestionnaire() {
        this.$router.replace('/questionnaire');
      }
    },
    created() {
      checkToken(this.$store.state.token)
              .catch(() => {
                this.$messageBox.showErrorMessage(this, "404！   !!!∑(ﾟДﾟノ)ノ");
                this.$router.replace('/login');
                this.$store.commit("removeTokenAndUser");
              })
    }
  }
</script>

<style scoped>
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
    margin-left: 110px;
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

</style>