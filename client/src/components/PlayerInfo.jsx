function PlayerInfo({ name, color, isCurrentPlayer, isMe }) {
  const isBlack = color === 1;

  return (
    <div
      className={`bg-white rounded-xl p-4 min-w-[200px] shadow-md transition-all ${
        isCurrentPlayer ? 'ring-2 ring-highlight' : ''
      } ${isMe ? 'opacity-100' : 'opacity-80'}`}
    >
      <div className="flex items-center gap-3">
        {/* 棋子指示 */}
        <div
          className={`w-8 h-8 rounded-full piece-shadow ${
            isBlack ? 'bg-black-piece' : 'bg-white-piece border-2 border-gray-300'
          }`}
        />

        {/* 玩家信息 */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-text-primary">{name}</span>
            {isMe && (
              <span className="text-xs px-2 py-0.5 bg-highlight text-white rounded-full">
                你
              </span>
            )}
          </div>
          <div className="text-sm text-text-secondary mt-0.5">
            {isBlack ? '黑棋' : '白棋'}
          </div>
        </div>

        {/* 当前回合指示 */}
        {isCurrentPlayer && (
          <div className="w-3 h-3 bg-highlight rounded-full animate-pulse" />
        )}
      </div>

      {isCurrentPlayer && (
        <div className="mt-3 text-xs text-highlight font-medium">
          轮到你落子
        </div>
      )}
    </div>
  );
}

export default PlayerInfo;
