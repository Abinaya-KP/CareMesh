# CareMesh AI

### Self-Healing Healthcare Supply-Chain Resilience via Dual-Risk Lateral Rebalancing

> **Predict the Risk. Rebalance the Network. Protect the Patient.**

CareMesh AI is an AI-powered healthcare supply-chain decision-support platform designed to help healthcare networks identify medicine shortage and expiry risks, predict future supply disruptions, and recommend intelligent redistribution between facilities.

The core idea is based on the **Dual-Risk Paradox**:

> One healthcare facility may be running out of an essential medicine while another nearby facility has usable surplus inventory approaching expiry.

Instead of treating facilities as isolated inventory points, CareMesh AI models them as a **connected healthcare network** and recommends timely, explainable lateral redistribution.

---

## 🚨 Problem

Healthcare supply chains can face two problems simultaneously:

### Critical Medicine Shortages

* Sudden increases in patient demand can rapidly deplete inventory.
* Supplier delays can leave facilities without sufficient stock.
* Reactive replenishment may take too long during emergencies.

### Medicine Expiry & Wastage

* One facility may hold surplus medicine while another facility faces shortage.
* Near-expiry inventory may remain unused.
* This creates avoidable resource and financial loss.

### The Gap

Traditional supply chains often follow a vertical model:

```text
Supplier
   ↓
Warehouse
   ↓
Hospital / PHC
```

CareMesh AI introduces a network-level approach:

```text
          PHC with Surplus
                 │
                 │
                 ▼
          ┌─────────────┐
          │ CareMesh AI │
          └─────────────┘
                 │
                 ▼
          PHC with Shortage
```

---

# 💡 Solution

CareMesh AI continuously analyzes:

* 📦 Inventory levels
* 📈 Medicine consumption and burn rate
* ⏳ Batch expiry information
* 🚚 Facility distance and transit conditions
* 🏭 Supplier delays
* 🌧️ Disruption scenarios
* 📊 Future shortage risk

It follows a five-stage decision workflow:

```text
DETECT
   ↓
PREDICT
   ↓
MATCH
   ↓
RECOMMEND
   ↓
EXPLAIN
```

The goal is to find redistribution opportunities that can simultaneously:

**Reduce Stockout Risk + Reduce Expiry Risk**

---

# ⭐ Key Features

## 1. Operations Command Center

A centralized dashboard for monitoring the overall healthcare network.

### Provides

* Network Resilience Index
* Facility status distribution
* Critical shortage alerts
* Expiry-risk alerts
* Recommended actions
* Network-level operational overview

---

## 2. Predictive Risk Forecast

CareMesh provides multiple prediction horizons:

**24 Hours | 3 Days | 7 Days | 14 Days**

The system considers:

* Current inventory
* Consumption rate
* Days of stock remaining
* Supplier ETA
* Supplier backlog
* Demand changes

This helps move the workflow from:

**Reactive → Proactive**

---

## 3. Dual-Risk Redistribution

The core intelligence of CareMesh AI is its ability to identify situations where:

```text
Facility A
Surplus + Near Expiry
        │
        │ Redistribution
        ▼
Facility B
Shortage Risk
```

A suitable transfer can potentially reduce both:

* Stockout probability at the receiving facility
* Expiry/wastage risk at the supplying facility

---

## 4. Interactive Healthcare Network Map

The network map provides spatial visibility across facilities.

### Shows

* Facility locations
* Safe / At-Risk / Critical status
* Connected facilities
* Transfer routes
* Facility-level information

This helps identify **where the problem is and where assistance can come from**.

---

## 5. Medicine Intelligence

Medicine-level and batch-level visibility helps identify inventory that requires attention.

### Information Includes

* Medicine formulation
* Batch information
* Quantity
* Expiry date
* Days to expiry
* Manufacturer
* Storage requirements
* Risk indicators

The system follows the **FEFO — First Expiry, First Out** principle when considering expiry-sensitive inventory.

---

# 🚨 Emergency Simulator

One of CareMesh AI's key demonstration features is the **Emergency Simulator**.

It allows the healthcare network to be stress-tested against potential disruptions.

### Supported Scenarios

### 🦟 Dengue Outbreak

Simulates a **40% increase in medicine demand**.

### 🌧️ Monsoon Floods

Simulates unavailable road corridors and transportation disruption.

### 🏭 Supplier Disruption

Simulates a **5-day supplier delay**.

### ❄️ Cold-Chain Failure

Simulates risks to temperature-sensitive medicines.

### ⛰️ Remote Access Crisis

