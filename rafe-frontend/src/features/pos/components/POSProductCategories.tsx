import { useState } from 'react'
import { POSHorizontalCardSelector } from '@/features/pos/components/POSHorizontalCardSelector'

const categories = [
  'Todos',
  'Bebidas',
  'Alimentos',
  'Higiene',
  'Limpeza',
  'Frutas',
  'Laticínios',
  'Padaria',
  'Congelados',
  'Mercearia',
  'Carnes',
  'Acessórios',
]

export function POSProductCategories() {
  const [activeCategory, setActiveCategory] = useState('Todos')

  return (
    <POSHorizontalCardSelector
      ariaLabel="Categorias de produtos"
      className="relative mt-2 w-full"
      items={categories}
      nextButtonLabel="Ver mais categorias"
      onSelect={setActiveCategory}
      previousButtonLabel="Ver categorias anteriores"
      selectedItem={activeCategory}
    />
  )
}
