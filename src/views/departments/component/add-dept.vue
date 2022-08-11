<template>
  <el-dialog
    :title="`${setshowtitle}部门【${currcentNode.name}】`"
    :visible="isshowAdd"
    width="70%"
    @close="colse"
  >
    <el-form
      ref="form"
      :model="formData"
      :rules="formRyles"
      label-width="100px"
    >
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code"></el-input>
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <!-- <el-input v-model="formData.manager"></el-input> -->
        <el-select
          v-model="formData.manager"
          placeholder="请选择"
          style="width: 100%"
          @focus="getSelectemp"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :value="item.username"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="colse">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  addDepartments,
  getDepartDetail,
  getDepartments,
  updateDepartments,
} from "@/api/departments";
import { getEmployeeSimple } from "@/api/employees";
export default {
  props: {
    isshowAdd: {
      type: Boolean,
      default: false,
    },
    currcentNode: {
      type: Object,
      default: null,
    },
  },
  data() {
    const checkName = async(rule, value) => {
      const { depts } = await getDepartments();
      let currcentChilder = null;
      if (this.formData.id) {
        currcentChilder = depts.filter(
          (item) =>
            item.pid === this.currcentNode.pid &&
            item.id !== this.currcentNode.id
        );
      } else {
        currcentChilder = depts.filter(
          (item) => item.pid === this.currcentNode.id
        );
      }
      const isRepeatName = currcentChilder.some((item) => item.name === value);
      if (isRepeatName) {
        return Promise.reject("部门名称重复了");
      }
    };
    const checkCode = async(rule, value) => {
      const { depts } = await getDepartments();
      let isRepeatCode = null;
      if (this.formData.id) {
        isRepeatCode = depts.some((item) => {
          return item.code === value && item.id !== this.currcentNode.id;
        });
      } else {
        isRepeatCode = depts.some((item) => {
          return item.code === value;
        });
      }

      if (isRepeatCode) {
        return Promise.reject("部门编码重复");
      }
    };
    return {
      formData: {
        name: "", // 部门名称
        code: "", // 部门编码
        manager: "", // 部门管理者
        introduce: "", // 部门介绍
      },
      formRyles: {
        name: [
          {
            required: true,
            message: "部门名称不能为空",
            trigger: "blur",
          },
          {
            min: 1,
            max: 50,
            message: "部门名称1-50",
            trigger: "blur",
          },
          {
            validator: checkName,
            trigger: "blur",
          },
        ],
        code: [
          { required: true, message: "部门编码不能为空", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "部门名称1-50",
            trigger: "blur",
          },
          {
            validator: checkCode,
            trigger: "blur",
          },
        ],
        manager: [
          { required: true, message: "部门管理者不能为空", trigger: "blur" },
        ],
        introduce: [
          { required: true, message: "部门介绍不能为空", trigger: "blur" },
          {
            min: 1,
            max: 300,
            message: "部门名称1-300",
            trigger: "blur",
          },
        ],
      },
      options: [
        {
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
        {
          value: "选项3",
          label: "蚵仔煎",
        },
        {
          value: "选项4",
          label: "龙须面",
        },
        {
          value: "选项5",
          label: "北京烤鸭",
        },
      ],
    };
  },
  computed: {
    setshowtitle() {
      return this.formData.id ? "编辑" : "添加";
    },
  },
  methods: {
    async getSelectemp() {
      this.options = await getEmployeeSimple();
    },
    async getDetailById(id) {
      this.formData = await getDepartDetail(id);
    },
    async submit() {
      // console.log(this.$refs.form);
      // debugger;
      await this.$refs.form.validate();
      if (this.formData.id) {
        await updateDepartments(this.formData);
      } else {
        await addDepartments({ ...this.formData, pid: this.currcentNode.id });
      }
      this.$message.success(`${this.setshowtitle}成功`);
      this.$emit("getDepartments");
      this.colse();
    },
    colse() {
      // console.log(111);
      this.$refs.form.resetFields();
      this.formData = {
        name: "", // 部门名称
        code: "", // 部门编码
        manager: "", // 部门管理者
        introduce: "", // 部门介绍
      };
      this.$emit("update:isshowAdd", false);
    },
  },
};
</script>

<style></style>
