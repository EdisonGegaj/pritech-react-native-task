import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
}

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  filterStatus: 'All' | 'Active' | 'Completed';
  searchQuery: string;
  setFilterStatus: (status: 'All' | 'Active' | 'Completed') => void;
  setSearchQuery: (query: string) => void;
  addTask: (title: string, description: string) => void;
  toggleTaskStatus: (id: number) => void;
  deleteTask: (id: number) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Completed'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const savedTasks = await AsyncStorage.getItem('@tasks');
        if (savedTasks) {
          setTasks(JSON.parse(savedTasks));
          setLoading(false);
        } else {
          const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
          const data = await response.json();
          const initialTasks = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            description: 'Detyre e importuar nga API',
            completed: item.completed,
            createdAt: new Date().toISOString(),
          }));
          setTasks(initialTasks);
          await AsyncStorage.setItem('@tasks', JSON.stringify(initialTasks));
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    loadTasks();
  } , []);

  const saveToStorage = async (newTasks: Task[]) => {
    try {
      await AsyncStorage.setItem('@tasks', JSON.stringify(newTasks));
    } catch (error) {
      console.error(error);
    }
  };

  const addTask = (title: string, description: string) => {
    const newTask: Task = {
      id: Date.now(),
      title,
      description,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    const updated = [...tasks, newTask];
    setTasks(updated);
    saveToStorage(updated);
  };

  const toggleTaskStatus = (id: number) => {
    const updated = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updated);
    saveToStorage(updated);
  };

  const deleteTask = (id: number) => {
    const updated = tasks.filter(task => task.id !== id);
    setTasks(updated);
    saveToStorage(updated);
  };

  return (
    <TaskContext.Provider value={{ 
      tasks, 
      loading, 
      filterStatus, 
      searchQuery, 
      setFilterStatus, 
      setSearchQuery, 
      addTask, 
      toggleTaskStatus, 
      deleteTask 
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks duhet te perdoret brenda TaskProvider');
  }
  return context;
};