import { useEffect, useState } from 'react'
import { IApi, TYPES } from 'apiClient/interface'
import useApi from 'context/hook'

import styles from './styles.module.scss'

const CategoryButton = ({
  category,
  onClick
}: {
  category: string
  onClick: () => void
}) => {
  const onClickHandler = onClick
  return (
    <button className={styles.categoryButton} onClick={onClickHandler}>
      <div className={styles.categoryName}>
        {category === '' ? 'ALL' : category}
      </div>
    </button>
  )
}

const CategoryButtonList = ({
  updateCategory
}: {
  updateCategory: (category: string) => void
}) => {
  const [categoryList, setCategoryList] = useState<string[]>([])
  const api = useApi<IApi>(TYPES.Api)
  useEffect(() => {
    api.onLoadCategoryList().then((res) => {
      setCategoryList(res)
    })
  }, [])

  return (
    <div className={styles.categoryButtonList}>
      <CategoryButton
        key={''}
        category={''}
        onClick={() => updateCategory('')}
      />
      {categoryList.map((category) => (
        <CategoryButton
          key={category}
          category={category}
          onClick={() => updateCategory(category)}
        />
      ))}
    </div>
  )
}
export default CategoryButtonList
