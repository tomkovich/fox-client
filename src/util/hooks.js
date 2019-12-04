import { useState } from "react";

export const useForm = (callback, initialState = {}) => {
  const [values, setValues] = useState(initialState);

  let changeInput = e => {
    setValues({
      ...values,
      [e.target.name]: e.target.value
    });
  };

  let formSubmit = e => {
    e.preventDefault();
    callback();
  };

  return {
    changeInput,
    formSubmit,
    values
  };
};