Simulates extended transportation delays to remote facilities.

---

## Emergency Response Workflow

```text
Crisis Introduced
       ↓
Risk Recalculated
       ↓
At-Risk Facilities Identified
       ↓
Surplus / Alternate Sources Located
       ↓
Recovery Plan Recommended
       ↓
Before / After Impact Displayed
```

This allows users to explore how the network could respond **before a real disruption occurs**.

---

# 🤖 Google Gemini AI Assistant

CareMesh AI includes a conversational logistics assistant powered by **Google Gemini**.

Instead of navigating multiple dashboards, users can ask questions using natural language.

### Example Questions

```text
Which clinics are running low on Paracetamol?
```

```text
Why should medicine be transferred from PHC-03 to PHC-07?
```

```text
What happens if demand increases by 40%?
```

The assistant follows:

**Ask → Analyze → Explain → Act**

---

# 🎙️ Voice Interaction

CareMesh AI supports voice-oriented interaction.

### Voice Input

Users can ask logistics questions through a microphone.

### Audio Readout

AI-generated responses can be read aloud using browser-based speech capabilities.

This provides an alternative to navigating complex dashboards and enables more natural interaction.

---

# 🔍 Explainable AI

Healthcare logistics recommendations should not simply say **what to do** — they should also explain **why**.

CareMesh AI presents recommendations through three layers.

### 1. Operational Action

Example:

```text
Transfer 600 units
PHC-03 → PHC-07
```

### 2. Clinical & Logistics Justification

The recommendation can consider:

* Recipient shortage risk
* Source surplus
* Batch expiry
* Demand
* Route feasibility
* Transit conditions

### 3. Expected Operational Impact

The system communicates potential effects such as:

* Reduced destination stockout risk
* Improved utilization of near-expiry inventory
* Faster local redistribution

---

# 👤 Human-in-the-Loop

CareMesh AI is designed as a **decision-support platform**.

The workflow is:

```text
AI Recommendation
       ↓
Authorized Officer Review
       ↓
Approval
       ↓
Action
```

This keeps human decision-makers involved in operational approvals.

---

# 🏗️ System Architecture

```text
┌─────────────────────────────────────────────┐
│       Healthcare Facilities & Sources       │
│ PHCs • CHCs • Hospitals • Warehouses        │
│ Suppliers                                   │
└──────────────────────┬──────────────────────┘
                       ↓
┌─────────────────────────────────────────────┐
│                 Data Layer                  │
│ Inventory • Consumption • Expiry • Routes  │
│ Suppliers • Facilities • Disruptions        │
└──────────────────────┬──────────────────────┘
                       ↓
┌─────────────────────────────────────────────┐
│       CareMesh Intelligence Engine          │
│                                             │
│ Risk Analysis • Forecasting                 │
│ Expiry Detection • Redistribution           │
│ Optimization • Emergency Simulation         │
└──────────────────────┬──────────────────────┘
                       ↓
┌─────────────────────────────────────────────┐
│              Google Gemini AI               │
│                                             │
│ Conversational AI • XAI • Reasoning         │
└──────────────────────┬──────────────────────┘
                       ↓
┌─────────────────────────────────────────────┐
│          CareMesh Web Application           │
│ Dashboard • Map • Forecast • Simulator      │
│ Medicine Intelligence • AI Assistant        │
└─────────────────────────────────────────────┘
```

---

# 🛠️ Technology Stack

| Layer                | Technologies Used                                               |
| -------------------- | --------------------------------------------------------------- |
| **Frontend**         | React 19, TypeScript, Tailwind CSS v4, Motion, Recharts, Lucide |
| **Voice / Audio**    | Web Speech API — Speech Recognition & Speech Synthesis          |
| **Backend**          | Node.js, Express, tsx, esbuild                                  |
| **AI / LLM**         | Google GenAI SDK (`@google/genai`), Gemini Flash Models         |
| **Build & Dev Tool** | Vite 6                                                          |
| **Deployment**       | Google Cloud Run container                                      |

### Technology Highlights

* **React 19 + TypeScript** for the application interface
* **Tailwind CSS v4** for responsive styling
* **Motion** for interactive UI animations
* **Recharts** for data visualization
* **Lucide** for interface icons
* **Web Speech API** for voice input and audio readout
* **Node.js + Express** for backend services
* **Google GenAI SDK** for Gemini integration
* **Vite 6** for fast development and production builds
* **Google Cloud Run** for cloud deployment

---

# 📊 Projected Impact

