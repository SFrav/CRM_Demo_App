'use client'

import { useState } from 'react'
import { parsePhoneNumber, CountryCode } from 'libphonenumber-js'

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  required?: boolean
}

const countries = [
  { code: 'US' as CountryCode, name: 'United States', flag: '🇺🇸', dialCode: '+1' },
  { code: 'GB' as CountryCode, name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44' },
  { code: 'CA' as CountryCode, name: 'Canada', flag: '🇨🇦', dialCode: '+1' },
  { code: 'AU' as CountryCode, name: 'Australia', flag: '🇦🇺', dialCode: '+61' },
  { code: 'DE' as CountryCode, name: 'Germany', flag: '🇩🇪', dialCode: '+49' },
  { code: 'FR' as CountryCode, name: 'France', flag: '🇫🇷', dialCode: '+33' },
  { code: 'IN' as CountryCode, name: 'India', flag: '🇮🇳', dialCode: '+91' },
  { code: 'JP' as CountryCode, name: 'Japan', flag: '🇯🇵', dialCode: '+81' },
]

export default function PhoneInput({ value, onChange, placeholder = "Enter phone number", className = "", required = false }: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>('US')
  const [isOpen, setIsOpen] = useState(false)

  const handlePhoneChange = (phoneNumber: string) => {
    try {
      const parsed = parsePhoneNumber(phoneNumber, selectedCountry)
      if (parsed) {
        onChange(parsed.formatInternational())
      } else {
        onChange(phoneNumber)
      }
    } catch {
      onChange(phoneNumber)
    }
  }

  const selectedCountryData = countries.find(c => c.code === selectedCountry) || countries[0]

  return (
    <div className="relative">
      <div className="flex">
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center px-3 py-2 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <span className="mr-2">{selectedCountryData.flag}</span>
            <span className="text-sm text-gray-600">{selectedCountryData.dialCode}</span>
            <svg className="w-4 h-4 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isOpen && (
            <div className="absolute top-full left-0 z-10 w-64 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {countries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => {
                    setSelectedCountry(country.code)
                    setIsOpen(false)
                  }}
                  className="flex items-center w-full px-3 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                >
                  <span className="mr-3">{country.flag}</span>
                  <span className="flex-1 text-sm">{country.name}</span>
                  <span className="text-sm text-gray-500">{country.dialCode}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        
        <input
          type="tel"
          value={value}
          onChange={(e) => handlePhoneChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={`flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${className}`}
        />
      </div>
    </div>
  )
}