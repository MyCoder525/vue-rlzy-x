<template>
  <div class="page-tools">
    <el-card class="box-card">
      <el-row type="flex">
        <el-col>
          <div v-if="$slots.before" class="before">
            <i class="el-icon-info"></i>
            <slot name="before"></slot>
          </div>
        </el-col>
        <el-col>
          <div class="grid-content bg-purple">
            <el-row type="flex" justify="end">
              <slot name="afterbtn"></slot>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "ToolBar"
};
</script>

<style lang="scss">
.page-tools {
  margin: 10px 0;

  .before {
    line-height: 34px;

    i {
      margin-right: 5px;
      color: #409eff;
    }

    display: inline-block;
    padding: 0px 10px;
    border-radius: 3px;
    border: 1px solid rgba(145, 213, 255, 1);
    background: rgba(230, 247, 255, 1);
  }
}
</style>
