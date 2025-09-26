-- University Employment Analytics Platform - MySQL schema aligned with front-end mock data

-- Drop existing tables (for local development resets)
DROP TABLE IF EXISTS admin_logs;
DROP TABLE IF EXISTS admin_roles;
DROP TABLE IF EXISTS admin_users;
DROP TABLE IF EXISTS teacher_enterprise_history;
DROP TABLE IF EXISTS teacher_enterprise_audit;
DROP TABLE IF EXISTS teacher_checkins;
DROP TABLE IF EXISTS teacher_exports;
DROP TABLE IF EXISTS teacher_approvals;
DROP TABLE IF EXISTS teacher_activities;
DROP TABLE IF EXISTS hr_event_rules;
DROP TABLE IF EXISTS hr_events;
DROP TABLE IF EXISTS hr_candidate_templates;
DROP TABLE IF EXISTS hr_candidates;
DROP TABLE IF EXISTS hr_jobs;
DROP TABLE IF EXISTS student_notifications;
DROP TABLE IF EXISTS student_activity_guides;
DROP TABLE IF EXISTS student_activities;
DROP TABLE IF EXISTS student_resume_attachments;
DROP TABLE IF EXISTS student_resume_fields;
DROP TABLE IF EXISTS student_resume_sections;
DROP TABLE IF EXISTS student_application_attachments;
DROP TABLE IF EXISTS student_application_messages;
DROP TABLE IF EXISTS student_application_progress;
DROP TABLE IF EXISTS student_applications;
DROP TABLE IF EXISTS student_job_tags;
DROP TABLE IF EXISTS student_jobs;
DROP TABLE IF EXISTS app_accounts;

-- User accounts powering the login screen
CREATE TABLE app_accounts (
  id VARCHAR(32) PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_plain VARCHAR(64) NOT NULL,
  role ENUM('student','hr','teacher','admin') NOT NULL,
  display_name VARCHAR(100) NOT NULL
);

INSERT INTO app_accounts (id, username, password_plain, role, display_name) VALUES
  ('acct-student', 'student', 'student123', 'student', 'Alex Zhang'),
  ('acct-hr', 'hr', 'hr123', 'hr', 'Wang (HR)'),
  ('acct-teacher', 'teacher', 'teacher123', 'teacher', 'Professor Zhang'),
  ('acct-admin', 'admin', 'admin123', 'admin', 'Admin Li');

-- Student job listings
CREATE TABLE student_jobs (
  id VARCHAR(32) PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  company VARCHAR(200) NOT NULL,
  industry VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  salary VARCHAR(50) NOT NULL,
  education VARCHAR(50) NOT NULL,
  deadline DATE NOT NULL,
  publish_date DATE NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT NOT NULL,
  favorite TINYINT(1) NOT NULL DEFAULT 0
);

INSERT INTO student_jobs VALUES
  ('job001','Frontend Engineer','Baidu Technology Co., Ltd.','Internet','Beijing','18k-25k','Bachelor','2025-03-31','2025-02-12','Own the employment analytics front-end, craft interactive visual components, and deliver high-performance data experiences.','Proficient with React/Vue and component-driven development; Hands-on experience with ECharts/D3 or similar visualization stacks; Strong product mindset and cross-team collaboration skills',0),
  ('job002','Data Analytics Intern','Alibaba Group','Big Data','Hangzhou','200/day','Bachelor','2025-04-15','2025-02-10','Clean and analyze campus employment data, build statistical models, and deliver insight reports.','Background in statistics, computer science, or mathematics; Skilled with SQL and Python data analysis libraries; Strong communication and business insight',0),
  ('job003','Algorithm Researcher','Tencent Technology Co., Ltd.','Artificial Intelligence','Shenzhen','28k-35k','Master','2025-04-30','2025-02-08','Drive intelligent recommendation R&D, iterate models, and evaluate experiments to power job matching.','Experienced with mainstream deep learning frameworks and NLP/recommendation systems; Solid algorithm foundations and engineering capability; Excellent cross-team communication',0);

CREATE TABLE student_job_tags (
  job_id VARCHAR(32) NOT NULL,
  tag VARCHAR(60) NOT NULL,
  PRIMARY KEY (job_id, tag),
  CONSTRAINT fk_jobtag_job FOREIGN KEY (job_id) REFERENCES student_jobs(id) ON DELETE CASCADE
);

INSERT INTO student_job_tags VALUES
  ('job001','React'),('job001','Data Visualization'),('job001','TypeScript'),
  ('job002','SQL'),('job002','Python'),('job002','BI Reports'),
  ('job003','NLP'),('job003','Recommendation'),('job003','Deep Learning');

