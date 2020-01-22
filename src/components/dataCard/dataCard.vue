<template>
  <div id="dataCard" :style="cardStyle">
    <el-card class="box-card" shadow="hover">
      <div slot="header" class="clearfix">
        <!--卡片标题 可以添加按钮等内容-->
        <div id="header-left">
          {{cardName}}
        </div>
        <!--卡片头部插槽 可以添加按钮等内容-->
        <div id="header-right">
          <slot name="cardHead"></slot>
        </div>
      </div>
      <!--卡片头部插槽 可以添加问卷的信息-->
      <div id="except-header">
        <slot name="cardBody"></slot>
        <slot name="cardFoot"></slot>
      </div>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "dataCard",
    props: {
      cardName: {
        required: true
      },
      cardStyle: {
        type: Object,
      }
    }
  }
</script>

<style scoped>
  .clearfix{
    line-height: 17px;
    font-size: 8px;
    display: flex;
  }
  #header-left{
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    width: 230px;
  }
  #header-right{
    width: 50px;
  }
  #except-header{
    display: flex;
    flex-direction: column;
  }

</style>