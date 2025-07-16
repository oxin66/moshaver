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
  Input,
} from '@mui/material';

const Messages = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState(null);

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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    let fileUrl = null;
    if (file) {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('chat-files')
        .upload(`${selectedStudent}/${file.name}`, file);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        return;
      }
      fileUrl = uploadData.Key;
    }

    const { data, error } = await supabase.from('messages').insert([
      {
        student_id: selectedStudent,
        sender_id: supabase.auth.user().id,
        content: newMessage,
        file_url: fileUrl,
      },
    ]);
    if (error) console.log('Error sending message: ', error);
    else {
      setNewMessage('');
      setFile(null);
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
                  <ListItemText
                    primary={message.content}
                    secondary={
                      message.file_url && (
                        <img
                          src={supabase.storage.from('chat-files').getPublicUrl(message.file_url).publicURL}
                          alt="attachment"
                          style={{ maxWidth: '100%' }}
                        />
                      )
                    }
                  />
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
            <Input type="file" onChange={handleFileChange} />
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