CareMesh AI was evaluated using a **20-facility simulated test network**.

### 📉 Shortage Mitigation

Stress simulations project **up to a 75% reduction in stockout probability** for critical facilities such as PHC-07 after recommended lateral rebalancing.

### 💵 Waste Prevention

The system identifies inventory approaching expiry and targets batches **within 45 days of expiry** for potential redistribution.

### ⏱️ Rapid Local Response

The prototype considers facilities within approximately a **1–2 hour road-transit window** for rapid redistribution opportunities.

### 🛡️ Resilience

The architecture is designed with graceful model-fallback behavior to support continued operation during model/service availability issues.

> **These figures represent prototype simulations/projected impact, not measured real-world clinical outcomes.**

---

# 🌐 Scalability & Real-World Potential

CareMesh AI is designed as a potential **AI decision-intelligence layer** that can work alongside existing healthcare inventory and information systems.

A future deployment could integrate appropriate APIs or data pipelines with systems such as:

* e-Aushadhi
* HMIS
* Hospital inventory systems
* District-level supply-chain systems

### Potential Deployment Flow

```text
Existing Healthcare Systems
          ↓
     CareMesh AI
          ↓
Risk Detection + Prediction
          ↓
Redistribution Recommendations
          ↓
Human Approval
          ↓
Operational Action
```

The system can potentially scale from:

**Facility → District → State-Level Healthcare Network**

---

# 🔐 Data & Privacy

CareMesh AI is currently a **prototype**.

* Uses synthetic data
* Does not use real patient records
* Does not require personally identifiable patient information
* Does not make clinical diagnoses
* Functions as a supply-chain decision-support system

For real-world deployment, additional requirements would include:

* Data security
* Authentication and authorization
* API integration
* System validation
* Healthcare/government approvals
* Operational testing
* Monitoring and audit controls

---

# 🎯 Target Users

CareMesh AI is designed for healthcare supply-chain stakeholders such as:

* District Health Officers
* Chief Pharmacists
* PHC Logistics Coordinators
* Supply-Chain Directors
* Healthcare administrators
* Government health departments
* Hospital network operators

---

# 🚀 Future Enhancements

Potential future improvements include:

* Real-time inventory integration
* Live road and traffic data
* More advanced demand forecasting
* Weather and outbreak data integration
* Automated route optimization
* Multilingual AI assistance
* Offline-first workflows
* Regional-language voice interaction
* Mobile application
* Advanced optimization algorithms
* More sophisticated machine-learning models
* Real-time supply-chain monitoring

---

# 🧪 Prototype Limitations

CareMesh AI is currently a hackathon prototype and therefore has several limitations.

### Synthetic Data

The current demonstration uses simulated healthcare network and inventory data.

### Limited Network Size

The prototype demonstrates a 20-facility test network rather than a complete real-world healthcare network.

### Simulation-Based Results

Reported impact values are based on simulations and projections.

### No Direct Clinical Decision-Making

The system focuses on supply-chain logistics and does not replace medical professionals.

### Real-World Integration

Actual deployment would require integration with existing government/hospital systems, validation, security controls and appropriate approvals.

---

# 🏆 Why CareMesh AI?

CareMesh AI focuses on a simple but important healthcare supply-chain question:

> **If one facility is running out of medicine while another nearby facility has usable surplus, why should the network wait for a shortage to become critical?**

CareMesh AI attempts to answer this through:

**Predictive Risk + Dual-Risk Optimization + Network Awareness + Emergency Simulation + Explainable Gemini AI + Human Approval**

The goal is to move healthcare supply chains:

### **From Reactive → Predictive**

### **From Isolated → Connected**

### **From Black-Box → Explainable**

### **From Static Inventory → Resilient Network**

---

# 📌 Demo

**Live Application:**
https://caremesh-ai-1.ai.studio

> The application is a prototype demonstration built for the **Build with AI: Code for Communities — Second Edition** hackathon.

---

# 👩‍💻 Developer

### Abinaya KP

**B.Tech Information Technology — II Year**
**Chennai Institute of Technology, Chennai**

Individual Participant
Build with AI: Code for Communities

---

# 📜 Disclaimer

CareMesh AI is a **prototype and research-oriented demonstration** created for a hackathon.

The projected results shown by the application are based on simulated/test-network conditions and should not be interpreted as validated real-world healthcare outcomes.

The platform does not use real patient data.

---

# ❤️ CareMesh AI

### **Predict the Risk. Rebalance the Network. Protect the Patient.**

**From fragmented facilities → to a resilient healthcare mesh.**
