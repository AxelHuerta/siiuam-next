import getStudentInfo from "@/actions/get-student-info";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StudentData } from "@/interfaces";

export default async function Page() {
  const response: StudentData | null = await getStudentInfo();
  console.log(">> Student Info Page:", response);

  if (!response) return <div>No hay información disponible.</div>;

  const { general, academic, performance } = response;
  const progress = Math.floor(
    (Number(performance.creditsCounter) * 100) / Number(academic.minCredits)
  );

  return (
    <section className="flex flex-col gap-4 mx-auto my-4 justify-center max-w-5xl">
      <div>
        <Card className="h-48">
          <CardHeader>
            <CardTitle>Información General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-md font-semibold">
              {general.name} {general.paternalLastName}{" "}
              {general.maternalLastName}
            </p>
            <p>Matrícula: {general.matricula}</p>
            <p>Nacionalidad: {general.nacionality}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-neutral-50">
          <CardHeader>
            <CardTitle>Promedio General</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold">{performance.generalAvg}</span>
          </CardContent>
        </Card>

        <Card className="bg-neutral-50">
          <CardHeader>
            <CardTitle>Estatus</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold">{general.academicStatus}</span>
          </CardContent>
        </Card>

        <Card className="bg-neutral-50">
          <CardHeader>
            <CardTitle>Último Trimestre Inscrito</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold">
              {performance.lastEnrrolmentTrimester}
            </span>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              Rendimiento Académico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4"></div>

            <div className="m-5 space-y-4">
              <h2 className="text-lg font-semibold">Avance de Créditos</h2>
              <div className="flex items-center gap-8">
                <Progress value={progress} />
                <span className="text-xl font-semibold">{progress}%</span>
              </div>
              <div className="flex justify-between">
                <p>
                  Has completado {performance.creditsCounter} de{" "}
                  {academic.minCredits} créditos
                </p>
                <span>Créditos máximos: {academic.maxCredits}</span>
              </div>
            </div>

            <div className="m-5 space-y-4">
              <h2 className="text-lg font-semibold">Otros Datos</h2>
              <div className="grid grid-cols-2 gap-2">
                <p>Número de NA en tronco: {performance.naCount}</p>
                <p>Número de conversiones: {performance.conversionCount}</p>
                <p>Trimestre de ingreso: {performance.enrollmentTrimester}</p>
                <p>
                  Último trimestre con actividad:{" "}
                  {performance.lastActivityTrimester}
                </p>
                <p>
                  Promedio del último trimestre con actividad:{" "}
                  {performance.lastTrimesterAvgActive}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Información Académica</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            <p>Unidad: {academic.unity}</p>
            <p>División: {academic.division}</p>
            <p>Carrera: {academic.planName}</p>
            <p>Plan: {academic.planCode}</p>
            <p>Duración de la carrera: {academic.planDuration} trimestres</p>
            <p>Área de concentración: {academic.concentrationArea}</p>
            <p>Sub-área: {academic.subArea}</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
