/* ============================================================
   STUDENT DATA — Mock student profile
   In a real app this would come from an API.
   Here we define it as a JS object we can import anywhere.
   ============================================================ */

export const student = {
  id: "STU36001",
  name: "Nayana V",
  firstName: "Nayana",
  rollNumber: "STU36001",
  department: "Computer Science & Engineering",
  batch: "2023-2027",
  semester: "6th Semester",
  section: "A",
  email: "nayana.v@university.edu",
  phone: "+91 98765 43210",
  cgpa: 8.74,
  totalCredits: 120,
  completedCredits: 78,
  avatar: null, // will use initials
  advisor: "Dr. Priya Nair",
};

/* ============================================================
   COURSES DATA
   ============================================================ */
export const courses = [
  {
    id: "CS601",
    name: "Machine Learning",
    shortName: "ML",
    code: "CS601",
    credits: 4,
    faculty: "Dr. Ananya Krishnan",
    schedule: [
      { day: "Monday",    time: "09:00 AM", room: "Lab 3A" },
      { day: "Wednesday", time: "09:00 AM", room: "Lab 3A" },
      { day: "Friday",    time: "11:00 AM", room: "Room 204" },
    ],
    color: "#7c6fe0",
    description:
      "An introduction to machine learning algorithms, supervised and unsupervised learning, neural networks, and practical implementation using Python.",
    syllabus: [
      "Introduction to ML & Types",
      "Linear & Logistic Regression",
      "Decision Trees & Random Forests",
      "Support Vector Machines",
      "Neural Networks & Deep Learning",
      "Unsupervised Learning & Clustering",
      "Model Evaluation & Tuning",
    ],
  },
  {
    id: "CS602",
    name: "Database Management Systems",
    shortName: "DBMS",
    code: "CS602",
    credits: 3,
    faculty: "Prof. Rajesh Menon",
    schedule: [
      { day: "Tuesday",   time: "10:00 AM", room: "Room 301" },
      { day: "Thursday",  time: "10:00 AM", room: "Room 301" },
    ],
    color: "#3b82f6",
    description:
      "Covers relational models, SQL, transaction management, normalization, indexing, and NoSQL databases.",
    syllabus: [
      "ER Diagrams & Relational Model",
      "SQL: DDL, DML, DCL",
      "Joins, Subqueries, Views",
      "Normalization (1NF–BCNF)",
      "Transactions & Concurrency",
      "Indexing & Query Optimization",
      "NoSQL & Modern Databases",
    ],
  },
  {
    id: "CS603",
    name: "Web Technologies",
    shortName: "WT",
    code: "CS603",
    credits: 3,
    faculty: "Dr. Shruti Iyer",
    schedule: [
      { day: "Monday",    time: "11:00 AM", room: "Lab 2B" },
      { day: "Thursday",  time: "02:00 PM", room: "Lab 2B" },
    ],
    color: "#22c55e",
    description:
      "Covers HTML5, CSS3, JavaScript, React, REST APIs, responsive design, and modern web development practices.",
    syllabus: [
      "HTML5 & Semantic Web",
      "CSS3 & Flexbox/Grid",
      "JavaScript ES6+",
      "React & Component Architecture",
      "REST APIs & Fetch",
      "Responsive Design",
      "Deployment & DevOps Basics",
    ],
  },
  {
    id: "CS604",
    name: "Software Engineering",
    shortName: "SE",
    code: "CS604",
    credits: 3,
    faculty: "Prof. Arun Kumar",
    schedule: [
      { day: "Tuesday",  time: "02:00 PM", room: "Room 105" },
      { day: "Friday",   time: "09:00 AM", room: "Room 105" },
    ],
    color: "#f59e0b",
    description:
      "Software development life cycle, Agile, requirement engineering, design patterns, testing, and project management.",
    syllabus: [
      "SDLC & Methodologies",
      "Agile & Scrum",
      "Requirements Engineering",
      "UML & Design Patterns",
      "Software Testing",
      "Project Management",
      "CI/CD & DevOps",
    ],
  },
  {
    id: "CS605",
    name: "Artificial Intelligence",
    shortName: "AI",
    code: "CS605",
    credits: 4,
    faculty: "Dr. Kavitha Nambiar",
    schedule: [
      { day: "Wednesday", time: "11:00 AM", room: "Room 206" },
      { day: "Friday",    time: "02:00 PM", room: "Lab 4A" },
    ],
    color: "#ec4899",
    description:
      "Explores intelligent agents, search algorithms, knowledge representation, reasoning, planning, and natural language processing.",
    syllabus: [
      "Intelligent Agents",
      "Search Algorithms (BFS, DFS, A*)",
      "Game Theory & Adversarial Search",
      "Knowledge Representation",
      "Planning & Reasoning",
      "Natural Language Processing",
      "AI Ethics & Future",
    ],
  },
  {
    id: "CS606",
    name: "Computer Networks",
    shortName: "CN",
    code: "CS606",
    credits: 3,
    faculty: "Dr. Mohan Pillai",
    schedule: [
      { day: "Monday",    time: "02:00 PM", room: "Room 202" },
      { day: "Wednesday", time: "02:00 PM", room: "Room 202" },
    ],
    color: "#14b8a6",
    description:
      "OSI model, TCP/IP, routing protocols, network security, wireless networks, and socket programming.",
    syllabus: [
      "OSI & TCP/IP Models",
      "Data Link & Network Layer",
      "Routing Algorithms",
      "Transport Layer & Sockets",
      "Application Layer Protocols",
      "Network Security",
      "Wireless & Mobile Networks",
    ],
  },
];

