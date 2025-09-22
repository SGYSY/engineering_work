export const roles = [
  {
    id: "student",
    label: "学生端",
    routes: [
      { id: "job-list", label: "职位列表" },
      { id: "job-detail", label: "职位详情" },
      { id: "applications", label: "我的投递" },
      { id: "resume", label: "简历中心" },
      { id: "activities", label: "活动列表" },
      { id: "notifications", label: "通知中心" }
    ]
  },
  {
    id: "hr",
    label: "HR端",
    routes: [
      { id: "job-management", label: "职位管理" },
      { id: "candidate-panel", label: "候选人处理" },
      { id: "campus-events", label: "校招活动" }
    ]
  },
  {
    id: "teacher",
    label: "教师端",
    routes: [
      { id: "activity-review", label: "活动管理" },
      { id: "employment-dashboard", label: "就业看板" },
      { id: "enterprise-review", label: "企业入校考核" }
    ]
  },
  {
    id: "admin",
    label: "管理员端",
    routes: [
      { id: "user-role", label: "用户角色管理" },
      { id: "operation-log", label: "操作日志" },
      { id: "teacher-admin", label: "教师端管理" },
      { id: "hr-admin", label: "HR端管理" }
    ]
  }
];

const studentJobs = [
  {
    id: "job001",
    title: "前端开发工程师",
    company: "百度科技有限责任公司",
    industry: "互联网",
    city: "北京",
    salary: "18k-25k",
    education: "本科",
    deadline: "2025-03-31",
    publishDate: "2025-02-12",
    tags: ["React", "数据可视化", "TypeScript"],
    description:
      "负责智慧就业平台前端开发，参与可视化组件与交互设计，实现高性能数据展示。",
    requirements: [
      "熟练掌握 React/Vue 等前端框架，具备组件化开发经验",
      "了解 ECharts/D3 等数据可视化技术，具备项目落地经验",
      "具备良好的产品意识与跨团队协作能力"
    ],
    favorite: false
  },
  {
    id: "job002",
    title: "数据分析实习生",
    company: "阿里巴巴集团",
    industry: "大数据",
    city: "杭州",
    salary: "200/天",
    education: "本科",
    deadline: "2025-04-15",
    publishDate: "2025-02-10",
    tags: ["SQL", "Python", "BI 报表"],
    description:
      "负责高校就业数据清洗与分析，构建统计模型并输出洞察报告。",
    requirements: [
      "统计、计算机或数学相关专业背景",
      "熟练掌握 SQL 和 Python 数据分析库",
      "具备良好的沟通能力与业务洞察力"
    ],
    favorite: false
  },
  {
    id: "job003",
    title: "算法研究员",
    company: "腾讯科技有限公司",
    industry: "人工智能",
    city: "深圳",
    salary: "28k-35k",
    education: "硕士",
    deadline: "2025-04-30",
    publishDate: "2025-02-08",
    tags: ["NLP", "推荐系统", "深度学习"],
    description:
      "参与智能推荐算法研发，负责模型迭代与实验评估，支撑就业匹配业务。",
    requirements: [
      "熟悉主流深度学习框架，有 NLP/推荐经验",
      "具备扎实的算法基础与工程能力",
      "具有跨团队沟通协作能力"
    ],
    favorite: false
  }
];

const studentApplications = [
  {
    id: "apply001",
    jobId: "job001",
    jobTitle: "前端开发工程师",
    company: "百度科技有限责任公司",
    submitDate: "2025-02-13",
    status: "面试邀约",
    progress: [
      { time: "2025-02-13 09:20", label: "投递成功", remark: "收到系统确认" },
      { time: "2025-02-14 15:30", label: "简历已阅", remark: "HR 已查阅简历" },
      { time: "2025-02-15 11:00", label: "面试邀约", remark: "安排 2 月 20 日初面" }
    ],
    messages: [
      { sender: "HR - 王子棋", content: "请确认 2 月 20 日上午 10 点面试安排。" }
    ],
    attachments: [
      { name: "作品集.pdf", size: "2.4MB" }
    ]
  },
  {
    id: "apply002",
    jobId: "job002",
    jobTitle: "数据分析实习生",
    company: "阿里巴巴集团",
    submitDate: "2025-02-11",
    status: "简历筛选",
    progress: [
      { time: "2025-02-11 10:12", label: "投递成功", remark: "收到系统确认" },
      { time: "2025-02-13 18:40", label: "简历筛选", remark: "等待 HR 审核" }
    ],
    messages: [],
    attachments: []
  }
];

const studentResume = {
  completeness: 82,
  steps: [
    {
      id: "basic",
      title: "基本信息",
      fields: [
        { id: "name", label: "姓名", value: "张同学" },
        { id: "email", label: "邮箱", value: "zhang@example.com" },
        { id: "phone", label: "电话", value: "138-0000-1111" },
        { id: "target", label: "求职意向", value: "前端开发" }
      ]
    },
    {
      id: "education",
      title: "教育背景",
      fields: [
        {
          id: "bachelor",
          label: "本科",
          value: "北京航空航天大学 - 计算机科学 (2021-2025)"
        }
      ]
    },
    {
      id: "projects",
      title: "项目经历",
      fields: [
        {
          id: "project1",
          label: "智慧就业可视化平台",
          value: "负责前端架构、数据可视化与组件封装"
        }
      ]
    },
    {
      id: "skills",
      title: "技能特长",
      fields: [
        { id: "languages", label: "编程语言", value: "JavaScript / TypeScript / Python" },
        { id: "frameworks", label: "框架", value: "React / Vue / Node.js" }
      ]
    },
    {
      id: "awards",
      title: "奖项证书",
      fields: [
        { id: "award1", label: "全国大学生创新创业", value: "省级一等奖" }
      ]
    }
  ],
  attachments: [
    { id: "resume-pdf", name: "个人简历.pdf", updatedAt: "2025-02-12" },
    { id: "cet6", name: "英语六级证书.pdf", updatedAt: "2025-01-20" }
  ]
};

const studentActivities = [
  {
    id: "act001",
    type: "宣讲会",
    title: "百度2025春招宣讲",
    date: "2025-02-25 14:00",
    location: "就业中心报告厅 A1",
    status: "已报名",
    guide: "请提前 30 分钟签到，凭学生证入场"
  },
  {
    id: "act002",
    type: "双选会",
    title: "华南互联网企业双选会",
    date: "2025-03-05 09:00",
    location: "体育馆主场馆",
    status: "可报名",
    guide: "需提前在线提交报名表，现场凭二维码入场"
  }
];

const studentNotifications = [
  {
    id: "notify001",
    category: "系统消息",
    title: "账号实名认证通过",
    time: "2025-02-12 10:00",
    read: true
  },
  {
    id: "notify002",
    category: "投递状态",
    title: "百度科技 - 面试邀约",
    time: "2025-02-15 11:00",
    read: false
  },
  {
    id: "notify003",
    category: "活动提醒",
    title: "华南互联网企业双选会报名即将截止",
    time: "2025-02-20 09:00",
    read: false
  }
];

const hrJobs = [
  {
    id: "job001",
    title: "前端开发工程师",
    type: "社招",
    status: "已上线",
    exposure: 3560,
    views: 980,
    applicants: 42,
    publishDate: "2025-02-12"
  },
  {
    id: "job002",
    title: "数据分析实习生",
    type: "实习",
    status: "待上线",
    exposure: 1280,
    views: 320,
    applicants: 18,
    publishDate: "2025-02-10"
  }
];

const hrCandidates = {
  stages: [
    { id: "new", label: "未处理" },
    { id: "reviewed", label: "已阅" },
    { id: "interview", label: "邀约面试" },
    { id: "offer", label: "发放 Offer" },
    { id: "reject", label: "淘汰" }
  ],
  list: [
    {
      id: "cand001",
      name: "张同学",
      job: "前端开发工程师",
      stage: "reviewed",
      summary: "React + 数据可视化项目经验",
      updatedAt: "2025-02-15",
      resume:
        "就读于北京航空航天大学，主导智慧就业平台前端方案，熟悉 React/Vue。"
    },
    {
      id: "cand002",
      name: "李同学",
      job: "数据分析实习生",
      stage: "new",
      summary: "机器学习与统计建模背景",
      updatedAt: "2025-02-14",
      resume:
        "具备丰富的数据分析竞赛经验，熟悉 Python、SQL 和可视化工具。"
    }
  ],
  templates: [
    {
      id: "tpl001",
      name: "初面邀约模板",
      content: "您好，我们对您的简历很感兴趣，邀请您参加本周的线上初试..."
    }
  ]
};

const hrCampusEvents = {
  calendar: [
    {
      date: "2025-02-25",
      title: "百度春招宣讲",
      status: "待确认"
    },
    {
      date: "2025-03-05",
      title: "互联网企业双选会",
      status: "已报名"
    }
  ],
  rules: [
    "报名需提前两周提交企业介绍资料",
    "现场需遵守学校搭建与宣传规范",
    "展位统一尺寸 3m x 3m"
  ],
  registrationForm: {
    company: "百度科技有限责任公司",
    contact: "王子棋",
    phone: "138-1234-5678",
    boothType: "双开口展位",
    participants: 3,
    status: "待审",
    remark: "需要靠近主入口的位置"
  }
};

