const EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "😡"];

const ReactionPicker = ({ onSelect }) => {
  return (
    <div className="flex gap-1 bg-slate-800 px-2 py-1 rounded-full shadow">
      {EMOJIS.map((emoji) => (
        <button
          key={emoji}
          onClick={() => onSelect(emoji)}
          className="hover:scale-125 transition text-sm"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};

export default ReactionPicker;
