import { getKardex } from "@/actions/get-kardex";
import { Grade } from "@/interfaces/grade";

async function getGrades() {
  return await getKardex();
}

export default async function Page() {
  const grades: Grade[] | null = await getGrades();

  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">Kardex</h1>
      {grades ? (
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Registro</th>
              <th className="border border-gray-300 px-4 py-2">Código</th>
              <th className="border border-gray-300 px-4 py-2">Nombre</th>
              <th className="border border-gray-300 px-4 py-2">Trimestre</th>
              <th className="border border-gray-300 px-4 py-2">
                Tipo Evaluación
              </th>
              <th className="border border-gray-300 px-4 py-2">Calificación</th>
              <th className="border border-gray-300 px-4 py-2">Acta</th>
              <th className="border border-gray-300 px-4 py-2">Créditos</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((grade, index) => (
              <tr
                key={grade.codigo}
                className={index % 2 === 0 ? "bg-gray-100" : ""}
              >
                <td className="border border-gray-300 px-4 py-2">
                  {grade.registro}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {grade.codigo}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {grade.nombre}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {grade.trimestre}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {grade.tipoEvaluacion}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {grade.calificacion}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {grade.acta}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {grade.creditos}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>
          No se pudo obtener el kardex. Por favor, inténtalo de nuevo más tarde.
        </p>
      )}
    </section>
  );
}