/* ============================================================
   ATTENDANCE DATA
   Percentages are per course. 75% is the minimum requirement.
   ============================================================ */
export const attendance = [
  { courseId: "CS601", courseName: "Machine Learning",           code: "CS601", attended: 38, total: 42, percent: 90 },
  { courseId: "CS602", courseName: "Database Management Systems", code: "CS602", attended: 24, total: 32, percent: 75 },
  { courseId: "CS603", courseName: "Web Technologies",           code: "CS603", attended: 26, total: 28, percent: 93 },
  { courseId: "CS604", courseName: "Software Engineering",       code: "CS604", attended: 20, total: 28, percent: 71 },
  { courseId: "CS605", courseName: "Artificial Intelligence",    code: "CS605", attended: 32, total: 38, percent: 84 },
  { courseId: "CS606", courseName: "Computer Networks",          code: "CS606", attended: 21, total: 30, percent: 70 },
];

/* ============================================================
   MARKS / GRADES DATA
   ============================================================ */
export const marks = [
  {
    courseId: "CS601",
    courseName: "Machine Learning",
    cia1: 42, cia2: 44, assignment: 18,
    midterm: 38, final: null,
    maxCIA: 50, maxAssignment: 20, maxMid: 50, maxFinal: 100,
    grade: "A",
    gradePoints: 9,
  },
  {
    courseId: "CS602",
    courseName: "Database Management Systems",
    cia1: 36, cia2: 38, assignment: 16,
    midterm: 34, final: null,
    maxCIA: 50, maxAssignment: 20, maxMid: 50, maxFinal: 100,
    grade: "B+",
    gradePoints: 8,
  },
  {
    courseId: "CS603",
    courseName: "Web Technologies",
    cia1: 45, cia2: 47, assignment: 19,
    midterm: 44, final: null,
    maxCIA: 50, maxAssignment: 20, maxMid: 50, maxFinal: 100,
    grade: "A+",
    gradePoints: 10,
  },
  {
    courseId: "CS604",
    courseName: "Software Engineering",
    cia1: 38, cia2: 40, assignment: 17,
    midterm: 36, final: null,
    maxCIA: 50, maxAssignment: 20, maxMid: 50, maxFinal: 100,
    grade: "A",
    gradePoints: 9,
  },
  {
    courseId: "CS605",
    courseName: "Artificial Intelligence",
    cia1: 40, cia2: 42, assignment: 18,
    midterm: 38, final: null,
    maxCIA: 50, maxAssignment: 20, maxMid: 50, maxFinal: 100,
    grade: "A",
    gradePoints: 9,
  },
  {
    courseId: "CS606",
    courseName: "Computer Networks",
    cia1: 33, cia2: 35, assignment: 14,
    midterm: 30, final: null,
    maxCIA: 50, maxAssignment: 20, maxMid: 50, maxFinal: 100,
    grade: "B",
    gradePoints: 7,
  },
];

