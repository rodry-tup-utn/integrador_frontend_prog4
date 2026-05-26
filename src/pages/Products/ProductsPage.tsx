import { useState } from "react"
import { usePublicProducts, usePublicSearchProducts } from "../../features/products/hooks/product.queries.hooks";
import { Text, TextInput } from "@mantine/core";
import { IconSearch, IconShoppingCartOff } from "@tabler/icons-react";
import ProductCardPublic from "../../shared/components/ProductCardPublic";

const ProductsPage = () => {

    const [search, setSearch] = useState("");
    const isSearching = search.trim().length > 0

    const { data: productsList, isLoading: loadingAll } = usePublicProducts(0, 50)
    const { data: searchResult, isLoading: loadingSearch } = usePublicSearchProducts(search.trim(), 0, 50)

    const products = isSearching
        ? searchResult?.data ?? []
        : productsList?.data ?? [];

    const isLoading = isSearching ? loadingSearch : loadingAll;

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <Text size="xl" fw={800} c="teal.8">
                        Nuestros productos
                    </Text>
                    <Text size="sm" c="dimmed">
                        {productsList?.total ?? 0} productos disponibles
                    </Text>
                </div>
            </div>

            <TextInput
                placeholder="Buscar productos..."
                leftSection={<IconSearch size={20} />}
                value={search}
                onChange={(e) => setSearch(e.currentTarget.value)}
                className="max-w-sm"
            />

            {isLoading ? (
                <div className="flex justify-center py-16">
                    <>Cargando...</>
                </div>
            ) : products.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-16 text-gray-400">
                    <IconShoppingCartOff size={48} stroke={1} />
                    <Text size="sm">No se encontraron productos</Text>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {products.map((product) => (
                        <ProductCardPublic key={product.id} product={product} />
                    ))}
                </div>
            )}

            {/* <CartDrawer opened={cartOpened} onClose={closeCart} /> */}
        </div>
    )
}

export default ProductsPage