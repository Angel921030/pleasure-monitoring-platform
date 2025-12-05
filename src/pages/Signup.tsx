import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PixelCard } from '../components/ui/PixelCard';
import { PixelInput } from '../components/ui/PixelInput';
import { PixelButton } from '../components/ui/PixelButton';

export const Signup: React.FC = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('兩次輸入的密碼不一致');
            return;
        }

        setIsLoading(true);

        try {
            await signup(email, name, password);
            navigate('/');
        } catch (err) {
            setError('註冊失敗，此電子郵件可能已被使用');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-[calc(100vh-100px)]">
            <PixelCard className="w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">NEW GAME</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-2 text-sm">Player Name</label>
                        <PixelInput
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Player 1"
                            required
                        />
                    </div>
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
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="********"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm">Confirm Password</label>
                        <PixelInput
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="********"
                            required
                        />
                    </div>
                    {error && (
                        <div className="bg-red-100 border-2 border-red-500 text-red-700 px-4 py-2 text-sm">
                            {error}
                        </div>
                    )}
                    <PixelButton type="submit" className="w-full mt-4" disabled={isLoading}>
                        {isLoading ? 'LOADING...' : 'CREATE ACCOUNT'}
                    </PixelButton>
                </form>
                <p className="mt-4 text-center text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Login
                    </Link>
                </p>
            </PixelCard>
        </div>
    );
};
