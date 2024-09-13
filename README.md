# TicTacToe
Ein WBS2-Projekt von Fatlinda Islami, Mia Balzer, Ramon Biehl und Robin Hahn.

## Nennenswerte Extra-Features

- **Die Game-Ansicht kann während des laufenden Spiels verlassen werden, ohne den Spielfortschritt zu verlieren.**
- **Ein Status-Indikator in der Navbar hält den Nutzer darüber informiert, ob er sich derzeit in der Queue befindet (gelb), ob er spielt und, am Zug ist (grün) oder nicht am Zug ist (rot).**
- **Der Server kann beendet werden oder die Client-Verbindung kann unterbrochen werden, ohne dass laufende Spiele verloren gehen.**
- **Die Queue wird bei Disconnects nicht verlassen; stattdessen gibt es eine Acknowledge-Abfrage, die die Erreichbarkeit des Clients sicherstellt.**
- **Das Spiel kann aufgegeben werden.**
- **Es gibt einen Chat.**
- **Admins können laufenden Spielen zusehen.**
- **Profilbilder werden als separate API-Anfrage gestreamt.**
- **Queue und laufende Spiele werden im Admindashboard bei Änderungen aktualisiert.**

## Backend

### User
Das User-Modul verwaltet Nutzer und alle wichtigen Nutzerinformationen. Der Controller verwaltet alle nutzerbezogenen Endpunkte. `@me`-Routen beziehen sich auf den angemeldeten Nutzer.

### Queue
Das Queue-Modul umfasst die gesamte Logik der Matchmaking-Queue. Die Queue selbst wird als Runtime-Objekt im Queue-Service gehalten. Neben einem Controller besitzt dieses Modul ein Gateway, das die Events der Socket-Kommunikation bearbeitet. Wird ein potenzielles Match gefunden, wird ein separater Acknowledge-Prozess gestartet, der sicherstellt, dass beide Clients noch erreichbar sind. Die Spielteilnehmer werden in einen Socket-Raum gesteckt, der über die Game-ID angesprochen werden kann. Darüber läuft die Game-bezogene Kommunikation. Admins können diesen Raum betreten, um zuzuschauen.

### Game
Das Game-Modul beinhaltet die Spiel-Logik sowie die Socket-Kommunikation, die das Ausführen von Zügen, das Aufgeben und das Zuschauen verwaltet. Hier wird auch die Chat-Kommunikation verwaltet, ebenso wie das Zuschauen von Admins.

### Auth
Das Auth-Modul verwaltet das An- und Abmelden von Nutzern.

### ProfilePicture
Der Service kümmert sich um das Speichern und Abrufen von Profilbildern.

### DemoData
Der Service generiert Demodaten in der Datenbank.

### Elo
Dieser Service berechnet die gewonnenen oder verlorenen Elo-Punkte.

### Filter, Guards & Socket

#### HttpExceptionTransformationFilter
Dieser Filter wandelt HTTP-Fehler in WebSocket-Fehler um, was es ermöglicht, denselben Code sowohl für API- als auch für Socket-Kommunikation zu verwenden.

#### Guards
Es kommen zwei Guards zum Einsatz, wobei jeder Guard eine eigene Socket-Ausführung besitzt, da die Logik leicht unterschiedlich ist. Der `is-logged-in`- und der `is-socket-logged-in`-Guard erlauben den Zugriff auf Endpunkte nur für angemeldete Nutzer. Der `roles`- und der `is-socket-admin`-Guard beschränken den Zugriff auf Endpunkte auf Nutzer mit Admin-Status.

#### SessionIO Adapter
Der SessionIO-Adapter erweitert die Standardausführung des Socket.IO-Adapters um Zugriff auf die Session-Middleware.

#### Events
In `events.ts` werden alle vom Server gesendeten und empfangenen Events festgelegt.
