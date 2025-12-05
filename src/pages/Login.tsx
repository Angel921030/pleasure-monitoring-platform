import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PixelCard } from '../components/ui/PixelCard';
import { PixelInput } from '../components/ui/PixelInput';
import { PixelButton } from '../components/ui/PixelButton';

import { Eye, EyeOff } from 'lucide-react';

export const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError('登入失敗，請檢查您的電子郵件和密碼');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-[calc(100vh-100px)]">
            <PixelCard className="w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">LOGIN</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-2 text-sm">Email</label>
                        <PixelInput
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="player@game.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm">Password</label>
                        <PixelInput
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="********"
                            required
                            endIcon={
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="focus:outline-none hover:text-gray-700"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            }
                        />
                    </div>
                    {error && (
                        <div className="bg-red-100 border-2 border-red-500 text-red-700 px-4 py-2 text-sm">
                            {error}
                        </div>
                    )}
                    <PixelButton type="submit" className="w-full mt-4" disabled={isLoading}>
                        {isLoading ? 'LOADING...' : 'START GAME'}
                    </PixelButton>
                </form>
                <p className="mt-4 text-center text-sm">
                    New player?{' '}
                    <Link to="/signup" className="text-blue-600 hover:underline">
                        Create Account
                    </Link>
                </p>
            </PixelCard>
        </div>
    );
};
