
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
