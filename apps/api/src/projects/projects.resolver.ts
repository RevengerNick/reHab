// src/projects/projects.resolver.ts
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { ProjectsService } from './projects.service';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { ProjectOwnerGuard } from './guards/project-owner.guard';
import { ID } from '@nestjs/graphql';

@Resolver(() => Project)
export class ProjectsResolver {
  constructor(private readonly projectsService: ProjectsService) {}

  @Mutation(() => Project)
  @UseGuards(GqlAuthGuard)
  createProject(
    @Args('createProjectDto') createProjectDto: CreateProjectDto,
    @Context() context,
  ) {
    return this.projectsService.create(createProjectDto, context.req.user.id);
  }

  @Query(() => [Project], { name: 'projects' })
  @UseGuards(GqlAuthGuard)
  findAll(@Context() context) {
    return this.projectsService.findAllByUserId(context.req.user.id);
  }

  @Query(() => Project, { name: 'project' })
  @UseGuards(GqlAuthGuard, ProjectOwnerGuard) // Защищаем обоими гардами
  findOne(@Args('publicId', { type: () => ID }) publicId: string) {
    // ProjectOwnerGuard уже проверил владение, так что мы можем смело делать запрос.
    // Переименуем аргумент в 'projectPublicId' в DTO и гарде, чтобы все было единообразно.
    return this.projectsService.findOneByPublicId(publicId);
  }

  @Mutation(() => Project)
  @UseGuards(GqlAuthGuard)
  updateProject(
    @Args('updateProjectDto') updateProjectDto: UpdateProjectDto,
    @Context() context,
  ) {
    return this.projectsService.update(
      updateProjectDto.publicId,
      updateProjectDto,
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  deleteProject(@Args('id') id: string, @Context() context) {
    return this.projectsService.remove(id);
  }
}
