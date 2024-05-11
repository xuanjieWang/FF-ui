<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="提交状态" prop="orderStatus">
            <el-select v-model="queryParams.orderStatus" placeholder="选择订单提交状态" clearable style="width: 180px; margin-bottom: 0">
              <el-option v-for="dict in order_push_statu" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="结算状态" prop="jsStatus">
            <el-select v-model="queryParams.jsStatus" placeholder="选择订单结算状态" clearable style="width: 180px; margin-bottom: 0">
              <el-option v-for="dict in order_balance_statu" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="订单编号" prop="id">
            <el-input v-model="queryParams.id" placeholder="请输入订单编号" clearable style="width: 180px; margin-bottom: 0" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </transition>

    <el-card shadow="never">
      <el-table v-loading="loading" :data="orderList" @selection-change="handleSelectionChange">
        <el-table-column label="序号" align="center" prop="title" />
        <el-table-column label="订单编号" align="center" prop="id" width="180px" />
        <el-table-column label="标题" align="center" prop="title" width="200px" />
        <el-table-column label="对标客服" align="center" prop="kf" width="100px" />
        <el-table-column label="提成金额" align="center" prop="money" width="100px" />
        <el-table-column label="订单类型" align="center" prop="type" width="100px" />
        <!-- <el-table-column label="订单状态" align="center" prop="orderStatus" width="100px" /> -->
        <el-table-column label="结算状态" align="center" prop="jsStatus" width="100px" />
        <!-- <el-table-column label="订单评价" align="center" prop="common" /> -->
        <el-table-column label="下单时间" align="center" prop="xfTime" />
        <!-- <el-table-column label="创建时间" align="center" prop="createTime" /> -->
        <!-- <el-table-column label="更新时间" align="center" prop="updateTime" /> -->
        <el-table-column label="交付时间" align="center" prop="jfTime" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="查看" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:order:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="评价" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:order:edit']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
  </div>
</template>

<script setup>
import {ref,reactive,getCurrentInstance,toRefs,onMounted} from 'vue'
import { listOrder, getOrder } from '@/api/order';
const { proxy } = getCurrentInstance()
const { order_push_statu,order_balance_statu } = toRefs(proxy?.useDict("the_dept","order_push_statu","order_balance_statu","order_common_statu"));
import { useUserStore } from '@/store/modules/user';
const userStore = useUserStore();

const orderList = ref([])
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref();
const orderFormRef = ref();

const dialog = reactive({
  visible: false,
  title: ''
});

const initFormData = {}
const data = reactive({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userId: '',
  },

});

const { queryParams, form } = toRefs(data);
onMounted(() => {
  getList();
});

/** 查询【请填写功能名称】列表 */
const getList = async () => {
  loading.value = true;
  // console.log(userStore.userId);
  queryParams.value.userId = userStore.userId
  const res = await listOrder(queryParams.value);
  orderList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}
/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  orderFormRef.value?.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
}

/** 多选框选中数据 */
const handleSelectionChange = (selection) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 修改按钮操作 */
const handleUpdate = async (row) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getOrder(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改订单";
}
</script>
<style scoped>
.el-input {
  width: 300px;
}
</style>
@/api/order/index
