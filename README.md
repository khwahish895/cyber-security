# CyberShield AI — Unidirectional IP Traffic Cyber Threat Detection

> **Smart India Hackathon (SIH 2026)**  
> **Problem Statement:** SIH26145  
> **Organisation:** National Technical Research Organisation (NTRO)  
> **Domain:** Blockchain & Cybersecurity  
> **Category:** Software  
> **PSO Mapping:** PSO2: Ability to Design and Develop Mobile and Web-Based Applications Under Realistic Constraints  
> **Tagline:** *Intelligent Network Threat Detection. Real-Time Risk Intelligence.*

---

## 1. Executive Summary

In high-assurance government, defense, and critical national infrastructure networks, **data diodes and optical splitters** enforce strict physical unidirectionality to prevent reverse data leakage. Because data flows in only one direction, standard Intrusion Detection Systems (IDS) that depend on bidirectional TCP handshakes, round-trip times (RTT), and reverse ACK packets fail to detect attacks.

**CyberShield AI** is an end-to-end cybersecurity operations platform engineered specifically for **passively collected unidirectional IP flow traffic**. It extracts 26 forward-path statistical telemetry features, evaluates them through a supervised Random Forest ensemble model (trained on the CSE-CIC-IDS2017 corpus), computes multi-factor 0–100 risk scores, and surfaces actionable security insights in a centralized Security Operations Center (SOC) dashboard.

---

## 2. System Architecture & Data Flow

```mermaid
flowchart TD
    subgraph DataPlane [Perimeter Ingress Tap]
        Tap[Optical Mirror / SPAN Port eth0.mirror] -->|Unidirectional Frames| Ingest[Packet Sniffer / Flow Extractor]
    end

    subgraph FeatureEngineering [Preprocessing Pipeline]
        Ingest -->|Raw Flow Records| Norm[Feature Normalizer & Schema Validator]
        Norm -->|26 Unidirectional Dimensions| Features[Flow IAT, Burst Rates, TCP Flag Ratios]
    end

    subgraph MLEngine [CyberShield-FlowNet RF Engine]
        Features --> RF[Random Forest Ensemble (100 Estimators)]
        RF --> Clf[Multi-Class Classification]
        Features --> Anomaly[Isolation Forest Anomaly Filter]
        Clf & Anomaly --> Risk[Deterministic 0-100 Risk Engine]
    end

    subgraph OperationsPlane [SOC Management Console]
        Risk --> Dashboard[React SOC Operations Dashboard]
        Risk --> Alerts[Prioritized Incident Triage]
        Risk --> Reports[Executive Threat Assessment Reports]
        Risk --> FlutterAPI[FastAPI Gateway for Mobile Flutter App]
    end
```

---

## 3. Supported Threat Vector Taxonomy

| Attack Class | MITRE ATT&CK | Key Unidirectional Signatures |
| :--- | :--- | :--- |
| **DDoS TCP SYN Flood** | T1498.001 | SYN count > 100 with zero return ACKs, Flow IAT Mean < 1.5ms, Packet rate > 2,500/s |
| **Reconnaissance PortScan** | T1046 | Short duration (<50ms), 1-2 probe packets, rapid sequential destination ports |
| **SSH Brute-Force** | T1110.001 | Destination port 22/2222, uniform cryptographic packet length (600–900 bytes) |
| **Botnet C2 Beaconing** | T1071 | Rigid isothermal timer cadence: Flow IAT Std < 4.0ms, small periodic payloads (<400 B) |
| **Lateral Infiltration** | T1027 | Malformed TCP flag compositions (FIN+PSH, SYN+FIN), non-standard port transitions |
| **Web Application Exploit** | T1190 | PSH flag clustering, payload bursts > 2,000 bytes targeting ports 80/443/8080 |
| **BENIGN (Normal)** | Nominal | Balanced flag sequences, standard packet length distributions, expected pacing |

---

## 4. Local Development & Windows 11 Setup Guide

### Prerequisites
- Node.js 18+ or 20+
- Python 3.11+
- Git

### A. Web Application & Full-Stack Server
```bash
# Clone the repository
git clone https://github.com/ntro-sih/cybershield-ai.git
cd cybershield-ai

# Install frontend and full-stack dependencies
npm install

# Start full-stack development server on port 3000
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### B. Standalone Python FastAPI Backend (Windows 11)
```powershell
# In PowerShell:
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install requirements
pip install -r requirements.txt

# Run FastAPI server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
Interactive Swagger documentation is available at [http://localhost:8000/docs](http://localhost:8000/docs).

### C. Retraining the Baseline Model
```powershell
# Activate python environment
python training/train_model.py --data path/to/cicids2017_unidirectional.csv
```

---

## 5. REST API Endpoints

- `GET /health` — Service health and unidirectional probe status
- `GET /api/v1/model/info` — ML model architecture, evaluation accuracy, and schema
- `GET /api/v1/dashboard/summary` — Aggregated SOC KPIs, risk trend, and threat breakdown
- `POST /api/v1/traffic/upload` — Ingest CSV traffic datasets with schema validation
- `GET /api/v1/traffic/flows` — Query and filter processed flow records
- `GET /api/v1/traffic/flows/{flow_id}` — Inspect deep flow telemetry and feature contributions
- `GET /api/v1/alerts` — Retrieve active security alerts
- `PATCH /api/v1/alerts/{alert_id}` — Update alert status (investigating, acknowledged, resolved)
- `POST /api/v1/model/predict` — Interactive single-flow real-time inference

---

## 6. Mobile Application Integration (Flutter)

The FastAPI backend is built with standardized Pydantic schemas and CORS support, allowing the exact same backend endpoints to feed a cross-platform Flutter mobile application:
```dart
// Flutter Dio / HTTP service example
final response = await dio.get(
  '$BASE_URL/api/v1/alerts',
  options: Options(headers: {'Authorization': 'Bearer $token'}),
);
```

---

## 7. Ethical Disclosure & NTRO Boundary Notice
*This software is developed strictly for the Smart India Hackathon (SIH26145) evaluation using open synthetic benchmarks (CSE-CIC-IDS2017). No claim of access to classified NTRO infrastructure, proprietary defense networks, or real government intelligence feeds is made or implied.*
