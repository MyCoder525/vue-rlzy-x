<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <el-card class="box-card">
        <TreeTool
          :is-root="false"
          :tree-data="compray"
          @getisshowadd="getisshowadd"
        ></TreeTool>
      </el-card>
      <el-tree :data="departs" default-expand-all :props="defaultProps">
        <template v-slot="{ data }">
          <TreeTool
            :is-root="true"
            :tree-data="data"
            @get-departments="getDepartments"
            @getisshowadd="getisshowadd"
            @getisshowedit="getisshowedit"
          ></TreeTool>
        </template>
      </el-tree>
    </div>
    <AddDept
      ref="AddDept"
      :currcent-node="currcentNode"
      :isshow-add.sync="isshowAdd"
      @getDepartments="getDepartments"
    ></AddDept>
  </div>
</template>

<script>
import TreeTool from "./component/tree-tool.vue";
import AddDept from "./component/add-dept.vue";
import { getDepartments } from "@/api/departments.js";
import { transList } from "@/utils";
// , transListTotree
export default {
  components: { TreeTool, AddDept },
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "name",
      },
      departs: [
        {
          name: "总裁办",
          manager: "曹操",
          children: [{ name: "董事会", manager: "曹丕" }],
        },
        { name: "行政部", manager: "刘备" },
        { name: "人事部", manager: "孙权" },
      ],
      compray: {
        name: "XXXX公司",
        manager: "负责人",
      },
      isshowAdd: false,
      currcentNode: {},
      loading: false,
    };
  },
  created() {
    this.getDepartments();
  },
  methods: {
    async getDepartments() {
      this.loading = true;
      try {
        const res = await getDepartments();
        console.log(res);
        this.compray = {
          name: res.companyName,
          manager: res.companyManage || "管理员",
          id: "",
        };
        this.departs = transList(res.depts);
        this.loading = false;
      } catch (e) {
        console.log(e);
        this.loading = false;
      }
    },
    async getisshowadd(node) {
      this.isshowAdd = true;
      this.currcentNode = node;
    },
    async getisshowedit(node) {
      this.isshowAdd = true;
      this.currcentNode = node;
      console.log(this.$refs);
      this.$refs.AddDept.getDetailById(node.id);
    },
  },
};
</script>

<style scoped lang="scss">
.dashboard-container {
  .app-container {
    width: 680px;
    margin: 0 auto;
    .box-card {
      background: #9cf;
      color: #036;
    }
  }
}
</style>
