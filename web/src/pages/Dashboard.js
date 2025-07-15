import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Bar } from 'react-chartjs-2';

const Dashboard = () => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const fetchProgressData = async () => {
      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('id, name');

      if (studentsError) {
        console.error('Error fetching students:', studentsError);
        return;
      }

      const studentProgress = await Promise.all(
        students.map(async (student) => {
          const { data: schedules, error: schedulesError } = await supabase
            .from('schedules')
            .select('completed')
            .eq('student_id', student.id);

          if (schedulesError) {
            console.error(
              `Error fetching schedules for student ${student.name}:`,
              schedulesError
            );
            return { name: student.name, progress: 0 };
          }

          const completedTasks = schedules.filter(
            (schedule) => schedule.completed
          ).length;
          const totalTasks = schedules.length;
          const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

          return { name: student.name, progress };
        })
      );

      setChartData({
        labels: studentProgress.map((student) => student.name),
        datasets: [
          {
            label: 'Student Progress (%)',
            data: studentProgress.map((student) => student.progress),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
          },
        ],
      });
    };

    fetchProgressData();
  }, []);

  return (
    <div>
      <h2>Student Progress Dashboard</h2>
      <Bar data={chartData} />
    </div>
  );
};

export default Dashboard;
