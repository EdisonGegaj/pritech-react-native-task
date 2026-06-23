import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTasks } from '../context/TaskContext';

export default function HomeScreen() {
  const router = useRouter();
  
  
  const { tasks, loading, addTask, toggleTaskStatus, deleteTask } = useTasks();

  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Completed'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const handleAddTask = () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Gabim', 'Ju lutem plotësoni titullin dhe përshkrimin!');
      return;
    }
    addTask(title.trim(), description.trim());
    setTitle('');
    setDescription('');
  };

  // Logjika e filtrimit lokal
  const filteredTasks = (tasks || []).filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterStatus === 'Active') return matchesSearch && !task.completed;
    if (filterStatus === 'Completed') return matchesSearch && task.completed;
    return matchesSearch;
  });

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput style={styles.input} placeholder="Titulli..." value={title} onChangeText={setTitle} />
        <TextInput style={styles.input} placeholder="Përshkrimi..." value={description} onChangeText={setDescription} />
        <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
          <Text style={styles.buttonText}>+ Shto Detyrë</Text>
        </TouchableOpacity>
      </View>

      <TextInput 
        style={[styles.input, { backgroundColor: '#eef0f3', marginTop: 10, borderColor: '#ccc' }]} 
        placeholder="Kërko detyra..." 
        value={searchQuery} 
        onChangeText={setSearchQuery} 
      />

      <View style={styles.filterContainer}>
        {(['All', 'Active', 'Completed'] as const).map(status => (
          <TouchableOpacity 
            key={status} 
            style={[styles.filterButton, filterStatus === status && styles.activeFilter]} 
            onPress={() => setFilterStatus(status)}
          >
            <Text style={filterStatus === status ? { color: '#FFF', fontWeight: 'bold' } : { color: '#555' }}>
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

           <FlatList
        data={filteredTasks}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() =>
                router.push({
                  pathname: '/details',
                  params: {
                    id: item.id.toString(),
                    title: item.title,
                    description: item.description || '',
                    completed: item.completed ? 'true' : 'false',
                  },
                })
              }
            >
              <Text style={[styles.taskTitle, item.completed && styles.completedText]}>
                {item.title}
              </Text>

              <Text style={styles.taskDescription} numberOfLines={1}>
                {item.description}
              </Text>
            </TouchableOpacity>

            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() => toggleTaskStatus(item.id)}
                style={{ marginRight: 15 }}
              >
                <Text style={{ fontSize: 20 }}>
                  {item.completed ? '' : '⬜'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => deleteTask(item.id)}>
                <Text style={{ fontSize: 18, color: 'red' }}>
              
                </Text>
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
  taskDescription: { fontSize: 14, color: '#7F8C8D', marginTop: 5 },
  completedText: { textDecorationLine: 'line-through', color: '#BDC3C7' },
  actions: { flexDirection: 'row', alignItems: 'center' },
  filterContainer: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 },
  filterButton: { paddingVertical: 6, paddingHorizontal: 15, borderRadius: 20, backgroundColor: '#E5E5E5' },
  activeFilter: { backgroundColor: '#007AFF' },
});