import { MobileSidebar } from "./mobile-sidebar";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  return (
    <nav className="pt-4 px-6 flex items-center justify-between">
      <div className="flex-col hidden lg:flex">
        <h1 className="text-2xl font-semibold">
          Sport App GitHub Copilot Workshop
        </h1>
        <p className="text-muted-foreground">
          Elevate Your Game with Contoso Sport: Where Sports Passion Meets
          Performance!
        </p>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/login" className="hidden md:block">
          <Button variant="outline" className="bg-white hover:bg-gray-50">
            Login
          </Button>
        </Link>
        <MobileSidebar />
      </div>
    </nav>
  );
};
