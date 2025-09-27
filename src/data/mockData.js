export const roles = [
  {
    id: "student",
    label: "Student",
    routes: [
      { id: "job-list", label: "Job List" },
      { id: "job-detail", label: "Job Detail" },
      { id: "applications", label: "My Applications" },
      { id: "resume", label: "Resume Center" },
      { id: "activities", label: "Activities" },
      { id: "notifications", label: "Notifications" }
    ]
  },
  {
    id: "hr",
    label: "HR",
    routes: [
      { id: "job-management", label: "Job Management" },
      { id: "candidate-panel", label: "Candidate Panel" },
      { id: "campus-events", label: "Campus Events" }
    ]
  },
  {
    id: "teacher",
    label: "Teacher",
    routes: [
      { id: "activity-review", label: "Activity Management" },
      { id: "employment-dashboard", label: "Employment Dashboard" },
      { id: "enterprise-review", label: "Enterprise Admission Review" }
    ]
  },
  {
    id: "admin",
    label: "Admin",
    routes: [
      { id: "user-role", label: "User Roles" },
      { id: "operation-log", label: "Operation Log" },
      { id: "teacher-admin", label: "Teacher Admin" },
      { id: "hr-admin", label: "HR Admin" }
    ]
  },
  {
    id: "notify004",
    category: "Resume Center",
    title: "Portfolio feedback available",
    time: "2025-02-22 15:20",
    read: false
  },
  {
    id: "notify005",
    category: "Activity Reminder",
    title: "Counselor shared interview prep tips",
    time: "2025-02-23 08:30",
    read: false
  }
];

const accounts = [
  {
    id: "acct-student",
    username: "student",
    password: "student123",
    role: "student",
    displayName: "Alex Zhang",
    disabled: false,
    userId: null
  },
  {
    id: "acct-hr",
    username: "hr",
    password: "hr123",
    role: "hr",
    displayName: "Wang (HR)",
    disabled: false,
    userId: "user002"
  },
  {
    id: "acct-hr2",
    username: "hr2",
    password: "hr456",
    role: "hr",
    displayName: "Liu (Campus HR)",
    disabled: false,
    userId: "user005"
  },
  {
    id: "acct-teacher",
    username: "teacher",
    password: "teacher123",
    role: "teacher",
    displayName: "Professor Zhang",
    disabled: false,
    userId: "user001"
  },
  {
    id: "acct-admin",
    username: "admin",
    password: "admin123",
    role: "admin",
    displayName: "Admin Li",
    disabled: false,
    userId: "user003"
  },
  {
    id: "notify004",
    category: "Resume Center",
    title: "Portfolio feedback available",
    time: "2025-02-22 15:20",
    read: false
  },
  {
    id: "notify005",
    category: "Activity Reminder",
    title: "Counselor shared interview prep tips",
    time: "2025-02-23 08:30",
    read: false
  }
];

