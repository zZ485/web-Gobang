import { useState } from 'react';

function NameInput({ onJoin }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onJoin(name.trim());
    }
  };

  return (
    <div className="min-h-screen bg-primary-bg flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-5 md:p-8 w-full max-w-md">
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-1 md:mb-2 text-center">五子棋</h1>
        <p className="text-sm md:text-base text-text-secondary text-center mb-5 md:mb-8">输入昵称加入游戏</p>

        <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
          <div>
            <label className="block text-xs md:text-sm font-medium text-text-primary mb-1.5 md:mb-2">
              昵称
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入你的昵称"
              maxLength={10}
              className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-highlight focus:border-transparent outline-none transition-all text-sm md:text-base text-text-primary"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full py-2.5 md:py-3 px-4 md:px-6 bg-highlight hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors text-sm md:text-base"
          >
            加入游戏
          </button>
        </form>

        <div className="mt-4 md:mt-6 text-center text-xs md:text-sm text-text-secondary">
          <p className="mb-1 md:mb-2">游戏规则：</p>
          <ul className="text-left space-y-0.5 md:space-y-1 px-2">
            <li>• 两人在线对战，黑棋先行</li>
            <li>• 五子连珠获胜</li>
            <li>• 支持悔棋和认输</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default NameInput;
