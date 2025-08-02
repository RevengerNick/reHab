"use client";
import { gql, useQuery } from "@apollo/client";
import { ProjectCard, ProjectCardSkeleton } from "@/components/projects/project-card";
import { CreateProjectDialog } from "@/components/projects/create-project-dialog";

// GraphQL-запрос для получения проектов
const GET_PROJECTS_QUERY = gql`
  query GetProjects {
    projects {
      publicId
      name
      apiKey
      createdAt
    }
  }
`;

export default function ProjectsPage() {
  // Используем хук useQuery для запроса данных
  const { data, loading, error, refetch } = useQuery(GET_PROJECTS_QUERY);
  console.log(data)

  const handleProjectCreated = () => {
    refetch(); // Перезапрашиваем список проектов после создания нового
  };

  // Обработка состояния загрузки
  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Ваши проекты</h1>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Показываем "скелетоны" во время загрузки */}
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
        </div>
      </div>
    );
  }

  // Обработка ошибки
  if (error) {
    return <p className="text-red-500">Ошибка при загрузке проектов: {error.message}</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Ваши проекты</h1>
        <CreateProjectDialog onProjectCreated={handleProjectCreated} />
      </div>

      {/* Отображение списка проектов или сообщения об их отсутствии */}
      {data?.projects.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.projects.map((project: any) => (
            <ProjectCard key={project.publicId} project={project} />
          ))}
        </div>
      ) : (
        <div className="mt-12 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 p-12 text-center">
          <h3 className="text-xl font-medium">У вас пока нет проектов</h3>
          <p className="mt-2 text-slate-500">
            Начните с создания вашего первого проекта, чтобы получить API-ключ.
          </p>
          <div className="mt-6">
            <CreateProjectDialog onProjectCreated={handleProjectCreated} />
          </div>
        </div>
      )}
    </div>
  );
}