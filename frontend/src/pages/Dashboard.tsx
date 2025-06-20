import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

import 'react-calendar/dist/Calendar.css';

interface Task {
  id: number;
  title: string;
  estimated_time: number;
  completed: boolean;
}

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTasks(res.data);
    } catch {
      alert('Error fetching tasks');
    }
  };

  useEffect(() => {
    fetchTasks();
    // Optional: Setup notifications
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const reordered = Array.from(tasks);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setTasks(reordered);
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div style={{ padding: 20 }}>
      <h2>📋 Task Dashboard</h2>

      {/* 🗓️ Calendar */}
      <Calendar value={selectedDate} onChange={(date) => setSelectedDate(date as Date)} />

      {/* 📊 Progress Chart */}
      <h3>Progress</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={[{ name: 'Tasks', Completed: completedCount, Remaining: tasks.length - completedCount }]}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="Completed" fill="#4caf50" />
          <Bar dataKey="Remaining" fill="#f44336" />
        </BarChart>
      </ResponsiveContainer>

      {/* 🔄 Drag & Drop Task Planner */}
      <h3>📌 Tasks</h3>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="taskList">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        padding: '8px',
                        margin: '4px',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        background: task.completed ? '#e0ffe0' : '#fff',
                      }}
                    >
                      <strong>{task.title}</strong> - {task.estimated_time} mins
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Dashboard;
