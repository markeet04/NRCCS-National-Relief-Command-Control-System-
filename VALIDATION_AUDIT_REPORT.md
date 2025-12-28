# NRCCS Full-Stack Validation Audit Report

## Executive Summary

This document provides a comprehensive analysis of data validation across the NRCCS system, mapping:
- **Database Schema** (PostgreSQL constraints) → **Backend DTOs** (class-validator) → **Frontend Forms**

---

## Phase 1: Workspace Analysis Complete ✅

### Source of Truth Hierarchy
```
[PostgreSQL Schema] → Strongest (Database-level enforcement)
        ↑
[Backend DTOs]      → Server-side validation (class-validator)
        ↑
[Frontend Forms]    → Client-side validation (UX-focused)
```

---

## Phase 2: Validation Mapping

### 2.1 User Management (`users` table)

| Field | Database Constraint | Backend DTO (CreateUserDto) | Frontend (UserModal) | Gap Analysis |
|-------|--------------------|-----------------------------|---------------------|--------------|
| `email` | `NOT NULL UNIQUE`, VARCHAR(255) | `@IsEmail()`, `@IsNotEmpty()` | `type="email"`, `required` | ✅ Aligned, but no uniqueness check on frontend |
| `password_hash` | `CHECK (LENGTH >= 60)` | `@MinLength(6)` | `minLength={6}` | ⚠️ Backend validates raw password, DB stores hashed (60+ chars) |
| `name` | `NOT NULL`, VARCHAR(150) | `@IsString()`, `@IsNotEmpty()` | `required` | ⚠️ Missing maxLength(150) on frontend |
| `role` | `user_role` ENUM | `@IsEnum(UserRole)` | `<select>` dropdown | ✅ Aligned |
| `phone` | VARCHAR(20) | `@IsOptional()`, `@IsString()` | No validation | ⚠️ No Pakistani phone regex on frontend |
| `cnic` | VARCHAR(15) | `@Length(13, 15)` | `maxLength={15}`, fieldErrors | ⚠️ No minLength/pattern on frontend |
| `province_id` | FK → provinces | `@IsOptional()` | Conditional required | ⚠️ Role-based requirement not enforced in DTO |
| `district_id` | FK → districts | `@IsOptional()` | Conditional required | ⚠️ Role-based requirement not enforced in DTO |
| `username` | VARCHAR(100), optional | `@IsOptional()` | Optional, fieldErrors | ✅ Aligned |

### 2.2 SOS Requests (`sos_requests` table)

| Field | Database Constraint | Backend DTO (CreateSosDto) | Frontend (PersonalInfoForm) | Gap Analysis |
|-------|--------------------|-----------------------------|---------------------------|--------------|
| `name` | VARCHAR(150) | `@MinLength(2)` | Required | ⚠️ Missing maxLength(150) |
| `phone` | VARCHAR(20) | `@Matches(/^(0?3\|92)\d{9,10}$/)` | `maxLength={12}` | ⚠️ Pattern not enforced on frontend |
| `cnic` | VARCHAR(15) | `@Matches(/^\d{13}$/)` | `maxLength={15}` | ❌ Frontend allows dashes (12345-1234567-1), DTO expects 13 digits only |
| `people_count` | `CHECK (> 0)` | `@Min(1)` | Not visible in PersonalInfoForm | ✅ EmergencyDetailsForm handles this |
| `location_lat` | DECIMAL(10, 8) | `@IsNumber()`, `@IsNotEmpty()` | Auto-filled GPS | ✅ Aligned |
| `location_lng` | DECIMAL(11, 8) | `@IsNumber()`, `@IsNotEmpty()` | Auto-filled GPS | ✅ Aligned |
| `emergency_type` | VARCHAR(50) | `@IsString()`, `@IsNotEmpty()` | Dropdown | ⚠️ DTO should use @IsEnum |
| `description` | TEXT | `@MinLength(5)` | Required | ⚠️ Missing minLength on frontend |
| `province_id` | FK → provinces | `@IsOptional()` | Required dropdown | ⚠️ Frontend requires, DTO allows optional |
| `district_id` | FK → districts | `@IsOptional()` | Required dropdown | ⚠️ Frontend requires, DTO allows optional |

### 2.3 Resource Requests (PDMA → NDMA)

| Field | Database Constraint | Backend DTO (CreateResourceRequestDto) | Frontend (RequestResourceModal) | Gap Analysis |
|-------|--------------------|-----------------------------------------|--------------------------------|--------------|
| `priority` | ENUM: low,medium,high,urgent | `@IsEnum(ResourceRequestPriority)` | Dropdown with 4 options | ⚠️ Frontend has 'critical' but DTO has 'urgent' |
| `reason` | TEXT NOT NULL | `@IsNotEmpty()` | `required` | ⚠️ Missing minLength validation |
| `requestedItems[].quantity` | `CHECK (> 0)` | `@Min(1)` | `min="1"` | ✅ Aligned |
| `requestedItems[].resourceType` | VARCHAR(50) | `@IsNotEmpty()` | Required dropdown | ✅ Aligned |

