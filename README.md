\# 🌧️ METEO-RISK AI



\## AI Flood Early Warning \& Incident Management System



METEO-RISK AI est un système intelligent de surveillance, de détection des risques d’inondation et de gestion automatisée des incidents.



Le projet combine les données météorologiques, les prévisions météo et les données de niveau d’eau afin d’évaluer automatiquement le niveau de risque et de déclencher les actions appropriées.



\---



\## 🎯 Objectif du projet



L’objectif principal de METEO-RISK AI est de détecter rapidement les situations présentant un risque d’inondation et d’automatiser le processus allant de la collecte des données jusqu’à la clôture de l’incident.



Le système permet notamment de :



\- collecter automatiquement les données météorologiques ;

\- récupérer les données de géolocalisation ;

\- intégrer les données de niveau d’eau ;

\- calculer un score de risque ;

\- classifier le risque ;

\- générer des alertes ;

\- créer et suivre les incidents ;

\- gérer les interventions ;

\- assurer la traçabilité dans MongoDB ;

\- détecter le retour à la normale ;

\- clôturer automatiquement les incidents ;

\- générer un rapport avec l’IA ;

\- visualiser les informations dans un dashboard ;

\- envoyer des notifications via Slack et Gmail.



\---



\## 🏗️ Architecture générale



Le fonctionnement global du système suit cette chaîne :



```text

Geolocation

&#x20;     ↓

Weather API + Forecast + Water Level

&#x20;     ↓

Data Preparation

&#x20;     ↓

Risk Engine

&#x20;     ↓

LOW | MEDIUM | HIGH | CRITICAL

&#x20;     ↓

Alert Management

&#x20;     ↓

Incident Management

&#x20;     ↓

Intervention

&#x20;     ↓

MongoDB

&#x20;     ↓

Recovery Monitoring

&#x20;     ↓

Incident Resolution / Closure

&#x20;     ↓

AI Report

&#x20;     ↓

Dashboard + Slack + Gmail

```



\---



\## 🌦️ Collecte des données



METEO-RISK AI exploite plusieurs catégories de données :



\- localisation ;

\- température ;

\- humidité ;

\- précipitations ;

\- pluie ;

\- vitesse du vent ;

\- rafales ;

\- pression atmosphérique ;

\- prévisions météorologiques ;

\- niveau d’eau.



Les données sont ensuite préparées avant leur analyse par le moteur de risque.



\---



\## 🧠 Risk Engine



Le Risk Engine analyse les données collectées et produit un niveau de risque.



Quatre niveaux sont utilisés :



| Niveau | Signification | Action principale |

|---|---|---|

| 🟢 LOW | Conditions normales | Surveillance |

| 🟡 MEDIUM | Vigilance | Surveillance renforcée |

| 🟠 HIGH | Risque élevé | Alerte et préparation d’intervention |

| 🔴 CRITICAL | Risque critique | Intervention d’urgence |



\---



\## 🚨 Gestion des incidents



Lorsqu’un risque important est détecté, le système peut automatiquement :



1\. créer un incident ;

2\. générer un `incident\_id` unique ;

3\. définir sa sévérité et sa priorité ;

4\. affecter une intervention ;

5\. suivre l’évolution de l’incident ;

6\. enregistrer les différentes étapes ;

7\. mettre à jour son statut.



\---



\## 🗄️ MongoDB et traçabilité



MongoDB est utilisé pour conserver les informations liées aux incidents.



Le même `incident\_id` permet de suivre le cycle de vie de l’incident depuis sa création jusqu’à sa résolution.



Exemple de cycle :



```text

OPEN

&#x20; ↓

ASSIGNED

&#x20; ↓

INTERVENTION

&#x20; ↓

RECOVERY

&#x20; ↓

RESOLVED

&#x20; ↓

CLOSED

```



\---



\## ♻️ Recovery \& clôture



Après une alerte, METEO-RISK AI continue de surveiller les données.



Lorsque les conditions reviennent à un niveau acceptable, le système peut déclencher le processus de récupération :



```text

CRITICAL

&#x20;  ↓

Intervention

&#x20;  ↓

Monitoring

&#x20;  ↓

LOW

&#x20;  ↓

Recovery

&#x20;  ↓

RESOLVED

&#x20;  ↓

CLOSED

```



