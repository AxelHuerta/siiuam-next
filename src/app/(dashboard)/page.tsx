import getStudentInfo from "@/actions/get-student-info";

export default async function Page() {
  const response = await getStudentInfo();
  console.log(">> Student Info Page:", response);
  return <div>Page</div>;
}
