// src/projects/projects.resolver.ts
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { ProjectsService } from './projects.service';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';

@Resolver(() => Project)
export class ProjectsResolver {
  constructor(private readonly projectsService: ProjectsService) {}

  @Mutation(() => Project)
  @UseGuards(GqlAuthGuard) 
  createProject(
    @Args('createProjectInput') createProjectInput: CreateProjectDto,
    @Context() context,
  ) {
    return this.projectsService.create(createProjectInput, context.req.user.id);
  }

  @Query(() => [Project], { name: 'projects' })
  @UseGuards(GqlAuthGuard) 
  findAll(@Context() context) {
    return this.projectsService.findAllByUserId(context.req.user.id);
  }

  @Mutation(() => Project)
  @UseGuards(GqlAuthGuard) 
  updateProject(
    @Args('updateProjectInput') updateProjectInput: UpdateProjectDto,
    @Context() context,
  ) {
    return this.projectsService.update(updateProjectInput.id, updateProjectInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard) 
  deleteProject(
    @Args('id') id: string,
    @Context() context,
  ) {
    return this.projectsService.remove(id);
  }
}