Cette logique évite de considérer l’incident comme terminé immédiatement après l’envoi de l’alerte.



\---



\## 🤖 Intelligence Artificielle



L’intelligence artificielle intervient notamment dans la génération et la synthèse des informations liées aux incidents.



Elle permet de produire un rapport de clôture exploitable à partir des informations collectées pendant le cycle de vie de l’incident.



\---



\## 📊 Dashboard



Un dashboard de supervision a été développé afin de visualiser les informations principales du système.



Le dashboard permet de suivre notamment :



\- les conditions météorologiques ;

\- le niveau de risque ;

\- le Risk Score ;

\- l’état des alertes ;

\- les incidents ;

\- les interventions ;

\- le processus de récupération ;

\- le statut final des incidents.



Le code du dashboard est disponible dans :



```text

meteo-risk-dashboard/

```



\---



\## 🔔 Notifications



Le système intègre plusieurs canaux de notification :



\### Slack



Envoi automatique des alertes et informations opérationnelles.



\### Gmail



Envoi d’e-mails contenant les informations importantes relatives aux alertes, incidents et rapports.



\---



\## 🔄 Workflow d’automatisation



Le workflow METEO-RISK AI orchestre les différentes étapes du système :



```text

Collecte

&#x20;  ↓

Préparation

&#x20;  ↓

Analyse

&#x20;  ↓

Classification

&#x20;  ↓

Décision

&#x20;  ↓

Incident

&#x20;  ↓

Intervention

&#x20;  ↓

Stockage

&#x20;  ↓

Recovery

&#x20;  ↓

Clôture

&#x20;  ↓

Reporting

```



> Les secrets, tokens et clés API ne sont pas stockés dans ce repository public.



\---



\## 🛠️ Technologies utilisées



\- JavaScript

\- Node.js

\- HTML

\- CSS

\- MongoDB

\- APIs météorologiques

\- IoT / données de niveau d’eau

\- Intelligence Artificielle / LLM

\- Slack

\- Gmail

\- BPMN

\- Git

\- GitHub



\---



\## 📁 Structure du repository



```text

METEO-RISK-AI/

│

├── meteo-risk-dashboard/

│   ├── public/

│   │   ├── index.html

│   │   ├── style.css

│   │   └── app.js

│   ├── server.js

│   ├── package.json

│   └── package-lock.json

│

├── METEO\_RISK\_AI\_TO\_BE\_FINAL\_WORKFLOW.bpmn

├── METEO\_RISK\_AI\_TO\_BE.bpmn.txt

├── bpmn as is.png

├── METEO-RISK AI.pdf

├── METEO\_RISK\_AI\_Presentation.pptx

├── .gitignore

└── README.md

```



\---



\## 🚀 Installation du dashboard



\### 1. Cloner le repository



```bash

git clone https://github.com/ayoubabdelmoughit/METEO-RISK-AI.git

```



\### 2. Accéder au dashboard



```bash

cd METEO-RISK-AI/meteo-risk-dashboard

```



\### 3. Installer les dépendances



```bash

npm install

```



\### 4. Configurer les variables d’environnement



Créer un fichier `.env` local contenant les paramètres nécessaires à l’application.



Les credentials et clés API ne doivent jamais être publiés sur GitHub.



\### 5. Lancer le dashboard



```bash

node server.js

```



\---



\## 🔐 Sécurité



Les données sensibles sont exclues du repository grâce au fichier `.gitignore`.



Les éléments suivants ne doivent notamment pas être publiés :



```text

.env

node\_modules/

API Keys

Slack Tokens

MongoDB Credentials

LLM API Keys

```



\---



\## 📌 Statut du projet



\*\*METEO-RISK AI — Version prototype fonctionnelle\*\*



Les principaux scénarios du système ont été testés :



```text

LOW

MEDIUM

HIGH

CRITICAL

Incident

Intervention

Recovery

CLOSED

AI Report

```



\---



\## 👨‍💻 Auteur



\*\*Ayoub Abdelmoughit\*\*



Projet : \*\*METEO-RISK AI\*\*  

AI Flood Early Warning \& Incident Management System

