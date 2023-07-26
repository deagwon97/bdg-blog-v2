import { useEffect, useState } from 'react'
import { onLoadCategoryList } from 'server/service/post.telefunc'
import styles from './styles.module.scss'
import Button from '@mui/material/Button'

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
      <div className={styles.categoryName}>{category}</div>
    </button>
  )
}

const CategoryButtonList = ({
  updateCategory
}: {
  updateCategory: (category: string) => void
}) => {
  const [categoryList, setCategoryList] = useState<string[]>([])

  useEffect(() => {
    onLoadCategoryList().then((res) => {
      setCategoryList(res)
    })
  }, [])

  return (
    <div className={styles.categoryButtonList}>
      <CategoryButton
        key={'ALL'}
        category={'ALL'}
        onClick={() => updateCategory('ALL')}
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
