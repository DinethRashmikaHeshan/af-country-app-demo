# 🌍 Country Hunt

**Country Hunt** is an interactive web application designed to help users discover and learn about countries worldwide. With a sleek interface, users can explore detailed country information, filter by region, and save their favorite countries to a personalized profile. Built with modern web technologies, this app combines performance, usability, and responsive design.

![Countries Explorer Screenshot](https://i.ibb.co/DgPvRZJq/Screenshot-31.png)

---

## 📑 Table of Contents

- [✨ Features](#-features)
- [🛠 Technologies Used](#-technologies-used)
- [🚀 Getting Started](#-getting-started)
  - [📋 Prerequisites](#-prerequisites)
  - [📦 Installation](#-installation)
  - [🔑 Environment Variables](#-environment-variables)
- [📖 Usage](#-usage)
- [🏗 Build Process](#-build-process)
- [🧪 Testing](#-testing)
- [📂 Project Structure](#-project-structure)
- [📊 API Integration Report](#-api-integration-report)
  - [🌐 REST Countries API](#rest-countries-api)
  - [🔒 Supabase Integration](#supabase-integration)
  - [⚠️ Challenges and Solutions](#challenges-and-solutions)
- [🔮 Future Improvements](#-future-improvements)
- [🤝 Contributing](#-contributing)
- [📜 License](#-license)

---

## ✨ Features

Explore the world with these powerful features:

- **Global Search & Filters**: Browse or search for countries and filter by region.
- **Detailed Country Profiles**:
  - Population, capital, and languages
  - Currency and geographic details
- **User Accounts**:
  - Secure authentication with email/password or Google OAuth
  - Save and manage favorite countries
- **Responsive Design**: Optimized for both mobile and desktop devices

---

## 🛠 Technologies Used

The app is built with a modern tech stack for performance and scalability:

- **Frontend**: [Next.js 14](https://nextjs.org/), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/) components
- **Backend & Database**: [Supabase](https://supabase.com/) (Authentication & PostgreSQL)
- **Data Source**: [REST Countries API](https://restcountries.com/)
- **Testing**: [Jest](https://jestjs.io/), [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

---

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### 📋 Prerequisites

- [Node.js](https://nodejs.org/) 18.x or later
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A [Supabase](https://supabase.com/) account for authentication and database

### 📦 Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/SE1020-IT2070-OOP-DSA-25/af-2-DinethRashmikaHeshan.git
   ```

2. **Install Dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Set Up Supabase**:
   - Create a new project in [Supabase](https://supabase.com/).
   - Create a `favorites` table with this schema:
     ```sql
     create table favorites (
       id uuid default uuid_generate_v4() primary key,
       user_id uuid references auth.users not null,
       country_code text not null,
       created_at timestamp with time zone default timezone('utc'::text, now()) not null,
       unique(user_id, country_code)
     );
     ```
   - Enable Row Level Security (RLS) and add policies:
     ```sql
     -- Enable RLS
     alter table favorites enable row level security;

     -- Policy for viewing favorites
     create policy "Users can view their own favorites"
       on favorites for select
       using (auth.uid() = user_id);

     -- Policy for inserting favorites
     create policy "Users can insert their own favorites"
       on favorites for insert
       with check (auth.uid() = user_id);

     -- Policy for deleting favorites
     create policy "Users can delete their own favorites"
       on favorites for delete
       using (auth.uid() = user_id);
     ```

### 🔑 Environment Variables

Create a `.env` file in the project root and add the following:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 📖 Usage

1. **Start the Development Server**:
   ```bash
   npm run dev
   ```

2. **Open the App**:
   Visit [http://localhost:3000](http://localhost:3000) in your browser.

3. **Explore the App**:
   - Browse countries on the homepage
   - Use the search bar or region filter to find specific countries
   - Click a country card for detailed information
   - Sign in to save favorite countries
   - View saved countries in the Favorites section

---

## 🏗 Build Process

To create a production-ready build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

---

## 🧪 Testing

Run the test suite to ensure everything works as expected:

```bash
npm test
```

Generate a coverage report:

```bash
npm run test:coverage
```

---

## 📂 Project Structure

```plaintext
af-2-DinethRashmikaHeshan/
├── app/                  # Next.js App Router pages
│   ├── countries/        # Country listing and details pages
│   ├── favorites/        # User favorites page
│   ├── login/            # Authentication pages
│   └── ...               # Other routes
├── components/           # Reusable React components
├── lib/                  # Utility functions and API clients
├── public/               # Static assets (images, etc.)
├── __tests__/            # Test files
├── .env                  # Environment variables (git-ignored)
└── ...                   # Other configuration files
```

---

## 📊 API Integration Report

### 🌐 REST Countries API

The app uses the [REST Countries API](https://restcountries.com/) to fetch comprehensive country data.

- **Why Chosen**:
  - Extensive data: Names, flags, population, languages, currencies, and more
  - No authentication required
  - Well-structured JSON responses
  - Supports field selection for optimized payloads
- **Implementation**:
  - List countries: `GET /v3.1/all`
  - Country details: `GET /v3.1/alpha/{code}`
  - Field filtering to reduce data transfer

### 🔒 Supabase Integration

[Supabase](https://supabase.com/) powers authentication and data storage.

- **Features**:
  - Authentication: Email/password and Google OAuth
  - Database: PostgreSQL with Row Level Security (RLS)
  - Real-time: Ready for future enhancements
- **Implementation**:
  - Stores user favorites in a `favorites` table
  - RLS ensures users only access their own data

### ⚠️ Challenges and Solutions

1. **Country Data Normalization**  
   _Challenge_: Complex nested API responses required consistent formatting.  
   _Solution_: Built utility functions to extract and standardize data, handling edge cases (e.g., missing capitals or currencies).

2. **Authentication State**  
   _Challenge_: Maintaining auth state across the app and securing routes.  
   _Solution_: Used Supabase’s `onAuthStateChange` for a custom auth provider and redirected unauthenticated users from protected routes.

3. **Testing Async Components**  
   _Challenge_: Asynchronous data fetching caused testing issues with React’s `act()` warnings.  
   _Solution_: Leveraged `waitFor` from React Testing Library, mocked Supabase/fetch calls, and added `data-testid` for reliable selectors.

4. **Mobile Responsiveness**  
   _Challenge_: Ensuring a consistent experience across devices.  
   _Solution_: Used Tailwind CSS responsive utilities and layout for country details on smaller screens.

---
## Hosted Application

**URL** - 