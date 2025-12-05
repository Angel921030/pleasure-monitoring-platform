from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from app.config import config
from app.models import db

def create_app(config_name='default'):
    """Application factory pattern"""
    app = Flask(__name__, instance_relative_config=True)
    
    # Load configuration
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    CORS(app, origins=['http://localhost:5173', 'http://localhost:5174'], supports_credentials=True)
    db.init_app(app)
    JWTManager(app)
    
    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.history import history_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(history_bp, url_prefix='/api/history')
    
    # Create database tables
    with app.app_context():
        db.create_all()
    
    @app.route('/api/health')
    def health_check():
        return {'status': 'ok', 'message': 'Flask backend is running'}
    
    return app
