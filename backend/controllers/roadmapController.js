const Semester = require('../models/Semester');
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const { isDbReady } = require('../config/db');

// Full 8-Semester Curriculum Data preserved from existing roadmap + extended with new required attributes
const fallbackSemesters = [
  {
    semesterNumber: 1,
    year: 1,
    academicYear: '2026–2027',
    title: 'Foundations of Engineering & C Programming',
    summary: 'Cultivate core mathematical rigor, physical intuition of electrical quantities, structured procedural coding in C, and Git version control discipline.',
    mentorTip: 'Master pointers and memory management in C during Sem 1; these concepts form the backbone of embedded microcontrollers in Years 2 and 3.',
    subjects: [
      {
        name: 'Engineering Mathematics I',
        code: 'BS-M101',
        category: 'Core Theory',
        topics: ['Differential Calculus', 'Linear Algebra', 'Matrix Operations', 'Ordinary Differential Equations'],
        importance: 'Foundation for Network Theory & Control Systems',
      },
      {
        name: 'Engineering Physics',
        code: 'BS-PH101',
        category: 'Lab + Theory',
        topics: ['Wave Optics', 'Electromagnetism', 'Quantum Mechanics Basics', 'Semiconductor Physics'],
        importance: 'Foundation for Diodes and Transistors',
      },
      {
        name: 'Basic Electrical Engineering',
        code: 'ES-EE101',
        category: 'AEIE Pillar',
        topics: ['KCL & KVL', 'AC Circuit Analysis', 'Single Phase Transformers', 'DC Machines Principles'],
        importance: 'Vital AEIE Core Building Block',
      },
      {
        name: 'C Programming',
        code: 'ES-CS101',
        category: 'Embedded Industry',
        topics: ['Data Types & Loops', 'Functions & Recursion', 'Pointers & Dynamic Memory', 'Structures, Unions & File I/O'],
        importance: 'Crucial for Firmware & Embedded C',
      },
      {
        name: 'Git and GitHub',
        code: 'SK-GIT101',
        category: 'General Engineering',
        topics: ['Repositories & Commits', 'Branching & Merge Conflicts', 'Pull Requests & Code Reviews', 'Markdown Documentation'],
        importance: 'Standard Industry Practice',
      },
    ],
    technicalSkills: ['Circuit Analysis', 'Breadboard Prototyping', 'Basic Lab Equipment (Multimeter, DC Power Supply)', 'Scientific Plotting'],
    programmingSkills: ['C Programming (Pointers, Memory Allocation, Structs)', 'Shell Scripting Basics', 'Git CLI & Version Control'],
    aeieCoreSkills: ['Kirchhoff Laws', 'Impedance Calculations', 'DC Circuit Theorems', 'Semiconductor Conduction'],
    internshipTasks: [
      'Create and configure a clean professional GitHub profile',
      'Push all C programming lab assignments and notes to public repositories',
      'Set up a student LinkedIn profile highlighting enrollment in B.E. AEIE at UIT Burdwan',
    ],
    careerMilestones: [
      'Explore core vs software career horizons',
      'Attend first departmental technical orientation and IEEE/ISA student chapters',
      'Target first semester CGPA above 8.0',
    ],
  },
  {
    semesterNumber: 2,
    year: 1,
    academicYear: '2026–2027',
    title: 'Electronics, Circuit Analysis & Modern Scripting',
    summary: 'Transition into semiconductor electronics, circuit theorems, and rapid automation scripting with Python.',
    mentorTip: 'Practice solving circuit networks with pencil and paper, then verify with circuit simulation tools like Falstad or LTspice.',
    subjects: [
      {
        name: 'Python Fundamentals',
        code: 'ES-CS102',
        category: 'Software Ready',
        topics: ['Data Structures (Lists, Tuples, Dictionaries)', 'Object-Oriented Programming', 'File I/O & Exception Handling', 'Package Management via Pip'],
        importance: 'Rapid Prototyping & Sensor Logging',
      },
      {
        name: 'Basic Electronics',
        code: 'ES-ECE101',
        category: 'AEIE Pillar',
        topics: ['PN Junction Diodes', 'Zener Diode Regulators', 'BJT Biasing & Small Signal Models', 'FET & Introduction to Op-Amps'],
        importance: 'Hardware Core',
      },
      {
        name: 'Circuit Analysis',
        code: 'PC-EI201',
        category: 'GATE Core',
        topics: ['Thevenin & Norton Theorems', 'Superposition & Maximum Power Transfer', 'Transient Analysis of RL, RC & RLC Circuits', 'Resonance'],
        importance: 'High GATE Weightage',
      },
      {
        name: 'HTML, CSS and JavaScript Basics',
        code: 'ES-IT101',
        category: 'General Engineering',
        topics: ['Semantic HTML5', 'Responsive CSS & Flexbox/Grid', 'DOM Manipulation & Events', 'Building Personal Portfolio Webpages'],
        importance: 'Showcasing Projects & Building Web HMIs',
      },
    ],
    technicalSkills: ['Diode Characteristic Testing', 'BJT Biasing & Q-Point Stabilization', 'Oscilloscope Waveform Probing', 'Circuit Simulation (LTspice/Falstad)'],
    programmingSkills: ['Python Scripting (OOP, File Handling)', 'Frontend Web Basics (HTML5/CSS3/Vanilla JS)', 'Regular Expressions & Pip Libraries'],
    aeieCoreSkills: ['Small Signal Analysis', 'Transient Response Calculation', 'Maximum Power Matching', 'Voltage Regulators'],
    internshipTasks: [
      'Build your personal student portfolio webpage hosted on GitHub Pages',
      'Connect with UIT Burdwan AEIE alumni on LinkedIn across automation and core electronics sectors',
      'Apply for introductory summer virtual internships on the AICTE portal',
    ],
    careerMilestones: [
      'Publish your first open-source repository on GitHub with clean README and screenshots',
      'Decide between Core Hardware/Automation, Embedded Firmware, or Software focus areas',
    ],
  },
  {
    semesterNumber: 3,
    year: 2,
    academicYear: '2027–2028',
    title: 'Electronics Core, Signals & Object-Oriented Logic',
    summary: 'Master foundational hardware circuits, mathematical transforms for signals, and object-oriented algorithms.',
    mentorTip: 'Don’t just simulate Arduino code. Understand the register level (e.g. DDRB, PORTB) to prepare for microcontrollers in Sem 4.',
    subjects: [
      {
        name: 'Analog Electronics',
        code: 'PC-EI301',
        category: 'Core Instrumentation',
        topics: ['Op-Amp Inverting/Non-inverting', 'Active Filters (Butterworth/Chebyshev)', 'Precision Rectifiers', 'Oscillators & Schmitt Triggers'],
        importance: 'Instrument Signal Conditioning',
      },
      {
        name: 'Digital Electronics',
        code: 'PC-EI302',
        category: 'Hardware Core',
        topics: ['Boolean Algebra & K-Maps', 'Multiplexers & Decoders', 'Flip-Flops & Registers', 'Synchronous & Asynchronous Counters'],
        importance: 'Digital Logic & FPGA Basics',
      },
      {
        name: 'Network Theory',
        code: 'PC-EI303',
        category: 'GATE Core',
        topics: ['Graph Theory & Incidence Matrices', 'Two-Port Network Parameters (z, y, h, ABCD)', 'Laplace Transforms in Circuit Analysis', 'Coupled Circuits'],
        importance: 'High GATE Weightage',
      },
      {
        name: 'Signals and Systems',
        code: 'PC-EI304',
        category: 'Heavy Weightage',
        topics: ['Continuous & Discrete LTI Systems', 'Convolution Integral & Sum', 'Continuous/Discrete Fourier Series & Transforms', 'Z-Transforms & ROC'],
        importance: 'Core Signal Processing',
      },
      {
        name: 'C++ and Data Structures',
        code: 'ES-CS301',
        category: 'Software Ready',
        topics: ['Classes & Encapsulation', 'Stacks, Queues & Linked Lists', 'Binary Search Trees & Graphs', 'Sorting & Search Algorithms'],
        importance: 'Tech Placements & Firmware',
      },
      {
        name: 'Arduino Basics',
        code: 'PC-EI305',
        category: 'Embedded Industry',
        topics: ['AVR Atmega328P Architecture', 'GPIO Digital/Analog I/O', 'Hardware Timers & PWM', 'UART Serial Telemetry & Wokwi Simulation'],
        importance: 'Hands-on Prototyping',
      },
    ],
    technicalSkills: ['Active Filter Tuning', 'Logic IC Debugging (7400 series)', 'Two-Port Network Parameter Extraction', 'Breadboard Prototyping'],
    programmingSkills: ['C++ OOP & STL Containers', 'Data Structures (Linked Lists, Binary Trees)', 'Arduino C++ Embedded Framework'],
    aeieCoreSkills: ['Op-Amp Slew Rate & CMRR', 'Two-Port Z/Y Matrix Synthesis', 'LTI System Impulse Response', 'Logic Gate Propagation Delays'],
    internshipTasks: [
      'Prototype a hardware/Wokwi circuit and publish the demonstration video on LinkedIn',
      'Begin competitive coding on HackerRank/LeetCode with C++ DSA',
      'Identify 10 core industrial companies in West Bengal (Durgapur Steel, Thermal Power Plants, Haldia Petrochemicals)',
    ],
    careerMilestones: [
      'Build your first interactive microcontroller station',
      'Establish a 100-day coding and hardware streak on GitHub',
    ],
  },
  {
    semesterNumber: 4,
    year: 2,
    academicYear: '2027–2028',
    title: 'Sensors, Microcontrollers & Control Systems',
    summary: 'The core of AEIE begins: measurement science, feedback loops, microprocessor registers, and scientific data manipulation.',
    mentorTip: 'Master Bode Plots and Root Locus by practicing with MATLAB or Python Control Systems Library—vital for UIT exams and GATE.',
    subjects: [
      {
        name: 'Measurements & Instrumentation',
        code: 'PC-EI401',
        category: 'Core Instrumentation',
        topics: ['Error Analysis & Calibration', 'AC Bridges (Maxwell, Hay, Schering)', 'Resistive, Capacitive & Inductive Transducers', 'LVDT, Thermocouple & Strain Gauges'],
        importance: 'AEIE Signature Pillar',
      },
      {
        name: 'Microprocessors and Microcontrollers',
        code: 'PC-EI402',
        category: 'Hardware Core',
        topics: ['8085/8086 Architecture & Pinouts', '8051 Microcontroller Architecture', 'Interrupt Service Routines (ISRs)', 'Assembly & C Embedded Programming'],
        importance: 'Core Firmware Development',
      },
      {
        name: 'Control Systems',
        code: 'PC-EI403',
        category: 'GATE Core',
        topics: ['Transfer Functions & Block Reduction', 'Time Response of 2nd Order Systems', 'Routh-Hurwitz & Root Locus', 'Bode Plots, Polar Plots & Nyquist Stability'],
        importance: 'Primary GATE Discipline',
      },
      {
        name: 'Python NumPy and Pandas',
        code: 'ES-CS401',
        category: 'Software Ready',
        topics: ['Multi-dimensional Arrays with NumPy', 'DataFrame Cleaning with Pandas', 'Time-series Sensor Resampling', 'Seaborn & Matplotlib Visualization'],
        importance: 'Scientific & Data Analysis',
      },
      {
        name: 'Sensor Interfacing',
        code: 'PC-EI404',
        category: 'Plant Core',
        topics: ['Analog-to-Digital Converters (SAR & Flash)', 'Instrumentation Amplifiers (AD620)', 'I2C & SPI Sensor Interfacing', 'Noise Filtering & Shielding'],
        importance: 'Real-world Field Applications',
      },
    ],
    technicalSkills: ['Sensor Calibration & Error Mapping', 'Microcontroller In-System Programming (ISP)', 'Control Loop Stability Testing', 'Oscilloscope Logic Analysis'],
    programmingSkills: ['Python Pandas & NumPy', '8051 Embedded Assembly/C', 'MATLAB/Simulink or Python-Control'],
    aeieCoreSkills: ['Transducer Sensitivity & Linearity', 'Lead-Lag Compensator Design', 'Gain & Phase Margin Calculation', 'Interrupt Vector Tables'],
    internshipTasks: [
      'Apply for 2nd-year summer research/industrial internships at CSIR labs, IITs, or local automation hubs',
      'Register on the official AICTE Internship Portal with verified college credentials',
      'Design a virtual instrumentation GUI connecting to sensor hardware',
    ],
    careerMilestones: [
      'Complete two substantial multi-component projects by end of 2nd year',
      'Achieve minimum 8.2 CGPA across first two years',
    ],
  },
  {
    semesterNumber: 5,
    year: 3,
    academicYear: '2028–2029',
    title: 'Industrial Automation, Process Control & Embedded C',
    summary: 'Step into the industrial world: control valves, PID loop tuning, programmable logic controllers, and bare-metal embedded programming.',
    mentorTip: '4-20 mA current loop is the universal industrial standard. Understand why current transmission resists line noise much better than voltage.',
    subjects: [
      {
        name: 'Industrial Instrumentation',
        code: 'PC-EI501',
        category: 'Plant Core',
        topics: ['Flow Measurement (Electromagnetic, Ultrasonic, Coriolis)', 'Pressure Transmitters (Piezoelectric, Capacitive)', 'Level Detection (Radar, Ultrasonic)', 'Temperature (Pyrometers, Thermowells)'],
        importance: 'Process Plant Standards',
      },
      {
        name: 'Advanced Control Systems',
        code: 'PC-EI502',
        category: 'Control Theory',
        topics: ['State Space Modeling & State Transition Matrix', 'Controllability & Observability (Kalman Tests)', 'P, PI and PID Controller Tuning (Ziegler-Nichols)', 'Feedforward & Cascade Control Loops'],
        importance: 'Process Optimization',
      },
      {
        name: 'Embedded C',
        code: 'PC-EI503',
        category: 'Embedded Industry',
        topics: ['Bitwise Registers & Masks', 'Memory-Mapped I/O Operations', 'Hardware Timers, PWM & Interrupts', 'Bare-metal ARM Cortex / AVR Driver Development'],
        importance: 'High-Demand Embedded Jobs',
      },
      {
        name: 'PLC and SCADA',
        code: 'PC-EI504',
        category: 'Automation Essential',
        topics: ['PLC Architecture & Scan Cycles', 'Ladder Logic Programming (Timers, Counters, Math)', 'SCADA Screen Design & Telemetry', 'Allen Bradley & Siemens TIA Portal Paradigms'],
        importance: 'Automation Industry Core',
      },
      {
        name: 'Communication Protocols',
        code: 'PC-EI505',
        category: 'Plant Core',
        topics: ['Modbus RTU over RS-485 & Modbus TCP', 'CAN 2.0B Bus Architecture for Automotive', 'Profibus DP & Industrial Ethernet', 'HART Protocol over 4-20mA Current Loops'],
        importance: 'Industrial Field Networking',
      },
    ],
    technicalSkills: ['PLC Ladder Logic Development', 'SCADA HMI Configuration', 'PID Tuning in Closed Loops', 'RS-485 Modbus Network Sniffing'],
    programmingSkills: ['Bare-metal Embedded C', 'PLC Ladder Logic (IEC 61131-3)', 'Structured Text (ST) for PLCs', 'Python Serial / MQTT Communication'],
    aeieCoreSkills: ['Control Valve Sizing & Cv Calculation', 'Ziegler-Nichols Closed-Loop Tuning', 'State Controllability Rank Tests', 'Current Loop Signal Conditioning'],
    internshipTasks: [
      'Begin applying for mandatory 3rd-year summer industrial training (Thermal Power Plants, Steel Plants, Refineries, Automation System Integrators)',
      'Reach out to UIT Burdwan training & placement cell (TPO) for official recommendation letters',
      'Craft an ATS-optimized one-page technical resume',
    ],
    careerMilestones: [
      'Master industrial PLC and SCADA simulations',
      'Begin formal GATE IN/EE syllabus coverage and mock tests',
    ],
  },
  {
    semesterNumber: 6,
    year: 3,
    academicYear: '2028–2029',
    title: 'Technical Mastery, GATE Rigor & Career Readiness',
    summary: 'Crucial junction: balance high semester GPA with problem-solving aptitude, GATE preparation, and competitive summer internship applications.',
    mentorTip: 'Complete your summer industrial training between 6th and 7th semester. UIT Burdwan requires industrial training reports and presentations in 7th sem.',
    subjects: [
      {
        name: 'Advanced Technical Skills',
        code: 'PE-EI601',
        category: 'Domain Specialty',
        topics: ['Biomedical Instrumentation (ECG, EEG, EMG Amplifiers)', 'Analytical Instruments (Spectrophotometers, Gas Chromatography)', 'Optoelectronics & Fiber Optic Sensors', 'Safety Instrumented Systems (SIL / SIS)'],
        importance: 'Interdisciplinary & Healthcare',
      },
      {
        name: 'DSA and Quantitative Aptitude',
        code: 'OE-CS601',
        category: 'Placements',
        topics: ['Time & Space Complexity Optimization', 'Dynamic Programming & Graph Traversal', 'Quantitative Aptitude (Percentages, Probability, P&C)', 'Logical Reasoning & Verbal Fluency'],
        importance: 'Pre-requisite for Campus Drives',
      },
      {
        name: 'GATE Preparation Strategy',
        code: 'MC-GT601',
        category: 'Higher Studies / PSU',
        topics: ['10-Year GATE IN/EE/EC Solved Papers', 'Full-Length Online Mock Tests', 'Error Log Maintenance', 'Virtual Calculator Speed Drills'],
        importance: 'IIT M.Tech & PSU Recruitment',
      },
      {
        name: 'Resume & LinkedIn Optimization',
        code: 'MC-PR601',
        category: 'Recruitment',
        topics: ['ATS Formatting & Action Verbs', 'Quantified Project Impact Bullets', 'GitHub Showcase Clean-up', 'Professional Networking & Cold Emailing'],
        importance: 'Direct Placement Impact',
      },
      {
        name: 'Internship Applications',
        code: 'PR-IN601',
        category: 'Plant Core',
        topics: ['AICTE Internship Portal Submissions', 'PSU Summer Training (SAIL, IOCL, NTPC)', 'Private Automation Vendors (Schneider, Siemens SI)', 'Industrial Safety & Plant Standards'],
        importance: 'Required for 7th Sem Credits',
      },
    ],
    technicalSkills: ['Biomedical Signal Conditioning', 'Optical Sensor Alignment', 'Advanced Aptitude Problem Solving', 'Full-Length Examination Time Strategy'],
    programmingSkills: ['Advanced DSA (Graphs, DP) in C++/Python', 'Embedded RTOS Task Scheduling Basics', 'Database Queries with SQL'],
    aeieCoreSkills: ['Instrumentation Amplifier CMRR Design for ECG', 'Chromatography Peak Detection', 'SIL Loop Calculations', 'Formula Sheet Derivations'],
    internshipTasks: [
      'Finalize summer industrial training tenure (minimum 4-6 weeks) during summer break',
      'Maintain daily technical diary during plant training for final report writing',
      'Target PSU summer trainee openings via official portals',
    ],
    careerMilestones: [
      'Complete 70% of GATE syllabus by end of semester 6',
      'Secure confirmed summer industrial training slot',
    ],
  },
  {
    semesterNumber: 7,
    year: 4,
    academicYear: '2029–2030',
    title: 'Technical Interviews, Final Project Phase 1 & GATE Sprint',
    summary: 'The placement season is live. Execute technical interviews, finalize capstone literature survey, and hone examination accuracy.',
    mentorTip: 'Structure your project presentation cleanly. Interviewers love hearing about real engineering troubleshooting hurdles you overcame.',
    subjects: [
      {
        name: 'Technical Interview Preparation',
        code: 'MC-IN701',
        category: 'Recruitment',
        topics: ['Core Electronics Viva Voce', 'Control & Instrumentation Problem Sets', 'C/C++ Code Review on Whiteboard', 'System Design & Architectural Tradeoffs'],
        importance: 'Job Offers & Pre-placement Offers',
      },
      {
        name: 'GATE Final Sprint',
        code: 'MC-GT701',
        category: 'Higher Studies / PSU',
        topics: ['Subject-wise Intensive Revision', 'Formula Flashcards Review', 'National Level Mock Test Series', 'Eliminating Negative Marking Pitfalls'],
        importance: 'Rank Decider for IITs/PSUs',
      },
      {
        name: 'Placement Aptitude & Soft Skills',
        code: 'MC-AP701',
        category: 'Placements',
        topics: ['Company-Specific Test Patterns', 'Group Discussion Techniques', 'HR Behavioral Interviews (STAR Framework)', 'Mock Vivas with Senior Alumni'],
        importance: 'Crucial for Final Round Conversion',
      },
      {
        name: 'Final-Year Project (Phase 1)',
        code: 'PW-EI701',
        category: 'Capstone Project',
        topics: ['Problem Statement Definition', 'Faculty Guide Allocation & Review', 'State-of-the-Art Literature Review', 'Hardware Schematic & Simulation Design'],
        importance: 'Primary B.E. Graduation Requirement',
      },
    ],
    technicalSkills: ['Interview Whiteboarding', 'Rapid Hardware Troubleshooting', 'Engineering Project Presentation', 'System Architecture Drafting'],
    programmingSkills: ['System Design & Architecture', 'Object-Oriented Design Patterns', 'Advanced Microcontroller/RTOS Coding'],
    aeieCoreSkills: ['Comprehensive Cross-Subject AEIE Viva Readiness', 'Instrumentation Standards', 'Control Loop Commissioning'],
    internshipTasks: [
      'Submit summer industrial training report and deliver technical presentation to departmental faculty board',
      'Convert summer internship experience into interview talking points',
      'Seek Pre-Placement Offers (PPO) if applicable',
    ],
    careerMilestones: [
      'Attend first wave of campus and pool-campus placement drives',
      'Finalize hardware BOM for final year capstone project',
    ],
  },
  {
    semesterNumber: 8,
    year: 4,
    academicYear: '2029–2030',
    title: 'Capstone Completion, On/Off-Campus Drives & Graduation',
    summary: 'Cross the finish line: complete the capstone prototype, submit the thesis, clear placement drives, and formalize postgraduate admissions.',
    mentorTip: 'Maintain your project code, demo video, and thesis paper permanently on your personal GitHub and LinkedIn to serve as a portfolio long after graduation.',
    subjects: [
      {
        name: 'Final-Year Project Completion',
        code: 'PW-EI801',
        category: 'Capstone Project',
        topics: ['Full Physical Prototype Testing', 'Calibration & Experimental Validation', 'Thesis Documentation (IEEE Format)', 'External Viva & Demonstration Board'],
        importance: 'B.E. Degree Culmination',
      },
      {
        name: 'Campus & Off-Campus Placements',
        code: 'MC-PL801',
        category: 'Recruitment',
        topics: ['Core Engineering Recruitment Drives', 'IT Services / Product Drives', 'Off-Campus Applications & Referral Networks', 'Offer Letter Review & Onboarding Process'],
        importance: 'Professional Career Entry',
      },
      {
        name: 'GATE Counseling & M.Tech Applications',
        code: 'MC-HE801',
        category: 'Higher Studies / PSU',
        topics: ['COAP Portal Registration for IITs', 'CCMT Portal Registration for NITs', 'PSU Scorecard Verification & GD/Interview Calls', 'Research Proposal Submission for MS/PhD'],
        importance: 'Premier Postgraduate Admission',
      },
      {
        name: 'Interview Preparation & Transition',
        code: 'MC-TR801',
        category: 'General Engineering',
        topics: ['Corporate Workplace Culture Readiness', 'Continuing Education & Professional Certifications', 'Alumni Mentorship & Giving Back', 'Lifelong Learning in Engineering'],
        importance: 'Smooth Professional Transition',
      },
    ],
    technicalSkills: ['Comprehensive Thesis Writing', 'Prototype Exhibition & Demonstration', 'Technical Report Review', 'Professional Engineering Ethics'],
    programmingSkills: ['Production-ready Firmware/Code Deployment', 'Documentation in LaTeX / Markdown', 'Open Source Project Publishing'],
    aeieCoreSkills: ['End-to-End System Integration', 'Sensor to Cloud/HMI Pipeline Execution', 'Instrument Calibration Certification'],
    internshipTasks: [
      'Complete onboarding verification and background check paperwork for selected employers',
      'Transition smoothly from student to full-time engineering professional or postgraduate scholar',
    ],
    careerMilestones: [
      'Successfully graduate with B.E. in AEIE from UIT Burdwan',
      'Secure full-time corporate appointment or top-tier M.Tech/MS admission',
    ],
  },
];

