# Dhanesh's Cybersecurity Portfolio

A cybersecurity-themed portfolio website showcasing skills, experience, and projects.

## Deployment Instructions

### Vercel (recommended)

1. Create an account on [Vercel](https://vercel.com)
2. Click "Add New..." &rarr; "Project" and import this GitHub repository
3. Vercel will detect `vercel.json` and deploy the Flask app automatically &mdash; no build/start command needed
4. You'll get a URL like `https://resume.vercel.app`

### Render

1. Create an account on [Render.com](https://render.com)
2. Click on "New +" and select "Web Service"
3. Connect your GitHub repository
4. Use the following settings:
   - Name: dhanesh-portfolio
   - Environment: Python
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app`
5. Click "Create Web Service"

The site will be automatically deployed and you'll get a URL like `https://dhanesh-portfolio.onrender.com`

## Local Development

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the development server:
```bash
python app.py
```

Visit `http://localhost:8000` in your browser. 