const studentJobs = [
  {
    id: "job001",
    title: "Frontend Engineer",
    company: "Baidu Technology Co., Ltd.",
    industry: "Internet",
    city: "Beijing",
    salary: "18k-25k",
    education: "Bachelor",
    deadline: "2025-03-31",
    publishDate: "2025-02-12",
    tags: ["React", "Data Visualization", "TypeScript"],
    description:
      "Own the employment analytics front-end, craft interactive visual components, and deliver high-performance data experiences.",
    requirements: [
      "Proficient with React/Vue and component-driven development",
      "Hands-on experience with ECharts/D3 or similar visualization stacks",
      "Strong product mindset and cross-team collaboration skills"
    ],
    favorite: false
  },
  {
    id: "job002",
    title: "Data Analytics Intern",
    company: "Alibaba Group",
    industry: "Big Data",
    city: "Hangzhou",
    salary: "200/day",
    education: "Bachelor",
    deadline: "2025-04-15",
    publishDate: "2025-02-10",
    tags: ["SQL", "Python", "BI Reports"],
    description:
      "Clean and analyze campus employment data, build statistical models, and deliver insight reports.",
    requirements: [
      "Background in statistics, computer science, or mathematics",
      "Skilled with SQL and Python data analysis libraries",
      "Strong communication and business insight"
    ],
    favorite: false
  },
  {
    id: "job003",
    title: "Algorithm Researcher",
    company: "Tencent Technology Co., Ltd.",
    industry: "Artificial Intelligence",
    city: "Shenzhen",
    salary: "28k-35k",
    education: "Master",
    deadline: "2025-04-30",
    publishDate: "2025-02-08",
    tags: ["NLP", "Recommendation", "Deep Learning"],
    description:
      "Drive intelligent recommendation R&D, iterate models, and evaluate experiments to power job matching.",
    requirements: [
      "Experienced with mainstream deep learning frameworks and NLP/recommendation systems",
      "Solid algorithm foundations and engineering capability",
      "Excellent cross-team communication"
    ],
    favorite: false
  },
  {
    id: "job004",
    title: "Career Services Product Manager",
    company: "ByteDance Education",
    industry: "Information Technology",
    city: "Shanghai",
    salary: "22k-30k",
    education: "Bachelor",
    deadline: "2025-05-10",
    publishDate: "2025-02-18",
    tags: ["Product", "User Research", "Data Insights"],
    description:
      "Design features for university employment platforms, collaborate with counselors, and drive data-informed iterations.",
    requirements: [
      "3+ internship experiences in product or operations",
      "Ability to translate qualitative feedback into product requirements",
      "Comfortable presenting roadmaps to stakeholders"
    ],
    favorite: false
  },
  {
    id: "job005",
    title: "Employment Data Visualization Engineer",
    company: "JD Smart Campus",
    industry: "Big Data",
    city: "Nanjing",
    salary: "15k-22k",
    education: "Bachelor",
    deadline: "2025-05-30",
    publishDate: "2025-02-20",
    tags: ["ECharts", "Dashboard", "Storytelling"],
    description:
      "Build dashboards that tell the story of student employment outcomes across provinces and majors.",
    requirements: [
      "Proficient with at least one visualization library",
      "Experience working with large datasets and REST APIs",
      "A portfolio demonstrating interaction design sense"
    ],
    favorite: false
  },
  {
    id: "notify004",
    category: "Resume Center",
    title: "Portfolio feedback available",
    time: "2025-02-22 15:20",
    read: false
  },
  {
    id: "notify005",
    category: "Activity Reminder",
    title: "Counselor shared interview prep tips",
    time: "2025-02-23 08:30",
    read: false
  }
];

const studentApplications = [
  {
    id: "apply001",
    jobId: "job001",
    jobTitle: "Frontend Engineer",
    company: "Baidu Technology Co., Ltd.",
    candidateName: "Alex Zhang",
    submitDate: "2025-02-13",
    status: "Interview Invite",
    progress: [
      { time: "2025-02-13 09:20", label: "Submitted", remark: "System confirmation received" },
      { time: "2025-02-14 15:30", label: "Resume Reviewed", remark: "HR viewed the resume" },
      { time: "2025-02-15 11:00", label: "Interview Invite", remark: "Scheduled for Feb 20, 10:00" }
    ],
    messages: [
      { sender: "HR - Ziqi Wang", content: "Please confirm the interview on Feb 20 at 10:00." }
    ],
    attachments: [
      { id: "apply001-att-portfolio", name: "Portfolio.pdf", size: "2.4MB", type: "application/pdf" }
    ]
  },
  {
    id: "apply002",
    jobId: "job002",
    jobTitle: "Data Analytics Intern",
    company: "Alibaba Group",
    candidateName: "Alex Zhang",
    submitDate: "2025-02-11",
    status: "Resume Screening",
    progress: [
      { time: "2025-02-11 10:12", label: "Submitted", remark: "System confirmation received" },
      { time: "2025-02-13 18:40", label: "Resume Screening", remark: "Waiting for HR review" }
    ],
    messages: [],
    attachments: []
  },
  {
    id: "notify004",
    category: "Resume Center",
    title: "Portfolio feedback available",
    time: "2025-02-22 15:20",
    read: false
  },
  {
    id: "notify005",
    category: "Activity Reminder",
    title: "Counselor shared interview prep tips",
    time: "2025-02-23 08:30",
    read: false
  }
];

