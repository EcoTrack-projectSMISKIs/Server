# EcoTrack API Documentation (Mobile + Admin)

# EcoTrack Mobile API Documentation

## 🔐 Authentication (Mobile Users)

---

### 1. Register User
- **Endpoint**: `POST /api/auth/mobile/register`
- **Description**: Register a new user with barangay selection and send OTP to email.

#### Request Body:
```json
{
  "name": "Luis Gabriel",
  "username": "luislaguardia",
  "phone": "09123456789",
  "email": "luislaguardia@example.com",
  "password": "yourpassword",
  "barangay": "Barangay 1 (Pob.)"
}
```

#### Response:
```json
{
  "message": "User registered. OTP sent to email."
}
```

---

### 2. Login User
- **Endpoint**: `POST /api/auth/mobile/login`
- **Description**: Login using email, username, or phone after verifying account.

#### Request Body:
```json
{
  "identifier": "luislaguardia@example.com",
  "password": "yourpassword"
}
```

#### Response:
```json
{
  "token": "JWT_TOKEN_HERE",
  "user": {
    "id": "user_id",
    "name": "Luis Gabriel",
    "username": "luislaguardia",
    "email": "luislaguardia@example.com",
    "phone": "09123456789",
    "barangay": "Barangay 1 (Pob.)"
  }
}
```

---

### 3. Verify User OTP
- **Endpoint**: `POST /api/auth/mobile/verify-otp`
- **Description**: Verify user's email address using the OTP received.

#### Request Body:
```json
{
  "email": "luislaguardia@example.com",
  "otp": "123456"
}
```

#### Response:
```json
{
  "message": "Account verified successfully."
}
```

---

### 4. Resend Verification OTP
- **Endpoint**: `POST /api/auth/mobile/resend-verification`
- **Description**: Resend a new OTP code to the user's email if not yet verified.

#### Request Body:
```json
{
  "email": "luislaguardia@example.com"
}
```

#### Response:
```json
{
  "message": "OTP resent successfully."
}
```

---

### 5. Request OTP for Password Reset
- **Endpoint**: `POST /api/auth/mobile/request-otp`
- **Description**: Request an OTP to reset the user's password.

#### Request Body:
```json
{
  "email": "luislaguardia@example.com"
}
```

#### Response:
```json
{
  "message": "OTP sent to your email."
}
```

---

### 6. Reset Password with OTP
- **Endpoint**: `POST /api/auth/mobile/reset-password`
- **Description**: Reset the user's password using the OTP received.

#### Request Body:
```json
{
  "email": "luislaguardia@example.com",
  "otp": "123456",
  "newPassword": "newpassword123"
}
```

#### Response:
```json
{
  "message": "Password reset successful."
}
```

---

# EcoTrack Admin API Documentation

## 🔐 Admin Authentication

---

### 1. Admin Login
- **Endpoint**: `POST /api/auth/admin/login`
- **Description**: Login as an Admin or Superadmin.

#### Request Body:
```json
{
  "email": "admin@example.com",
  "password": "adminpassword"
}
```

#### Response:
```json
{
  "token": "JWT_ADMIN_TOKEN"
}
```

---

### 2. Get Admin Profile
- **Endpoint**: `GET /api/auth/admin/profile`
- **Header**: `Authorization: Bearer <admin_token>`
- **Description**: Retrieve the logged-in admin's profile details.

---

### 3. Update Admin Profile
- **Endpoint**: `PUT /api/auth/admin/profile`
- **Header**: `Authorization: Bearer <admin_token>`
- **Description**: Update name or email of the logged-in admin.

#### Request Body:
```json
{
  "name": "Updated Name",
  "email": "updated@example.com"
}
```

---

## 🧑‍💼 Superadmin-only Admin Management

---

### 4. Create Admin
- **Endpoint**: `POST /api/auth/admin/create`
- **Header**: `Authorization: Bearer <superadmin_token>`
- **Description**: Create a new admin account.

#### Request Body:
```json
{
  "name": "New Admin",
  "email": "newadmin@example.com",
  "password": "adminpass123"
}
```

---

### 5. Get All Admins
- **Endpoint**: `GET /api/auth/admin/all`
- **Header**: `Authorization: Bearer <superadmin_token>`
- **Description**: List all registered admins.

---

### 6. Update Admin by ID
- **Endpoint**: `PUT /api/auth/admin/:id`
- **Header**: `Authorization: Bearer <superadmin_token>`
- **Description**: Update the name or email of a specific admin.

#### Request Body:
```json
{
  "name": "Updated Admin",
  "email": "updatedadmin@example.com"
}
```

---

### 7. Delete Admin by ID
- **Endpoint**: `DELETE /api/auth/admin/:id`
- **Header**: `Authorization: Bearer <superadmin_token>`
- **Description**: Delete an admin account by ID.

---

## 📢 Email Campaigns

---

### 8. Send Email Campaign to Admins
- **Endpoint**: `POST /api/auth/admin/send-campaign`
- **Header**: `Authorization: Bearer <admin_token>`
- **Description**: Send a newsletter or campaign email to all admin users.

#### Request Body:
```json
{
  "subject": "System Update",
  "message": "We have added new features in EcoTrack."
}
```

---