const rules = {
  title: [{ required: true, message: '订单标题不能为空', trigger: 'blur' }],
  wangwang: [{ required: true, message: '客户旺旺号不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '订单类型不能为空', trigger: 'blur' }],
  sjsName: [{ required: true, message: '设计师姓名不能为空', trigger: 'blur' }],
  sjsPhone: [{ required: true, message: '设计师电话不能为空', trigger: 'blur' }],
  jfTime: [{ required: true, message: '交付时间不能为空', trigger: 'blur' }],
  money: [{ required: true, message: '提成金额不能为空', trigger: 'blur' }]
};

export { rules };
