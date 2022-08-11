<template>
  <el-dialog
    title="分配权限"
    :visible="dialogVisibleRole"
    width="60%"
    @close="close"
  >
    <el-checkbox-group v-model="checkList">
      <el-checkbox v-for="(item, index) in list" :key="index" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="btnOk">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { assignRoles } from "@/api/employees";
import { getRoleList } from "@/api/setting";
import { getUserDetailById } from "@/api/user";
export default {
  name: "AssignRole",
  props: {
    dialogVisibleRole: {
      type: Boolean,
      default: false,
    },
    ids: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      checkList: [],
      list: [],
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    async btnOk() {
      try {
        await assignRoles({
          id: this.ids,
          roleIds: this.checkList,
        });
        this.$message.success("角色修改成功");
        this.close();
      } catch (error) {
        console.log(error);
        this.$message.error("角色修改失败");
        this.close();
      }
    },
    close() {
      this.roleIds = []; // 清空原来的数组
      this.$emit("update:dialogVisibleRole", false);
    },
    async getRoleList() {
      const { rows } = await getRoleList();
      this.list = rows;
    },
    async getUserDetailById(id) {
      const { roleIds } = await getUserDetailById(id);
      console.log(roleIds);
      this.checkList = roleIds || [];
    },
  },
};
</script>

<style></style>
