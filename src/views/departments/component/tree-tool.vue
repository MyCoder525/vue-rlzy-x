<template>
  <el-row style="width: 100%" type="flex" justify="space-between">
    <el-col :span="6">
      <div class="grid-content bg-purple">{{ treeData.name }}</div>
    </el-col>
    <el-col :span="6">
      <el-row type="flex" justify="space-between">
        <el-col>
          <div>{{ treeData.manager }}</div>
        </el-col>
        <el-col>
          <el-dropdown @command="clickItem">
            <span class="el-dropdown-link">
              操作<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加部门</el-dropdown-item>
              <el-dropdown-item v-if="isRoot" command="edit">
                编辑部门
              </el-dropdown-item>
              <el-dropdown-item v-if="isRoot" command="del">
                删除部门
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from "@/api/departments";
export default {
  name: "TreeTool",
  props: {
    treeData: {
      type: Object,
      default: () => ({}),
    },
    isRoot: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    async clickItem(type) {
      console.log(222);
      console.log(type);
      if (type === "add") {
        // 添加
        this.$emit("getisshowadd", this.treeData);
      } else if (type === "edit") {
        // 编辑
        this.$emit("getisshowedit", this.treeData);
      } else {
        // 删除
        await this.$confirm("确认删除?");
        await delDepartments(this.treeData.id);
        this.$message.success("删除成功");
        this.$emit("get-departments");
        console.log("del");
      }
    },
  },
};
</script>

<style></style>
