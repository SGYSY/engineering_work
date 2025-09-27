// Lightweight i18n helper with English default and optional Chinese fallback
// Usage: import { t } from "../utils/i18n.js"; wrap display strings; call setLocale("zh-CN") for Chinese

const dict = new Map([
  // App brand & general
  ["高校智慧就业大数据服务平台", "University Employment Analytics Platform"],
  ["高校智慧就业大数据平台", "University Employment Analytics Platform"],
  ["用户头像", "User Avatar"],

  // Roles & sections
  ["学生端", "Student"],
  ["教师端", "Teacher"],
  ["管理员端", "Admin"],
  ["HR端", "HR"],
  ["职位列表", "Job List"],
  ["职位详情", "Job Detail"],
  ["我的投递", "My Applications"],
  ["简历中心", "Resume Center"],
  ["活动列表", "Activities"],
  ["通知中心", "Notifications"],
  ["职位管理", "Job Management"],
  ["候选人处理", "Candidate Panel"],
  ["校招活动", "Campus Events"],
  ["活动管理", "Activity Management"],
  ["就业看板", "Employment Dashboard"],
  ["企业入校考核", "Enterprise Admission Review"],
  ["用户角色管理", "User Roles"],
  ["操作日志", "Operation Log"],
  ["教师端管理", "Teacher Admin"],
  ["HR端管理", "HR Admin"],

  // Student job list & detail
  ["筛选行业、城市、薪资与学历，快速找到匹配岗位；支持收藏与一键投递。", "Filter by industry, city, salary and education to quickly find matching jobs; supports favorite and one-click apply."],
  ["智能推荐", "Smart Recommend"],
  ["保存筛选", "Save Filter"],
  ["关键字搜索（岗位/公司/标签）", "Keyword search (job/company/tag)"],
  ["行业", "Industry"],
  ["城市", "City"],
  ["薪资", "Salary"],
  ["学历", "Education"],
  ["学历要求", "Education Requirement"],
  ["重置", "Reset"],
  ["暂无匹配岗位", "No matching jobs"],
  ["及以上", "or above"],
  ["截止", "Deadline"],
  ["收藏", "Favorite"],
  ["已收藏", "Favorited"],
  ["一键投递", "Quick Apply"],
  ["查看详情", "View Details"],
  ["返回职位列表", "Back to Job List"],
  ["职位不存在或已下线", "Job not found or offline"],
  ["职位描述", "Job Description"],
  ["任职要求", "Requirements"],
  ["投递流程提醒", "Application Process"],
  ["岗位发布", "Job Posted"],
  ["官方发布职位信息，开放投递入口。", "Officially posted, applications open."],
  ["投递截止", "Application Deadline"],
  ["建议提前准备面试材料，避免高峰期投递失败。", "Prepare interview materials early to avoid peak-time issues."],
  ["立即投递", "Apply Now"],

  // Student applications
  ["查看投递历史与状态时间线，可补充沟通消息与附件。", "View application history and timeline; add messages and attachments."],
  ["导出投递记录", "Export Records"],
  ["同步最新状态", "Sync Latest Status"],
  ["投递列表", "Applications"],
  ["岗位名称", "Job"],
  ["企业", "Company"],
  ["投递时间", "Submitted At"],
  ["当前状态", "Current Status"],
  ["暂无投递记录", "No applications"],
  ["请选择投递记录", "Select an application"],
  ["状态时间线", "Status Timeline"],
  ["沟通消息", "Messages"],
  ["补充消息", "Add Message"],
  ["暂无消息", "No messages"],
  ["投递于", "Submitted on"],
  ["附件资料", "Attachments"],
  ["暂无附件", "No attachments"],
  ["请输入要补充的沟通信息：", "Please enter the message to add:"],
  ["消息已补充", "Message added"],
  ["请输入附件名称，例如：最新简历.pdf", "Enter attachment name, e.g. latest-resume.pdf"],
  ["附件已更新", "Attachment updated"],
  ["已生成投递记录导出任务", "Export task created for application records"],
  ["状态已同步，如有更新将展示在时间线", "Status synced; updates will appear in the timeline"],

  // Student activities
  ["关注宣讲与双选会日程，在线报名并查看入场指引。", "Track presentations and fairs; register online and view entry guides."],
  ["我的报名", "My Registrations"],
  ["下载日程表", "Download Schedule"],
  ["全部类型", "All Types"],
  ["搜索活动或企业", "Search activities or companies"],
  ["更新入场指引（选中活动有效）", "Update entry guide (for selected activity)"],
  ["更新指引", "Update Guide"],
  ["暂无相关活动", "No related activities"],
  ["详情", "Details"],
  ["立即报名", "Register Now"],
  ["取消报名", "Cancel Registration"],
  ["入场指引", "Entry Guide"],

  // Student notifications
  ["查看系统消息、投递状态与活动提醒，支持快速已读与筛选。", "View system messages, application updates and activity alerts; quickly mark as read and filter."],
  ["全部标记已读", "Mark All Read"],
  ["通知订阅", "Subscribe"],
  ["全部", "All"],
  ["仅显示未读", "Unread only"],
  ["暂无通知", "No notifications"],
  ["标为未读", "Mark Unread"],
  ["标为已读", "Mark Read"],
  ["查看详情", "View Details"],

  // Student resume
  ["在线编辑简历信息，实时计算完整度并支持附件管理、PDF 导出。", "Edit resume online with completeness progress; manage attachments and export PDF."],
  ["预览PDF", "Preview PDF"],
  ["导出简历", "Export Resume"],
  ["完善建议", "Improvement Tips"],
  ["• 补充关键项目细节，提高匹配度。", "• Add key project details to improve matching."],
  ["• 上传近期作品集或证书，增加亮点。", "• Upload recent portfolios or certificates to stand out."],
  ["• 定期更新联系方式，保持畅通。", "• Update your contact info regularly."],
  ["附件资料", "Attachments"],
  ["移除", "Remove"],
  ["上传附件", "Upload Attachment"],
  ["编辑", "Edit"],
  ["保存", "Save"],
  ["请输入附件名称，例如：作品集.pdf", "Enter attachment name, e.g. portfolio.pdf"],

  // Teacher
  ["学生就业看板", "Student Employment Dashboard"],
  ["按届别、学院、专业筛选就业流向与岗位类别分布。", "Filter by year, college, and major to view destination and role distribution."],
  ["导出数据", "Export Data"],
  ["届别", "Year"],
  ["学院", "College"],
  ["专业", "Major"],
  ["行业分布", "Industry Distribution"],
  ["岗位类别分布", "Role Category Distribution"],
  ["地区流向", "Regional Flow"],

  ["企业入校考核", "Enterprise Admission Review"],
  ["审核企业资质材料，查看历史记录与黑白名单标记。", "Review enterprise qualifications, history and blacklist/whitelist marks."],
  ["导出审核记录", "Export Review Logs"],
  ["批量审批", "Bulk Approve"],
  ["提交材料", "Submitted Materials"],
  ["历史记录", "History"],
  ["名单标记", "List Mark"],
  ["黑名单", "Blacklist"],
  ["白名单", "Whitelist"],
  ["审核状态：", "Review Status: "],
  ["移出黑名单", "Remove from Blacklist"],
  ["加入黑名单", "Add to Blacklist"],
  ["驳回", "Reject"],
  ["通过", "Approve"],

  ["活动管理与审核", "Activity Management & Review"],
  ["创建活动、审核企业报名、导出名单与生成签到二维码。", "Create activities, review enterprise signups, export lists, and generate check-in QR codes."],
  ["创建活动", "Create Activity"],
  ["企业报名审核", "Enterprise Signup Review"],
  ["导出报名名单", "Export Signup List"],
  ["签到二维码", "Check-in QR Code"],
  ["生成二维码供现场签到，支持下载与刷新。", "Generate QR code for on-site check-in; supports download and refresh."],
  ["下载二维码", "Download QR"],
  ["刷新", "Refresh"],
  ["活动名称", "Activity Title"],
  ["时间", "Time"],
  ["地点", "Location"],
  ["名额", "Quota"],
  ["报名数", "Registrations"],
  ["状态", "Status"],
  ["未命名活动", "Untitled Activity"],
  ["待定", "TBD"],
  ["活动说明", "Description"],
  ["输入活动亮点、参会要求等", "Enter highlights and requirements"],
  ["取消", "Cancel"],
  ["保存", "Save"],

  // Toasts & dynamic statuses/categories
  ["收藏状态已更新", "Favorite updated"],
  ["投递成功，已同步至我的投递", "Applied successfully and synced to My Applications"],
  ["投递成功，已同步到我的投递", "Applied successfully and synced to My Applications"],
  ["筛选已保存，下次将自动加载", "Filter saved and will auto-load next time"],
  ["已根据偏好生成推荐结果", "Recommendations generated based on your preference"],
  ["你还没有报名任何活动", "You haven't registered for any activity"],
  ["日程表已发送至邮箱", "Schedule has been sent to your email"],
  ["活动状态已更新", "Activity status updated"],
  ["已记录该活动，可在页面右上角查看报名清单", "Activity recorded. Check the top-right list."],
  ["请先选择活动卡片", "Please select an activity card first"],
  ["请输入新的入场指引", "Please enter a new entry guide"],
  ["入场指引已更新", "Entry guide updated"],
  ["已导出当前筛选的数据报表", "Exported report for current filters"],
  ["当前筛选：", "Current filters: "],
  ["企业审核已通过", "Enterprise review approved"],
  ["企业审核已驳回", "Enterprise review rejected"],
  ["名单标记已更新", "List mark updated"],
  ["审核记录已导出", "Review logs exported"],
  ["批量审批任务已创建", "Bulk approval task created"],
  ["活动草稿已创建", "Activity draft created"],
  ["已通过报名申请", "Signup approved"],
  ["已驳回报名申请", "Signup rejected"],
  ["已导出 ", "Exported "],
  ["附件上传完成", "Attachment uploaded"],
  ["附件已移除", "Attachment removed"],
  ["仅支持上传PDF文件", "Only PDF files are supported"],
  ["删除", "Remove"],
  ["已生成在线预览（模拟）", "Preview generated (mock)"],
  ["简历导出任务已创建", "Resume export task created"],
  ["简历已保存，并更新完整度", "Resume saved and completeness updated"],
  ["标为未读", "Mark Unread"],
  ["标为已读", "Mark Read"],
  ["通知详情已弹出（模拟）", "Notification detail opened (mock)"],
  ["全部通知已标记为已读", "All notifications marked as read"],
  ["已订阅最新投递与活动通知", "Subscribed to latest application and activity notifications"],

  // Status translations used in data
  ["投递成功", "Submitted"],
  ["简历已阅", "Resume Reviewed"],
  ["面试邀约", "Interview Invite"],
  ["简历筛选", "Resume Screening"],
  ["待上线", "Pending"],
  ["审核中", "Under Review"],
  ["已通过", "Approved"],
  ["已驳回", "Rejected"],
  ["启用", "Enabled"],
  ["停用", "Disabled"],
  ["已报名", "Registered"],
  ["可报名", "Available"],
  ["投递状态", "Application Status"],
  ["活动提醒", "Activity Reminder"],
]);

const inverseDict = new Map(Array.from(dict.entries()).map(([zh, en]) => [en, zh]));

let currentLocale = "en-US";

function syncDocumentLang() {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (!root) return;
  root.setAttribute("lang", currentLocale === "zh-CN" ? "zh-CN" : "en");
}

syncDocumentLang();

export function setLocale(locale) {
  currentLocale = locale === "zh-CN" || locale === "zh" ? "zh-CN" : "en-US";
  syncDocumentLang();
}

export function t(input) {
  if (input == null) return "";
  const s = String(input);
  if (currentLocale === "zh-CN") {
    const inverted = inverseDict.get(s);
    if (inverted) return inverted;
    return s;
  }
  return dict.get(s) || s;
}

export function translateStatus(input) {
  return t(input);
}
