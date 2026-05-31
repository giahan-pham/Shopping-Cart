# Shopping-Cart: Vinyl Record Store Web App

## Overview

Shopping-Cart is a full-stack web application for a small vinyl record store, with both a customer store interface and a protected admin area. Customers can browse and search records, view product details, create an account, log in, and manage their shopping cart. Admin users can manage the record catalogue and review user cart activity through separate admin pages.

The project is built with a React and Vite frontend, a FastAPI backend, and a MySQL database. It demonstrates an e-commerce workflow where product data, user authentication, cart operations, and admin-only actions are handled through a shared backend API.


## Problem It Solves

An e-commerce website needs to support both customer browsing and admin management. Customers should be able to explore and search products before creating an account, while cart actions should still be protected and linked to authenticated users. At the same time, admins need a controlled way to create, update, delete, and review product data without editing the database directly.

This application addresses both sides by connecting the store interface, cart logic, and admin tools through one backend and database. Guests can browse records freely, logged-in customers can manage their own carts, and admins can manage the record catalogue and keep track of user activity through protected role-based access.

## Demo

![Demo](resources/demo.gif)

or [View on YouTube](https://youtu.be/7qK3f9BGvBc)

## Technical Stack

### Frontend

- React
- Vite (development server and build tool)
- React Router
- Fetch API for HTTP requests
- custom CSS

### Backend

- FastAPI (RESTful API)
- SQLModel + SQLAlchemy (data modeling and queries)
- Pillow (image validation and processing)

### Database

- MySQL

### Authentication/Security

- JWT authentication using PyJWT
- Password hashing with bcrypt


## System Architecture

```mermaid
flowchart TB
    subgraph Client[Client Layer]
        Browser[Customer or Admin Browser]
        Frontend[React + Vite SPA]
        ApiModules[Frontend API modules]
        Browser --> Frontend
        Frontend --> ApiModules
    end

    subgraph Backend[Backend Layer]
        FastAPI[FastAPI app]
        Routers[Routes: auth, records, cart, admin]
        Security[JWT validation + admin role checks]
        Uploads[Upload utilities + static file serving]
        FastAPI --> Routers
        Routers --> Security
        Routers --> Uploads
    end

    subgraph Data[Data Layer]
        ORM[SQLModel + SQLAlchemy]
        MySQL[(MySQL)]
        Media[(media/static/records)]
        ORM --> MySQL
    end

    ApiModules -->|Fetch HTTP requests| FastAPI
    Security --> ORM
    Uploads --> Media
    Frontend -->|Image requests to /static| Uploads
```

In summary, the React frontend sends requests through API helper modules, the FastAPI backend handles route logic and security checks, and SQLModel persists data in MySQL.

## Application Workflow

```mermaid
flowchart TD
    A[Open app] --> B[Go to Records page]
    B --> C[Browse, search, and sort records]
    C --> F[Click Add to Cart]
    C --> D[Click a record]
    D --> E[View details modal]
    E --> F
    F --> G{Logged in?}

    G -- No --> H[Show login warning]
    H --> I[Go to Login/Register]

    G -- Yes --> J[Item added to cart]
    J --> K[Cart side panel opens with updated total]
    K --> L[Update quantity, remove item, or clear cart]

    I --> M{Admin account?}
    M -- Yes --> N[Open Admin Dashboard]
    M -- No --> C
    N --> O[Go to /admin/records]
    O --> | Choose Browse records|C
    O --> P[Create, edit, or delete records]
    O --> | Choose View user carts| Q[Go to /admin/carts]
    Q --> R[View user cart summaries]
```

Key flows:
1. Customer flow: users open the records page, browse or filter the catalogue, then either add directly from a record card or open record details first and add to cart.
2. Cart flow: if not logged in, users are prompted to log in first; once logged in, the cart opens with updated totals and users can adjust quantities, remove items, or clear the cart.
3. Admin flow: admin users go to /admin/records to manage records, or /admin/carts to view user cart summaries. Admin can also navigate to the public records page from the admin dashboard to browse as a customer.

## Features

### Customer Features

- Browse all available records.
- Live search records by title or artist.
- Sort records by title, artist, price, or release year.
- Open a record details modal when clicking on a record.
- Add records to cart with quantity and stock checks.
- Open the cart panel with updated data immediately after adding an item, without breaking browsing flow.
- Update item quantity, remove an item, or clear the full cart.
- View the live cart total.

### Admin Features

- Admin access through protected admin routes.- Create new records.
- Edit existing records.
- Delete records (related cart items are removed first in backend).
- Upload or replace record images.
- View user cart summaries from the admin dashboard.

### Security Features
- JWT authentication for login and protected routes.
- Password hashing with bcrypt.
- Allowing guest browsing but requiring login for cart actions.
- Role-based access control for admin-only actions.

### User UX/UI Features

- Confirmation modals for important actions (logout, delete, clear cart, edit confirmation).
- Toast messages for success and error feedback.
- Product details and cart actions are shown through modals and a side panel, allowing users to continue browsing without leaving the page.
- In admin record management, success/error feedback is shown and the list scrolls to the newly added or updated record.
- Responsive layouts for smaller screens.

## Conceptual Entities

![Record store ERD](resources/app_erd.png)

The core entities for this system are `User`, `Record`, `Cart`, and `CartItem`, as shown in the ERD above.

* A user is assigned a cart in the application workflow.
* A cart can contain many cart items.
* Each cart item links a cart to one record and stores the selected quantity.
* Records can appear in different users’ carts through separate cart items.


## Folder Structure

```text
Shopping-Cart/
├── .gitignore
├── README.md
├── backend/
│   ├── app.py                      # FastAPI app setup, CORS, startup seeding
│   ├── models.py                   # SQLModel tables: User, Record, Cart, CartItem
│   ├── schema.py                   # Request/response schema models
│   ├── requirements.txt            # Python dependencies
│   ├── core/
│   │   ├── config.py               # Loads .env and parses ADMIN_USERS seed config
│   │   ├── database.py             # SQLModel engine/session helpers
│   │   ├── security.py             # JWT + password hashing + role guards
│   │   └── upload_utils.py         # Image validation, resize, storage path handling
│   ├── routes/
│   │   ├── auth.py                 # Register, token login, current-user endpoint
│   │   ├── cart.py                 # Customer cart CRUD-style operations
│   │   ├── records.py              # Public record reads + admin record CRUD + image upload
│   │   └── admin.py                # Admin user cart overview endpoint
│   └── media/
│       └── static/
│           └── records/            # Default and uploaded record cover images
├── database/
│   └── record_store_export.sql     # SQL export with sample data
├── resources/                      # Documentation resources
│   ├── app_erd.png                 
│   └── demo.gif                    
└── frontend/
    ├── package.json                # Frontend scripts + dependencies
    ├── package-lock.json           # npm lockfile
    ├── index.html                  # Vite HTML entry
    ├── vite.config.js              # Vite config
    ├── eslint.config.js            # ESLint config
    └── src/
        ├── App.jsx                 # Main route map + global cart/toast wiring
        ├── App.css                 # App-level layout styles
        ├── main.jsx                # React bootstrap entry
        ├── index.css               # Global CSS variables/base styling
        ├── api/
        │   ├── userApi.js          # Base fetch wrapper + API base URL + auth headers
        │   ├── authApi.js          # Register/login/me helpers + localStorage auth helpers
        │   ├── recordsApi.js       # Record endpoint helpers
        │   ├── cartApi.js          # Cart endpoint helpers
        │   └── adminApi.js         # Admin cart overview endpoint helper
        ├── components/
        │   ├── AuthForm.jsx        # Login/register form UI
        │   ├── AuthForm.css
        │   ├── NavBar.jsx          # Customer navigation bar
        │   ├── NavBar.css
        │   ├── ProtectedRoute.jsx  # Client-side auth/role route protection
        │   ├── Toast.jsx           # Toast component
        │   ├── Toast.css
        │   ├── admin/
        │   │   ├── AdminNavBar.jsx       # Admin sidebar nav and mobile menu toggle
        │   │   ├── AdminRecordFilter.jsx # Record search/sort controls and add action
        │   │   ├── AdminRecordList.jsx   # Admin record list container with auto-scroll support
        │   │   ├── AdminRecordRow.jsx    # Single record row with edit/delete actions
        │   │   ├── RecordForm.jsx        # Form for adding/editing record details
        │   │   ├── UserCartCard.jsx      # Card view for one user's cart summary
        │   │   ├── UserCartFilter.jsx    # User cart search and sort controls
        │   │   ├── UserCartList.jsx      # List renderer for filtered user carts
        │   │   └── styles/            # Admin component stylesheets
        │   ├── cart/                   # Customer cart components
        │   │   ├── CartItemCard.jsx
        │   │   ├── CartSidePanel.jsx
        │   │   ├── CartSummary.jsx
        │   │   └── styles/            # Cart component stylesheets
        │   └── records/                #Record listing components
        │       ├── RecordCard.jsx
        │       ├── RecordFilters.jsx
        │       ├── RecordImage.jsx
        │       └── styles/            # Record component stylesheets
        ├── pages/
        │   ├── AuthPage.jsx
        │   ├── AuthPage.css
        │   ├── RecordShoppingPage.jsx
        │   ├── RecordShoppingPage.css
        │   └── admin/
        │       ├── AdminLayout.jsx
        │       ├── ManageRecords.jsx
        │       ├── ManageCarts.jsx
        │       └── styles/            # Admin page stylesheets
        ├── modals/                 #modals for confirmations and record details popup
        │   ├── ConfirmCartItemRemove.jsx
        │   ├── ConfirmClearCard.jsx
        │   ├── ConfirmLogout.jsx
        │   ├── ConfirmRecordDelete.jsx
        │   ├── ConfirmRecordEdit.jsx
        │   ├── LoginWarning.jsx
        │   ├── RecordDetails.jsx
        │   └── styles/                # Shared modal stylesheets
        └── utils/
            ├── filterRecords.js     # Record search matching helpers
            ├── sortRecords.js       # Record sorting logic
            ├── filterUser.js        # Admin cart user filter helpers
            ├── sortUser.js          # Admin cart user sort helpers
            └── formatCurrency.js    # AUD currency formatting
```

## Workload Division

This project was completed individually, including frontend, backend API development, database design, and project documentation.

## Environment Variables

Before running the backend, create a `.env` file inside the `backend/` folder:

```text
backend/.env
```

This file is used for local database connection, JWT configuration, and admin account seeding. It should be created manually based on the local MySQL setup.

Required variables:

```env
DATABASE_URL=mysql+pymysql://root:your_mysql_password@localhost:3306/record_store
SECRET_KEY=replace_this_with_a_long_random_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=120
ADMIN_USERS='[{"username":"admin","password":"admin123"}]'
```

The values above are examples for local development. Replace the MySQL username, password, and database name if they are different on your machine. The `.env` file should not be committed to GitHub as it may contain local credentials and secret keys.

## Run Instructions

1. Clone the repository.

```bash
git clone https://github.com/giahan-pham/Shopping-Cart.git
cd Shopping-Cart
```

2. Start MySQL and create the database.

```sql
CREATE DATABASE record_store;
```

3. Import the sample database export.

```bash
mysql -u root -p record_store < database/record_store_export.sql
```

4. Create the backend environment file.

```bash
cd backend
touch .env
```

Add the required environment variables into `backend/.env`, then update the values based on your local MySQL setup.

5. Set up and run the backend.

```bash
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload
```

6. Set up and run the frontend in a second terminal.

```bash
cd frontend
npm install
npm run dev
```

7. Open the app in the browser.

* Frontend: `http://localhost:5173`
* Backend API: `http://localhost:8000`

If the backend runs on a different port, update `API_BASE_URL` in `frontend/src/api/userApi.js`.


## Database Export

A database export file is included so the project can be recreated with the same sample data.

```text
database/
└── record_store_export.sql
```

After creating the local database, import the export file:

```bash
mysql -u root -p record_store < database/record_store_export.sql
```

Sample login accounts from the exported database:

| Role | Username | Password |
| --- | --- | --- |
| Customer | user | user123 |
| Customer | user2 | user2123 |
| Customer | user3 | user3123 |
| Customer | user4 | user4123 |
| Customer | user5 | user5123 |
| Admin | admin | admin123 |
| Admin | staff | Staff123! |
| Admin | manager | Manager123! |

If the database export is not imported, the backend can still create the tables, but the record catalogue may be empty until records are added manually through the admin interface.


## Notes and Limitations
- Admin users cannot be registered through the frontend. Admin accounts must be configured through the `ADMIN_USERS` environment variable before starting the backend.
- Checkout/payment is not implemented (cart only).
- Project setup is on local development.
- Image uploads are stored locally in the backend folder due to this being a local development setup (no cloud storage).