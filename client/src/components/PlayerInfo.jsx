function PlayerInfo({ name, color, isCurrentPlayer, isMe }) {
  const isBlack = color === 1;

  return (
    <div
      className={`bg-white rounded-xl p-3 md:p-4 min-w-[150px] md:min-w-[200px] shadow-md transition-all ${
        isCurrentPlayer ? 'ring-2 ring-highlight' : ''
      } ${isMe ? 'opacity-100' : 'opacity-80'}`}
    >
      <div className="flex items-center gap-2 md:gap-3">
        {/* 棋子指示 */}
        <div
          className={`w-6 h-6 md:w-8 md:h-8 rounded-full piece-shadow ${
            isBlack ? 'bg-black-piece' : 'bg-white-piece border-2 border-gray-300'
          }`}
        />

        {/* 玩家信息 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 md:gap-2">
            <span className="font-medium text-text-primary text-sm md:text-base truncate">{name}</span>
            {isMe && (
              <span className="text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 bg-highlight text-white rounded-full whitespace-nowrap">
                你
              </span>
            )}
          </div>
          <div className="text-xs md:text-sm text-text-secondary mt-0.5">
            {isBlack ? '黑棋' : '白棋'}
          </div>
        </div>

        {/* 当前回合指示 */}
        {isCurrentPlayer && (
          <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-highlight rounded-full animate-pulse flex-shrink-0" />
        )}
      </div>

      {isCurrentPlayer && (
        <div className="mt-2 md:mt-3 text-[10px] md:text-xs text-highlight font-medium">
          轮到你落子
        </div>
      )}
    </div>
  );
}

export default PlayerInfo;
