from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json

db = SQLAlchemy()

class User(db.Model):
    """User model"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    name = db.Column(db.String(255), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship
    histories = db.relationship('AssessmentHistory', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        """Convert user to dictionary"""
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class AssessmentHistory(db.Model):
    """Assessment history model"""
    __tablename__ = 'assessment_history'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    total_score = db.Column(db.Integer, nullable=False)
    max_score = db.Column(db.Integer, nullable=False)
    level = db.Column(db.String(50), nullable=False)
    answers = db.Column(db.Text, nullable=False)  # JSON string
    completed_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        """Convert assessment history to dictionary"""
        percentage = round((self.total_score / self.max_score) * 100) if self.max_score > 0 else 0
        return {
            'id': self.id,
            'total_score': self.total_score,
            'max_score': self.max_score,
            'level': self.level,
            'percentage': percentage,
            'answers': json.loads(self.answers) if self.answers else [],
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }
