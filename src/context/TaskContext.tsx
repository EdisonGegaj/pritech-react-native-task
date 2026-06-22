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
        description: 'Detyre e marrë automatikisht nga API Publik.',
        status: item.completed,
        createdAt: new Date().toLocaleDateString('sq-AL')
      }));

      setTasks(apiTasks);
    } catch (error) {
      console.log("Gabim gjatë fetch-it nga API:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, loading }}>
      {children}
    </TaskContext.Provider>
  );
};