<template>
  <div>
    <el-upload
      action="#"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :file-list="fileList"
      :class="{ comput: isComputed }"
      :limit="1"
      :on-change="changeFileList"
      :before-upload="beforeUpload"
      :http-request="upload"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-progress
      v-if="showpercent"
      :percentage="percentage"
      style="width: 200px"
    ></el-progress>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>
<script>
import COS from "cos-js-sdk-v5";
const cos = new COS({
  SecretId: "AKID4xZu0pNZXGitnRoukKehTxB8nBI8gxyi",
  SecretKey: "U8WeV5OQFo68sLXR6UaQ0JL6bokOlshF",
});
console.log(cos);
export default {
  data() {
    return {
      fileList: [
        {
          url: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fup.enterdesk.com%2Fedpic_source%2F30%2F90%2F40%2F309040a0602c672cebc6ab3a1bbbc8cd.jpg&refer=http%3A%2F%2Fup.enterdesk.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1662273483&t=6a1e2a4c238af9953d9550ee75d34e43",
        },
      ],
      dialogImageUrl: "",
      dialogVisible: false,
      percentage: 0,
      showpercent: false,
    };
  },
  computed: {
    isComputed() {
      return this.fileList.length === 1;
    },
  },
  methods: {
    // 进行上传操作
    upload({ file }) {
      //   console.log(params.file)
      if (!file) {
        return;
      }
      this.showpercent = true;
      // 执行上传操作
      cos.putObject(
        {
          Bucket: "123-1313213552", // 存储桶
          Region: "ap-nanjing", // 地域
          Key: file.name, // 文件名
          Body: file, // 要上传的文件对象
          StorageClass: "STANDARD", // 上传的模式类型 直接默认 标准模式即可
          // 上传到腾讯云 =》 哪个存储桶 哪个地域的存储桶 文件  格式  名称 回调
          onProgress: ({ percent }) => {
            this.percentage = percent * 100;
          },
        },
        (err, data) => {
          // data返回数据之后 应该如何处理
          console.log(err || data);
          if (err) {
            return this.$message.error(err?.message || "上传出错");
          }
          this.fileList.forEach((item) => {
            if (item.uid === file.uid) {
              item.url = `http://${data.Location}`;
              item.upload = true;
            }
          });
          setTimeout(() => {
            this.showpercent = false;
            this.percentage = 0;
          }, 2000);
        }
      );
    },
    beforeUpload(file) {
      // 上传的文件对象
      console.log(file);
      const types = ["image/jpeg", "image/gif", "image/bmp", "image/png"];
      if (!types.includes(file.type)) {
        this.$message.error("上传文件类型不符合规范");
        return false;
      }
      const maxSize = 1 * 1024 * 1024; // 1M=1024KB 1KB = 1024B
      if (file.size > maxSize) {
        this.$message.error("上传文件体积过大");
        return false;
      }
    },
    changeFileList(file, fileList) {
      // console.log(fileList);
      // fileList 是最终文件列表
      this.fileList = fileList;
    },
    handleRemove(file, fileList) {
      // console.log(file, fileList);
      this.fileList = this.fileList.filter((item) => item.uid !== file.uid);
      // this.fileList = fileList;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
  },
};
</script>
<style lang="scss" scoped>
.comput {
  ::v-deep .el-upload--picture-card {
    display: none;
  }
}
</style>
