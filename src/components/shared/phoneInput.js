import React from "react";
import { PhoneInputField } from "./inputs";

export default function PhoneInput({ register, errors, setValue }) {
  const [phone, setPhone] = React.useState("");

  const handleChange = (newPhone) => {
    setPhone(newPhone);
    if (newPhone.trim().length > 0) {
      setValue("phone_number", newPhone.replace(/\s+/g, ""));
    }
  };

  return (
    <PhoneInputField
      value={phone}
      onChange={handleChange}
      label="Phone number"
      error={errors.phone_number ? true : false}
      helperText={errors.phone_number ? errors.phone_number?.message : null}
      fullWidth
      placeholder="+000 00 0000 000"
    />
  );
}