-- Student applications and related data
CREATE TABLE student_applications (
  id VARCHAR(32) PRIMARY KEY,
  job_id VARCHAR(32) NOT NULL,
  job_title VARCHAR(200) NOT NULL,
  company VARCHAR(200) NOT NULL,
  submit_date DATE NOT NULL,
  status VARCHAR(50) NOT NULL,
  CONSTRAINT fk_application_job FOREIGN KEY (job_id) REFERENCES student_jobs(id) ON DELETE CASCADE
);

INSERT INTO student_applications VALUES
  ('apply001','job001','Frontend Engineer','Baidu Technology Co., Ltd.','2025-02-13','Interview Invite'),
  ('apply002','job002','Data Analytics Intern','Alibaba Group','2025-02-11','Resume Screening');

CREATE TABLE student_application_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  application_id VARCHAR(32) NOT NULL,
  event_time DATETIME NOT NULL,
  label VARCHAR(100) NOT NULL,
  remark VARCHAR(255) NOT NULL,
  CONSTRAINT fk_progress_application FOREIGN KEY (application_id) REFERENCES student_applications(id) ON DELETE CASCADE
);

INSERT INTO student_application_progress (application_id,event_time,label,remark) VALUES
  ('apply001','2025-02-13 09:20','Submitted','System confirmation received'),
  ('apply001','2025-02-14 15:30','Resume Reviewed','HR viewed the resume'),
  ('apply001','2025-02-15 11:00','Interview Invite','Scheduled for Feb 20, 10:00'),
  ('apply002','2025-02-11 10:12','Submitted','System confirmation received'),
  ('apply002','2025-02-13 18:40','Resume Screening','Waiting for HR review');

CREATE TABLE student_application_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  application_id VARCHAR(32) NOT NULL,
  sender VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  CONSTRAINT fk_message_application FOREIGN KEY (application_id) REFERENCES student_applications(id) ON DELETE CASCADE
);

INSERT INTO student_application_messages (application_id,sender,content) VALUES
  ('apply001','HR - Ziqi Wang','Please confirm the interview on Feb 20 at 10:00.');

CREATE TABLE student_application_attachments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  application_id VARCHAR(32) NOT NULL,
  file_name VARCHAR(200) NOT NULL,
  file_size VARCHAR(40) DEFAULT NULL,
  CONSTRAINT fk_attachment_application FOREIGN KEY (application_id) REFERENCES student_applications(id) ON DELETE CASCADE
);

INSERT INTO student_application_attachments (application_id,file_name,file_size) VALUES
  ('apply001','Portfolio.pdf','2.4MB');

CREATE TABLE student_resume_sections (
  id VARCHAR(32) PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  ordering INT NOT NULL
);

INSERT INTO student_resume_sections VALUES
  ('basic','Basic Information',1),
  ('education','Education',2),
  ('projects','Projects',3),
  ('skills','Skills',4),
  ('awards','Awards',5);

CREATE TABLE student_resume_fields (
  id INT AUTO_INCREMENT PRIMARY KEY,
  section_id VARCHAR(32) NOT NULL,
  field_key VARCHAR(50) NOT NULL,
  label VARCHAR(120) NOT NULL,
  value TEXT NOT NULL,
  CONSTRAINT fk_resume_section FOREIGN KEY (section_id) REFERENCES student_resume_sections(id) ON DELETE CASCADE
);

INSERT INTO student_resume_fields (section_id,field_key,label,value) VALUES
  ('basic','name','Name','Alex Zhang'),
  ('basic','email','Email','zhang@example.com'),
  ('basic','phone','Phone','138-0000-1111'),
  ('basic','target','Career Objective','Frontend Development'),
  ('education','bachelor','Bachelor','Beihang University – Computer Science (2021-2025)'),
  ('projects','project1','Smart Employment Visualization Platform','Led front-end architecture, visualization, and component abstraction'),
  ('skills','languages','Languages','JavaScript / TypeScript / Python'),
  ('skills','frameworks','Frameworks','React / Vue / Node.js'),
  ('awards','award1','National Innovation & Entrepreneurship','Provincial First Prize');

CREATE TABLE student_resume_attachments (
  id VARCHAR(32) PRIMARY KEY,
  file_name VARCHAR(200) NOT NULL,
  updated_at DATE NOT NULL
);

INSERT INTO student_resume_attachments VALUES
  ('resume-pdf','Resume.pdf','2025-02-12'),
  ('cet6','CET6 Certificate.pdf','2025-01-20');

