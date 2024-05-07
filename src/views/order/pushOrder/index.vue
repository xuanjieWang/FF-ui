<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="发布人" prop="pushUser">
            <el-input v-model="queryParams.pushUser" placeholder="请输入发布人" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="发布内容" prop="text">
            <el-input v-model="queryParams.text" placeholder="请输入发布内容" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="发布金额" prop="money">
            <el-select v-model="form.type" placeholder="请选择发布金额" clearable style="width: 180px; margin-bottom: 0">
              <el-option v-for="dict in the_order_money" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="限制时间" prop="linitTime">
            <el-date-picker clearable v-model="queryParams.linitTime" type="date" value-format="YYYY-MM-DD" placeholder="请选择限制时间" />
          </el-form-item>
          <el-form-item label="需要论文" prop="isPaper">
            <el-switch v-model="queryParams.isPaper" :active-value="'1'" :inactive-value="'0'" />
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
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['system:order:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['system:order:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['system:order:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="orderList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="序号" align="center" prop="title" />
        <el-table-column label="订单号" align="center" prop="title" />
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
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:order:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:order:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改【请填写功能名称】对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="650px" append-to-body>
      <el-form ref="orderFormRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="订单标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入订单标题" />
        </el-form-item>
        <el-form-item label="发布内容" prop="text">
          <el-input v-model="form.text" rows="10" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="订单类型" prop="orderPayType">
          <el-select v-model="form.orderPayType" placeholder="请选择订单类型" clearable style="width: 180px; margin-bottom: 0">
            <el-option v-for="dict in the_order_pay_type" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="需要论文" prop="isPaper">
          <el-switch v-model="form.isPaper" :active-value="'1'" :inactive-value="'0'" />
        </el-form-item>
        <el-form-item label="开发语言" prop="type">
          <el-select v-model="form.type" placeholder="请选择开发语言" clearable style="width: 180px; margin-bottom: 0">
            <el-option v-for="dict in the_order_type" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="发布金额(元)" prop="money">
          <el-input v-model="form.money" placeholder="请输入发布金额" />
        </el-form-item>
        <el-form-item label="限制时间" prop="linitTime">
          <el-date-picker clearable v-model="form.linitTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择限制时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <template #footer>
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
import { listOrder, getOrder, delOrder, addOrder, updateOrder } from '../../../api/system/order/index';
const { proxy } = getCurrentInstance()
const { the_order_type,the_order_money,the_order_pay_type } = toRefs(proxy?.useDict("the_order_type","the_order_money","the_order_pay_type"));
import { useUserStore } from '@/store/modules/user';
const userStore = useUserStore();
import {rules} from '../rules'

// const orderList = ref<OrderVO[]>([]);
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

const initFormData = {
  id: undefined,
  creatTime: undefined,
  pushUser: undefined,
  work: undefined,
  text: undefined,
  money: undefined,
  linitTime: undefined,
  type: undefined,
  isPaper: undefined,
  isRelease: undefined,
  title: undefined,
  updateUser: undefined,
  orderPayType: undefined
}
const data = reactive({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    title: undefined,//订单标题
    orderPayType: undefined,
    creatTime: undefined,
    pushUser: undefined,
    money: undefined,
    linitTime: undefined,
    type: undefined,
    isPaper: undefined,
    isRelease: undefined, //状态
    params: {
    }
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
        form.value.updateUser = userStore.name
        await updateOrder(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        // 需要添加发布人
        info = "添加订单成功！"
        console.log(userStore+"11111");
        form.value.pushUser =userStore.name
        await addOrder(form.value).finally(() =>  buttonLoading.value = false);
        console.log(form.value);
      }
      proxy?.$modal.msgSuccess(info+"成功!");
      dialog.visible = false;
      await getList();
    }
  });
}


function parseIsPaper(data){
  return data == '1'? '需要':'不需要'
}
/** 删除按钮操作 */
const handleDelete = async (row) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除【请填写功能名称】编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delOrder(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
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
  console.log(res);
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
  dialog.title = "添加订单";
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
