export const CATEGORIES = [
  {
    id: 0,
    name: 'Infrastructure',
  },
  {
    id: 1,
    name: 'Frontend',
  },
  {
    id: 2,
    name: 'Backend',
  },
  {
    id: 3,
    name: 'Testing',
  },
  {
    id: 4,
    name: 'Design',
  },
];

export const TASKS = [
  {
    id: 1,
    categoryId: 0,
    createdAt: new Date('2024-09-03T00:00:00Z'),
    description: 'Implement a CI/CD pipeline for the application',
    projectId: 'b3876ae0-bdbf-4c04-8230-85d3a6da15e9',
    status: 'done',
    title: 'Implement CI/CD',
  },
  {
    id: 2,
    categoryId: 4,
    createdAt: new Date('2024-05-03T00:00:00Z'),
    description: 'Design the homepage of the application in Figma',
    projectId: 'b3876ae0-bdbf-4c04-8230-85d3a6da15e9',
    status: 'inprogress',
    title: 'Design the homepage',
  },
  {
    id: 3,
    categoryId: 4,
    createdAt: new Date('2024-06-03T00:00:00Z'),
    description:
      'Research user personas for the application to get a better understanding of the target audience',
    projectId: 'b3876ae0-bdbf-4c04-8230-85d3a6da15e9',
    status: 'done',
    title: 'Research user personas',
  },
  {
    id: 4,
    categoryId: 1,
    createdAt: new Date('2024-07-03T00:00:00Z'),
    description:
      'Implement the homescreen of the application when the Figma design is available',
    projectId: 'b3876ae0-bdbf-4c04-8230-85d3a6da15e9',
    status: 'todo',
    title: 'Implement the homescreen',
  },
  {
    id: 5,
    categoryId: 1,
    createdAt: new Date('2024-07-03T00:00:00Z'),
    description: 'Set up the application structure using Next.js',
    projectId: 'b3876ae0-bdbf-4c04-8230-85d3a6da15e9',
    status: 'inprogress',
    title: 'Set up application structure',
  },
  {
    id: 6,
    categoryId: 1,
    createdAt: new Date('2024-07-03T00:00:00Z'),
    description:
      'Enable PWA support for the application so it can be installed on mobile devices',
    projectId: 'b3876ae0-bdbf-4c04-8230-85d3a6da15e9',
    status: 'todo',
    title: 'Enable PWA support',
  },
  {
    id: 7,
    categoryId: 2,
    createdAt: new Date('2024-07-03T00:00:00Z'),
    description: 'Implement the API for the application using ASP.NET Core',
    projectId: 'b3876ae0-bdbf-4c04-8230-85d3a6da15e9',
    status: 'inprogress',
    title: 'Implement the API',
  },
  {
    id: 8,
    categoryId: 2,
    createdAt: new Date('2024-09-03T00:00:00Z'),
    description: 'Write the documentation for the API endpoints',
    projectId: 'b3876ae0-bdbf-4c04-8230-85d3a6da15e9',
    status: 'todo',
    title: 'Write API documentation',
  },
  {
    id: 9,
    categoryId: 2,
    createdAt: new Date('2024-05-03T00:00:00Z'),
    description:
      'Create the database schema for the application, use entity-relationship diagrams to model the database schema',
    projectId: 'b3876ae0-bdbf-4c04-8230-85d3a6da15e9',
    status: 'inprogress',
    title: 'Create database schema',
  },
  {
    id: 10,
    categoryId: 3,
    createdAt: new Date('2024-09-03T00:00:00Z'),
    description: 'Test the homescreen of the application',
    projectId: 'b3876ae0-bdbf-4c04-8230-85d3a6da15e9',
    status: 'todo',
    title: 'Test the homescreen',
  },
];
