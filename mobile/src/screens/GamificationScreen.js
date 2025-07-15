import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { supabase } from '../supabaseClient';

const GamificationScreen = () => {
  const [score, setScore] = useState(0);
  const [medal, setMedal] = useState('No Medal');

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      const { data, error } = await supabase
        .from('schedules')
        .select('completed')
        .eq('student_id', supabase.auth.user().id)
        .eq('completed', true);

      if (error) {
        console.error('Error fetching completed tasks:', error);
      } else {
        const newScore = data.length * 10; // 10 points for each completed task
        setScore(newScore);
        if (newScore > 100) {
          setMedal('Gold Medal');
        } else if (newScore > 50) {
          setMedal('Silver Medal');
        } else if (newScore > 20) {
          setMedal('Bronze Medal');
        }
      }
    };

    fetchCompletedTasks();
  }, []);

  return (
    <View>
      <Text>Your Score: {score}</Text>
      <Text>Your Medal: {medal}</Text>
    </View>
  );
};

export default GamificationScreen;
