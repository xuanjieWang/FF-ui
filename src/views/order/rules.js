const rules = {
  title: [{ required: true, message: '订单标题不能为空', trigger: 'blur' }],
  money: [{ required: true, message: '提成金额不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '订单类型不能为空', trigger: 'blur' }],
  wangwang: [{ required: true, message: '客户旺旺号不能为空', trigger: 'blur' }],
  kf: [{ required: true, message: '对标客服名称不能为空', trigger: 'blur' }],
  sjsName: [{ required: true, message: '设计师姓名不能为空', trigger: 'blur' }],
  sjsPhone: [{ required: true, message: '设计师账号不能为空', trigger: 'blur' }],
  jfTime: [{ required: true, message: '交付时间不能为空', trigger: 'blur' }],
  xdTime: [{ required: true, message: '下单时间不能为空', trigger: 'blur' }]
};

const commonType = [
  {
    label: '好评',
    value: '好评'
  },
  {
    label: '差评',
    value: '差评'
  }
];

const commRules = {
  commonType: [{ required: true, message: '订单类型不能为空', trigger: 'blur' }]
};
export { rules, commonType, commRules };
