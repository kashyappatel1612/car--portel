# AutoSmart AI – Smart Car Buying, Selling & Comparison Portal

AutoSmart AI is a production-grade full-stack automotive marketplace, car comparison, financial calculator, and AI car recommendation platform. Built with React.js, Vite, Tailwind CSS, Recharts, Express.js, Node.js, and MongoDB.

---

## 🚀 Key Features & Capabilities

### 1. 🔍 Search & Multi-Attribute Filtering
- Multi-faceted filter drawer for **Brand**, **Model**, **Price Range (Slider)**, **Fuel Type**, **Transmission**, **Body Style**, **Seating Capacity**, **Safety Rating (GNCAP Stars)**, and **Location**.
- Real-time search query filtering backed by REST API endpoints.
- Sorting by **Price (Low to High / High to Low)**, **Mileage**, **Safety Rating**, **Popularity**, and **Newest Arrivals**.

### 2. ⚡ Algorithmic Smart Score (0–100)
- Every vehicle features an automated 0–100 **Smart Score** calculated from 6 sub-metrics:
  - **Safety Rating** (GNCAP stars + airbag count)
  - **Fuel Economy / Electric Range**
  - **Power & Performance** (Horsepower + Torque)
  - **Value for Money** (Price vs. Equipment ratio)
  - **Maintenance Cost Estimate**
  - **3-Year Resale Retention**

### 3. 🚗 Side-by-Side Car Comparison (2–4 Cars)
- Dynamic comparison matrix comparing up to 4 selected cars across 16+ telemetry specifications.
- **Automated Category Winner Badges**: Highlights the best vehicle in each metric (Lowest Price, Best Mileage, Highest Power, Best Safety).
- **Verdict Summary Cards**: Bottom recommendations for *Best Overall*, *Best Value*, *Best Mileage*, *Best Safety*, and *Best Performance*.

### 4. 🤖 AI Car Advisor
- 10-question interactive questionnaire evaluating family size, daily mileage, city/highway driving ratio, fuel preference, and primary decision priority.
- Multi-attribute recommendation engine returning top 3 personalized vehicle matches with match percentage, rationale, advantages, and drawbacks.
- Built-in fallback rule engine + optional Google Gemini API integration.

### 5. 🧮 Financial & Valuation Calculators
- **Car Loan EMI Calculator**: Interactive loan amount sliders, interest rate inputs, tenure selection, monthly EMI formulas, and Recharts pie chart breakdown.
- **5-Year Total Ownership Cost**: Calculates fuel, service, insurance, tyre replacement, and net depreciation over 1, 3, and 5 years with stacked Recharts bar chart.
- **Used Car Fair Market Valuation**: Algorithmic estimator for pre-owned cars factoring age, odometer reading, owner history, brand retention tier, and physical condition.

### 6. 🏷️ Sell Your Car & Seller Inventory
- User sell submission form (Brand, Model, Variant, Year, KM driven, Fuel, Condition, Price, Description, Images).
- **Listing Approval Queue**: Submitted listings are placed in `pending` state until reviewed and approved by an Admin.
- Seller dashboard to edit listings, track enquiries, and mark cars as `Sold`.

### 7. 📩 Enquiry & Messaging System
- "Contact Seller" modal on every vehicle details page.
- Direct buyer-to-seller communication tracking with status lifecycle (`new`, `contacted`, `closed`).

### 8. 🛡️ Role-Based Authentication & Protection
- JWT authentication with `bcryptjs` password hashing.
- Three user roles: **User / Buyer**, **Seller**, and **Admin**.
- Protected routes and authorization middleware.

### 9. 📊 Admin Dashboard & Telemetry
- Platform KPI counts (Users, Sellers, Cars, Active/Pending Listings, Average Price, Enquiries).
- **Recharts Data Visualizations**: Monthly activity bar chart, fuel distribution pie chart, price tier distribution chart.
- User management table (role switching, account deletion).
- Pending listing approval queue & review moderation panel.

---

## 🛠️ Technology Stack

- **Frontend**: React.js, Vite, React Router DOM v6, Tailwind CSS v4, Axios, Recharts, Lucide React icons.
- **Backend**: Node.js, Express.js, JWT, bcryptjs, Helmet, CORS, Morgan.
- **Database**: MongoDB & Mongoose (Includes automatic zero-config `mongodb-memory-server` fallback).

---

## 🔑 Demo Credentials

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@autosmart.ai` | `password123` | Full Admin Dashboard, Approve Listings, Manage Users & Cars |
| **Seller** | `seller@autosmart.ai` | `password123` | Create & Manage Inventory, View Enquiries, Mark Sold |
| **User / Buyer** | `user@autosmart.ai` | `password123` | Browse, Wishlist, Compare, Write Reviews, Contact Sellers |

> *Quick 1-Click login buttons are available on the Sign In page.*

---

## 💻 Installation & Setup Instructions

### Prerequisites
- Node.js v18+
- npm v9+

### 1. Clone & Setup Project
```bash
git clone <repository-url>
cd AutoSmart-AI
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run seed     # Seeds DB with 22+ cars, 10 dealers, reviews, price history & demo users
npm run dev      # Starts Express server on http://localhost:5000
```

### 3. Frontend Setup (In a new terminal window)
```bash
cd frontend
npm install
npm run dev      # Starts Vite React application on http://localhost:3000
```

Open `http://localhost:3000` in your web browser.

---

## 🌐 API Endpoint Reference

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user account | No |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT | No |
| `GET` | `/api/auth/me` | Fetch logged-in user profile | Yes |
| `GET` | `/api/cars` | Get all cars with search, filter & sorting | No |
| `GET` | `/api/cars/categories` | Get homepage curated car categories | No |
| `GET` | `/api/cars/:id` | Get single car details & increment views | No |
| `GET` | `/api/listings` | Get public approved seller listings | No |
| `POST` | `/api/listings` | Submit sell car listing | Yes |
| `PUT` | `/api/listings/:id/status` | Update listing status (Admin approve / Seller mark sold) | Yes |
| `POST` | `/api/advisor/recommend` | Generate AI car recommendations | No |
| `POST` | `/api/calculator/emi` | Calculate loan EMI & chart data | No |
| `POST` | `/api/calculator/ownership` | Calculate 5-year total ownership cost | No |
| `POST` | `/api/calculator/used-car-valuation` | Calculate pre-owned car fair market price | No |
| `GET` | `/api/wishlist` | Fetch user saved wishlist | Yes |
| `POST` | `/api/wishlist/:carId` | Add car to wishlist | Yes |
| `DELETE` | `/api/wishlist/:carId` | Remove car from wishlist | Yes |
| `GET` | `/api/reviews/car/:carId` | Get reviews & average rating for a car | No |
| `POST` | `/api/reviews/car/:carId` | Write car review (unique per user) | Yes |
| `POST` | `/api/enquiries` | Submit contact seller query | Yes |
| `GET` | `/api/dealers` | Get dealer showrooms with city filter | No |
| `GET` | `/api/price-history/car/:carId`| Get historical price trend points | No |
| `GET` | `/api/admin/stats` | Fetch admin KPIs & chart datasets | Admin |
| `GET` | `/api/admin/users` | List all users for admin management | Admin |
| `GET` | `/api/admin/listings/pending` | List pending listings queue for admin approval | Admin |

---

## 📜 License
This project is open-source and built for college demonstration and production deployment.
