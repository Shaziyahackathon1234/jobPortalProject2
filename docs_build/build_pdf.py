from PIL import Image
import os, glob
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Image as RLImage,
                                PageBreak, Table, TableStyle, HRFlowable)

from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
pdfmetrics.registerFont(TTFont("AppFont", "/System/Library/Fonts/Supplemental/Arial.ttf"))
pdfmetrics.registerFont(TTFont("AppFont-Bold", "/System/Library/Fonts/Supplemental/Arial Bold.ttf"))
pdfmetrics.registerFontFamily("AppFont", normal="AppFont", bold="AppFont-Bold", italic="AppFont", boldItalic="AppFont-Bold")

os.makedirs("trimmed", exist_ok=True)

def trim(path, out):
    im = Image.open(path).convert("RGB")
    g = im.convert("L")
    W, H = g.size
    px = g.load()
    minx, miny, maxx, maxy = W, H, 0, 0
    for y in range(0, H, 2):
        for x in range(0, W, 2):
            if px[x, y] < 252:
                if x < minx: minx = x
                if x > maxx: maxx = x
                if y < miny: miny = y
                if y > maxy: maxy = y
    pad = 10
    box = (max(0, minx-pad), max(0, miny-pad), min(W, maxx+pad), min(H, maxy+pad))
    crop = im.crop(box)
    crop.save(out)
    return crop.size

pages = sorted(glob.glob("imgs/page-*.png"),
               key=lambda p: int(''.join(filter(str.isdigit, os.path.basename(p)))))
trimmed = []
for pg in pages:
    out = f"trimmed/{os.path.basename(pg)}"
    sz = trim(pg, out)
    trimmed.append((out, sz))
    print("trimmed", out, sz)

# ---------- styles ----------
PURPLE = colors.HexColor("#6A38C2")
DARK = colors.HexColor("#1f2937")
GRAY = colors.HexColor("#6b7280")
styles = getSampleStyleSheet()
H1 = ParagraphStyle("H1", parent=styles["Title"], fontName="AppFont-Bold", textColor=PURPLE, fontSize=30, spaceAfter=6, leading=34)
SUB = ParagraphStyle("SUB", parent=styles["Normal"], fontName="AppFont", textColor=GRAY, fontSize=13, alignment=1, spaceAfter=16, leading=18)
SEC = ParagraphStyle("SEC", parent=styles["Heading1"], fontName="AppFont-Bold", textColor=PURPLE, fontSize=18, spaceBefore=6, spaceAfter=4)
LBL = ParagraphStyle("LBL", parent=styles["Normal"], fontName="AppFont", textColor=DARK, fontSize=11, leading=16)
BODY = ParagraphStyle("BODY", parent=styles["Normal"], fontName="AppFont", textColor=DARK, fontSize=11, leading=16, spaceAfter=6)
CAP = ParagraphStyle("CAP", parent=styles["Normal"], fontName="AppFont", textColor=GRAY, fontSize=9, alignment=1, spaceBefore=4)

doc = SimpleDocTemplate("JobPortal-Documentation.pdf", pagesize=A4,
                        topMargin=0.6*inch, bottomMargin=0.6*inch,
                        leftMargin=0.7*inch, rightMargin=0.7*inch)
AVAIL_W = A4[0] - 1.4*inch
AVAIL_H = A4[1] - 1.6*inch
story = []

# ---------- cover ----------
story.append(Spacer(1, 1.2*inch))
story.append(Paragraph("JobPortal", H1))
story.append(Paragraph("A Full-Stack MERN Job Portal with AI", SUB))
story.append(HRFlowable(width="60%", thickness=2, color=PURPLE, spaceBefore=4, spaceAfter=18, hAlign="CENTER"))
intro = ("JobPortal is a modern web application that connects <b>job seekers</b> with "
         "<b>recruiters</b>. Job seekers can search, filter, and apply to jobs and get an "
         "<b>AI Smart Match</b> score for any role, while recruiters can post jobs, manage "
         "companies (with AI auto-detected brand logos), and review applicants with "
         "AI-assisted match scoring and direct contact details.")
story.append(Paragraph(intro, BODY))
story.append(Spacer(1, 0.2*inch))

stack = [
    ["Frontend", "React 19, Vite, Redux Toolkit, React Router, Tailwind CSS, Axios"],
    ["Backend", "Node.js, Express, MongoDB (Mongoose), JWT auth, Multer, Cloudinary"],
    ["AI & APIs", "Groq (LLaMA 3.3 70B) for skill matching, logo.dev for company logos"],
    ["Deployment", "Vercel (frontend), Render (backend), MongoDB Atlas (database)"],
]
t = Table([[Paragraph(f"<b>{a}</b>", LBL), Paragraph(b, LBL)] for a, b in stack],
          colWidths=[1.3*inch, AVAIL_W-1.3*inch])