const studentResume = {
  completeness: 82,
  steps: [
    {
      id: "basic",
      title: "Basic Information",
      fields: [
        { id: "name", label: "Name", value: "Alex Zhang" },
        { id: "email", label: "Email", value: "zhang@example.com" },
        { id: "phone", label: "Phone", value: "138-0000-1111" },
        { id: "target", label: "Career Objective", value: "Frontend Development" }
      ]
    },
    {
      id: "education",
      title: "Education",
      fields: [
        {
          id: "bachelor",
          label: "Bachelor",
          value: "Beihang University – Computer Science (2021-2025)"
        }
      ]
    },
    {
      id: "projects",
      title: "Projects",
      fields: [
        {
          id: "project1",
          label: "Smart Employment Visualization Platform",
          value: "Led front-end architecture, visualization, and component abstraction"
        }
      ]
    },
    {
      id: "skills",
      title: "Skills",
      fields: [
        { id: "languages", label: "Languages", value: "JavaScript / TypeScript / Python" },
        { id: "frameworks", label: "Frameworks", value: "React / Vue / Node.js" }
      ]
    },
    {
      id: "awards",
      title: "Awards",
      fields: [
        { id: "award1", label: "National Innovation & Entrepreneurship", value: "Provincial First Prize" }
      ]
    }
  ],
  attachments: [
    { id: "resume-pdf", name: "Resume.pdf", updatedAt: "2025-02-12" },
    { id: "cet6", name: "CET6 Certificate.pdf", updatedAt: "2025-01-20" }
  ]
};

const studentActivities = [
  {
    id: "act001",
    type: "Info Session",
    title: "Baidu Spring 2025 Info Session",
    date: "2025-02-25 14:00",
    location: "Career Center Auditorium A1",
    status: "Registered",
    guide: "Arrive 30 minutes early and bring your student ID for entry.",
    linkedTeacherId: null
  },
  {
    id: "act002",
    type: "Career Fair",
    title: "Spring 2025 Career Fair",
    date: "2025-03-05 09:00",
    location: "Main Gymnasium",
    status: "Open",
    guide: "Submit the online form in advance and present the QR code onsite.",
    linkedTeacherId: "teach-act-1"
  },
  {
    id: "notify004",
    category: "Resume Center",
    title: "Portfolio feedback available",
    time: "2025-02-22 15:20",
    read: false
  },
  {
    id: "notify005",
    category: "Activity Reminder",
    title: "Counselor shared interview prep tips",
    time: "2025-02-23 08:30",
    read: false
  }
];

const studentNotifications = [
  {
    id: "notify001",
    category: "System Message",
    title: "Identity verification approved",
    time: "2025-02-12 10:00",
    read: true
  },
  {
    id: "notify002",
    category: "Application Status",
    title: "Baidu Technology – Interview Invite",
    time: "2025-02-15 11:00",
    read: false
  },
  {
    id: "notify003",
    category: "Activity Reminder",
    title: "South China Tech Fair closing soon",
    time: "2025-02-20 09:00",
    read: false
  },
  {
    id: "notify004",
    category: "Resume Center",
    title: "Portfolio feedback available",
    time: "2025-02-22 15:20",
    read: false
  },
  {
    id: "notify005",
    category: "Activity Reminder",
    title: "Counselor shared interview prep tips",
    time: "2025-02-23 08:30",
    read: false
  }
];

const hrJobs = [
  {
    id: "job001",
    title: "Frontend Engineer",
    type: "Full-time",
    status: "Published",
    exposure: 3560,
    views: 980,
    applicants: 42,
    publishDate: "2025-02-12",
    city: "Beijing",
    salary: "18k-25k",
    deadline: "2025-03-31",
    description:
      "Lead the campus recruitment front-end development, own landing pages, and collaborate with data teams to surface insights."
  },
  {
    id: "job002",
    title: "Data Analytics Intern",
    type: "Internship",
    status: "Pending",
    exposure: 1280,
    views: 320,
    applicants: 18,
    publishDate: "2025-02-10",
    city: "Hangzhou",
    salary: "200/day",
    deadline: "2025-04-15",
    description:
      "Assist the talent analytics team to prepare dashboards, clean datasets, and prepare interview packs for enterprises."
  },
  {
    id: "notify004",
    category: "Resume Center",
    title: "Portfolio feedback available",
    time: "2025-02-22 15:20",
    read: false
  },
  {
    id: "notify005",
    category: "Activity Reminder",
    title: "Counselor shared interview prep tips",
    time: "2025-02-23 08:30",
    read: false
  }
];

