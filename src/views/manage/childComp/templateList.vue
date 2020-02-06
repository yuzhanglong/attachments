<template>
  <div id="template-list">
    <el-table :data="templateData" height="100%">
      <el-table-column property="time" label="更新日期" width="200"></el-table-column>
      <el-table-column property="name" label="问卷名称" width="300"></el-table-column>
      <el-table-column property="info" label="信息" width="350"></el-table-column>
      <el-table-column
              fixed="right"
              label="操作" width="300">
        <template slot-scope="scope">
          <el-button type="primary" size="small"
                     @click="priviewTempate(scope.row.flag)"
                     class="preview-button">
            预览这个模板
          </el-button>
          <el-button type="primary" size="small" @click="addTempate(scope.row.flag)">
            添加到"我的项目"
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {copyTemplates} from "../../../network/questionnaire";

  export default {
    name: "templateList",
    props: {
      templateData: {
        required: true,
        type: Array,
        default() {
          return []
        }
      }
    },
    methods: {
      priviewTempate(flag) {
        window.open(this.globalData.webBaseUrl + "/complete/" + flag + "?type=preview");
      },
      addTempate(flag) {
        copyTemplates(this.$store.state.user, this.$store.state.token, flag)
                .then(() => {
                  window.location.reload();
                })
                .catch(() => {
                  this.$messageBox.showErrorMessage(this, "添加失败!");
                })
      },
    }
  }
</script>

<style scoped>
  #template-list {
    height: 71vh;
  }

  .preview-button {
    padding-left: 24px;
    padding-right: 24px;
  }
</style>