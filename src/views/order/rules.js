const rules = {
  id: [{ required: true, message: '主键不能为空', trigger: 'blur' }],
  creatTime: [{ required: true, message: '创建时间不能为空', trigger: 'blur' }],
  pushUser: [{ required: true, message: '发布人不能为空', trigger: 'blur' }],
  work: [{ required: true, message: '接收人不能为空', trigger: 'blur' }],
  text: [{ required: true, message: '发布信息不能为空', trigger: 'blur' }],
  money: [{ required: true, message: '发布金额不能为空', trigger: 'blur' }],
  linitTime: [{ required: true, message: '限制时间不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '开发语言不能为空', trigger: 'change' }],
  isPaper: [{ required: true, message: '是否需要论文不能为空', trigger: 'blur' }],
  isRelease: [{ required: true, message: '发布状态不能为空', trigger: 'blur' }]
};

export { rules };
