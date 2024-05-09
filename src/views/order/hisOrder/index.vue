<template>
  <div class="p-2">
    <el-card shadow="never">
      <el-table v-loading="loading" :data="orderList">
        <el-table-column label="标题" align="center" prop="title" />
        <el-table-column label="发布内容" align="center" prop="text" />
        <el-table-column label="论文" align="center" prop="isPaper">
          <template v-slot="scope">
            <span>{{ parseIsPaper(scope.row.isPaper) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="发布金额" align="center" prop="money" />
        <el-table-column label="开发语言" align="center" prop="type" />
        <el-table-column label="限制时间" align="center" prop="linitTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.linitTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="发布人" align="center" prop="pushUser" />
        <el-table-column label="接收人" align="center" prop="work" />
        <el-table-column label="发布状态" align="center" prop="isRelease" />
        <el-table-column label="创建时间" align="center" prop="creatTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.creatTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
  </div>
</template>

<script setup name="Order" lang="ts">
import {ref,reactive,getCurrentInstance,toRefs,onMounted} from 'vue'
import { listOrder } from '../../../api/system/order/index';
import { OrderVO, OrderQuery } from '../../../api/system/order/types';
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const orderList = ref<OrderVO[]>([]);
const loading = ref(true);
const total = ref(0);

const data = reactive<PageData<OrderQuery>>({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
  },

});

const { queryParams } = toRefs(data);

function parseIsPaper(data: string){
  return data == '1'? '需要':'不需要'
}

onMounted(() => {
  getList();
});
/** 查询【请填写功能名称】列表 */
const getList = async () => {
  loading.value = true;
  const res = await listOrder(queryParams.value);
  orderList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}
</script>
../../../api/order/index../../../api/order/types
