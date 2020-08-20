import React from 'react'
import './Input.css'

export const Input = ({
	label,
	inputId,
	type,
	name,
	value,
	onChange,
	maxLength,
	placeholder
}) => {
	return (
		<div className="Input">
			<label htmlFor={name}>{label}</label>
			<input
				id={inputId}
				type={type}
				name={name}
				value={value}
				onChange={onChange}
				maxLength={maxLength}
				placeholder={placeholder}
			/>
		</div>
	)
}
