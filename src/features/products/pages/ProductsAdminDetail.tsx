import { useNavigate, useParams } from "react-router-dom";
import { useAdminProductDetail } from "../hooks/product.queries.hooks";
import { Badge, Button, Divider, Text, Title } from "@mantine/core";
import {
  ProductCategoriesCard,
  ProductImageCard,
  ProductPriceCard,
  ProductStockCard,
  ProductIngredientsCard,
} from "../components/ProductsDetailCards";
import { useProductMutation } from "../hooks/product.mutation.hooks";
import { notifications } from "@mantine/notifications";
import type { AxiosError } from "axios";
import { CircleArrowLeftIcon } from "lucide-react";
import NotFoundState from "../../../shared/components/NotFoundState";

const ProductsAdminDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const prodId = Number(id);

  const { data: product, isLoading } = useAdminProductDetail(prodId);

  const { changeStockAvailable } = useProductMutation();

  if (!id || isNaN(prodId)) return <NotFoundState message="Producto no encontrado" />;
  if (isLoading) return <>Cargando...</>;
  if (!product) return <NotFoundState message="Producto no encontrado" />;

  const handleAvailability = (availability: boolean) => {
    changeStockAvailable(
      { id: prodId, is_available: availability },
      {
        onSuccess: () => {
          notifications.show({
            color: "green",
            message: "Disponibilidad actualizada",
          });
        },
        onError: (error) => {
          const axiosError = error as AxiosError<{ detail: string }>;
          const msg =
            axiosError.response?.data?.detail || "Error al actualizar";
          notifications.show({ color: "red", message: msg });
        },
      },
    );
  };

  return (
    <>
      <div className="w-full flex justify-start items-center px-4">
        <Button
          onClick={() => navigate("/stock/products")}
          size="lg"
          variant="subtle"
          color="cyan"
          leftSection={<CircleArrowLeftIcon size={28} />}
        >
          Volver
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
        <section className="col-span-1 md:col-span-2 card flex items-center justify-between border border-solid border-zinc-500 rounded-2xl bg-slate-100 p-4">
          <div className="">
            <Text size="md">#{product.id}</Text>
            <Title order={2} style={{ marginBottom: "8px" }}>
              {product.name}
            </Title>
            <Text size="md">{product.description}</Text>
          </div>
          <button onClick={() => handleAvailability(!product.available)}>
            <Badge
              color={product.available ? "teal" : "red"}
              variant="dot"
              size="lg"
              style={{ cursor: "pointer" }}
            >
              {product.available ? "Disponible" : "No disponible"}
            </Badge>
          </button>
        </section>

        <section className="col-span-1 md:col-span-2 grid grid-cols-3 gap-4">
          <ProductPriceCard product={product} />
          <ProductStockCard product={product} />
          <div className="metric-card flex flex-col gap-2 p-4 border border-solid border-zinc-500 rounded-2xl bg-slate-100">
            <Text size="md">Categorías</Text>
            <p className="text-2xl font-medium">
              {product.categories?.length ?? 0}
            </p>
          </div>
        </section>

        <section className="card">
          <ProductImageCard product={product} />
        </section>

        <section className="card">
          <ProductCategoriesCard product={product} />
        </section>

        {product.type == "MANUFACTURED" && (
          <section className="col-span-1 md:col-span-2 card">
            <ProductIngredientsCard productId={product.id} />
          </section>
        )}

        <section className="col-span-1 md:col-span-2 card">
          <div className="metric-card flex flex-col gap-2 p-4 border border-solid border-zinc-500 rounded-2xl bg-slate-100">
            <Text size="md">Auditoría</Text>
            <Divider className="mx-2" />
            <div className="flex justify-between text-sm">
              <Text>Creado</Text>
              <span>
                {new Date(product.created_at).toLocaleString("es-AR")}
              </span>
            </div>
            <Divider className="mx-2" />
            <div className="flex justify-between text-sm">
              <Text>Actualizado</Text>
              <span>
                {product.updated_at
                  ? new Date(product.updated_at).toLocaleString("es-AR")
                  : "—"}
              </span>
            </div>
            <Divider className="mx-2" />
            <div className="flex justify-between text-sm">
              <Text>Eliminado</Text>
              <Badge
                color={product.deleted_at ? "red" : "teal"}
                variant="dot"
                size="lg"
              >
                {product.deleted_at
                  ? new Date(product.deleted_at).toLocaleString("es-AR")
                  : "No"}
              </Badge>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ProductsAdminDetail;
