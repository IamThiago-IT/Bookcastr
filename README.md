# Bookcastr

> App mobile de podcasts inspirado no **Podcastr NLW** da Rocketseat, repensado para **mobile-first** com UX nativa estilo Spotify / Apple Music.

[![Expo](https://img.shields.io/badge/Expo-SDK%2053-000020?style=flat&logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.79-61DAFB?style=flat&logo=react)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Release](https://img.shields.io/github/v/release/IamThiago-IT/Bookcastr?label=release)](https://github.com/IamThiago-IT/Bookcastr/releases)

O **Bookcastr** é a evolução mobile do Podcastr. Mantém a ideia central — listar episódios, tocar em background, controlar fila — mas com navegação por abas, *mini-player* fixo e *bottom sheet* expansível com gestos, animações com Reanimated e áudio nativo com `expo-audio`.

> 📚 **Documentação completa:** veja [`docs/README.md`](./docs/README.md) — requisitos, regras de negócio, casos de uso, UML, arquitetura e modelo de dados.

---

## ✨ Funcionalidades

### Fase 0 — atual (`v0.1.0`)
- [x] Setup Expo SDK 53 + New Architecture
- [x] `expo-audio` 0.4.9 com background playback (substitui `expo-av` descontinuado)
- [x] `GestureHandlerRootView` + `BottomSheetModalProvider` + `SafeAreaProvider`
- [x] Store `Zustand` para player (`play`, `playList`, `next/prev`, `shuffle`, `loop`)
- [x] Mocks de 5 episódios (`src/mocks/episodes.ts:4`) + tipos e helpers de formatação
- [x] Teste de áudio em `App.tsx:10` com `useAudioPlayer` / `useAudioPlayerStatus`

### Roadmap
- [ ] **Fase 1 — Navegação:** Bottom Tabs (`Início | Buscar | Biblioteca`) com React Navigation + Home (Últimos em carrossel + Todos em FlatList)
- [ ] **Fase 2 — Player:** `MiniPlayer` docked + `FullPlayerSheet` (`@gorhom/bottom-sheet` v5, `snapPoints` 60%/95%, slider, controles shuffle/repeat, velocidade)
- [ ] **Fase 3 — Domínio:** Página de episódio, busca, favoritos, histórico e progresso persistido (`AsyncStorage`)
- [ ] **Fase 4 — Polimento:** Haptics, animações de artwork (40→240), lockscreen metadata, EAS Build + publicação

---

## 📚 Documentação

| Doc | Descrição |
|-----|-----------|
| [Requisitos](./docs/01-requisitos.md) | RF/RNF, MoSCoW, rastreabilidade com milestones |
| [Regras de Negócio](./docs/02-regras-de-negocio.md) | RN-01…18 — fila, shuffle, loop, seek, background |
| [Casos de Uso](./docs/03-casos-de-uso.md) | 9 UCs, atores, fluxos e matriz RF↔UC |
| [UML](./docs/04-uml.md) | Classes, sequência, estados e navegação (Mermaid) |
| [Arquitetura](./docs/05-arquitetura.md) | ADRs, stack, pastas, fluxo Zustand→expo-audio |
| [Modelo de Dados](./docs/06-modelo-de-dados.md) | Episode, mocks, AsyncStorage |
| [Glossário](./docs/07-glossario.md) | Termos do domínio |

---

## 🧱 Stack

| Camada | Tech | Versão | Por que |
|---|---|---|---|
| App | Expo | `~53.0.27` | Managed workflow, EAS, CNG |
| UI | React / RN | `19.0.0` / `0.79.6` | Base |
| Linguagem | TypeScript | `5.8.3` | `strict: true` |
| Áudio | `expo-audio` | `^0.4.9` | Estável SDK 53, Media3/ExoPlayer + AVFoundation, background nativo |
| Estado | `zustand` | `^4.5.2` | Leve, sem boilerplate |
| Navegação | React Navigation | `6.x` | `native`, `bottom-tabs`, `native-stack` |
| Gestos/Animação | `gesture-handler` `~2.24` + `reanimated` `~3.17` + `@gorhom/bottom-sheet` `^5.2` | Nativo 60fps, sheet estilo Apple Music |
| SafeArea/Screens | `safe-area-context` `5.4.0` + `screens` `~4.11.1` | Insets e performance nativa |

> `expo-av` foi descontinuado no SDK 53. `expo-audio` usa hooks (`useAudioPlayer`, `useAudioPlayerStatus`) e libera recursos automaticamente no `unmount`. `seekTo` agora é em **segundos** (antes ms).

---

## 📁 Estrutura

```
Bookcastr/
├─ App.tsx                         # Providers + AudioTest (Fase 0)
├─ app.json                        # Config Expo + plugin expo-audio + permissões
├─ babel.config.js                 # preset expo + reanimated/plugin (último)
├─ src/
│  ├─ types/episode.ts            # Episode / EpisodeRaw
│  ├─ lib/format.ts                # convertDurationToTimeString, formatPublishedAt
│  ├─ mocks/episodes.ts            # 5 episódios mock (SoundHelix)
│  ├─ store/playerStore.ts         # Zustand — fila e controles
│  └─ components/
│     ├─ MiniPlayer.tsx            # Dock 64dp (placeholder Fase 0)
│     └─ FullPlayerSheet.tsx       # BottomSheet (placeholder)
├─ assets/                         # icon, splash, adaptive-icon
└─ ...
```

---

## 🚀 Começando

### Pré-requisitos
- Node 20+ (recomendado 20.11 LTS) ou 24
- `pnpm` 10+ **ou** `npm` 10+
- App **Expo Go** no celular (para Fase 0) ou `EAS` para testar background real
- Android Studio / Xcode apenas se for gerar build nativo

### Instalação

```bash
# clone
git clone https://github.com/IamThiago-IT/Bookcastr.git
cd Bookcastr

# com pnpm (original do projeto)
pnpm install

# ou com npm (se pnpm travar — Fase 0 foi instalada com npm)
npm install
```

> Padronizado em `npm` com `package-lock.json` único (`overrides` para `metro@0.82.5` e `react-native@0.79.6`).

### Rodando

```bash
# Expo Dev Server (QR Code)
npm start
# ou
pnpm start

# Atalhos
npm run android   # expo start --android
npm run ios       # expo start --ios
npm run web       # expo start --web
```

Abra o **Expo Go** e escaneie o QR. Na tela Fase 0 você verá `Tocar Teste` — deve tocar o MP3 remoto e exibir `currentTime/duration`.

**Background real:** só funciona em **dev build** (`npx expo prebuild` + `eas build`), não no Expo Go. O plugin em `app.json:33` já configura:
```json
["expo-audio", { "enableBackgroundPlayback": true }]
```
e injeta `UIBackgroundModes: ["audio"]` (iOS) e `FOREGROUND_SERVICE_MEDIA_PLAYBACK` (Android).

---

## 🔊 Como o áudio funciona (Fase 0)

`App.tsx:10` — exemplo mínimo:

```ts
import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync } from 'expo-audio';

const player = useAudioPlayer({ uri: 'https://.../SoundHelix-Song-1.mp3' });
const status = useAudioPlayerStatus(player);

useEffect(() => {
  setAudioModeAsync({
    playsInSilentMode: true,
    shouldPlayInBackground: true,
    interruptionMode: 'duckOthers',
  });
}, []);

player.play();
player.pause();
player.seekTo(0); // segundos!
```

Store `src/store/playerStore.ts:1` controla fila; na Fase 2 o `player` será criado uma única vez e sincronizado com `isPlaying` do Zustand via `useAudioPlayerStatus`.

---

## 🧪 Validação

```bash
npx tsc --noEmit                 # typecheck
npx expo config --type public    # config resolvida
npx expo-doctor                  # 18/18 ✅ (após chore 8dee632 com overrides metro)
```

---

## 🗺️ Releases

- **v0.1.0 — Fase 0: Setup Mobile** — https://github.com/IamThiago-IT/Bookcastr/releases/tag/v0.1.0
  - Expo + expo-audio + reanimated + bottom-sheet + zustand + navegação

Veja todos os releases em [Releases](https://github.com/IamThiago-IT/Bookcastr/releases).

---

## 🤝 Contribuindo

1. Crie branch `feat/nome`
2. `npx tsc --noEmit` deve passar
3. Abra PR para `main`

---

## 📄 Licença

MIT — sinta-se livre para usar como base para seu próprio Podcastr.

---

<p align="center">Feito com 💜 inspirado no NLW da Rocketseat — agora mobile-first.</p>
