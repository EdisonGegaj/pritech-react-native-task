import { useContext } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { TaskContext } from '../context/TaskContext';

export default function HomeScreen() {
  const context = useContext(TaskContext);

  if (!context || context.loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={context.tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            <Text style={styles.taskTitle}>{item.title}</Text>
            <Text style={styles.taskDescription}>{item.description}</Text>
            <Text style={styles.taskDate}>{item.createdAt}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F8F9FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  taskCard: { backgroundColor: '#FFF', padding: 15, borderRadius: 10, marginBottom: 12, elevation: 2 },
  taskTitle: { fontSize: 18, fontWeight: 'bold', color: '#2C3E50' },
  taskDescription: { fontSize: 14, color: '#7F8C8D', marginTop: 5 },
  taskDate: { fontSize: 12, color: '#BDC3C7', marginTop: 8 }
});