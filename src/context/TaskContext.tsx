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
}

export const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPublicData();
  }, []);

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
    } catch (error) {
      console.log("Gabim:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => 
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tasks, searchQuery]);

  const addTask = (title: string, description: string) => {
    const newTask: Task = { id: Date.now().toString(), title, description, status: false, createdAt: new Date().toLocaleDateString('sq-AL') };
    setTasks([newTask, ...tasks]);
  };

  const toggleTaskStatus = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: !t.status } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <TaskContext.Provider value={{ 
      tasks: filteredTasks, 
      loading, 
      addTask, 
      toggleTaskStatus, 
      deleteTask, 
      searchQuery, 
      setSearchQuery 
    }}>
      {children}
    </TaskContext.Provider>
  );
};