const hrCandidates = {
  stages: [
    { id: "new", label: "New" },
    { id: "reviewed", label: "Reviewed" },
    { id: "interview", label: "Interview" },
    { id: "offer", label: "Offer" },
    { id: "reject", label: "Rejected" }
  ],
  list: [
    {
      id: "cand001",
      name: "Alex Zhang",
      job: "Frontend Engineer",
      stage: "reviewed",
      summary: "React and data visualization project experience",
      updatedAt: "2025-02-15",
      resume:
        "Studying at Beihang University; led the employment analytics front-end, proficient in React/Vue."
    },
    {
      id: "cand002",
      name: "Lynn Li",
      job: "Data Analytics Intern",
      stage: "new",
      summary: "Machine learning and statistical modeling background",
      updatedAt: "2025-02-14",
      resume:
        "Extensive data analytics competition experience; fluent in Python, SQL, and visualization tools."
    }
  ],
  templates: [
    {
      id: "tpl001",
      name: "Initial Interview Template",
      content: "Hi, we loved your resume and would like to invite you to an online interview this week..."
    }
  ]
};

const hrNotifications = [
  {
    id: "hr-notify-1",
    category: "Application",
    title: "Alex Zhang submitted Frontend Engineer resume",
    time: "2025-02-15 10:20",
    read: false
  },
  {
    id: "notify004",
    category: "Resume Center",
    title: "Portfolio feedback available",
    time: "2025-02-22 15:20",
    read: false
  },
  {
    id: "notify005",
    category: "Activity Reminder",
    title: "Counselor shared interview prep tips",
    time: "2025-02-23 08:30",
    read: false
  }
];

const hrCampusEvents = {
  calendar: [
    {
      date: "2025-02-25",
      title: "Baidu Spring Info Session",
      status: "Pending"
    },
    {
      date: "2025-03-05",
      title: "Tech Career Fair",
      status: "Registered"
    }
  ],
  rules: [
    "Submit company profile materials two weeks in advance",
    "Follow campus booth setup and promotion guidelines",
    "Standard booth size: 3m x 3m"
  ],
  registrationForm: {
    company: "Baidu Technology Co., Ltd.",
    contact: "Ziqi Wang",
    phone: "138-1234-5678",
    boothType: "Double-sided booth",
    participants: 3,
    status: "Reviewing",
    remark: "Needs to be near the main entrance"
  }
};

const teacherActivities = [
  {
    id: "teach-act-1",
    title: "Spring 2025 Career Fair",
    date: "2025-03-05",
    location: "Main Gymnasium",
    capacity: 80,
    registered: 65,
    status: "Under Review",
    linkedActivityId: "act002"
  },
  {
    id: "teach-act-2",
    title: "Smart Manufacturing Info Session",
    date: "2025-03-10",
    location: "Career Center B201",
    capacity: 120,
    registered: 40,
    status: "Approved",
    linkedActivityId: null
  },
  {
    id: "notify004",
    category: "Resume Center",
    title: "Portfolio feedback available",
    time: "2025-02-22 15:20",
    read: false
  },
  {
    id: "notify005",
    category: "Activity Reminder",
    title: "Counselor shared interview prep tips",
    time: "2025-02-23 08:30",
    read: false
  }
];

const teacherApprovals = [
  {
    id: "approval-1",
    company: "Tencent Technology Co., Ltd.",
    requestAt: "2025-02-12",
    type: "Info Session",
    boothNeed: "Double booth",
    status: "Pending",
    linkedFormId: "approval-1"
  },
  {
    id: "notify004",
    category: "Resume Center",
    title: "Portfolio feedback available",
    time: "2025-02-22 15:20",
    read: false
  },
  {
    id: "notify005",
    category: "Activity Reminder",
    title: "Counselor shared interview prep tips",
    time: "2025-02-23 08:30",
    read: false
  }
];

const teacherExports = [
  {
    id: "export-1",
    label: "Export career fair signups",
    fileName: "2025_spring_fair.xlsx"
  },
  {
    id: "notify004",
    category: "Resume Center",
    title: "Portfolio feedback available",
    time: "2025-02-22 15:20",
    read: false
  },
  {
    id: "notify005",
    category: "Activity Reminder",
    title: "Counselor shared interview prep tips",
    time: "2025-02-23 08:30",
    read: false
  }
];

