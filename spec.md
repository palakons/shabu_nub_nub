
Gemini

Chat

Spark
beta
New chat
Search chats
Images
Videos
Library
New notebook
Untitled notebook
Two Thai App Specs
Birthday Promotion Table Summary
Reviewing an Official Complaint Form
Pickle Juice Cramp Relief Mechanism
4: Radar Code Review and Analysis
Categorized Findings on LLM Writing
Linux User File Management Commands
ข้อเสนอแนะและปัญหาการใช้รถ Tesla
Overview of the NetHogs Command
Setting an Alarm
Weaver Ants Subduing Prey
Lean Crypto AI Trading Model
Veritasium Creator Interview Summary
Interactive 3D Camera Projection Visualizer
Audio Solutions for Large Lab Meetings
แก้ปัญหา Remote-SSH ไม่เข้ากัน
Budget Vegetable Nutrition Analysis
Model Size vs. Training Loss Plateau
Vintage Bangkok Topographic Map Reconstruction
Batch Deleting Items Using a File
การนำทาง: เลี้ยวซ้ายแล้วขวา
จะขอสัมมนาออนไลน์ดีไหมวะ ลงบินไปที่หนึ่ง ลงมาถึงที่นี่
ที่มันจะเสิร์ฟอะไรจำไม่ได้ อืม ประมาณนั้น
Satirical Parachute Study Explained
ฮัลโหล ดีครับ
YouTube Link Not Accessible
AI Club and Course Discussion
Resume Analysis for OpenAI Role
Nail Regrowth and Safety Advice
Chiang Mai's Absence in Lao History
นายกเทศมนตรี vs ผู้ว่า
ห่ำสุ่ยก๋อ คือไร
help visulzie this addition (tacking the image frame as input to WAN-VAE) iw anna att it as figure to my weekly progress report my advisor like it precise
FIFA Lyrics: Spanish and Portuguese Analysis
Orchestral Score for Life's Journey
Hamming's Research: Agree, Disagree, Middle
AI Abstraction: EE Wisdom & Questions
Defending DDPM + PTv3 Architecture
ได้ยินไหม?
Explaining 3D Relative Position Encoding
file:///Users/palakons/Downloads/tcl-nxtpaper-whitepaper.pdf. what tech si this, is it not eink? is it just fancy well-groom LCD?
Current Time Inquiry
PointTransformer DDPM Denoiser Search
Installing Nginx in Cloud Shell
Persistent Disk Deletion on Instance Deletion
AI Talk Summary for University
Professor's Acceptance Confirmed, Administrative Delays
Flash Attention Installation Troubleshooting
Point Cloud Encoding for Diffusion Models
Dissertation Summaries: Problem, Method, Network
Cabbage Chicken Meal Ideas
Thai Mythical Equivalents to Hyperborea
Podcast Access and Information
Conversation with Gemini
You are the project manager... Come up with extremely broef PRD and Spec, ill take them to vibe code agent, i have two projects, i wanna do android (qnd web by extension) apps.





- MK (the restaurant) ill wanna calculate calories among the 299 buffet menu.. like how many trays of itema bc outputi scalories...

- tahiland ezxpress way charge... Thailand we have multiple operator, non are in cnetral price system inquiryes... Lets dispay map, touch entracne and exit then output the price



Toll companie sinclude exat, donmuang tooll way, the government, ch. Karnchang etc.

Project 1: MK Buffet Calorie Calculator

1. Product Requirements Document (PRD)
Objective: A minimalist tray-counter app calculating total intake for MK Suki’s 299 THB buffet tier.

Target Platforms: Android (Capacitor/React Native or Compose) + Responsive Web.

Core Problem: MK menu items have calorie variance, but diners order by repetitive "trays" without tracking real-time intake.

Primary Persona: Buffet diners tracking macros/calories during a 90-minute meal.

MVP Scope:

Categorized menu grid (Meats, Veggies, Balls/Dumplings, Carbs, Drinks/Sauces).

Quick-stepper (- / +) on each item card.

Real-time sticky footer tallying Calories, Protein, Carbs, and Fats.

Preset serving size toggles (1 tray, 0.5 tray, sauce ladle count).

