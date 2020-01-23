<template>
  <div id="project-share">
    <div id="project-share-title">
      <span>项目分享</span>
    </div>
    <div id="project-share-body">
      <div id="share-left">
        <div id="project-share-body-container">
          <div id="share-text-wrap">分享链接</div>
          <div id="project-share-items">
            <div id="share-link-input">
              <el-input disabled v-model="this.shareLink"></el-input>
            </div>
            <el-button type="primary" class="share-link-button">复制</el-button>
            <el-button class="share-link-button">打开</el-button>
            <el-button id="share-wechat-button"><img src="@/assets/img/icon/Wechat.svg" alt="" width="30px"></el-button>
            <el-button id="share-qq-button"><img src="@/assets/img/icon/QQ.svg" alt="" width="30px"></el-button>
          </div>

        </div>
        <div id="project-share-bottom-container">
          <el-button icon="el-icon-picture-outline">制作二维码海报</el-button>
          <el-button disabled style="padding-left: 15px; padding-right: 15px">useless</el-button>
        </div>
      </div>
      <div id="spilt-line"></div>
      <div id="share-right">
        <div class="qr-code-text">
          <span>扫码分享答题页</span>
        </div>
        <div id="qr-code-container">
          <el-image src="" class="qr-code-image">
          </el-image>
        </div>
        <div class="qr-code-text-bottom">
          <el-link>下载二维码</el-link>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  export default {
    name: "projectShare",
    props: {
      shareFlag: {
        type: String,
      },
      shareQrCode: {
        type: String
      }
    },
    data() {
      return {
        shareLink: "http://localhost:8080/#/complete/" + this.shareFlag
      }
    }
  }
</script>

<style scoped>
  #spilt-line {
    margin-left: 20px;
    border-left: solid 2px #eaeaea;
    height: 175px;
    vertical-align: middle;
    display: inline-block;
    margin-top: 15px;
  }

  #share-wechat-button {
    padding: 0 5px;
    margin-left: 18px;
    background-color: #45b035;
  }

  #share-qq-button {
    padding: 0 5px;
    margin-left: 10px;
    background-color: #ffffff;
  }

  #project-share-bottom-container {
    padding-left: 30px;
    display: flex;
  }

  #share-text-wrap {
    padding-bottom: 10px;
  }

  #project-share-items {
    display: flex;
  }

  #project-share {
    margin-top: 65px;
    width: 980px;
  }

  #project-share-body {
    display: flex;
    margin-top: 20px;
    background-color: #ffffff;
    height: 200px;
  }

  #project-share-body-container {
    padding: 30px;
  }

  #share-link-input {
    width: 400px;
  }

  .share-link-button {
    width: 85px;
    margin-left: 10px;
  }

  .qr-code-image {
    width: 100px;
    height: 100px;
  }

  #qr-code-container {
    padding-top: 5px;
    padding-left: 45px;
  }

  .qr-code-text {
    padding-top: 22px;
    padding-left: 39px;
    padding-bottom: 10px;
  }

  .qr-code-text-bottom {
    padding-top: 10px;
    padding-left: 58px;
  }


</style>