t.setStyle(TableStyle([
    ("BACKGROUND", (0,0), (0,-1), colors.HexColor("#f3effb")),
    ("GRID", (0,0), (-1,-1), 0.5, colors.HexColor("#e5e7eb")),
    ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
    ("TOPPADDING", (0,0), (-1,-1), 7), ("BOTTOMPADDING", (0,0), (-1,-1), 7),
    ("LEFTPADDING", (0,0), (-1,-1), 10),
]))
story.append(t)
story.append(PageBreak())

# ---------- per-screen explanations (page -> list of screen blocks) ----------
# Each page in the source PDF holds the screen(s) listed here.
content = {
 1: [("1. Recruiter Dashboard / Profile",
      "The recruiter's home base. A gradient profile header shows the recruiter (Shaziya Simran) "
      "with live stats — <b>42 Jobs Posted, 30 Companies, 60 Open Positions</b>. Below are an "
      "About section, <b>Quick Actions</b> (Post a New Job, Manage Jobs, Manage Companies), and a "
      "list of recently posted jobs each with an Applicants shortcut."),
     ("2. Manage Jobs",
      "A list of every job the recruiter has posted. Each row shows the <b>real company logo</b>, "
      "job title, company, location, posting date, and live applicant count, plus a <b>New Job</b> button.")],
 2: [("3. All Applications",
      "A single dashboard of every candidate who applied across all of the recruiter's jobs. It shows "
      "the candidate's name, <b>clickable email and phone</b> (to contact directly), role, company, the "
      "<b>AI Match score</b>, resume link, applied date, and Accept / Reject actions — with a search box."),
     ("4. Manage Companies",
      "All companies the recruiter manages, each displayed with its <b>AI-auto-detected brand logo</b> "
      "(Tech Mahindra, Unacademy, Nykaa, Microsoft, Swiggy, Zomato, and more), location, and date.")],
 3: [("5. Account Menu",
      "The profile dropdown available from the navbar, giving quick access to <b>View Profile</b> and <b>Logout</b>."),
     ("6. Home / Hero",
      "The public landing page — \"Search, Apply &amp; Get Your Dream Jobs\" — with a prominent search "
      "bar, quick category filters (Frontend, Backend, Data Science...), and a <b>Latest &amp; Top Job "
      "Openings</b> showcase.")],
 4: [("7. Browse Jobs (Filters)",
      "The jobs page with a sidebar of <b>filters</b> — Location, Industry, and Salary — alongside "
      "card-based job listings, each with Details and Apply Now actions."),
     ("8. Search Results",
      "The Browse view showing all matching jobs (e.g. <b>42 results</b>) as cards with company logo, "
      "role, description, positions, type, and salary.")],
 5: [("9. Job Description + AI Smart Match",
      "A single job's full details — location, salary, number of positions, posted date, and description. "
      "The highlighted <b>AI Smart Match</b> panel lets a logged-in user <b>Calculate Match Score</b> to "
      "compare their profile skills against the job description.")],
 6: [("10. Login",
      "The login screen with email and password, a password-visibility toggle, and a <b>role selector</b> "
      "(Jobseeker / Recruiter)."),
     ("11. Create Account (Signup)",
      "Registration with Full Name, Email, Phone Number, Password, role selection, and a "
      "<b>profile-picture upload</b>.")],
}

story.append(Paragraph("Screens &amp; Features", SEC))
story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#e5e7eb"), spaceAfter=10))

for (path, (w, h)), pageno in zip(trimmed, range(1, len(trimmed)+1)):
    blocks = content.get(pageno, [])
    for title, desc in blocks:
        story.append(Paragraph(title, SEC))
        story.append(Paragraph(desc, BODY))
    # scale image to fit width and remaining height
    scale = AVAIL_W / w
    iw, ih = AVAIL_W, h * scale
    maxh = AVAIL_H * 0.72
    if ih > maxh:
        ih = maxh; iw = w * (maxh / h)
    story.append(Spacer(1, 6))
    img = RLImage(path, width=iw, height=ih)
    img.hAlign = "CENTER"
    story.append(img)
    story.append(Paragraph(f"Screenshot — page {pageno}", CAP))
    story.append(PageBreak())

doc.build(story)
print("\nBUILT JobPortal-Documentation.pdf")
