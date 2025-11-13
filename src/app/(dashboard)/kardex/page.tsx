import { getKardex } from "@/actions/get-kardex";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Grade } from "@/interfaces/grade";

async function getData(): Promise<Grade[] | null> {
  return await getKardex();
}

export default async function Page() {
  const data = (await getData()) ?? [];

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-semibold">Kardex</h1>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
