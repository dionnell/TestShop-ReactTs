import { AdminTitle } from "@/admin/components/AdminTitle";
import type { Product, Size } from "@/interface/product.interface";
import { X, Plus, Upload, Tag, SaveAll } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';
import { useEffect, useRef, useState } from "react";
import { useForm } from 'react-hook-form'
import { cn } from "@/lib/utils";


interface Props {
    title: string
    subTitle: string
    product: Product
    isPosting: boolean

    //Methods
    onSubmit: (productLike: Partial<Product> & { files?: File[] }) => Promise<void>
}

const availableSizes: Size[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

interface FormInputs extends Product {
  files?: File[]
}

export const AdminProductForm = ({ title, subTitle, product, onSubmit, isPosting }: Props) => {

  const [dragActive, setDragActive] = useState(false);
  const {register, 
        handleSubmit, 
        formState: {errors}, 
        getValues, 
        setValue,
        watch 
      } = useForm<FormInputs>({
    defaultValues: product
  })

  const labelInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([])

  useEffect(() => {
    setFiles([]) // Limpiar las nuevas imágenes seleccionadas al cambiar de producto
  },[product])

  const selectedSizes = watch('sizes')
  const selectedTags = watch('tags')
  const selectedStock = watch('stock')

  
  const addTag = () => {
    const newTag = labelInputRef.current!.value
    if(newTag === '') return

    const tagSet = new Set(getValues('tags'))
    tagSet.add(newTag)

    setValue('tags', Array.from(tagSet))
    labelInputRef.current!.value = ''
  };

  const removeTag = (tagToRemove: string) => {
    const tagSet = new Set(getValues('tags'))
    tagSet.delete(tagToRemove)

    setValue('tags', Array.from(tagSet))
  };

  const addSize = (size: Size) => {
    const sizeSet = new Set(getValues('sizes'))
    sizeSet.add(size)

    setValue('sizes', Array.from(sizeSet))
  };

  const removeSize = (sizeToRemove: Size) => {
    const sizeSet = new Set(getValues('sizes'))
    sizeSet.delete(sizeToRemove)

    setValue('sizes', Array.from(sizeSet))
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;

    if(!files) return

    setFiles(prev => [...prev, ...Array.from(files)])

    const currentFiles = getValues('files') || []
    setValue('files', [...currentFiles, ...Array.from(files)])

  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if(!files) return
    setFiles(prev => [...prev, ...Array.from(files)])
    const currentFiles = getValues('files') || []
    setValue('files', [...currentFiles, ...Array.from(files)])

  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="min-h-screen bg-slate-50">
      <div className="flex justify-between items-center max-md:grid max-md:grid-cols-1 max-md:gap-2">
        <AdminTitle title={title} subtitle={subTitle} />
        <div className="flex justify-end mb-10 gap-4 max-md:grid max-md:grid-cols-1 max-md:gap-2">
          <Button type='button' variant="outline" className="max-md:w-3xs">
            <Link to="/admin/products" className="flex items-center gap-2 w-auto">
              <X className="w-4 h-4" />
              Cancelar
            </Link>
          </Button>

          <Button type='submit' disabled={isPosting} className="max-md:w-3xs">
            <SaveAll className="w-4 h-4" />
            {isPosting ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-6">
                Información del producto
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Título del producto
                  </label>
                  <input
                    type="text"
                    {...register('title', {
                      required: true
                    })}
                    className={cn("w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200",
                      {
                        'border-red-500 focus:ring-red-500' : errors.title
                      }
                    )}
                    placeholder="Título del producto"
                  />
                  {errors.title && 
                    <p className="text-red-500 text-sm mt-1">El título es requerido</p>
                  }
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Precio ($)
                    </label>
                    <input
                      type="number"
                      {...register('price', {
                        valueAsNumber: true,
                        min: 1,
                        required: true
                      })}
                      className={cn("w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200",
                        {
                          'border-red-500 focus:ring-red-500' : errors.price
                        }
                      )}
                      placeholder="Precio del producto"
                    />
                    {errors.price && 
                      <p className="text-red-500 text-sm mt-1">El precio es requerido</p>
                    }
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Stock del producto
                    </label>
                    <input
                      type="number"
                      {...register('stock', {
                        valueAsNumber: true,
                        min: 1,
                        required: true
                      })}
                      className={cn("w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200",
                        {
                          'border-red-500 focus:ring-red-500' : errors.stock
                        }
                      )}
                      placeholder="Stock del producto"
                    />
                    {errors.stock && 
                      <p className="text-red-500 text-sm mt-1">El stock es requerido</p>
                    }
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Slug del producto
                  </label>
                  <input
                    type="text"
                    {...register('slug', {
                      required: true,
                      validate: (value) => !/\s/.test(value) || "El slug no puede contener espacios en blanco"
                    })}
                    className={cn("w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200",
                        {
                          'border-red-500 focus:ring-red-500' : errors.slug
                        }
                      )}
                    placeholder="Slug del producto"
                  />
                  {errors.slug && 
                    <p className="text-red-500 text-sm mt-1">{errors.slug.message || "El slug es requerido"}</p>
                  }
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Género del producto
                  </label>
                  <select
                    {...register('gender')}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="men">Hombre</option>
                    <option value="women">Mujer</option>
                    <option value="unisex">Unisex</option>
                    <option value="kid">Niño</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Descripción del producto
                  </label>
                  <textarea
                    {...register('description', {
                      required: true
                    })}
                    rows={5}
                    className={cn("w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none",
                        {
                          'border-red-500 focus:ring-red-500' : errors.description
                        }
                      )}
                    placeholder="Descripción del producto"
                  />
                  {errors.description && 
                    <p className="text-red-500 text-sm mt-1">La descripción es requerida</p>
                  }
                </div>
              </div>
            </div>

            {/* Sizes */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-4">
              <h2 className="text-xl font-semibold text-slate-800 mb-6">
                Tallas disponibles
              </h2>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <span
                      key={size}
                      className={
                        cn("inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200",
                          {
                            'hidden': !selectedSizes.includes(size)
                          }
                        )
                      }
                    >
                      {size}
                      <button
                        type='button'
                        onClick={() => removeSize(size)}
                        className="ml-2 text-blue-600 hover:text-blue-800 transition-colors duration-200 cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200">
                  <span className="text-sm text-slate-600 mr-2">
                    Añadir tallas:
                  </span>
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      type='button'
                      onClick={() => addSize(size)}
                      disabled={getValues('sizes').includes(size)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                        selectedSizes.includes(size)
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-slate-200 text-slate-700 hover:bg-slate-300 cursor-pointer'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-4">
              <h2 className="text-xl font-semibold text-slate-800 mb-6">
                Etiquetas
              </h2>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                      <button
                        type='button'
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-green-600 hover:text-green-800 transition-colors duration-200 cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    ref={labelInputRef}
                    type="text"
                    onKeyDown={(e) => {
                      if(e.key === 'Enter' || e.key === ' ' || e.key === ',') {
                        e.preventDefault()
                        addTag()
                        labelInputRef.current!.value = ''
                      }
                    }}
                    placeholder="Añadir nueva etiqueta..."
                    className="flex-1 px-3 py-1 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <Button 
                    type='button'
                    onClick={addTag} 
                    className="px-4 py-1rounded-lg "
                    >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Product Images */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-4">
              <h2 className="text-xl font-semibold text-slate-800 mb-6">
                Imágenes del producto
              </h2>

              {/* Drag & Drop Zone */}
              <div
                className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
                  dragActive
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-slate-300 hover:border-slate-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                />
                <div className="space-y-4">
                  <Upload className="mx-auto h-12 w-12 text-slate-400" />
                  <div>
                    <p className="text-lg font-medium text-slate-700">
                      Arrastra las imágenes aquí
                    </p>
                    <p className="text-sm text-slate-500">
                      o haz clic para buscar
                    </p>
                  </div>
                  <p className="text-xs text-slate-400">
                    PNG, JPG, WebP hasta 10MB cada una
                  </p>
                </div>
              </div>

              {/* Current Images */}
              <div className="mt-6 space-y-3">
                <h3 className="text-sm font-medium text-slate-700">
                  Imágenes actuales
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {product.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center">
                        <img
                          src={image}
                          alt="Product"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <button 
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        type='button'                        
                      >
                        <X className="h-3 w-3" />
                      </button>
                      <p className="mt-1 text-xs text-slate-600 truncate">
                        {image}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Previsualizacion de nuevas imagenes */}
              {files.length > 0 &&
                <div className="mt-6 space-y-3">
                  <h3 className="text-sm font-medium text-slate-700">
                    Previsualización de nuevas imágenes
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {files.map((file, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center">
                          <img
                            src={URL.createObjectURL(file)}
                            alt="Product"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <button 
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          type='button'  
                        >
                          <X className="h-3 w-3" />
                        </button>
                        <p className="mt-1 text-xs text-slate-600 truncate">
                          {file.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              }
              
            </div>

            {/* Product Status */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-4">
              <h2 className="text-xl font-semibold text-slate-800 mb-6">
                Estado del producto
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm font-medium text-slate-700">
                    Estado
                  </span>
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Activo
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm font-medium text-slate-700">
                    Inventario
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      selectedStock > 5
                        ? 'bg-green-100 text-green-800'
                        : selectedStock > 0
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {selectedStock > 5
                      ? 'En stock'
                      : selectedStock > 0
                      ? 'Bajo stock'
                      : 'Sin stock'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm font-medium text-slate-700">
                    Imágenes
                  </span>
                  <span className="text-sm text-slate-600">
                    {product.images.length} imágenes
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm font-medium text-slate-700">
                    Tallas disponibles
                  </span>
                  <span className="text-sm text-slate-600">
                    {selectedSizes.length} tallas
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );

}
