# NRCCS Database - Quick Reference Guide
**For: Development Team**  
**Schema:** v2.2 Production-Ready  
**Date:** December 15, 2025

---

## 🎯 DEPLOYMENT COMMANDS

### Deploy to Neon (One Command)
```bash
# Make sure you're in backend/nrccs directory
cd backend/nrccs

# Run the production schema
psql "$DATABASE_URL" -f schema_v2.2_PRODUCTION_READY.sql
```

---

## 📋 CRITICAL RULES

### 1. ALWAYS Filter Soft Deletes
```typescript
// ❌ WRONG
const users = await userRepo.find();

// ✅ CORRECT
const users = await userRepo.find({ where: { is_deleted: false } });
```

### 2. ALWAYS Validate Sessions
```typescript
// In your auth middleware
const session = await sessionRepo.findOne({
  where: { user_id: userId, expires_at: MoreThan(new Date()) }
});
if (!session) throw new UnauthorizedException();
```

### 3. ALWAYS Map camelCase ↔ snake_case
```typescript
// Frontend sends: { shelterName: "..." }
// Database needs: { shelter_name: "..." }

// Use transformer (see MIGRATION_EXECUTIVE_SUMMARY.md)
```

### 4. ALWAYS Filter by Role
```typescript
// PDMA can only see their province
if (user.role === 'pdma') {
  query.where.province_id = user.province_id;
}

// Civilians can only see their own SOS
if (user.role === 'civilian') {
  query.where.submitted_by = user.id;
}
```

---

## 🔑 AUTO-GENERATED IDs

**These fields auto-generate - DO NOT set them manually:**

```typescript
// ✅ Correct - Let database generate ID
await sosRepo.insert({
  // id: omit this!
  name: "Test User",
  location: "Test Location"
});
// Returns: { id: "SOS-2025-0001" }

// ✅ Correct - Let trigger generate case number
await missingPersonRepo.insert({
  // case_number: omit this!
  name: "John Doe",
  age: 25
});
// Returns: { case_number: "MP-2025-0001" }
```

**Auto-generated fields:**
- `sos_requests.id` → `SOS-YYYY-XXXX`
- `damage_reports.id` → `DR-XXX`
- `rescue_teams.id` → `RT-XXX`
- `missing_persons.case_number` → `MP-YYYY-XXXX`

---

## 📊 COMMON QUERIES

### Get Dashboard Stats
```sql
-- NDMA National Stats
SELECT * FROM v_national_stats;

-- PDMA Provincial Stats (for specific province)
SELECT * FROM v_provincial_stats WHERE province_id = 1;

-- District Stats
SELECT * FROM v_district_stats WHERE district_id = 5;
```

### Get Active SOS Requests
```sql
SELECT * FROM sos_requests 
WHERE status IN ('Pending', 'Assigned', 'En-route', 'In Progress')
  AND is_deleted = FALSE
  AND district_id = 5
ORDER BY priority DESC, created_at ASC;
```

### Get Available Shelters
```sql
SELECT * FROM shelters
WHERE district_id = 5
  AND status IN ('available', 'limited')
  AND is_deleted = FALSE
  AND occupancy < capacity;
```

### Get Active Alerts
```sql
SELECT * FROM alerts
WHERE status = 'active'
  AND (expires_at IS NULL OR expires_at > NOW())
  AND (district_id = 5 OR district_id IS NULL); -- Include national alerts
```

---

## 🔐 ENUM VALUES (Use Exactly As Shown)

### sos_status
`'Pending'`, `'Assigned'`, `'En-route'`, `'In Progress'`, `'Rescued'`, `'Completed'`, `'Cancelled'`

### sos_priority
`'Critical'`, `'High'`, `'Medium'`, `'Low'`

### user_role
`'superadmin'`, `'ndma'`, `'pdma'`, `'district'`, `'civilian'`

### alert_severity
`'critical'`, `'high'`, `'medium'`, `'low'`, `'info'`

