import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';

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
      <Typography variant="h4" gutterBottom>
        Weekly Schedule
      </Typography>
      <FormControl fullWidth>
        <InputLabel>Select a student</InputLabel>
        <Select value={selectedStudent} onChange={handleStudentChange}>
          {students.map((student) => (
            <MenuItem key={student.id} value={student.id}>
              {student.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {selectedStudent && (
        <div>
          <Typography variant="h5" gutterBottom>
            Add Task
          </Typography>
          <form onSubmit={handleAddTask}>
            <TextField
              label="Task"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Day"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Button type="submit" variant="contained" color="primary">
              Add Task
            </Button>
          </form>
          <Typography variant="h5" gutterBottom>
            Current Schedule
          </Typography>
          <List>
            {schedule.map((item) => (
              <ListItem key={item.id}>
                <ListItemText
                  primary={item.task}
                  secondary={`${item.day} at ${item.time}`}
                />
              </ListItem>
            ))}
          </List>
        </div>
      )}
    </div>
  );
};

export default Schedule;
