import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useEffect, useMemo, useState } from 'react';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: boolean;
  createdAt: string;
}

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  addTask: (title: string, description: string) => void;
  toggleTaskStatus: (id: string) => void;
  deleteTask: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterStatus: 'all' | 'completed' | 'active';
  setFilterStatus: (status: 'all' | 'completed' | 'active') => void;
}

export const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'active'>('all');

  useEffect(() => {
    loadInitialData();
  }, []);

  // Kontrollojmë nëse ka detyra të ruajtura në telefon, nëse jo marrim nga API
  const loadInitialData = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem('@tasks');
      if (savedTasks && JSON.parse(savedTasks).length > 0) {
        setTasks(JSON.parse(savedTasks));
        setLoading(false);
      } else {
        await fetchPublicData();
      }
    } catch (error) {
      console.log("Gabim gjatë ngarkimit nga storage:", error);
      setLoading(false);
    }
  };

  const fetchPublicData = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=4');
      const data = await response.json();
      const apiTasks: Task[] = data.map((item: any) => ({
        id: `api-${item.id}`,
        title: item.title,
        description: 'Detyrë e marrë automatikisht nga API.',
        status: item.completed,
        createdAt: new Date().toLocaleDateString('sq-AL')
      }));
      setTasks(apiTasks);
      await AsyncStorage.setItem('@tasks', JSON.stringify(apiTasks));
    } catch (error) {
      console.log("Gabim:", error);
    } finally {
      setLoading(false);
    }
  };

  // Funksioni që ruan në state dhe në memorie njëkohësisht
  const saveTasks = async (newTasks: Task[]) => {
    setTasks(newTasks);
    try {
      await AsyncStorage.setItem('@tasks', JSON.stringify(newTasks));
    } catch (error) {
      console.log("Gabim gjatë ruajtjes:", error);
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = 
        filterStatus === 'all' ? true :
        filterStatus === 'completed' ? task.status : !task.status;
      return matchesSearch && matchesStatus;
    });
  }, [tasks, searchQuery, filterStatus]);

  const addTask = (title: string, description: string) => {
    const newTask: Task = { id: Date.now().toString(), title, description, status: false, createdAt: new Date().toLocaleDateString('sq-AL') };
    saveTasks([newTask, ...tasks]);
  };

  const toggleTaskStatus = (id: string) => {
    const updatedTasks = tasks.map(t => t.id === id ? { ...t, status: !t.status } : t);
    saveTasks(updatedTasks);
  };

  const deleteTask = (id: string) => {
    const updatedTasks = tasks.filter(t => t.id !== id);
    saveTasks(updatedTasks);
  };

  return (
    <TaskContext.Provider value={{ 
      tasks: filteredTasks, 
      loading, 
      addTask, 
      toggleTaskStatus, 
      deleteTask, 
      searchQuery, 
      setSearchQuery,
      filterStatus,
      setFilterStatus
    }}>
      {children}
    </TaskContext.Provider>
  );
};