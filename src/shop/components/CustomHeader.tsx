import { Search, Menu, User, ShieldUser, Heart, ShoppingCart, LogOut, LogIn } from "lucide-react";
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
  const {gender} = useParams()

  const inputRef = useRef<HTMLInputElement>(null);
  const query = searchParams.get('query') || ''

  const handleSearch = (event: KeyboardEvent<HTMLInputElement>) => {
    if(event.key !== 'Enter') return
    const query = inputRef.current?.value

    const newSearchParams = new URLSearchParams()
    
    if(!query){ 
      newSearchParams.delete('query')
    } else {
    newSearchParams.set('query', inputRef.current!.value || '')
    }

    setSearchParams(newSearchParams)
  }


  return <header className="sticky top-0 z-50 w-full border-b backdrop-blur bg-slate-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center">
          <div className="flex-1 flex justify-start">
            {/* Navigation - Mobile */} 
            <div className="md:hidden mr-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="font-montserrat font-bold text-xl m-0 whitespace-nowrap">
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
            <Link 
              to="/" 
              className={cn("text-sm font-medium transition-colors hover:text-primary"
                , !gender ? 'underline underline-offset-4' : ''
              )}>
              Todos
            </Link>
            <Link 
              to="/gender/men" 
              className={cn("text-sm font-medium transition-colors hover:text-primary", 
              gender === 'men' ? 'underline underline-offset-4' : ''
            )}>
              Hombres
            </Link>
            <Link 
              to="/gender/women" 
              className={cn("text-sm font-medium transition-colors hover:text-primary", 
              gender === 'women' ? 'underline underline-offset-4' : ''
            )}>
              Mujeres
            </Link>
            <Link 
              to="/gender/kid" 
              className={cn("text-sm font-medium transition-colors hover:text-primary", 
              gender === 'kid' ? 'underline underline-offset-4' : ''
            )}>
              Niños
            </Link>
          </nav>

          {/* Search and Cart */}
          <div className="flex-1 flex justify-end">
            <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 ml-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  ref={inputRef}
                  placeholder="Buscar productos..." 
                  className="pl-9 w-64 h-9 bg-white" 
                  onKeyDown={handleSearch}
                  defaultValue={query}
                />
              </div>
            </div>
            
            {
              authStatus === 'not-authenticated' ? (
                <Link to='/auth/login' >
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="ml-2 mr-2">
                      <LogIn/> Login
                  </Button>
                </Link>
              ) : (
                <DropdownMenu>
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
                    {
                      isAdmin() && (
                        <>
                          <DropdownMenuItem asChild>
                            <Link to='/admin'><ShieldUser/> Admin</Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )
                    }
                    <DropdownMenuItem asChild>
                      <Link to="/profile/favorites"><Heart/> Favoritos</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile/cart"><ShoppingCart/> Carrito de Compras</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      asChild 
                      variant='destructive'
                      color='black'
                    >
                      <span 
                        onClick={logout}
                      >
                          <LogOut/> Cerrar Sesion
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
              )
            }
            
          </div>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="flex md:hidden items-center space-x-2 mb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              ref={inputRef}
              placeholder="Buscar productos..." 
              className="pl-9 w-max h-9 bg-white" 
              onKeyDown={handleSearch}
              defaultValue={query}
            />
          </div>
        </div>

      </div>
    </header>
};
