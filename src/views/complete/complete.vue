<template>
  <div id="complete" v-show="isSecret">
    <secret-input @passkey="checkKeys"></secret-input>
  </div>
</template>

<script>
  import {checkSecretKey, getCondition, getProblems} from "../../network/complete";
  import secretInput from "./childComp/secretInput";

  export default {
    name: "complete",
    components: {
      secretInput
    },
    created() {
      this.getCondition()
    },
    data() {
      return {
        isSecret: true
      }
    },
    methods: {
      getCondition() {
        getCondition(this.$route.params.flag)
                .then(res => {
                  //问卷过期
                  if (!res['information']['questionnaireCondition']) {
                    this.$messageBox.showInfoMessage(this, "这个问卷已经过期");
                    return
                  }
                  if (res['information']['questionnaireIsSecret']) {
                    this.$messageBox.showInfoMessage(this, "请输入密码以进入");
                    return
                  }
                  //抽取问题
                  this.getProblems();
                })
                .catch(() => {
                  //问卷不存在
                  this.$messageBox.showErrorMessage(this, "这个问卷不存在,请确认链接无误!");
                })
      },
      checkKeys(res) {
        checkSecretKey(this.$route.params.flag, res)
                .then(() => {
                  this.$messageBox.showSuccessMessage(this, "验证通过!");
                  this.getProblems();
                })
                .catch(() => {
                  this.$messageBox.showErrorMessage(this, "验证失败!");
                })
      },
      getProblems() {
        this.isSecret = false;
        getProblems(this.$route.params.flag);
      },
    }
  }
</script>

<style scoped>
</style>