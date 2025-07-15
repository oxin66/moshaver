import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { supabase } from '../supabaseClient';

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
    <View>
      <Text>Weekly Schedule</Text>
      <FlatList
        data={schedule}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>
              {item.day} at {item.time}: {item.task}
            </Text>
            <Button
              title={item.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
              onPress={() => toggleTaskStatus(item)}
            />
          </View>
        )}
      />
    </View>
  );
};

export default ScheduleScreen;
