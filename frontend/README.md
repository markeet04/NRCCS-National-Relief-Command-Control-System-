# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



┌─────────────────────────────────────────────────────────────────┐
│                     NRCCS Architecture Blueprint                 │
└─────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────────┐
│ 📁 app/ - Application Configuration                                   │
├───────────────────────────────────────────────────────────────────────┤
│ RESPONSIBILITY: App-level setup, routing, global providers            │
│                                                                        │
│ providers/        → Context providers (Auth, Theme, Settings)         │
│ router/           → All route definitions & route guards              │
│ App.jsx           → Root component with provider composition          │
└───────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────────┐
│ 📁 features/ - Role-Based Feature Modules                             │
├───────────────────────────────────────────────────────────────────────┤
│ RESPONSIBILITY: Business logic & UI for each user role                │
│                                                                        │
│ ┌─────────────────────────────────────────────────────────────────┐  │
│ │ landing/         Public pages (no auth required)                │  │
│ │ ├── components/  Hero, LoginCard, WelcomeScreen, Footer       │  │
│ │ ├── pages/       LandingPage.jsx                              │  │
│ │ └── services/    landingService.js (mock API)                 │  │
│ └─────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│ ┌─────────────────────────────────────────────────────────────────┐  │
│ │ ndma/            National Disaster Management Authority         │  │
│ │ ├── components/  NationalMetrics, ProvinceOverview, etc.      │  │
│ │ ├── pages/       NDMADashboard, AlertsPage, FloodMapPage      │  │
│ │ ├── hooks/       useNationalStats, useProvinceData            │  │
│ │ └── services/    ndmaService.js (CRUD for national level)     │  │
│ │                                                                 │  │
│ │ CODE GOES HERE:                                                 │  │
│ │ • National-level statistics display                            │  │
│ │ • Create/manage nationwide alerts                              │  │
│ │ • View all provinces' status                                   │  │
│ │ • Allocate resources to provinces                              │  │
│ │ • Inter-provincial coordination                                │  │
│ └─────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│ ┌─────────────────────────────────────────────────────────────────┐  │
│ │ pdma/            Provincial Disaster Management Authority       │  │
│ │ ├── components/  DistrictMetrics, ShelterCapacity, etc.       │  │
│ │ ├── pages/       PDMADashboard, ResourceDistribution, etc.    │  │
│ │ ├── hooks/       useDistrictData, useShelters                 │  │
│ │ └── services/    pdmaService.js (provincial-level CRUD)       │  │
│ │                                                                 │  │
│ │ CODE GOES HERE:                                                 │  │
│ │ • Provincial-level statistics                                  │  │
│ │ • Manage district coordination                                 │  │
│ │ • Update shelter capacities                                    │  │
│ │ • Request resources from NDMA                                  │  │
│ │ • View provincial flood map                                    │  │
│ └─────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│ ┌─────────────────────────────────────────────────────────────────┐  │
│ │ district/        Regional/District Operations                   │  │
│ │ ├── components/  SOSQueue, RescueTeamCard, DamageReportForm   │  │
│ │ ├── pages/       DistrictDashboard, SOSManagement, etc.       │  │
│ │ ├── hooks/       useSOSRequests, useRescueTeams               │  │
│ │ └── services/    districtService.js (district-level CRUD)     │  │
│ │                                                                 │  │
│ │ CODE GOES HERE:                                                 │  │
│ │ • Manage SOS requests from civilians                           │  │
│ │ • Assign rescue teams to emergencies                           │  │
│ │ • Track rescue team locations/status                           │  │
│ │ • Create damage verification reports                           │  │
│ │ • Register local shelters                                      │  │
│ └─────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│ ┌─────────────────────────────────────────────────────────────────┐  │
│ │ civilian/        Citizen-Facing Portal                          │  │
│ │ ├── components/  SOSButton, ShelterCard, MissingPersonForm    │  │
│ │ ├── pages/       CivilianHome, EmergencySOS, FindShelters     │  │
│ │ ├── hooks/       useEmergencySOS, useNearestShelters          │  │
│ │ └── services/    civilianService.js (civilian actions)        │  │
│ │                                                                 │  │
│ │ CODE GOES HERE:                                                 │  │
│ │ • Submit emergency SOS with location                           │  │
│ │ • Find nearest shelters with directions                        │  │
│ │ • Report missing persons                                       │  │
│ │ • View flood alerts & evacuation notices                       │  │
│ │ • Track my SOS request status                                  │  │
│ │                                                                 │  │
│ │ NOTE: Uses different layout (CivilianLayout, not DashboardLayout) │
│ └─────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│ ┌─────────────────────────────────────────────────────────────────┐  │
│ │ superadmin/      System Administration                          │  │
│ │ ├── components/  UserManagementTable, APIConfigForm, etc.     │  │
│ │ ├── pages/       SuperAdminDashboard, UserManagement, etc.    │  │
│ │ ├── hooks/       useUserManagement, useAuditLogs              │  │
│ │ └── services/    adminService.js (admin CRUD operations)      │  │
│ │                                                                 │  │
│ │ CODE GOES HERE:                                                 │  │
│ │ • Create/update/delete all user accounts                       │  │
│ │ • Manage provinces and districts                               │  │
│ │ • Configure API integrations (ArcGIS, Weather, etc.)          │  │
│ │ • View audit logs                                              │  │
│ │ • Manage system-wide settings                                  │  │
│ └─────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────────┐
│ 📁 shared/ - Reusable Components & Logic                              │
├───────────────────────────────────────────────────────────────────────┤
│ RESPONSIBILITY: Code used by 2+ features                               │
│                                                                        │
│ ┌─────────────────────────────────────────────────────────────────┐  │
│ │ components/ui/      Pure UI components (design system)          │  │
│ │ ├── Button/         Reusable button with variants              │  │
│ │ ├── Card/           Container component                         │  │
│ │ ├── Modal/          Popup dialogs                               │  │
│ │ ├── Input/          Form input fields                           │  │
│ │ ├── Table/          Data tables                                 │  │
│ │ └── ...             Badge, Tabs, Spinner, etc.                 │  │
│ │                                                                 │  │
│ │ CODE GOES HERE:                                                 │  │
│ │ • Presentational components with no business logic             │  │
│ │ • Styled with Tailwind variants                                │  │
│ │ • Used across all features                                     │  │
│ └─────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│ ┌─────────────────────────────────────────────────────────────────┐  │
│ │ components/layout/  Layout wrappers                             │  │
│ │ ├── DashboardLayout/  Standard dashboard layout (NDMA, PDMA, etc) │
│ │ ├── CivilianLayout/   Simplified layout for civilians          │  │
│ │ ├── Header/           Top navigation bar                        │  │
│ │ ├── Sidebar/          Side navigation (role-based menu)        │  │
│ │ └── Footer/           Footer component                          │  │
│ │                                                                 │  │
│ │ CODE GOES HERE:                                                 │  │
│ │ • DashboardLayout: Used by NDMA/PDMA/District/SuperAdmin      │  │
│ │ • CivilianLayout: Simple layout for civilian portal           │  │
│ │ • Role-based navigation menus                                  │  │
│ └─────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│ ┌─────────────────────────────────────────────────────────────────┐  │
│ │ components/dashboard/  Dashboard-specific widgets               │  │
│ │ ├── StatCard/          KPI card (numbers, trends, icons)       │  │
│ │ ├── ChartCard/         Chart container (recharts wrapper)      │  │
│ │ ├── AlertCard/         Alert/notification card                 │  │
│ │ ├── ResourceCard/      Resource display card                   │  │
│ │ ├── MapContainer/      Map wrapper (ArcGIS/Google Maps)       │  │
│ │ └── ImpactMetrics/     Impact visualization                    │  │
│ │                                                                 │  │
│ │ CODE GOES HERE:                                                 │  │
│ │ • Components used in multiple dashboards                       │  │
│ │ • Data visualization widgets                                   │  │
│ │ • Accept data as props, display it beautifully                │  │
│ └─────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│ ┌─────────────────────────────────────────────────────────────────┐  │
│ │ hooks/              Custom React hooks                          │  │
│ │ ├── useAuth.js         Access auth context (user, login, logout)  │
│ │ ├── useDebounce.js     Debounce search inputs                  │  │
│ │ ├── useLocalStorage.js Sync state with localStorage           │  │
│ │ ├── useMediaQuery.js   Responsive breakpoints                  │  │
│ │ ├── usePagination.js   Table pagination logic                  │  │
│ │ ├── useTable.js        Table state (sort, filter, select)     │  │
│ │ ├── useModal.js        Modal open/close state                  │  │
│ │ └── useNotification.js Toast notifications                     │  │
│ │                                                                 │  │
│ │ CODE GOES HERE:                                                 │  │
│ │ • Reusable stateful logic                                      │  │
│ │ • No UI, just logic                                            │  │
│ │ • Used across multiple features                                │  │
│ └─────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│ ┌─────────────────────────────────────────────────────────────────┐  │
│ │ services/           Mock services (backend-ready)               │  │
│ │ ├── api/                                                        │  │
│ │ │   └── mockClient.js  Mock API client (replace with axios later) │
│ │ └── storage/                                                    │  │
│ │     └── localStorage.js  LocalStorage utilities                │  │
│ │                                                                 │  │
│ │ CODE GOES HERE:                                                 │  │
│ │ • Mock API responses for Deliverable 3                        │  │
│ │ • Will be replaced with real Axios in Deliverable 4           │  │
│ └─────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│ ┌─────────────────────────────────────────────────────────────────┐  │
│ │ utils/              Pure utility functions                      │  │
│ │ ├── animations.js    Framer Motion variants                    │  │
│ │ ├── colors.js        Color manipulation                        │  │
│ │ ├── dates.js         Date formatting (date-fns wrappers)      │  │
│ │ ├── format.js        Number/currency formatting                │  │
│ │ ├── validation.js    Form validation rules                     │  │
│ │ └── helpers.js       Misc helper functions                     │  │
│ │                                                                 │  │
│ │ CODE GOES HERE:                                                 │  │
│ │ • Pure functions (input → output, no side effects)            │  │
│ │ • No React dependencies                                        │  │
│ │ • Easy to test                                                 │  │
│ └─────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────────┐
│ 📁 config/ - Configuration Files                                      │
├───────────────────────────────────────────────────────────────────────┤
│ RESPONSIBILITY: App-wide constants and configuration                  │
│                                                                        │
│ constants.js      → Split your 395-line file into categories         │
│ theme.js          → Tailwind theme customization                     │
│ roles.js          → Role definitions & permissions map               │
│ mockData.js       → Mock data for all features (Deliverable 3)      │
│                                                                        │
│ CODE GOES HERE:                                                        │
│ • API_ENDPOINTS = { NDMA: '/api/ndma', PDMA: '/api/pdma', ... }     │
│ • ROLES = { NDMA: 'ndma', PDMA: 'pdma', ... }                       │
│ • ALERT_TYPES = ['evacuation', 'flood_warning', 'all_clear']        │
│ • Mock responses for all API calls                                   │
└───────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────────┐
│ 📁 styles/ - Global Styles                                            │
├───────────────────────────────────────────────────────────────────────┤
│ index.css         → Tailwind imports + global CSS                    │
└───────────────────────────────────────────────────────────────────────┘