"Reset Table" and "Share Summary" modal.

2. Technical Specification & Data Model
Recommended Stack: React + Vite + Tailwind CSS (bundled via Capacitor for Android APK and deployed to Vercel/Cloudflare Pages for Web).

JSON
[
  {
    "id": "pork-slice",
    "name_th": "หมูนุ่ม / หมูสไลซ์",
    "name_en": "Sliced Pork Tray",
    "category": "meat",
    "cal_per_tray": 120,
    "protein_g": 18,
    "fat_g": 5,
    "carb_g": 0
  },
  {
    "id": "mk-salmon-ball",
    "name_th": "ลูกชิ้นแซลมอน",
    "name_en": "Salmon Ball Tray",
    "category": "balls",
    "cal_per_tray": 95,
    "protein_g": 8,
    "fat_g": 3,
    "carb_g": 9
  },
  {
    "id": "chinese-cabbage",
    "name_th": "ผักกาดขาว",
    "name_en": "Chinese Cabbage",
    "category": "veggies",
    "cal_per_tray": 15,
    "protein_g": 1,
    "fat_g": 0,
    "carb_g": 3
  },
  {
    "id": "mk-sauce",
    "name_th": "น้ำจิ้มเอ็มเค (1 ถ้วย)",
    "name_en": "MK Suki Sauce (1 cup)",
    "category": "sauce",
    "cal_per_tray": 75,
    "protein_g": 2,
    "fat_g": 1,
    "carb_g": 14
  }
]
Core State Engine:

State: orders: Record<itemId, count>

Formula: Total Calories = Σ (count * cal_per_tray)

Persist state to localStorage to guard against browser refresh during dining.

Project 2: Thailand Unified Tollway Price Calculator

1. Product Requirements Document (PRD)
Objective: Interactive map to calculate cross-operator toll road fares across Bangkok and intercity routes.

Target Platforms: Android + Web.

Core Problem: Thailand tolls are split among multiple concessionaires (EXAT, BEM/Ch. Karnchang, DMT, DOH Motorways) without a unified fare calculator.

Supported Operators:

EXAT: Chalerm Maha Nakhon, Chalong Rat, Burapha Withi, Bang Phli–Suksawat.  
TollGuru

BEM (Ch. Karnchang): Si Rat, Si Rat–Outer Ring (Prachimrat), Udon Ratthaya.  
TollGuru

DMT: Don Mueang Tollway (Original & Northern Extension).  
TollGuru

DOH: Motorway 7 (Chonburi/Pattaya), Motorway 9 (Kanchanaphisek Ring).  
TollGuru

MVP Scope:

Leaflet/MapLibre interactive map rendering toll plaza entry/exit nodes.

Node-selection workflow: Tap Entrance Plaza -> Tap Exit Plaza (or search via autocomplete).

Vehicle class switcher: 4-Wheels (Class 1), 6–10 Wheels (Class 2), >10 Wheels (Class 3).  
TollGuru

Result card displaying:

Total Fee (THB).  
TollGuru

Operator cost breakdown (e.g., DMT: 90 THB + EXAT: 50 THB).  
TollGuru

Compatible payment methods (Easy Pass, M-Pass, M-Flow, Cash, EMV Contactless).  
TollGuru

2. Technical Specification & Data Model
Recommended Stack: React/TypeScript + Tailwind + leaflet / react-leaflet + OpenStreetMap tiles.

TypeScript
type VehicleClass = 'class_1' | 'class_2' | 'class_3';
type Operator = 'EXAT' | 'BEM' | 'DMT' | 'DOH';

interface TollPlaza {
  id: string;
  name_th: string;
  name_en: string;
  expressway_line: string;
  operator: Operator;
  coords: [latitude: number, longitude: number];
  is_entry: boolean;
  is_exit: boolean;
}

interface TollRouteEdge {
  from_plaza_id: string;
  to_plaza_id: string;
  rates: Record<VehicleClass, number>;
  payment_tags: ('EASY_PASS' | 'M_FLOW' | 'CASH' | 'EMV')[];
}
Calculation Engine:

Model the expressway network as a directed weighted graph where nodes = plazas and edges = fare segments.

