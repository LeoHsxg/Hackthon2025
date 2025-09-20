from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Database connection function
def get_db_connection():
    return psycopg2.connect(
        host="localhost",
        database="road_safety_db",
        user="postgres",
        password="your_password"
    )

# Create table if it doesn't exist
def init_db():
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute('''
        CREATE TABLE IF NOT EXISTS reports (
            id SERIAL PRIMARY KEY,
            type VARCHAR(50) NOT NULL,
            title VARCHAR(100) NOT NULL,
            description TEXT,
            location VARCHAR(200),
            severity VARCHAR(20),
            status VARCHAR(20) DEFAULT 'pending',
            reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            upvotes INTEGER DEFAULT 0,
            downvotes INTEGER DEFAULT 0
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
        INSERT INTO reports (type, title, description, location, severity)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING *
    ''', (
        data['type'],
        data['title'],
        data['description'],
        data['location'],
        data['severity']
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