import React, { useState, useEffect } from 'react';
import { FlatList } from 'react-native';
import { supabase } from '../supabaseClient';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Appbar,
} from 'react-native-paper';

const ScheduleScreen = () => {
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    const fetchSchedule = async () => {
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .eq('student_id', supabase.auth.user().id);
      if (error) console.log('Error fetching schedule: ', error);
      else setSchedule(data);
    };
    fetchSchedule();
  }, []);

  const toggleTaskStatus = async (task) => {
    const { data, error } = await supabase
      .from('schedules')
      .update({ completed: !task.completed })
      .eq('id', task.id);
    if (error) console.log('Error updating task: ', error);
    else {
      setSchedule(
        schedule.map((item) => (item.id === task.id ? data[0] : item))
      );
    }
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Weekly Schedule" />
      </Appbar.Header>
      <FlatList
        data={schedule}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={{ margin: 8 }}>
            <Card.Content>
              <Title>{item.task}</Title>
              <Paragraph>
                {item.day} at {item.time}
              </Paragraph>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => toggleTaskStatus(item)}>
                {item.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
              </Button>
            </Card.Actions>
          </Card>
        )}
      />
    </>
  );
};

export default ScheduleScreen;
