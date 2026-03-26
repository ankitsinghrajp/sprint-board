#  SprintBoard – Kanban Task Management App

**A modern Kanban-style project management tool inspired by Jira — designed to manage sprints, track issues, and streamline workflows with an intuitive drag-and-drop interface.**

 Live: https://sprint-board-nine.vercel.app

---

##  Overview

SprintBoard is a full-stack task management application that enables:

*  Project and sprint creation
*  Issue tracking with status workflows
*  Visual task management using Kanban boards
*  Real-time updates for seamless collaboration

It is built to replicate **real-world agile workflows**, similar to tools like Jira, while maintaining simplicity and speed.

---

##  Why This Project?

This project was built to:

* Understand **Kanban & Agile workflows**
* Implement **drag-and-drop UI systems**
* Handle **dynamic state updates**
* Design a **scalable project management system**

---

##  Core Features

###  Task & Issue Management

* Create, update, and delete issues
* Assign tasks to users
* Set priority levels (Low / Medium / High)
* Add comments and activity logs

---

###  Kanban Board System

* Drag-and-drop tasks across columns
* Workflow stages (To Do → In Progress → Done)
* Real-time UI updates on task movement

---

###  Sprint & Project Management

* Create and manage multiple projects
* Organize tasks into sprints
* Track progress across development cycles

---

###  Filtering & Tracking

* Filter tasks by:

  * Status
  * Assignee
  * Priority
* Visual progress indicators

---

###  AI-Powered Feature

* AI-based career/task suggestions
* Enhances productivity and decision-making

---

##  Authentication & Authorization

*  Secure authentication using **Clerk**
*  Social login support (Google, etc.)
*  Session management handled by Clerk
*  Role-based access control
*  Protected routes for project and task data

---

##  System Architecture

###  Workflow

1. User logs in via **Clerk authentication**
2. User creates project or sprint
3. Tasks/issues are added to board
4. Tasks moved via **drag-and-drop interaction**
5. Backend updates state (via Next.js API routes)
6. Database (PostgreSQL via Prisma) syncs changes
7. UI reflects updates in real-time

---

##  Key Functional Modules

*  **Kanban Engine**

  * Drag-and-drop powered board system
  * Dynamic UI updates

*  **Real-Time Updates**

  * Instant UI synchronization across actions

*  **State Management**

  * Efficient handling of board states and task movements

*  **Project Workflow System**

  * Structured sprint-based development flow

---

##  Tech Stack

###  Frontend + Backend

* Next.js (Full Stack)
* React.js
* Tailwind CSS

###  Backend Logic

* Next.js API Routes
* Node.js

###  Database

* Neon (PostgreSQL)
* Prisma ORM

###  Authentication

* Clerk (Auth + Session Management + OAuth)

###  Tools

* Git & GitHub
* Postman

###  Deployment

* Vercel (Frontend + Backend)

---

##  Deployment

| Component | Platform |
| --------- | -------- |
| App       | Vercel   |
| Database  | Neon     |

---

##  Challenges Solved

*  Implemented smooth drag-and-drop UI without breaking state
*  Managed consistent state across multiple boards
*  Designed scalable Kanban workflow system
*  Integrated secure authentication using Clerk
*  Handled dynamic UI rendering efficiently
*  Built real-world Jira-like system

---

##  Future Improvements

*  Team collaboration (multi-user real-time sync)
*  Notifications system
*  Mobile app version
*  Advanced analytics dashboard
*  AI-based task prioritization

---

##  Author

**Ankit Singh Chouhan**
Full Stack Developer

---

##  Why This Project Matters

This project demonstrates:

*  Real-world project management system
*  Drag-and-drop UI engineering
*  Full-stack development (Next.js)
*  Scalable database design (PostgreSQL)
*  Secure authentication (Clerk)
*  Agile workflow understanding

---

##  Support

If you like this project, consider giving it a ⭐ on GitHub!
It motivates and helps in building more impactful projects 

---
