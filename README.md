# Employ Management System [Spring Boot] 🌱

 
The Employ Management System is a **full-stack web application** that enables organizations to securely manage employee data.  
It includes **secure authentication with JWT tokens**, **Google reCAPTCHA v2 integration**, and full **CRUD functionality** for employees.  
The project is designed to be responsive, user-friendly, and scalable for future enhancements.

---

## Project Overview

This application consists of two main parts:

1. **Backend (Spring Boot)**
   - Provides RESTful APIs for authentication and employee management.
   - Uses **Spring Security + JWT** for secure login and session handling.
   - Connects to a **MySQL database** via JPA/Hibernate for persistent storage.

2. **Frontend (React + Vite)**
   - User interface for admins to log in and manage employees.
   - Includes **Google reCAPTCHA** validation on login/register to prevent bots.
   - Fully responsive design that adapts to desktop, tablet, and mobile devices.
   - Uses a **custom Toast notification system** for user feedback.

---

## Features

### Authentication and Security
- Admin registration and login with **username and password**.
- **JWT-based authentication** ensures secure session management.
- **Google reCAPTCHA v2** integration to block automated bots.
- Auto logout on token expiration.

### Employee Management
- Add new employees with details such as name, email, designation, department, and salary.
- Update or delete existing employees.
- Search employees by keyword.
- View employees in a structured table format.

### User Interface
- Intuitive and responsive layout for all devices.
- Real-time toast notifications for success, error, and info messages.
- Horizontal scroll support for tables on small screens.
- Simple and professional design for better usability.

---

## Tech Stack

### Frontend
- React (with Vite for fast build and dev server)
- Tailwind CSS (or inline responsive styling)
- react-google-recaptcha
- Custom Toast notification provider

### Backend
- Spring Boot
- Spring Security with JWT
- Hibernate/JPA
- MySQL Database

---
## Demonstration

### Login and Register
![Login Page](https://raw.githubusercontent.com/debapriyo007/EMS-using-java/refs/heads/main/frontend-using-react/src/assets/demo-sc/Login_And_Register.jpg)

### Employee Dashboard
![Dashboard](https://raw.githubusercontent.com/debapriyo007/EMS-using-java/refs/heads/main/frontend-using-react/src/assets/demo-sc/Dashboard.jpg)

### Video Walkthrough
## 🎥 Video Demo
<video src="./frontend-using-react/src/assets/demo-sc/EMS_DEMO.mp4" controls width="700"></video>



## 🔗 Links
<p align="center">
  <a href="https://katherineoelsner.com/">
    <img src="https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white" alt="portfolio"/>
  </a>
  <a href="https://www.linkedin.com/">
    <img src="https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="linkedin"/>
  </a>
  <a href="https://instagram.com/">
    <img src="https://img.shields.io/badge/instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white" alt="instagram"/>
  </a>
</p>





