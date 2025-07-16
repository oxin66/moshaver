import { supabase } from '../supabaseClient';
import * as tf from '@tensorflow/tfjs';

export const analyzeStudentPerformance = async (studentId) => {
  const { data, error } = await supabase
    .from('performance_data')
    .select('score, completion_rate, time_spent_minutes')
    .eq('student_id', studentId);

  if (error) {
    console.error('Error fetching performance data:', error);
    return null;
  }

  if (data.length < 2) {
    return {
      prediction: 'Not enough data to make a prediction.',
      strength: null,
      weakness: null,
    };
  }

  // Prepare the data for the model
  const xs = tf.tensor2d(data.map((d) => [d.completion_rate, d.time_spent_minutes]));
  const ys = tf.tensor2d(data.map((d) => [d.score]));

  // Create and train the model
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 1, inputShape: [2] }));
  model.compile({ optimizer: 'sgd', loss: 'meanSquaredError' });
  await model.fit(xs, ys, { epochs: 100 });

  // Predict the next score
  const lastEntry = data[data.length - 1];
  const prediction = model.predict(
    tf.tensor2d([[lastEntry.completion_rate, lastEntry.time_spent_minutes]])
  );

  // Identify strengths and weaknesses
  const strengths = data.filter((d) => d.score > 80).map((d) => d.subject);
  const weaknesses = data.filter((d) => d.score < 60).map((d) => d.subject);

  return {
    prediction: `Predicted next score: ${prediction.dataSync()[0].toFixed(2)}`,
    strengths: [...new Set(strengths)],
    weaknesses: [...new Set(weaknesses)],
  };
};
