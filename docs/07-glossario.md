# 07 — Glossário

| Termo | Definição | Onde aparece |
|-------|-----------|--------------|
| **Episódio** | Unidade de conteúdo de podcast com título, capa, membros, data, duração, áudio e descrição. Tipo `Episode` em `src/types/episode.ts:1`. | RF-01, RN-08 |
| **Fila (Queue)** | Lista ordenada `episodeList: Episode[]` + índice `currentIndex`. Fonte da verdade do que toca a seguir. | RN-01, `playerStore` |
| **CurrentEpisode** | `episodeList[currentIndex]` ou `null` se fila vazia. | RN-01 |
| **Shuffle (Aleatório)** | Quando ativo, `playNext()` sorteia próximo índice aleatório em vez de sequencial. | RN-05 |
| **Loop (Repetir)** | Quando ativo, ao terminar o último, volta ao primeiro; também afeta `didJustFinish`. | RN-06 |
| **Seek** | Mover posição de playback para `seconds`. `expo-audio` usa segundos, não ms. | RN-07 |
| **Duração** | Segundos totais do áudio. Formatada para `MM:SS`/`HH:MM:SS` via `src/lib/format.ts:1`. | RN-08 |
| **MiniPlayer** | Barra 64dp fixa acima da TabBar com capa 48, título, membros e play. Sempre visível se há fila. | RF-07, RN-10 |
| **FullPlayerSheet** | BottomSheet expansível 55%→92% com capa grande, slider e controles. | RF-08, RN-11 |
| **BottomSheet** | Componente `@gorhom/bottom-sheet` com `snapPoints`, gesto pan e `animatedIndex`. | `FullPlayerSheet.tsx` |
| **Lockscreen / Notificação** | Controles do SO (MediaSession / MPNowPlaying) com capa, título e play/pause/next. | RF-14, RN-16 |
| **Background** | Continuar tocando com app em segundo plano ou tela bloqueada. Requer plugin `expo-audio` + permissões. | `app.json:15` |
| **Favoritos** | Conjunto `Set<id>` persistido em `AsyncStorage` `bookcastr:favorites`. | RF-11, RN-14 |
| **Persistência** | Salvar fila/progresso em `AsyncStorage` throttle 1s. | RN-12 |
| **Retomar** | Oferta para continuar de onde parou se 10s < `currentTime` < `duration-10`. | RN-13 |
| **Podcastr** | Projeto original NLW da Rocketseat (Next.js, `server.json`, `FalaDev`). Inspiração para Bookcastr mobile. | README |
| **Bookcastr** | Nome mantido do projeto (este repo). Evolução mobile do Podcastr. | `app.json:03` |
| **Expo Go** | App para testar sem build nativo. **Não** suporta background/lockscreen. | UC-09 |
| **Dev Build** | Build via `eas build --profile development` com código nativo (necessário para background). | `05-arquitetura` |
| **Zustand** | Lib de estado global leve, usada para `playerStore` e `favoritesStore`. | `src/store/*` |
| **Reanimated** | Lib de animação que roda na UI thread (worklets). | `babel.config.js` |
| **Gesture Handler** | Lib para gestos nativos (pan do BottomSheet). | `App.tsx` |
| **EAS** | Expo Application Services — CI/build para iOS/Android. | Fase 4 |

## Abreviações

- **RF:** Requisito Funcional — `01-requisitos.md`
- **RNF:** Requisito Não-Funcional
- **RN:** Regra de Negócio — `02-regras-de-negocio.md`
- **UC:** Caso de Uso — `03-casos-de-uso.md`
- **ADR:** Architecture Decision Record — `05-arquitetura.md`

---

*Voltar: [README](./README.md)*
