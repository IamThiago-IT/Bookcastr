import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync } from 'expo-audio';
import { useEffect } from 'react';

const TEST_AUDIO =
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

function AudioTest() {
  const player = useAudioPlayer({ uri: TEST_AUDIO });
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: 'duckOthers',
      shouldRouteThroughEarpiece: false,
    });
  }, []);

  return (
    <View style={styles.audioCard}>
      <Text style={styles.audioTitle}>Teste expo-audio 0.4.9</Text>
      <Text style={styles.audioSub}>
        Status: {status.isLoaded ? (status.playing ? 'Tocando' : 'Pausado') : 'Carregando...'}
      </Text>
      <Text style={styles.audioSub}>
        {status.currentTime?.toFixed(1)}s / {status.duration?.toFixed(1) ?? '--'}s
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => (status.playing ? player.pause() : player.play())}
      >
        <Text style={styles.buttonText}>{status.playing ? 'Pausar' : 'Tocar Teste'}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => player.seekTo(0)}
      >
        <Text style={styles.buttonText}>Reiniciar</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaProvider>
        <BottomSheetModalProvider>
          <View style={styles.container}>
            <Text style={styles.title}>Bookcastr</Text>
            <Text style={styles.subtitle}>Fase 0 — Setup Mobile OK</Text>
            <Text style={styles.badge}>SDK 53 • expo-audio • Reanimated • BottomSheet</Text>

            <View style={styles.checks}>
              <Text style={styles.check}>✓ GestureHandlerRootView</Text>
              <Text style={styles.check}>✓ BottomSheetModalProvider</Text>
              <Text style={styles.check}>✓ SafeAreaProvider</Text>
              <Text style={styles.check}>✓ Background audio (expo-audio)</Text>
            </View>

            <AudioTest />
            <StatusBar style="auto" />
          </View>
        </BottomSheetModalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: '#A1A1AA',
    marginTop: 4,
  },
  badge: {
    marginTop: 12,
    fontSize: 12,
    color: '#52525B',
    backgroundColor: '#18181B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    overflow: 'hidden',
  },
  checks: {
    marginTop: 24,
    gap: 4,
    alignItems: 'flex-start',
    backgroundColor: '#18181B',
    padding: 16,
    borderRadius: 12,
    width: '100%',
  },
  check: {
    color: '#E4E4E7',
    fontSize: 14,
  },
  audioCard: {
    marginTop: 24,
    backgroundColor: '#18181B',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    borderWidth: 1,
    borderColor: '#27272A',
  },
  audioTitle: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  audioSub: {
    color: '#A1A1AA',
    fontSize: 12,
    marginTop: 2,
  },
  button: {
    marginTop: 12,
    backgroundColor: '#7C3AED',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#27272A',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