/* Past semesters CGPA */
export const cgpaHistory = [
  { semester: "Sem 1", cgpa: 7.8 },
  { semester: "Sem 2", cgpa: 8.1 },
  { semester: "Sem 3", cgpa: 8.3 },
  { semester: "Sem 4", cgpa: 8.6 },
  { semester: "Sem 5", cgpa: 8.9 },
  { semester: "Sem 6", cgpa: 8.74, current: true },
];

/* ============================================================
   ASSIGNMENTS DATA — All dates 2026
   ============================================================ */
export const assignments = [
  {
    id: "A001",
    title: "ML Model Evaluation Report",
    courseId: "CS601",
    courseName: "Machine Learning",
    courseCode: "CS601",
    dueDate: "2026-10-05",
    dueTime: "11:59 PM",
    priority: "high",
    status: "pending",
    description:
      "Train a classification model on the provided dataset. Evaluate using accuracy, precision, recall, and F1-score. Submit a 4–6 page report with visualizations and analysis.",
    submissionType: "PDF + Code (Upload below)",
    marks: 20,
  },
  {
    id: "A002",
    title: "ER Diagram & SQL Schema",
    courseId: "CS602",
    courseName: "Database Management Systems",
    courseCode: "CS602",
    dueDate: "2026-09-30",
    dueTime: "11:59 PM",
    priority: "high",
    status: "pending",
    description:
      "Design a complete ER diagram for a library management system. Convert it to a relational schema, implement SQL DDL statements, and insert sample data.",
    submissionType: "SQL file + Report (Upload below)",
    marks: 15,
  },
  {
    id: "A003",
    title: "React Portfolio Project",
    courseId: "CS603",
    courseName: "Web Technologies",
    courseCode: "CS603",
    dueDate: "2026-10-12",
    dueTime: "11:59 PM",
    priority: "medium",
    status: "in-progress",
    description:
      "Build a personal portfolio website using React. Must include responsive design, dark mode, at least 4 sections, and be deployed using Vercel or Netlify.",
    submissionType: "Project ZIP + Report (Upload below)",
    marks: 25,
  },
  {
    id: "A004",
    title: "Agile Sprint Planning Document",
    courseId: "CS604",
    courseName: "Software Engineering",
    courseCode: "CS604",
    dueDate: "2026-10-08",
    dueTime: "11:59 PM",
    priority: "medium",
    status: "pending",
    description:
      "Create a complete sprint planning document for a hypothetical e-commerce application. Include user stories, sprint backlog, definition of done, and team velocity.",
    submissionType: "PDF Document (Upload below)",
    marks: 20,
  },
  {
    id: "A005",
    title: "A* Search Algorithm Implementation",
    courseId: "CS605",
    courseName: "Artificial Intelligence",
    courseCode: "CS605",
    dueDate: "2026-10-15",
    dueTime: "11:59 PM",
    priority: "low",
    status: "pending",
    description:
      "Implement the A* search algorithm to solve the 8-puzzle problem. Provide a working Python implementation with visualizations and a comparative analysis with BFS and DFS.",
    submissionType: "Python Code + Report (Upload below)",
    marks: 20,
  },
  {
    id: "A006",
    title: "Network Topology Design",
    courseId: "CS606",
    courseName: "Computer Networks",
    courseCode: "CS606",
    dueDate: "2026-09-28",
    dueTime: "11:59 PM",
    priority: "high",
    status: "completed",
    description:
      "Design a complete network topology for a small enterprise. Include IP addressing, subnetting, routing protocols, and security configurations.",
    submissionType: "Visio / PDF Diagram (Upload below)",
    marks: 15,
  },
];

