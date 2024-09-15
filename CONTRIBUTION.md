

## Projekt Start und Testen



### Backend
Navigieren Sie zuerst in den Backend-Ordner:

````bash
cd backend
````

Installieren Sie alle nötigen Abhängigkeiten:

```bash
npm install
```

Anschließend starten Sie das Backend:

````bash
npm run start:dev
````




### Frontend
Navigieren Sie zuerst in den Frontend-Ordner:

````bash
cd frontend
````

Installieren Sie alle nötigen Abhängigkeiten:

```bash
npm install
```

Starten Sie die Anwendung mit:

````bash
npm run watch
````

### How to Test

#### Melden Sie sich mit den Demodaten der Nutzer an

| Username      | Password      |
| ------------- | ------------- |
| admin         | adminPass     |
| john_johnson  | john_johnson  |
| john_john     | john_john     |
| john_smith    | john_smith    |

Sie können aber selbstverständlich eigene Nutzer erstellen, indem Sie sich Registrieren.


### Nutzer Test

#### Warteschlange
Drücken Sie nach dem Einlogen den vorgesehenen Play Button, um in die Warteschlange zu kommen.
Während Sie sich in der Warteschlange befinden, können Sie frei auf der Seite Navigieren.
Ihr Status und Nachrichten teilen Ihnen immer mit was der aktuelle Stand der Warteschlange oder des Spiels ist.
Sollte ein Spiel gefunden werden, werden Sie dementsprechend Benachrichtigt.



#### Laufendes Spiel
Auf der Spiel Seite können Sie nun Spielen und Ihren Zug machen. Sollten Sie das Spiel verlassen wollen, können Sie einfach auf den zurück Button drücken.
Das Spiel läuft aber natürlich weiter.
Sollten Sie Aufgeben wollen, dann ist dieser Button nicht zu übersehen. Die Aktion müssen Sie nun nur noch einmal bestätigen.
Zusätzlich können Sie sich, über einen Chat, mit dem Gegner austauschen.


#### Profil
Klicken Sie oben rechts auf Ihr Profilbild. Laden Sie ein neues Profilbild hoch. 
Sie können verschiedene Aktionen ausführen.
- Passwort Ändern
- Statistiken sehen
- Spiel verläufe ansehen


### Admin Test


#### Warteschlange
Vergewissern Sie sich, dass ein Nutzer in der Warteschlange auf einen anderen Spieler wartet. 
Um dies zu Testen, öffnen Sie das rechte Sidebar Menü des Admins. Dort wird der Nutzer, welcher sich in der Warteschlange befindet angezeigt.

#### Laufende Spiele
Stellen Sie sicher, das sich ein anderer Spieler ebenfalls in der Warteschlange befindet.
Sobald dies der Fall ist, öffnen Sie die linke Sidebar des Admins. Dort finden Sie das laufende Spiel.
Klicken Sie auf dieses Spiel, dann haben Sie die Möglichkeit einen der Spieler genauer zu Untersuchen, oder auch das Spiel zu Beobachten.

#### Untersuchen eines Spielers
Spieler können durch verschiedene Operationen Inspiziert werden. 

- Durch das klicken des Inspizieren Buttons in dem linken Sidebar Menü (wie oben bei Laufendem Spiel)
- Durch das Öffnen der Nutzerliste mit dem dazugehörigen Button
- Durch das suchen der Nutzer in der vorgesehenen Suchleiste