// 6 Practical Projects + Capstone
const fallbackProjects = [
  {
    projectId: 'proj-y1-1',
    title: 'Student Management System using C',
    year: 1,
    semesterNumber: 1,
    category: 'C Language & CLI',
    description: 'Build a modular command-line database system using C. Implement file handling to store student enrollment details, roll numbers, marks, and GPA computations with structured memory management.',
    techStack: ['C Language', 'File I/O', 'Structs & Pointers', 'CLI Architecture', 'Git / GitHub'],
    deliverables: 'Clean GitHub repo with modular .c and .h files, structured Makefile or GCC build instructions, and sample dataset persistence.',
    difficulty: 'Beginner',
    hardwareTools: ['PC / Terminal'],
    softwareTools: ['GCC / Clang', 'VS Code', 'Git'],
  },
  {
    projectId: 'proj-y1-2',
    title: 'Python Sensor Data Logger',
    year: 1,
    semesterNumber: 2,
    category: 'Python Scripting & Telemetry',
    description: 'Develop a Python script that reads simulated or live USB/Serial telemetry (simulated temperature, voltage, or pressure), writes timestamped logs to CSV files, and visualizes real-time plots using Matplotlib.',
    techStack: ['Python 3', 'PySerial', 'CSV Handling', 'Matplotlib', 'Automation'],
    deliverables: 'Automated logging script with outlier threshold alarms and dynamic time-series charts exported to PNG.',
    difficulty: 'Beginner',
    hardwareTools: ['Virtual Serial Port or USB-TTL Dongle'],
    softwareTools: ['Python 3.10+', 'PySerial', 'Matplotlib'],
  },
  {
    projectId: 'proj-y2-1',
    title: 'Temperature Monitoring & Alert System',
    year: 2,
    semesterNumber: 3,
    category: 'Embedded Instrumentation',
    description: 'Design a physical or Wokwi-simulated microcontroller station using LM35/DHT22 or DS18B20 digital temperature sensors. Feature an I2C 16x2 LCD, buzzer alarm for critical threshold breaches, and continuous calibration.',
    techStack: ['Microcontrollers', 'Analog-to-Digital', 'I2C LCD', 'Interrupts & Timers', 'Calibration'],
    deliverables: 'Full schematic, working firmware in C++/Arduino, test benchmark report with error percentage against a standard thermometer.',
    difficulty: 'Intermediate',
    hardwareTools: ['Arduino Uno / ESP32', 'LM35 / DS18B20', '16x2 I2C LCD', 'Active Buzzer'],
    softwareTools: ['Wokwi Simulator', 'Arduino IDE', 'KiCad'],
  },
  {
    projectId: 'proj-y2-2',
    title: 'Virtual Instrumentation Dashboard',
    year: 2,
    semesterNumber: 4,
    category: 'Virtual Instrument GUI',
    description: 'Build a PC-based virtual instrument desktop dashboard using Python (Tkinter/PyQt or Streamlit) or LabVIEW. Display live gauge dials, real-time strip charts, min/max metrics, and data export features from incoming serial sensors.',
    techStack: ['Python GUI / PyQt', 'Serial Protocol', 'NumPy & Pandas', 'HMI Concept', 'Data Visualization'],
    deliverables: 'Responsive virtual instrument GUI with live multi-channel graphs, emergency stop button, and historical CSV logging.',
    difficulty: 'Intermediate',
    hardwareTools: ['Microcontroller board with multi-channel ADC'],
    softwareTools: ['PyQt5 / Streamlit', 'NumPy', 'Pandas'],
  },
  {
    projectId: 'proj-y3-1',
    title: 'Industrial IoT Condition Monitoring System',
    year: 3,
    semesterNumber: 5,
    category: 'Industrial IoT & Cloud',
    description: 'Build an IIoT predictive maintenance edge device using ESP32 / Raspberry Pi. Transmit vibration, motor temperature, and current consumption data via MQTT broker to a cloud dashboard (ThingsBoard / Adafruit IO / AWS IoT) with automated anomaly alerts.',
    techStack: ['MQTT Protocol', 'ESP32 / FreeRTOS', 'Cloud Dashboards', 'Vibration Analysis', 'Node-RED'],
    deliverables: 'Live MQTT publishing pipeline, SSL/TLS security, edge threshold filtering, and interactive dashboard with email/SMS anomaly alerts.',
    difficulty: 'Advanced',
    hardwareTools: ['ESP32 DevKit', 'MPU6050 Accelerometer', 'ACS712 Current Sensor'],
    softwareTools: ['Mosquitto MQTT', 'ThingsBoard / Adafruit IO', 'FreeRTOS'],
  },
  {
    projectId: 'proj-y3-2',
    title: 'Digital Closed-Loop Motor Speed Controller (PID)',
    year: 3,
    semesterNumber: 6,
    category: 'Control Systems & Embedded C',
    description: 'Implement a discrete PID control algorithm on a microcontroller to regulate DC motor RPM under fluctuating mechanical loads using optical encoder feedback and H-Bridge PWM switching.',
    techStack: ['Embedded C', 'Digital PID', 'Optical Encoders', 'Hardware PWM', 'Oscilloscope Testing'],
    deliverables: 'Mathematical model derivation in MATLAB/Simulink, translated into bare-metal C code with settling time under 500ms and minimal overshoot.',
    difficulty: 'Advanced',
    hardwareTools: ['DC Motor with Optical Encoder', 'L298N / MOSFET H-Bridge', 'Oscilloscope'],
    softwareTools: ['MATLAB / Simulink', 'Embedded C / Keil / AVR-GCC'],
  },
];

