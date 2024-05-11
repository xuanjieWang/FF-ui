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
          <el-form-item label="订单评价" prop="commonType">
            <el-select v-model="queryParams.commonType" placeholder="选择订单评价" clearable style="width: 180px; margin-bottom: 0">
              <el-option v-for="dict in order_common_statu" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="订单编号" prop="id">
            <el-input v-model="queryParams.id" placeholder="请输入订单编号" clearable style="width: 180px; margin-bottom: 0" />
          </el-form-item>
          <el-form-item label="设计师" prop="sjsName">
            <el-input v-model="queryParams.sjsName" placeholder="请输入设计师名称" clearable style="width: 180px; margin-bottom: 0" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </transition>

    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['system:order:add']">新增</el-button>
          </el-col>
          <!-- <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['system:order:remove']"
              >删除</el-button
            >
          </el-col> -->
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['system:order:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="orderList" @selection-change="handleSelectionChange">
        <el-table-column label="序号" align="center" prop="title" />
        <el-table-column label="订单编号" align="center" prop="id" width="180px" />
        <el-table-column label="标题" align="center" prop="title" width="180px" />
        <!-- <el-table-column label="客户旺旺号" align="center" prop="wangwang" width="180px"> </el-table-column> -->
        <el-table-column label="设计师姓名" align="center" prop="sjsName" width="100px"> </el-table-column>
        <el-table-column label="设计师账户" align="center" prop="sjsPhone" width="150px"> </el-table-column>
        <el-table-column label="对标客服" align="center" prop="kf" width="100px" />
        <el-table-column label="提成金额" align="center" prop="money" width="100px" />
        <el-table-column label="订单类型" align="center" prop="type" width="100px" />
        <!-- <el-table-column label="订单状态" align="center" prop="orderStatus" width="100px" /> -->
        <!-- <el-table-column label="结算状态" align="center" prop="jsStatus" width="100px" /> -->
        <!-- <el-table-column label="订单评价" align="center" prop="common" /> -->
        <el-table-column label="下单时间" align="center" prop="xfTime" />
        <!-- <el-table-column label="创建时间" align="center" prop="createTime" /> -->
        <!-- <el-table-column label="更新时间" align="center" prop="updateTime" /> -->
        <el-table-column label="交付时间" align="center" prop="jfTime" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="查看" placement="top">
              <el-button link type="primary" icon="View" @click="handleView(scope.row)" v-hasPermi="['system:order:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:order:edit']"></el-button>
            </el-tooltip>
            <!-- <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:order:remove']"></el-button>
            </el-tooltip> -->
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>

    <!-- 添加或修改【请填写功能名称】对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="900px" append-to-body>
      <el-form ref="orderFormRef" :model="form" :rules="rules" label-width="150px">
        <p class="item">订单信息</p>
        <el-row :gutter="20">
          <el-form-item label="订单编号:" prop="title">
            <el-input v-model="form.title" :disabled="isDisabled" placeholder="" />
          </el-form-item>
          <el-form-item label="订单标题:" prop="title">
            <el-input v-model="form.title" :disabled="isDisabled" placeholder="" />
          </el-form-item>
        </el-row>
        <el-row :gutter="20">
          <el-form-item label="提成金额" prop="money">
            <el-input v-model="form.money" :disabled="isDisabled" placeholder="" />
          </el-form-item>
          <el-form-item label="订单类型" prop="type">
            <el-select v-model="form.type" placeholder="" :disabled="isDisabled" clearable style="width: 250px; margin-bottom: 0">
              <el-option v-for="dict in the_dept" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-row>
        <p class="item">客户信息</p>
        <el-row :gutter="20">
          <el-form-item label="客户旺旺号" prop="title">
            <el-input v-model="form.wagnwang" :disabled="isDisabled" placeholder="" />
          </el-form-item>
          <el-form-item label="对标客服" prop="title">
            <el-input v-model="form.wagnwang" :disabled="isDisabled" placeholder="" />
          </el-form-item>
        </el-row>
        <p class="item">设计师信息</p>
        <el-row :gutter="20">
          <el-form-item label="设计师姓名" prop="title">
            <el-input v-model="form.wagnwang" :disabled="isDisabled" placeholder="" />
          </el-form-item>
          <el-form-item label="设计师账户" prop="title">
            <el-input v-model="form.wagnwang" :disabled="isDisabled" placeholder="" />
          </el-form-item>
        </el-row>
        <p class="item">时间</p>
        <el-row :gutter="20">
          <el-form-item label="下单时间:" prop="jfTime">
            <el-date-picker
              style="width:250px"
              clearable
              v-model="form.jfTime"
              :disabled="isDisabled"
              type="datetime"
              value-format="YYYY-MM-DD HH:mm:ss"
              placeholder=""
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="交付时间:" prop="jfTime">
            <el-date-picker
              style="width:250px"
              clearable
              v-model="form.jfTime"
              :disabled="isDisabled"
              type="datetime"
              value-format="YYYY-MM-DD HH:mm:ss"
              placeholder=""
            >
            </el-date-picker>
          </el-form-item>
        </el-row>
        <el-row :gutter="20">
          <el-form-item label="订单创建时间:" prop="jfTime">
            <el-date-picker
              style="width:250px"
              clearable
              v-model="form.jfTime"
              :disabled="isDisabled"
              type="datetime"
              value-format="YYYY-MM-DD HH:mm:ss"
              placeholder=""
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="订单更新时间:" prop="jfTime">
            <el-date-picker
              style="width:250px"
              clearable
              v-model="form.jfTime"
              :disabled="isDisabled"
              type="datetime"
              value-format="YYYY-MM-DD HH:mm:ss"
              placeholder=""
            >
            </el-date-picker>
          </el-form-item>
        </el-row>
        <p class="item">订单评价</p>
        <el-row :gutter="20">
          <el-form-item label="订单评价" prop="money">
            <el-input v-model="form.money" :disabled="isDisabled" placeholder="" />
          </el-form-item>
        </el-row>
        <el-row :gutter="20">
          <el-form-item label="订单评论" prop="jfTime">
            <el-input v-model="form.money" type="textarea" style="width: 540px; height: 100px;" :disabled="isDisabled" placeholder="" />
          </el-form-item>
        </el-row>
      </el-form>
      <template #footer v-if="!isDisabled">
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {ref,reactive,getCurrentInstance,toRefs,onMounted} from 'vue'
import { listOrder, getOrder, delOrder, addOrder, updateOrder } from '@/api/order';
const { proxy } = getCurrentInstance()
const { the_dept,order_push_statu,order_balance_statu,order_common_statu } = toRefs(proxy?.useDict("the_dept","order_push_statu","order_balance_statu","order_common_statu"));
import { useUserStore } from '@/store/modules/user';
const userStore = useUserStore();
import {rules} from '../rules'

const orderList = ref([])
const buttonLoading = ref(false);
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
  },

});

