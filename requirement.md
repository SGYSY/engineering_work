# University Smart Employment Platform – Functional Requirements

The **University Smart Employment Platform** connects students, employers, and campus career offices through a single digital service. The goal is to centralise employment resources, streamline application workflows, and improve the experience of both students and hiring partners.

## 1. Permission Management System

### 1.1 Supported Roles

- **System Administrator** – manages users, roles, and global configuration.  
- **University Career Counselor** – maintains student records and campus recruiting activities.  
- **Student** – manages personal resumes and job applications.  
- **Company HR** – publishes openings and reviews candidates.

### 1.2 Authentication & Access Control

- **Secure login** using username and password.  
- **Fine-grained authorisation** to isolate data and enforce role-specific permissions.

---

## 2. Employment Information Management

### 2.1 Job Publishing (Company HR)

- Create, edit, and retire job postings through a self-service console.

### 2.2 Student Resume Centre

- Build and maintain a digital resume profile.  
- Upload supporting artefacts such as transcripts or portfolios.

### 2.3 Application Processing

- Students apply online; HR teams review, shortlist, and update candidate statuses.  
- Real-time notifications keep students and HR users informed about progress.

---

## 3. Campus Recruitment Management

### 3.1 Online/Offline Integration

- **Career counselors** publish recruiting events with schedule, venue details, themes, and attending companies.  
- **Company HR** users register for events and upload qualification documents as part of the application.  
- **Counselors** approve or reject participation requests and validate posted positions.  
- Upon approval, counselors assign booths and refresh the public event page.

---

## 4. Analytics and Logging

### 4.1 Employment Analytics

- Automatically generate graduate employment statistics.  
- Highlight metrics such as industry distribution and job category breakdowns.  
- Present insights through charts (e.g., pie and bar charts).

### 4.2 Operational Logging

- Capture key actions, including logins, job publishing, and resume submissions.  
- Support diagnostics, auditing, and compliance reporting.

---

## 5. Technical Requirements

- **Database**: MySQL  
- **Backend**: Spring Boot with MyBatis-Plus  
- **Frontend**: Vue.js with HTML5  
- **Architecture**: Fully decoupled front-end and back-end services
