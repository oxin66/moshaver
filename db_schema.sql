-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL, -- 'student' or 'counselor'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Students table
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  grade VARCHAR(50),
  field_of_study VARCHAR(255),
  phone_number VARCHAR(20)
);

-- Counselors table
CREATE TABLE counselors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE
);

-- Schedules table
CREATE TABLE schedules (
  id BIGSERIAL PRIMARY KEY,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  task TEXT NOT NULL,
  day VARCHAR(20) NOT NULL,
  time VARCHAR(10) NOT NULL,
  completed BOOLEAN DEFAULT FALSE
);

-- Messages table
CREATE TABLE messages (
  id BIGSERIAL PRIMARY KEY,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT,
  file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to automatically create a student or counselor profile when a new user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role = 'student' THEN
    INSERT INTO public.students (user_id, name)
    VALUES (NEW.id, '');
  ELSIF NEW.role = 'counselor' THEN
    INSERT INTO public.counselors (user_id, name)
    VALUES (NEW.id, '');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function when a new user is inserted
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Performance Data table
CREATE TABLE performance_data (
  id BIGSERIAL PRIMARY KEY,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  subject VARCHAR(255) NOT NULL,
  score FLOAT,
  completion_rate FLOAT,
  time_spent_minutes INT,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);
