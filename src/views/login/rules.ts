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
  dept: [{ required: true, trigger: 'blur', message: '请选择您的部门' }],
  inviteCode: [{ required: true, trigger: 'blur', message: '请输入邀请码' }],
  code: [{ required: true, trigger: 'blur', message: '请输入您的验证码' }]
};

const the_dept = [
  { label: '软件开发', value: '软件开发' },
  { label: '视频剪辑', value: '视频剪辑' },
  { label: '机械设计', value: '机械设计' },
  { label: 'PPT制作', value: 'PPT制作' },
  { label: 'CAD设计', value: 'CAD设计' },
  { label: '3D建模', value: '3D建模' }
];

export { loginRules, regisRules, smsRules, the_dept };