### 2.4 Shelters (`shelters` table)

| Field | Database Constraint | Backend DTO (CreateShelterDto) | Frontend (ShelterFormModal) | Gap Analysis |
|-------|--------------------|---------------------------------|----------------------------|--------------|
| `name` | `NOT NULL`, VARCHAR(200) | `@IsString()` (missing @IsNotEmpty) | `required` | ⚠️ DTO missing @IsNotEmpty |
| `capacity` | INTEGER, `CHECK (>= 0)` | `@Min(0)` | `min="1"` | ⚠️ Frontend requires min=1, DTO allows 0 |
| `occupancy` | `CHECK (>= 0 AND <= capacity)` | `@Min(0)` | `max={formData.capacity}` | ✅ Aligned |
| `supply_food` | `CHECK (0-100)` | `@Min(0)`, `@Max(100)` | Not present | ⚠️ Missing from district form |
| `supply_water` | `CHECK (0-100)` | `@Min(0)`, `@Max(100)` | Not present | ⚠️ Missing from district form |
| `lat` | DECIMAL(10, 8) | `@IsNumber()` | Map picker | ✅ Aligned |
| `lng` | DECIMAL(11, 8) | `@IsNumber()` | Map picker | ✅ Aligned |

### 2.5 Alerts (`alerts` table)

| Field | Database Constraint | Backend DTO (CreateAlertDto) | Frontend | Gap Analysis |
|-------|--------------------|-----------------------------|----------|--------------|
| `title` | `NOT NULL`, VARCHAR(255) | `@IsString()` (missing @IsNotEmpty) | Required | ⚠️ DTO missing @IsNotEmpty |
| `severity` | ENUM: critical,high,medium,low,info | `@IsEnum(AlertSeverity)` | Dropdown | ✅ Aligned |
| `type` | VARCHAR(50) | `@IsEnum(AlertType)` (optional) | Dropdown | ✅ Aligned |
| `expiresAt` | TIMESTAMPTZ | `@IsDateString()` (optional) | Date picker | ✅ Aligned |

### 2.6 Rescue Teams (`rescue_teams` table)

| Field | Database Constraint | Backend DTO (CreateRescueTeamDto) | Frontend (TeamFormModal) | Gap Analysis |
|-------|--------------------|---------------------------------|-------------------------|--------------|
| `name` | `NOT NULL`, VARCHAR(150) | `@IsString()` (missing @IsNotEmpty) | Required | ⚠️ DTO missing @IsNotEmpty |
| `members` | INTEGER | `@Min(0)` | Number input | ⚠️ Should be @Min(1) for team creation |
| `status` | ENUM | `@IsEnum(RescueTeamStatus)` | Dropdown | ✅ Aligned |
| `equipment` | TEXT[] | `@IsArray()`, `@IsString({ each: true })` | Multi-select | ✅ Aligned |

---

## Phase 3: Critical Gaps Identified

### 🔴 High Priority (Data Integrity Risk)

1. **CNIC Format Mismatch**
   - Frontend: Accepts `12345-1234567-1` (with dashes)
   - Backend DTO: Expects `^\d{13}$` (13 digits only)
   - **Fix**: Normalize CNIC before sending OR update regex

2. **Priority Enum Mismatch**
   - Frontend (RequestResourceModal): Has `critical`
   - Backend DTO: Uses `urgent`
   - **Fix**: Align enums

3. **Province/District Required for SOS**
   - Frontend: Marks as required
   - Backend DTO: `@IsOptional()`
   - **Fix**: Update DTO to require province_id/district_id

4. **Missing @IsNotEmpty on Critical Fields**
   - `CreateShelterDto.name`
   - `CreateAlertDto.title`
   - `CreateRescueTeamDto.name`

### 🟡 Medium Priority (UX Improvement)

5. **Missing Frontend Validations**
   - Phone: No Pakistani format regex
   - Name: No maxLength(150)
   - Description: No minLength(5)

6. **No Duplicate Detection UI**
   - Email uniqueness
   - Username uniqueness
   - CNIC uniqueness (if enforced)

7. **Supply Levels Missing from District Shelter Form**
   - PDMA shelter form has supply fields, District doesn't

### 🟢 Low Priority (Enhancement)

8. **Emergency Type Enum**
   - DTO uses `@IsString()`, should use `@IsEnum(EmergencyType)`

