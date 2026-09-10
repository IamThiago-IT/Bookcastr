# 05 — Arquitetura

## 1. Visão Geral

Bookcastr é **Expo managed** (SDK 53, New Architecture) com `react-native` 0.79.6, navegação por abas, estado com Zustand e áudio nativo via `expo-audio` (Media3/ExoPlayer no Android, AVFoundation no iOS). Inspirado no Podcastr NLW, mas **mobile-first**: player não é sidebar, é `MiniPlayer` docked + `BottomSheet` expansível.

## 2. Stack e Versões (Fase 0)

| Camada | Lib | Versão | Decisão |
|--------|-----|--------|---------|
| App | `expo` | `~53.0.27` | Managed + EAS |
| RN | `react-native` | `0.79.6` | SDK 53 |
| Linguagem | `typescript` | `5.8.3` | `strict: true` |
| Áudio | `expo-audio` | `^0.4.9` | Substitui `expo-av`, hooks, background nativo |
| Estado | `zustand` | `^4.5.2` | Leve vs Redux |
| Nav | `@react-navigation` | `6.x` | BottomTabs + NativeStack |
| Gestos | `gesture-handler` | `~2.24.0` | — |
| Animação | `reanimated` | `~3.17.0` | UI thread |
| Sheet | `@gorhom/bottom-sheet` | `^5.2.14` | Modal 55%→92% |
| SafeArea | `safe-area-context` | `5.4.0` | Insets |

> Ver `package.json:11` e `app.json:15` (plugin `expo-audio`).

## 3. Decisões de Arquitetura (ADRs)

### ADR-01 — expo-audio ao invés de expo-av / track-player
- **Contexto:** `expo-av` descontinuado SDK 53, `react-native-track-player` é mais completo para queue persistente.
- **Decisão:** `expo-audio` (hook-based, auto-release, Media3). Suficiente para MVP; fila gerenciada em Zustand.
- **Consequência:** Precisa gerenciar `seekTo(seconds)` e `didJustFinish` manualmente; ganha simplicidade e compatibilidade EAS.

### ADR-02 — Zustand ao invés de Context API
- **Contexto:** Podcastr Web usa Context. Em RN, Context causa re-render amplo.
- **Decisão:** Zustand com selectors (`usePlayerStore(s=>s.isPlaying)`) + `subscribe` para persistência.
- **Trade-off:** Perde DevTools do Redux, ganha bundle menor.

### ADR-03 — BottomSheet + Reanimated ao invés de Modal
- **Decisão:** `@gorhom/bottom-sheet` v5 dá gesto nativo, `animatedIndex` para interpolação de artwork, backdrop e `enableContentPanningGesture`.
- **Alternativa descartada:** `react-native-modal` sem gesto fluido.

### ADR-04 — React Navigation vs Expo Router
- **Decisão:** React Navigation (estável, docs maduras). Expo Router exigiria migração de `App.tsx:1` para `app/` directory e file-based routing — adiado para Fase 2 se necessário.

### ADR-05 — npm vs pnpm
- **História:** Iniciado com `pnpm`, `pnpm install` travava (timeout) com `node-linker=hoisted`. Migrado para `npm` (commit `8dee632`), removido `pnpm-lock.yaml` e `.npmrc`. `expo-doctor` agora 18/18. `overrides` pinam `metro@0.82.5` para evitar `nested 0.86.3`.

## 4. Estrutura de Pastas (atual + alvo Fase 2)

