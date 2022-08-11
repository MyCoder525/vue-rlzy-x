<template>
  <div>
    <el-row type="flex" justify="end">
      <el-select v-model="currentYear" size="small" style="width: 120px">
        <el-option v-for="item in yearList" :key="item" :label="`${item}年`" :value="item"></el-option>
      </el-select>
      <el-select v-model="currentMonth" size="small" style="width: 120px;margin-left:10px">
        <el-option v-for="i in 12" :key="i" :label="`${i}月`" :value="i"></el-option>
      </el-select>
    </el-row>
    <el-calendar v-model="value">
      <template #dateCell="{ data: { day }, date }">
        <div class="dateCell">
          <span>{{ day | filterDay }}</span>
          <span v-if="getDay(date)" class="rest">休</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  // 过滤器
  filters: {
    filterDay(value) {
      const day = value.split('-')[2]
      return day.startsWith('0') ? day.substr(1) : day
    }
  },
  props: {
    currentDate: {
      type: Date,
      default: () => new Date()
    }
  },
  data() {
    return {
      // value: new Date(),
      currentMonth: null,
      currentYear: null,
      yearList: []

    }
  },
  computed: {
    // value() {
    //   return new Date(this.currentYear, this.currentMonth - 1)
    // }
    value: {
      // 
      get() {
        return new Date(this.currentYear, this.currentMonth - 1)
      },
      set(val) {
        this.currentYear = val.getFullYear()
        this.currentMonth = val.getMonth() + 1
      }
    }
  },
  created() {
    // 获取年份列表
    this.currentMonth = this.currentDate.getMonth() + 1;
    this.currentYear = this.currentDate.getFullYear();
    this.yearList = Array.from(Array(11), (item, index) => {
      return this.currentYear + index - 5
    });
  },
  methods: {
    // 获取当前日期是否为休息日
    getDay(date) {
      const day = date.getDay();
      return [0, 6].includes(day);
    }
  }
}
</script>

<style   scoped lang="scss">
::v-deep .el-calendar__header {
  display: none
}

.dateCell {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .rest {
    color: #fff;
    border-radius: 50%;
    background: rgb(250, 124, 77);
    width: 20px;
    height: 20px;
    line-height: 20px;
    display: inline-block;
    font-size: 12px;
    margin-left: 10px;
    line-height: 20px;
    text-align: center;
  }
}
</style>
