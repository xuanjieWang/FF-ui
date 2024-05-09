const rules = {
  qq: [{ required: true, trigger: 'blur', message: 'QQ号码不能为空' }],
  qqMail: [{ required: true, trigger: 'blur', message: 'QQ邮箱不能为空' }],
  zfb: [{ required: true, trigger: 'blur', message: '请填写您本人的支付宝账号' }],
  name: [{ required: true, trigger: 'blur', message: ' 请填写您的真实姓名' }],
  work: [{ required: true, trigger: 'blur', message: '请填写您的在职工作' }]
};

export { rules };
