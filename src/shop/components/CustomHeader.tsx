import { Search, Menu, User, ShieldUser, Heart, ShoppingCart, BookText, LogOut, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRef, type KeyboardEvent } from "react";
import { Link, useParams, useSearchParams } from "react-router";
import { cn } from "@/lib/utils";
import { CustomLogo } from "@/components/custom/CustomLogo";
import { useAuthStore } from "@/auth/store/auth.store";

export const CustomHeader = () => {

  const [searchParams, setSearchParams] = useSearchParams()
  const { authStatus, logout, isAdmin } = useAuthStore()
  const { gender } = useParams()

  const desktopRef = useRef<HTMLInputElement>(null)
  const mobileRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const query = searchParams.get('query') || ''

  // Desktop: busca al presionar Enter
  const handleDesktopSearch = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return
    applySearch(desktopRef.current?.value ?? '')
  }

  // Mobile: busca con debounce mientras el usuario escribe
  const handleMobileSearch = (value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      applySearch(value)
    }, 500)
  }

  const applySearch = (value: string) => {
    const newParams = new URLSearchParams(searchParams)
    if (!value.trim()) {
      newParams.delete('query')
    } else {
      newParams.set('query', value.trim())
    }
    newParams.delete('page')
    setSearchParams(newParams)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur bg-slate-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center">
          <div className="flex-1 flex justify-start">
            {/* Navigation - Mobile */}
            <div className="md:hidden mr-4">
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="font-montserrat font-bold text-xl ml-4 whitespace-nowrap">
                  <DropdownMenuItem asChild>
                    <Link to="/">Todos</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/gender/men">Hombres</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/gender/women">Mujeres</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/gender/kid">Niños</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {/* Logo */}
            <CustomLogo />
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className={cn("text-sm font-medium transition-colors hover:text-primary", !gender ? 'underline underline-offset-4' : '')}>
              Todos
            </Link>
            <Link to="/gender/men" className={cn("text-sm font-medium transition-colors hover:text-primary", gender === 'men' ? 'underline underline-offset-4' : '')}>
              Hombres
            </Link>
            <Link to="/gender/women" className={cn("text-sm font-medium transition-colors hover:text-primary", gender === 'women' ? 'underline underline-offset-4' : '')}>
              Mujeres
            </Link>
            <Link to="/gender/kid" className={cn("text-sm font-medium transition-colors hover:text-primary", gender === 'kid' ? 'underline underline-offset-4' : '')}>
              Niños
            </Link>
          </nav>

          {/* Search and User */}
          <div className="flex-1 flex justify-end">
            <div className="flex items-center space-x-4 max-sm:space-x-1">
              {/* Desktop search */}
              <div className="hidden md:flex items-center space-x-2 ml-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    ref={desktopRef}
                    placeholder="Buscar productos..."
                    className="pl-9 w-64 h-9 bg-white"
                    onKeyDown={handleDesktopSearch}
                    defaultValue={query}
                  />
                </div>
              </div>

              {/* Favorite Button */}
              {
                authStatus === 'authenticated' && (
                  <Link to="/profile/favorites">
                    <Button variant='ghost' size='lg' className="rounded-2xl hover:border-2 hover:border-gray-400 md:hidden lg:inline-flex">
                      <Heart className="h-10 w-10" />
                    </Button>
                  </Link>
                )
              }

              {/* Cart Button */}
              {
                authStatus === 'authenticated' && (
                  <Link to="/profile/cart">
                    <Button variant='ghost' size='lg' className="rounded-2xl hover:border-2 hover:border-gray-400 md:hidden lg:inline-flex">
                      <ShoppingCart className="h-10 w-10" />
                    </Button>
                  </Link>
                )
              }
              
              {authStatus === 'not-authenticated' ? (
                <Link to='/auth/login'>
                  <Button variant="default" size="sm" className="ml-2 mr-2">
                    <LogIn /> Login
                  </Button>
                </Link>
              ) : (
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-2xl border-2 mx-2">
                      <User className="h-10 w-10" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="font-montserrat font-bold text-xl m-0 whitespace-nowrap">
                    <DropdownMenuItem asChild>
                      <Link to="/profile/user"><User /> Perfil</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {isAdmin() && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link to='/admin'><ShieldUser /> Admin</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem asChild>
                      <Link to="/profile/favorites"><Heart /> Favoritos</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile/cart"><ShoppingCart /> Carrito de Compras</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile/history"><BookText /> Historial de Compras</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild variant='destructive'>
                      <span onClick={logout}><LogOut /> Cerrar Sesion</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>

        {/* Mobile search — debounce en onChange, no necesita Enter */}
        <div className="flex md:hidden items-center pb-2">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={mobileRef}
              placeholder="Buscar productos..."
              className="pl-9 h-9 bg-white w-full"
              defaultValue={query}
              onChange={(e) => handleMobileSearch(e.target.value)}
            />
          </div>
        </div>

      </div>
    </header>
  )
}