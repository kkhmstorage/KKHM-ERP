# KKHM Islamic & Arts College - ERP Portal

A complete, modern Web ERP and Parent Portal for KKHM Islamic & Arts College, Markaz Campus, Athavanad.

### 🌐 Live App: [https://celadon-profiterole-9f7633.netlify.app](https://celadon-profiterole-9f7633.netlify.app)

---

## 🚀 Features

- **Campus Attendance & Leave Management**:
  - Live campus headcount tracking (In Campus vs. On Leave).
  - Out/In leave recording with reason history.
  - One-click bulk "Monthly Leave" status update.
  - Attendance report generation in CSV format.

- **Finance & Fee System**:
  - Academic year fee calculation and monthly installment tracking.
  - Dynamic due-date awareness and arrears monitoring.
  - Seamless Defaulters List with class filtering.
  - Direct UPI integration (Pay via UPI App / QR Code).
  - Google Sheets CSV synchronization.
  - Printable "No Due" Certificate generator.

- **Examinations & Marklists**:
  - Subject-wise exam creation with max marks & pass marks.
  - Mark entry interface with automatic validation.
  - Publish / Unpublish result toggle for parent visibility.
  - Class-level and individual student marklist printing / PDF export.
  - Class rank and percentage calculation.

- **Student & Teacher Directory**:
  - Student profile lookup, manual additions, and bulk CSV uploads.
  - Teacher management with subjects, profile photos, direct call, and WhatsApp chat links.

- **Disciplinary & Achievements Log**:
  - Log student accomplishments and disciplinary records with administrative timestamps.
  - Global achievements wall for institutional showcase.

- **Notice Board & System Customization**:
  - Real-time digital notice board.
  - Configurable college branding, logos, login background (image/video), bank accounts, and UPI QR codes.

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, Vanilla JavaScript (ES Modules)
- **Styling**: Tailwind CSS, FontAwesome Icons
- **Backend / Database**: Google Firebase (Cloud Firestore)
- **File Uploads**: Google Apps Script / Google Drive integration

---

## 💻 Getting Started

Simply open `index.html` in any modern web browser or serve it with any static web server (such as Live Server or Python `http.server`).

```bash
# Example using Python:
python -m http.server 8000
```

---

## 🔒 Default Role Credentials

| Role | Username | Password |
| :--- | :--- | :--- |
| **System Admin** | `admin` | `admin` |
| **Principal** | `admin1` | `admin1` |
| **Class Mentor** | `mentor1` / `mentor2` | `mentor1` / `mentor2` |
| **College Leader** | `leader` | `leader` |
| **Parent / Student** | *Admission Number* | *Set in Profile (Default: `pass`)* |