Execute Dijkstra's algorithm or an indexed edge-lookup table for common origin-destination pairs.

If a route traverses borders (e.g., Don Mueang Tollway onto Si Rat via Din Daeng), sum the segments:

Total Fee=Fee 
DMT
​
 +Fee 
BEM/EXAT
​
 
Gnerate copy-paste text file to prompt gemni cli



2 separetd files for each app

Your TXT files are ready:

TXT icon
mk_buffet_calculator_gemini_cli_prompt
 TXT 
TXT icon
thailand_tollway_calculator_gemini_cli_prompt
 TXT 
How to Run with Gemini CLI
You can download the files above or pipe them directly to Gemini CLI in your terminal:

Bash
# For the MK Buffet App
gemini < mk_buffet_calculator_gemini_cli_prompt.txt

# For the Thailand Tollway App
gemini < thailand_tollway_calculator_gemini_cli_prompt.txt
File 1: mk_buffet_calculator_gemini_cli_prompt.txt
Plaintext
You are an expert full-stack engineer and UI/UX designer. Your task is to build a complete, production-ready, mobile-first Web and Android-compatible application: "MK Buffet 299 Calorie & Tray Tracker" (เอ็มเค บุฟเฟต์ 299 แคลอรี & ถาดเคาน์เตอร์).

### Project Overview
A lightning-fast, tactile food and tray tracker specifically designed for diners at MK Suki's 299 THB buffet tier. Diners order dozens of stacked plastic trays without knowing their cumulative calories and macros. This app lets them tap trays on the table in real-time with zero friction, showing live calories, protein, carbs, fat, and tray counts.

### Target Platforms
- Responsive Web (Vite + React + TypeScript + Tailwind CSS)
- Android App via Capacitor or PWA (installable with manifest and touch-optimized haptics/UI)

### Key Features & UX Flow
1. Sticky Header & Quick Stats:
   - Live Total Calories counter with smooth animated number transitions.
   - Macro split bar (Protein, Carbs, Fat in grams and % breakdown).
   - Total Tray count badge (e.g., "14 trays ordered").
   - Quick "Reset Table" button with double-tap or confirmation modal.
2. Category Navigation Tabs:
   - "All", "Meats & Seafood" (เนื้อสัตว์), "Balls & Dumplings" (ลูกชิ้น/เกี๊ยว), "Veggies & Mushrooms" (ผัก/เห็ด), "Carbs & Noodles" (เส้น/ข้าว), "Sauces & Condiments" (น้ำจิ้ม/ซุป).
3. Tactile Tray Counter Card:
   - Card displays: Item thumbnail/icon, Thai name, English name, calorie per tray, protein/fat/carb breakdown.
   - Stepper controls: Big accessible '-' and '+' buttons.
   - Long-press or quick badge to add +5 trays at once.
   - Visual badge showing current quantity for that item on the table.
4. Tray Receipt & Social Summary Modal:
   - "สรุปมื้ออาหาร" (Meal Summary) modal showing total trays eaten, calories, cost per calorie (299 THB / total kcal), and protein per baht efficiency.
   - Copyable text summary or downloadable clean graphic summary to share to LINE / Instagram Stories.
5. Offline Persistence:
   - Auto-save current table session to localStorage.
   - Prevent screen sleep while dining (Screen Wake Lock API if available).

### Technical Stack & Dependencies
- React 18+ with TypeScript
- Vite
- Tailwind CSS with Lucide-React icons
- Canvas-confetti (optional reward for hitting protein target)
- LocalStorage persistence hook