### shelter_status
`'available'`, `'limited'`, `'full'`, `'operational'`, `'closed'`

### rescue_team_status
`'available'`, `'busy'`, `'deployed'`, `'on-mission'`, `'unavailable'`, `'resting'`

---

## 🗄️ TABLE RELATIONSHIPS (Most Important)

```
users
  ├─→ sos_requests (submitted_by)
  ├─→ missing_persons (reported_by_user_id)
  ├─→ damage_reports (submitted_by_user_id, verified_by)
  └─→ user_sessions (user_id)

provinces
  └─→ districts (province_id)
        ├─→ shelters (district_id)
        ├─→ rescue_teams (district_id)
        ├─→ sos_requests (district_id)
        └─→ damage_reports (district_id)

sos_requests
  ├─→ sos_request_timeline (sos_request_id)
  ├─→ sos_request_updates (sos_request_id)
  └─→ rescue_teams (assigned_team_id)

resources
  ├─→ resource_history (resource_id)
  └─→ resource_allocations (resource_id)
```

---

## ✅ VALIDATION CONSTRAINTS

### Supply Levels (0-100)
```typescript
// ✅ Valid
await shelterRepo.update(id, { supply_food: 75 });

// ❌ Invalid - will throw error
await shelterRepo.update(id, { supply_food: 150 });
// ERROR: new row violates check constraint "shelters_supply_food_check"
```

### Password Hash (min 60 chars)
```typescript
// ✅ Valid (bcrypt hash is 60 chars)
const hash = await bcrypt.hash(password, 10); // Always 60 chars

// ❌ Invalid
await userRepo.insert({ password_hash: "short" });
// ERROR: new row violates check constraint "users_password_hash_check"
```

### Occupancy Cannot Exceed Capacity
```typescript
// ❌ Invalid
await shelterRepo.update(id, { 
  capacity: 100, 
  occupancy: 150  // ERROR!
});
```

---

## 🛠️ TYPEORM ENTITY EXAMPLES

### Shelter Entity
```typescript
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('shelters')
export class Shelter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ name: 'district_id', nullable: true })
  districtId: number;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  lat: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  lng: number;

  @Column({ default: 0 })
  capacity: number;

  @Column({ default: 0 })
  occupancy: number;

  @Column({ type: 'enum', enum: ShelterStatus, default: ShelterStatus.AVAILABLE })
  status: ShelterStatus;

  @Column({ name: 'supply_food', default: 100 })
  supplyFood: number;

  @Column({ name: 'supply_water', default: 100 })
  supplyWater: number;

  @Column({ type: 'text', array: true, nullable: true })
  facilities: string[];

  @Column({ name: 'is_deleted', default: false })
  isDeleted: boolean;

  @Column({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => District, district => district.shelters)
  district: District;
}
```

### SOS Request Entity
```typescript
@Entity('sos_requests')
export class SosRequest {
  @PrimaryColumn({ length: 20 })
  id: string; // Auto-generated by trigger

  @Column({ length: 150, nullable: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  location: string;

  @Column({ name: 'location_lat', type: 'decimal', precision: 10, scale: 8, nullable: true })
  locationLat: number;

  @Column({ name: 'location_lng', type: 'decimal', precision: 11, scale: 8, nullable: true })
  locationLng: number;

  @Column({ type: 'enum', enum: SosStatus, default: SosStatus.PENDING })
  status: SosStatus;

  @Column({ type: 'enum', enum: SosPriority, default: SosPriority.MEDIUM })
  priority: SosPriority;

  @Column({ name: 'submitted_by', nullable: true })
  submittedBy: number;

  @Column({ name: 'district_id', nullable: true })
  districtId: number;

  @Column({ name: 'assigned_team_id', length: 20, nullable: true })
  assignedTeamId: string;

  @Column({ name: 'is_deleted', default: false })
  isDeleted: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'submitted_by' })
  submitter: User;

  @ManyToOne(() => RescueTeam)
  @JoinColumn({ name: 'assigned_team_id' })
  assignedTeam: RescueTeam;

  @OneToMany(() => SosTimeline, timeline => timeline.sosRequest)
  timeline: SosTimeline[];
}
```

