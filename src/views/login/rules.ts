const loginRules: ElFormRules = {
  username: [{ required: true, trigger: 'blur', message: '请输入您的电话号码' }],
  password: [{ required: true, trigger: 'blur', message: '请输入您的密码' }],
  code: [{ required: true, trigger: 'change', message: '请输入验证码' }]
};
const smsRules: ElFormRules = {
  phone: [{ required: true, trigger: 'blur', message: '请输入您的电话号码' }],
  code: [{ required: true, trigger: 'blur', message: '请输入您的验证码' }]
};

const regisRules: ElFormRules = {
  phone: [{ required: true, trigger: 'blur', message: '请输入您的电话号码' }],
  password: [{ required: true, trigger: 'blur', message: '请输入您的密码' }],
  code: [{ required: true, trigger: 'blur', message: '请输入您的验证码' }]
};

export { loginRules, regisRules, smsRules };
