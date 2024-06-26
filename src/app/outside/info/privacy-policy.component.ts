import {ChangeDetectionStrategy, Component} from '@angular/core';

import {TranslocoPipe} from '@jsverse/transloco';

@Component({
  template: `
    <h2>{{ 'ABOUT_PRIVACY_POLICY' | transloco }}</h2>

    <br />

    <h3>Wer wir sind</h3>
    <p>Alexander Kauer</p>
    <br />
    <p>Mit einem Website-Besuch werden keine Drittinhalte nachgeladen oder sonstige Trackingmaßnahmen betrieben.</p>
    <p>
      Falls du trotzdem fragen hast, kannst du dich gerne an <a href="mailto:contact@kaulex.dev">contact&#64;kaulex.dev</a>
      wenden
    </p>

    <br /><br />

    <h3>Personen welche keinen Account haben</h3>
    <br />
    <p>
      Wenn du keinen Account besitzt werden keine Daten von dir gespeichert und verarbeitet! Außerdem kannst du dich nicht anmelden da du
      keinen Account hast und auch keinen erstellen kannst.
    </p>

    <br /><br />

    <h3>Personen welche einen Account besitzen</h3>
    <br />

    <h4>Welche personenbezogenen Daten wir sammeln und warum wir sie sammeln</h4>
    <p>
      Als Vereinsmitglied werden folgende Daten von dir gespeichert. <br />
      - Email-Adresse (zur Identifizierung und Kontaktaufnahme, <br />
      - Vorname, <br />
      - Nachname, <br />
      - Geburtsdatum <br />
      - Passwort (gehasht) <br />
      Passwörter sind weder für einen Administrator, Entwickler oder im Fall eines Hacks für den Angreifer jemals in Klartext sichtbar! Wir
      empfehlen trotzdem den Gebrauch eines eigenen Passwort für kellner.team.
    </p>

    <h4>Cookies</h4>
    <p>Es werden keine Cookies gespeichert!</p>

    <h4>Analysedienste</h4>
    <p>Wir analysieren keine Daten, speichern keine IP-Adressen und benutzen weder Google-Analytics noch sonstige Analysedienste.</p>

    <h4>Mit wem wir deine Daten teilen</h4>
    <p>Niemanden. Niemals!</p>

    <h4>Von welchen Drittanbietern wir Daten erhalten</h4>
    <p>Wir erhalten keine Daten von Drittanbieter und geben auch keine weiter.</p>

    <h4>Welche Rechte du an deinen Daten hast</h4>
    <p>
      Wenn du ein Konto auf dieser Website besitzt, kannst du einen Export deiner personenbezogenen Daten bei uns anfordern, inklusive aller
      Daten, die du uns mitgeteilt hast. Darüber hinaus kannst du die Löschung aller personenbezogenen Daten, die wir von dir gespeichert
      haben, anfordern. Dies umfasst nicht die Daten, die wir aufgrund administrativer, rechtlicher oder sicherheitsrelevanter
      Notwendigkeiten aufbewahren müssen.
    </p>

    <h4>Wie lange wir deine Daten speichern</h4>
    <p>
      Deine Daten werden auf unbegrenzter Zeit auf unseren Servern gespeichert. Du kannst die Löschung deines Accounts jederzeit anfordern.
    </p>

    <h4>Wohin wir deine Daten senden</h4>
    <p>
      Deine Daten werden sicher auf einem Linux-Server gespeichert und die Kommunikation zwischen Browsern ist mit den aktuellsten
      Technologien gesichert. Deine Daten werden an keine Dritte weitergeleitet
    </p>

    <h4>Fragen?</h4>
    <p>Solltest du noch irgendwelche Fragen haben, melde dich einfach bei der Kontakt-Email Adresse.</p>
  `,
  selector: 'app-privacy-policy',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoPipe],
  standalone: true,
})
export class PrivacyPolicyComponent {}
