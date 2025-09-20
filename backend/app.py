from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime
from dotenv import load_dotenv
import os

app = Flask(__name__)
CORS(app)

load_dotenv()  # Load variables from .env

# Database connection function
def get_db_connection():
    conn = psycopg2.connect(
        host=os.getenv("DB_HOST"),
        database=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD")
    )
    print(f"Connected to database {os.getenv('DB_NAME')}")  # Debug message
    return conn

# Create table if it doesn't exist
def init_db():
    conn = get_db_connection()
    cur = conn.cursor()
    # Create users table
    cur.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(100),
            password_hash VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    # Create report_types table
    cur.execute('''
        CREATE TABLE IF NOT EXISTS report_types (
            id SERIAL PRIMARY KEY,
            label VARCHAR(100) NOT NULL,
            icon VARCHAR(50)
        )
    ''')
    # Create reports table
    cur.execute('''
        CREATE TABLE IF NOT EXISTS reports (
            id SERIAL PRIMARY KEY,
            type_id INT REFERENCES report_types(id),
            title VARCHAR(100) NOT NULL,
            description TEXT,
            location VARCHAR(200),
            coordinates_lat FLOAT,
            coordinates_lng FLOAT,
            severity VARCHAR(20),
            status VARCHAR(20) DEFAULT 'pending',
            reported_by INT REFERENCES users(id),
            reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            upvotes INTEGER DEFAULT 0,
            downvotes INTEGER DEFAULT 0,
            comments INTEGER DEFAULT 0
        )
    ''')
    conn.commit()
    cur.close()
    conn.close()

# Initialize database table
init_db()

@app.route('/api/reports', methods=['GET'])
def get_reports():
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute('SELECT * FROM reports ORDER BY reported_at DESC')
    reports = cur.fetchall()
    
    cur.close()
    conn.close()
    
    return jsonify(reports)

@app.route('/api/reports', methods=['POST'])
def create_report():
    data = request.json
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute('''
        INSERT INTO reports (type_id, title, description, location, coordinates_lat, coordinates_lng, severity, reported_by)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING *
    ''', (
        data['type_id'],
        data['title'],
        data['description'],
        data['location'],
        data.get('coordinates_lat'),
        data.get('coordinates_lng'),
        data['severity'],
        data.get('reported_by')
    ))
    
    new_report = cur.fetchone()
    conn.commit()
    
    cur.close()
    conn.close()
    
    return jsonify(new_report), 201

@app.route('/api/reports/<int:report_id>/vote', methods=['POST'])
def vote_report(report_id):
    data = request.json
    vote_type = data['voteType']
    if vote_type not in ['upvotes', 'downvotes']:
        return jsonify({'error': 'Invalid vote type'}), 400
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute(f'''
        UPDATE reports 
        SET {vote_type} = {vote_type} + 1
        WHERE id = %s
        RETURNING *
    ''', (report_id,))
    updated_report = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    if updated_report is None:
        return jsonify({'error': 'Report not found'}), 404
    return jsonify(updated_report)

if __name__ == '__main__':
    app.run(debug=True)