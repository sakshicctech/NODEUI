// Checkbox.js
const Checkbox = ({ label, checked, onChange }) => {
  return (
    <label className="flex items-center gap-2 p-3 bg-white rounded-lg shadow-md cursor-pointer hover:bg-gray-100 transition-colors">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="form-checkbox w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
      />
      <span className="text-sm font-medium">{label}</span>
    </label>
  );
};

export default Checkbox;
