import { useState } from 'react'
import * as React from 'react'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { TextField } from '@mui/material'
import styles from './dropdown.module.scss'
export type CategoryDropdownProps = {
  value: string
  handler: (value: string) => void
  updateNewCategory: (value: string) => void
  categoryList: string[]
}

export function CategoryDropDown({
  value,
  handler,
  updateNewCategory,
  categoryList
}: CategoryDropdownProps) {
  const [selected, setSelected] = useState<string>(value)
  const [newCategory, setNewCategory] = useState<string>('')
  const onChangeHandler = (value: string) => {
    if (value === '+') {
      handler(value)
      setNewCategory('')
    } else {
      handler(value)
    }
    setSelected(value)
  }

  return (
    <>
      <div className={styles.container}>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel>Category</InputLabel>
          <Select
            label="Category"
            value={selected}
            onChange={(e: SelectChangeEvent<string>) =>
              onChangeHandler(e.target.value as string)
            }>
            {categoryList.map((category: string) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
            <MenuItem key="new" value={'+'}>
              +
            </MenuItem>
          </Select>
        </FormControl>
        {selected === '+' && (
          <div>
            <TextField
              label={'New Category'}
              style={{
                width: '100%'
              }}
              value={newCategory}
              size="small"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setNewCategory(e.target.value)
                updateNewCategory(e.target.value)
              }}
            />
          </div>
        )}
      </div>
    </>
  )
}
