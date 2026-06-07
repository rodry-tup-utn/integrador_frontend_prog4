import { useState, type ChangeEvent } from "react";

export const useForm = <T extends Object>(initialState: T) => {
  const [formState, setFormState] = useState(initialState);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormState(initialState);
  };

  return {
    formState,
    handleChange,
    resetForm,
  };
};
