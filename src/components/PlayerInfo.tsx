import React from 'react';
import { useAuth } from '../context/AuthContext';
import { PixelCard } from './ui/PixelCard';
import { PixelButton } from './ui/PixelButton';

export const PlayerInfo: React.FC = () => {
    const { user, logout } = useAuth();

    if (!user) return null;

    const level = 5;
    const currentXP = 350;
    const maxXP = 500;
    const xpPercentage = (currentXP / maxXP) * 100;

    return (
        <PixelCard className="bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="space-y-4">
                {/* Welcome Header */}
                <div className="text-center border-b-4 border-black pb-4">
                    <h2 className="text-2xl font-bold mb-2">歡迎回來！</h2>
                    <p className="text-xl">{user.name}</p>
                </div>

                {/* Level and XP */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-bold">等級 {level}</span>
                        <span className="text-sm opacity-80">
                            {currentXP} / {maxXP} XP
                        </span>
                    </div>

                    {/* XP Progress Bar */}
                    <div className="h-8 bg-gray-300 border-4 border-black relative overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500"
                            style={{ width: `${xpPercentage}%` }}
                        >
                            <div className="h-full w-full bg-[repeating-linear-gradient(90deg,transparent,transparent_4px,rgba(0,0,0,0.1)_4px,rgba(0,0,0,0.1)_8px)]"></div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-white border-2 border-black p-2">
                        <div className="text-2xl font-bold">12</div>
                        <div className="text-xs opacity-80">遊戲次數</div>
                    </div>
                    <div className="bg-white border-2 border-black p-2">
                        <div className="text-2xl font-bold">8</div>
                        <div className="text-xs opacity-80">日記條目</div>
                    </div>
                    <div className="bg-white border-2 border-black p-2">
                        <div className="text-2xl font-bold">5</div>
                        <div className="text-xs opacity-80">連續登入</div>
                    </div>
                </div>

                {/* Logout Button */}
                <PixelButton onClick={logout} variant="danger" className="w-full">
                    登出
                </PixelButton>
            </div>
        </PixelCard>
    );
};
