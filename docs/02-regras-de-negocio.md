# 02 — Regras de Negócio

> Regras que o código **deve** cumprir. Se mudar, atualize aqui e no `src/store/playerStore.ts:1` / `src/lib/format.ts:1`.

## Sumário

| ID | Regra | RFs | Onde codificar |
|----|-------|-----|----------------|
| RN-01 | Fila é a fonte da verdade | RF-02, RF-03 | `playerStore.episodeList` |
| RN-02 | Um episódio por vez | RF-02 | `PlayerProvider` (um `useAudioPlayer`) |
| RN-03 | Play de lista | RF-03 | `playList(lista, index)` |
| RN-04 | Avanço sequencial | RF-04 | `playNext()` |
| RN-05 | Shuffle | RF-05 | `isShuffling` + random |
| RN-06 | Loop | RF-06 | `isLooping` + `didJustFinish` |
| RN-07 | Seek | RF-04 | `player.seekTo(seconds)` |
| RN-08 | Duração | RF-01 | `convertDurationToTimeString` |
| RN-09 | Data | RF-01, RF-09 | `Intl pt-BR` |
| RN-10 | Mini-player visível | RF-07 | `currentEpisode != null` |
| RN-11 | Full-player | RF-08 | `BottomSheetModal` 55%→92% |
| RN-12 | Persistência | RF-13 | `AsyncStorage` throttle 1s |
| RN-13 | Retomar | RF-13 | oferta se 10s < `currentTime` < `duration-10s` |
| RN-14 | Favoritos | RF-11 | `favoritesStore` |
| RN-15 | Busca | RF-10 | debounce 300ms, case-insensitive |
| RN-16 | Background | RF-14 | `app.json:33` + `setAudioModeAsync` |
| RN-17 | Interrupção | RF-14 | `duckOthers` |
| RN-18 | Erro de mídia | Geral | fallback + toast |

---

### RN-01 — Fila é a fonte da verdade
`episodeList: Episode[]` + `currentIndex: number` são os únicos estados de fila. `currentEpisode = episodeList[currentIndex] ?? null`. Nunca guardar `currentEpisode` separado. `hasNext = isShuffling || currentIndex+1 < length`, `hasPrevious = currentIndex > 0`.

### RN-02 — Um episódio por vez
Só existe **uma instância** de `AudioPlayer` (expo-audio). Trocar episódio recria o player com nova `source: {uri}`. Não há dois áudios simultâneos. Ao desmontar, `release()` é automático.

### RN-03 — Play de lista vs. Play isolado
- `play(episode)` → fila com 1 item, `index 0`, começa tocando.
- `playList(lista, index)` → substitui fila inteira e toca `lista[index]`. Usado na Home para manter contexto de “próximos” originais. Se o usuário veio da busca, `lista` é o resultado filtrado.

### RN-04 — Avanço sequencial
`playNext()`:
- Se `isShuffling`: `next = random(0, length-1)` (pode repetir o mesmo; evita loop infinito de `while(next===current)` para filas 1-item).
- Senão se `currentIndex+1 < length`: `currentIndex+1`.
- Senão se `isLooping`: `0`.
- Senão: não avança (desabilita botão). `didJustFinish` sem `hasNext` e sem loop → `pause()` e mantém no fim.

`playPrevious()` só volta se `currentIndex > 0`; não reinicia faixa se já tocando (diferente de Spotify).

### RN-05 — Shuffle
Toggle `isShuffling`. Quando ativo, `hasNext = true` mesmo no último (sempre há próximo aleatório). UI: ícone fica `cor #7C3AED`. Shuffle não reordena `episodeList`, apenas sorteia no `playNext`.

### RN-06 — Loop
Toggle `isLooping`. Quando ativo e `currentIndex` é o último, `playNext()` volta ao `0`. Também afeta `didJustFinish`: se `loop` ativo e `didJustFinish` sem próximo sequencial, reinicia `seekTo(0)` + `play()`.

