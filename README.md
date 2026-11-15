# Zabi Tech Services: Portfolio and Admin Panel

A portfolio website with an admin panel to add services, images and videos
without editing code, plus a visitor counter.

## Features
- Responsive dark portfolio design (HTML and CSS)
- Password protected admin panel to add or delete services, images and videos
- Visitor counter
- Contact form that sends the message to WhatsApp

## Tech used
- Node.js and Express (server and API)
- Multer (file uploads, with type and size limits)
- Plain HTML, CSS and JavaScript (front end)
- JSON file for data storage

## Security notes
- Admin password is read from an environment variable, never stored in code
- Only image and video types are accepted for upload (100 MB limit)
- Text from the database is inserted with textContent, not innerHTML, to avoid XSS

## How to run
1. Install Node.js
2. Run `npm install`
3. Set a password and start the server
   - PowerShell: `$env:ADMIN_PASS="your-password"; node server.js`
4. Open http://localhost:3000 (admin panel at /admin, username: admin)

## Project structure
- `server.js`: API, uploads and admin login
- `seed.js`: adds the starting list of services
- `public/`: the website
- `admin/`: the admin panel

## Author
Shahzaib, BS IT student, Quetta