### Mock Menu Data (MK 299 Buffet Tier)
Include a comprehensive dataset in src/data/mkMenu.ts with accurate estimated calories and macros:
- Sliced Pork (หมูสไลซ์): 120 kcal, 18g P, 5g F, 0g C
- Marinated Pork (หมูนุ่ม): 135 kcal, 17g P, 7g F, 1g C
- Seasoned Minced Pork (หมูทรงเครื่อง): 140 kcal, 15g P, 8g F, 2g C
- Chicken Breast Slices (ไก่สไลซ์): 95 kcal, 20g P, 2g F, 0g C
- Fish Tofu (เต้าหู้ปลา): 80 kcal, 7g P, 3g F, 6g C
- MK Salmon Balls (ลูกชิ้นแซลมอน): 90 kcal, 8g P, 3g F, 8g C
- Squid Balls (ลูกชิ้นปลาหมึก): 85 kcal, 9g P, 2g F, 7g C
- Pork Dumplings (เกี๊ยวหมู): 110 kcal, 7g P, 4g F, 12g C
- Chinese Cabbage (ผักกาดขาว): 15 kcal, 1g P, 0g F, 3g C
- Morning Glory (ผักบุ้ง): 18 kcal, 2g P, 0g F, 3g C
- Shimeji Mushroom (เห็ดชิเมจิ): 20 kcal, 2g P, 0g F, 4g C
- Enoki Mushroom (เห็ดเข็มทอง): 22 kcal, 2g P, 0g F, 4g C
- Jade Noodles 1 bundle (บะหมี่หยก 1 ก้อน): 160 kcal, 5g P, 1g F, 33g C
- Wunsen Glass Noodles (วุ้นเส้น): 80 kcal, 0g P, 0g F, 20g C
- MK Original Suki Sauce 1 ladle (น้ำจิ้มเอ็มเค 1 ทัพพี/ถ้วย): 75 kcal, 2g P, 1g F, 14g C
- Clear Suki Broth 1 bowl (ซุปใส 1 ถ้วย): 25 kcal, 2g P, 1g F, 2g C

### Step-by-Step Deliverables
1. Initialize project files and package.json.
2. Create TypeScript types (MenuItem, OrderItem, Category, MacroTotal).
3. Write src/data/mkMenu.ts.
4. Build reusable UI components: HeaderStats, CategoryFilter, TrayCard, MealSummaryModal.
5. Implement reactive state with local storage in useTableStore or React hooks.
6. Provide build configuration (vite.config.ts, tailwind.config.js) and clear instructions to test locally with npm run dev and bundle for Android via Capacitor.

Generate all necessary source files and code completely without placeholders.
File 2: thailand_tollway_calculator_gemini_cli_prompt.txt
Plaintext
You are an expert GIS and full-stack software engineer. Your task is to build a complete, production-ready, mobile-first Web and Android-compatible application: "Thailand Expressway & Tollway Fare Calculator" (คำนวณค่าทางด่วนและโทลล์เวย์ไทย).

### Project Overview
Thailand expressway and tollway systems are fractured across multiple concessionaires and public agencies:
1. EXAT (การทางพิเศษแห่งประเทศไทย): Chalerm Maha Nakhon, Si Rat, Chalong Rat, Burapha Withi, Bang Phli–Suksawat, Kanchanaphisek Southern Ring.
2. BEM / Ch. Karnchang (ทางด่วนและรถไฟฟ้ากรุงเทพ): Concessionaire for Si Rat, Si Rat–Outer Ring (Prachimrat), Udon Ratthaya (Bang Pa-in).
3. DMT / Don Muang Tollway PCL: Elevated tollway over Vibhavadi Rangsit (Din Daeng – Don Mueang – National Monument).
4. DOH (กรมทางหลวง): Intercity Motorway No. 7 (Bangkok–Chonburi–Pattaya–Maptaphut) and Motorway No. 9 (Eastern & Western Outer Ring Road).

Currently, there is no unified app where drivers can tap their entrance plaza and exit plaza on an interactive Bangkok map and immediately see the accurate consolidated fare, operator breakdown, and payment tag support.

### Target Platforms
- Responsive Web (Vite + React + TypeScript + Tailwind CSS)
- Android App via Capacitor / WebView / PWA

### Key Features & UX Flow
1. Interactive Leaflet / MapLibre Map:
   - High-performance map centered on the Greater Bangkok Expressway Network (coordinates [13.7563, 100.5018], zoom 11).
   - Visual toll plaza pins with distinct operator color codes (EXAT = Blue, BEM = Purple, DMT = Orange, DOH = Green).
   - Tap Plaza pin to select as "Entrance (จุดขึ้น)" or "Exit (จุดลง)".
