<template>
  <div id="complete">

  </div>
</template>

<script>
  import {getCondition} from "@/network/complete";
  import {getProblems} from "@/network/complete";

  export default {
    name: "complete",
    created() {
      this.getCondition()
    },
    methods: {
      getCondition() {
        getCondition(this.$route.params.flag)
                .then(res => {
                  if (!res['information']['questionnaireCondition']) {
                    this.$messageBox.showErrorMessage(this, "这个问卷已经过期")
                  }
                })
                .catch(() => {
                  this.$messageBox.showErrorMessage(this, "这个问卷不存在,请确认链接无误!")
                })
      },
      getProblems() {
        getProblems(this.$route.params.flag)
      }
    }
  }
</script>

<style scoped>
</style>