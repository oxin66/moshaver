import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';

const Students = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { data, error } = await supabase
          .from('students')
          .select(`
            id,
            name,
            grade,
            field_of_study,
            phone_number,
            users (
              email
            )
          `);
        if (error) throw error;
        setStudents(data);
      } catch (error) {
        alert(error.message);
      }
    };
    fetchStudents();
  }, []);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Manage Students
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Grade</TableCell>
              <TableCell>Field of Study</TableCell>
              <TableCell>Phone Number</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.users.email}</TableCell>
                <TableCell>{student.grade}</TableCell>
                <TableCell>{student.field_of_study}</TableCell>
                <TableCell>{student.phone_number}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Students;
