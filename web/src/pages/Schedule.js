import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const Schedule = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [schedule, setSchedule] = useState([]);
  const [task, setTask] = useState('');
  const [day, setDay] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      const { data, error } = await supabase.from('students').select('id, name');
      if (error) console.log('Error fetching students: ', error);
      else setStudents(data);
    };
    fetchStudents();
  }, []);

  const fetchSchedule = async (studentId) => {
    const { data, error } = await supabase
      .from('schedules')
      .select('*')
      .eq('student_id', studentId);
    if (error) console.log('Error fetching schedule: ', error);
    else setSchedule(data);
  };

  const handleStudentChange = (e) => {
    const studentId = e.target.value;
    setSelectedStudent(studentId);
    fetchSchedule(studentId);
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('schedules')
      .insert([{ student_id: selectedStudent, task, day, time }]);
    if (error) console.log('Error adding task: ', error);
    else {
      setSchedule([...schedule, data[0]]);
      setTask('');
      setDay('');
      setTime('');
    }
  };

  return (
    <div>
      <h2>Weekly Schedule</h2>
      <select onChange={handleStudentChange} value={selectedStudent}>
        <option value="">Select a student</option>
        {students.map((student) => (
          <option key={student.id} value={student.id}>
            {student.name}
          </option>
        ))}
      </select>
      {selectedStudent && (
        <div>
          <h3>Add Task</h3>
          <form onSubmit={handleAddTask}>
            <input
              type="text"
              placeholder="Task"
              value={task}
              onChange={(e) => setTask(e.target.value)}
            />
            <input
              type="text"
              placeholder="Day"
              value={day}
              onChange={(e) => setDay(e.target.value)}
            />
            <input
              type="text"
              placeholder="Time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
            <button type="submit">Add Task</button>
          </form>
          <h3>Current Schedule</h3>
          <ul>
            {schedule.map((item) => (
              <li key={item.id}>
                {item.day} at {item.time}: {item.task}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Schedule;
