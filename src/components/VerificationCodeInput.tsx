import React, { useRef, ChangeEvent, SetStateAction, Dispatch } from 'react'
import { TextField, Grid } from '@mui/material'

interface VerificationCodeInputProps {
  setCodes: Dispatch<SetStateAction<string[]>>
  codes: string[]
  setError: Dispatch<SetStateAction<boolean>>
}

const VerificationCodeInput: React.FC<VerificationCodeInputProps> = ({
  setCodes,
  codes,
  setError,
}) => {
  const inputsRef = useRef<HTMLInputElement[]>(Array(length).fill(null))

  const handleChange = (index: number, value: string) => {
    const newValue = value.slice(0, 1)
    const newCodes = [...codes]
    newCodes[index] = newValue
    setCodes(newCodes)

    if (newValue && index < length - 1) {
      inputsRef.current[index + 1].focus()
    }
  }

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Backspace' && index > 0 && !codes[index]) {
      inputsRef.current[index - 1].focus()
    } else if (/^\d$/.test(e.key) && index < 5 && codes[index]) {
      inputsRef.current[index + 1].focus()
    }
  }

  const handleFocus = () => {
    setError(false)
  }

  const renderInputs = () => {
    return codes.map((code, index) => (
      <Grid item key={index}>
        <TextField
          inputRef={el => (inputsRef.current[index] = el)}
          type="text"
          variant="outlined"
          value={code}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            handleChange(index, e.target.value)
          }}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            handleKeyDown(index, e)
          }}
          inputProps={{
            style: {
              textAlign: 'center',
              width: 40,
            },
          }}
          onFocus={handleFocus}
        />
      </Grid>
    ))
  }

  return (
    <Grid container spacing={1} justifyContent="center">
      {renderInputs()}
    </Grid>
  )
}

export default VerificationCodeInput
