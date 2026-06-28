# 🌱 Smart Senya — Irrigation Connectée

Une application de contrôle d'irrigation **à distance via LoRa** avec interface web/mobile PWA professionnelle.

![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-Beta-orange)
![Version](https://img.shields.io/badge/version-1.0-blue)

---

## 🎯 Fonctionnalités

### Contrôle
- ✅ Commande ON/OFF 2 électrovannes
- ✅ Minuterie (5, 10, 20, 30 min, 1h)
- ✅ Synchronisation temps réel avec Sonoff 4CH
- ✅ Historique des actions

### Intelligence
- 🌤️ Météo en temps réel (OpenWeatherMap)
- 🧠 Conseil d'arrosage automatique
- 💦 Détection pluie → arrosage désactivé
- 🔥 Ajustement selon température/humidité

### Notifications
- 🔔 Push notifications (OneSignal)
- 📱 Alertes vanne ouverte/fermée
- ⚡ Changements Sonoff en temps réel

### Navigation
- 🏠 **Accueil** : Dashboard principal
- 📅 **Programmes** : Arrosage automatique (future)
- 📊 **Statistiques** : Historique et consommation
- ⚙️ **Paramètres** : Configuration

---

## 🏗️ Architecture

```
Hardware:
[Sonoff 4CH] ──GPIO──> [ESP12E Émetteur] ──LoRa──> [ESP12E Récepteur] ──GPIO──> [Électrovannes]
                              │
                           [Ra-02 SX1278]
                              │
                           WiFi + Web

Cloud:
[OpenWeatherMap API] ──> App Web/Mobile
[OneSignal] ──> Notifications Push
[GitHub Pages] ──> Hébergement PWA
```

---

## 📦 Fichiers du projet

```
smart-senya/
├── smart_senya_dashboard.html    ← App web principale
├── manifest.json                 ← Config PWA
├── sw.js                         ← Service Worker (cache offline)
├── icon.svg                      ← Icône source
├── icon-192.png                  ← Icône 192×192 (générer depuis SVG)
├── icon-512.png                  ← Icône 512×512 (générer depuis SVG)
├── emetteur_lora.ino             ← Code Arduino ESP12E Émetteur
├── recepteur_lora.ino            ← Code Arduino ESP12E Récepteur
├── GUIDE_DEPLOIEMENT.txt         ← Instructions déploiement
└── README.md                     ← Ce fichier
```

---

## 🔧 Installation Hardware

### Matériel requis
- 2× ESP8266 (ESP12E)
- 2× Module LoRa Ra-02 (SX1278)
- 1× Sonoff 4CH (optionnel)
- 2× Électrovannes 12V DC
- 2× Relais 12V
- Câbles, breadboard, alimentation

### Brochage

**Ra-02 ↔ ESP12E**
| Ra-02 | ESP12E | GPIO |
|-------|--------|------|
| VCC   | 3.3V   | -    |
| GND   | GND    | -    |
| SCK   | D5     | 14   |
| MISO  | D6     | 12   |
| MOSI  | D7     | 13   |
| NSS   | D8     | 15   |
| RST   | D4     | 2    |
| DIO0  | D0     | 16   |

**Sonoff 4CH ↔ ESP12E Émetteur**
| Sonoff | ESP12E |
|--------|--------|
| Relais 1 | D1 |
| Relais 2 | D2 |
| GND    | GND |

### Flashing Arduino

1. Installer Arduino IDE + librairie LoRa de Sandeep Mistry
2. Ouvrir `emetteur_lora.ino` et `recepteur_lora.ino`
3. Configurer WiFi (SSID + mot de passe)
4. Téléverser sur chaque ESP

---

## 🌐 Installation Web/Mobile

### Prérequis
- Clé OpenWeatherMap (gratuit) : https://openweathermap.org
- Compte OneSignal (gratuit) : https://onesignal.com
- Compte GitHub (gratuit) : https://github.com

### Étapes

1. **Convertir l'icône SVG en PNG**
   ```bash
   convert -density 192 -resize 192x192 icon.svg icon-192.png
   convert -density 512 -resize 512x512 icon.svg icon-512.png
   ```

2. **Créer dépôt GitHub**
   - Nouveau repo "smart-senya"
   - Public
   - Commit tous les fichiers

3. **Activer GitHub Pages**
   - Settings → Pages
   - Source: main branch
   - Attendre 2-3 min

4. **URL finale**
   ```
   https://votre-username.github.io/smart-senya/
   ```

5. **Installer sur téléphone**
   - Menu navigateur → "Ajouter à l'écran d'accueil"
   - L'app s'installe comme native

---

## 🔌 Configuration

### Modifier IP ESP
Dans `smart_senya_dashboard.html` ligne ~920:
```javascript
const ESP_IP = '192.168.0.163';  // ← Changez avec votre IP
```

### Ajouter clés API
```javascript
const METEO_API_KEY = 'votre_clé_openweathermap';
const ONESIGNAL_APP_ID = 'votre_app_id';
const ONESIGNAL_API_KEY = 'votre_api_key';
```

---

## 🚀 Usage

### Via Web
```
http://192.168.0.163  (réseau local)
https://votre-domain.github.io/smart-senya/ (public)
```

### Via Mobile App
1. Ajouter à écran accueil
2. Ouvre comme application native
3. Fonctionne hors ligne (cache)

### API REST ESP

**Commande vanne**
```
GET /commande?v=1&e=1
GET /commande?v=2&e=0
```

**État JSON**
```
GET /etat
→ {"v1": true, "v2": false}
```

---

## 📊 Roadmap

### v1.0 (Actuellement)
- ✅ Commande manuelle
- ✅ Minuterie
- ✅ Météo réelle
- ✅ Notifications
- ✅ PWA mobile

### v2.0 (À venir)
- 📅 Programmes automatiques
- 🌱 Arrosage intelligent basé météo
- 📈 Statistiques détaillées
- 🔐 Authentification utilisateur
- ☁️ Synchronisation cloud

### v3.0 (Long terme)
- 👥 Support multi-utilisateurs
- 🏡 Multi-sites
- 📱 APK Android natif
- 🍎 App iOS
- 🤖 Intégration IA (prédiction météo)

---

## 🐛 Troubleshooting

### Service Worker ne charge pas
```javascript
// Vérifier console
navigator.serviceWorker.getRegistrations()
  .then(regs => console.log(regs));
```

### Notifications ne fonctionnent pas
- Vérifier permission navigateur
- HTTPS requis (GitHub Pages = OK)
- Attendre 10-15 min activation clé OneSignal

### Méteo affiche "Chargement..."
- Clé API pas activée (attendre 15 min)
- Vérifier console pour erreurs
- Permission GPS refusée ? App utilise Tunis par défaut

### ESP non connecté
- Vérifier IP (Serial Monitor)
- Même WiFi que l'app
- Pare-feu peut bloquer port 80

---

## 📄 Licence

MIT License — Libre d'utilisation commerciale

---

## 👨‍💻 Développement

### Stack
- Frontend: Vanilla JS + HTML/CSS
- Backend: Arduino C++ (ESP8266)
- Wireless: LoRa 433MHz (SX1278)
- Cloud: GitHub Pages + APIs gratuits

### Contributions
Les pull requests sont bienvenues !

---

## 📧 Support

Pour questions/bugs :
- 📝 Ouvrir une issue GitHub
- 💬 Discussions

---

**Fait avec 💧 pour l'agriculture durable**

Version 1.0 — Juin 2026