---

## 🔄 SOFT DELETE IMPLEMENTATION

### Service Method
```typescript
async softDelete(id: number) {
  return await this.userRepo.update(id, {
    is_deleted: true,
    deleted_at: new Date()
  });
}

async restore(id: number) {
  return await this.userRepo.update(id, {
    is_deleted: false,
    deleted_at: null
  });
}

async findActive() {
  return await this.userRepo.find({
    where: { is_deleted: false }
  });
}
```

### Global Query Builder
```typescript
export class BaseService<T> {
  protected addSoftDeleteFilter(qb: SelectQueryBuilder<T>) {
    return qb.andWhere('is_deleted = :isDeleted', { isDeleted: false });
  }
}
```

---

## 🎨 FRONTEND API RESPONSE FORMAT

### What Frontend Expects (camelCase)
```json
{
  "id": "SOS-2025-0001",
  "name": "John Doe",
  "phone": "+92-300-1234567",
  "location": "123 Main St",
  "locationLat": 31.5204,
  "locationLng": 74.3587,
  "status": "Pending",
  "priority": "High",
  "submittedBy": 1,
  "districtId": 5,
  "createdAt": "2025-12-15T10:30:00Z"
}
```

### What Database Returns (snake_case)
```json
{
  "id": "SOS-2025-0001",
  "name": "John Doe",
  "phone": "+92-300-1234567",
  "location": "123 Main St",
  "location_lat": 31.5204,
  "location_lng": 74.3587,
  "status": "Pending",
  "priority": "High",
  "submitted_by": 1,
  "district_id": 5,
  "created_at": "2025-12-15T10:30:00Z"
}
```

### Transformer Usage
```typescript
@Get('sos/:id')
async getSOSById(@Param('id') id: string) {
  const sos = await this.sosService.findOne(id);
  return toCamelCase(sos); // Convert for frontend
}

@Post('sos')
async createSOS(@Body() dto: any) {
  const dbData = toSnakeCase(dto); // Convert from frontend
  const sos = await this.sosService.create(dbData);
  return toCamelCase(sos);
}
```

---

## 📞 NEED HELP?

### Documentation Files
- **Schema Structure:** `schema_v2.2_PRODUCTION_READY.sql`
- **RBAC Rules:** `SCHEMA_VALIDATION_REPORT.md`
- **API Contracts:** `FRONTEND_SCHEMA_COMPATIBILITY_REPORT.md`
- **Field Mappings:** `FRONTEND_DATA_CONTRACTS_AUDIT.md`
- **Deployment Guide:** `MIGRATION_EXECUTIVE_SUMMARY.md`

### Common Errors & Solutions

**Error:** `relation "sos_requests" does not exist`  
**Solution:** Run `schema_v2.2_PRODUCTION_READY.sql` on Neon

**Error:** `column "alertType" does not exist`  
**Solution:** Use `alert_type` or implement camelCase transformer

**Error:** `invalid input value for enum`  
**Solution:** Check ENUM values section above (case-sensitive!)

**Error:** `violates check constraint "shelters_supply_food_check"`  
**Solution:** Supply levels must be 0-100

---

## ✅ PRE-DEPLOYMENT CHECKLIST

- [ ] Neon database created
- [ ] DATABASE_URL in `.env` updated
- [ ] `schema_v2.2_PRODUCTION_READY.sql` executed successfully
- [ ] 25 tables exist in database
- [ ] Auto-generated IDs work (test with INSERT)
- [ ] Views return data (test `SELECT * FROM v_national_stats`)
- [ ] TypeORM entities created
- [ ] Soft delete filters implemented
- [ ] Session validation middleware created
- [ ] camelCase ↔ snake_case transformer ready
- [ ] RBAC filters implemented in services

---

**Last Updated:** December 15, 2025  
**Schema Version:** v2.2  
**Status:** ✅ Production-Ready
