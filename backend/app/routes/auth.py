from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.models import db, User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        
        # Validate input
        if not data or not data.get('email') or not data.get('password') or not data.get('name'):
            return jsonify({'success': False, 'message': '缺少必要欄位'}), 400
        
        email = data['email']
        name = data['name']
        password = data['password']
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({'success': False, 'message': '此電子郵件已被註冊'}), 400
        
        # Create new user
        password_hash = generate_password_hash(password)
        new_user = User(email=email, name=name, password_hash=password_hash)
        
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': '註冊成功',
            'user': new_user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'註冊失敗: {str(e)}'}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user"""
    try:
        data = request.get_json()
        
        # Validate input
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({'success': False, 'message': '缺少電子郵件或密碼'}), 400
        
        email = data['email']
        password = data['password']
        
        # Find user
        user = User.query.filter_by(email=email).first()
        if not user or not check_password_hash(user.password_hash, password):
            return jsonify({'success': False, 'message': '電子郵件或密碼錯誤'}), 401
        
        # Create JWT token
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'success': True,
            'access_token': access_token,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': f'登入失敗: {str(e)}'}), 500


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Get current user information"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'success': False, 'message': '用戶不存在'}), 404
        
        return jsonify({
            'success': True,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': f'獲取用戶資訊失敗: {str(e)}'}), 500
