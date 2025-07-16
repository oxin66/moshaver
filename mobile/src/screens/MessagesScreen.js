import React, { useState, useEffect } from 'react';
import { FlatList, View } from 'react-native';
import { supabase } from '../supabaseClient';
import {
  TextInput,
  Button,
  Appbar,
  Card,
  Paragraph,
} from 'react-native-paper';

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
    <>
      <Appbar.Header>
        <Appbar.Content title="Messages" />
      </Appbar.Header>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={{ margin: 8 }}>
            <Card.Content>
              <Paragraph>{item.content}</Paragraph>
            </Card.Content>
          </Card>
        )}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 8 }}>
        <TextInput
          style={{ flex: 1 }}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type your message"
        />
        <Button onPress={handleSendMessage}>Send</Button>
      </View>
    </>
  );
};

export default MessagesScreen;
