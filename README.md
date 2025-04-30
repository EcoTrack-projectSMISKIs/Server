## Project Structure: EcoTrack-Merged-Backend

EcoTrack-Merged-Backend/ 
├── config/ 
│ └── db.js # Database connection setup 
│ ├── constants/ 
│ └── barangays.js # Barangay constants/data 
│ ├── controllers/ 
│ ├── adminAuthController.js # Admin login/register (Web) 
│ ├── mobileAuthController.js # User login/register (Mobile) 
│ ├── newsController.js # News management for all users 
│ └── userController.js # Admin managing users 
│ ├── middleware/ 
│ └── authMiddleware.js # Auth middleware (shared) 
│ ├── models/ 
│ ├── Admin.js # Admin model schema 
│ ├── News.js # News model schema 
│ └── User.js # User model schema 
│ ├── routes/ 
│ ├── adminAuthRoutes.js # Routes for admin auth 
│ ├── mobileAuthRoutes.js # Routes for user auth 
│ ├── newsRoutes.js # Shared news routes 
│ └── userRoutes.js # Routes for admin managing users 
│ ├── utils/ │ ├── mailer.js # Resend API for user OTPs 
│ └── sendEmail.js # Nodemailer for admin campaigns 
│ ├── .env # Environment variables 
├── package.json # Project metadata and dependencies 
├── server.js # Main Express server entry point

---

### Key Notes:
- **User vs Admin Separation**: Mobile and Admin have dedicated auth flows and routes.
- **Mailer Systems**: Two mailing strategies—Resend API (user OTPs) and Nodemailer (admin campaigns).
- **Shared News System**: Centralized `newsController` and `newsRoutes` for both roles.
