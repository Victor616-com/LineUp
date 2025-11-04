/* Exampple use 
<InputField
  label="Enter your name" // You can optionally provide a label
  placeholder="Enter your name"
  value={name}
  onChange={setName}
/>
*/
const InputField = ({
  value,
  onChange,
  label,
  placeholder = "",
  className = "",
  type = "text",
}) => {
  return (
    <div className="flex flex-col gap-xxs w-full">
      {label && <label className="text-m">{label}</label>}

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`border border-[#b7b7b7] w-full rounded-lg px-xs py-xs outline-none text-m text-center ${className}`}
      />
    </div>
  );
};

export default InputField;