CREATE TABLE student_activities (
  id VARCHAR(32) PRIMARY KEY,
  type VARCHAR(40) NOT NULL,
  title VARCHAR(200) NOT NULL,
  activity_date DATETIME NOT NULL,
  location VARCHAR(200) NOT NULL,
  status VARCHAR(40) NOT NULL,
  guide TEXT NOT NULL
);

INSERT INTO student_activities VALUES
  ('act001','Info Session','Baidu Spring 2025 Info Session','2025-02-25 14:00:00','Career Center Auditorium A1','Registered','Arrive 30 minutes early and bring your student ID for entry.'),
  ('act002','Career Fair','South China Tech Career Fair','2025-03-05 09:00:00','Main Gymnasium','Open','Submit the online form in advance and present the QR code onsite.');

CREATE TABLE student_activity_guides (
  id INT AUTO_INCREMENT PRIMARY KEY,
  activity_id VARCHAR(32) NOT NULL,
  guide TEXT NOT NULL,
  CONSTRAINT fk_activity_guide FOREIGN KEY (activity_id) REFERENCES student_activities(id) ON DELETE CASCADE
);

CREATE TABLE student_notifications (
  id VARCHAR(32) PRIMARY KEY,
  category VARCHAR(80) NOT NULL,
  title VARCHAR(200) NOT NULL,
  notify_time DATETIME NOT NULL,
  is_read TINYINT(1) NOT NULL DEFAULT 0
);

INSERT INTO student_notifications VALUES
  ('notify001','System Message','Identity verification approved','2025-02-12 10:00:00',1),
  ('notify002','Application Status','Baidu Technology – Interview Invite','2025-02-15 11:00:00',0),
  ('notify003','Activity Reminder','South China Tech Fair closing soon','2025-02-20 09:00:00',0);

-- HR portal data
CREATE TABLE hr_jobs (
  id VARCHAR(32) PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  job_type VARCHAR(60) NOT NULL,
  status VARCHAR(40) NOT NULL,
  exposure INT NOT NULL,
  views INT NOT NULL,
  applicants INT NOT NULL,
  publish_date DATE NOT NULL
);

INSERT INTO hr_jobs VALUES
  ('job001','Frontend Engineer','Full-time','Published',3560,980,42,'2025-02-12'),
  ('job002','Data Analytics Intern','Internship','Pending',1280,320,18,'2025-02-10');

CREATE TABLE hr_candidate_stages (
  id VARCHAR(32) PRIMARY KEY,
  label VARCHAR(80) NOT NULL
);

INSERT INTO hr_candidate_stages VALUES
  ('new','New'),('reviewed','Reviewed'),('interview','Interview'),('offer','Offer'),('reject','Rejected');

CREATE TABLE hr_candidates (
  id VARCHAR(32) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  job VARCHAR(200) NOT NULL,
  stage VARCHAR(32) NOT NULL,
  summary TEXT NOT NULL,
  updated_at DATE NOT NULL,
  resume TEXT NOT NULL,
  CONSTRAINT fk_candidate_stage FOREIGN KEY (stage) REFERENCES hr_candidate_stages(id)
);

INSERT INTO hr_candidates VALUES
  ('cand001','Alex Zhang','Frontend Engineer','reviewed','React and data visualization project experience','2025-02-15','Studying at Beihang University; led the employment analytics front-end, proficient in React/Vue.'),
  ('cand002','Lynn Li','Data Analytics Intern','new','Machine learning and statistical modeling background','2025-02-14','Extensive data analytics competition experience; fluent in Python, SQL, and visualization tools.');

CREATE TABLE hr_candidate_templates (
  id VARCHAR(32) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  content TEXT NOT NULL
);

INSERT INTO hr_candidate_templates VALUES
  ('tpl001','Initial Interview Template','Hi, we loved your resume and would like to invite you to an online interview this week...');

CREATE TABLE hr_events (
  id VARCHAR(32) PRIMARY KEY,
  event_date DATE NOT NULL,
  title VARCHAR(200) NOT NULL,
  status VARCHAR(40) NOT NULL
);

INSERT INTO hr_events VALUES
  ('event001','2025-02-25','Baidu Spring Info Session','Pending'),
  ('event002','2025-03-05','Tech Career Fair','Registered');

CREATE TABLE hr_event_rules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  rule_text VARCHAR(255) NOT NULL
);

INSERT INTO hr_event_rules (rule_text) VALUES
  ('Submit company profile materials two weeks in advance'),
  ('Follow campus booth setup and promotion guidelines'),
  ('Standard booth size: 3m x 3m');

