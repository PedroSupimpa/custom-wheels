# Custom Wheels

**Custom Wheels** is a simplified version of a real-world project originally developed for a client. It was created in collaboration with [@zzzBeck](https://github.com/zzzBeck). This web application allows users to create an account, log in, and build custom prize wheels. Each wheel can be personalized with images, favicons, custom text, colors, item percentages, and a unique slug URL. Share the URL/slug, and anyone with the link can spin the wheel!

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## Features

1. **User Authentication**  
   - Create an account and log in to manage your custom wheels.

2. **Create & Customize Wheels**  
   - Personalize your wheel with:
     - Images and favicons  
     - Custom text and colors  
     - Adjustable item percentages (for probability adjustments)

3. **Slug-Based Sharing**  
   - Generate a unique URL (slug) for each wheel so that others can spin it.

4. **Spin the Wheel**  
   - Anyone with the slug URL can play the wheel and see which prize they land on.

---

## Tech Stack

- **Frontend Framework**: [React](https://react.dev/) (bootstrapped with [Vite](https://vitejs.dev/))
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)

---

## Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or later)
- [NPM](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/) for package management

---

## Getting Started

1. **Clone the Repository**  
   ```bash
   git clone https://github.com/your-username/custom-wheels.git
   cd custom-wheels
   ```

2. **Install Dependencies**  
   ```bash
   npm install
   ```
   or
   ```bash
   yarn
   ```

3. **Start the Development Server**  
   ```bash
   npm run dev
   ```
   or
   ```bash
   yarn dev
   ```
   This will start the application in development mode. By default, the site is accessible at:  
   **http://localhost:5173/** (or similar, depending on your Vite configuration).

4. **Build for Production**  
   ```bash
   npm run build
   ```
   or
   ```bash
   yarn build
   ```
   This will generate an optimized production build.

---

## Usage

1. **Sign Up / Log In**  
   - Create a new account or log in with your existing credentials.

2. **Create a New Wheel**  
   - Click on “Create Wheel” (or a similar button).
   - Provide the wheel’s name, description, etc.

3. **Customize Items**  
   - Add or remove items and set each item’s:
     - Title/description
     - Percentage chance for being landed on
     - Associated image or icon
   - Configure text colors, background colors, and more.

4. **Generate Slug URL**  
   - Once you save the wheel, a unique slug (e.g., `/my-wheel-slug`) will be generated.

5. **Share & Play**  
   - Share the slug URL with anyone, and they can spin the wheel to see the results.


---

## License

This project is provided as-is and does not currently include a license. If you intend to use or modify this code, please add or update the license information based on your requirements.

---

## Acknowledgments

- Special thanks to [@zzzBeck](https://github.com/zzzBeck) for the collaboration.
- Inspired by a real-world client project but simplified for demonstration and personal learning.

Feel free to contribute by suggesting new features, reporting bugs, or submitting pull requests. Enjoy customizing your own wheels!