import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { supabase } from '../supabaseClient';
import { BarChart } from 'react-native-chart-kit';
import { Appbar, Card, Title } from 'react-native-paper';

const ProgressScreen = () => {
  const [progressData, setProgressData] = useState({
    labels: [],
    datasets: [{ data: [] }],
  });

  useEffect(() => {
    const fetchProgress = async () => {
      const { data, error } = await supabase
        .from('schedules')
        .select('day, completed')
        .eq('student_id', supabase.auth.user().id);

      if (error) {
        console.log('Error fetching progress: ', error);
      } else {
        const progressByDay = data.reduce((acc, item) => {
          const day = item.day;
          if (!acc[day]) {
            acc[day] = { completed: 0, total: 0 };
          }
          acc[day].total++;
          if (item.completed) {
            acc[day].completed++;
          }
          return acc;
        }, {});

        const labels = Object.keys(progressByDay);
        const chartData = labels.map(
          (day) => (progressByDay[day].completed / progressByDay[day].total) * 100
        );

        setProgressData({
          labels,
          datasets: [{ data: chartData }],
        });
      }
    };
    fetchProgress();
  }, []);

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Weekly Progress" />
      </Appbar.Header>
      <Card style={{ margin: 8 }}>
        <Card.Content>
          <Title>Weekly Progress</Title>
          <BarChart
            data={progressData}
            width={300}
            height={220}
            yAxisLabel={'%'}
            chartConfig={{
              backgroundColor: '#e26a00',
              backgroundGradientFrom: '#fb8c00',
              backgroundGradientTo: '#ffa726',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </Card.Content>
      </Card>
    </>
  );
};

export default ProgressScreen;