2. Search & Select Input Panel:
   - Origin and Destination searchable autocomplete dropdowns supporting Thai and English plaza names.
   - "Swap Origin / Destination" button.
   - Vehicle Type Selector:
     * 4-Wheels (รถ 4 ล้อ - Class 1)
     * 6-10 Wheels (รถ 6-10 ล้อ - Class 2)
     * >10 Wheels (รถมากกว่า 10 ล้อ - Class 3)
3. Smart Fare Calculation & Multi-Operator Breakdown:
   - Calculate total fare (THB).
   - Display itemized breakdown by tollway section and concessionaire (e.g., "Don Mueang Tollway (DMT): 80 THB" + "Si Rat Expressway (EXAT/BEM): 50 THB" = Total 130 THB).
   - Payment method badges: Easy Pass, M-Pass, M-Flow, EMV Contactless Credit/Debit, Cash.
4. Pre-calculated Popular Routes Quick Select:
   - "Don Mueang Airport -> Silom / Sathorn"
   - "Suvarnabhumi Airport -> Siam Paragon"
   - "Bang Na -> Rama 2"
   - "Rangsit -> Bang Na via Eastern Ring (Motorway 9)"
   - "Chatuchak -> Bang Pa-in (Udon Ratthaya)"
5. Offline-first Graph/Matrix Data:
   - Embed realistic toll plaza network nodes and fare matrices directly in local TypeScript data structures so no external API key or paid backend is required.

### Technical Stack
- React 18+ with TypeScript + Vite
- Tailwind CSS
- Leaflet + React-Leaflet + Leaflet CSS (using OpenStreetMap carto tiles)
- Lucide-React for crisp icons

### Data Structure Requirements
Include comprehensive data in src/data/tollNetwork.ts:
- Plazas array with id, name_th, name_en, operator, line, coords [lat, lng], is_entry, is_exit, payment_methods.
- Include major plazas across:
  * Chalerm Maha Nakhon (Din Daeng, Bang Na, Dao Khanong, Port)
  * Si Rat & Chalong Rat (Asoke, Rama 9, Chatuchak, Pracha Chuen, Srinakarin, Sukhaphiban 5)
  * Don Mueang Tollway (Din Daeng, Lat Phrao, Ratchadaphisek, Don Mueang, Lak Si, Anusorn Sathan)
  * Burapha Withi (Bang Na KM.6, Chonburi KM.55)
  * Motorway 7 & Motorway 9 (Thap Chang, Lat Krabang, Phan Thong)
- Fare calculation graph / lookup table with vehicle class rates.

### Step-by-Step Deliverables
1. Complete package.json with all required dependencies.
2. TypeScript types for Plazas, Routes, Operators, and Fares.
3. Realistic tollway dataset in src/data/tollNetwork.ts.
4. Route calculation engine (src/utils/fareEngine.ts).
5. Map component with custom colored markers and interactive popups.
6. Bottom sheet / floating sidebar UI for route summary and fare breakdown.
7. Capacitor Android build configuration guidelines.

Generate the complete, runnable code files for this project.





Gemini is AI and can make mistakes.

Detailing Toll App Features
You are an expert full-stack engineer and UI/UX designer. Your task is to build a complete, production-ready, mobile-first Web and Android-compatible application: "MK Buffet 299 Calorie & Tray Tracker" (เอ็มเค บุฟเฟต์ 299 แคลอรี & ถาดเคาน์เตอร์).

### Project Overview
A lightning-fast, tactile food and tray tracker specifically designed for diners at MK Suki's 299 THB buffet tier. Diners order dozens of stacked plastic trays without knowing their cumulative calories and macros. This app lets them tap trays on the table in real-time with zero friction, showing live calories, protein, carbs, fat, and tray counts.

### Target Platforms
- Responsive Web (Vite + React + TypeScript + Tailwind CSS)
- Android App via Capacitor or PWA (installable with manifest and touch-optimized haptics/UI)

### Key Features & UX Flow
1. Sticky Header & Quick Stats:
   - Live Total Calories counter with smooth animated number transitions.
   - Macro split bar (Protein, Carbs, Fat in grams and % breakdown).
   - Total Tray count badge (e.g., "14 trays ordered").
   - Quick "Reset Table" button with double-tap or confirmation modal.
