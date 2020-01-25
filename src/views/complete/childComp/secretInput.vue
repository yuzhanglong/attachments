<template>
  <div id="secret-input">
    <div id="secret">
      <span>问卷已被加密，请您输入密码来访问</span>
      <div id="secret-input-group">
        <div id="the-secret-input">
          <el-input v-model="secretKey"></el-input>
        </div>
        <div id="secret-button">
          <el-button style="width: 100px" @click="passKey">确定</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "secretInput",
    data() {
      return {
        secretKey: ""
      }
    },
    methods: {
      //提交密码
      passKey() {
        this.$emit('passkey', this.secretKey);
      }
    }
  }
</script>

<style scoped>
  #secret {
    text-align: center;
    padding-top: 30vh;
    display: flex;
    flex-direction: column;
  }

  #the-secret-input {
    padding-top: 20px;
    display: flex;
    margin-left: 20px;
    margin-right: 20px;
  }

  #secret-button {
    padding-top: 20px;
    display: flex;
    justify-content: center;
  }
</style>