/* ============================================================
   CAMPUS EVENTS — All dates 2026
   Using high-quality Unsplash photo URLs with specific photo IDs
   for consistency (same URL = same image always).
   ============================================================ */
export const campusEvents = [
  {
    id: "E001",
    title: "Annual Cultural Fest 2026",
    shortDescription: "Three days of music, dance, art, and culture celebrating diversity",
    description:
      "Horizon 2026, our annual cultural festival, is a vibrant three-day celebration of art, music, dance, theatre, and culture. With over 50 events across multiple stages, art installations, food stalls from 20+ cuisines, and star performances, this is the biggest event of the academic year. Don't miss it!",
    category: "Event",
    date: "2026-10-15",
    endDate: "2026-10-17",
    time: "10:00 AM",
    location: "Main Auditorium & Ground",
    registrationDeadline: "2026-10-10",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80",
    tags: ["Culture", "Music", "Dance", "Art"],
    registrationOptions: ["Participation", "Volunteering"],
    featured: true,
  },
  {
    id: "E002",
    title: "AI Innovation Workshop 2026",
    shortDescription: "Hands-on workshop with industry experts on AI/ML applications",
    description:
      "Join leading AI researchers and industry practitioners for an intensive one-day workshop on cutting-edge AI applications. Sessions include hands-on coding with large language models, computer vision pipelines, and real-world deployment strategies. Limited to 80 participants.",
    category: "Workshop",
    date: "2026-10-03",
    endDate: "2026-10-03",
    time: "09:00 AM",
    location: "Computer Science Block, Lab 5",
    registrationDeadline: "2026-09-30",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80",
    tags: ["AI", "ML", "Workshop", "Hands-on"],
    registrationOptions: ["Participation"],
    featured: true,
  },
  {
    id: "E003",
    title: "University Hackathon 2026",
    shortDescription: "36-hour hackathon — build solutions for real-world problems",
    description:
      "CodeStorm 2026 is the university's flagship hackathon. Teams of 2–4 students have 36 hours to build innovative solutions around one of four tracks: Health Tech, EdTech, FinTech, or Sustainability. Prizes worth ₹2,00,000. Mentors from top companies will guide you.",
    category: "Competition",
    date: "2026-10-22",
    endDate: "2026-10-23",
    time: "08:00 AM",
    location: "Innovation Hub, Block D",
    registrationDeadline: "2026-10-15",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80",
    tags: ["Hackathon", "Coding", "Team", "Prize"],
    registrationOptions: ["Participation"],
    featured: true,
  },
  {
    id: "E004",
    title: "Career Connect 2026",
    shortDescription: "Campus placement drive with 40+ top companies visiting",
    description:
      "Career Connect brings 40+ companies across tech, finance, consulting, and core engineering for pre-placement talks, interviews, and networking. Special sessions for resume building and mock interviews. Attend company booths, interact with HR teams, and explore internship opportunities.",
    category: "Event",
    date: "2026-11-05",
    endDate: "2026-11-06",
    time: "09:00 AM",
    location: "Campus Convention Centre",
    registrationDeadline: "2026-10-28",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80",
    tags: ["Career", "Placement", "Networking"],
    registrationOptions: ["Participation"],
    featured: false,
  },
  {
    id: "E005",
    title: "Classical Dance Showcase",
    shortDescription: "Annual inter-college classical dance competition and showcase",
    description:
      "Natya 2026 is the university's prestigious annual classical dance competition featuring Bharatanatyam, Kathak, Odissi, Mohiniyattam, and Kuchipudi performances by students from 15+ colleges. Watch expert performances and compete for the coveted Natya Samrat trophy.",
    category: "Event",
    date: "2026-10-08",
    endDate: "2026-10-08",
    time: "05:00 PM",
    location: "Tagore Auditorium",
    registrationDeadline: "2026-10-01",
    image: "https://images.unsplash.com/photo-1583089892943-e02e5b017b6a?w=1200&q=80",
    tags: ["Dance", "Cultural", "Competition"],
    registrationOptions: ["Participation", "Volunteering"],
    featured: false,
  },
  {
    id: "E006",
    title: "Inter-College Coding Competition",
    shortDescription: "Competitive programming contest across 30+ colleges",
    description:
      "AlgoArena 2026 is an intense competitive programming contest with 5 hours of algorithmic problems ranging from easy to expert difficulty. Compete solo or in pairs. Top performers get direct interview calls from sponsoring companies. Open to all CS and IT students.",
    category: "Competition",
    date: "2026-10-18",
    endDate: "2026-10-18",
    time: "10:00 AM",
    location: "Computer Lab Complex",
    registrationDeadline: "2026-10-12",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80",
    tags: ["Coding", "Algorithm", "Competition"],
    registrationOptions: ["Participation"],
    featured: false,
  },
  {
    id: "E007",
    title: "Mental Wellness Workshop",
    shortDescription: "Student wellbeing session with licensed counselors and peers",
    description:
      "A guided session on managing academic stress, building resilience, and maintaining mental wellbeing during examination season. Includes mindfulness exercises, peer support groups, and one-on-one slots with university counselors.",
    category: "Workshop",
    date: "2026-10-06",
    endDate: "2026-10-06",
    time: "02:00 PM",
    location: "Student Centre, Room B",
    registrationDeadline: "2026-10-04",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=80",
    tags: ["Wellness", "Mental Health", "Workshop"],
    registrationOptions: ["Participation"],
    featured: false,
  },
  {
    id: "E008",
    title: "Research Paper Symposium",
    shortDescription: "Present and discuss research across CS domains",
    description:
      "An academic symposium where undergraduate and postgraduate students present their research work. Submissions are reviewed by faculty panels. Best papers are recommended for publication in the university journal. Open to all departments.",
    category: "Event",
    date: "2026-11-12",
    endDate: "2026-11-12",
    time: "09:00 AM",
    location: "Seminar Hall, Academic Block",
    registrationDeadline: "2026-11-01",
    image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1200&q=80",
    tags: ["Research", "Academic", "Publication"],
    registrationOptions: ["Participation"],
    featured: false,
  },
];

