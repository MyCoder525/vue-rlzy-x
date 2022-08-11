<template>
  <div class="dashboard-container">
    <div class="app-container">
      <ToolBar>
        <template #before>
          <span>共100条数据</span>
        </template>
        <template #afterbtn>
          <el-button size="mini" type="primary" @click="$router.push('/imports')">
            导入
          </el-button>
          <el-button size="mini" type="danger" @click="Export2Excel">
            导出
          </el-button>
          <el-button size="mini" type="warning" @click="dialogVisible = true">
            新增员工
          </el-button>
        </template>
      </ToolBar>
    </div>
    <el-card>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="index" label="序号" width="100">
        </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="staffPhoto" label="头像">
          <template v-slot="{ row }">
            <el-row type="flex" justify="center">
              <el-avatar :src="row.staffPhoto" style="width: 80px; height: 80px"
                @click.native="CodeDialog(row.staffPhoto)">
                <img
                  src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fup.enterdesk.com%2Fedpic_source%2F30%2F90%2F40%2F309040a0602c672cebc6ab3a1bbbc8cd.jpg&refer=http%3A%2F%2Fup.enterdesk.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1662273483&t=6a1e2a4c238af9953d9550ee75d34e43"
                  alt="" />
              </el-avatar>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column prop="workNumber" label="工号"> </el-table-column>
        <el-table-column prop="formOfEmployment" label="聘用形式" sortable :formatter="formatEmployment">
        </el-table-column>
        <el-table-column prop="departmentName" label="部门名称">
        </el-table-column>
        <el-table-column prop="timeOfEntry" label="入职时间">
          <!-- 作用域插槽 -->
          <template slot-scope="{ row }">{{
              row.timeOfEntry | formatDate
          }}</template>
        </el-table-column>
        <el-table-column prop="zip" label="账户状态"> </el-table-column>
        <el-table-column label="操作" fixed="right" width="300">
          <template v-slot="{ row }">
            <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">
              查看
            </el-button>
            <el-button type="text" size="small"> 转正 </el-button>
            <el-button type="text" size="small"> 调岗 </el-button>
            <el-button type="text" size="small"> 离职 </el-button>
            <el-button type="text" size="small" @click="dialogRole(row.id)">
              角色
            </el-button>
            <el-button :disabled="checkPermission('DELETE_USER')" type="text" size="small" @click="del(row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-row type="flex" justify="center" align="middle" style="height: 60px">
        <el-pagination :page-size="page.size" :page-count="page.page" :total="total" layout="prev, pager, next"
          @current-change="currcentchange" />
      </el-row>
    </el-card>
    <add-employess :dialog-visible.sync="dialogVisible"> </add-employess>
    <el-dialog title="二维码" :visible.sync="showCodeDialog">
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
    <AssignRole ref="roleId" :ids="ids" :dialog-visible-role.sync="dialogVisibleRole"></AssignRole>
  </div>
</template>

<script>
import ToolBar from "@/components/ToolBar/index.vue";
import { delEmployee, getEmployeeList } from "@/api/employees";
import EmployeeEnum from "@/api/constant/employees";
import { formatDate } from "@/filters";
import AddEmployess from "./components/add-employess.vue";
import QrCode from "qrcode";
import AssignRole from "./components/assign-role.vue";
import { mixins } from "@/utils/mixins";
export default {
  components: {
    ToolBar,
    AddEmployess,
    AssignRole
  },
  mixins: [mixins],
  data() {
    return {
      dialogVisibleRole: false,
      showCodeDialog: false,
      dialogVisible: false,
      tableData: [],
      ids: null,
      page: {
        page: 1, // 当前页码
        size: 10,
      },
      total: 0, // 总数
    };
  },
  created() {
    this.getEmployeeList();
  },
  methods: {
    async dialogRole(id) {
      this.ids = id;
      await this.$refs.roleId.getUserDetailById(id);
      this.dialogVisibleRole = true;
    },
    CodeDialog(url) {
      this.showCodeDialog = true;
      this.$nextTick(() => {
        QrCode.toCanvas(this.$refs.myCanvas, url);
      });
    },
    formatJson(headers, rows) {
      const resArr = rows.map((item) => {
        return Object.keys(headers).map((key) => {
          if (["timeOfEntry", "correctionTime"].includes(headers[key])) {
            formatDate(item[headers[key]]);
          }
          if (headers[key] === "formOfEmployment") {
            return (
              EmployeeEnum.hireType.find(
                (child) => +child.id === +item[headers[key]]
              )?.value || "未知"
            );
          }
          return item[headers[key]];
        });
      });
      return resArr;
    },
    async Export2Excel() {
      const headers = {
        姓名: "username",
        手机号: "mobile",
        入职日期: "timeOfEntry",
        聘用形式: "formOfEmployment",
        转正日期: "correctionTime",
        工号: "workNumber",
        部门: "departmentName",
      };
      const { export_json_to_excel } = await import(
        /* webpackChunkName:'Export2Excel'*/ "@/utils/Export2Excel.js"
      );
      console.log(export_json_to_excel);
      // const THeader = ["id", "标题", "作者", "阅读", "时间"];
      const { rows } = await getEmployeeList({ page: 1, size: this.total });
      const roewArr = this.formatJson(headers, rows);
      console.log(roewArr);
      export_json_to_excel({
        header: Object.keys(headers),
        data: roewArr,
        filename: "excel-text",
        autoWidth: true,
        bookType: "xlsx",
      });
    },
    async del(id) {
      // console.log(id);
      try {
        await this.$confirm("是否删除");
        await delEmployee(id);
        this.$message.success("删除成功");
        await this.getEmployeeList();
      } catch (e) {
        console.log(e);
      }
    },
    async getEmployeeList() {
      const res = await getEmployeeList(this.page);
      console.log(res);
      this.tableData = res.rows;
      this.total = res.total;
    },
    currcentchange(page) {
      this.page.page = page;
      this.getEmployeeList();
    },
    formatEmployment(row, column, cellValue, index) {
      const currcentData = EmployeeEnum.hireType.find(
        (item) => item.id === cellValue
      )?.value;
      return currcentData || "未知";
    },
  },
};
</script>

<style>
</style>
