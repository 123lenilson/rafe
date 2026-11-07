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

interface POSProductCategoriesProps {
  selectedCategory: string
  onSelectCategory: (category: string) => void
}

export function POSProductCategories({
  selectedCategory,
  onSelectCategory,
}: POSProductCategoriesProps) {
  return (
    <POSHorizontalCardSelector
      ariaLabel="Categorias de produtos"
      className="relative mt-2 w-full"
      items={categories}
      nextButtonLabel="Ver mais categorias"
      onSelect={onSelectCategory}
      previousButtonLabel="Ver categorias anteriores"
      selectedItem={selectedCategory}
    />
  )
}