```
Bookcastr/
├─ App.tsx                         # Providers globais (Fase 0)
├─ app.json                        # splash, icon, plugins, permissions
├─ babel.config.js                 # reanimated/plugin por último
├─ src/
│  ├─ types/episode.ts            # Episode / EpisodeRaw
│  ├─ lib/format.ts                # puro, testável
│  ├─ mocks/episodes.ts            # 5 itens SoundHelix
│  ├─ store/
│  │  ├─ playerStore.ts            # fila, isPlaying, shuffle/loop
│  │  └─ favoritesStore.ts         # (Fase 3) Set<id> + persist
│  ├─ hooks/
│  │  ├─ useSetupPlayer.ts         # (Fase 2) cria player único
│  │  └─ useCurrentEpisode.ts      # selector
│  ├─ providers/
│  │  └─ PlayerProvider.tsx        # (Fase 2) sync Zustand <-> expo-audio
│  ├─ navigation/
│  │  ├─ RootNavigator.tsx         # Stack(Tabs, EpisodeDetail)
│  │  └─ TabNavigator.tsx          # BottomTabs 3 abas
│  ├─ screens/
│  │  ├─ HomeScreen.tsx
│  │  ├─ SearchScreen.tsx
│  │  ├─ LibraryScreen.tsx
│  │  └─ EpisodeDetailScreen.tsx
│  ├─ components/
│  │  ├─ MiniPlayer.tsx            # docked 64dp
│  │  ├─ FullPlayerSheet.tsx       # BottomSheet 55%→92%
│  │  ├─ EpisodeCard.tsx           # carrossel
│  │  └─ EpisodeRow.tsx            # lista
│  ├─ storage/
│  │  └─ playerStorage.ts          # AsyncStorage helpers (throttle)
│  └─ utils/                       # share, link, etc.
├─ assets/                         # icon, splash
└─ docs/                           # esta documentação
```

## 5. Fluxo de Dados (Player)

```
[Home] --tap play(index)--> [playerStore.playList(list, index)]
                                |
                                v
                         [PlayerProvider] --watch currentEpisode--> [useAudioPlayer({uri})]
                                |                                          |
                                |<--useAudioPlayerStatus(currentTime, duration, didJustFinish)-->|
                                v                                          v
                         [MiniPlayer/FullPlayerSheet] <--isPlaying, progress-- [AudioPlayer]
                                |
                                +--throttle 1s--> [AsyncStorage bookcastr:player]
```

- **Unidirecional:** UI → Store → Provider → Audio → Status → UI.
- **Sem prop drilling:** qualquer componente usa `usePlayerStore(s=>...)`.
- **Persistência:** `subscribe` no store dispara `savePlayerState`.

## 6. Configuração Nativa Crítica

`app.json:15`:

```json
{
  "ios": { "infoPlist": { "UIBackgroundModes": ["audio"] } },
  "android": { "permissions": ["FOREGROUND_SERVICE", "FOREGROUND_SERVICE_MEDIA_PLAYBACK"] },
  "plugins": [["expo-audio", { "enableBackgroundPlayback": true }]]
}
```

Em runtime (`App.tsx:10` / futuro `PlayerProvider`):

```ts
await setAudioModeAsync({
  playsInSilentMode: true,
  shouldPlayInBackground: true,
  interruptionMode: 'duckOthers'
});
player.setActiveForLockScreen(true);
```

> Só funciona em **dev build** (`eas build --profile development`), não no Expo Go — documentado em `03-casos-de-uso` UC-09.

## 7. Performance

- `FlatList` com `getItemLayout`, `windowSize=5`, `removeClippedSubviews` na Home.
- `Reanimated` roda na UI thread: `useAnimatedStyle` + `interpolate` para artwork, sem `setState` a cada frame.
- `useAudioPlayerStatus` já throttled internamente; evitar `setState` extra no `onStatus`.
- `zustand` selectors evitam re-render de toda a árvore.

## 8. Segurança & Permissões

Mínimo: apenas áudio em background. Sem `RECORD_AUDIO` (só se gravasse). `WAKE_LOCK` é adicionado pelo plugin para manter CPU durante playback.

## 9. CI / Qualidade

- `npx tsc --noEmit` (strict)
- `npx expo-doctor` (18/18)
- `npx expo config --type public` para validar `app.json`
- Futuro: `eas build` + `expo export` no GitHub Actions.

## 10. Roadmap Técnico (issues)

- **Fase 1:** #1, #2 — navegação + home
- **Fase 2:** #3, #4, #5 — player real + mini/full
- **Fase 3:** #6, #7 — detalhe/busca/favoritos + persistência
- **Fase 4:** #8 — background/lockscreen + EAS

---

*Próximo: [06 — Modelo de Dados](./06-modelo-de-dados.md)*
