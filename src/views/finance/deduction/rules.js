const rules = {
  money: [{ required: true, message: '扣款金额不能为空', trigger: 'blur' }],
  sjsName: [{ required: true, message: '设计师姓名不能为空', trigger: 'blur' }],
  message: [{ required: true, message: '扣款原因不能为空', trigger: 'blur' }]
}
export { rules }
