"use client";

type Option<T extends string> = { value: T; label: string };

export function ChoiceGroup<T extends string>({
  legend,
  name,
  value,
  options,
  onChange,
  error,
}: {
  legend: string;
  name: string;
  value: T | "";
  options: Option<T>[];
  onChange: (value: T) => void;
  error?: boolean;
}) {
  return (
    <fieldset
      className={`rounded-[24px] bg-white p-4 shadow-[0_10px_30px_rgba(28,42,42,0.05)] ${
        error ? "ring-2 ring-terracotta-600" : ""
      }`}
    >
      <legend className="px-1 text-base font-semibold text-ink-900">{legend}</legend>
      <div className="mt-3 grid gap-2">
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <label
              key={option.value}
              className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium ${
                selected
                  ? "border-teal-800 bg-teal-50 text-teal-900"
                  : "border-cream-200 bg-cream-50 text-ink-800"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={selected}
                onChange={() => onChange(option.value)}
                className="h-4 w-4 accent-teal-800"
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