/* ============================================================
   SCHEDULE — Today's class/task schedule
   Using 2026-09-28 as "today"
   ============================================================ */
export const todaySchedule = [
  { id: "S001", type: "class",      courseCode: "CS601", title: "Machine Learning",           time: "09:00 AM", endTime: "10:00 AM", room: "Lab 3A",     status: "completed" },
  { id: "S002", type: "class",      courseCode: "CS603", title: "Web Technologies",           time: "11:00 AM", endTime: "12:00 PM", room: "Lab 2B",     status: "upcoming" },
  { id: "S003", type: "assignment", courseCode: "CS606", title: "Network Topology Due",       time: "11:59 PM", endTime: null,        room: null,         status: "upcoming", assignmentId: "A006" },
  { id: "S004", type: "class",      courseCode: "CS606", title: "Computer Networks",          time: "02:00 PM", endTime: "03:00 PM", room: "Room 202",   status: "upcoming" },
  { id: "S005", type: "task",       title: "Review ML notes",                                  time: "04:00 PM", endTime: null,        room: null,         status: "upcoming" },
  { id: "S006", type: "event",      title: "AI Innovation Workshop Registration Deadline",    time: "Tomorrow", endTime: null,        room: null,         status: "reminder" },
];

/* ============================================================
   ANNOUNCEMENTS
   ============================================================ */
export const announcements = [
  {
    id: "AN001",
    title: "Mid-Semester Exam Schedule Released",
    body: "Mid-semester examinations are scheduled from November 3–8, 2026. Please check the official portal for your individual timetable.",
    date: "2026-09-25",
    category: "Academic",
    priority: "high",
    isRead: false,
  },
  {
    id: "AN002",
    title: "Course Registration for Semester 7 Opens Oct 15",
    body: "Students can register for Semester 7 electives from October 15–22, 2026. Only 3 registration attempts are allowed.",
    date: "2026-09-24",
    category: "Registration",
    priority: "high",
    isRead: false,
  },
  {
    id: "AN003",
    title: "Library Late Fee Amnesty — September 30",
    body: "All overdue library books must be returned by September 30, 2026. Late fees are waived for books returned before this date.",
    date: "2026-09-20",
    category: "General",
    priority: "medium",
    isRead: true,
  },
];

