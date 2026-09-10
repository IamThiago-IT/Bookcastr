# 04 — UML

> Diagramas em Mermaid (renderizam no GitHub). Fonte da verdade para código: `src/types/episode.ts:1`, `src/store/playerStore.ts:1`, `App.tsx:10`.

## 1. Diagrama de Classes (Domínio + Player)

```mermaid
classDiagram
    class Episode {
        +string id
        +string title
        +string thumbnail
        +string members
        +string publishedAt
        +number duration
        +string durationAsString
        +string url
        +string description
    }

    class EpisodeRaw {
        +string id
        +string title
        +string thumbnail
        +string members
        +string published_at
        +File file
        +string description
    }

    class File {
        +string url
        +number duration
    }

    class PlayerStore {
        +Episode[] episodeList
        +number currentIndex
        +boolean isPlaying
        +boolean isLooping
        +boolean isShuffling
        +play(episode)
        +playList(list, index)
        +togglePlay()
        +playNext()
        +playPrevious()
        +toggleLoop()
        +toggleShuffle()
        +clearPlayer()
        +hasNext boolean
        +hasPrevious boolean
    }

    class AudioPlayer {
        +play()
        +pause()
        +seekTo(seconds)
        +setActiveForLockScreen(bool)
    }

    class AudioStatus {
        +boolean isLoaded
        +boolean playing
        +number currentTime
        +number duration
        +boolean isBuffering
        +boolean didJustFinish
    }

    class FavoritesStore {
        +Set~string~ ids
        +toggle(id)
        +isFavorite(id)
        +load()
        +persist()
    }

    EpisodeRaw --> File
    EpisodeRaw ..> Episode : map via format.ts
    PlayerStore --> Episode : contém
    AudioPlayer --> AudioStatus : useAudioPlayerStatus
    PlayerStore ..> AudioPlayer : sincronizado via PlayerProvider
    FavoritesStore --> Episode : referencia por id
```

## 2. Sequência — Tocar episódio da Home

```mermaid
sequenceDiagram
    actor Ouvinte
    participant Home as HomeScreen
    participant Store as playerStore
    participant Provider as PlayerProvider
    participant Audio as expo-audio
    participant UI as MiniPlayer

    Ouvinte->>Home: tap play no item (index 2)
    Home->>Store: playList(episodesMock, 2)
    Store-->>Provider: episodeList/currentIndex/isPlaying atualizados
    Provider->>Audio: createAudioPlayer({uri: episode.url})
    Provider->>Audio: setActiveForLockScreen(true, {title, artist, artwork})
    Provider->>Audio: play()
    Audio-->>Provider: onStatus (playing, currentTime, duration)
    Provider-->>UI: render com isPlaying + progress
    UI->>Ouvinte: mostra MiniPlayer + barra
    Note right of Audio: didJustFinish -> Provider.playNext()
```

## 3. Sequência — Seek + Shuffle

```mermaid
sequenceDiagram
    actor Ouvinte
    participant Sheet as FullPlayerSheet
    participant Store as playerStore
    participant Audio as AudioPlayer

    Ouvinte->>Sheet: arrasta slider para 42s
    Sheet->>Sheet: onSliding (não chama seek ainda)
    Ouvinte->>Sheet: solta (onSlidingComplete 42)
    Sheet->>Audio: seekTo(42)
    Audio-->>Sheet: currentTime = 42

    Ouvinte->>Sheet: toggle shuffle
    Sheet->>Store: toggleShuffle()
    Store-->>Sheet: isShuffling = true (ícone #7C3AED)
    Ouvinte->>Sheet: tap next
    Sheet->>Store: playNext()
    Store->>Store: random(0, len-1)
    Store->>Audio: recria player com novo episode.url
    Audio->>Audio: play()
```

## 4. Diagrama de Estados — Player

```mermaid
stateDiagram-v2
    [*] --> Idle : app inicia, fila vazia
    Idle --> Loading : play() / playList()
    Loading --> Playing : isLoaded && play()
    Loading --> Error : timeout / 404
    Error --> Idle : clear / retry
    Playing --> Paused : pause() / togglePlay()
    Paused --> Playing : play() / togglePlay()
    Playing --> Ended : didJustFinish
    Paused --> Ended : didJustFinish
    Ended --> Playing : hasNext ? playNext() : (isLooping ? seek0+play : Idle)
    Ended --> Idle : no hasNext && !loop
    Playing --> Seeking : seekTo()
    Seeking --> Playing : seek complete
    Paused --> Seeking : seekTo()
    Seeking --> Paused : seek complete
```

Estados mapeados para `src/store/playerStore.ts:1` (`isPlaying`) + `AudioStatus` (`isLoaded`, `didJustFinish`, `isBuffering`).

## 5. Arquitetura — Navegação + Providers

```mermaid
graph TD
    A[GestureHandlerRootView] --> B[SafeAreaProvider]
    B --> C[BottomSheetModalProvider]
    C --> D[NavigationContainer]
    D --> E[RootStack]
    E --> F[TabNavigator]
    F --> G[HomeStack]
    F --> H[SearchStack]
    F --> I[LibraryStack]
    E --> J[EpisodeDetail]
    C --> K[MiniPlayer - absolute]
    C --> L[FullPlayerSheet - BottomSheetModal]
    D --> M[PlayerProvider]
    M --> N[useAudioPlayer]
    M --> O[useAudioPlayerStatus]

    style M fill:#7C3AED,stroke:#fff,color:#fff
```

Hierarquia de `App.tsx:1`:

```
App.tsx
├─ GestureHandlerRootView
│  └─ SafeAreaProvider
│     └─ BottomSheetModalProvider
│        ├─ NavigationContainer (RootStack → Tabs)
│        ├─ PlayerProvider (lógica global)
│        ├─ MiniPlayer (global overlay)
│        └─ FullPlayerSheet (global modal)
```

## 6. Arquitetura — Camadas

```mermaid
graph LR
    subgraph UI
        Screens[Home/Search/Library/Detail]
        Components[MiniPlayer/FullPlayer/EpisodeCard]
    end
    subgraph State
        Zustand[Zustand stores]
    end
    subgraph Core
        PlayerProvider
        Hooks[useSetupPlayer]
        Storage[AsyncStorage]
    end
    subgraph Native
        ExpoAudio[expo-audio]
        OS[iOS AVFoundation / Android Media3]
    end

    Screens --> Zustand
    Components --> Zustand
    Zustand <--> PlayerProvider
    PlayerProvider <--> ExpoAudio
    ExpoAudio <--> OS
    Zustand <--> Storage
```

## 7. Diagrama de Pacotes (estrutura de pastas)

```
src/
├─ types/        -> Episode, EpisodeRaw
├─ lib/          -> format.ts (pure)
├─ mocks/        -> episodes.ts (dados fake)
├─ store/        -> playerStore.ts, favoritesStore.ts
├─ hooks/        -> useSetupPlayer, useCurrentEpisode
├─ navigation/   -> RootNavigator, TabNavigator
├─ screens/      -> Home, Search, Library, EpisodeDetail
├─ components/   -> MiniPlayer, FullPlayerSheet, EpisodeCard/Row
└─ providers/    -> PlayerProvider
```

---

*Próximo: [05 — Arquitetura](./05-arquitetura.md)*
