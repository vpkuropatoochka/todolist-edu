type FieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "password";
  maxLength?: number;
  disabled?: boolean;
  autoFocus?: boolean;
  autoComplete?: string;
};

export function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  maxLength,
  disabled,
  autoFocus,
  autoComplete,
}: FieldProps) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        className="text-input"
        maxLength={maxLength}
        disabled={disabled}
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
