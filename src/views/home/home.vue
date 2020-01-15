<template>
  <div id="home" :style="background">
    <el-header>
    </el-header>
    <el-main>
      <h2 class="home-text1">WARMLY WELCOME!</h2>
      <h2 class="home-text2">A SIMPLE QUESTIONNAIRE WEBSITE</h2>

      <div id="button-wrap">
        <el-button round class="home-button" @click="itemClick('/login')">登录页面</el-button>
        <el-button round class="home-button" @click="itemClick('/home')">帮助文档</el-button>
        <el-button round class="home-button" @click="itemClick('/home')">查看源码</el-button>
      </div>

    </el-main>
    <div class="home-bottom">
      <el-link type="primary" :underline="false" href="https://github.com/yuzhanglong" class="home-bottom-link">
        by:yuzhanglong
      </el-link>
    </div>
  </div>
</template>

<script>
  export default {
    name: "home",
    data() {
      return {
        background: {}
      }
    },
    created() {
      this.background.backgroundImage = 'url(' + require('@/assets/img/homeBackground.jpg') + ')'
    },
    methods: {
      itemClick(path) {
        if (this.$route.path.indexOf(path) === -1)
          this.$router.replace(path)
      }
    }
  }
</script>

<style scoped>
  #home {
    /*背景图片自适应*/
    height: 100%;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
  }

  .home-text1 {
    opacity: 0.6;
    text-align: center;
    padding-top: 25px;
    padding-bottom: 40px;
  }

  .home-text2 {
    opacity: 0.6;
    text-align: center;
    padding-top: 40px;
    padding-bottom: 40px;
    font-size: 35px;
  }

  .home-bottom {
    /*文字底部居中*/
    position: fixed;
    bottom: 3%;
    width: 100%;
    text-align: center;
  }

  .home-bottom-link {
    font-size: 18px;
    font-weight: bold;
  }

  .home-button {
    opacity: 0.7;
    padding: 20px;
    margin: 15px;
    font-size: 20px;
    font-weight: bold;
    width: 150px;
    background-color: transparent;
    color: black;
  }

  #button-wrap {
    display: flex;
    justify-content: center;
  }
</style>