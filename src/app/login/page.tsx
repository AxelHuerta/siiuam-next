import login from "@/actions/login";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

async function onSubmit(formData: FormData) {
  "use server";

  const matricula = formData.get("matricula")?.toString() || "";
  const password = formData.get("password")?.toString() || "";

  const response = await login(matricula, password);
  if (!response) return;

  redirect("/");
}

export default async function Home() {
  return (
    <section className="min-h-screen bg-green-50 flex justify-center items-center">
      <div className="grid grid-cols-2 bg-white shadow-lg rounded-lg">
        <div className="bg-[url(https://cbi.izt.uam.mx/images/sitio/cbi/ubicacion/edificio_T.webp)] bg-cover bg-center"></div>
        <form action={onSubmit} className="m-8 space-y-8 p-8">
          <div>
            <h2 className="text-2xl font-bold">Acceso a la plataforma</h2>
            <span className="text-teal-700 font-medium">
              Ingresa con tus credenciales
            </span>
          </div>
          <div className="space-y-3">
            <Label htmlFor="matricula">Matrícula</Label>
            <Input type="text" id="matricula" name="matricula" />
          </div>
          <div className="space-y-3">
            <Label htmlFor="password">Contraseña</Label>
            <Input type="password" id="password" name="password" />
          </div>
          <Button className="w-full">Iniciar sesión</Button>
        </form>
      </div>
    </section>
  );
}
