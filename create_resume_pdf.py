import re

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.units import inch

# reportlab's base fonts have no emoji glyphs, so strip them before rendering
# (they stay in resume.txt for the webpage, which renders them fine).
EMOJI_PATTERN = re.compile(
    "["
    "\U0001F300-\U0001FAFF"
    "\U00002600-\U000027BF"
    "\U0001F1E0-\U0001F1FF"
    "\U00002190-\U000021FF"
    "\U00002B00-\U00002BFF"
    "\U0000FE0F"
    "]+",
    flags=re.UNICODE,
)


def strip_emoji(text):
    return EMOJI_PATTERN.sub('', text).strip()


def create_pdf():
    doc = SimpleDocTemplate(
        "static/Dhanesh_Cybersecurity_Resume.pdf",
        pagesize=letter,
        rightMargin=72,
        leftMargin=72,
        topMargin=72,
        bottomMargin=72
    )

    # Read the content from the text file
    with open('static/resume.txt', 'r', encoding='utf-8') as file:
        content = file.read()

    # Create styles
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(
        name='CustomBody',
        parent=styles['BodyText'],
        spaceBefore=6,
        spaceAfter=6,
        fontSize=10,
        leading=14,
    ))
    
    styles.add(ParagraphStyle(
        name='Header',
        parent=styles['Heading1'],
        fontSize=16,
        spaceAfter=20,
        textColor=colors.HexColor('#006400'),  # Dark green for cybersecurity theme
    ))

    # Convert content to paragraphs
    story = []
    for raw_line in content.split('\n'):
        line = strip_emoji(raw_line)
        if line:
            if any(section in line for section in ['SUMMARY', 'EDUCATION', 'EXPERIENCE', 'PROJECTS', 'ACHIEVEMENTS', 'SKILLS', 'CERTIFICATES']):
                story.append(Paragraph(line, styles['Header']))
            else:
                story.append(Paragraph(line, styles['CustomBody']))
        else:
            story.append(Spacer(1, 12))

    # Build the PDF
    doc.build(story)

if __name__ == '__main__':
    create_pdf() 