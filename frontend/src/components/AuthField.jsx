function AuthField({ label, name, type = 'text', value, onChange, placeholder, minLength }) {
  return (
    <label className="block">
      <span className="text-sm font-black text-moss">{label}</span>
      <input
        className="mt-2 w-full rounded-2xl border border-moss/15 bg-white px-4 py-3 font-semibold outline-none transition placeholder:text-moss/35 focus:border-leaf-600"
        minLength={minLength}
        name={name}
        placeholder={placeholder}
        required
        type={type}
        value={value}
        onChange={onChange}
      />
    </label>
  )
}

export default AuthField
