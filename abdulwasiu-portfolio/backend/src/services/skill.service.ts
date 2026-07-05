/**
 * skill.service.ts — Business Logic for Skills
 */

import { SkillModel }                      from '@models/Skill.model'
import type { SkillCategoryWithSkills }    from '@models/Skill.model'

export const SkillService = {
  /**
   * getAll — Return all skill categories with their skills nested inside.
   *
   * The model already handles the JOIN and ordering, so the service
   * here is thin — just a pass-through. But having it here means:
   *   - We can add caching later (only change this file)
   *   - Controllers never know where data comes from
   */
  async getAll(): Promise<SkillCategoryWithSkills[]> {
    return SkillModel.findAllWithCategories()
  },
}
