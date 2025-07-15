import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
import { supabase } from '../supabaseClient';

const MessagesScreen = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('student_id', supabase.auth.user().id);
      if (error) console.log('Error fetching messages: ', error);
      else setMessages(data);
    };
    fetchMessages();

    const subscription = supabase
      .from('messages')
      .on('INSERT', (payload) => {
        setMessages((currentMessages) => [...currentMessages, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(subscription);
    };
  }, []);

  const handleSendMessage = async () => {
    const { data, error } = await supabase.from('messages').insert([
      {
        student_id: supabase.auth.user().id,
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
    <View>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.content}</Text>
          </View>
        )}
      />
      <TextInput
        value={newMessage}
        onChangeText={setNewMessage}
        placeholder="Type your message"
      />
      <Button title="Send" onPress={handleSendMessage} />
    </View>
  );
};

export default MessagesScreen;
