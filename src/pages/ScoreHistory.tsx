import React, { useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { historyApi } from '../services/api';
import type { AssessmentHistory } from '../types/api';
import { PixelCard } from '../components/ui/PixelCard';
import { PixelButton } from '../components/ui/PixelButton';

export const ScoreHistory: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [history, setHistory] = useState<AssessmentHistory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await historyApi.getHistory();
                if (response.history) {
                    setHistory(response.history);
                }
            } catch (err) {
                setError('無法載入歷史記錄');
                console.error('Failed to fetch history:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm('確定要刪除這筆記錄嗎？')) return;

        try {
            await historyApi.deleteHistory(id);
            setHistory(history.filter(h => h.id !== id));
        } catch (err) {
            alert('刪除失敗，請稍後再試');
            console.error('Failed to delete history:', err);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-TW', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getLevelColor = (level: string) => {
        if (level === '良好') return 'bg-green-500';
        if (level === '中等') return 'bg-yellow-500';
        return 'bg-red-500';
    };

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-4xl font-bold">分數歷史</h1>
                    <PixelButton onClick={() => navigate('/')} variant="secondary">
                        返回主選單
                    </PixelButton>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <PixelCard className="bg-white text-center py-8">
                        <p className="text-xl">載入中...</p>
                    </PixelCard>
                )}

                {/* Error State */}
                {error && !isLoading && (
                    <PixelCard className="bg-red-100 border-red-500">
                        <p className="text-red-700">{error}</p>
                    </PixelCard>
                )}

                {/* Empty State */}
                {!isLoading && !error && history.length === 0 && (
                    <PixelCard className="bg-white text-center py-12">
                        <div className="text-6xl mb-4">📊</div>
                        <p className="text-xl mb-4">尚無歷史記錄</p>
                        <p className="text-gray-600 mb-6">完成評估後，結果會顯示在這裡</p>
                        <PixelButton onClick={() => navigate('/game/assessment')}>
                            開始評估
                        </PixelButton>
                    </PixelCard>
                )}

                {/* History List */}
                {!isLoading && !error && history.length > 0 && (
                    <>
                        <PixelCard className="bg-white">
                            <h2 className="text-2xl font-bold mb-4">
                                總共 {history.length} 筆記錄
                            </h2>
                        </PixelCard>

                        <div className="space-y-4">
                            {history.map((record) => (
                                <PixelCard key={record.id} className="bg-white">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-4 mb-2">
                                                <div className={`px-4 py-2 ${getLevelColor(record.level)} text-white font-bold border-2 border-black`}>
                                                    {record.level}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {formatDate(record.completed_at)}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-6">
                                                <div>
                                                    <span className="text-3xl font-bold text-purple-600">
                                                        {record.total_score}
                                                    </span>
                                                    <span className="text-gray-600"> / {record.max_score}</span>
                                                </div>

                                                <div className="flex-1 h-8 bg-gray-300 border-2 border-black relative overflow-hidden max-w-md">
                                                    <div
                                                        className={`h-full ${getLevelColor(record.level)} transition-all`}
                                                        style={{ width: `${record.percentage}%` }}
                                                    >
                                                        <div className="h-full w-full bg-[repeating-linear-gradient(90deg,transparent,transparent_4px,rgba(0,0,0,0.1)_4px,rgba(0,0,0,0.1)_8px)]"></div>
                                                    </div>
                                                    <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                                                        {record.percentage}%
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <PixelButton
                                            onClick={() => handleDelete(record.id)}
                                            variant="danger"
                                            className="ml-4"
                                        >
                                            刪除
                                        </PixelButton>
                                    </div>
                                </PixelCard>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
