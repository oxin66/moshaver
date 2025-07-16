import React, { useState, useEffect } from 'react';
import { FlatList, View, Platform, Linking, Image } from 'react-native';
import { supabase } from '../supabaseClient';
import {
  TextInput,
  Button,
  Appbar,
  Card,
  Paragraph,
} from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';

const MessagesScreen = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState(null);

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
    let fileUrl = null;
    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${supabase.auth.user().id}/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('chat-files')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        return;
      }
      fileUrl = uploadData.Key;
    }

    const { data, error } = await supabase.from('messages').insert([
      {
        student_id: supabase.auth.user().id,
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

  const selectFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.video],
      });
      setFile(res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
      } else {
        throw err;
      }
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
              {item.file_url && (
                <Image
                  source={{
                    uri: supabase.storage.from('chat-files').getPublicUrl(item.file_url).publicURL,
                  }}
                  style={{ width: 200, height: 200 }}
                />
              )}
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
        <Button onPress={selectFile}>Attach</Button>
        <Button onPress={handleSendMessage}>Send</Button>
      </View>
    </>
  );
};

export default MessagesScreen;
