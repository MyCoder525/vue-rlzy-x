<template>
  <UploadExcel :on-success="onSuccess"></UploadExcel>
</template>

<script>
import { importEmployee } from "@/api/employees.js";
const userRelations = {
  入职日期: "timeOfEntry",
  手机号: "mobile",
  姓名: "username",
  转正日期: "correctionTime",
  工号: "workNumber",
};
export default {
  methods: {
    async onSuccess({ results }) {
      console.log(results);
      const resArr = results.map((item) => {
        const obj = {};
        for (const itemkey in item) {
          if (
            ["timeOfEntry", "correctionTime"].includes(userRelations[itemkey])
          ) {
            obj[userRelations[itemkey]] = new Date(
              this.formatDate(item[itemkey], "/")
            );
          } else {
            obj[userRelations[itemkey]] = item[itemkey];
          }
        }
        return obj;
      });
      console.log(resArr);
      await importEmployee(resArr);
      this.$message.success("导入成功");
    },
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1);
      time.setYear(time.getFullYear() - 70);
      const year = time.getFullYear() + "";
      const month = time.getMonth() + 1 + "";
      const date = time.getDate() - 1 + "";
      if (format && format.length === 1) {
        return year + format + month + format + date;
      }
      return (
        year +
        (month < 10 ? "0" + month : month) +
        (date < 10 ? "0" + date : date)
      );
    },
  },
};
</script>

<style></style>
