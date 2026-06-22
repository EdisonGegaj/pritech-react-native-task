import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function DetailsScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>TITULLI I DETYRËS</Text>
        <Text style={styles.title}>{params.title}</Text>

        <Text style={styles.label}>PËRSHKRIMI</Text>
        <Text style={styles.description}>{params.description}</Text>

        <Text style={styles.label}>STATUSI I AKTUAL</Text>
        <View style={[styles.statusBadge, params.status === 'true' ? styles.completedBadge : styles.activeBadge]}>
          <Text style={params.status === 'true' ? styles.completedText : styles.activeText}>
            {params.status === 'true' ? '✅ E Kryer' : '⏳ Në Proces'}
          </Text>
        </View>

        <Text style={styles.label}>DATA E KRIJIMIT</Text>
        <Text style={styles.date}>{params.createdAt}</Text>
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>⬅ Kthehu Mbrapa</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F8F9FA', justifyContent: 'center' },
  card: { backgroundColor: '#FFF', padding: 25, borderRadius: 16, elevation: 4, marginBottom: 20 },
  label: { fontSize: 12, color: '#95A5A6', fontWeight: 'bold', marginBottom: 5 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#2C3E50', marginBottom: 20 },
  description: { fontSize: 16, color: '#555', marginBottom: 20 },
  statusBadge: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, alignSelf: 'flex-start', marginBottom: 20 },
  activeBadge: { backgroundColor: '#FFF3CD' },
  completedBadge: { backgroundColor: '#D4EDDA' },
  activeText: { color: '#856404', fontWeight: 'bold' },
  completedText: { color: '#155724', fontWeight: 'bold' },
  date: { fontSize: 15, color: '#34495E' },
  backButton: { backgroundColor: '#1A1A1A', padding: 16, borderRadius: 10, alignItems: 'center' },
  backText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});