const teacherActivities = [
  {
    id: "teach-act-1",
    title: "2025 届春季双选会",
    date: "2025-03-05",
    location: "体育馆主场",
    capacity: 80,
    registered: 65,
    status: "审核中"
  },
  {
    id: "teach-act-2",
    title: "智能制造企业专场宣讲",
    date: "2025-03-10",
    location: "就业中心 B201",
    capacity: 120,
    registered: 40,
    status: "已通过"
  }
];

const teacherApprovals = [
  {
    id: "approval-1",
    company: "腾讯科技有限公司",
    requestAt: "2025-02-12",
    type: "宣讲会",
    boothNeed: "双展位",
    status: "待审核"
  }
];

const teacherExports = [
  {
    id: "export-1",
    label: "导出双选会报名名单",
    fileName: "2025_spring_fair.xlsx"
  }
];

const teacherCheckin = {
  qrHint: "扫码签到：2025春季双选会",
  qrPlaceholder: "二维码占位"
};

const employmentDashboard = {
  filters: {
    year: ["2023", "2024", "2025"],
    college: ["计算机学院", "人工智能学院", "经济管理学院"],
    major: ["计算机科学", "软件工程", "人工智能", "信息管理"]
  },
  industryDistribution: [
    { name: "互联网", value: 35 },
    { name: "制造业", value: 20 },
    { name: "金融", value: 15 },
    { name: "教育", value: 10 },
    { name: "其他", value: 20 }
  ],
  jobCategory: [
    { name: "研发", value: 40 },
    { name: "产品运营", value: 25 },
    { name: "数据分析", value: 20 },
    { name: "职能支持", value: 15 }
  ],
  regionFlow: [
    { name: "北京", value: 30 },
    { name: "上海", value: 25 },
    { name: "深圳", value: 20 },
    { name: "杭州", value: 15 },
    { name: "其他", value: 10 }
  ]
};

const enterpriseAudit = [
  {
    id: "audit-1",
    company: "华为技术有限公司",
    submitAt: "2025-02-10",
    materials: ["营业执照.pdf", "法人身份证.pdf", "安全承诺书.pdf"],
    status: "待审核",
    history: [
      { date: "2024-09-20", result: "通过" },
      { date: "2023-08-12", result: "通过" }
    ],
    blacklist: false
  },
  {
    id: "audit-2",
    company: "未来教育科技有限公司",
    submitAt: "2025-02-05",
    materials: ["营业执照.pdf", "安全承诺书.pdf"],
    status: "驳回",
    history: [{ date: "2024-05-18", result: "驳回" }],
    blacklist: true
  }
];

const adminUsers = [
  {
    id: "user001",
    name: "张老师",
    role: "教师管理员",
    department: "计算机学院",
    email: "zhang@univ.edu",
    status: "启用"
  },
  {
    id: "user002",
    name: "王 HR",
    role: "企业HR",
    department: "百度科技",
    email: "wang.hr@baidu.com",
    status: "启用"
  },
  {
    id: "user003",
    name: "李管理员",
    role: "系统管理员",
    department: "学生就业中心",
    email: "admin@career.edu",
    status: "停用"
  }
];

const adminRoles = [
  { id: "role01", name: "学生", desc: "访问学生端页面" },
  { id: "role02", name: "教师", desc: "管理活动与审核" },
  { id: "role03", name: "HR", desc: "职位与候选人管理" },
  { id: "role04", name: "系统管理员", desc: "拥有全局管理权限" }
];

const adminLogs = [
  {
    id: "log001",
    actor: "李管理员",
    action: "创建活动审批单",
    target: "2025春季双选会",
    time: "2025-02-14 09:32",
    ip: "10.2.18.36"
  },
  {
    id: "log002",
    actor: "王 HR",
    action: "发布职位",
    target: "前端开发工程师",
    time: "2025-02-12 14:10",
    ip: "10.2.19.21"
  }
];

export const initialState = {
  student: {
    jobs: studentJobs,
    applications: studentApplications,
    resume: studentResume,
    activities: studentActivities,
    notifications: studentNotifications
  },
  hr: {
    jobs: hrJobs,
    candidates: hrCandidates,
    campusEvents: hrCampusEvents
  },
  teacher: {
    activities: teacherActivities,
    approvals: teacherApprovals,
    exports: teacherExports,
    checkin: teacherCheckin,
    employmentDashboard,
    enterpriseAudit
  },
  admin: {
    users: adminUsers,
    roles: adminRoles,
    logs: adminLogs
  }
};

export const jobFilters = {
  industries: ["互联网", "信息技术", "人工智能", "大数据", "新能源"],
  cities: ["北京", "上海", "杭州", "深圳", "广州"],
  salaries: ["6k-10k", "10k-15k", "15k-20k", "20k+", "日薪200+"],
  education: ["大专", "本科", "硕士", "博士"]
};

export function cloneInitialState() {
  return JSON.parse(JSON.stringify(initialState));
}
