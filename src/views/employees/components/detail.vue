<template>
  <el-card class="box-card">
    <el-tabs>
      <el-tab-pane label="用户管理">
        <el-form ref="form" :model="activeName" :rules="rules" label-width="120px">
          <el-form-item label="姓名" prop="username" style="width: 40%">
            <el-input v-model="activeName.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password2" style="width: 40%">
            <el-input v-model="activeName.password2"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveUserDetailById">
              更新
            </el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="个人详情">
        <component :is="UserInfo"></component>
      </el-tab-pane>
      <el-tab-pane label="岗位详情">
        <component :is="JobInfo"></component>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import { getUserDetailById } from "@/api/user";
import { saveUserDetailById } from "@/api/employees";
import UserInfo from "./user-info.vue";
import JobInfo from "./job-info.vue";
export default {
  components: {
    UserInfo,
    JobInfo
  },
  data() {
    return {
      JobInfo: "JobInfo",
      UserInfo: "UserInfo",
      activeName: {
        username: "",
        password2: ""
      },
      rules: {
        username: [
          {
            required: true,
            target: "blur",
            message: "姓名不能为空"
          }
        ],
        password2: [
          {
            required: true,
            target: "blur",
            message: "密码不能为空"
          }
        ]
      }
    };
  },
  created() {
    this.getUserDetailById();
  },
  methods: {
    async getUserDetailById() {
      this.activeName = await getUserDetailById(this.$route.params.id);
    },
    async saveUserDetailById() {
      this.$refs.form.validate();
      try {
        await saveUserDetailById({
          ...this.activeName,
          password: this.activeName.password2
        });
        this.$message.success("修改成功");
      } catch (error) {
        console.log(error);
        this.$message.success("修改失败");
      }
    }
  }
};
</script>

<style>
</style>
