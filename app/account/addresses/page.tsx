import { getUserAddresses } from "@/actions/addresses";
import { AddressManager } from "@/components/shop/address-manager";

export const metadata = { title: "Your addresses" };

export default async function AddressesPage() {
  const addresses = await getUserAddresses();
  return (
    <div className="container py-8 md:py-12">
      <h1 className="mb-8 font-display text-2xl font-bold md:text-3xl">Your addresses</h1>
      <AddressManager initialAddresses={addresses} />
    </div>
  );
}
