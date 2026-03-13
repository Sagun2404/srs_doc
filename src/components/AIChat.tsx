import React from 'react';
import { MessageSquare, Send, Sparkles, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { motion } from 'motion/react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface AIChatProps {
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

export const AIChat: React.FC<AIChatProps> = ({ isCollapsed, onToggleCollapse }) => {
    const [messages, setMessages] = React.useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: 'Hi! I\'m your AI assistant for SRS documents. I can help you write, explain, or improve your software requirements. How can I help you today?',
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = React.useState('');

    const handleSendMessage = () => {
        if (!inputValue.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');

        // Simulate AI response (placeholder)
        setTimeout(() => {
            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'This is a placeholder response. The AI chat feature is coming soon!',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiMessage]);
        }, 500);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <motion.div
            initial={false}
            animate={{ width: isCollapsed ? '64px' : '320px' }}
            className="h-full border-l border-zinc-200 bg-white flex flex-col overflow-hidden relative"
        >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-sage-teal to-teal-500 text-white flex items-center min-h-[60px]">
                <button
                    onClick={onToggleCollapse}
                    className="p-1.5 hover:bg-white/20 rounded-lg transition-colors text-zinc-500"
                >
                    {isCollapsed ? <PanelRightOpen size={18} /> : <PanelRightClose size={18} />}
                </button>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isCollapsed ? 0 : 1 }}
                    className="flex items-center gap-2"
                >

                    <span className="font-semibold">Sage</span>
                </motion.div>
            </div>

            {/* Messages - only show when expanded */}
            {!isCollapsed && (
                <>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] p-3 rounded-xl ${message.role === 'user'
                                        ? 'bg-emerald-500 text-white rounded-br-md'
                                        : 'bg-white border border-zinc-200 text-zinc-800 rounded-bl-md shadow-sm'
                                        }`}
                                >
                                    <p className="text-sm">{message.content}</p>
                                    <span className={`text-[10px] mt-1 block ${message.role === 'user' ? 'text-emerald-100' : 'text-zinc-400'
                                        }`}>
                                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <div className="p-3 bg-white border-t border-zinc-200">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your message..."
                                className="flex-1 px-4 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!inputValue.trim()}
                                className="p-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Collapsed state - show icon only */}
            {isCollapsed && (
                <div className="flex-1 flex items-center justify-center">
                    <Sparkles size={24} className="text-emerald-400 animate-pulse" />
                </div>
            )}
        </motion.div>
    );
};
