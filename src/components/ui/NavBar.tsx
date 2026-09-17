import Link from "next/link";
import { NavLinks } from "./NavLinks";
import { MobileTabBar } from "./MobileTabBar";
import { UserStatus } from "./UserStatus";

export function NavBar() {
  return (
    <>
      <header className="border-b border-card-border bg-white">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-lg font-bold tracking-wide text-deep">
              多保命
            </Link>
            <div className="hidden md:block">
              <NavLinks />
            </div>
          </div>
          <UserStatus />
        </div>
      </header>
      <MobileTabBar />
    </>
  );
}
