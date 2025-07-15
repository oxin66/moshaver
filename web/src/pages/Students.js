import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

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
      <h2>Manage Students</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Grade</th>
            <th>Field of Study</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.users.email}</td>
              <td>{student.grade}</td>
              <td>{student.field_of_study}</td>
              <td>{student.phone_number}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Students;
