import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

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
      <h2>Messages</h2>
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
          <h3>Chat</h3>
          <div>
            {messages.map((message) => (
              <div key={message.id}>
                <p>{message.content}</p>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Messages;
