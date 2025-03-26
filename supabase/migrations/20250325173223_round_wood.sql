/*
  # Initial Schema Setup

  1. New Tables
    - cities
      - id (uuid, primary key)
      - name (text, unique)
      - created_at (timestamp)
    
    - neighborhoods
      - id (uuid, primary key)
      - name (text)
      - city_id (uuid, foreign key)
      - created_at (timestamp)
    
    - categories
      - id (uuid, primary key)
      - name (text, unique)
      - created_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
*/

-- Create cities table
CREATE TABLE IF NOT EXISTS cities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create neighborhoods table
CREATE TABLE IF NOT EXISTS neighborhoods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  city_id uuid REFERENCES cities(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(name, city_id)
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE neighborhoods ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access for cities"
  ON cities
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access for neighborhoods"
  ON neighborhoods
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access for categories"
  ON categories
  FOR SELECT
  TO public
  USING (true);