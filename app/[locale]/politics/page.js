import React from "react";

import "./politics.css";

export default function Politics() {
  return (
    <div className="page-wrapper">
      <div className="container">
        {/* <h1 className="title">MAITSEV GRUUSIA</h1>*/}
        <h2 className="subtitle">Kasutuspoliitika ja müügitingimused</h2>
        <h2 className="section-title">1. Üldsätted</h2>
        <p className="paragraph">
          1.1 Käesolevad kasutustingimused reguleerivad veebipoe (edaspidi
          veebipood) Maitsev Gruusia tegevust, mida haldab BAHUS OÜ (reg. kood
          14316592), asukohaga Pärnu mnt 36 / Roosikrantsi 23, Tallinn.
        </p>
        <p className="paragraph">
          1.2 Veebipoest kauba tellimisega nõustute käesolevate tingimustega.
          Kui te ei nõustu käesolevate tingimustega, siis palun hoiduge veebipoe
          teenuste kasutamisest.
        </p>
        <p className="paragraph">
          1.3 Veebipood müüb: Toidukaupu (Gruusia köök, Khachapuri, Khinkali,
          jne); alkohoolsed joogid (Vein, Kanged alkohoolsed joogid jne).
        </p>
        <p className="paragraph">
          1.4 Iga kaubakategooria kohta kehtivad eraldi tingimused, mida on
          kirjeldatud vastavates jaotistes.
        </p>

        <h2 className="section-title">2. Toiduainete müügitingimused</h2>
        <p className="paragraph">
          2.1 Toiduaineid saavad tellida kõik kasutajad ilma vanusepiiranguteta.
        </p>
        <p className="paragraph">2.2 Tellimise kord:</p>
        <ol className="list">
          <li className="list-item">Lisage tooted ostukorvi</li>
          <li className="list-item">Määrake tarneandmed ja valige makseviis</li>
          <li className="list-item">Makske tellimuse eest</li>
        </ol>
        <p className="paragraph">2.3. Toiduainete kohaletoimetamine:</p>
        <ol className="list">
          <li className="list-item">
            Toidutarne toimub Tallinna piires igapäevaselt kell 10:00-22:00
          </li>
          <li className="list-item">
            Kohaletoimetamise hind sõltub kliendi aadressist ja on märgitud
            tellimuse vormistamisel
          </li>
        </ol>
        <p className="paragraph">2.4. Tagastamisõigus:</p>
        <ol className="list">
          <li className="list-item">
            Toidukaupu saab tagastada ainult siis, kui on tuvastatud puudusi (nt
            pakendi kahjustus, kvaliteedierinevus).
          </li>
          <li className="list-item">
            Tagastamiseks peab klient viivitamatult võtma ühendust aadressil{" "}
            <a href="mailto:info@maitsevgruusia.ee">info@maitsevgruusia.ee</a>
          </li>
        </ol>

        <h2 className="section-title">
          3. Alkohoolsete jookide müügitingimused
        </h2>
        <p className="paragraph">3.1 Vanusepiirangud:</p>
        <ol className="list">
          <li className="list-item">
            Alkoholi võivad osta ainult 18-aastased või vanemad kasutajad
          </li>
          <li className="list-item">
            Tellimuse esitamisel tuleb kinnitada vanus
          </li>
          <li className="list-item">
            Vanuse kontrollimine toimub kohaletoimetamisel või iseteenindamisel,
            esitades isikut tõendava dokumendi (pass, ID-kaart, juhiluba)
          </li>
        </ol>
        <p className="paragraph">3.2 Tellimuse esitamine:</p>
        <ol className="list">
          <li className="list-item">
            Alkoholi saab lisada ostukorvi toidukaupadest eraldi
          </li>
          <li className="list-item">
            Tellimus loetakse kinnitatuks pärast edukat maksmist
          </li>
        </ol>
        <p className="paragraph">3.3 Alkoholi kohaletoimetamine:</p>
        <ol className="list">
          <li className="list-item">
            Kohaletoimetamine on võimalik ainult tööajal kell 10:00-22:00
          </li>
          <li className="list-item">
            Alkohoolsed joogid toimetatakse kohale ainult täisealistele
            isikutele, kes on esitanud dokumendi. Tellimuse esitamisel
            kinnitate, et olete üle 18-aastane
          </li>
        </ol>
        <p className="paragraph">3.4 Tagastamisõigus:</p>
        <ol className="list">
          <li className="list-item">
            Tagastamine on võimalik ainult juhul, kui pakend on kahjustatud või
            kui kaup ei vasta tellimusele
          </li>
          <li className="list-item">
            Kahjustatud pakendiga alkoholi ei saa tagastada
          </li>
        </ol>
        <p className="paragraph">3.5 Kahjustused tarne ajal</p>
        <p className="paragraph">
          Kui saadate kahjustatud paki, võtke viivitamatult ühendust kulleriga
          ja esitage pretensioon ning keelduge paki vastuvõtmisest. Seejärel
          võtke meiega ühendust ja me saadame teile kahjustatud kauba tasuta
          asenduse
        </p>

        <h2 className="section-title">4. Maksmine</h2>
        <p className="paragraph">
          4.1 Veebipood aktsepteerib järgmisi makseviise:
        </p>
        <ol className="list">
          <li className="list-item">
            <strong>Sularaha:</strong> See makseviis on saadaval ainult
            iseteeninduse puhul. Te peate kauba eest tasuma sularahas kauba
            kättesaamisel
          </li>
          <li className="list-item">
            <strong>Pangakaardiga:</strong> Maksmine pangakaardiga Montonio
            maksesüsteemi kaudu. See makseviis on saadaval nii kohaletoimetamise
            kui ka kättesaamise puhul. Tellimuse vormistamisel saate maksta
            kaardiga.
          </li>
        </ol>
        <p className="paragraph">
          4.2 Kõik hinnad on eurodes (€) ja sisaldavad käibemaksu.
        </p>
        <p className="paragraph">
          4.3 Pärast edukat maksmist näeb klient veebilehel teate eduka makse
          kohta ning üksikasjad tellimuse kohta. Juht võtab kliendiga ühendust
          märgitud viisil (telefon, e-post).
        </p>
        <h2 className="section-title">5. Kohaletoimetamine ja iseteenindus</h2>
        <p className="paragraph">5.1 Kohaletoimetamine:</p>
        <ol className="list">
          <li className="list-item">
            Kaubad tarnitakse Eesti piires 3-7 tööpäeva jooksul.
          </li>
          <li className="list-item">Kohaletoimetamise tasu on 5(€) eurot.</li>
        </ol>
        <p className="paragraph">5.2 Isetoomine:</p>
        <ol className="list">
          <li className="list-item">
            Isetoomine on võimalik iga päev kell 10:00-22:00 aadressil Pärnu mnt
            36 / Roosikrantsi 23, Tallinn.
          </li>
          <li className="list-item">
            Tellimuse kättesaamiseks on vaja esitada kinnitus (elektrooniline
            kviitung või tellimuse number).
          </li>
        </ol>

        <h2 className="section-title">6. Tagastamis- ja tühistamispoliitika</h2>
        <p className="paragraph">6.1 Tagastamisõigus:</p>
        <p className="paragraph">
          Kliendil on õigus tagastada kaup 14 päeva jooksul alates tellimuse
          kättesaamisest, kui see on kasutamata või kahjustamata.
        </p>
        <p className="paragraph">6.2 Tagastamise välistused:</p>
        <ol className="list">
          <li className="list-item">Alkohol, kui pakend on katki.</li>
          <li className="list-item">Toit, kui see on avatud või kasutatud.</li>
        </ol>
        <p className="paragraph">6.3 Tagastamise kord:</p>
        <ol className="list">
          <li className="list-item">
            Klient peab täitma tagastusvormi ja saatma selle e-postiga
            aadressil:{" "}
            <a href="mailto:info@maitsevgruusia.ee">info@maitsevgruusia.ee</a>
          </li>
          <li className="list-item">
            Kaup tagastatakse kliendi kulul, välja arvatud juhul, kui
            tagastamise põhjuseks on kaupluse viga.
          </li>
        </ol>
        <p className="paragraph">6.4 Tagasimaksed:</p>
        <p className="paragraph">
          Raha tagastatakse 14 päeva jooksul alates kauba kättesaamisest
          kaupluses.
        </p>

        <h2 className="section-title">7. Isikuandmete töötlemine</h2>
        <p className="paragraph">
          7.1 Kliendi isikuandmeid (nimi, aadress, telefoninumber, e-posti
          aadress) kasutatakse üksnes tellimuse töötlemiseks.
        </p>
        <p className="paragraph">
          7.2 Andmeid edastatakse kolmandatele isikutele ainult kaupade
          tarnimise eesmärgil.
        </p>
        <h2 className="section-title">8. Vaidluste lahendamine</h2>
        <p className="paragraph">
          8.1. Vaidluste korral võib klient saata kaebuse aadressil{" "}
          <a href="mailto:info@maitsevgruusia.ee">info@maitsevgruusia.ee</a>
        </p>
        <p className="paragraph">
          8.2. Kui vaidlust ei lahendata rahumeelselt, on Kliendil õigus
          pöörduda Eesti Tarbijakaitse Komisjoni või Euroopa vaidluste
          lahendamise platvormi poole.
        </p>
        <h2 className="section-title">9. Muud tingimused</h2>
        <p className="paragraph">
          9.1 Veebipood jätab endale õiguse muuta kasutustingimusi ilma ette
          teatamata.
        </p>
        <p className="paragraph">
          9.2 Alkoholi ja toiduainete müüki reguleerivad Eesti seadused.
        </p>
        <h2 className="section-title">10. Toote pilt</h2>
        <p className="paragraph">
          10.1 Veebilehel või muudes materjalides esitatud pildid on
          illustratiivse tähendusega ning nende ainus eesmärk on anda üldine
          visuaalne ettekujutus pakutavast tootest. Tegelik toode võib erineda
          kujutatud pildist, sealhulgas, kuid mitte ainult, pakendi kujunduse,
          värvitooni, suuruse, kuju, spetsifikatsioonide või muude visuaalsete
          ja tehniliste omaduste poolest. 10.2 Sellised erinevused võivad
          tuleneda tootja tehtud muudatustest, tootepartii eripäradest,
          seadusandlikest nõuetest või muudest objektiivsetest asjaoludest.
          Seetõttu ei kujuta esitatud pildid endast siduvat pakkumist ega
          garantiid toote tegelike omaduste või vastavuse kohta.
        </p>
        <h2 className="section-title">11. Copyright</h2>
        <p className="paragraph">
          11.1 Veebisaidi teksti või pilte ei tohi kopeerida ega reprodutseerida
          (sealhulgas printida paberkandjal) ilma Maitsev Gruusia eelneva
          kirjaliku nõusolekuta. Kasutaja võib printida veebilehe osi
          paberkandjal ainult Maitsev Gruusia tellimuse tegemiseks. Maitsev
          Gruusia ei võta vastutust ebatäpsuste või trükivigade eest. <br />
          Sisu on Copyright © alates 2025. Kõik õigused kaitstud.
        </p>
      </div>
    </div>
  );
}
