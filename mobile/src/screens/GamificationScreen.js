import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { supabase } from '../supabaseClient';
import { Appbar, Card, Title, Paragraph } from 'react-native-paper';

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
    <>
      <Appbar.Header>
        <Appbar.Content title="Gamification" />
      </Appbar.Header>
      <Card style={{ margin: 8 }}>
        <Card.Content>
          <Title>Your Score</Title>
          <Paragraph>{score}</Paragraph>
        </Card.Content>
      </Card>
      <Card style={{ margin: 8 }}>
        <Card.Content>
          <Title>Your Medal</Title>
          <Paragraph>{medal}</Paragraph>
        </Card.Content>
      </Card>
    </>
  );
};

export default GamificationScreen;
