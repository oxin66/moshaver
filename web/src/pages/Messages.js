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
  Paper,
} from '@mui/material';

const Messages = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      const { data, error } = await supabase.from('students').select('id, name');
      if (error) console.log('Error fetching students: ', error);
      else setStudents(data);
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    if (!selectedStudent) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('student_id', selectedStudent);
      if (error) console.log('Error fetching messages: ', error);
      else setMessages(data);
    };
    fetchMessages();

    const subscription = supabase
      .from(`messages:student_id=eq.${selectedStudent}`)
      .on('INSERT', (payload) => {
        setMessages((currentMessages) => [...currentMessages, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(subscription);
    };
  }, [selectedStudent]);

  const handleStudentChange = (e) => {
    setSelectedStudent(e.target.value);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from('messages').insert([
      {
        student_id: selectedStudent,
        sender_id: supabase.auth.user().id,
        content: newMessage,
      },
    ]);
    if (error) console.log('Error sending message: ', error);
    else {
      setNewMessage('');
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Messages
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
            Chat
          </Typography>
          <Paper style={{ height: 300, overflow: 'auto' }}>
            <List>
              {messages.map((message) => (
                <ListItem key={message.id}>
                  <ListItemText primary={message.content} />
                </ListItem>
              ))}
            </List>
          </Paper>
          <form onSubmit={handleSendMessage}>
            <TextField
              label="Type your message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Button type="submit" variant="contained" color="primary">
              Send
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Messages;
