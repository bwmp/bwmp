import data from './projects.json';

export interface ProjectLink {
  name: string;
  url: string;
  icon?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  imageComponentKey?: string;
  tech?: string[];
  links?: ProjectLink[];
  featured?: boolean;
  role?: string;
  /** ISO date. Present only for projects that belong on the timeline. */
  start?: string;
  /** ISO date, or null while still ongoing. */
  end?: string | null;
}

/** A project that has a known start date, so its timeline fields are safe to read. */
export type DatedProject = Project & { start: string; end: string | null };

export const projects: Project[] = data;

/** Projects with somewhere to link to — what the portfolio grids show. */
export const portfolioProjects = projects.filter((p) => p.links?.length);
export const featuredProjects = portfolioProjects.filter((p) => p.featured);
export const otherProjects = portfolioProjects.filter((p) => !p.featured);

/** Projects with a start date — what the timeline shows, oldest first. */
export const datedProjects: DatedProject[] = projects
  .filter((p): p is DatedProject => typeof p.start === 'string')
  .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

/** Dated projects that haven't ended, newest first. */
export const activeProjects = datedProjects
  .filter((p) => p.end === null)
  .reverse();
