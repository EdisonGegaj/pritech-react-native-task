# React Native Task Manager

Nje aplikacion praktik dhe i thjeshte per menaxhimin e detyrave ditore, i ndertuar me React Native dhe Expo Router. Ky projekt eshte zhvilluar si detyre teknike per pozicionin Junior Developer ne PRITECH.

## Funksionalitetet

- Lista e Detyrave: Shfaqja e detyrave fillestare te marra ne menyre dinamike nga nje API publike (JSONPlaceholder).
- Shtimi i Detyrave: Forme e thjeshte me validim per te shtuar detyra te reja (Titulli dhe Pershkrimi).
- Ndryshimi i Statusit: Mundesia per te shenuar nje detyre si te kryer (me vije permbi tekst) ose te pakryer.
- Fshirja e Detyrave: Heqja e plote e detyres nga lista me nje klikim te thjeshte.
- Ekrani i Detajeve: Navigim i plote me Expo Router per te pare detajet e cdo detyre ne nje ekran te vecante.
- Kerkimi: Kerkim dinamik dhe ne kohe reale i detyrave sipas titullit.
- Filtrimi: Filtrim i shpejte i listes ne tri kategori: All, Active, dhe Completed.
- Ruajtja Lokale: Integrimi i AsyncStorage per te ruajtur te dhenat direkt ne memorien e telefonit. Detyrat nuk fshihen edhe nese aplikacioni mbyllet ose ristartohet.

## Teknologjite e Perdorura

- React Native (TypeScript)
- Expo dhe Expo Router
- React Context API (Per menaxhimin e gjendjes globale)
- AsyncStorage (Per ruajtjen lokale)

## Konfigurimi dhe Ekzekutimi Lokal

Per ta ekzekutuar kete projekt ne makinen tuaj lokale, ndiqni keta hapa te thjeshte:

1. Klononi repozitorin:
git clone <https://github.com/EdisonGegaj/pritech-react-native-task.git>
cd pritech-react-native-task

2. Instaloni varesite (Dependencies):
npm install

3. Nisni serverin e Expo-s:
npx expo start

4. Ekzekutimi ne pajisje:
Skanoni kodin QR duke perdorur aplikacionin Expo Go ne telefonin tuaj (iOS ose Android). Ose mund te shtypni 'a' per emulator te Android / 'i' per simulator te iOS.