2. Category Navigation Tabs:
   - "All", "Meats & Seafood" (เนื้อสัตว์), "Balls & Dumplings" (ลูกชิ้น/เกี๊ยว), "Veggies & Mushrooms" (ผัก/เห็ด), "Carbs & Noodles" (เส้น/ข้าว), "Sauces & Condiments" (น้ำจิ้ม/ซุป).
3. Tactile Tray Counter Card:
   - Card displays: Item thumbnail/icon, Thai name, English name, calorie per tray, protein/fat/carb breakdown.
   - Stepper controls: Big accessible '-' and '+' buttons.
   - Long-press or quick badge to add +5 trays at once.
   - Visual badge showing current quantity for that item on the table.
4. Tray Receipt & Social Summary Modal:
   - "สรุปมื้ออาหาร" (Meal Summary) modal showing total trays eaten, calories, cost per calorie (299 THB / total kcal), and protein per baht efficiency.
   - Copyable text summary or downloadable clean graphic summary to share to LINE / Instagram Stories.
5. Offline Persistence:
   - Auto-save current table session to `localStorage`.
   - Prevent screen sleep while dining (Screen Wake Lock API if available).

### Technical Stack & Dependencies
- React 18+ with TypeScript
- Vite
- Tailwind CSS with Lucide-React icons
- Canvas-confetti (optional reward for hitting protein target)
- LocalStorage persistence hook

### Mock Menu Data (MK 299 Buffet Tier)
Include a comprehensive dataset in `src/data/mkMenu.ts` with accurate estimated calories and macros:
- Sliced Pork (หมูสไลซ์): 120 kcal, 18g P, 5g F, 0g C
- Marinated Pork (หมูนุ่ม): 135 kcal, 17g P, 7g F, 1g C
- Seasoned Minced Pork (หมูทรงเครื่อง): 140 kcal, 15g P, 8g F, 2g C
- Chicken Breast Slices (ไก่สไลซ์): 95 kcal, 20g P, 2g F, 0g C
- Fish Tofu (เต้าหู้ปลา): 80 kcal, 7g P, 3g F, 6g C
- MK Salmon Balls (ลูกชิ้นแซลมอน): 90 kcal, 8g P, 3g F, 8g C
- Squid Balls (ลูกชิ้นปลาหมึก): 85 kcal, 9g P, 2g F, 7g C
- Pork Dumplings (เกี๊ยวหมู): 110 kcal, 7g P, 4g F, 12g C
- Chinese Cabbage (ผักกาดขาว): 15 kcal, 1g P, 0g F, 3g C
- Morning Glory (ผักบุ้ง): 18 kcal, 2g P, 0g F, 3g C
- Shimeji Mushroom (เห็ดชิเมจิ): 20 kcal, 2g P, 0g F, 4g C
- Enoki Mushroom (เห็ดเข็มทอง): 22 kcal, 2g P, 0g F, 4g C
- Jade Noodles 1 bundle (บะหมี่หยก 1 ก้อน): 160 kcal, 5g P, 1g F, 33g C
- Wunsen Glass Noodles (วุ้นเส้น): 80 kcal, 0g P, 0g F, 20g C
- MK Original Suki Sauce 1 ladle (น้ำจิ้มเอ็มเค 1 ทัพพี/ถ้วย): 75 kcal, 2g P, 1g F, 14g C
- Clear Suki Broth 1 bowl (ซุปใส 1 ถ้วย): 25 kcal, 2g P, 1g F, 2g C

### Step-by-Step Deliverables
1. Initialize project files and `package.json`.
2. Create TypeScript types (`MenuItem`, `OrderItem`, `Category`, `MacroTotal`).
3. Write `src/data/mkMenu.ts`.
4. Build reusable UI components: `HeaderStats`, `CategoryFilter`, `TrayCard`, `MealSummaryModal`.
5. Implement reactive state with local storage in `useTableStore` or React hooks.
6. Provide build configuration (`vite.config.ts`, `tailwind.config.js`) and clear instructions to test locally with `npm run dev` and bundle for Android via Capacitor.

Generate all necessary source files and code completely without placeholders.
mk_buffet_calculator_gemini_cli_prompt.txt
Displaying mk_buffet_calculator_gemini_cli_prompt.txt.
