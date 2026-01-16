function ScoreBoard({ scores }) {
  return (
    <div className="bg-white rounded-xl p-3 md:p-4 shadow-md min-w-[150px] md:min-w-[200px]">
      <h3 className="text-base md:text-lg font-bold text-text-primary mb-2 md:mb-3 text-center">比分</h3>

      <div className="space-y-2 md:space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 md:w-4 md:h-4 rounded-full bg-black-piece" />
            <span className="text-xs md:text-sm text-text-primary">黑棋</span>
          </div>
          <span className="text-xl md:text-2xl font-bold text-text-primary">{scores.black}</span>
        </div>

        <div className="border-t border-gray-200" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 md:w-4 md:h-4 rounded-full bg-white-piece border-2 border-gray-300" />
            <span className="text-xs md:text-sm text-text-primary">白棋</span>
          </div>
          <span className="text-xl md:text-2xl font-bold text-text-primary">{scores.white}</span>
        </div>
      </div>
    </div>
  );
}

export default ScoreBoard;
