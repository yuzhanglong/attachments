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
            <el-button type="primary" class="share-link-button" v-clipboard="this.shareLink" @click="copySuccess">复制
            </el-button>
            <el-button class="share-link-button" @click="openTargetLink()">打开</el-button>
            <el-button id="share-wechat-button" disabled><img src="@/assets/img/icon/Wechat.svg" alt="" width="30px">
            </el-button>
            <el-button id="share-qq-button" disabled><img src="@/assets/img/icon/QQ.svg" alt="" width="30px">
            </el-button>
          </div>

        </div>
        <div id="project-share-bottom-container">
          <el-button icon="el-icon-picture-outline" @click="dialogVisible = true">制作二维码海报</el-button>
          <el-button @click="gotoPreview">预览这个问卷</el-button>

          <el-dialog title="二维码海报" :visible.sync="dialogVisible" width="60%">
            <div id="qr-code-post-container">
              <div id="qr-code-post-left">
                <div class="qr-code-post-types">
                  <div v-for="(index) in 5"
                       class="qr-code-post-types-items" @click="changeIndex(index)" :key="index">
                    <img :src="require(`@/assets/img/postsMaker/poster_group_${index}.png`)" alt="" width="70px"
                         v-show="!checkIsShow(index)">
                    <img :src="require(`@/assets/img/postsMaker/poster_group_${index}_h.png`)" alt="" width="70px"
                         v-show="checkIsShow(index)">
                  </div>
                </div>
              </div>
              <div id="qr-code-post-mid">
                <div id="qr-code-post-mid-title">
                  <span>可选背景图片</span>
                </div>
                <div id="qr-bgc-container">
                  <div :class="getQRCodeBgcActive(index)" v-for="(index) in 10" :key="index"
                       @click="activeBgcImg = index">
                    <img :src="getQRmakerBgc(index)" alt="" width="80px"
                         height="145px">
                  </div>
                </div>

              </div>
              <div id="qr-code-post-right">
                <div id="qr-code-post-right-phone-wrap">
                  <!--图片上的一些文字-->
                  <div id="qr-code-post-right-phone-text">
                    <span>{{questionnaireTitle}}</span>
                    <p></p>
                  </div>
                  <!--图片上的二维码-->
                  <div id="qr-code-post-right-phone-qr">
                    <img :src="shareQRCode" alt="" width="70px">
                  </div>
                  <div id="qr-code-post-right-phone-img">
                    <img :src="activeBgcImgLink" alt="" width="197px">
                  </div>
                  <div id="qr-code-post-right-phone-base">
                    <img src="@/assets/img/postsMaker/iphonex.png" alt="" width="220px">
                  </div>
                </div>
                <div id="make-post-button-wrap">
                  <el-button type="primary" @click="getQRPost">下 载 海 报</el-button>
                </div>
              </div>
            </div>
          </el-dialog>

        </div>
      </div>
      <div id="spilt-line"></div>
      <div id="share-right">
        <div class="qr-code-text">
          <span>扫码分享答题页</span>
        </div>
        <div id="qr-code-container">
          <el-image :src="shareQRCode" class="qr-code-image">
          </el-image>
        </div>
        <div class="qr-code-text-bottom">
          <el-link :href="downloadQRCode" target="_blank">下载二维码</el-link>
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
      questionnaireTitle: {
        type: String
      }
    },

    data() {
      return {
        dialogVisible: false,
        shareLink: this.globalData.webBaseUrl + "/complete/" + this.shareFlag + "?type=fill",
        shareQRCode: this.globalData.serverBaseUrl + "/utils/qrcode/get_qr_code?flag=" + this.shareFlag,
        downloadQRCode: this.globalData.serverBaseUrl + "/utils/qrcode/download_qr_code?flag=" + this.shareFlag,
        activeIndex: 1,
        activeBgcImg: 1
      }
    },
    computed: {
      activeBgcImgLink: function () {
        return this.globalData.serverBaseUrl + '/utils/qrcode/qr_pictures/' + this.activeBgcImg
      }
    },
    methods: {
      getQRmakerBgc(index) {
        return this.globalData.serverBaseUrl + "/utils/qrcode/qr_pictures/" + index;
      },
      gotoPreview() {
        window.open(this.globalData.webBaseUrl + "/complete/" + this.shareFlag + "?type=preview");
      },
      getQRPost() {
        let bgcId = this.activeBgcImg;
        let styleType = this.activeIndex - 1;
        let title = this.questionnaireTitle;
        let flag = this.shareFlag;
        window.open(`${this.globalData.serverBaseUrl}/utils/qrcode/download_qr_post?backgroundid=${bgcId}&styletype=${styleType}&flag=${flag}&title=${title}`)
      },
      checkIsShow(index) {
        return this.activeIndex === index
      },
      changeIndex(index) {
        this.activeIndex = index
      },
      copySuccess() {
        this.$messageBox.showSuccessMessage(this, '成功将链接复制到剪贴板!')
      },
      openTargetLink() {
        window.open(this.shareLink)
      },
      getQRCodeBgcActive(index) {
        return index === this.activeBgcImg ? "qr-code-bgc-items-active" : "qr-code-bgc-items";
      }
    }
  }
</script>

<style scoped>
  #qr-code-post-right-phone-text {
    color: #ffffff;
    position: absolute;
    padding-top: 360px;
    z-index: 3;
    padding-right: 20px;
    font-size: 18px;
    width: 150px;
  }

  #qr-code-post-right-phone-qr {
    position: absolute;
    padding-top: 35px;
    z-index: 3;
    padding-right: 110px;
  }

  #qr-code-post-right-phone-base {
    position: relative;
    z-index: 2;
  }

  #qr-code-post-right-phone-img {
    position: absolute;
    padding-top: 12px;
    z-index: 1;
  }

  #qr-code-post-mid-title {
    padding: 15px;
    font-size: 20px;
  }

  .qr-code-bgc-items {
    padding: 4px;
    border-radius: 5px;
    border: 2px solid #ffffff;
  }

  .qr-code-bgc-items-active {
    padding: 4px;
    border-radius: 5px;
    border: 2px solid #2672ff;
  }

  #qr-bgc-container {
    display: flex;
    width: 500px;
    flex-wrap: wrap;
    justify-content: space-evenly;
  }

  #qr-code-post-container {
    display: flex;
    height: 600px;
  }

  #qr-code-post-left {
    width: 82px;
    background-color: #eeeeee;
    display: flex;
    justify-content: center;
  }

  #qr-code-post-mid {
    flex: 1;
    background-color: #ffffff;
  }

  #qr-code-post-right {
    display: flex;
    flex-direction: column;
    width: 400px;
    background-color: #eeeeee;
  }

  #qr-code-post-right-phone-wrap {
    padding-top: 20px;
    display: flex;
    justify-content: center;
  }

  #make-post-button-wrap {
    display: flex;
    justify-content: center;
    padding-top: 60px;
  }

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