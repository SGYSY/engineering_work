# Front-End Login Credentials

This document lists the default login accounts used by the `engineering_work` front-end project for development and testing.

## Platform Overview

The university employment platform supports four user personas. Each role signs in with a dedicated account and receives a tailored feature set within the UI.

## Account Directory

### 1. Student
- **Username**: `student`  
- **Password**: `student123`  
- **Display name**: Alex Zhang  
- **Permissions**:
  - Browse job listings and view job details
  - Submit and manage resumes
  - Track personal application history
  - Register for campus activities
  - Receive system notifications

### 2. Human Resources
- **Username**: `hr`  
- **Password**: `hr123`  
- **Display name**: Wang (HR)  
- **Permissions**:
  - Publish and manage job postings
  - Review and shortlist candidates
  - Organise campus recruiting events
  - Review resumes and schedule interviews

### 3. Teacher
- **Username**: `teacher`  
- **Password**: `teacher123`  
- **Display name**: Professor Zhang  
- **Permissions**:
  - Review and manage campus activities
  - Analyse student employment dashboards
  - Audit enterprise qualification submissions
  - Provide employment guidance services

### 4. Administrator
- **Username**: `admin`  
- **Password**: `admin123`  
- **Display name**: Admin Li  
- **Permissions**:
  - Manage users, roles, and permissions
  - Inspect system operation logs
  - Manage teacher and HR accounts
  - Configure global system settings

## Quick Login Steps

1. Open the platform login page.  
2. Select the desired role from the **Login Role** dropdown.  
3. Enter the corresponding username and password.  
4. Click **Log In**.

## Security Notes

⚠️ **Important**:
- These credentials are intended for development and QA environments only.  
- Always rotate default passwords before deploying to production.  
- Enforce strong password policies for every role.  
- Review and update credentials on a regular schedule.

## Implementation Detail

Credentials are defined in `src/data/mockData.js` under the `accounts` array. Update that file if you need to modify login data.

---

*Last updated: 26 Sept 2025*