frontend/src/
├── app/
│   ├── providers/
│   │   ├── AppProviders.jsx          # Root provider wrapper
│   │   ├── AuthProvider.jsx          # Mock auth for now
│   │   └── ThemeProvider.jsx         # Theme/settings context
│   ├── router/
│   │   ├── index.jsx                 # Router setup
│   │   ├── routes.jsx                # All route definitions
│   │   └── guards/
│   │       ├── AuthGuard.jsx         # Protected route wrapper
│   │       └── RoleGuard.jsx         # Role-based access
│   └── App.jsx
│
├── features/                          # Role-based feature modules
│   ├── landing/
│   │   ├── components/
│   │   │   ├── Hero/
│   │   │   ├── LoginCard/
│   │   │   ├── WelcomeScreen/
│   │   │   └── BackgroundPattern/
│   │   ├── pages/
│   │   │   └── LandingPage.jsx
│   │   └── services/
│   │       └── landingService.js     # Mock data for now
│   │
│   ├── ndma/                         # National Dashboard
│   │   ├── components/
│   │   │   ├── NationalMetrics/
│   │   │   ├── ProvinceOverview/
│   │   │   └── ResourceAllocation/
│   │   ├── pages/
│   │   │   ├── NDMADashboard.jsx
│   │   │   ├── AlertsPage.jsx
│   │   │   ├── ResourcesPage.jsx
│   │   │   └── FloodMapPage.jsx
│   │   └── services/
│   │       └── ndmaService.js        # Mock API calls
│   │
│   ├── pdma/                         # Provincial Dashboard
│   │   ├── components/
│   │   │   ├── DistrictMetrics/
│   │   │   ├── ShelterCapacity/
│   │   │   └── ResourceRequest/
│   │   ├── pages/
│   │   │   ├── PDMADashboard.jsx
│   │   │   ├── ResourceDistribution.jsx
│   │   │   ├── ShelterManagement.jsx
│   │   │   ├── DistrictCoordination.jsx
│   │   │   └── ProvincialMap.jsx
│   │   └── services/
│   │       └── pdmaService.js
│   │
│   ├── district/                     # District Dashboard
│   │   ├── components/
│   │   │   ├── SOSQueue/
│   │   │   ├── RescueTeamCard/
│   │   │   └── DamageReportForm/
│   │   ├── pages/
│   │   │   ├── DistrictDashboard.jsx
│   │   │   ├── SOSManagement.jsx
│   │   │   ├── RescueTeams.jsx
│   │   │   ├── DamageReports.jsx
│   │   │   └── LocalShelters.jsx
│   │   └── services/
│   │       └── districtService.js
│   │
│   ├── civilian/                     # Civilian Portal
│   │   ├── components/
│   │   │   ├── SOSButton/
│   │   │   ├── ShelterCard/
│   │   │   ├── MissingPersonForm/
│   │   │   └── AlertBanner/
│   │   ├── pages/
│   │   │   ├── CivilianHome.jsx
│   │   │   ├── EmergencySOS.jsx
│   │   │   ├── FindShelters.jsx
│   │   │   ├── MissingPersons.jsx
│   │   │   ├── AlertsNotices.jsx
│   │   │   ├── MyReports.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Help.jsx
│   │   └── services/
│   │       └── civilianService.js
│   │
│   └── superadmin/                   # Super Admin Portal
│       ├── components/
│       │   ├── UserManagementTable/
│       │   ├── APIConfigForm/
│       │   ├── GeographyManager/
│       │   └── AuditLogViewer/
│       ├── pages/
│       │   ├── SuperAdminDashboard.jsx
│       │   ├── UserManagement.jsx
│       │   ├── ProvinceManagement.jsx
│       │   ├── ResourceManagement.jsx
│       │   ├── ShelterManagement.jsx
│       │   ├── AlertManagement.jsx
│       │   ├── APIIntegration.jsx
│       │   └── AuditLogs.jsx
│       └── services/
│           └── adminService.js
│
├── shared/
│   ├── components/
│   │   ├── ui/                       # Reusable UI components
│   │   │   ├── Button/
│   │   │   │   ├── Button.jsx
│   │   │   │   └── index.js
│   │   │   ├── Card/
│   │   │   ├── Modal/
│   │   │   ├── Input/
│   │   │   ├── Select/
│   │   │   ├── Textarea/
│   │   │   ├── Table/
│   │   │   ├── Badge/
│   │   │   ├── Tabs/
│   │   │   ├── Accordion/
│   │   │   └── Spinner/
│   │   │
│   │   ├── layout/                   # Layout components
│   │   │   ├── DashboardLayout/
│   │   │   │   ├── DashboardLayout.jsx
│   │   │   │   └── index.js
│   │   │   ├── Header/
│   │   │   ├── Sidebar/
│   │   │   ├── Footer/
│   │   │   └── SettingsModal/
│   │   │
│   │   ├── dashboard/                # Shared dashboard widgets
│   │   │   ├── StatCard/
│   │   │   ├── ChartCard/
│   │   │   ├── AlertCard/
│   │   │   ├── ResourceCard/
│   │   │   ├── MapContainer/
│   │   │   └── ImpactMetrics/
│   │   │
│   │   └── forms/                    # Reusable form components
│   │       ├── FormField/
│   │       ├── FormSection/
│   │       └── FileUpload/
│   │
│   ├── hooks/                        # Custom hooks
│   │   ├── useAuth.js
│   │   ├── useDebounce.js
│   │   ├── useLocalStorage.js
│   │   ├── useMediaQuery.js
│   │   ├── usePagination.js
│   │   ├── useTable.js
│   │   ├── useModal.js
│   │   ├── useForm.js
│   │   └── useNotification.js
│   │
│   ├── services/                     # Mock services for now
│   │   ├── api/
│   │   │   └── mockClient.js         # Mock API client
│   │   └── storage/
│   │       └── localStorage.js
│   │
│   └── utils/
│       ├── animations.js
│       ├── colors.js
│       ├── dates.js
│       ├── format.js
│       ├── validation.js
│       └── helpers.js
│
├── config/
│   ├── constants.js                  # Split your 395-line file
│   ├── theme.js
│   ├── roles.js
│   └── mockData.js                   # Mock data for all features
│
├── styles/
│   └── index.css                     # Tailwind imports
│
└── main.jsx
