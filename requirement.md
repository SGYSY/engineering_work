
# 大学智能就业平台 - 功能需求规格 (Requirement.md) 

本项目名为**University Smart Employment Platform**，目标是构建一个连接学生、企业和高校的数字化、智能化就业服务桥梁。核心是整合就业信息资源，实现高效的数据管理和服务交付，以提升就业服务效率，优化学生求职体验，并简化企业招聘流程。

## 1. 权限管理系统 (Permission Management System)

### 1.1 核心角色支持 (Multi-Role Model)

* **系统管理员 (System Administrator)**: 负责用户管理和系统配置。
* **大学就业指导老师 (University Career Counselor)**: 负责管理学生数据和校园活动。
* **学生 (Student)**: 负责管理个人简历和职位申请。
* **企业HR (Company HR)**: 负责发布职位和处理申请。

### 1.2 登录与控制

* **安全登录 (Secure Login)**: 基础的用户名和密码登录机制。
* **访问控制 (Access Control)**: 实现严格的数据隔离和权限分配。

---

## 2. 就业信息管理 (Employment Information Management)

### 2.1 职位发布与管理 (Company HR)

* **职位发布、编辑与删除**: 企业HR可在线发布、编辑和移除招聘职位。

### 2.2 学生简历中心 (Student)

* **简历创建与维护**: 学生可创建并维护个人数字化简历。
* **附件支持**: 支持上传附件（如成绩单、作品集等）。

### 2.3 申请、匹配与通知 (Application Matching)

* **在线投递与处理**: 学生在线申请，HR处理申请。
* **状态更新与通知**: 系统提供实时状态更新和通知给学生和企业HR。

---

## 3. 校园招聘管理 (Campus Recruitment Management)

### 3.1 线上线下整合 (Online-Offline Integration)

* **招聘会信息发布 (Counselor)**: 就业指导老师创建并发布校园招聘会的**时间、地点、主题**和**参会企业列表**。
* **企业在线报名 (Company HR)**: 企业HR可浏览招聘会信息，并**提交参会申请**，包括**上传公司资质证明**。
* **在线审批流程 (Counselor)**: 就业指导老师需**在线审核**企业的资质和发布的职位。
* **展位分配与更新 (Counselor)**: 审批通过后，老师需**分配展位**并更新招聘会网页信息。

---

## 4. 数据统计与日志系统 (Data Statistics & Log System)

### 4.1 就业数据统计 (Employment Data Statistics)

* **自动生成统计**: 系统自动生成关键毕业生数据统计。
* **统计内容**: 统计数据包括但不限于毕业生的**行业分布**和**职业类别分布**。
* **可视化展示**: 使用图表（如**饼图、柱状图**）进行数据可视化。

### 4.2 日志系统 (Log System)

* **关键操作记录**: 记录用户的重要操作，例如**登录、职位发布、简历提交**。
* **系统维护**: 日志系统有助于故障排查和系统维护。

---

## 5. 技术要求 (Technical Requirements)

* **数据库 (Database)**: MySQL。
* **后端技术 (Backend Technology)**: Spring Boot + MyBatis-Plus。
* **前端技术 (Frontend Technology)**: Vue.js + HTML5。
* **架构 (Architecture)**: **前后端分离** (Front-end/Back-end Separation)。
