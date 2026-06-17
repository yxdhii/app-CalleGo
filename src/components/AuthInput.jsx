function AuthInput({
  icon,
  type = "text",
  placeholder,
  rightIcon,
  value,
  onChange,
}) {
  return (
    <div className="auth-input">
      <span className="input-icon">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {rightIcon && <span className="input-right-icon">{rightIcon}</span>}
    </div>
  );
}

export default AuthInput;