const { queryParams, form } = toRefs(data);


/** 提交按钮 */
const submitForm = () => {
  orderFormRef.value?.validate(async (valid) => {
    if (valid) {
      buttonLoading.value = true;

      let info = ""
      if (form.value.id) {
        info = "修改订单信息成功！"
        // form.value.updateUser = userStore.name
        // await updateOrder(form.value).then(() =>  buttonLoading.value = false);
      } else {
        info = "添加订单成功！"
        form.value.kf = userStore.name  // 添加对应的客服信息
        await addOrder(form.value).then(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess(info+"成功!");
      dialog.visible = false;
      buttonLoading.value = false
      await getList();
    }
  });
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('system/order/export', {
    ...queryParams.value
  }, `order_${new Date().getTime()}.xlsx`)
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

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
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

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "新增订单";
}

const isDisabled = ref(false)

/** 修改按钮操作 */
const handleUpdate = async (row) => {
  isDisabled.value = false;
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getOrder(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改订单";
}

/** 修改按钮操作 */
const handleView = async (row) => {
  isDisabled.value = true;
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getOrder(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "订单详情";
}
</script>
<style scoped>
.el-input {
  width: 250px;
}
.item{
  margin: 0px 20px 15px 20px;
  font-size: 16px;
  color: black;
  font-weight: 600;
}
:deep(.el-picker-width100pr .el-input__wrapper){
  width: 100% !important;
}
</style>