/* ============================================================
   CALENDAR EVENTS — Combining all types for the calendar view
   All dates from 2026
   ============================================================ */
export const calendarEvents = [
  // Classes (recurring — show a few representative ones)
  { id: "CAL001", type: "class",      title: "ML Class",        courseCode: "CS601", date: "2026-09-28", time: "09:00 AM", color: "#7c6fe0" },
  { id: "CAL002", type: "class",      title: "Web Tech Lab",    courseCode: "CS603", date: "2026-09-28", time: "11:00 AM", color: "#22c55e" },
  { id: "CAL003", type: "assignment", title: "Networks Assign.", courseCode: "CS606", date: "2026-09-28", time: "11:59 PM", color: "#ef4444" },
  { id: "CAL004", type: "class",      title: "Networks",        courseCode: "CS606", date: "2026-09-28", time: "02:00 PM", color: "#14b8a6" },
  { id: "CAL005", type: "assignment", title: "DBMS Assignment",  courseCode: "CS602", date: "2026-09-30", time: "11:59 PM", color: "#3b82f6" },
  { id: "CAL006", type: "class",      title: "DBMS",            courseCode: "CS602", date: "2026-09-29", time: "10:00 AM", color: "#3b82f6" },
  { id: "CAL007", type: "class",      title: "AI Class",        courseCode: "CS605", date: "2026-09-30", time: "11:00 AM", color: "#ec4899" },
  { id: "CAL008", type: "workshop",   title: "AI Workshop",     eventId: "E002",     date: "2026-10-03", time: "09:00 AM", color: "#f59e0b" },
  { id: "CAL009", type: "deadline",   title: "AI Workshop Reg.",                      date: "2026-09-30", time: "All Day",  color: "#f59e0b" },
  { id: "CAL010", type: "event",      title: "Dance Showcase",  eventId: "E005",     date: "2026-10-08", time: "05:00 PM", color: "#ec4899" },
  { id: "CAL011", type: "assignment", title: "ML Report Due",   courseCode: "CS601", date: "2026-10-05", time: "11:59 PM", color: "#7c6fe0" },
  { id: "CAL012", type: "event",      title: "Cultural Fest",   eventId: "E001",     date: "2026-10-15", time: "10:00 AM", color: "#f59e0b" },
  { id: "CAL013", type: "exam",       title: "Mid-Sem: ML",     courseCode: "CS601", date: "2026-11-03", time: "09:00 AM", color: "#ef4444" },
  { id: "CAL014", type: "exam",       title: "Mid-Sem: DBMS",   courseCode: "CS602", date: "2026-11-04", time: "09:00 AM", color: "#ef4444" },
  { id: "CAL015", type: "holiday",    title: "Diwali Holiday",                        date: "2026-10-20", time: "All Day",  color: "#f59e0b" },
  { id: "CAL016", type: "holiday",    title: "Diwali Holiday",                        date: "2026-10-21", time: "All Day",  color: "#f59e0b" },
  { id: "CAL017", type: "competition",title: "Hackathon",       eventId: "E003",     date: "2026-10-22", time: "08:00 AM", color: "#7c6fe0" },
  { id: "CAL018", type: "class",      title: "SE Class",        courseCode: "CS604", date: "2026-09-29", time: "02:00 PM", color: "#f59e0b" },
  { id: "CAL019", type: "class",      title: "AI Class",        courseCode: "CS605", date: "2026-09-30", time: "02:00 PM", color: "#ec4899" },
  { id: "CAL020", type: "assignment", title: "SE Assignment",   courseCode: "CS604", date: "2026-10-08", time: "11:59 PM", color: "#f59e0b" },
];

/* ============================================================
   CREDENTIALS — Mock login
   ============================================================ */
export const mockCredentials = {
  rollNumber: "STU36001",
  password: "student123",
};