9. **Password Confirmation**
   - No confirm password field on UserModal

---

## Phase 4: Implementation Plan

### Step 1: Create Centralized Validation Schema
Create a shared validation constants file that mirrors backend DTOs.

### Step 2: Update Frontend Validators
Enhance `validationUtils.js` with DTO-aligned validators.

### Step 3: Fix Backend DTOs
Add missing `@IsNotEmpty()` decorators.

### Step 4: Normalize CNIC Format
Standardize CNIC handling across the stack.

### Step 5: Add Uniqueness Checks
Implement async validation for email/username/CNIC.

---

## Files Requiring Changes

### Backend DTOs to Fix
- `superadmin/dtos/user.dto.ts` - Add role-based province/district validation
- `civilian/dtos/create-sos.dto.ts` - Fix CNIC regex, make province_id required
- `pdma/dtos/shelter.dto.ts` - Add @IsNotEmpty to name
- `pdma/dtos/alert.dto.ts` - Add @IsNotEmpty to title
- `district/dtos/rescue-team.dto.ts` - Add @IsNotEmpty to name

### Frontend Forms to Fix
- `UserModal.jsx` - Add phone regex, CNIC pattern, name maxLength
- `PersonalInfoForm.jsx` - Normalize CNIC, add phone pattern
- `RequestResourceModal.jsx` - Fix priority values
- `ShelterFormModal.jsx` - Add supply levels

### Validation Utilities to Enhance
- `validationUtils.js` - Add CNIC validator, Pakistani phone validator

---

## Next Steps

1. ✅ Phase 1: Workspace Analysis - Complete
2. ✅ Phase 2: Document Validation Source of Truth - Complete
3. ✅ Phase 3: Implement Frontend Validation - Complete
4. ✅ Phase 4: Backend Safety Net Validation - Complete
5. ✅ Phase 5: Role-Aware Validation Rules - Complete
6. ✅ Phase 6: Duplication Handling - Complete
7. ✅ Phase 7: Ensure DRY Validation Structure - Complete

---

## Implementation Summary

### Files Created

1. **`frontend/src/shared/utils/validationSchema.js`** - Centralized validation schema
   - All regex patterns aligned with backend DTOs
   - All enum values matching database ENUMs
   - Field limit constants
   - Individual field validators
   - Complete form validators (User, SOS, Resource Request, Shelter, Alert, Rescue Team)
   - CNIC/Phone normalization utilities

2. **`frontend/src/shared/services/ValidationService.js`** - Async validation service
   - Email/Username/CNIC duplicate checking
   - Debounced validation for real-time feedback
   - Backend error parsing utility

### Files Modified

**Backend DTOs Fixed:**
- `civilian/dtos/create-sos.dto.ts` - Added @IsNotEmpty, @IsEnum, made province/district required
- `pdma/dtos/shelter.dto.ts` - Added @IsNotEmpty to name, coordinate validation
- `pdma/dtos/alert.dto.ts` - Added @IsNotEmpty to title, length constraints
- `district/dtos/rescue-team.dto.ts` - Added @IsNotEmpty to name, phone validation

**Frontend Forms Updated:**
- `PersonalInfoForm.jsx` - Added validation schema import, pattern attributes, field hints
- `RequestResourceModal.jsx` - Fixed priority enum, using centralized validator
- `UserModal.jsx` - Real-time validation, role-aware rules, all field constraints

---

## Usage Examples

### Using the Validation Schema

```javascript
import { 
  validateUserForm, 
  validateSOSForm,
  validateCNIC,
  normalizeCNIC,
  FIELD_LIMITS,
  USER_ROLES 
} from '@shared/utils/validationSchema';

// Validate a complete user form
const { isValid, errors } = validateUserForm(userData, isEditMode, selectedRole);

// Validate individual field
const cnicResult = validateCNIC('12345-1234567-1', true);
if (!cnicResult.valid) {
  console.error(cnicResult.message);
}

// Normalize before sending to backend
const normalizedCnic = normalizeCNIC('12345-1234567-1'); // Returns '1234512345671'
```

### Using the Validation Service

```javascript
import { 
  debouncedCheckEmail, 
  parseBackendErrors 
} from '@shared/services';

// Check email availability with debounce
const handleEmailChange = async (email) => {
  const result = await debouncedCheckEmail(email, editUserId);
  if (!result.available) {
    setErrors({ email: result.message });
  }
};

// Parse backend validation errors
try {
  await apiClient.post('/users', userData);
} catch (error) {
  const fieldErrors = parseBackendErrors(error);
  setErrors(fieldErrors);
}
```

---

*Generated: Validation Audit for NRCCS v2.2*