const teacherCheckin = {
  qrHint: "Scan to check in: Spring 2025 Career Fair",
  qrPlaceholder: "QR Placeholder",
  qrData: "https://career.univ.edu/checkin/spring-2025",
  updatedAt: "2025-02-12T09:00:00Z"
};

const employmentRecords = [
  {
    id: "rec-2024-01",
    year: "2024",
    college: "School of Computer Science",
    major: "Computer Science",
    industry: "Internet",
    category: "R&D",
    region: "Beijing"
  },
  {
    id: "rec-2024-02",
    year: "2024",
    college: "School of Computer Science",
    major: "Software Engineering",
    industry: "Internet",
    category: "Product & Ops",
    region: "Hangzhou"
  },
  {
    id: "rec-2024-03",
    year: "2024",
    college: "School of AI",
    major: "Artificial Intelligence",
    industry: "Artificial Intelligence",
    category: "R&D",
    region: "Shenzhen"
  },
  {
    id: "rec-2024-04",
    year: "2024",
    college: "School of AI",
    major: "Information Management",
    industry: "Education",
    category: "Data Analytics",
    region: "Shanghai"
  },
  {
    id: "rec-2023-01",
    year: "2023",
    college: "School of Economics",
    major: "Information Management",
    industry: "Finance",
    category: "Business Support",
    region: "Shanghai"
  },
  {
    id: "rec-2023-02",
    year: "2023",
    college: "School of Computer Science",
    major: "Computer Science",
    industry: "Internet",
    category: "R&D",
    region: "Beijing"
  },
  {
    id: "rec-2023-03",
    year: "2023",
    college: "School of AI",
    major: "Artificial Intelligence",
    industry: "Manufacturing",
    category: "R&D",
    region: "Guangzhou"
  },
  {
    id: "rec-2023-04",
    year: "2023",
    college: "School of Economics",
    major: "Information Management",
    industry: "Finance",
    category: "Data Analytics",
    region: "Shanghai"
  },
  {
    id: "rec-2025-01",
    year: "2025",
    college: "School of Computer Science",
    major: "Software Engineering",
    industry: "Internet",
    category: "R&D",
    region: "Beijing"
  },
  {
    id: "rec-2025-02",
    year: "2025",
    college: "School of AI",
    major: "Artificial Intelligence",
    industry: "Artificial Intelligence",
    category: "R&D",
    region: "Shenzhen"
  },
  {
    id: "rec-2025-03",
    year: "2025",
    college: "School of Economics",
    major: "Information Management",
    industry: "Finance",
    category: "Business Support",
    region: "Shanghai"
  },
  {
    id: "rec-2025-04",
    year: "2025",
    college: "School of Computer Science",
    major: "Computer Science",
    industry: "New Energy",
    category: "Data Analytics",
    region: "Hangzhou"
  },
  {
    id: "notify004",
    category: "Resume Center",
    title: "Portfolio feedback available",
    time: "2025-02-22 15:20",
    read: false
  },
  {
    id: "notify005",
    category: "Activity Reminder",
    title: "Counselor shared interview prep tips",
    time: "2025-02-23 08:30",
    read: false
  }
];

const employmentDashboard = {
  filters: {
    year: ["2023", "2024", "2025"],
    college: ["School of Computer Science", "School of AI", "School of Economics"],
    major: ["Computer Science", "Software Engineering", "Artificial Intelligence", "Information Management"]
  },
  records: employmentRecords,
  industryDistribution: [
    { name: "Internet", value: 35 },
    { name: "Manufacturing", value: 20 },
    { name: "Finance", value: 15 },
    { name: "Education", value: 10 },
    { name: "Other", value: 20 }
  ],
  jobCategory: [
    { name: "R&D", value: 40 },
    { name: "Product & Ops", value: 25 },
    { name: "Data Analytics", value: 20 },
    { name: "Business Support", value: 15 }
  ],
  regionFlow: [
    { name: "Beijing", value: 30 },
    { name: "Shanghai", value: 25 },
    { name: "Shenzhen", value: 20 },
    { name: "Hangzhou", value: 15 },
    { name: "Other", value: 10 }
  ]
};

