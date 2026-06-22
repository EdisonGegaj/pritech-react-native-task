import { useContext, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { TaskContext } from '../context/TaskContext';

export default function HomeScreen() {
  const context = useContext(TaskContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  if (!context || context.loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const handleAddTask = () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Gabim', 'Ju lutem plotësoni titullin dhe përshkrimin e detyrës!');
      return;
    }
    context.addTask(title.trim(), description.trim());
    setTitle('');
    setDescription('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput style={styles.input} placeholder="Titulli i detyrës..." value={title} onChangeText={setTitle} />
        <TextInput style={styles.input} placeholder="Përshkrimi..." value={description} onChangeText={setDescription} />
        <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
          <Text style={styles.buttonText}>+ Shto Detyrë</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={context.tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.taskTitle, item.status && styles.completedText]}>{item.title}</Text>
              <Text style={styles.taskDescription}>{item.description}</Text>
              <Text style={styles.taskDate}>{item.createdAt}</Text>
            </View>
            
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => context.toggleTaskStatus(item.id)} style={{ marginRight: 15 }}>
                <Text style={{ fontSize: 20 }}>{item.status ? '✅' : '⬜'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => context.deleteTask(item.id)}>
                <Text style={{ fontSize: 18, color: 'red' }}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F8F9FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  form: { marginBottom: 20, backgroundColor: '#FFF', padding: 15, borderRadius: 10, elevation: 2 },
  input: { borderWidth: 1, borderColor: '#E5E5E5', padding: 10, marginBottom: 10, borderRadius: 8 },
  addButton: { backgroundColor: '#007AFF', padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#FFF', fontWeight: 'bold' },
  taskCard: { flexDirection: 'row', backgroundColor: '#FFF', padding: 15, borderRadius: 10, marginBottom: 12, elevation: 2, alignItems: 'center' },
  taskTitle: { fontSize: 18, fontWeight: 'bold', color: '#2C3E50' },
  completedText: { textDecorationLine: 'line-through', color: '#BDC3C7' },
  taskDescription: { fontSize: 14, color: '#7F8C8D', marginTop: 5 },
  taskDate: { fontSize: 12, color: '#BDC3C7', marginTop: 8 },
  actions: { flexDirection: 'row', alignItems: 'center' }
});