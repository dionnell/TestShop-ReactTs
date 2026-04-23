import { useState } from "react"
import { useAuthStore } from "@/auth/store/auth.store"
import { useProfile } from "@/shop/hooks/useProfile"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose} from "@/components/ui/dialog"
import { Mail, Phone, MapPin, CalendarDays, ShoppingCart, Heart, Pencil, KeyRound, Eye, EyeOff} from "lucide-react"
import { Link } from "react-router"
import { UserAvatar } from "@/shop/components/UserAvatar"
import { InfoRow } from "@/shop/components/InfoRow"
import { useForm } from "react-hook-form"
import type { UpdateProfileDto } from "@/shop/actions/updateprofile.action"
import type { ChangePasswordDto } from "@/shop/actions/changepassword.action"
import { FieldError } from "@/shop/components/FieldError"


 
export const ProfileUser = () => {
  const { user } = useAuthStore()
  const { updateProfile, isUpdatingProfile, changePassword, isChangingPassword } = useProfile()
 
  const [editOpen, setEditOpen] = useState(false)
  const [pwOpen, setPwOpen] = useState(false)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
 
  //  Edit profile form 
  const editForm = useForm<UpdateProfileDto>({
    defaultValues: {
      fullName: user?.fullName ?? "",
      phone: user?.phone ?? "",
      address: user?.address ?? "",
    },
  })
 
  // Change password form 
  const pwForm = useForm<ChangePasswordDto>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  })
 
  if (!user) return null
 
  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("es-CL", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null
 
  const handleEditSubmit = editForm.handleSubmit((data) => {
    updateProfile(data, {
      onSuccess: () => {
        toast.success("Perfil actualizado", { position: "top-right", richColors: true })
        setEditOpen(false)
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message ?? "Error al actualizar perfil", {
          position: "top-right",
          richColors: true,
        })
      },
    })
  })
 
  const handlePasswordSubmit = pwForm.handleSubmit((data) => {
    changePassword(data, {
      onSuccess: () => {
        toast.success("Contraseña actualizada", { position: "top-right", richColors: true })
        pwForm.reset()
        setPwOpen(false)
      },
      onError: (error: any) => {
        const msg = error?.response?.data?.message ?? "Error al cambiar la contraseña"
        
        if (typeof msg === "string" && msg.toLowerCase().includes("password")) {
          pwForm.setError("currentPassword", { message: msg })
        } else {
          toast.error(Array.isArray(msg) ? msg.join(", ") : msg, {
            position: "top-right",
            richColors: true,
          })
        }
      },
    })
  })
 
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">
 
      {/*  Header card  */}
      <div className="rounded-2xl border bg-white p-6">
        <div className="flex items-center gap-5">
          <UserAvatar fullName={user.fullName} />
 
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-gray-900 truncate">{user.fullName}</h1>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">{user.email}</p>
          </div>
        </div>
 
        <Separator className="my-5" />
 
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 divide-y sm:divide-y-0">
          <InfoRow icon={Mail}         label="Correo electrónico" value={user.email} />
          <InfoRow icon={Phone}        label="Teléfono"           value={user.phone}   placeholder="Sin teléfono registrado" />
          <InfoRow icon={MapPin}       label="Dirección"          value={user.address} placeholder="Sin dirección registrada" />
          <InfoRow icon={CalendarDays} label="Miembro desde"      value={formattedDate} />
          
        </div>
 
        <Separator className="my-5" />
 
        <div className="flex flex-wrap gap-3">
 
          {/* Edit profile dialog */}
          <Dialog open={editOpen} onOpenChange={(open) => {
            setEditOpen(open)
            if (open) editForm.reset({ fullName: user.fullName ?? "", phone: user.phone ?? "", address: user.address ?? "" })
          }}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Pencil className="h-3.5 w-3.5" /> Editar perfil
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Editar perfil</DialogTitle>
              </DialogHeader>
 
              <form onSubmit={handleEditSubmit} className="space-y-4 py-2">
                <div className="space-y-1.5">
                  <Label htmlFor="fullName">Nombre completo</Label>
                  <Input
                    id="fullName"
                    placeholder="Tu nombre"
                    {...editForm.register("fullName", { required: "El nombre es obligatorio" })}
                  />
                  <FieldError message={editForm.formState.errors.fullName?.message} />
                </div>
 
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    placeholder="+56912345678"
                    {...editForm.register("phone")}
                  />
                </div>
 
                <div className="space-y-1.5">
                  <Label htmlFor="address">Dirección</Label>
                  <Input
                    id="address"
                    placeholder="Av. Ejemplo 1234, Santiago"
                    {...editForm.register("address")}
                  />
                </div>
 
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline" size="sm">Cancelar</Button>
                  </DialogClose>
                  <Button type="submit" size="sm" disabled={isUpdatingProfile}>
                    {isUpdatingProfile ? "Guardando..." : "Guardar cambios"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
 
          {/*  Change password  */}
          <Dialog open={pwOpen} onOpenChange={(open) => {
            setPwOpen(open)
            if (!open) pwForm.reset()
          }}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <KeyRound className="h-3.5 w-3.5" /> Cambiar contraseña
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Cambiar contraseña</DialogTitle>
              </DialogHeader>
 
              <form onSubmit={handlePasswordSubmit} className="space-y-4 py-2">
                <div className="space-y-1.5">
                  <Label htmlFor="currentPassword">Contraseña actual</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrent ? "text" : "password"}
                      placeholder="••••••••"
                      className="pr-10"
                      {...pwForm.register("currentPassword", {
                        required: "Ingresa tu contraseña actual",
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <FieldError message={pwForm.formState.errors.currentPassword?.message} />
                </div>
 
                <div className="space-y-1.5">
                  <Label htmlFor="newPassword">Nueva contraseña</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNew ? "text" : "password"}
                      placeholder="••••••••"
                      className="pr-10"
                      {...pwForm.register("newPassword", {
                        required: "Ingresa la nueva contraseña",
                        minLength: { value: 6, message: "Mínimo 6 caracteres" },
                        pattern: {
                          value: /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
                          message: "Debe incluir mayúscula, minúscula y número",
                        },
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <FieldError message={pwForm.formState.errors.newPassword?.message} />
                </div>
 
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline" size="sm">Cancelar</Button>
                  </DialogClose>
                  <Button type="submit" size="sm" disabled={isChangingPassword}>
                    {isChangingPassword ? "Actualizando..." : "Actualizar contraseña"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
 
        </div>
      </div>
 
      {/* Cart y Favorites Links  */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/profile/favorites">
          <div className="rounded-2xl border bg-white p-5 flex items-center gap-4 hover:bg-gray-50 transition-colors group">
            <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0 group-hover:bg-red-100 transition-colors">
              <Heart className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Mis favoritos</p>
              <p className="text-xs text-gray-500">Ver productos guardados</p>
            </div>
          </div>
        </Link>
 
        <Link to="/profile/cart">
          <div className="rounded-2xl border bg-white p-5 flex items-center gap-4 hover:bg-gray-50 transition-colors group">
            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
              <ShoppingCart className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Mi carrito</p>
              <p className="text-xs text-gray-500">Ver productos en el carro</p>
            </div>
          </div>
        </Link>
      </div>
 
    </div>
  )
}