### RN-07 — Seek
`seekTo(seconds: number)` — **segundos**, não ms (diferença de `expo-av`). Slider `onSlidingComplete` chama `seekTo`. Durante `onSliding` não atualiza `currentTime` do player para evitar jitter. Validar `0 ≤ seconds ≤ duration`.

### RN-08 — Duração
`convertDurationToTimeString(durationSec)` → `HH:MM:SS` ou `MM:SS` se `hours===0`, sempre 2 dígitos. Ex: `2843 → 47:23`, `3661 → 01:01:01`. Fonte: `src/lib/format.ts:1`.

### RN-09 — Data
`publishedAt` é ISO. Exibição `pt-BR` `dd MMM yyyy` via `Intl.DateTimeFormat`. Ex: `2024-03-15T08:00:00Z → 15 mar 2024`.

### RN-10 — Mini-player visível
Visível **apenas** se `episodeList.length > 0`. Posição `absolute bottom = tabBarHeight + 12`. Barra fina de progresso (`currentTime/duration * 100%`) no topo. Tap no card expande, tap no play não expande (stopPropagation).

### RN-11 — Full-player (BottomSheet)
`BottomSheetModal` com `snapPoints ['55%', '92%']`, `enablePanDownToClose`, backdrop 0.5. `animatedIndex` via Reanimated interpola `artwork 48→240`, `borderRadius`, `opacity`. `enableContentPanningGesture` só quando expandido.

### RN-12 — Persistência
Salvar a cada 1s (throttle) se `isPlaying`: `{episodeList, currentIndex, currentTime, isLooping, isShuffling}` em `AsyncStorage` chave `bookcastr:player`. `favorites` em `bookcastr:favorites`. Não salvar a cada frame para não bloquear UI.

### RN-13 — Retomar
Ao `loadPlayerState()`, se `currentTime > 10` e `< duration - 10`, mostrar Snackbar “Continuar de 12:34?” com ações `Continuar` (seek) e `Recomeçar` (seek 0). Se fora desse intervalo, ignora.

### RN-14 — Favoritos
Toggle idempotente. `favorites: Set<string> (episode.id)`. Persistido. Biblioteca filtra `episodesMock` por `favorites.has(id)`. Empty state: ilustração + botão “Explorar”.

### RN-15 — Busca
Filtro `title` OR `members` case-insensitive, `includes`. Debounce 300ms. Histórico: últimos 5 termos em `AsyncStorage`. Sem acento? `normalize('NFD')` opcional.

### RN-16 — Background
`app.json:33` `expo-audio` plugin `enableBackgroundPlayback:true` gera `FOREGROUND_SERVICE` + `UIBackgroundModes audio`. Em runtime `setAudioModeAsync({playsInSilentMode:true, shouldPlayInBackground:true})` + `player.setActiveForLockScreen(true)` com metadata `title`, `artist=members`, `artwork`.

### RN-17 — Interrupção
`interruptionMode: 'duckOthers'` — baixa volume de outros apps em vez de pausar. Ao receber ligação, `expo-audio` pausa e retoma se `shouldPlayInBackground`. Não implementado: `mixWithOthers`.

### RN-18 — Erro de mídia
Se `status.error` ou `!isLoaded` após 5s: mostrar toast “Falha ao carregar áudio” + botão `Tentar novamente` (`player.seekTo(0) + play`). Se URL 404, remove da fila e tenta próximo. Nunca crashar app.

---

## Matriz de estados do player

| isPlaying | isShuffling | isLooping | Ação no fim | Próximo habilitado? |
|-----------|-------------|-----------|-------------|---------------------|
| true | false | false | pausa no fim | `index < len-1` |
| true | true | * | sorteia próximo | sempre true se len>0 |
| true | false | true | volta ao 0 | true |
| false | * | * | — | conforme acima |

---

*Próximo: [03 — Casos de Uso](./03-casos-de-uso.md)*
