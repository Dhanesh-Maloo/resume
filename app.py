from flask import Flask, render_template, send_from_directory

app = Flask(__name__)


@app.errorhandler(404)
def not_found(e):
    return render_template('404.html'), 404


@app.route('/robots.txt')
def robots():
    return send_from_directory(app.static_folder, 'robots.txt')


@app.route('/sitemap.xml')
def sitemap():
    return send_from_directory(app.static_folder, 'sitemap.xml')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/skills')
def skills():
    return render_template('skills.html')

@app.route('/experience')
def experience():
    return render_template('experience.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000) 