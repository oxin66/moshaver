import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { analyzeStudentPerformance } from '../ai/model';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Grid,
} from '@mui/material';
import { Pie } from 'react-chartjs-2';

const AIAnalysis = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const fetchStudents = async () => {
      const { data, error } = await supabase.from('students').select('id, name');
      if (error) console.log('Error fetching students: ', error);
      else setStudents(data);
    };
    fetchStudents();
  }, []);

  const handleStudentChange = async (e) => {
    const studentId = e.target.value;
    setSelectedStudent(studentId);
    const result = await analyzeStudentPerformance(studentId);
    setAnalysis(result);

    if (result && result.strengths && result.weaknesses) {
      setChartData({
        labels: ['Strengths', 'Weaknesses'],
        datasets: [
          {
            data: [result.strengths.length, result.weaknesses.length],
            backgroundColor: ['#36A2EB', '#FF6384'],
          },
        ],
      });
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        AI-Powered Performance Analysis
      </Typography>
      <FormControl fullWidth>
        <InputLabel>Select a student</InputLabel>
        <Select value={selectedStudent} onChange={handleStudentChange}>
          {students.map((student) => (
            <MenuItem key={student.id} value={student.id}>
              {student.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {analysis && (
        <Grid container spacing={3} style={{ marginTop: 16 }}>
          <Grid item xs={12} md={6}>
            <Paper style={{ padding: 16 }}>
              <Typography variant="h5" gutterBottom>
                Analysis Results
              </Typography>
              <Typography variant="body1">{analysis.prediction}</Typography>
              <Typography variant="h6" gutterBottom style={{ marginTop: 16 }}>
                Strengths
              </Typography>
              <List>
                {analysis.strengths &&
                  analysis.strengths.map((strength) => (
                    <ListItem key={strength}>
                      <ListItemText primary={strength} />
                    </ListItem>
                  ))}
              </List>
              <Typography variant="h6" gutterBottom style={{ marginTop: 16 }}>
                Weaknesses
              </Typography>
              <List>
                {analysis.weaknesses &&
                  analysis.weaknesses.map((weakness) => (
                    <ListItem key={weakness}>
                      <ListItemText primary={weakness} />
                    </ListItem>
                  ))}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper style={{ padding: 16 }}>
              <Typography variant="h5" gutterBottom>
                Strengths vs. Weaknesses
              </Typography>
              <Pie data={chartData} />
            </Paper>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default AIAnalysis;
