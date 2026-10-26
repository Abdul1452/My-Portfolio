/**
 * types/index.ts — Barrel Export for all frontend types
 *
 * Lets components import everything from one place:
 *   import type { Project, SkillCategory, ContactFormData } from '@app-types'
 */

export type { Project, PMProject, ProjectFilter } from './project.types'
export type { Skill, SkillCategory } from './skill.types'
export type { ContactFormData, ContactFormErrors, ContactFormStatus } from './contact.types'
export type { ApiResponse, ApiErrorResponse, ApiErrorCode, ValidationIssue } from './api.types'
export { ApiError } from './api.types'
