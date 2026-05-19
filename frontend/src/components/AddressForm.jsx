import { useEffect, useState } from 'react'
import { getDistricts, getProvinces, getRegencies } from '../services/regionApi.js'

const inputClass = 'mt-2 w-full rounded-2xl border border-moss/10 bg-[#f8f4e6] px-4 py-3 font-semibold text-moss outline-none transition focus:border-leaf-600'

function RegionSelect({ label, value, options, disabled, placeholder, onChange }) {
  const selected = findByCode(options, value)
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const displayValue = isEditing ? query : selected?.name || ''
  const filteredOptions = options.filter((option) => option.name.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 12)

  const commitSelection = () => {
    const keyword = query.trim().toLowerCase()
    const option = options.find((item) => item.name.toLowerCase() === keyword)

    if (option) {
      onChange(option.code)
      setQuery(option.name)
      setIsEditing(false)
      return
    }

    setQuery('')
    setIsEditing(false)
  }

  const selectOption = (option) => {
    setQuery(option.name)
    setIsEditing(false)
    setIsOpen(false)
    onChange(option.code)
  }

  return (
    <div className="relative">
      <label className="block">
        <span className="text-sm font-black text-moss/70">{label}</span>
        <div className="relative">
          <input className={`${inputClass} pr-12`} value={displayValue} disabled={disabled} placeholder={placeholder} onFocus={() => {
            setIsEditing(true)
            setQuery(selected?.name || '')
            setIsOpen(true)
          }} onChange={(event) => {
            setIsEditing(true)
            setQuery(event.target.value)
            setIsOpen(true)
          }} onBlur={() => {
            window.setTimeout(() => {
              setIsOpen(false)
              commitSelection()
            }, 120)
          }} onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              if (filteredOptions[0]) selectOption(filteredOptions[0])
              else commitSelection()
            }
            if (event.key === 'Escape') {
              setIsOpen(false)
              setQuery('')
              setIsEditing(false)
            }
          }} />
          <button className="absolute bottom-0 right-0 top-2 grid w-12 place-items-center rounded-r-2xl text-moss/70 disabled:opacity-40" type="button" disabled={disabled} onMouseDown={(event) => event.preventDefault()} onClick={() => setIsOpen((current) => !current)} aria-label={`Buka pilihan ${label}`}>
            <span className={`text-lg transition ${isOpen ? 'rotate-180' : ''}`}>⌄</span>
          </button>
        </div>
      </label>
      {isOpen && !disabled ? (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-64 overflow-y-auto rounded-[1.1rem] border border-moss/25 bg-white py-2 shadow-[0_18px_40px_rgba(32,58,37,0.16)]">
          {filteredOptions.length ? filteredOptions.map((option) => (
            <button key={option.code} className={`block w-full px-5 py-3 text-left text-base font-semibold transition ${option.code === value ? 'bg-[#dce8cf] text-leaf-900' : 'text-moss hover:bg-moss/20'}`} type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => selectOption(option)}>
              {option.name}
            </button>
          )) : <p className="px-5 py-3 text-sm font-semibold text-moss/55">Tidak ada pilihan.</p>}
        </div>
      ) : null}
    </div>
  )
}

function findByCode(options, code) {
  return options.find((option) => option.code === code) || null
}

function AddressForm({ value, onChange, title = 'Alamat rumah', heading = 'Titik pickup driver', description = 'Pilih wilayah dari wilayah.id agar data alamat valid.' }) {
  const [provinces, setProvinces] = useState([])
  const [regencies, setRegencies] = useState([])
  const [districts, setDistricts] = useState([])
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    let isMounted = true

    getProvinces()
      .then((items) => {
        if (isMounted) setProvinces(items)
      })
      .catch((error) => {
        if (isMounted) setFeedback(error.message)
      })

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    getRegencies(value.provinceCode)
      .then((items) => {
        if (isMounted) setRegencies(items)
      })
      .catch((error) => {
        if (isMounted) setFeedback(error.message)
      })

    return () => {
      isMounted = false
    }
  }, [value.provinceCode])

  useEffect(() => {
    let isMounted = true

    getDistricts(value.cityCode)
      .then((items) => {
        if (isMounted) setDistricts(items)
      })
      .catch((error) => {
        if (isMounted) setFeedback(error.message)
      })

    return () => {
      isMounted = false
    }
  }, [value.cityCode])

  const updateValue = (updates) => onChange({ ...value, ...updates })

  const handleProvinceChange = (provinceCode) => {
    const province = findByCode(provinces, provinceCode)
    updateValue({ provinceCode, province: province?.name || '', cityCode: '', city: '', districtCode: '', districtName: '' })
  }

  const handleCityChange = (cityCode) => {
    const city = findByCode(regencies, cityCode)
    updateValue({ cityCode, city: city?.name || '', districtCode: '', districtName: '' })
  }

  const handleDistrictChange = (districtCode) => {
    const district = findByCode(districts, districtCode)
    updateValue({ districtCode, districtName: district?.name || '' })
  }

  return (
    <div>
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-moss/45">{title}</p>
        <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-leaf-900">{heading}</h2>
        <p className="mt-2 text-sm leading-6 text-moss/65">{description}</p>
        {feedback ? <p className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-800">{feedback}</p> : null}
      </div>

      <div className="mt-6 grid gap-4">
        <label className="block">
          <span className="text-sm font-black text-moss/70">Alamat lengkap</span>
          <input className={inputClass} value={value.address} onChange={(event) => updateValue({ address: event.target.value })} />
        </label>
        <RegionSelect key={`province-${value.provinceCode || 'empty'}`} label="Provinsi" value={value.provinceCode} options={provinces} placeholder="Pilih provinsi" onChange={handleProvinceChange} />
        <RegionSelect key={`city-${value.provinceCode || 'empty'}-${value.cityCode || 'empty'}`} label="Kabupaten/kota" value={value.cityCode} options={regencies} placeholder="Pilih kabupaten/kota" disabled={!value.provinceCode} onChange={handleCityChange} />
        <RegionSelect key={`district-${value.cityCode || 'empty'}-${value.districtCode || 'empty'}`} label="Kecamatan" value={value.districtCode} options={districts} placeholder="Pilih kecamatan" disabled={!value.cityCode} onChange={handleDistrictChange} />
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-black text-moss/70">Latitude</span>
            <input className={inputClass} inputMode="decimal" value={value.latitude} onChange={(event) => updateValue({ latitude: event.target.value })} />
          </label>
          <label className="block">
            <span className="text-sm font-black text-moss/70">Longitude</span>
            <input className={inputClass} inputMode="decimal" value={value.longitude} onChange={(event) => updateValue({ longitude: event.target.value })} />
          </label>
        </div>
      </div>
    </div>
  )
}

export default AddressForm
