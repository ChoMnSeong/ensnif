import { useCallback, useState } from "react";

type InputOnChangeProps =
  | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  | React.MouseEvent<HTMLInputElement, MouseEvent>;

export default function useInput<T>(initialForm: T) {
  const [form, setForm] = useState<T>(initialForm);
  const onChange = useCallback((e: InputOnChangeProps) => {
    const { name, value } = e.currentTarget;
    if (typeof initialForm === "object") {
      setForm((form) => ({ ...form, [name]: value }));
    } else {
      setForm(value as T);
    }
  }, [initialForm]);
  return { form, onChange, setForm };
}
