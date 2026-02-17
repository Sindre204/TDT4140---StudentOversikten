# How to Run the Frontend

Follow these steps from your terminal to set up and run the Vite-powered frontend.

---

## 1) Go to the frontend folder

You want the directory that contains `package.json`.

### PowerShell

```powershell
cd .\frontend\
ls
```

## 2) Install dependencies

This will install all necessary packages defined in `package.json` (like Vite, React, etc.).

```bash
npm install
```

## 3) Start the development server

This command starts the local server and watches for file changes.

```bash
npm run dev
```

## 4) Check the terminal for the URL

Vite defaults to port `5173`. If that port is already in use by another process, it will automatically try the next one (e.g., `5174`).

Look for the following output in your terminal:

```
VITE v7.3.1  ready in 423 ms

➜  Local:   http://localhost:5174/
```

## 5) Open the application

Click the link in the terminal or open your browser and navigate to:

```
http://localhost:5173/
```

*(Or the port specified in step 4.)*

---

## 6) Common Troubleshooting

### Port already in use

If you see the message:

```
Port 5173 is in use, trying another one...
```

It simply means another terminal or application is using that port. You can either:

- Use the new port provided (e.g., `5174`)
- Close the other terminal window running the previous session

### Clean install

If you encounter weird errors after a `git pull`, try deleting the `node_modules` folder and running:

```bash
npm install
```