-- Teacher portal data
CREATE TABLE teacher_activities (
  id VARCHAR(32) PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  activity_date DATE NOT NULL,
  location VARCHAR(200) NOT NULL,
  capacity INT NOT NULL,
  registered INT NOT NULL,
  status VARCHAR(40) NOT NULL
);

INSERT INTO teacher_activities VALUES
  ('teach-act-1','Spring 2025 Career Fair','2025-03-05','Main Gymnasium',80,65,'Under Review'),
  ('teach-act-2','Smart Manufacturing Info Session','2025-03-10','Career Center B201',120,40,'Approved');

CREATE TABLE teacher_approvals (
  id VARCHAR(32) PRIMARY KEY,
  company VARCHAR(200) NOT NULL,
  request_at DATE NOT NULL,
  activity_type VARCHAR(80) NOT NULL,
  booth_need VARCHAR(120) NOT NULL,
  status VARCHAR(40) NOT NULL
);

INSERT INTO teacher_approvals VALUES
  ('approval-1','Tencent Technology Co., Ltd.','2025-02-12','Info Session','Double booth','Pending');

CREATE TABLE teacher_exports (
  id VARCHAR(32) PRIMARY KEY,
  label VARCHAR(200) NOT NULL,
  file_name VARCHAR(200) NOT NULL
);

INSERT INTO teacher_exports VALUES
  ('export-1','Export career fair signups','2025_spring_fair.xlsx');

CREATE TABLE teacher_checkins (
  id VARCHAR(32) PRIMARY KEY,
  qr_hint VARCHAR(200) NOT NULL,
  qr_placeholder VARCHAR(80) NOT NULL
);

INSERT INTO teacher_checkins VALUES
  ('checkin-1','Scan to check in: Spring 2025 Career Fair','QR Placeholder');

CREATE TABLE teacher_enterprise_audit (
  id VARCHAR(32) PRIMARY KEY,
  company VARCHAR(200) NOT NULL,
  submit_at DATE NOT NULL,
  status VARCHAR(40) NOT NULL,
  blacklist TINYINT(1) NOT NULL DEFAULT 0
);

INSERT INTO teacher_enterprise_audit VALUES
  ('audit-1','Huawei Technologies Co., Ltd.','2025-02-10','Pending',0),
  ('audit-2','Future EdTech Co., Ltd.','2025-02-05','Rejected',1);

CREATE TABLE teacher_enterprise_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  audit_id VARCHAR(32) NOT NULL,
  history_date DATE NOT NULL,
  result VARCHAR(40) NOT NULL,
  CONSTRAINT fk_audit_history FOREIGN KEY (audit_id) REFERENCES teacher_enterprise_audit(id) ON DELETE CASCADE
);

INSERT INTO teacher_enterprise_history (audit_id,history_date,result) VALUES
  ('audit-1','2024-09-20','Approved'),
  ('audit-1','2023-08-12','Approved'),
  ('audit-2','2024-05-18','Rejected');

-- Admin portal data
CREATE TABLE admin_users (
  id VARCHAR(32) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  role VARCHAR(120) NOT NULL,
  department VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL,
  status VARCHAR(40) NOT NULL
);

INSERT INTO admin_users VALUES
  ('user001','Professor Zhang','Teacher Admin','School of Computer Science','zhang@univ.edu','Enabled'),
  ('user002','Wang (HR)','Enterprise HR','Baidu Technology','wang.hr@baidu.com','Enabled'),
  ('user003','Admin Li','System Admin','Career Center','admin@career.edu','Disabled');

CREATE TABLE admin_roles (
  id VARCHAR(32) PRIMARY KEY,
  role_name VARCHAR(120) NOT NULL,
  role_desc VARCHAR(200) NOT NULL
);

INSERT INTO admin_roles VALUES
  ('role01','Student','Access student portal'),
  ('role02','Teacher','Manage activities and reviews'),
  ('role03','HR','Manage jobs and candidates'),
  ('role04','System Admin','Full administrative access');

CREATE TABLE admin_logs (
  id VARCHAR(32) PRIMARY KEY,
  actor VARCHAR(120) NOT NULL,
  action VARCHAR(200) NOT NULL,
  target VARCHAR(200) NOT NULL,
  log_time DATETIME NOT NULL,
  source_ip VARCHAR(40) DEFAULT NULL
);

INSERT INTO admin_logs VALUES
  ('log001','Admin Li','Created activity approval','Spring 2025 Career Fair','2025-02-14 09:32:00','10.2.18.36'),
  ('log002','Wang (HR)','Published job','Frontend Engineer','2025-02-12 14:10:00','10.2.19.21');
