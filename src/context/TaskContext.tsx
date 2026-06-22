import { createContext, ReactNode, useEffect, useState } from 'react';

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
}

export const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
      console.log("Gabim gjatë fetch-it", error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = (title: string, description: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      status: false,
      createdAt: new Date().toLocaleDateString('sq-AL')
    };
    setTasks([newTask, ...tasks]);
  };

  const toggleTaskStatus = (id: string) => {
    const updatedTasks = tasks.map((task: Task) => 
      task.id === id ? { ...task, status: !task.status } : task
    );
    setTasks(updatedTasks);
  };

  const deleteTask = (id: string) => {
    const updatedTasks = tasks.filter((task: Task) => task.id !== id);
    setTasks(updatedTasks);
  };

  return (
    <TaskContext.Provider value={{ tasks, loading, addTask, toggleTaskStatus, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
};