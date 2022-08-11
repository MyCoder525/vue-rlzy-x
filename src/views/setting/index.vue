<template>
  <div class="caord">
    <el-card class="box-card">
      <el-tabs v-model="activeName">
        <el-tab-pane label="角色管理" name="second">
          <el-button icon="el-icon-plus" size="small" type="primary" @click="showDialog = true">
            新增角色
          </el-button>
          <el-table :data="list" style="width: 100%">
            <el-table-column type="index" label="序号" width="180">
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="180">
            </el-table-column>
            <el-table-column prop="description" label="地址"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="success" @click="assignPerm(scope.row.id)"> 权限分配 </el-button>
                <el-button size="mini" type="primary" @click="Edit(scope.row)">
                  编辑
                </el-button>
                <el-button size="mini" type="danger" @click="Delete(scope.row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination style="margin-top: 20px; text-align: center" background layout="prev, pager, next"
            :page-size="page.pagesize" :current-page="page.page" :total="total" @current-change="currcentchange">
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="公司信息">
          <el-alert title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改" type="info" show-icon>
          </el-alert>
          <el-form ref="formdate" :model="formData" disabled label-width="80px" style="margin-top: 50px; width: 40%">
            <el-form-item label="公司名称">
              <el-input v-model="formData.name"></el-input>
            </el-form-item>
            <el-form-item label="公司地址">
              <el-input v-model="formData.companyAddress"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="formData.mailbox"></el-input>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="formData.remarks" type="textarea"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog title="编辑角色" :visible.sync="showDialog" width="30%" @close="close">
      <el-form ref="form" :rules="rules" :model="resform" label-width="80px">
        <el-form-item label="角色" prop="name">
          <el-input v-model="resform.name"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="resform.description"></el-input>
        </el-form-item>
      </el-form>
      <template slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="btnOk">确 定</el-button>
      </template>
    </el-dialog>
    <!-- 权限分配框 -->
    <el-dialog title="设置权限" :visible.sync="showPermissionDialog" @close="closePermission">
      <el-tree ref="treeRef" :data="permissionlist" check-strictly show-checkbox node-key="id" default-expand-all
        :default-checked-keys="checkedKeys" :props="props">
      </el-tree>
      <template slot="footer" class="dialog-footer">
        <el-button @click="closePermission()">取 消</el-button>
        <el-button type="primary" @click="btnOkPermission">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import {
  addRole,
  deleteRole,
  getCompanyInfo,
  getRoleDetail,
  getRoleList,
  updateRole
} from "@/api/setting";
import { getPermissionList, assignPerm } from "@/api/permisson";
import { transListTotree } from "@/utils";
export default {
  data() {
    return {
      props: {
        label: 'name'
      },
      checkedKeys: [],
      permissionlist: [],
      currentRoleId: null,
      showPermissionDialog: false,
      showDialog: false,
      activeName: "second",
      formData: {
        name: "",
        id: ""
      },
      resform: { name: "", description: "" },
      rules: {
        name: [
          {
            required: true,
            message: "不能为空"
          }
        ]
      },
      list: [],
      total: 0,
      page: {
        pagesize: 2,
        page: 1
      }
    };
  },
  created() {
    this.getRoleList();
    this.getCompanyInfo();
  },
  methods: {
    // 点击确定事件
    async btnOkPermission() {
      const checkedKeys = this.$refs.treeRef.getCheckedKeys();
      await assignPerm({
        id: this.currentRoleId,
        permIds: checkedKeys
      });
      // 成功的提示
      this.$message.success("分配成功");
      this.closePermission()
    },
    // 关闭弹层事件
    closePermission() {
      this.showPermissionDialog = false;
      this.checkedKeys = []
    },
    // 新增权限
    async assignPerm(id) {
      this.permissionlist = transListTotree(await getPermissionList(), '0');
      const { permIds } = await getRoleDetail(id);
      this.currentRoleId = id;
      this.checkedKeys = permIds;
      this.showPermissionDialog = true;
    },
    async Edit(id) {
      this.showDialog = true;
      this.resform = await getRoleDetail(id.id);
    },
    async btnOk() {
      await this.$refs.form.validate();
      if (this.resform.id) {
        console.log(111);
        console.log(this.resform);
        const res = await updateRole(this.resform);
        console.log(res);
      } else {
        await addRole(this.resform);
      }
      this.getRoleList();
      this.close();
    },
    close() {
      this.showDialog = false;
      this.$refs.form.resetFields();
      this.resform = { name: "", description: "", id: "" };
    },
    async Delete(id) {
      console.log(id);

      await this.$confirm("确认？");
      const len = this.list.length;
      if (len === "1" && this.page.page > 1) {
        this.page.page - 1;
      }
      await deleteRole(id.id);
      this.$message.success("删除成功");
      this.getRoleList();
    },
    async getRoleList() {
      const res = await getRoleList(this.page);
      console.log(res); // total   rows
      this.list = res.rows;
      this.total = res.total;
    },
    currcentchange(page) {
      this.page.page = page;
      this.getRoleList();
    },
    async getCompanyInfo() {
      const res = await getCompanyInfo(this.$store.getters.companyId);
      console.log(res);
      this.formData = res;
    }
  }
};
</script>

<style lang="scss">
.caord {
  padding: 30px;
}
</style>
