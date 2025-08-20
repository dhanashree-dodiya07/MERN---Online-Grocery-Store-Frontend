
# MERN Online Grocery Store Frontend

This is the frontend for an online grocery store built with React and Vite. It provides a modern, responsive user interface for customers and administrators to interact with the grocery store platform.

## Features

### Customer Features
- Browse products by category
- View product details
- Add products to cart and wishlist
- Register and login
- Place orders and view order history
- Manage profile

### Admin Features
- Dashboard overview
- Manage products (add, edit, delete)
- Manage categories
- Manage users
- Manage orders
- Manage coupons

## Tech Stack
- **React** (UI library)
- **Vite** (build tool)
- **CSS** (styling)
- **JavaScript** (logic)

## Project Structure
```
src/
  api.js            # API calls
  App.jsx           # Main app component
  components/       # Reusable UI components
  pages/            # Page components (Home, Login, Cart, Admin, etc.)
  assets/           # Images and icons
  theme.js          # Theme configuration
public/
  vite.svg          # Public assets
```

## Getting Started

### Prerequisites
- Node.js (v16 or above recommended)
- npm or yarn

### Installation
1. Clone the repository:
	```
	git clone https://github.com/dhanashree-dodiya07/MERN---Online-Grocery-Store-Frontend.git
	```
2. Navigate to the project directory:
	```
	cd MERN---Online-Grocery-Store-Frontend
	```
3. Install dependencies:
	```
	npm install
	# or
	yarn install
	```

### Running the App
Start the development server:
```
npm run dev
# or
yarn dev
```
The app will be available at `http://localhost:5173` by default.

## Folder Overview
- `src/components/` - Navbar, Footer, ProductCard, CategorySection, ErrorBoundary
- `src/pages/` - Home, Login, Register, Profile, Cart, Wishlist, Orders, Product, Admin pages
- `src/api.js` - API integration
- `public/` - Static assets

## Customization
- Update theme in `src/theme.js`
- Add new assets to `src/assets/`

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
This project is licensed under the MIT License.

## Author
- [Dhanashree Dodiya](https://github.com/dhanashree-dodiya07)
