<template>
  <el-dialog title="提示" :visible="dialogVisible" @close="cloes">
    <!-- 表单 -->
    <el-form ref="form" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="姓名" prop="username">
        <el-input
          v-model="formData.username"
          style="width: 85%"
          placeholder="请输入姓名"
        />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input
          v-model="formData.mobile"
          style="width: 85%"
          placeholder="请输入手机号"
        />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker
          v-model="formData.timeOfEntry"
          style="width: 85%"
          placeholder="请选择入职时间"
        />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select
          v-model="formData.formOfEmployment"
          style="width: 85%"
          placeholder="请选择"
        >
          <el-option
            v-for="item in selectoptions"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="useworkNumberrname">
        <el-input
          v-model="formData.workNumber"
          style="width: 85%"
          placeholder="请输入工号"
        />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <!-- <el-input
          v-model="formData.departmentName"
          style="width: 85%"
          placeholder="请选择部门"
        /> -->
        <el-cascader
          v-model="formData.departmentName"
          :options="options"
          :props="{
            checkStrictly: true,
            label: 'name',
            value: 'name',
            emitPath: false,
          }"
          style="width: 85%"
          placeholder="请选择部门"
          @focus="getDepartments"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker
          v-model="formData.correctionTime"
          style="width: 85%"
          placeholder="请选择转正时间"
        />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small">取消</el-button>
          <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import { transListTotree } from "@/utils/index";
import { getDepartments } from "@/api/departments";
import Employees from "@/api/constant/employees.js";
import { addEmployee } from "@/api/employees";
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectoptions: Employees.hireType,
      options: [],
      formData: {
        username: "", // 用户姓名
        mobile: "", // 手机号
        formOfEmployment: "", // 聘用形式
        workNumber: "", // 工号
        departmentName: "", // 部门名称
        timeOfEntry: "", // 入职时间
        correctionTime: "", // 转正时间
      },
      rules: {
        username: [
          { required: true, message: "用户姓名不能为空", trigger: "blur" },
          {
            min: 1,
            max: 4,
            message: "用户姓名为1-4位",
          },
        ],
        mobile: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "手机号格式不正确",
            trigger: "blur",
          },
        ],
        formOfEmployment: [
          { required: true, message: "聘用形式不能为空", trigger: "blur" },
        ],
        workNumber: [
          { required: true, message: "工号不能为空", trigger: "blur" },
        ],
        departmentName: [
          { required: true, message: "部门不能为空", trigger: "change" },
        ],
        timeOfEntry: [{ required: true, message: "入职时间", trigger: "blur" }],
      },
    };
  },
  created() {
    // this.getDepartments();
  },
  methods: {
    async btnOk() {
      this.$refs.form.validate();
      await addEmployee(this.formData);
      this.$message.success("添加成功");
      this.cloes();
      this.$parent.getEmployeeList();
    },
    async getDepartments() {
      if (this.options.length) return; // 如果当前的树形数据已经有的的情况下就不需要再获取数据
      const { depts } = await getDepartments();
      console.log(depts);
      // depts是数组 但不是树形
      this.options = transListTotree(depts, "");
      console.log(this.options);
    },
    cloes() {
      this.$emit("update:dialogVisible", false);
      this.$refs.form.resetFields();
      this.formData = {
        username: "", // 用户姓名
        mobile: "", // 手机号
        formOfEmployment: "", // 聘用形式
        workNumber: "", // 工号
        departmentName: "", // 部门名称
        timeOfEntry: "", // 入职时间
        correctionTime: "", // 转正时间
      };
    },
  },
};
</script>

<style></style>
