import { prisma } from "@repo/database";

export default async function IndexPage() {
  const users = await prisma.user.findMany();

  return (
    <div>
      <h1>UK</h1>
      <pre>{JSON.stringify(users, null, 2)}</pre>
    </div>
  );
}
