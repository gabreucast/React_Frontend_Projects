// CountrySelector.jsx
// 🇧🇷 Seletor de país com react-select (ES/US/BR)

import { useMemo, useState } from 'react';
import Select, { components } from 'react-select';

/* ⚠️ Certifique-se de que os arquivos existem nestes caminhos:
   src/assets/flags/flag-espanhol.png
   src/assets/flags/flag-eeuu.png
   src/assets/flags/flag-portugues.png
*/
import esFlag from '../assets/flags/flag-espanhol.png';
import usFlag from '../assets/flags/flag-eeuu.png';
import brFlag from '../assets/flags/flag-portugues.png';

/* Opções com bandeira + rótulo */
const COUNTRY_OPTIONS = [
  { value: 'ES', label: 'ESPAÑA', flag: esFlag },
  { value: 'US', label: 'ESTADOS UNIDOS', flag: usFlag },
  { value: 'BR', label: 'BRASIL', flag: brFlag },
];

/* Opção no menu (mostra bandeira + texto) */
const Option = (props) => (
  <components.Option {...props}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <img src={props.data.flag} alt="" width={18} height={18} />
      <span>{props.data.label}</span>
    </div>
  </components.Option>
);

/* Valor selecionado (mostra bandeira + texto) */
const SingleValue = (props) => (
  <components.SingleValue {...props}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <img src={props.data.flag} alt="" width={18} height={18} />
      <span>{props.data.label}</span>
    </div>
  </components.SingleValue>
);

export default function CountrySelector() {
  const [country, setCountry] = useState(COUNTRY_OPTIONS[0]);

  /* Estilos do react-select usando variáveis globais */
  const styles = useMemo(
    () => ({
      control: (base, state) => ({
        ...base,
        minHeight: 44,
        borderRadius: 12,
        borderColor: state.isFocused ? 'var(--lenovo-red)' : 'var(--lenovo-gray)',
        boxShadow: state.isFocused ? '0 0 0 1px var(--lenovo-red)' : 'none',
        '&:hover': { borderColor: 'var(--lenovo-red)' },
        backgroundColor: 'var(--white)',
      }),
      valueContainer: (base) => ({ ...base, padding: '6px 12px' }),
      placeholder: (base) => ({ ...base, color: 'var(--muted)' }),
      dropdownIndicator: (base) => ({ ...base, color: 'var(--black)' }),
      menu: (base) => ({
        ...base,
        border: '1px solid var(--lenovo-gray)',
        borderRadius: 12,
        overflow: 'hidden',
        zIndex: 20,
      }),
      menuList: (base) => ({ ...base, maxHeight: 240 }),
      option: (base, state) => ({
        ...base,
        backgroundColor: state.isSelected
          ? 'rgba(225, 37, 27, 0.08)'
          : state.isFocused
          ? 'var(--lenovo-light-gray)'
          : 'var(--white)',
        color: 'var(--black)',
        padding: '10px 12px',
        cursor: 'pointer',
      }),
      singleValue: (base) => ({ ...base, color: 'var(--black)', fontWeight: 600 }),
    }),
    []
  );

  return (
    <div className="country-select-wrap">
      <label className="country-label">Selecionar País/Região:</label>
      <Select
        inputId="country-select"
        instanceId="country-select"
        options={COUNTRY_OPTIONS}
        value={country}
        onChange={setCountry}
        components={{ Option, SingleValue }}
        styles={styles}
        isSearchable
        menuPlacement="auto"
        placeholder="País"
      />
    </div>
  );
}
