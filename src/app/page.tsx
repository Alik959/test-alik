"use client"

import { useState, useEffect } from "react"
import { products } from "../components/products"
import { loadFavorites, saveFavorites } from "./storage/localStorage"

export default function ProductsPage() {
  const [favorites, setFavorites] = useState<number[]>([])
  const [expandedDesc, setExpandedDesc] = useState<number | null>(null)
  const [activeProduct, setActiveProduct] = useState<any | null>(null)

  useEffect(() => {
    setFavorites(loadFavorites())
  }, [])

  const toggleFavorite = (id: number) => {
    let updated
    if (favorites.includes(id)) {
      updated = favorites.filter(fav => fav !== id)
    } else {
      updated = [...favorites, id]
    }
    setFavorites(updated)
    saveFavorites(updated)
  }

  const productsGrouped = products.reduce<Record<string, typeof products>>((group, item) => {
    if (!group[item.category]) group[item.category] = []
    group[item.category].push(item)
    return group
  }, {})

  const favoriteItems = products.filter(p => favorites.includes(p.id))

  const ProductCard = ({ product }: { product: any }) => {
    const isFav = favorites.includes(product.id)
    const isExpanded = expandedDesc === product.id

    return (
      <div
        className="bg-white rounded-xl shadow-md hover:shadow-lg p-4 flex flex-col cursor-pointer transition-all"
        onClick={() => setActiveProduct(product)}
      >
        <img src={product.image} alt={product.title} className="h-44 object-contain mb-3 w-full" />
        <h3 className="font-medium text-lg mb-1 line-clamp-2">{product.title}</h3>
        <p className="text-sm text-gray-600 mb-1">
          {isExpanded ? product.description : product.description.slice(0, 80) + (product.description.length > 80 ? "..." : "")}
        </p>
        {product.description.length > 80 && (
          <button
            onClick={(e) => { e.stopPropagation(); setExpandedDesc(isExpanded ? null : product.id) }}
            className="text-blue-500 text-xs hover:underline mb-2"
          >
            {isExpanded ? "Show less" : "Read more"}
          </button>
        )}
        <div className="flex justify-between items-center mt-auto">
          <span className="font-semibold">${product.price}</span>
          <button
            onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id) }}
            className={`px-3 py-1 rounded-full text-sm font-medium transition ${
              isFav ? "bg-red-500 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {isFav ? "❤️" : "♡"}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-5 md:p-8 space-y-10">
      {favoriteItems.length > 0 && (
        <section>
          <h2 className="text-xl md:text-2xl font-bold mb-5">Favorites</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {favoriteItems.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {Object.entries(productsGrouped).map(([category, items]) => (
        <section key={category}>
          <h2 className="text-xl md:text-2xl font-bold mb-5 capitalize">{category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {items.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      ))}

      {activeProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
          <div className="bg-white rounded-2xl p-5 max-w-xl w-full relative shadow-2xl">
            <button
              onClick={() => setActiveProduct(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black text-lg"
            >
              ✕
            </button>
            <img src={activeProduct.image} alt={activeProduct.title} className="w-full h-72 object-contain mb-4" />
            <h3 className="text-xl font-semibold mb-2">{activeProduct.title}</h3>
            <p className="text-gray-700 mb-3">{activeProduct.description}</p>
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg">${activeProduct.price}</span>
              <button
                onClick={() => toggleFavorite(activeProduct.id)}
                className={`px-4 py-1 rounded-full text-sm font-medium transition ${
                  favorites.includes(activeProduct.id) ? "bg-red-500 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                {favorites.includes(activeProduct.id) ? "❤️" : "♡"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}