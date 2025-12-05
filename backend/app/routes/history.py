from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import db, AssessmentHistory, User
import json

history_bp = Blueprint('history', __name__)

@history_bp.route('', methods=['GET'])
@jwt_required()
def get_history():
    """Get user's assessment history"""
    try:
        current_user_id = get_jwt_identity()
        
        # Get all history for current user, ordered by date (newest first)
        histories = AssessmentHistory.query.filter_by(user_id=current_user_id)\
            .order_by(AssessmentHistory.completed_at.desc()).all()
        
        return jsonify({
            'success': True,
            'history': [h.to_dict() for h in histories]
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': f'獲取歷史記錄失敗: {str(e)}'}), 500


@history_bp.route('', methods=['POST'])
@jwt_required()
def save_history():
    """Save new assessment result"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate input
        if not data or not all(key in data for key in ['total_score', 'max_score', 'level', 'answers']):
            return jsonify({'success': False, 'message': '缺少必要欄位'}), 400
        
        # Create new history record
        new_history = AssessmentHistory(
            user_id=current_user_id,
            total_score=data['total_score'],
            max_score=data['max_score'],
            level=data['level'],
            answers=json.dumps(data['answers'], ensure_ascii=False)
        )
        
        db.session.add(new_history)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'history_id': new_history.id,
            'message': '評估結果已保存'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'保存失敗: {str(e)}'}), 500


@history_bp.route('/<int:history_id>', methods=['DELETE'])
@jwt_required()
def delete_history(history_id):
    """Delete a specific history record"""
    try:
        current_user_id = get_jwt_identity()
        
        # Find history record
        history = AssessmentHistory.query.get(history_id)
        
        if not history:
            return jsonify({'success': False, 'message': '記錄不存在'}), 404
        
        # Check if the history belongs to the current user
        if history.user_id != current_user_id:
            return jsonify({'success': False, 'message': '無權限刪除此記錄'}), 403
        
        db.session.delete(history)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': '記錄已刪除'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'刪除失敗: {str(e)}'}), 500
