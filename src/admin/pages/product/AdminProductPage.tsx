import { Navigate, useNavigate, useParams } from 'react-router';

import { useProduct } from '@/admin/hooks/useProduct';
import { CustomFullScreenLoading } from '@/components/custom/CustomFullScreenLoading';
import { AdminProductForm } from './ui/AdminProductForm';
import type { Product } from '@/interface/product.interface';
import { toast } from 'sonner';


export const AdminProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate()

  const {isLoading, isError, data: product, mutation} = useProduct(id || '')

  const productTitle = id === 'new' ? 'Nuevo producto' : 'Editar producto';
  const productSubtitle =
    id === 'new'
      ? 'Aquí puedes crear un nuevo producto.'
      : 'Aquí puedes editar el producto.';

  const handleSubmit = async(productLike: Partial<Product> & { files?: File[] }) => {
    await mutation.mutateAsync(productLike, {
      onSuccess: (data) => {
        toast.success('Producto actualizado correctamente',{
          position: 'top-right'
        })
        navigate(`/admin/products/${data.id}`)
      },
      onError: (error: any) => {
        console.error({error})
        const msg = error?.response?.data?.message
          ?? error?.message
          ?? 'Error desconocido';
        const display = Array.isArray(msg) ? msg.join(' | ') : msg;
        toast.error(`Error: ${display}`, { position: 'top-right' })
      }
    });
  }
  
  if(isError) {
    return <Navigate to='/admin/products' />
  }

  if(isLoading) {
    return <CustomFullScreenLoading />
  }

  if(!product){
    return <Navigate to='/admin/products' />
  }

  return <AdminProductForm 
    title={productTitle}
    subTitle={productSubtitle}
    product={product}
    onSubmit= {handleSubmit}
    isPosting={mutation.isPending}
  />

};