const enterpriseAudit = [
  {
    id: "audit-1",
    company: "Huawei Technologies Co., Ltd.",
    submitAt: "2025-02-10",
    materials: ["Business License.pdf", "Legal Representative ID.pdf", "Safety Commitment.pdf"],
    status: "Pending",
    history: [
      { date: "2024-09-20", result: "Approved" },
      { date: "2023-08-12", result: "Approved" }
    ],
    blacklist: false
  },
  {
    id: "audit-2",
    company: "Future EdTech Co., Ltd.",
    submitAt: "2025-02-05",
    materials: ["Business License.pdf", "Safety Commitment.pdf"],
    status: "Rejected",
    history: [{ date: "2024-05-18", result: "Rejected" }],
    blacklist: true
  },
  {
    id: "notify004",
    category: "Resume Center",
    title: "Portfolio feedback available",
    time: "2025-02-22 15:20",
    read: false
  },
  {
    id: "notify005",
    category: "Activity Reminder",
    title: "Counselor shared interview prep tips",
    time: "2025-02-23 08:30",
    read: false
  }
];

const adminUsers = [
  {
    id: "user001",
    username: "teacher",
    platformRole: "teacher",
    name: "Professor Zhang",
    role: "Teacher Admin",
    department: "School of Computer Science",
    email: "zhang@univ.edu",
    status: "Enabled"
  },
  {
    id: "user002",
    username: "hr",
    platformRole: "hr",
    name: "Wang (HR)",
    role: "Enterprise HR",
    department: "Baidu Technology",
    email: "wang.hr@baidu.com",
    status: "Enabled"
  },
  {
    id: "user005",
    username: "hr2",
    platformRole: "hr",
    name: "Liu (Campus HR)",
    role: "Enterprise HR",
    department: "Sunrise Robotics",
    email: "liu.hr@sunrise.com",
    status: "Enabled"
  },
  {
    id: "user003",
    username: "admin",
    platformRole: "admin",
    name: "Admin Li",
    role: "System Admin",
    department: "Career Center",
    email: "admin@career.edu",
    status: "Disabled"
  },
  {
    id: "notify004",
    category: "Resume Center",
    title: "Portfolio feedback available",
    time: "2025-02-22 15:20",
    read: false
  },
  {
    id: "notify005",
    category: "Activity Reminder",
    title: "Counselor shared interview prep tips",
    time: "2025-02-23 08:30",
    read: false
  }
];

const adminRoles = [
  { id: "role01", name: "Student", desc: "Access student portal" },
  { id: "role02", name: "Teacher", desc: "Manage activities and reviews" },
  { id: "role03", name: "HR", desc: "Manage jobs and candidates" },
  { id: "role04", name: "System Admin", desc: "Full administrative access" }
];

const adminLogs = [
  {
    id: "log001",
    actor: "Admin Li",
    module: "Activity",
    action: "Created activity approval",
    target: "Spring 2025 Career Fair",
    time: "2025-02-14 09:32",
    ip: "10.2.18.36"
  },
  {
    id: "log002",
    actor: "Wang (HR)",
    module: "Job",
    action: "Published job",
    target: "Frontend Engineer",
    time: "2025-02-12 14:10",
    ip: "10.2.19.21"
  },
  {
    id: "notify004",
    category: "Resume Center",
    title: "Portfolio feedback available",
    time: "2025-02-22 15:20",
    read: false
  },
  {
    id: "notify005",
    category: "Activity Reminder",
    title: "Counselor shared interview prep tips",
    time: "2025-02-23 08:30",
    read: false
  }
];

export const initialState = {
  session: {
    authenticated: false,
    userId: null,
    role: null,
    displayName: null,
    lastLoginAt: null
  },
  accounts,
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
    campusEvents: hrCampusEvents,
    notifications: hrNotifications
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
  industries: ["Internet", "Information Technology", "Artificial Intelligence", "Big Data", "New Energy"],
  cities: ["Beijing", "Shanghai", "Hangzhou", "Shenzhen", "Guangzhou"],
  salaries: ["6k-10k", "10k-15k", "15k-20k", "20k+", "Daily 200+"],
  education: ["Associate", "Bachelor", "Master", "Doctorate"]
};

export function cloneInitialState() {
  return JSON.parse(JSON.stringify(initialState));
}
