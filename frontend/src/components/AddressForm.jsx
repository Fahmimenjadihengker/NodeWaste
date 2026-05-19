import { useEffect, useState } from 'react'
import { getDistricts, getProvinces, getRegencies } from '../services/regionApi.js'

const inputClass = 'mt-2 w-full rounded-2xl border border-moss/10 bg-[#f8f4e6] px-4 py-3 font-semibold text-moss outline-none transition focus:border-leaf-600'

function RegionSelect({ label, value, options, disabled, placeholder, onChange }) {
  const selected = findByCode(options, value)
  const listId = `${label.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}-options`
  const [query, setQuery] = useState(selected?.name || '')
  const displayValue = query || selected?.name || ''

  const commitSelection = () => {
    const keyword = query.trim().toLowerCase()
    const option = options.find((item) => item.name.toLowerCase() === keyword)

    if (option) {
      onChange(option.code)
      setQuery(option.name)
      return
    }

    setQuery(selected?.name || '')
  }

  return (
    <label className="block">
      <span className="text-sm font-black text-moss/70">{label}</span>
      <input className={inputClass} list={listId} value={displayValue} disabled={disabled} placeholder={placeholder} onChange={(event) => {
        const nextQuery = event.target.value
        const keyword = nextQuery.trim().toLowerCase()
        const option = options.find((item) => item.name.toLowerCase() === keyword)
        setQuery(nextQuery)
        if (option) onChange(option.code)
      }} onBlur={commitSelection} onKeyDown={(event) => {
        if (event.key === 'Enter') {
          event.preventDefault()
          commitSelection()
        }
      }} />
      <datalist id={listId}>{options.map((option) => <option key={option.code} value={option.name} />)}</datalist>
    </label>
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
