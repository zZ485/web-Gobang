function ControlPanel({ onUndo, onResign, onRestart, canUndo, canResign, canRestart }) {
  return (
    <div className="bg-white rounded-xl p-3 md:p-4 shadow-md min-w-[150px] md:min-w-[200px] space-y-2 md:space-y-3">
      <h3 className="text-base md:text-lg font-bold text-text-primary text-center mb-1 md:mb-2">操作</h3>

      <div className="space-y-1.5 md:space-y-2">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`w-full py-2 md:py-2.5 px-3 md:px-4 rounded-lg font-medium transition-all text-sm md:text-base ${
            canUndo
              ? 'bg-white-piece border-2 border-text-primary text-text-primary hover:bg-gray-100'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200'
          }`}
        >
          悔棋
        </button>

        <button
          onClick={onResign}
          disabled={!canResign}
          className={`w-full py-2 md:py-2.5 px-3 md:px-4 rounded-lg font-medium transition-all text-sm md:text-base ${
            canResign
              ? 'bg-red-50 border-2 border-red-200 text-red-600 hover:bg-red-100'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200'
          }`}
        >
          认输
        </button>

        <button
          onClick={onRestart}
          disabled={!canRestart}
          className={`w-full py-2 md:py-2.5 px-3 md:px-4 rounded-lg font-medium transition-all text-sm md:text-base ${
            canRestart
              ? 'bg-highlight hover:bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          重新开始
        </button>
      </div>

      <div className="mt-3 md:mt-4 pt-2 md:pt-3 border-t border-gray-200">
        <div className="text-[10px] md:text-xs text-text-secondary text-center space-y-0.5 md:space-y-1">
          <p>• 先落子者执黑棋</p>
          <p>• 五子连珠获胜</p>
        </div>
      </div>
    </div>
  );
}

export default ControlPanel;