/**
 * @desc    Get all 8 semesters with full breakdown
 * @route   GET /api/roadmap/semesters
 * @access  Public
 */
const getAllSemesters = async (req, res, next) => {
  try {
    let semesters = [];
    if (isDbReady()) {
      try {
        semesters = await Semester.find().sort({ semesterNumber: 1 });
      } catch (err) {
        semesters = [];
      }
    }
    if (!semesters || semesters.length === 0) {
      semesters = fallbackSemesters;
    }

    res.json({
      success: true,
      count: semesters.length,
      data: semesters,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get specific semester by number (1-8)
 * @route   GET /api/roadmap/semesters/:semNumber
 * @access  Public
 */
const getSemesterByNumber = async (req, res, next) => {
  try {
    const semNumber = Number(req.params.semNumber);
    let semester = null;

    if (isDbReady()) {
      try {
        semester = await Semester.findOne({ semesterNumber: semNumber });
      } catch (err) {
        semester = null;
      }
    }

    if (!semester) {
      semester = fallbackSemesters.find((s) => s.semesterNumber === semNumber);
    }

    if (!semester) {
      return res.status(404).json({
        success: false,
        message: `Semester ${semNumber} not found`,
      });
    }

    res.json({
      success: true,
      data: semester,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all portfolio projects
 * @route   GET /api/roadmap/projects
 * @access  Public
 */
const getAllProjects = async (req, res, next) => {
  try {
    let projects = [];
    if (isDbReady()) {
      try {
        projects = await Project.find().sort({ year: 1, semesterNumber: 1 });
      } catch (err) {
        projects = [];
      }
    }
    if (!projects || projects.length === 0) {
      projects = fallbackProjects;
    }

    res.json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get high-level dashboard metrics & metadata
 * @route   GET /api/roadmap/summary
 * @access  Public
 */
const getDashboardSummary = async (req, res, next) => {
  try {
    res.json({
      success: true,
      appName: 'AEIE Career Navigator',
      tagline: 'Plan Your Skills. Build Your Future.',
      institution: {
        college: 'University Institute of Technology (UIT)',
        university: 'The University of Burdwan',
        department: 'Applied Electronics and Instrumentation Engineering (AEIE)',
        timeline: '2026–2030',
        location: 'Golapbag, Burdwan, West Bengal, India',
      },
      metrics: {
        totalYears: 4,
        totalSemesters: 8,
        totalSubjects: 38,
        totalProjects: 6,
        careerPathways: 8,
        totalChecklistItems: 44,
      },
      pathways: [
        'Core Electronics',
        'Embedded Systems',
        'Industrial Automation',
        'Instrumentation Engineering',
        'Software Development',
        'GATE and M.Tech',
        'PSU & Government Engineering Careers',
        'Research and Higher Studies',
      ],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSemesters,
  getSemesterByNumber,
  getAllProjects,
  getDashboardSummary,
  fallbackSemesters,
  fallbackProjects,
};
