import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PlayerInfo } from '../components/PlayerInfo';
import { MenuCard } from '../components/ui/MenuCard';

export const GameMenu: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const menuItems = [
        {
            title: '開始遊戲',
            description: '進行失樂感評估測驗',
            icon: '🎮',
            onClick: () => {
                navigate('/game/assessment');
            },
        },
        {
            title: '寫日記',
            description: '記錄今天的心情',
            icon: '📝',
            onClick: () => {
                // TODO: Navigate to diary
                console.log('Opening diary...');
            },
        },
        {
            title: '分數歷史',
            description: '查看過往測驗結果',
            icon: '📊',
            onClick: () => {
                navigate('/history');
            },
        },
        {
            title: '設定',
            description: '個人資料與偏好設定',
            icon: '⚙️',
            onClick: () => {
                // TODO: Navigate to settings
                console.log('Opening settings...');
            },
        },
    ];

    return (
        <div className="min-h-[calc(100vh-100px)] py-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Page Title */}
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-2">主選單</h1>
                    <p className="text-lg opacity-80">選擇您想要進行的活動</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Player Info */}
                    <div className="lg:col-span-1">
                        <PlayerInfo />
                    </div>

                    {/* Right Column - Menu Grid */}
                    <div className="lg:col-span-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {menuItems.map((item, index) => (
                                <MenuCard
                                    key={index}
                                    title={item.title}
                                    description={item.description}
                                    icon={item.icon}
                                    onClick={item.onClick}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Additional Info Section */}
                <div className="mt-8 p-6 bg-yellow-100 border-4 border-yellow-600">
                    <div className="flex items-start space-x-4">
                        <div className="text-3xl">💡</div>
                        <div>
                            <h3 className="font-bold text-lg mb-1">每日提醒</h3>
                            <p className="text-sm opacity-90">
                                記得每天花幾分鐘記錄心情，持續追蹤能幫助您更了解自己的情緒變化！
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
