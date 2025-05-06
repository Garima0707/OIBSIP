import React from "react";

const AuthForm = ({ formType, formData, setFormData, onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      {formType === "register" && (
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      )}
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
      />
      <button type="submit">{formType === "register" ? "Register" : "Login"}</button>
    </form>
  );
};

export default AuthForm;
