import ToolBar from "@/components/ToolBar";
import UploadExcel from "@/components/UploadExcel";
import ImageUpload from "./ImageUpload";
import ScreenFull from './ScreenFull';
import ThemePicker from './ThemePicker';
import Lang from './Lang';
import TagsView from './TagsView'
export default {
  install(Vue) {
    Vue.component("ToolBar", ToolBar);
    Vue.component("UploadExcel", UploadExcel);
    Vue.component("ImageUpload", ImageUpload); // 注册导入上传组件
    Vue.component('ScreenFull', ScreenFull) // 注册全屏组件
    Vue.component('ThemePicker', ThemePicker)
    Vue.component('Lang', Lang)
    Vue.component('TagsView', TagsView)
  }
};
